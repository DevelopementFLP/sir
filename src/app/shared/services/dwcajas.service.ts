import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DwCaja } from '../interfaces/DwCaja.interface';
import { Observable, of } from 'rxjs';
import { urlGetDwCajas } from 'src/settings';

@Injectable({
  providedIn: 'root'
})
export class DwcajasService {

  constructor(private http: HttpClient) { }

  getDwCajas(fechaDesde: string, fechaHasta: string): Observable<DwCaja[]> {
    return this.http.get<DwCaja[]>(`${urlGetDwCajas}?fechaProducidoDesde=${fechaDesde}&fechaProducidoHasta=${fechaHasta}`);
  }
}
