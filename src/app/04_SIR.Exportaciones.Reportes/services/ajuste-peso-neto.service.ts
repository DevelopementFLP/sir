import { Injectable } from '@angular/core';
import { DatoCargaExpo } from '../Interfaces/DatoCargaExpo.interface';
import { PesoBrutoContenedor } from '../Interfaces/PesoBrutoContenedor.interface';

@Injectable({
  providedIn: 'root'
})
export class AjustePesoNetoService {

  private pesoPallet: number = 30;
  private closestRoundNumber: number = 10;
  private roundBreak: number = 6;

  constructor() { }

  setPesoBrutoPorContenedor(data: DatoCargaExpo[], pesosBrutos: PesoBrutoContenedor[]): DatoCargaExpo[] {
    var res: DatoCargaExpo[] = [];
    
    pesosBrutos.forEach(pB => {
      const contenedor: string = pB.contenedor;
      const pesoBruto: number = pB.pesoBruto;
      
      var datosAModificar: DatoCargaExpo[] = data.filter(d => d.container == contenedor);
      const pesoNeto: number = this.sumaPesoNetoContenedor(datosAModificar);
      
      const pallets: number[] = this.numerosPallets(datosAModificar);
      const pesoPromedioCarton: number = this.obtenerPesoPromedioCarton(pesoBruto, pesoNeto, pallets.length, datosAModificar.length);
      
      var pesoTotal: number = 0;
      pallets.forEach(p => {
        var cajasPorPallet: DatoCargaExpo[] = this.obtenerCajasPorPallet(p, datosAModificar);
        const pesoBrutoPorPallet: number = this.redondearPesoBrutoPallet(this.obtenerPesoBrutoPorPallet(cajasPorPallet, pesoPromedioCarton));
        const pesoBrutoRealPorPallet: number = this.sumaPesoBrutoContenedor(cajasPorPallet);
        const diffPesoBruto: number = pesoBrutoPorPallet - pesoBrutoRealPorPallet;
        const pesoPromedioCaja: number = diffPesoBruto / cajasPorPallet.length;
        
        cajasPorPallet.forEach(c => {
          c.grossweight += pesoPromedioCaja;
        });
        
        pesoTotal += pesoBrutoPorPallet;
      });

      if(pesoTotal < pesoBruto) {
        const diff: number = pesoBruto - pesoTotal;
        var resto: number = diff;
        var i: number = 0;
        while(resto > 0) {
          var palletI: DatoCargaExpo[] = datosAModificar.filter(d => d.id_Pallet == pallets[i]);
          const cantCajasPalletI: number = palletI.length;
          const kgBrutosAgregar: number = this.closestRoundNumber / cantCajasPalletI;
          palletI.forEach(c => {
            c.grossweight += kgBrutosAgregar;
          });

          i++;
          resto -= this.closestRoundNumber;
        }
      }

      datosAModificar.forEach(d => {
        res.push(d);
      });
    });
    return res;
  }

  private sumaPesoNetoContenedor(contenedor: DatoCargaExpo[]): number {
    var peso: number = 0;

    contenedor.forEach(cont => {
      peso += cont.netweight;
    });

    return peso;
  }

  private sumaPesoBrutoContenedor(contenedor: DatoCargaExpo[]): number {
    var peso: number = 0;

    contenedor.forEach(cont => {
      peso += cont.grossweight;
    });

    return peso;
  }

  private numerosPallets(contenedor: DatoCargaExpo[]): number[] {
    return Array.from(new Set(contenedor.map(c => c.id_Pallet))).sort((a, b) => {
      if(a <= b) return -1;
      return 1;
    });
  }

  private obtenerPesoPromedioCarton(pesoBruto: number, pesoNeto: number, cantPallets: number, cantCajas: number): number {
    return (pesoBruto - pesoNeto - cantPallets * this.pesoPallet) / cantCajas;
  }

  private obtenerCajasPorPallet(idPallet: number, contenedor: DatoCargaExpo[]): DatoCargaExpo[] {
    return contenedor.filter(c => c.id_Pallet == idPallet);
  }

  private obtenerPesoBrutoPorPallet(pallets: DatoCargaExpo[], pesoPromedioCarton: number): number {
    const pesoNeto: number = this.sumaPesoNetoContenedor(pallets);
    return pallets.length * pesoPromedioCarton + this.pesoPallet + pesoNeto;
  }

  private redondearPesoBrutoPallet(pesoBruto: number): number {
    var peso: number = pesoBruto;
    const resto = peso % this.closestRoundNumber;

    if(resto < this.roundBreak) peso -= resto;
    else peso += this.closestRoundNumber - resto;
    peso = Math.trunc(peso);
    return peso;
  }
}
