import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { urlEntradaMarel, urlMarelDatosCaja, urlMarelDestino, urlMarelEspecie, urlSalidasMarel } from 'src/settings';
import { MarelDataResult } from '../models/marelResponse.interface';
import { CajasKilosGecos } from 'src/app/07_SIR.Mantenimiento.Apps/interfaces/CajasKilosGecos.interface';
import { SalidaMarel } from 'src/app/07_SIR.Mantenimiento.Apps/interfaces/SalidaMarel.interface';
import { EntradaMarel } from 'src/app/07_SIR.Mantenimiento.Apps/interfaces/EntradaMarel.interface';

@Injectable({
  providedIn: 'root'
})
export class MarelService {

  public result!: MarelDataResult;


  constructor(
    private http: HttpClient
  ) { }

  public getEspeciePorCodigo( codigo: string ) : Observable<string> {

    const params = new HttpParams()
    .set('codigo', codigo);

    return this.http.get<string>(urlMarelEspecie + "/getEspeciePorCodigo", {params});
  }

  getDestinoPorCodigo(codigo: string): Promise<string> {
    const params = new HttpParams().set('codigo', codigo);

    return new Promise<string>((resolve, reject) => {
      this.http.get<string>(urlMarelDestino + "/getDestinoPorCodigo", { params }).subscribe(
        (resultado: string) => {
          resolve(resultado); // Resuelve la promesa con el resultado del observable
        },
        (error) => {
          reject(error); // Rechaza la promesa con el error del observable
        }
      );
    });
  }

  public getInfoCaja(id: string): Observable<MarelDataResult> {
    if (this.isNumero(id)) {
      return this.obtenerDatosDeCaja(parseInt(id)).pipe(
        tap(data => this.result = data),
        map(data => this.result)
      );
    } else {
      return of(this.result);
    }
  }
  

  private obtenerDatosDeCaja( id: number) : Observable<MarelDataResult> { 
    const params = new HttpParams()
    .set('id', id);

    return this.http.get<MarelDataResult>(urlMarelDatosCaja, {params});

  }

  private isNumero( id: string ) : boolean {
    return !isNaN(parseInt(id));
  }

  public getDatosTotalCajas(fechaDesde: string, fechaHasta: string) : Observable<SalidaMarel[]> {
    const params = new HttpParams()
    .set('fechaDesde', fechaDesde)
    .set('fechaHasta', fechaHasta);

    return this.http.get<SalidaMarel[]>(urlSalidasMarel, {params});
  }

  public getDatosTotalEntarda(fechaDesde: string, fechaHasta: string) : Observable<EntradaMarel[]> {
    const params = new HttpParams()
    .set('fechaDesde', fechaDesde)
    .set('fechaHasta', fechaHasta);

    return this.http.get<EntradaMarel[]>(urlEntradaMarel, {params})
  }
}
