import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtImagenesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtImagenesDTO';
import { urlBuscarImagenFichaTecnica, urlCrearImagenesFichaTecnica, urlEditarImagenFichaTecnica } from 'src/settings';

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

  // Servicio para actualizar la imagen de la ficha técnica
  public EditarImagenFichaTecnica(idFoto: number, seccionDeImagen: number, imagenFile: File): Observable<ApiResponse> {
    const formatoDeDatos = new FormData();
    formatoDeDatos.append('idFoto', idFoto.toString()); // Código del producto
    formatoDeDatos.append('seccionDeImagen', seccionDeImagen.toString()); // Sección de la imagen
    formatoDeDatos.append('imagenFile', imagenFile); // La nueva imagen

    // Asegúrate de que el URL sea correcto
    return this.http.put<ApiResponse>(`${urlEditarImagenFichaTecnica}`, formatoDeDatos);
  }

}
