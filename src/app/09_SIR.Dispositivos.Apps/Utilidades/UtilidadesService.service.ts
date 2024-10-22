import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor(private _snackBar:MatSnackBar) { }

  mostrarAlerta(mensaje:string, tipo:string){

    this._snackBar.open(mensaje,tipo , {
      horizontalPosition:"center",
      verticalPosition:"bottom",
      duration:3000
    })
  }
}
