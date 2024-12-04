import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlGetParametrosSeccionAbasto } from 'src/settings';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionAbastoService {

  constructor(private http:HttpClient) { }

  GetParametrosSeccionAbasto():Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${urlGetParametrosSeccionAbasto}`)
  }
}
