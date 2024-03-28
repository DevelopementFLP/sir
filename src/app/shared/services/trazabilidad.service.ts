import { Injectable } from '@angular/core';

import { IntegrationBrokerService } from './integration-broker.service';
import { Trazabilidad } from '../models/trazabilidad.interface';
import { MarelService } from './marel.service';
import { MarelDataResult } from '../models/marelResponse.interface';
import { BrokerDataResult } from '../models/gecos/brokerDataResult.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrazabilidadService {

  constructor(
    private integrationService: IntegrationBrokerService,
    private marelService: MarelService
  ) { }

  public getDatosTrazabilidad(id: string): Observable<MarelDataResult | BrokerDataResult> {
    const source = this.getServicioABuscar(id);
  
    switch (source) {
      case 'Gecos':
        return this.integrationService.getInfoCaja(id);
      case 'Marel':
        return this.marelService.getInfoCaja(id);
      default:
        return of();
    }
  }
  
  private getServicioABuscar( codigo: string ): string {
    if(isNaN(parseInt(codigo))) return "";
    return codigo.startsWith('15') ? "Gecos" : "Marel";
  }
}
