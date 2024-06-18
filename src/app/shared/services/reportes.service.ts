import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Reporte } from '../models/reporte.interface';
import { urlAccesosReportesPorUsuario, urlReportes } from '../../../settings';
import { Observable } from 'rxjs';
import { AccesoReporte } from 'src/app/52_SIR.ControlUsuarios/interfaces/AccesoReporte.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http: HttpClient) { }

  public getReportesList(): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(urlReportes);
  }

  public getAccesoReportes(idUsuario: number): Observable<AccesoReporte[]> {
    return this.http.get<AccesoReporte[]>(`${urlAccesosReportesPorUsuario}?idUsuario=${idUsuario}`);
  }
}
