import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  enviarEmailPassword(usuario: string): void {
    let mensaje: string = `El usuario '${usuario}' ha olvidado su contraseña. Solicita una nueva.`;
    console.log(mensaje)
  }
}
