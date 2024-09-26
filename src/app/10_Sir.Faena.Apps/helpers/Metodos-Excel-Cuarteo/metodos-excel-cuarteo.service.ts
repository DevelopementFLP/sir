import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class MetodosExcelCuarteoService {

  constructor(

  ) { }

  public GenerarListaDeColumnas(listaDeString: string[]): string[]{
    return listaDeString
  }

  public CrearTablaDeContenido(
    nombreDeTabla: string,
    celdaDeInicio: string,
    sheet: ExcelJS.Worksheet,
    nombreDeColumna1: string,
    nombreDeColumna2: string,
    sumaPorClasificacion: { [key: string]: number }
  ): void {
      
      // Definir la tabla
      sheet.addTable({
      name: nombreDeTabla,
      ref: celdaDeInicio, 
      headerRow: true,
      totalsRow: true, 
      style: {
        theme: 'TableStyleDark1',
        showRowStripes: true,
      },
      columns: [
        { name: nombreDeColumna1, filterButton: true },
        { name: nombreDeColumna2,  totalsRowFunction: 'sum', filterButton: false },
      ],
      rows: Object.keys(sumaPorClasificacion).map(clasificacion => [clasificacion, sumaPorClasificacion[clasificacion]]),
    });
  }


    // Agregar encabezados de columna
    public AgregarEncabezadosDeColumnas(listaDeColumnas: string[], worckSheet: ExcelJS.Worksheet, filaDeInicio: number, columnaDeInicio: number){
      listaDeColumnas.forEach((header, index) => {
        worckSheet.getCell(filaDeInicio, columnaDeInicio + index).value = header;
      });
    }
}
