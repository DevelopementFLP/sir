import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import "../../../settings";
import { Observable } from 'rxjs';
import { HaciendaAnimal } from '../models/gecos/haciendaAnimales.interface';
import { urlAPI, urlSalidaProduccion } from '../../../settings';
import { HaciendaLotes } from '../models/gecos/haciendaLotes.interface';
import { CajasKilosGecos } from 'src/app/07_SIR.Mantenimiento.Apps/interfaces/CajasKilosGecos.interface';

@Injectable({
  providedIn: 'root'
})
export class GecosService {

  constructor(
    private http: HttpClient
  ) { }
  
  public getDatosProduccion(fechaDesde: string, fechaHasta: string) {

  }

  public getDatosCarga(fechaDesde: string, fechaHasta: string) {
      const params = new HttpParams()
      .set('fechadesde', fechaDesde)
      .set('fechahasta', fechaHasta);

      return this.http.get<HaciendaAnimal[]>(`${urlAPI}ProductosCarga/productosCarga`, {params});
  }

  public getDatosTipificacionChile(fechaDesde: string, fechaHasta: string) {

  }

  public getDatosHaciendaAnimales(fechaFaena: string): Observable<HaciendaAnimal[]> {
    const params = new HttpParams()
    .set('fechaDeFaena', fechaFaena)

    return this.http.get<HaciendaAnimal[]>(`${urlAPI}AnimalHacienda/getAnimalesHacienda`, {params});
  }

  public getDatosHaciendaLotes(fechaFaena: string): Observable<HaciendaLotes[]> {
    const params = new HttpParams()
    .set('fechaDeFaena', fechaFaena);
    return this.http.get<HaciendaLotes[]>(`${urlAPI}LoteHacienda/getLotesHacienda`, {params})
  }

  public getDatosHaciendaTipificacion(fechaDesde: string, fechaHasta: string) {

  }

  public getCajasJumbo(fechaDesde: string, fechaHasta: string, filtro: string) : Observable<CajasKilosGecos> {
    const params = new HttpParams()
    .set('fechaDesde', fechaDesde)
    .set('fechaHasta', fechaHasta)
    .set('filtro', filtro)
    
    return this.http.get<CajasKilosGecos>(urlSalidaProduccion, {params});
  }
 
}
