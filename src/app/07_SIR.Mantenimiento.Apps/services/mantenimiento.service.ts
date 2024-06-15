import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CabezaFaenada } from '../interfaces/CabezaFaenada.interface';
import { urlCabezasFaenadas } from 'src/settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {

  constructor(private http: HttpClient) { }

  getCabezasFaenadas(fechaFaenaDesde: string, fechaFaenaHasta: string): Observable<CabezaFaenada[]> {
    return this.http.get<CabezaFaenada[]>(`${urlCabezasFaenadas}?fechaFaenaDesde=${fechaFaenaDesde}&fechaFaenaHasta=${fechaFaenaHasta}`);
  }
}
