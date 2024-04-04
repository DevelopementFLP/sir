import { Injectable } from '@angular/core';
import { Solicitud } from '../models/solicitud.interface';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  enviarEmailPassword(usuario: string): void {
    let mensaje: string = `El usuario '${usuario}' ha olvidado su contraseña. Solicita una nueva.`;
    console.log(mensaje)
  }

  enviarEmailNuevoUsuario(solicitud: Solicitud): Observable<boolean> {
    return of(true);
  }
}
