import { Component } from '@angular/core';


import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ImagenesFichaTecnicaExcelService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/GenerarFichaTecnicaServicios/imagenes-ficha-tecnica-excel.service';

@Component({
  selector: 'component-generar-ficha-tecnica-producto',
  templateUrl: './generar-tecnica-producto.component.html',
  styleUrls: ['./generar-tecnica-producto.component.css']
})
export class FichaTecnicaProductoComponent {

  public codigoDeProducto: string = "";
  public producto: any;

  constructor(
    private _imagenesDeExcelServicio: ImagenesFichaTecnicaExcelService
  ) { }

  //! IMAGENES
  public rutaDeImagen_1: string = "assets/images/logos/logo_ficha_tecnica_1.png"
  
  

  public async GenerarFichaEnExcel(){
    const workbookFichaTecnica = new ExcelJS.Workbook();
    const worksheetFichaTecnica = workbookFichaTecnica.addWorksheet('Ficha Tecnica');

    // SECCION 1
    worksheetFichaTecnica.mergeCells("A1:A5");
    worksheetFichaTecnica.getColumn(1).width = 30;
    worksheetFichaTecnica.mergeCells("D1:D5");
    worksheetFichaTecnica.getColumn(4).width = 30;

    worksheetFichaTecnica.mergeCells("B1:C2")
    worksheetFichaTecnica.getColumn(2).width = 35;
    worksheetFichaTecnica.getColumn(3).width = 35;
    worksheetFichaTecnica.getCell("B1").value = "FRIGORIFICO LAS PIEDRAS S.A."

    worksheetFichaTecnica.mergeCells("B3:C4")
    worksheetFichaTecnica.getCell("B3").value = "RUTA 36 km 26.100  - CANELONES - URUGUAY "
    worksheetFichaTecnica.getCell("B5").value = "   Tel : (+598) 2367 7720"
    worksheetFichaTecnica.getCell("C5").value = "Website: flp.uy"




    const fechaActual = new Date();
    const horaActual = fechaActual.getHours() + ':' + fechaActual.getMinutes() + ':' + fechaActual.getSeconds();

    // Guardar el archivo
    const buffer = await workbookFichaTecnica.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Nombre Del Archivo ' + horaActual + '.xlsx');

  }
}
