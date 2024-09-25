import { Injectable } from '@angular/core';
import { Comision } from '../Interfaces/Comision.interface';
import { BehaviorSubject } from 'rxjs';
import { ConfProducto } from '../Interfaces/ConfProducto.interface';
import { TotalDataAgrupada } from '../Interfaces/TotalDataAgrupada.interface';
import { DataKosherAgrupada } from '../Interfaces/DataKosherAgrupada.interface';
import { DataKosher } from '../Interfaces/DataKosher.interface';

@Injectable({
  providedIn: 'root'
})
export class KosherCommonService {
  comisionSFOB: number = 0;
  comisionUSDPTON: number = 0;
  
  private confProductosSource = new BehaviorSubject<ConfProducto[]>([]);
  confProductos$ = this.confProductosSource.asObservable();

  private resetStatus: number = 0;
  private resetSource = new BehaviorSubject<number>(this.resetStatus);
  reset$ = this.resetSource.asObservable();

  constructor() { }

  setConfProductos(data: ConfProducto[]) {
    this.confProductosSource.next(data);
  }

  setReset(): void {
    this.resetSource.next(this.resetStatus++);
  }

  public getCodigoKosher(cK?: string): string {
    if(cK == null)  return '';
    var dato: string = cK.trim();
    if(this.tieneNumero(dato)) 
      return this.obtenerNumeros(dato)[0].toString();
    return '';
  }

  private tieneNumero(str: string): boolean {
    const regex = /\d/;
    return regex.test(str);
  }

  private obtenerNumeros(str: string): number[] {
    const regex = /\d+/g;
    const matches = str.match(regex);
    return matches ? matches.map(Number) : [];
  }

  public setComision(comision: Comision) {
    this.comisionSFOB = comision == undefined ? 0 : comision.comisionSFOB;
    this.comisionUSDPTON =  comision == undefined ? 0 : comision.comisionUSDTONS;;
  }

  public getTitulosReporte(): string[] {
    return [
      'DUA',
      'MERCADERÍA',
      'PALLETS',
      'CAJAS',
      'KGS. NETOS',
      'KGS. BRUTOS',
      'USD',
      'P/PROM',
      'TIPO',
      'CONTAINER',
      `COMISION S/FOB (${this.comisionSFOB})`,
      `COMISION USD P/TONS (${this.comisionUSDPTON})`,
      'TOTAL COMISIÓN',
      'VALOR VAE',
      'P/U VAE'
    ]
  }

  setDatosAgrupados(datosKosher: DataKosher[]): DataKosherAgrupada[] {
    var d: DataKosherAgrupada[] = [];

    // Mercadería
    const mercaderiaNames: string[] = Array.from(new Set(datosKosher.map(d => d.mercaderia)));

    // Contenedores
    const containersNames: string[] = Array.from(new Set(datosKosher.map(d => d.container)));

    // Especie
    const especiesNames: string[] = Array.from(new Set(datosKosher.map(d => d.especie!)));

    // Tipo producto
    const tiposNames: string[] = Array.from(new Set(datosKosher.map(d => d.tipoProducto!)));

    // Precios
    const preciosValues: number[] = Array.from(new Set(datosKosher.map(d => d.precioTonelada)));
    // Desglose
    mercaderiaNames.forEach(merca => {
      const dataByMerca = datosKosher.filter(d => d.mercaderia === merca);
      containersNames.forEach(cont => {
        const dataByContainer = dataByMerca.filter(d => d.container === cont);
        especiesNames.forEach(esp => {
          const dataByEspecie = dataByContainer.filter(d => d.especie === esp);
          tiposNames.forEach(t => {
            const dataByTipo = dataByEspecie.filter(d => d.tipoProducto === t);
            preciosValues.forEach(p => {
              const dataByPrecio = dataByTipo.filter(d => d.precioTonelada === p);
              const reg: DataKosherAgrupada = {
                mercaderia: merca,
                cantidadCajas: this.cantidadCajas(dataByPrecio),
                cantidadPallets: this.cantidadPalletsByGroup(dataByPrecio),
                container: cont,
                kilosBrutos: this.sumarPesoBruto(dataByPrecio),
                kilosNetos: this.sumarPesoNeto(dataByPrecio),
                precioPromedio: p,
                precioTotal: this.precioTotal(dataByPrecio, p),
                especieTipo: esp + " " + t
              };
              if(reg.cantidadCajas > 0)
                d.push(reg);
            })
          })
        });       
      });
    });

    return d;
  }

  getTotalPalletsByContainer(data: DataKosherAgrupada[]): number {
    var cantidad: number = 0;
    data.forEach(d => {
      cantidad += d.cantidadPallets;
    });
    return cantidad;
  }



   sumarPesoNeto(data: DataKosher[]): number {
    var pesoNeto: number = 0;

    data.forEach(d => {
      pesoNeto += d.pesoNeto!;    
    })

    return pesoNeto;
  }

   sumarPesoBruto(data: DataKosher[]): number {
    var pesoBruto: number = 0;

    data.forEach(d => {
      pesoBruto += d.pesoBruto!;    })

    return pesoBruto;
  }

   cantidadPalletsByGroup(data: DataKosher[]): number {
    return Array.from(new Set(data.map(d => d.idPallet))).length ?? 0;
  }

   cantidadCajas(data: DataKosher[]): number {
    return data.length;
  }

   precioTotal(data: DataKosher[], precio: number): number {
    return this.sumarPesoNeto(data) * precio / 1000;
  }

  totalDataAgrupadaPorContainer(data: DataKosherAgrupada[]): TotalDataAgrupada {
    var pallets: number = 0;
    var cajas: number = 0;
    var pesoNeto: number = 0;
    var pesoBruto: number = 0;
    var precioTotal: number = 0;
    
    var d: TotalDataAgrupada = {
      cantidadCajas: 0,
      cantidadPallets: 0,
      kilosBrutos: 0,
      kilosNetos: 0,
      precioPromedio: 0,
      precioTotal: 0
    }

    data.forEach(dt => {
      if(dt){ 
        pallets += dt.cantidadPallets;
        cajas += dt.cantidadCajas;
        pesoNeto += dt.kilosNetos;
        pesoBruto += dt.kilosBrutos;
        precioTotal += dt.precioTotal;
      }
    });

    d.cantidadPallets = pallets;
    d.cantidadCajas = cajas;
    d.kilosNetos = pesoNeto;
    d.kilosBrutos = pesoBruto;
    d.precioTotal = precioTotal;
    d.precioPromedio = precioTotal / pesoNeto * 1000;

    return d;
  }

}
