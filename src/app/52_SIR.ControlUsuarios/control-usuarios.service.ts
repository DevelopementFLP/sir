import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { urlUsuarios, urlUsuarioPorNombre, urlEnviarEmail, urlCambiarContrasenia } from '../../settings';
import { Usuario } from './models/usuario.interface';
import { Observable } from 'rxjs';

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


}
