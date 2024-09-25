import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class MetodosExcelGenericosService {

  constructor(
    private http: HttpClient
  ) { }

  //Inserta el encabezaco de la hoja
  public async InsertHederSheet(Workbook: ExcelJS.Workbook, sheet: ExcelJS.Worksheet, tituloDeEncabezado: string ,celdaDesde: string, celdaHasta: string) {
    try {
      sheet.mergeCells(celdaDesde + ':' + celdaHasta); 

      const logoUrl = 'assets/images/logos/RGB_v1-beige.png'; // Ruta del logo
      const imageBuffer = await this.http.get(logoUrl, { responseType: 'arraybuffer' }).toPromise();
  
      // Agregar la imagen al libro de trabajo
      const imageId = Workbook.addImage({
        buffer: imageBuffer,
        extension: 'png',
      });             
  

      sheet.addImage(imageId, {
        tl: { col: 1, row: 1 }, // Coordenadas de la esquina superior izquierda
        ext: { width: 130, height: 55 }, // Tamaño de la imagen
        editAs: 'oneCell'
      });

      sheet.getCell(celdaDesde).value = tituloDeEncabezado;
      sheet.getCell(celdaDesde).alignment = {vertical: 'middle', horizontal: 'right'}
      sheet.getCell(celdaDesde).font = {bold: true, size: 18, color: {argb: 'ffffffff'}};

      sheet.getCell(celdaDesde).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF373B36' }, 
      };

  
    } catch (error) {
      console.error('Error al insertar el logo:', error);
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
        column.width = maxLength + 5; // Agregar un poco de espacio extra
      });      
    } catch (error) {
      console.error('Error al ajustar las columnas:', error);
    }    
  }
}
