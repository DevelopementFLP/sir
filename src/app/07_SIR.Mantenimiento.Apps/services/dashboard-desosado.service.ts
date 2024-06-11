import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoteEntrada } from '../interfaces/LoteEntrada.interface';
import { HttpClient } from '@angular/common/http';
import { urlDashboardDesosadoCharqueo, urlDashboardDesosadoEmpaque, urlDashboardDesosadoEntrada, urlDashboardDesosadoHuesero, urlDashboardDesosadoRefreshTime, urlDWDashboardDesosadoCharqueo, urlDWDashboardDesosadoEmpaque, urlDWDashboardDesosadoEntrada, urlDWDashboardDesosadoHuesero, urlDWUpdateDashboardDesosadoCharqueo, urlDWUpdateDashboardDesosadoEmpaque, urlDWUpdateDashboardDesosadoEntrada, urlDWUpdateDashboardDesosadoHuesero } from 'src/settings';
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

   getDWLotesEntrada(): Observable<LoteEntrada[]> {
      return this.http.get<LoteEntrada[]>(urlDWDashboardDesosadoEntrada);
   }

   getDWDetalleCharqueo(): Observable<IndicadorCharqueador[]> {
      return this.http.get<IndicadorCharqueador[]>(urlDWDashboardDesosadoCharqueo);
   }

   getDWDetalleHueseros(): Observable<IndicadorHuesero[]> {
      return this.http.get<IndicadorHuesero[]>(urlDWDashboardDesosadoHuesero);
   }

   getDWDatosEmpaque(): Observable<IndicadorEmpaque[]> {
      return this.http.get<IndicadorEmpaque[]>(urlDWDashboardDesosadoEmpaque);
   }

   postDWLotesEntrada(lotesEntrada: LoteEntrada[]): Observable<void> {
      return this.http.post<void>(urlDWUpdateDashboardDesosadoEntrada, lotesEntrada);
   }

   postDWDetalleCharqueo(detalleCharqueo: IndicadorCharqueador[]): Observable<void>
   {
      return this.http.post<void>(urlDWUpdateDashboardDesosadoCharqueo, detalleCharqueo);
   }

   postDWDetalleHuesero(detalleHuesero: IndicadorHuesero[]): Observable<void> {
      return this.http.post<void>(urlDWUpdateDashboardDesosadoHuesero, detalleHuesero);
   }

   postDWDatosEmpaque(empaque: IndicadorEmpaque[]): Observable<void> {
      return this.http.post<void>(urlDWUpdateDashboardDesosadoEmpaque, empaque);
   }

   getRefreshTime(): Observable<string> {
      return this.http.get<string>(urlDashboardDesosadoRefreshTime);
   }
   
   getIndiceRendimientoHueseros(): number {
      return environments.indHuesero;
   }

   getIndiceRendimientoCharqueadores(): number {
      return environments.indCharqueador;
   }

}