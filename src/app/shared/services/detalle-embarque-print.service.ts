import { Injectable } from '@angular/core';
import { DataKosher } from 'src/app/04_SIR.Exportaciones.Reportes/Interfaces/DataKosher.interface';

@Injectable({
  providedIn: 'root'
})
export class DetalleEmbarquePrintService {

  constructor() { }

  nombresDict:{ [x: string]: string } = {
    "BONE": "HUESOS",
    "FAT": "GRASA",
    "HLRR": "TRIMMING",
    "HRT": "CORAZÓN",
    "LIV": "HÍGADO",
    "ROS": "QUIJADA",
    "SWT": "MOLLEJA",
    "TEN": "TENDONES",
    "TNG": "LENGUA"
  };


  obtenerContenedoresUnicos(cajas: DataKosher[]): string[] {
    return Array.from(new Set(cajas.map(c => c.container)));
  }

  obtenerPreciosUnicos(cajas: DataKosher[]): number[] {
    return Array.from(new Set(cajas.map(c => c.precioTonelada)));
  }

  obtenerEspeciesUnicas(cajas: DataKosher[]): string[] {
    return Array.from(new Set(cajas.map(c => c.especie!)));
  }

  obtenerTiposUnicos(cajas: DataKosher[]): string[] {
    return Array.from(new Set(cajas.map(c => c.tipoProducto!)));
  }

  obtenerMercaderiasUnicas(cajas: DataKosher[]): string[] {
    return Array.from(new Set(cajas.map(c => c.mercaderia)));
  }

  cantidadCajas(cajas: DataKosher[]): number {
    return cajas.length;
  }

  cantidadPallets(cajas: DataKosher[]): number {
    const pallets = Array.from(new Set(cajas.map(c => c.idPallet)));
    return pallets.length;
  }

  obtenerPalletsUnicos(cajas: DataKosher[]): number[] {
    return Array.from(new Set(cajas.map(c => c.idPallet)));
  }

  sumarKilosNetos(cajas: DataKosher[]): number {
    var kilosNetos: number = 0;
    cajas.forEach(caja => {
      kilosNetos += caja.pesoNeto!;
    });
    return kilosNetos;
  }

  sumarKilosBrutos(cajas: DataKosher[]): number {
    var kilosBrutos: number = 0;
    cajas.forEach(caja => {
      kilosBrutos += caja.pesoBruto!;
    });
    return kilosBrutos;
  }

  obtenerCajasPorMercaderia(cajas: DataKosher[], mercaderia: string = ''): DataKosher[] {
    if(mercaderia != '')
      return cajas.filter(c => c.mercaderia === mercaderia);

    return cajas.filter(c => c.mercaderia != 'CORTES');
  }

  sumarPrecios(cajas: DataKosher[]): number {
    var sumaPrecio: number = 0;
    cajas.forEach(c => {
      sumaPrecio += c.pesoNeto! * (c.precioTonelada / 1000);
    });
    return sumaPrecio;
  }

}
