import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlGetLecturaDisp, urlGetLecturaDispExpo } from 'src/settings';
import { ApiResponse } from '../Interfaces/response-API';

@Injectable({
  providedIn: 'root'
})
export class LecturasService {

  constructor(private http:HttpClient) { }

  getLecturaDeDispositivo(idCaja: string):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${urlGetLecturaDisp}/${idCaja}`)
  } 

  getLecturaDeDispositivoExpo(idCaja: string):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${urlGetLecturaDispExpo}/${idCaja}`)
  } 
}
