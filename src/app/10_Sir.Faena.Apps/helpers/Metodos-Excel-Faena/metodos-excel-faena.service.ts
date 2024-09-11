import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class MetodosExcelFaenaService {

  constructor(
    private http: HttpClient
  ) { }

  
  public AgregarEncabezadoDeHojas(unaHoja: ExcelJS.Worksheet, encabezado: string){
       
    unaHoja.mergeCells('B1:I2'); // Combina las celdas
    const textoDeEncabezado = unaHoja.getCell('B1');
    textoDeEncabezado.value = encabezado;
    textoDeEncabezado.alignment = { horizontal: 'center', vertical: 'middle' };
    textoDeEncabezado.font = { bold: true, italic: true };
    textoDeEncabezado.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }

  public async InsertarLogoEnLasHojas(Workbook: ExcelJS.Workbook, sheet: ExcelJS.Worksheet) {
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

  public CreatTablasDeContenido(nombreDeTabla: string, celdaDeInicio: string, sheet: ExcelJS.Worksheet, nombreDeColumna1: string, nombreDeColumna2: string, sumaPorClasificacion: { [key: string]: number }): void {
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
