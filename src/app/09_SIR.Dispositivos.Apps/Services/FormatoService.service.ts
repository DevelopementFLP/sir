import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlCreateFormatoDisp, urlDeleteFormatoDisp, urlGetFormatoDisp, urlUpdateFormatoDisp } from 'src/settings';
import { ApiResponse } from '../Interfaces/response-API';
import { FormatoDispositivoDTO } from '../Interfaces/FormatosDTO';



@Injectable({
  providedIn: 'root'
})
export class FormatoService {

  constructor(private http:HttpClient) { }

  getFormatoDispositivo():Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${urlGetFormatoDisp}`)
  } 

  createFormatoDispositivo(request: FormatoDispositivoDTO):Observable<ApiResponse>{
    return this.http.post<ApiResponse>(`${urlCreateFormatoDisp}`,request)
  }

  editFormatoDispositivo(request: FormatoDispositivoDTO):Observable<ApiResponse>{
    return this.http.put<ApiResponse>(`${urlUpdateFormatoDisp}`,request)
  }

  deleteFormatoDispositivo(id: number):Observable<ApiResponse>{
    return this.http.delete<ApiResponse>(`${urlDeleteFormatoDisp}/${id}`)
  }  
}
