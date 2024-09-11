import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class MetodosExcelMermaService {

  constructor(
    private http: HttpClient
  ) { }

  public EncabezadosDeHojas(unaHoja: ExcelJS.Worksheet, encabezado: string, convinarDesde: string, convinarHasta: string, celdaDelEncabezado: string){
    unaHoja.mergeCells(convinarDesde + ':' + convinarHasta); // Combina las celdas
    const TextoDeEncabezado = unaHoja.getCell(celdaDelEncabezado);
    TextoDeEncabezado.value = encabezado;
    TextoDeEncabezado.alignment = { horizontal: 'center', vertical: 'middle' };
    TextoDeEncabezado.font = { bold: true, italic: true}
    TextoDeEncabezado.border = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    }
  }

  //Metodo para ajustar el ancho de las columnas
  public AdjustColumnWidths(sheet: ExcelJS.Worksheet) {
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
