import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { urlGetListaDeIncidentes } from 'src/settings';

@Injectable({
  providedIn: 'root'
})
export class IncidentesControlDeCalidadService {

  constructor(
    private http: HttpClient
  ) { }

  public GetListaDeTipoDeIncidente(fechaDelDia: string):Observable<ApiResponse>{

    const params = new HttpParams().set('fechaDelDia', fechaDelDia);

    return this.http.get<ApiResponse>(`${urlGetListaDeIncidentes}`, { params })
  } 

}
