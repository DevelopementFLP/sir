import { Injectable } from '@angular/core';
import { Comision } from '../Interfaces/Comision.interface';
import { BehaviorSubject } from 'rxjs';
import { ConfProducto } from '../Interfaces/ConfProducto.interface';

@Injectable({
  providedIn: 'root'
})
export class KosherCommonService {
  comisionSFOB: number = 0;
  comisionUSDPTON: number = 0;
  
  private confProductosSource = new BehaviorSubject<ConfProducto[]>([]);
  confProductos$ = this.confProductosSource.asObservable();

  constructor() { }

  setConfProductos(data: ConfProducto[]) {
    this.confProductosSource.next(data);
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


}
