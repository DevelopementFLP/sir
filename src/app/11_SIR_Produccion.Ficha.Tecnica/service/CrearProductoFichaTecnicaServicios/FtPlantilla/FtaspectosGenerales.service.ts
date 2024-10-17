import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtAspectosGeneralesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CrearFichaTecnicaInterface/FtAspectosGeneralesDTO';
import { urlCrearPlantillaAspectosGeneralesFichaTecnica } from 'src/settings';

@Injectable({
  providedIn: 'root'
})
export class FtAspectosGeneralesService {

  constructor(
    private http: HttpClient
  ) { }

  public CrearPlantillaAspectosGenerales(modelo: FtAspectosGeneralesPlantillaDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${urlCrearPlantillaAspectosGeneralesFichaTecnica}`, modelo);
  }

}
