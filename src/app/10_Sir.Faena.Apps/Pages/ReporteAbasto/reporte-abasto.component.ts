import { Data } from '@angular/router';
import { Workbook } from 'exceljs';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AbastoService } from '../../Services/AbastoService.service';
import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilidades/UtilidadesService.service';
import { ListaDeLecturasDTO } from '../../Interfaces/ListaDeLecturasDTO';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-reporte-abasto',
  templateUrl: './reporte-abasto.component.html',
  styleUrls: ['./reporte-abasto.component.css']
})
export class ReporteAbastoComponent {

  public fechaDelDia: Date | null = null;
  public totalDePesos: number | null = null;
  public totalLecturas: number | null = null;
  public totalRegistrosSinEtiqueta: number | null = null;
  public totalRegistrosEtiquetados: number | null = null
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
    private http: HttpClient
  ){}

  formatoFecha(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  GetListaDeLecturasAbasto(fechaDelDia: Date | null) {
      
      if(fechaDelDia){
      const fecha = this.formatoFecha(fechaDelDia);
      this._lecturaDeMediaService.GetVistaLecturasDeAbasto(fecha).subscribe({
        next: (data) => {
          if (data.esCorrecto && data.resultado.length > 0) {
            this.dataListaDeLecturasAbasto.data = data.resultado;
            this.dataOriginalSinFiltros = data.resultado;

            this.stockActualEnCamara();           
            this.totalLecturas = data.resultado.length;

          } else {
            this._utilidadesServicicio.mostrarAlerta("No se encontraron ","Datos")
          }
        },
        error: (e) => {
          console.error(e);
        }
      });
      }else{
        this._utilidadesServicicio.mostrarAlerta("Seleccione una Fecha ","Error")
      }      
    }    

    stockActualEnCamara() {
      if (this.mostrarStockActual) {
        
        // filtro 2 tablas con las entradas y salidas
        const entradas = this.dataOriginalSinFiltros.filter(item => item.operacion.includes("Entrada"));
        const salidas = this.dataOriginalSinFiltros.filter(item => item.operacion.includes("Salida"));

        // me quedo con los id de las salidas
        const idDeSalidas = new Set(salidas.map(item => item.idAnimal));
    
        // filtro las entradas que no tienen salidas por los ID
        const entradasSinSalida = entradas.filter(item => !idDeSalidas.has(item.idAnimal));
    
        this.dataListaDeLecturasAbasto.data = entradasSinSalida;
      } else {
        // Restablece los datos originales si el checkbox está desmarcado
        this.dataListaDeLecturasAbasto.data = [...this.dataOriginalSinFiltros];
      }
      this.sumarPesosPorLinea();
    }

    sumarPesosPorLinea(): void {
        let totalPesos = 0;
        let totalRegistrosEtiquetados = 0;
        let totalRegistrosSinEtiqueta = 0;

        this.dataListaDeLecturasAbasto.data.forEach((lectura) => {
            totalPesos += lectura.peso;

            if(lectura.proveedor == "Manual")
            {
              totalRegistrosSinEtiqueta += 1
            }
            else
            {
              totalRegistrosEtiquetados += 1
            }
        });

        this.totalDePesos = parseFloat(totalPesos.toFixed(2));
        this.totalRegistrosEtiquetados = totalRegistrosEtiquetados;
        this.totalRegistrosSinEtiqueta = totalRegistrosSinEtiqueta;
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


async exportarAExcel(): Promise<void> {
    const workbookAbasto = new ExcelJS.Workbook();
    const worksheetAbasto = workbookAbasto.addWorksheet('Stock Actual');
    const WorksheetEntradas = workbookAbasto.addWorksheet('Entradas Abasto');
    const WorksheetSalidas = workbookAbasto.addWorksheet('Salidas Abasto');

    const startRow = 3; // Fila donde comienzan los datos
    const startColumn = 2; // Columna B es la columna 2
    // Filtrar y agregar datos a las hojas correspondientes
    const listaTotal = this.dataListaDeLecturasAbasto.data;
    const entradas = listaTotal.filter(item => item.operacion.includes('Entrada'));
    const salidas = listaTotal.filter(item => item.operacion.includes('Salida'));

    // me quedo con los id de las salidas
    const idDeSalidas = new Set(salidas.map(item => item.idAnimal));    
    // filtro las entradas que no tienen salidas por los ID
    const stockActual = entradas.filter(item => !idDeSalidas.has(item.idAnimal));


    // Agregar encabezado      
    worksheetAbasto.mergeCells('B1:I2'); // Combina las celdas
    const textoDeEncabezadoNQF = worksheetAbasto.getCell('B1');
    textoDeEncabezadoNQF.value = 'REPORTE ABASTO';
    textoDeEncabezadoNQF.alignment = { horizontal: 'center', vertical: 'middle' };
    textoDeEncabezadoNQF.font = { bold: true, italic: true };
    textoDeEncabezadoNQF.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Agregar encabezado Hoja de Entrada      
    WorksheetEntradas.mergeCells('B1:I2'); // Combina las celdas
    const textoDeEncabezadoEntradas = WorksheetEntradas.getCell('B1');
    textoDeEncabezadoEntradas.value = 'Entradas al Abasto';
    textoDeEncabezadoEntradas.alignment = { horizontal: 'center', vertical: 'middle' };
    textoDeEncabezadoEntradas.font = { bold: true, italic: true };
    textoDeEncabezadoEntradas.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Agregar encabezado Hoja de Salida      
    WorksheetSalidas.mergeCells('B1:I2'); // Combina las celdas
    const textoDeEncabezadoSalidas = WorksheetSalidas.getCell('B1');
    textoDeEncabezadoSalidas.value = 'Salidas al Abasto';
    textoDeEncabezadoSalidas.alignment = { horizontal: 'center', vertical: 'middle' };
    textoDeEncabezadoSalidas.font = { bold: true, italic: true };
    textoDeEncabezadoSalidas.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Agregar encabezados de columna
    this.customHeaders.forEach((header, index) => {
      worksheetAbasto.getCell(startRow, startColumn + index).value = header;
      WorksheetEntradas.getCell(startRow, startColumn + index).value = header;
      WorksheetSalidas.getCell(startRow, startColumn + index).value = header;
    });


    // Agregar datos a la hoja de Reporte de Abasto
    stockActual.forEach((item, rowIndex) => {
      const row = this.customHeaders.map(header => item[this.columnMapping[header] as keyof ListaDeLecturasDTO] || '');
      row.forEach((value, colIndex) => {
        worksheetAbasto.getCell(startRow + 1 + rowIndex, startColumn + colIndex).value = value;
      });
    });

    // Agregar datos a la hoja de Entradas
    entradas.forEach((item, rowIndex) => {
      const row = this.customHeaders.map(header => item[this.columnMapping[header] as keyof ListaDeLecturasDTO] || '');
      row.forEach((value, colIndex) => {
        WorksheetEntradas.getCell(startRow + 1 + rowIndex, startColumn + colIndex).value = value;
      });
    });

    // Agregar datos a la hoja de Salidas
    salidas.forEach((item, rowIndex) => {
      const row = this.customHeaders.map(header => item[this.columnMapping[header] as keyof ListaDeLecturasDTO] || '');
      row.forEach((value, colIndex) => {
        WorksheetSalidas.getCell(startRow + 1 + rowIndex, startColumn + colIndex).value = value;
      });
    });
    
   
    worksheetAbasto.getCell('J3').value = 'Suma de Pesos por Proveedor';
    worksheetAbasto.getCell('J3').font = { bold: true };

    this.CreatTablasDeContenido("sumaDePesosPorClasificacion", "J4", worksheetAbasto, "Clasificacion", "Suma de Pesos", this.SumaDePesosPorClasificacion(stockActual))
    this.CreatTablasDeContenido("sumaDePesosPorEntradas", "J4", WorksheetEntradas, "Clasificacion", "Suma de Pesos", this.SumaDePesosPorClasificacion(entradas))
    this.CreatTablasDeContenido("sumaDePesosPorSalidas", "J4", WorksheetSalidas, "Clasificacion", "Suma de Pesos", this.SumaDePesosPorClasificacion(salidas))


    // Ajustar el ancho de las columnas para cada hoja
    this.AdjustColumnWidths(worksheetAbasto);
    this.AdjustColumnWidths(WorksheetEntradas);
    this.AdjustColumnWidths(WorksheetSalidas);    

    // Insertar el logo en todas las hojas
    await this.InsertarLogoEnLasHojas(workbookAbasto, worksheetAbasto);
    await this.InsertarLogoEnLasHojas(workbookAbasto, WorksheetEntradas);
    await this.InsertarLogoEnLasHojas(workbookAbasto, WorksheetSalidas);
 
    const fechaActual = new Date();
    const horaActual = fechaActual.getHours() + ':' + fechaActual.getMinutes() + ':' + fechaActual.getSeconds();

    // Guardar el archivo
    const buffer = await workbookAbasto.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Reporte_Abasto ' + horaActual + '.xlsx');
  }

  SumaDePesosPorClasificacion(listaDeDatos: ListaDeLecturasDTO[]): { [key: string]: number } {
    const sumaPorClasificacion: { [key: string]: number } = {};
    listaDeDatos.forEach(lectura => {
      if (lectura.clasificacion && !isNaN(lectura.peso)) {
        if (!sumaPorClasificacion[lectura.clasificacion]) {
          sumaPorClasificacion[lectura.clasificacion] = 0;
        }
        sumaPorClasificacion[lectura.clasificacion] += lectura.peso;
      }
    });
    return sumaPorClasificacion;
  }

  CreatTablasDeContenido(nombreDeTabla: string, celdaDeInicio: string, sheet: ExcelJS.Worksheet, nombreDeColumna1: string, nombreDeColumna2: string, sumaPorClasificacion: { [key: string]: number }): void {
    // Definir la tabla
    sheet.addTable({
      name: nombreDeTabla,
      ref: celdaDeInicio, 
      headerRow: true,
      totalsRow: true, 
      style: {
        theme: 'TableStyleDark3',
        showRowStripes: true,
      },
      columns: [
        { name: nombreDeColumna1, filterButton: true },
        { name: nombreDeColumna2, filterButton: false },
      ],
      rows: Object.keys(sumaPorClasificacion).map(clasificacion => [clasificacion, sumaPorClasificacion[clasificacion]]),
    });
  }

  //Metodo para Insertar el logo en las hojas
  async InsertarLogoEnLasHojas(Workbook: ExcelJS.Workbook, sheet: ExcelJS.Worksheet) {
    try {
      sheet.mergeCells('A1:A3'); 
      sheet.getColumn('A').width = 20; 

      const logoUrl = 'assets/images/logo_relleno_azul.png'; // Ruta del logo
      const imageBuffer = await this.http.get(logoUrl, { responseType: 'arraybuffer' }).toPromise();
  
      // Agregar la imagen al libro de trabajo
      const imageId = Workbook.addImage({
        buffer: imageBuffer,
        extension: 'png',
      });             
  
      // Insertar la imagen en la celda A1
      sheet.addImage(imageId, {
        tl: { col: 0, row: 0 }, // Coordenadas de la esquina superior izquierda
        ext: { width: 130, height: 55 }, // Tamaño de la imagen
        editAs: 'oneCell'
      });
  
    } catch (error) {
      console.error('Error al insertar el logo:', error);
    }
  }


  //Metodo para ajustar el ancho de las columnas
  AdjustColumnWidths(sheet: ExcelJS.Worksheet) {
    try {
      sheet.columns.forEach(column => {
        let maxLength = 10; // Longitud mínima de las celdas
        column.eachCell!({ includeEmpty: true }, cell => {
          const cellLength = cell.value ? cell.value.toString().length : 0;
          if (cellLength > maxLength) {
            maxLength = cellLength;
          }
        });
        column.width = maxLength + 2; // Agregar un poco de espacio extra
      });      
    } catch (error) {
      console.error('Error al ajustar las columnas:', error);
    }    
  }
}
  
