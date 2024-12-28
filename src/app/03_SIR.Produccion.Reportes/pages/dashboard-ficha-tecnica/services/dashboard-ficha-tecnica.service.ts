import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoActivo } from '../interfaces/ProductoActivo.interface';
import { urlProductosActivos, urlTiempoActualizacionDashboard, urlTiempoProductoActivo } from 'src/settings';

@Injectable({
  providedIn: 'root'
})
export class DashboardFichaTecnicaService {

  constructor(private http: HttpClient) { }

  getActiveProducts(): Observable<ProductoActivo[]> {
    return this.http.get<ProductoActivo[]>(urlProductosActivos);
  }

  getActiveProductTime(): Observable<number> {
    return this.http.get<number>(urlTiempoProductoActivo);
  }

  getUpdateDashboardTime(): Observable<number> {
    return this.http.get<number>(urlTiempoActualizacionDashboard);
  }
}
