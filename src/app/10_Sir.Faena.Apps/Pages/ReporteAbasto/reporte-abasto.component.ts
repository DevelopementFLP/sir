
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
      
      this._lecturaDeMediaService.GetListarStockAbasto().subscribe({
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
          this._utilidadesServicicio.mostrarAlerta(e.Message,"Error")
        }
      });    
    }    

    public stockActualEnCamara() {
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

    public sumarPesosPorLinea(): void {
        let totalPesos = 0;
        let totalRegistrosEtiquetados = 0;
        let totalRegistrosSinEtiqueta = 0;

        this.dataListaDeLecturasAbasto.data.forEach((lectura) => {
            totalPesos += lectura.peso;

            if(lectura.operacion.includes("Manual"))
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

    // Filtrar y agregar datos a las hojas correspondientes
    const listaTotal = this.dataListaDeLecturasAbasto.data;
    const entradas = listaTotal.filter(item => item.operacion.includes('Entrada'));
    const salidas = listaTotal.filter(item => item.operacion.includes('Salida'));

    // Me quedo con los id de las salidas
    const idDeSalidas = new Set(salidas.map(item => item.idAnimal));    
    // filtro las entradas que no tienen salidas por los ID
    const stockActual = entradas.filter(item => !idDeSalidas.has(item.idAnimal));


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

    this.EncabezadoDeTabla(worksheetStockActual, "K5", "L5", "Resumen por Clasificacion")
    this.EncabezadoDeTabla(WorksheetEntradas, "K5", "L5", "Resumen por Clasificacion")
    this.EncabezadoDeTabla(WorksheetSalidas, "K5", "L5", "Resumen por Clasificacion")

    //Crear la tabla con los datos
    if(stockActual.length > 0){
      this._metodosDeExcelService.CreatTablasDeContenido("sumaDePesosPorClasificacion", "K6", worksheetStockActual, "Clasificacion", "Suma de Pesos", this.SumaDePesosPorClasificacion(stockActual))
    }
    if(entradas.length > 0){
      this._metodosDeExcelService.CreatTablasDeContenido("sumaDePesosPorEntradas", "K6", WorksheetEntradas, "Clasificacion", "Suma de Pesos", this.SumaDePesosPorClasificacion(entradas))
    }
    if(salidas.length > 0){
      this._metodosDeExcelService.CreatTablasDeContenido("sumaDePesosPorSalidas", "K6", WorksheetSalidas, "Clasificacion", "Suma de Pesos", this.SumaDePesosPorClasificacion(salidas))      
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
        if (!sumaPorClasificacion[lectura.clasificacion]) {
          sumaPorClasificacion[lectura.clasificacion] = { totalPeso: 0, totalUnidades: 0 };
        }
        sumaPorClasificacion[lectura.clasificacion].totalPeso += lectura.peso;
        sumaPorClasificacion[lectura.clasificacion].totalUnidades += 1; 
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
  
