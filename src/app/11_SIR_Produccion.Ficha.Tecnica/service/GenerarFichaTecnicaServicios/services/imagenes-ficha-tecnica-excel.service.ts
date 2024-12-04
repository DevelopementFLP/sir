import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class ImagenesFichaTecnicaExcelService {

  constructor() { }

  public async asAgregarImagenes(workbook: ExcelJS.Workbook, routeTheImage: string) {
    // Cargar la imagen
    const imageId = workbook.addImage({
      filename: 'logo_ficha_tecnica_1.png', // El nombre del archivo
      extension: 'png', // La extensión
      buffer: await this.loadImage(routeTheImage) // Cargar la imagen
    });
  }

  private async loadImage(url: string): Promise<Buffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer); // Convierte el ArrayBuffer a Buffer
  }
}
