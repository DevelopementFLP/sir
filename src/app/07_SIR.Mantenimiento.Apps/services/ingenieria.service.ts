import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Scada } from '../interfaces/Scada.interface';
import { urlDeleteTipoDispositivo, urlDeleteUbicacion, urlDeleteUnidadesMedida, urlGetDatosScada, urlGetTiposDispositivo, urlGetUbicacionDispositivo, urlGetUnidadesMedida, urlInsertTipoDispositivo, urlInsertUbicaciones, urlInsertUnidadesMedidas, urlUpdateDatosScada, urlUpdateTipoDispositivo, urlUpdateUbicacion, urlUpdateUnidadesMedida } from 'src/settings';
import { TipoDispositivo } from '../interfaces/TipoDispositivo.interface';
import { Ubicacion } from '../interfaces/Ubicacion.interface';
import { ScadaDTO } from '../interfaces/ScadaDTO.interface';
import { UnidadMedida } from '../interfaces/UnidadMedida.interface';

@Injectable({
  providedIn: 'root'
})
export class IngenieriaService {

  constructor(private http: HttpClient) { }

  getDatosScada(): Observable<Scada[]> {
    return this.http.get<Scada[]>(urlGetDatosScada);
  }

  getTiposDispositivos(): Observable<TipoDispositivo[]> {
    return this.http.get<TipoDispositivo[]>(urlGetTiposDispositivo);
  }

  getUbicacionesDispositivos(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(urlGetUbicacionDispositivo);
  }

  getUnidadesMedida(): Observable<UnidadMedida[]> {
    return this.http.get<UnidadMedida[]>(urlGetUnidadesMedida);
  }

  insertDispositivos(dispositivos: TipoDispositivo[]): Observable<void> {
    return this.http.post<void>(urlInsertTipoDispositivo, dispositivos);
  }

  insertUbicaciones(ubicaciones: Ubicacion[]): Observable<void> {
    return this.http.post<void>(urlInsertUbicaciones, ubicaciones);
  }

  insertUnidadesMedida(unidades: UnidadMedida[]): Observable<void> {
    return this.http.post<void>(urlInsertUnidadesMedidas, unidades);
  }

  updateDatosScada(datos: ScadaDTO[]): Observable<void> {
    return this.http.put<void>(urlUpdateDatosScada, datos);
  }

  updateTiposDispositivos(dispositivos: TipoDispositivo[]): Observable<void> {
    return this.http.put<void>(urlUpdateTipoDispositivo, dispositivos);
  }

  updateUbicaciones(ubicaciones: Ubicacion[]): Observable<void> {
    return this.http.put<void>(urlUpdateUbicacion, ubicaciones);
  }

  updateUnidadesMedida(unidades: UnidadMedida[]): Observable<void> {
    return this.http.put<void>(urlUpdateUnidadesMedida, unidades);
  }

  deleteTiposDispositivos(dispositivos: TipoDispositivo[]): Observable<void> {
    const httpOptions = { body: dispositivos };
    return this.http.delete<void>(urlDeleteTipoDispositivo, httpOptions);
  }

  deleteUbicaciones(ubicaciones: Ubicacion[]): Observable<void> {
    const httpOptions = { body: ubicaciones };
    return this.http.delete<void>(urlDeleteUbicacion, httpOptions);
  }

  deleteUnidadesMedida(unidades: UnidadMedida[]): Observable<void> {
    const httpOptions = { body: unidades };
    return this.http.delete<void>(urlDeleteUnidadesMedida, httpOptions);
  }
}
