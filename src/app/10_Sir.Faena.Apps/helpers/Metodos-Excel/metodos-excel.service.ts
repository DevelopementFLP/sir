import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class MetodosExcelService {

  constructor() { }

  // async InsertarLogoEnLasHojas(Workbook: ExcelJS.Workbook, sheet: ExcelJS.Worksheet) {
  //   try {
  //     sheet.mergeCells('A1:A3'); 
  //     sheet.getColumn('A').width = 20; 

  //     const logoUrl = 'assets/images/logo_relleno_azul.png'; // Ruta del logo
  //     const imageBuffer = await this.http.get(logoUrl, { responseType: 'arraybuffer' }).toPromise();
  
  //     // Agregar la imagen al libro de trabajo
  //     const imageId = Workbook.addImage({
  //       buffer: imageBuffer,
  //       extension: 'png',
  //     });             
  
  //     // Insertar la imagen en la celda A1
  //     sheet.addImage(imageId, {
  //       tl: { col: 0, row: 0 }, // Coordenadas de la esquina superior izquierda
  //       ext: { width: 130, height: 55 }, // Tamaño de la imagen
  //       editAs: 'oneCell'
  //     });
  
  //   } catch (error) {
  //     console.error('Error al insertar el logo:', error);
  //   }
  // }

}
