import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtEspecificacionesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CrearFichaTecnicaInterface/FtEspecificacionesDTO';
import { urlCrearPlantillaEspecificacionesFichaTecnica } from 'src/settings';

@Injectable({
  providedIn: 'root'
})
export class FtEspecificacionesService {

  constructor(
    private http: HttpClient
  ) { }

  public CrearPlantillaEspecificaiones(modelo: FtEspecificacionesPlantillaDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearPlantillaEspecificacionesFichaTecnica}`, modelo);
  }

}
