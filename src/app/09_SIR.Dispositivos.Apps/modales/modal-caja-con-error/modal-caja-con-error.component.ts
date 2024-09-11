import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { LecturasDispositivoDTO } from '../../Interfaces/LecturasDispositivoDTO';
import { UtilidadesService } from '../../Utilities/UtilidadesService.service';
import { LecturasService } from '../../Services/LecturasService.service';

@Component({
  selector: 'app-modal-caja-con-error',
  templateUrl: './modal-caja-con-error.component.html',
  styleUrls: ['./modal-caja-con-error.component.css']
})
export class ModalCajaConErrorComponent {

  columnasTablaLecturas: string[] = ['fecha', 'dispositivo', 'ubicacion', 'lectura', 'idCaja'];
  columnasTablaLecturaExpo: string[] = ['fecha', 'dispositivo', 'ubicacion', 'lectura', 'idCaja'];

  dataListaLecturas = new MatTableDataSource<LecturasDispositivoDTO>();
  dataListaLecturasExpo = new MatTableDataSource<LecturasDispositivoDTO>();


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { idCaja: string },
    private _utilidadesServicicio: UtilidadesService,
    private _lecturaDispositivoServices: LecturasService
  ) {
  }

  public obtenerLecturas(): void {
    this._lecturaDispositivoServices.getLecturaDeDispositivo(this.data.idCaja).subscribe({
      next: (data) => {
        if (data.esCorrecto) {
          this.dataListaLecturas.data = data.resultado;
        } else {
          this._utilidadesServicicio.mostrarAlerta("No se encontraron", "Datos");
        }
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  obtenerLecturaDispositivosExpo(){
        this._lecturaDispositivoServices.getLecturaDeDispositivoExpo(this.data.idCaja).subscribe({
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
      }
}

