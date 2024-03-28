import { Component } from '@angular/core';
import { forkJoin, tap } from 'rxjs';
import { BrokerDataResult } from 'src/app/shared/models/gecos/brokerDataResult.interface';
import { Especie } from 'src/app/shared/models/gecos/haciendaLotes.interface';
import { MarelDataResult } from 'src/app/shared/models/marelResponse.interface';

import { Trazabilidad } from 'src/app/shared/models/trazabilidad.interface';
import { MarelService } from 'src/app/shared/services/marel.service';
import { TrazabilidadService } from 'src/app/shared/services/trazabilidad.service';



@Component({
  selector: 'app-trazabilidad',
  templateUrl: './trazabilidad.component.html',
  styleUrls: ['./trazabilidad.component.css']
})
export class TrazabilidadComponent {
  identificadores: string = "";
  listaIdentificadores: string[] = [];
  listaTrazabilidad: Trazabilidad[] = [];
  isLoading: boolean = false;
  destino: string = '';

  constructor(
    private trazabilidadService: TrazabilidadService,
    private marelService: MarelService
  ) { }

  public obtenerTrazabilidad(): void {
    this.isLoading = true;
    this.listaTrazabilidad = [];
    this.listaIdentificadores = [];
    this.obtenerListaIdentificadores();
    const observables = this.listaIdentificadores.map(id => {
      return this.trazabilidadService.getDatosTrazabilidad(id);
    });

    forkJoin(observables).subscribe(cajas => {
      cajas.forEach(caja => {
        this.procesarCaja(caja);
      });

    });
    this.isLoading = false;
  }

  private procesarCaja(caja: MarelDataResult | BrokerDataResult): void {
    //Agregar cada caja a listaTrazabilidad
    let especie: Especie;

    if (typeof caja === 'object')
      if (Array.isArray(caja)) {
        especie = Especie.B;
        this.listaTrazabilidad.push({
          clasificacion: '',
          especie: especie,
          tropa: 0,
          destino: caja[0].customercode,
          codigo: caja[0].code,
          producto: caja[0].name,
          id: caja[0].extcode,
          fechaProduccion: caja[0].prday,
          fechaFaena: caja[0].expire3

        })
      }
      else {
        const condition = this.marelService.getEspeciePorCodigo(caja.productCode).subscribe(
          async data => {
            if (data == '18') especie = Especie.O;
            else especie = Especie.B;

            switch (especie) {
              case Especie.B:
                this.listaTrazabilidad.push(await this.obtenerCajaGecosVacuno(caja as BrokerDataResult, especie));
                break;
              case Especie.O:
                this.listaTrazabilidad.push(await this.obtenerCajaGecosOvino(caja as BrokerDataResult, especie));
                break;
            }
          }
        );

      }
  }


  private async obtenerCajaGecosVacuno(caja: BrokerDataResult, especie: Especie): Promise<Trazabilidad> {

    return {
      clasificacion: '',
      especie: especie,
      tropa: 0, 
      destino:  await this.marelService.getDestinoPorCodigo(caja.productCode),
      codigo: caja.productCode,
      producto: caja.productDescription,
      id: caja.id.toString(),
      fechaProduccion: this.parseFechaDDMMYYYY(caja.extraData[0].value),
      fechaFaena: new Date(), 
    }
  }

  private async obtenerCajaGecosOvino(caja: BrokerDataResult, especie: Especie): Promise<Trazabilidad> {

    return {
      clasificacion: '',
      especie: especie,
      tropa: 0, //Buscar la tropa ovina
      destino: await this.marelService.getDestinoPorCodigo(caja.productCode),
      codigo: caja.productCode,
      producto: caja.productDescription,
      id: caja.id.toString(),
      fechaProduccion: this.parseFechaDDMMYYYY(caja.extraData[0].value),
      fechaFaena: new Date(), //Obtener de sqltest
    }
  }

  private obtenerListaIdentificadores(): string[] {
    this.identificadores = this.identificadores.replace(/\s+/g, ' ').trim();
    if (this.identificadores === "") return [];
    this.listaIdentificadores = this.separarIdentificadores(this.identificadores);
    return this.listaIdentificadores;
  }

  private separarIdentificadores(identificadores: string): string[] {
    return identificadores.split(' ');
  }

  private parseFechaDDMMYYYY(fechaStr: string): Date | string {
    const partes = fechaStr.split('/');
    if (partes.length === 3) {
      const dia = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10) - 1;
      const año = parseInt(partes[2], 10);

      if (!isNaN(dia) && !isNaN(mes) && !isNaN(año)) {
        return new Date(año, mes, dia);
      }
    }

    return "";
  }
}
