import { filter } from 'rxjs';
import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

//Modelos
import { MermaPorPesoDTO } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/MermaPorPesoDTO';

//Servicios
import { MermaPorPesoService } from 'src/app/09_SIR.Dispositivos.Apps/Services/MermaPorPesoService.service';
import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilidades/UtilidadesService.service';

import * as ExcelJS from 'exceljs';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-merma-por-peso',
  templateUrl: './merma-por-peso.component.html',
  styleUrls: ['./merma-por-peso.component.css']
})
export class MermaPorPesoComponent {

  public fechaDesde: Date | null = null;
  public fechaHasta: Date | null = null;
  public promedioPorcentajeDeMerma: number | null = null;
  public promedioDePesosFrios: number | null = null;
  public promedioDePesosCalientes: number | null = null;
  public promedioDetiquetas: number | null = null;
  public graficoDeBarras: Chart | null = null;
  public totalLecturas: number | null = null;
  public totalLecturasInnova: number | null = null;
  public totalKgPorSeleccion: number | null = null;

  public proveedoresSet = new Set<string>();
  public gradeSet = new Set<string>();
  public proveedorSelecionado: string | null = null;
  public etiquetaSeleccionada: string | null = null;


  //Tablas
  columnasTablaMermaPorPeso: string[] = ['fechaDeBalanza', 'fechaDeInnova', 'carcassID', 'ladoAnimal', 'diferenciadePeso', 'pesoInnova', 'pesoLocal', 'porsentajeDeMerma', 'porsentajePorMenudencia', 'etiqueta'];

  //Tipos de Datos
  dataInicioMermaPorPeso: MermaPorPesoDTO[] = [];

  //Tabla
  dataListaLecturasMerma = new MatTableDataSource(this.dataInicioMermaPorPeso);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;


  constructor(
    private dialog: MatDialog,
    private _utilidadesServicicio: UtilidadesService,
    private _lecturasMermaPorPesoServicio : MermaPorPesoService
  ){}

  ngAfterViewInit(): void {
    this.dataListaLecturasMerma.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaLecturasMerma.filter = filterValue.trim().toLocaleLowerCase();
  }


  //Datos de API
  obtenerLecturaMermaPorPeso(fechaDesde: Date | null){

    if (fechaDesde) {
      const fechaDesdeStr = this.formatoFechaDesde(fechaDesde);
      const fechaHastaStr = this.formatoFechaHasta(fechaDesde);

      this._lecturasMermaPorPesoServicio.getListaMermaPorPeso(fechaDesdeStr, fechaHastaStr).subscribe({
        next: (data) => {
          if (data.esCorrecto && data.resultado.length > 0) {
            this.dataListaLecturasMerma.data = data.resultado;
            this.generarGraficoPesoPorProveedor();
          } else {
            this._utilidadesServicicio.mostrarAlerta("No se encontraron ","Datos")
          }
        },
        error: (e) => {
          console.error(e);
        }
      });
    }
  }

  formatoFechaDesde(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}${month}${day} 00:00:01`;
  }

  formatoFechaHasta(baseDate: Date): string {
    //fecha basada en la fecha base
    const nextDay = new Date(baseDate);
    nextDay.setDate(baseDate.getDate() + 1); // Agregar un día
    const year = nextDay.getFullYear();
    const month = ('0' + (nextDay.getMonth() + 1)).slice(-2);
    const day = ('0' + nextDay.getDate()).slice(-2);
    return `${year}${month}${day} 23:59:59`;
}

//Orden de columnas en excel
customHeaders: string[] = [
  'Fecha de Balanza',
  'Peso Frio',
  '% de Merma',
  '% Menudencia',
  'Diferencia Peso',
  ' ',
  'Fecha E+V',
  'Peso Caliente',
  'Etiqueta',
  'CarcassID',
  'Lado Animal',
  'Tropa',
  'Proveedor'
];


// Mapea los encabezados a los nombres de las columnas originales para moverlos como quiera
columnMapping: { [key: string]: string } = {
  'Fecha de Balanza': 'fechaDeBalanza',
  'Peso Frio': 'pesoLocal',
  '% de Merma': 'porsentajeDeMerma',
  '% Menudencia': 'porsentajePorMenudencia',
  'Diferencia Peso': 'diferenciadePeso',
  'Fecha E+V': 'fechaDeInnova',
  'Peso Caliente': 'pesoInnova',
  'Etiqueta': 'etiqueta',
  'CarcassID': 'carcassID',
  'Lado Animal': 'ladoAnimal',
  'Tropa': 'tropa',
  'Proveedor': 'proveedor'
};

exportarExcel() {

  // Crear una nueva instancia de ExcelJS
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Merma por Peso');
  //var sheet = workbook.addWorksheet("hoja libre"); agregar otra hoja


  const encabezadoConvinadoNQF = worksheet.mergeCells('A1:E2'); // Combina las celdas
    const textoDeceldaConbinadaNQF = worksheet.getCell('A1');
    textoDeceldaConbinadaNQF.value = 'NQF';
    textoDeceldaConbinadaNQF.alignment = { horizontal: 'center', vertical: 'middle' };
    textoDeceldaConbinadaNQF.font = { bold: true, italic: true}
    textoDeceldaConbinadaNQF.border = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    }

  const encabezadoConbinadoEmasV = worksheet.mergeCells('G1:M2');
    const textoDeceldaConbinadaEmasV = worksheet.getCell('G1');
    textoDeceldaConbinadaEmasV.value = 'E+V Toma de Foto';
    textoDeceldaConbinadaEmasV.alignment = { horizontal: 'center', vertical: 'middle' };
    textoDeceldaConbinadaEmasV.font = { bold: true, italic: true}
    textoDeceldaConbinadaEmasV.border ={
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    }

  const headerRow = worksheet.addRow(this.customHeaders);

  // Agregar los datos
  this.dataListaLecturasMerma.data.forEach(item => {
    const row = this.customHeaders.map(header => item[this.columnMapping[header] as keyof MermaPorPesoDTO] || '');
    worksheet.addRow(row);
  });


  //Ancho de las columnas
  const columnWidths: { [key: string]: number } = {
    'Fecha de Balanza': 25,
    'Peso Frio': 15,
    '% de Merma': 16,
    '% Menudencia': 20,
    'Diferencia Peso': 20,
    'Fecha E+V': 25,
    'Peso Caliente': 20,
    'Etiqueta': 15,
    'CarcassID': 15,
    'Lado Animal': 15,
    'Tropa': 15,
    'Proveedor': 30,
  };

  worksheet.columns.forEach((column, index) => {
    const header = this.customHeaders[index];
    column.width = columnWidths[header] || 25; // Asignar ancho personalizado o 25 si no está definido
  });


  // Función para aplicar estilos a columnas específicas
  const applyColumnStyles = (nombreDeEncabezado: string, colorDeFuente: string, colorDeFondo: string) => {
    const columnIndex = this.customHeaders.indexOf(nombreDeEncabezado) + 1; // +1 porque los índices de Excel son 1-basados
    headerRow.getCell(columnIndex).font = {
      name: 'Calibri',
      size: 14,
      bold: true,
      color: { argb: colorDeFuente }
    };
    headerRow.getCell(columnIndex).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colorDeFondo }
    };

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber > 3) { // Comienza desde la fila 4
        row.getCell(columnIndex).font = {
          name: 'Calibri',
          size: 10,
          color: { argb: colorDeFuente },
          bold: true
        };
        row.getCell(columnIndex).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: colorDeFondo }
        };
      }
    });
  };

  // Aplicar estilos a las columnas específicas
  applyColumnStyles('Peso Frio', 'FF000000', 'a4ccf0');
  applyColumnStyles('Peso Caliente', 'FF000000', 'd34343');
  applyColumnStyles('% de Merma', 'f6f7f9', 'a7acb1');

  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber > 3) { // Empieza desde la fila 4
      row.eachCell({ includeEmpty: true }, (cell) => {
        if (cell.value === 'Negativo') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'f18518' } // Color de fonde de la celda
          };
        }
        else if (cell.value === 'Diferencia'){
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'c5e79e' } // Color de fondo de la celda
          };
        }
      });
    }
  });

  const fechaActual = new Date();
  const horaActual = fechaActual.getHours() + ':' + fechaActual.getMinutes() + ':' + fechaActual.getSeconds()

  // Generar el archivo Excel
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Reporte de Merma ' + horaActual
    a.click();
    window.URL.revokeObjectURL(url);
  }).catch(error => {
    this._utilidadesServicicio.mostrarAlerta("No se pudo generar el archivo:", "Error");
  });
}

//Función para obtener el peso total por proveedor
GetPesoPorProveedorGeneral(): any[] {
  // Crear un objeto para almacenar el conteo de cada proveedor
    const conteoProveedores: { [proveedor: string]: {sumaDePeso: number}} = {};

    // Recorrer los datos y contar los datos
    this.dataListaLecturasMerma.data.forEach(item => {
      if (item.proveedor) {

        // Inicializar el proveedor si no está en la lista
        if (!conteoProveedores[item.proveedor]) {
          conteoProveedores[item.proveedor] = {
            sumaDePeso: 0
          };
        }
        // Incrementar el conteo y sumar los pesos
        conteoProveedores[item.proveedor].sumaDePeso += item.pesoLocal || 0;
      }
    });

    return Object.entries(conteoProveedores).map(([proveedor, { sumaDePeso }]) => ({
      proveedor,
      sumaDePeso:  parseFloat(sumaDePeso.toFixed(2)) // Redondear a dos decimales
    }));
  }

  GetetiquetasPorProveedorFiltrado(proveedor : string): any[] {
      // Crear un objeto para almacenar el resultado
      const conteoEtiquetas: { [etiqueta: string]: {sumaDePeso: number}} = {};

      // Recorrer los datos y contar los datos
      this.dataListaLecturasMerma.data.forEach(item => {
        if (item.proveedor === proveedor) {

          // Inicializar el proveedor si no está en la lista
          if (!conteoEtiquetas[item.etiqueta]) {
              conteoEtiquetas[item.etiqueta] = {
              sumaDePeso: 0
            };
          }
          // Incrementar el conteo y sumar los pesos
          conteoEtiquetas[item.etiqueta].sumaDePeso += item.pesoLocal || 0;
        }
      });

      return Object.entries(conteoEtiquetas).map(([etiqueta, { sumaDePeso }]) => ({
        etiqueta,
        sumaDePeso:  parseFloat(sumaDePeso.toFixed(2)) // Redondear a dos decimales
      }));
    }



  //Grafica y Paneles
  generarComboBoxProveedores(){
    let comboDesplegableProveedor = this.dataListaLecturasMerma.data;

     comboDesplegableProveedor.forEach(item => {
      if (item.proveedor) {
        this.proveedoresSet.add(item.proveedor);
      }
    });
  }

  aplicarFiltroDeProveedor(proveedor: string | null) {
    this.proveedorSelecionado = proveedor;
    this.etiquetaSeleccionada = "Todos"

    if(proveedor){
      this.getEtiquetasPorProveedor(proveedor);
      this.generarGraficoPesoPorProveedor();
    }
  }

  getEtiquetasPorProveedor(proveedor: string): string[] {
    this.gradeSet.clear();

    this.dataListaLecturasMerma.data
      .filter(item => item.proveedor === proveedor)
      .forEach(item => {
        if (item.etiqueta) {
          this.gradeSet.add(item.etiqueta);
        }
      });

    return Array.from(this.gradeSet);
  }

  generarGraficoPesoPorProveedor(){

    let labels: string[] = []
    let dataPesos: number[] = [];
    let descripcionDeLabel: string = "";

    if(this.graficoDeBarras){
      this.graficoDeBarras.destroy();
    }

    let datosFiltrados = this.dataListaLecturasMerma.data;
    if (this.proveedorSelecionado) {
      datosFiltrados = datosFiltrados.filter(item => item.proveedor === this.proveedorSelecionado);
    }
    if (this.etiquetaSeleccionada) {
      datosFiltrados = datosFiltrados.filter(item => item.etiqueta === this.etiquetaSeleccionada);
    }

    //const conteoProveedores = this.obtenerPesoPorProveedor();
    if (this.proveedorSelecionado == null || this.proveedorSelecionado == "Todos") {
      const pesosPorProveedor = this.GetPesoPorProveedorGeneral();
      labels = pesosPorProveedor.map(prov => prov.proveedor);
      dataPesos  = pesosPorProveedor.map(prov => prov.sumaDePeso);
      descripcionDeLabel = "Promedio de Pesos Por Proveedor Total"
     }
     else if (this.proveedorSelecionado && this.proveedorSelecionado != "Todos") {
      const etiquetasPorProveedor = this.GetetiquetasPorProveedorFiltrado(this.proveedorSelecionado);
      labels = etiquetasPorProveedor.map(prov => prov.etiqueta);
      dataPesos = etiquetasPorProveedor.map(prov => prov.sumaDePeso);
      descripcionDeLabel = `Promedio de Pesos ${this.proveedorSelecionado}`
     }

    //Crear grafico
    this.graficoDeBarras  = new Chart('chartBarras',{
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: descripcionDeLabel,
          data: dataPesos,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive:true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })

    this.resumenDeDatos();
    this.generarComboBoxProveedores()
  }

  resumenDeDatos(): void {

    let dataFiltrada = this.dataListaLecturasMerma.data

    if (this.proveedorSelecionado && this.proveedorSelecionado != "Todos") {
      dataFiltrada = dataFiltrada.filter(item => item.proveedor === this.proveedorSelecionado);
    }

    if(this.etiquetaSeleccionada && this.etiquetaSeleccionada != "Todos")
      {
        dataFiltrada = dataFiltrada.filter(etiqueta => etiqueta.etiqueta === this.etiquetaSeleccionada);
      }

    if (dataFiltrada.length > 0) {
      // Calcular el promedio de pesoLocal
      const totalPesoFrio = dataFiltrada.reduce((sum, item) => sum + (item.pesoLocal || 0), 0);
      this.promedioDePesosFrios = totalPesoFrio / dataFiltrada.length;

      // Calcular el promedio de pesoInnova
      const totalPesoCaliente = dataFiltrada.reduce((sum, item) => sum + (item.pesoInnova || 0), 0);
      this.promedioDePesosCalientes = totalPesoCaliente / dataFiltrada.length;

      // Calcular el promedio de porsentajeDeMerma
      let operacion: number = 0;
      if(totalPesoFrio > totalPesoCaliente)
        {
        operacion  = ((totalPesoFrio - totalPesoCaliente) / totalPesoCaliente) * 100;
      }else{
        operacion  = ((totalPesoCaliente - totalPesoFrio) / totalPesoCaliente) * 100;
      }
      this.promedioPorcentajeDeMerma = operacion

      this.totalKgPorSeleccion = parseFloat(totalPesoFrio.toFixed(2));


      this.totalLecturas = dataFiltrada.filter(x => x.pesoLocal > 0).length;
      this.totalLecturasInnova = dataFiltrada.filter(x => x.pesoInnova > 0).length;

    } else {
      // Si no hay datos, asignar valores nulos a todos los promedios
      this.promedioDePesosFrios = null;
      this.promedioDePesosCalientes = null;
      this.promedioPorcentajeDeMerma = null;
    }

  }
}
