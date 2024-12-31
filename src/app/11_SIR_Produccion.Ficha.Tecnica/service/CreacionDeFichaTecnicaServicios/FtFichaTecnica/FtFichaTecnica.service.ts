import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtFichaTecnicaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtFichaTecnicaDTO';
import { urlBuscarFichaTecnica, urlCrearFichaTecnica, urlEditarFichaTecnica, urlEliminarFichaTecnica, urlListaDeFichasTecnicas } from 'src/settings';

@Injectable({
  providedIn: 'root'
})
export class FtFichaTecnicaService {

  constructor(
    private http: HttpClient
  ) { }

  public GetListaDeFichasTecnicas(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${urlListaDeFichasTecnicas}`);
  }
  

  public CrearFichaTecnica(modelo: FtFichaTecnicaDTO, archivoPdf: File): Observable<ApiResponse> {
    const formData = new FormData();

    formData.append('modelo', JSON.stringify(modelo)); 

    formData.append('archivoPdf', archivoPdf);

    return this.http.post<ApiResponse>(`${urlCrearFichaTecnica}`, formData);
  }

  public BuscarFichaTecnica(codigoDeProducto: string): Observable<ApiResponse> {
    let params = new HttpParams()
    .set('codigoDeProducto', codigoDeProducto)
    return this.http.get<ApiResponse>(`${urlBuscarFichaTecnica}`, { params });
  }

  public EditarFichaTecnica(modelo: FtFichaTecnicaDTO, archivoPdf?: File): Observable<ApiResponse> {
    const formData = new FormData();
  
    formData.append('modelo', JSON.stringify(modelo));
  
    if (archivoPdf) {
      formData.append('archivoPdf', archivoPdf);
    }
  
    return this.http.put<ApiResponse>(`${urlEditarFichaTecnica}`, formData);
  }
  

  public EliminarFichaTecnica(id: number, codigoDeProducto: string): Observable<ApiResponse> {
    let params = new HttpParams()
    .set('id', id.toString())
    .set('codigoDeProducto', codigoDeProducto);
    return this.http.delete<ApiResponse>(`${urlEliminarFichaTecnica}`, { params });
  }
  
  
}
