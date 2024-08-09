import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlCreateTipoDisp,  urlDeleteTipoDisp, urlGetTipoDisp, urlUpdateTipoDisp } from 'src/settings';
import { ApiResponse } from '../Interfaces/response-API';
import { TipoDispositivoDTO } from '../Interfaces/TipoDispositivoDTO';

@Injectable({
  providedIn: 'root'
})
export class TiposDispositivosService {

  constructor(private http:HttpClient) { }

  getTiposDispositivo():Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${urlGetTipoDisp}`)
  } 

  createTiposDispositivo(request: TipoDispositivoDTO):Observable<ApiResponse>{
    return this.http.post<ApiResponse>(`${urlCreateTipoDisp}`,request)
  }

  editTiposDispositivo(request: TipoDispositivoDTO):Observable<ApiResponse>{
    return this.http.put<ApiResponse>(`${urlUpdateTipoDisp}`,request)
  }

  deleteTiposDispositivo(id: number):Observable<ApiResponse>{
    return this.http.delete<ApiResponse>(`${urlDeleteTipoDisp}/${id}`)
  }  
}
