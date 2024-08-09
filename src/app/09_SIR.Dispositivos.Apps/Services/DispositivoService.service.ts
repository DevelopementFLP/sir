import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urlCreateDispositivo, urlDeleteDispositivos, urlGetDispositivo, urlGetDispositivoPorId, urlUpdateDispositivos } from 'src/settings';
import { ApiResponse } from '../Interfaces/response-API';
import { DispositivoDTO } from '../Interfaces/DispositivoDTO';

@Injectable({
  providedIn: 'root'
})
export class DispositivosService {
  
  constructor(private http:HttpClient) { }

  getDispositivos():Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${urlGetDispositivo}`)
  }

  getDispositivosPorId(idDispositivo : number ):Observable<ApiResponse>{

    return this.http.get<ApiResponse>(`${urlGetDispositivoPorId}/${idDispositivo}`)
  }  

  createDispositivos(request: DispositivoDTO):Observable<ApiResponse>{
    return this.http.post<ApiResponse>(`${urlCreateDispositivo}`,request)
  }

  editDispositivos(request: DispositivoDTO):Observable<ApiResponse>{
    return this.http.put<ApiResponse>(`${urlUpdateDispositivos}`,request)
  }

  deleteDispositivos(id: number):Observable<ApiResponse>{
    return this.http.delete<ApiResponse>(`${urlDeleteDispositivos}/${id}`)
  }
}
