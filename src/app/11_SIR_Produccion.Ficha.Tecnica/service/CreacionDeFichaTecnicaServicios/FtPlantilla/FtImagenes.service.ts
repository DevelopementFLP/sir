import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtImagenesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtImagenesDTO';
import { urlBuscarImagenFichaTecnica, urlCrearImagenesFichaTecnica } from 'src/settings';

@Injectable({
  providedIn: 'root'
})
export class FtImagenesService {

  constructor(
    private http: HttpClient
  ) { }

  public CrearImagenFichaTecnica(codigoDeProducto: string, seccionDeImagen: number, imagenFile: File): Observable<ApiResponse> {
    const formatoDeDatos = new FormData();
    formatoDeDatos.append('codigoDeProducto', codigoDeProducto); 
    formatoDeDatos.append('seccionDeImagen', seccionDeImagen.toString()); 
    formatoDeDatos.append('imagenFile', imagenFile);

    return this.http.post<ApiResponse>(`${urlCrearImagenesFichaTecnica}`, formatoDeDatos);
  }


  public BuscarImagenPorProducto(codigoDeProducto: string): Observable<ApiResponse> {
    let params = new HttpParams()
    .set('codigoDeProducto', codigoDeProducto)
    return this.http.get<ApiResponse>(`${urlBuscarImagenFichaTecnica}`, { params });
  }


}
