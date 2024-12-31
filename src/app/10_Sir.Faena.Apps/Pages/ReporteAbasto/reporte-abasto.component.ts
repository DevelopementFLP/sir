
import { Component, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AbastoService } from '../../Services/AbastoService.service';
import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilities/UtilidadesService.service';
import { ListaDeLecturasDTO } from '../../Interfaces/ListaDeLecturasDTO';

import { MetodosExcelFaenaService } from '../../helpers/Metodos-Excel-Faena/metodos-excel-faena.service';
import { MetodosExcelGenericosService } from 'src/app/09_SIR.Dispositivos.Apps/Helpers/Metodos-Excel-Genericos/metodos-Excel-Genericos.service';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-reporte-abasto',
  templateUrl: './reporte-abasto.component.html',
  styleUrls: ['./reporte-abasto.component.css']
})
export class ReporteAbastoComponent {

  // Variables para el gráfico
  public chart: any;  // Esto almacenará la instancia del gráfico

  // Variables del gráfico
  public fechaDelDia: Date | null = null;
  public fechaSeleccionada: Date | null = null;

  public totalStockActual: number | null = null;
  public totalPesoEnStock: number | null = null;
  public totalRegistrosEntradas: number | null = null;
  public totalRegistrosSalidas: number | null = null

  public pesoInput: number | null = null;
  public mostrarStockActual: boolean = false;

  columnasTablaListaDeAbasto: string[] = ['fechaDeFaena', 'secuencial', 'peso', 'proveedor', 'clasificacion', 'idAnimal', 'tropa', 'fechaDeRegistro']

  //Tipos de Datos
  dataInicioListaDeAbasto: ListaDeLecturasDTO[] = [];
  dataOriginalSinFiltros:  ListaDeLecturasDTO[] = [];

  //Tabla
  dataListaDeLecturasAbasto = new MatTableDataSource(this.dataInicioListaDeAbasto);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  ngAfterViewInit(): void {
    this.dataListaDeLecturasAbasto.paginator = this.paginacionTabla;
  }

  constructor(
    private _utilidadesServicicio: UtilidadesService,
    private _lecturaDeMediaService : AbastoService,
    private _metodosDeExcelGenericoService: MetodosExcelGenericosService,
    private _metodosDeExcelService: MetodosExcelFaenaService    
  ){}

  public formatoFecha(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  public GetListaDeStockDeAbasto() {

    this.LimpiarDatosYGrafico(); 

    this._lecturaDeMediaService.GetListarStockAbasto().subscribe({
      next: (data) => {
        if (data.esCorrecto && data.resultado.length > 0) {
          this.dataListaDeLecturasAbasto.data = data.resultado;
          
          this.SumarPesosPorLinea();    
          this.GenerarGraficoSemanal();       

        } else {
          this._utilidadesServicicio.mostrarAlerta("No se encontraron Datos","Error")
        }
      },
      error: (e) => {
        console.error(e);
        this._utilidadesServicicio.mostrarAlerta(e.Message,"Error")
      }
    });    
  }    

  public SumarPesosPorLinea(): void {
    let totalStockActual = 0;  // Para las unidades de stock (entradas - salidas)
    let totalPesoEnStock = 0;  // Para el peso en stock (peso de entradas - peso de salidas)
    let totalRegistrosEntradas = 0;  // Contador de entradas del día
    let totalRegistrosSalidas = 0;   // Contador de salidas del día
    let totalPesoEntradas = 0;   // Peso total de las entradas (todo el período)
    let totalPesoSalidas = 0;    // Peso total de las salidas (todo el período)
    let totalDeUnidadesDeEntrada = 0  
    let totalDeUnidadesDeSalida = 0  
  
    const fechaHoy = new Date();
    const fechaHoyFormateada = this.formatoFecha(fechaHoy);  // Formateamos la fecha de hoy
    
    // Filtrar las entradas y salidas globalmente (no filtradas por fecha aún)
    const entradas = this.dataListaDeLecturasAbasto.data.filter(lectura =>
      lectura.operacion.toLowerCase().includes('entrada')  // Filtra las entradas
    );
  
    const salidas = this.dataListaDeLecturasAbasto.data.filter(lectura =>
      lectura.operacion.toLowerCase().includes('salida')  // Filtra las salidas
    );

    const operacionesDeSalidas = new Set(salidas.map(item => item.idAnimal));

    const stockActual = entradas.filter(item => !operacionesDeSalidas.has(item.idAnimal));
  
    // Calcular el total de registros y pesos para todas las entradas y salidas
    entradas.forEach((lectura) => {
      totalRegistrosEntradas += 1;  // Contar registros de entradas (todas)
      totalPesoEntradas += lectura.peso;  // Sumar el peso de las entradas (todo el período)
    });
  
    salidas.forEach((lectura) => {
      totalRegistrosSalidas += 1;   // Contar registros de salidas (todas)
      totalPesoSalidas += lectura.peso;  // Sumar el peso de las salidas (todo el período)
    });

    // Calcular el stock total de unidades y el peso en stock
    totalStockActual = stockActual.length;  // Solo las entradas que no tienen salidas asociadas
    totalPesoEnStock = stockActual.reduce((acc, lectura) => acc + lectura.peso, 0);  // Peso de las entradas sin salida        
  
    // Filtrar las entradas y salidas por la fecha de hoy
    entradas.forEach((lectura) => {
      if (lectura.fechaDeRegistro.includes(fechaHoyFormateada)) {
        totalDeUnidadesDeEntrada++;  // Contar solo las entradas del día
      }
    });
  
    salidas.forEach((lectura) => {
      if (lectura.fechaDeRegistro.includes(fechaHoyFormateada)) {        
        totalDeUnidadesDeSalida++;   // Contar solo las salidas del día
      }
    });
  
    // Asignar los valores calculados a las variables
    this.totalStockActual = totalStockActual;              // Stock de unidades (entradas - salidas)
    this.totalPesoEnStock = parseFloat(totalPesoEnStock.toFixed(2));  // Peso en stock (entradas - salidas)
    this.totalRegistrosEntradas = totalDeUnidadesDeEntrada;  // Entradas del día (solo entradas del día)
    this.totalRegistrosSalidas = totalDeUnidadesDeSalida;    // Salidas del día (solo salidas del día)

  }


  // Método que genera el gráfico de entradas y salidas de la semana
  public GenerarGraficoSemanal(): void {
    const entradasPorDia = new Array(7).fill(0);  // Array para almacenar entradas de cada día de la semana
    const salidasPorDia = new Array(7).fill(0);  // Array para almacenar salidas de cada día de la semana

    const fechaHoy = new Date();
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(fechaHoy);
      fecha.setDate(fechaHoy.getDate() - i);  // Restamos días para obtener la semana pasada

      const fechaFormateada = this.formatoFecha(fecha);
      
      // Contar entradas y salidas de la fecha actual
      this.dataListaDeLecturasAbasto.data.forEach((lectura) => {
        if (lectura.fechaDeRegistro.includes(fechaFormateada)) {
          if (lectura.operacion.toLowerCase().includes('entrada')) {
            entradasPorDia[i]++;
          } else if (lectura.operacion.toLowerCase().includes('salida')) {
            salidasPorDia[i]++;
          }
        }
      });
    }

    // Crear el gráfico utilizando Chart.js
    this.chart = new Chart('canvas', {
      type: 'bar',  // Tipo de gráfico
      data: {
        labels: ['Hoy', 'Ayer', '2 días', '3 días', '4 días', '5 días', '6 días'],  // Etiquetas de los días
        datasets: [
          {
            label: 'Entradas',
            data: entradasPorDia,  // Datos de entradas
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Salidas',
            data: salidasPorDia,  // Datos de salidas
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Días de la Semana'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Unidades'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  // Método que limpia los datos y el gráfico antes de realizar una nueva consulta
  public LimpiarDatosYGrafico(): void {
    // Limpiar los datos del gráfico
    if (this.chart) {
      this.chart.destroy();  // Destruir el gráfico actual
      this.chart = null;     // Limpiar la instancia del gráfico
    }

    // Limpiar las variables relacionadas con los datos
    this.totalStockActual = null;
    this.totalPesoEnStock = null;
    this.totalRegistrosEntradas = null;
    this.totalRegistrosSalidas = null;
    
    // Limpiar los datos de la tabla
    this.dataListaDeLecturasAbasto.data = [];
    this.dataOriginalSinFiltros = [];
  }
  
  
  

  //Orden de columnas en excel
  customHeaders: string[] = [
    'Fecha Faena',
    'Secuencial',
    'Peso',
    'Proveedor',
    'Clasificacion',
    'Id Animal',
    'Tropa',
    'Fecha de Registro',
  ];


  // Mapea los encabezados a los nombres de las columnas originales para moverlos como quiera
  columnMapping: { [key: string]: string } = {
    'Fecha Faena': 'fechaDeFaena',
    'Secuencial': 'secuencial',
    'Peso': 'peso',
    'Proveedor': 'proveedor',
    'Clasificacion': 'clasificacion',
    'Id Animal': 'idAnimal',
    'Tropa': 'tropa',
    'Fecha de Registro': 'fechaDeRegistro',
  };


  public async exportarAExcel(): Promise<void> {

    const workbookAbasto = new ExcelJS.Workbook();
    const worksheetStockActual = workbookAbasto.addWorksheet('Stock Actual');
    const WorksheetEntradas = workbookAbasto.addWorksheet('Entradas Abasto');
    const WorksheetSalidas = workbookAbasto.addWorksheet('Salidas Abasto');


    const startRow = 5; // Fila donde comienzan los datos
    const startColumn = 2; // Columna B es la columna 2

    await this._metodosDeExcelGenericoService.InsertHederSheet(workbookAbasto, worksheetStockActual, 'Stock Actual', 'B2', 'M4')
    await this._metodosDeExcelGenericoService.InsertHederSheet(workbookAbasto, WorksheetEntradas, 'Entradas de Abasto', 'B2', 'M4')
    await this._metodosDeExcelGenericoService.InsertHederSheet(workbookAbasto, WorksheetSalidas, 'Salidas de Abasto', 'B2', 'M4')

    const fechaSeleccionadaStr = this.fechaSeleccionada ? this.fechaSeleccionada.toISOString().split('T')[0] : null;

    // Filtrar las entradas y salidas globalmente (no filtradas por fecha aún)
    const entradas = this.dataListaDeLecturasAbasto.data.filter(lectura =>
      lectura.operacion.toLowerCase().includes('entrada')  // Filtra las entradas
    );
  
    const salidas = this.dataListaDeLecturasAbasto.data.filter(lectura =>
      lectura.operacion.toLowerCase().includes('salida')  // Filtra las salidas
    );

    const operacionesDeSalidas = new Set(salidas.map(item => item.idAnimal));

    const stockActual = entradas.filter(item => !operacionesDeSalidas.has(item.idAnimal));

    const entradasConFecha = entradas.filter(item => item.fechaDeRegistro === fechaSeleccionadaStr);
    const salidasConFecha = salidas.filter(item => item.fechaDeRegistro === fechaSeleccionadaStr);

    // Agregar encabezados de columna
    this.customHeaders.forEach((header, index) => {
      worksheetStockActual.getCell(startRow, startColumn + index).value = header;
      WorksheetEntradas.getCell(startRow, startColumn + index).value = header;
      WorksheetSalidas.getCell(startRow, startColumn + index).value = header;
    });

    // Agregar datos a la hoja de Reporte de Abasto
    stockActual.forEach((item, rowIndex) => {
      const row = this.customHeaders.map(header => item[this.columnMapping[header] as keyof ListaDeLecturasDTO] || '');
      row.forEach((value, colIndex) => {
        worksheetStockActual.getCell(startRow + 1 + rowIndex, startColumn + colIndex).value = value;
      });
    });

    // Agregar datos a la hoja de Entradas
    entradasConFecha.forEach((item, rowIndex) => {
      const row = this.customHeaders.map(header => item[this.columnMapping[header] as keyof ListaDeLecturasDTO] || '');
      row.forEach((value, colIndex) => {
        WorksheetEntradas.getCell(startRow + 1 + rowIndex, startColumn + colIndex).value = value;
      });
    });

    // Agregar datos a la hoja de Salidas
    salidasConFecha.forEach((item, rowIndex) => {
      const row = this.customHeaders.map(header => item[this.columnMapping[header] as keyof ListaDeLecturasDTO] || '');
      row.forEach((value, colIndex) => {
        WorksheetSalidas.getCell(startRow + 1 + rowIndex, startColumn + colIndex).value = value;
      });
    });

    this.EncabezadoDeTabla(worksheetStockActual, "K5", "L5", "Resumen por Clasificacion")
    this.EncabezadoDeTabla(WorksheetEntradas, "K5", "L5", "Resumen por Clasificacion")
    this.EncabezadoDeTabla(WorksheetSalidas, "K5", "L5", "Resumen por Clasificacion")

    //Crear la tabla con los datos
    if(stockActual.length > 0){
      this._metodosDeExcelService.CreatTablasDeContenido("sumaDePesosPorClasificacion", "K6", worksheetStockActual, "Clasificacion", "Suma de Pesos", this.SumaDePesosPorClasificacion(stockActual))
    }
    if(entradasConFecha.length > 0){
      this._metodosDeExcelService.CreatTablasDeContenido("sumaDePesosPorEntradas", "K6", WorksheetEntradas, "Clasificacion", "Suma de Pesos", this.SumaDePesosPorClasificacion(entradasConFecha))
    }
    if(salidasConFecha.length > 0){
      this._metodosDeExcelService.CreatTablasDeContenido("sumaDePesosPorSalidas", "K6", WorksheetSalidas, "Clasificacion", "Suma de Pesos", this.SumaDePesosPorClasificacion(salidasConFecha))      
    }
    
    //Estilos de Encabezados
    this.AgregarEstilosEncabezados(worksheetStockActual, startRow)
    this.AgregarEstilosEncabezados(WorksheetEntradas, startRow)
    this.AgregarEstilosEncabezados(WorksheetSalidas, startRow)

    //Anchos de encabezados por Hojas
    this.AjustarAnchoDeLasColumnas(worksheetStockActual, 2, 18)
    this.AjustarAnchoDeLasColumnas(worksheetStockActual, 3, 17)
    this.AjustarAnchoDeLasColumnas(worksheetStockActual, 4, 12)
    this.AjustarAnchoDeLasColumnas(worksheetStockActual, 5, 28)
    this.AjustarAnchoDeLasColumnas(worksheetStockActual, 6, 20)
    this.AjustarAnchoDeLasColumnas(worksheetStockActual, 7, 15)
    this.AjustarAnchoDeLasColumnas(worksheetStockActual, 8, 10)
    this.AjustarAnchoDeLasColumnas(worksheetStockActual, 9, 28)
    this.AjustarAnchoDeLasColumnas(worksheetStockActual, 10, 5)
    this.AjustarAnchoDeLasColumnas(worksheetStockActual, 11, 20)
    this.AjustarAnchoDeLasColumnas(worksheetStockActual, 12, 20)
    this.AjustarAnchoDeLasColumnas(worksheetStockActual, 13, 20)

    this.AjustarAnchoDeLasColumnas(WorksheetEntradas, 2, 18)
    this.AjustarAnchoDeLasColumnas(WorksheetEntradas, 3, 17)
    this.AjustarAnchoDeLasColumnas(WorksheetEntradas, 4, 12)
    this.AjustarAnchoDeLasColumnas(WorksheetEntradas, 5, 28)
    this.AjustarAnchoDeLasColumnas(WorksheetEntradas, 6, 20)
    this.AjustarAnchoDeLasColumnas(WorksheetEntradas, 7, 15)
    this.AjustarAnchoDeLasColumnas(WorksheetEntradas, 8, 10)
    this.AjustarAnchoDeLasColumnas(WorksheetEntradas, 9, 28)
    this.AjustarAnchoDeLasColumnas(WorksheetEntradas, 10, 5)
    this.AjustarAnchoDeLasColumnas(WorksheetEntradas, 11, 20)
    this.AjustarAnchoDeLasColumnas(WorksheetEntradas, 12, 20)
    this.AjustarAnchoDeLasColumnas(WorksheetEntradas, 13, 20)

    this.AjustarAnchoDeLasColumnas(WorksheetSalidas, 2, 18)
    this.AjustarAnchoDeLasColumnas(WorksheetSalidas, 3, 17)
    this.AjustarAnchoDeLasColumnas(WorksheetSalidas, 4, 12)
    this.AjustarAnchoDeLasColumnas(WorksheetSalidas, 5, 28)
    this.AjustarAnchoDeLasColumnas(WorksheetSalidas, 6, 20)
    this.AjustarAnchoDeLasColumnas(WorksheetSalidas, 7, 15)
    this.AjustarAnchoDeLasColumnas(WorksheetSalidas, 8, 10)
    this.AjustarAnchoDeLasColumnas(WorksheetSalidas, 9, 28)
    this.AjustarAnchoDeLasColumnas(WorksheetSalidas, 10, 5)
    this.AjustarAnchoDeLasColumnas(WorksheetSalidas, 11, 20)
    this.AjustarAnchoDeLasColumnas(WorksheetSalidas, 12, 20)
    this.AjustarAnchoDeLasColumnas(WorksheetSalidas, 13, 20)

    const fechaActual = new Date();
    const horaActual = fechaActual.getHours() + ':' + fechaActual.getMinutes() + ':' + fechaActual.getSeconds();

    // Guardar el archivo
    const buffer = await workbookAbasto.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Reporte_Abasto ' + horaActual + '.xlsx');
  }

  public SumaDePesosPorClasificacion(listaDeDatos: ListaDeLecturasDTO[]): { [key: string]: { totalPeso: number, totalUnidades: number } } {
    const sumaPorClasificacion: { [key: string]: { totalPeso: number, totalUnidades: number } } = {};
  
    listaDeDatos.forEach(lectura => {
      if (lectura.clasificacion && !isNaN(lectura.peso)) {
        const clasificacionPrimeraPalabra = lectura.clasificacion.split(' ')[0];

        if (!sumaPorClasificacion[clasificacionPrimeraPalabra]) {
          sumaPorClasificacion[clasificacionPrimeraPalabra] = { totalPeso: 0, totalUnidades: 0 };
        }
  
        sumaPorClasificacion[clasificacionPrimeraPalabra].totalPeso += lectura.peso;
        sumaPorClasificacion[clasificacionPrimeraPalabra].totalUnidades += 1;
      }
    });
  
    return sumaPorClasificacion;
  }
  


  public AgregarEstilosEncabezados(workSheet : ExcelJS.Worksheet, row: number){
    workSheet.getRow(row).font = {
      size: 16,
      name: 'Cambria', 
      bold: true,
    }
  }

  public AjustarAnchoDeLasColumnas(workSheet : ExcelJS.Worksheet, column: number ,broad: number){

    workSheet.getColumn(column).width = broad;

  }

  public EncabezadoDeTabla(workSheet : ExcelJS.Worksheet, cellStart: string, cellEnd: string, titleTable: string){
    workSheet.mergeCells(cellStart + ':' + cellEnd);
    workSheet.getCell('K5').value = titleTable
  }

}
  
