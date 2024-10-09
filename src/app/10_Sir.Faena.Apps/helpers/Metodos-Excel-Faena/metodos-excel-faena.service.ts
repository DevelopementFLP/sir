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

  public CreatTablasDeContenido(nombreDeTabla: string, celdaDeInicio: string, sheet: ExcelJS.Worksheet, nombreDeColumna1: string, nombreDeColumna2: string, sumaPorClasificacion: { [key: string]: { totalPeso: number, totalUnidades: number } }): void {
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
        { name: 'Total Peso', totalsRowFunction: 'sum', filterButton: false },
        { name: 'Total Unidades', totalsRowFunction: 'sum', filterButton: false },
      ],
      rows: Object.keys(sumaPorClasificacion).map(clasificacion => [
        clasificacion,
        sumaPorClasificacion[clasificacion].totalPeso, // Peso total
        sumaPorClasificacion[clasificacion].totalUnidades // Conteo de unidades
      ]),
    });
  }
  

}
