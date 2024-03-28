import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Reporte } from '../models/reporte.interface';
import { urlReportes } from '../../../settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(
    private http: HttpClient
  ) { }

  public getReportesList(): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(urlReportes);
  }
}
