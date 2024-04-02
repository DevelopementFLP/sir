import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


import { urlUsuarios, urlUsuarioPorNombre, urlEnviarEmail, urlCambiarContrasenia } from '../../settings';
import { Usuario } from './models/usuario.interface';
import { Observable } from 'rxjs';
import { HaciendaAnimal } from '../shared/models/gecos/haciendaAnimales.interface';

@Injectable({
  providedIn: 'root'
})
export class ControlUsuariosService {

  constructor(private http: HttpClient) { }

  usuarioRes: Usuario[] = [];

  public obtenerTodosLosUsuarios() {
    this.http.get(urlUsuarios).subscribe();
  }

  public obtenerUsuarioPorNombre(nombre: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(urlUsuarioPorNombre.replace("nombreUsuario", nombre));
  }

  public cambiarContrasenia(nueva: string, idUsuario: number): Observable<any[]> {
    return this.http.patch<any[]>(`${urlCambiarContrasenia}?contrasenia=${nueva}&id=${idUsuario}`, {});
  }

  public enviarEmail():void {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', '*/*');

    const options = {
      headers: headers,
      params: new HttpParams().append('hola', 'hola')
    }

    const data = {
      de: 'correo_remitente@example.com',
      para: ['correo_destinatario@example.com'],
      asunto: 'Asunto del correo',
      cuerpo: 'Contenido del correo'
    };


    this.http.post(urlEnviarEmail, data, options).subscribe(response => {
      console.log(response)
    }, 
      error => {
    });
  }



}
