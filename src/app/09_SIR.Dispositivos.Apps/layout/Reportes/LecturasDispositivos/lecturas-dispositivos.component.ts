import { Component } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

//Modelos
import { LecturasDispositivoDTO } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/LecturasDispositivoDTO';

//Servicios
import { LecturasService } from 'src/app/09_SIR.Dispositivos.Apps/Services/LecturasService.service';
import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilities/UtilidadesService.service';


@Component({
  selector: 'app-lecturas-dispositivos',
  templateUrl: './lecturas-dispositivos.component.html',
  styleUrls: ['./lecturas-dispositivos.component.css']
})
export class LecturasDispositivosComponent {

  idInput: string = '';

  //Tablas
  columnasTablaLectura: string[] = ['fecha', 'dispositivo', 'ubicacion', 'lectura', 'idCaja'];
  columnasTablaLecturaExpo: string[] = ['fecha', 'dispositivo', 'ubicacion', 'lectura', 'idCaja'];

  //Tipos de Datos
  dataInicioLecturaDispositivo: LecturasDispositivoDTO[] = [];
  dataInicioLecturaDispositivoExpo: LecturasDispositivoDTO[] = [];

  //Tabla
  dataListaLecturas = new MatTableDataSource(this.dataInicioLecturaDispositivo);
  dataListaLecturasExpo = new MatTableDataSource(this.dataInicioLecturaDispositivoExpo);


  constructor(
    private _utilidadesServicicio: UtilidadesService,
    private _lecturaDispositivoServices : LecturasService
  ){}

  generarListadoDeCajas(idCaja : string)
  {
    this.obtenerLecturaDispositivos(idCaja);
    this.obtenerLecturaDispositivosExpo(idCaja);
  }


  //Lista de Lecturas
  obtenerLecturaDispositivos(idCaja : string){

    if (idCaja) {
      this._lecturaDispositivoServices.getLecturaDeDispositivo(idCaja).subscribe({
        next: (data) => {
          if (data.esCorrecto) {
            this.dataListaLecturas.data = data.resultado;
          } else {
            this._utilidadesServicicio.mostrarAlerta("No se encontraron ","Datos")
          }
        },
        error: (e) => {
          console.error(e);
        }
      });
    } else {
      this._utilidadesServicicio.mostrarAlerta("Ingrese un ID ","Error")
    }
  }

  obtenerLecturaDispositivosExpo(idCaja: string){
    if(idCaja)
      {
        this._lecturaDispositivoServices.getLecturaDeDispositivoExpo(idCaja).subscribe({
          next: (data) => {
            if(data.esCorrecto)
              {
                this.dataListaLecturasExpo.data = data.resultado;
              }else
              {
                console.log("No encontre lista");
              }
          },
          error:(e) =>{}
        })
      }else
      {
        console.log("Por favor ingrese un ID");
      }
  }
}
