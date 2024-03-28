import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { BrokerDataResult } from '../models/gecos/brokerDataResult.interface';
import { urlGecosBroker } from 'src/settings';
import { Observable, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntegrationBrokerService {

  public result!: BrokerDataResult;

  constructor(
    private http: HttpClient
  ) { }

  
  public getInfoCaja(id: string): Observable<BrokerDataResult> {
    if (this.isNumero(id)) {
      return this.obtenerDatosDeCaja(parseInt(id)).pipe(
        tap(data => this.result = data),
        map(data => this.result)
      );
    } else {
      return of(this.result);
    }
  }

  private obtenerDatosDeCaja( id: number) : Observable<BrokerDataResult> { 
    const params = new HttpParams()
    .set('idCaja', id);

    return this.http.get<BrokerDataResult>(urlGecosBroker, {params});

  }

  private isNumero( id: string ) : boolean {
    return !isNaN(parseInt(id));
  }
}
