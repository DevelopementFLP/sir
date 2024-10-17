import { Injectable } from '@angular/core';

import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class ImagenesFichaTecnicaExcelService {

  constructor(

  ) { }

  // public async asAgregarImagenes(workbook: ExcelJS.Workbook, routeTheImage: string){

  //     // Cargar la imagen
  //     const imageId = workbook.addImage({
  //       filename: 'logo_ficha_tecnica_1.png', // El nombre del archivo
  //       extension: 'png', // La extensión
  //       // Si la imagen está en los assets, debes cargarla usando fetch o similar
  //       buffer: await this.loadImage(routeTheImage)
  //     });
  // }

}
