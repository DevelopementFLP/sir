import { Component, ViewChild, Input, OnChanges, Output } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { LecturasService } from 'src/app/09_SIR.Dispositivos.Apps/Services/LecturasService.service';
import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilities/UtilidadesService.service';

import { LecturaConErrorDTO } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/LecturaConErrorDTO';
import { ModalCajaConErrorComponent } from 'src/app/09_SIR.Dispositivos.Apps/modales/modal-caja-con-error/modal-caja-con-error.component';
import { MetodosExcelGenericosService } from 'src/app/09_SIR.Dispositivos.Apps/Helpers/Metodos-Excel-Genericos/metodos-Excel-Genericos.service';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-lecturas-con-error',
  templateUrl: './lecturas-con-error.component.html',
  styleUrls: ['./lecturas-con-error.component.css']
})
export class LecturasConErrorComponent {
  
  public idInput: string = '';
  columnasTablaCajasConError: string[] = ['idCaja', 'idQr', 'codigo', 'nombre', 'peso', 'cl', 'registro', 'estado', 'fechaDeCreado' ];
  dataListaDeCajasConError: LecturaConErrorDTO[] = []; 

  @ViewChild('paginacionTablaLecturas', { static: false }) paginacionTablaLecturasConError! : MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _utilidadesServicicio: UtilidadesService,
    private _lecturaDispositivoServices : LecturasService,
    private _metodosExcelGenericosService: MetodosExcelGenericosService,
  ){}

  ngOnInit(): void {
    this.obtenerLecturaDeCajaConError();
  }

  //Lista de Lecturas
  public obtenerLecturaDeCajaConError(){

      this._lecturaDispositivoServices.getLecturasConError().subscribe({
        next: (data) => {
          if (data.esCorrecto) {
            this.dataListaDeCajasConError = data.resultado;            
           
          } else {
            this._utilidadesServicicio.mostrarAlerta("No se encontraron ","Datos")
          }
        },
        error: (e) => {
          console.error(e);
        }
      });
  }

  public VerMovimientosDecajas(idCaja: string): void {
    const dialogRef =this.dialog.open(ModalCajaConErrorComponent, { 
      disableClose: true,
      data: { idCaja }
    });
     // Ejecutar el método obtenerLecturas cuando el modal este abierto
     dialogRef.afterOpened().subscribe(() => {
      const modalComponent = dialogRef.componentInstance as ModalCajaConErrorComponent;
      modalComponent.obtenerLecturas();
      modalComponent.obtenerLecturaDispositivosExpo();
    });
  }
  
  //Orden de columnas en excel
  customHeaders: string[] = [
    'Id Caja',
    'Id QR',
    'Codigo',
    'Nombre',
    'Peso',
    'CL',
    'Registro',
    'Estado',
    'Fecha De Creado',
  ];

  columnMapping: { [key: string]: string } = {
    'Id Caja': 'idCaja',
    'Id QR': 'idQr',
    'Codigo': 'codigo' ,
    'Nombre': 'nombre',
    'Peso': 'peso',
    'CL': 'cl',
    'Registro': 'registro',
    'Estado': 'estado',
    'Fecha De Creado': 'fechaDeCreado',
  };


  public async generarReporteExel(){
    const workbookLecturasConError = new ExcelJS.Workbook();
    const worksheetLecturas = workbookLecturasConError.addWorksheet('Lecturas Con Error');
    const contenidoDeExcel = this.dataListaDeCajasConError;

    const startRow = 5;
    const startColumn = 2; 

    // Agregar encabezados de columna
    this.customHeaders.forEach((header, index) => {
      worksheetLecturas.getCell(startRow, startColumn + index).value = header;
    });


     contenidoDeExcel.forEach((item, rowIndex) => {
      const row = this.customHeaders.map(header => item[this.columnMapping[header] as keyof LecturaConErrorDTO] || '');
      row.forEach((value, colIndex) => {
        worksheetLecturas.getCell(startRow + 1 + rowIndex, startColumn + colIndex).value = value;
      });
    });

    this._metodosExcelGenericosService.AdjustColumnWidths(worksheetLecturas);
    await this._metodosExcelGenericosService.InsertHederSheet(workbookLecturasConError, worksheetLecturas, 'Lectura de Cajas Con Error' , 'B2', 'M4');
    
    worksheetLecturas.getRow(startRow).font = {
      size: 16,
      name: 'Cambria', 
      bold: true,
    }

    const fechaActual = new Date();
    const horaActual = fechaActual.getHours() + ':' + fechaActual.getMinutes() + ':' + fechaActual.getSeconds();

    // Guardar el archivo
    const buffer = await workbookLecturasConError.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Reporte_Cajas_Con_Error ' + horaActual + '.xlsx');
  }
}
