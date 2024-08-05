import { Component, Input, OnInit } from '@angular/core';
import { GroupedDataKosher } from '../../types/DataKosherAgrupada.type';
import { DataKosher } from '../../Interfaces/DataKosher.interface';
import { TipoDataContainer } from '../../Interfaces/TipoDataContainer.interface';
import { TipoDataPrecio } from '../../Interfaces/TipoDataPrecio.interface';

@Component({
  selector: 'data-show',
  templateUrl: './data-show.component.html',
  styleUrls: ['./data-show.component.css']
})
export class DataShowComponent implements OnInit {  
  @Input() dataGroup: GroupedDataKosher = {};
  @Input() datosKosher: DataKosher[] = [];
  @Input() dua: string = '';
  
  ngOnInit(): void {}
  
  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  sumarPrecioContainer(
    data: { 
      totalPesoNeto: number; 
      totalPesoBruto: number; 
      especies: Record<string, 
      { 
        totalPesoNeto: number; 
        totalPesoBruto: number; 
        tipoProductos: Record<string, 
        {   
          totalPesoNeto: number; 
          totalPesoBruto: number; 
          precios: Record<number,
          { 
                  totalPesoNeto: number; 
                  totalPesoBruto: number; 
                  items: DataKosher[];
                }>; 
              }>; 
            }>; 
      }) : number
      {
    const d = data as TipoDataContainer;
    var precioTotal: number = 0;
    for (const especieKey in d.especies) {
      if (d.especies.hasOwnProperty(especieKey)) {
        const especie = d.especies[especieKey];
        for (const tipoProductoKey in especie.tipoProductos) {
          if (especie.tipoProductos.hasOwnProperty(tipoProductoKey)) {
            const tipoProducto = especie.tipoProductos[tipoProductoKey];
            for (const precioKey in tipoProducto.precios) {
              if (tipoProducto.precios.hasOwnProperty(precioKey)) {
                const precio = tipoProducto.precios[precioKey];
                const items = precio.items;
                items.forEach(it => {
                  precioTotal += it.pesoNeto! * (it.precioTonelada / 1000);
                });
              }
            }
          }
        }
      }
    }
    return precioTotal;
  }

  sumarPrecioContainer2(data: { totalPesoNeto: number; totalPesoBruto: number; precios: Record<number, { totalPesoNeto: number; totalPesoBruto: number; items: DataKosher[]; }>; }): number {
    const d = data as TipoDataPrecio;
    var precioTotal: number = 0;

    for (const precioKey in d.precios) {
        if (d.precios.hasOwnProperty(precioKey)) {
            const precio = d.precios[precioKey];
            const items = precio.items;
            items.forEach(it => {
                precioTotal += it.pesoNeto! * (it.precioTonelada / 1000);
            });
        }
    }

    return precioTotal;
} 
 
  
  cantidadPallets(datos: DataKosher[]): number {
    const pallets = Array.from(new Set(datos.map(d => d.idPallet)));
    return pallets.length;
  }

  totalPalletsPorContenedor(
    data: { 
      totalPesoNeto: number; 
      totalPesoBruto: number; 
      especies: Record<string, 
      { 
        totalPesoNeto: number; 
        totalPesoBruto: number; 
        tipoProductos: Record<string, 
        {   
          totalPesoNeto: number; 
          totalPesoBruto: number; 
          precios: Record<number,
          { 
                  totalPesoNeto: number; 
                  totalPesoBruto: number; 
                  items: DataKosher[];
                }>; 
              }>; 
            }>; 
      }) : number
      {
    const d = data as TipoDataContainer;
    var pallets: number[] = [];
    for (const especieKey in d.especies) {
      if (d.especies.hasOwnProperty(especieKey)) {
        const especie = d.especies[especieKey];
        for (const tipoProductoKey in especie.tipoProductos) {
          if (especie.tipoProductos.hasOwnProperty(tipoProductoKey)) {
            const tipoProducto = especie.tipoProductos[tipoProductoKey];
            for (const precioKey in tipoProducto.precios) {
              if (tipoProducto.precios.hasOwnProperty(precioKey)) {
                const precio = tipoProducto.precios[precioKey];
                const items = precio.items;
                items.forEach(it => {
                  pallets.push(it.idPallet);
                });
              }
            }
          }
        }
      }
    }
  
    return Array.from(new Set(pallets)).length;;
  }

  totalPalletsPorContenedor2(
      data: { 
        totalPesoNeto: number; 
        totalPesoBruto: number; 
        precios: Record<number, 
          { 
            totalPesoNeto: number; 
            totalPesoBruto: number; 
            items: DataKosher[]; 
          }>; 
        }): number {
      
        const d = data as TipoDataPrecio;
        var pallets: number[] = [];
        
        for (const precioKey in d.precios) {
          if (d.precios.hasOwnProperty(precioKey)) {
              const precio = d.precios[precioKey];
              const items = precio.items;
              items.forEach(it => {
                  pallets.push(it.idPallet);
              });
          }
      }

        return Array.from(new Set(pallets)).length;
    }
  
  totalCajasPorContenedor(
    data: { 
      totalPesoNeto: number; 
      totalPesoBruto: number; 
      especies: Record<string, 
      { 
        totalPesoNeto: number; 
        totalPesoBruto: number; 
        tipoProductos: Record<string, 
        {   
          totalPesoNeto: number; 
          totalPesoBruto: number; 
          precios: Record<number,
          { 
                  totalPesoNeto: number; 
                  totalPesoBruto: number; 
                  items: DataKosher[];
                }>; 
              }>; 
            }>; 
      }) : number
      {
    const d = data as TipoDataContainer;
    var cajas: number[] = [];
    for (const especieKey in d.especies) {
      if (d.especies.hasOwnProperty(especieKey)) {
        const especie = d.especies[especieKey];
        for (const tipoProductoKey in especie.tipoProductos) {
          if (especie.tipoProductos.hasOwnProperty(tipoProductoKey)) {
            const tipoProducto = especie.tipoProductos[tipoProductoKey];
            for (const precioKey in tipoProducto.precios) {
              if (tipoProducto.precios.hasOwnProperty(precioKey)) {
                const precio = tipoProducto.precios[precioKey];
                const items = precio.items;
                items.forEach(it => {
                  cajas.push(it.idPallet);
                });
              }
            }
          }
        }
      }
    }
  
    return cajas.length;;
  }

  totalCajasPorContenedor2(data: { totalPesoNeto: number; totalPesoBruto: number; precios: Record<number,{ totalPesoNeto: number; totalPesoBruto: number; items: DataKosher[]; }>; }) {
    const d = data as TipoDataPrecio;
    var cajas: number[] = [];
    for (const precioKey in d.precios) {
      if (d.precios.hasOwnProperty(precioKey)) {
          const precio = d.precios[precioKey];
          const items = precio.items;
          items.forEach(it => {
              cajas.push(it.idPallet);
          });
      }
  }
    return cajas.length;;
    }
}
