import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlCreateUbicacionDisp, urlDeleteUbicacionDisp, urlGetUbicacionesDisp, urlUpdateUbicacionDisp } from 'src/settings';
import { ApiResponse } from '../Interfaces/response-API';
import { UbicacionDispositivoDTO } from '../Interfaces/UbicacionDispositivoDTO';



@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {

  constructor(private http:HttpClient) { }

  getUbicacionDispositivo():Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${urlGetUbicacionesDisp}`)
  } 

  createUbicacionDispositivo(request: UbicacionDispositivoDTO):Observable<ApiResponse>{
    return this.http.post<ApiResponse>(`${urlCreateUbicacionDisp}`,request)
  }

  editUbicacionDispositivo(request: UbicacionDispositivoDTO):Observable<ApiResponse>{
    return this.http.put<ApiResponse>(`${urlUpdateUbicacionDisp}`,request)
  }

  deleteUbicacionDispositivo(id: number):Observable<ApiResponse>{
    return this.http.delete<ApiResponse>(`${urlDeleteUbicacionDisp}/${id}`)
  }
}
