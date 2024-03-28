import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Reporte } from '../models/reporte.interface';
import "../../../settings";

import { urlAccessos, urlAccessosId, urlModulos, urlAccesoPorIdUsuario } from '../../../settings';
import { Acceso } from '../models/acceso.interface';
import { Modulo } from '../models/modulo.interface';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  navbarData: Reporte[] = [];

  constructor(
    private http: HttpClient
  ) { }

  
  getAccesoData(): Observable<Acceso[]> {
    return this.http.get<Acceso[]>(urlAccessos);
  }

  getReportesData(id_perfil: number): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(urlAccessosId + id_perfil);
  }

  getModuloData(id_modulo: number): Observable<Modulo> {
    return this.http.get<Modulo>(urlModulos + id_modulo);
  }

  getReportesPorAcceso(idPerfil: number): Observable<Reporte[]> {
    const url = urlAccesoPorIdUsuario.replace('id', idPerfil.toString());
    return this.http.get<Reporte[]>(url);
  }
  
  
  
}
