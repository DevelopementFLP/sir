import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlGetLecturaDisp, urlGetLecturaDispExpo, urlGetListaDeCajasConError } from 'src/settings';
import { ApiResponse } from '../Interfaces/response-API';

@Injectable({
  providedIn: 'root'
})
export class LecturasService {

  constructor(private http:HttpClient) { }

  public getLecturaDeDispositivo(idCaja: string):Observable<ApiResponse>{
    let params = new HttpParams()
    .set('Id', idCaja)
    return this.http.get<ApiResponse>(`${urlGetLecturaDisp}`, { params })
  } 

  getLecturaDeDispositivoExpo(idCaja: string):Observable<ApiResponse>{
    let params = new HttpParams()
    .set('Id', idCaja)
    return this.http.get<ApiResponse>(`${urlGetLecturaDispExpo}`, { params })
  } 

  getLecturasConError():Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${urlGetListaDeCajasConError}`)
  } 
}
