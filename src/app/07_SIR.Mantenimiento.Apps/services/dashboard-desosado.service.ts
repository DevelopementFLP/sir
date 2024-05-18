import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoteEntrada } from '../interfaces/LoteEntrada.interface';
import { HttpClient } from '@angular/common/http';
import { urlDashboardDesosadoCharqueo, urlDashboardDesosadoEmpaque, urlDashboardDesosadoEntrada, urlDashboardDesosadoHuesero } from 'src/settings';
import { IndicadorCharqueador } from '../interfaces/IndicadorCharqueador.interface';
import { IndicadorHuesero } from '../interfaces/IndicadorHuesero.interface';
import { IndicadorEmpaque } from '../interfaces/IndicadorEmpaque.interface';
import { environments } from 'src/app/environments/environments';

@Injectable({providedIn: 'root'})
export class DashboardDesosadoService {
 
   constructor(private http: HttpClient) { }
    
   getLotesEntrada(): Observable<LoteEntrada[]> {
    return this.http.get<LoteEntrada[]>(urlDashboardDesosadoEntrada);
   }

   getDetalleCharqueo(): Observable<IndicadorCharqueador[]> {
    return this.http.get<IndicadorCharqueador[]>(urlDashboardDesosadoCharqueo);
   }

   getDetalleHueseros(): Observable<IndicadorHuesero[]> {
    return this.http.get<IndicadorHuesero[]>(urlDashboardDesosadoHuesero);
   }

   getDatosEmpaque(): Observable<IndicadorEmpaque[]> {
      return this.http.get<IndicadorEmpaque[]>(urlDashboardDesosadoEmpaque);
   }

   getIndiceRendimientoHueseros(): number {
      return environments.indHuesero;
   }

   getIndiceRendimientoCharqueadores(): number {
      return environments.indCharqueador;
   }
}