import { Injectable } from '@angular/core';
import { RegistroConPrecio } from '../interfaces/RegistroConPrecio.interface';
import { PLPallet } from '../interfaces/PLPallet.interface';
import { XFCL } from '../interfaces/XFCL.interface';
import { TotalData } from '../interfaces/TotalData.interface';
import { PrecioData } from '../interfaces/PrecioData.interface';


@Injectable({
  providedIn: 'root'
})
export class CargaService {

  constructor() { }

  getTotalData(datos: RegistroConPrecio[]): TotalData {
    return {
      cantidadCajas: datos.length,
      cantidadPallets: this.setDataRegistrosPallet(this.getIdsPallets(datos), datos).length,
      pesoBruto: datos.reduce((acc, item) => acc + item.grossweight, 0),
      pesoNeto: datos.reduce((acc, item) => acc + item.netweight, 0)
    };
  }
  

  getIdsPallets(datos: RegistroConPrecio[]): number[] {
    return Array.from(new Set(datos.map(d => d.pallet))).sort((a, b) => a - b);
  }

  private getContenedoresNames(datos: RegistroConPrecio[]): string[] {
    return Array.from(new Set(datos.map(d => d.container))).sort((a, b) => a.localeCompare(b));
  }

  setDataRegistrosPallet(idsPallet: number[], datos: RegistroConPrecio[]): PLPallet[] {
    return idsPallet.flatMap(id => {
      const data: RegistroConPrecio[] = datos.filter(d => d.pallet === id);
      const precios: number[] = Array.from(new Set(data.map(d => d.precio)));

      return precios.map(precio => {
        const dataPorPrecio: RegistroConPrecio[] = data.filter(d => d.precio === precio);
        const dataOrdenadaPorFecha = dataPorPrecio.sort((a, b) => a.productiondate.localeCompare(b.productiondate));
        return {
          cantidadCajas: dataPorPrecio.length,
          clasificacionKosher: dataPorPrecio[0].clasificacion,
          codigoKosher: dataPorPrecio[0].codigoKosher,
          codigoProducto: dataPorPrecio[0].productcode,
          contenedor: dataPorPrecio[0].container,
          fechaExpiracion: dataOrdenadaPorFecha[0].expiredate,
          fechaProduccion: dataOrdenadaPorFecha[0].productiondate,
          idPallet: id,
          markKosher: dataPorPrecio[0].mark,
          pesoNeto: dataPorPrecio.reduce((acc, item) => acc + item.netweight, 0),
          pesoBruto: dataPorPrecio.reduce((acc, item) => acc + item.grossweight, 0),
          precio: precio
        };
      });
    });
  }

  setDataXFCL(datos: RegistroConPrecio[]): XFCL[] {
    let dataXFCL: XFCL[] = [];
    const contenedores: string[] = this.getContenedoresNames(datos);
    contenedores.forEach(cont => {
      const dataCont: RegistroConPrecio[] = datos.filter(d => d.container === cont);
      const idsPallets: number[] = this.getIdsPallets(dataCont);
      const dataPalletCont: PLPallet[] = this.setDataRegistrosPallet(idsPallets, dataCont);

      dataXFCL.push({
        contenedor: cont,
        cantidadCajas: dataCont.length,
        cantidadPallets: dataPalletCont.length,
        data: dataPalletCont,
        pesoBruto: dataCont.reduce((acc, item) => acc + item.grossweight, 0),
        pesoNeto: dataCont.reduce((acc, item) => acc + item.netweight, 0)
      })
    });

    return dataXFCL;
  }

  setDataXCUT(datos: PLPallet[]): PrecioData[] {
    const codigosKosher = Array.from(new Set(datos.map(d => d.codigoKosher)));
  
    return codigosKosher.flatMap(ck => {
      const dataPorCodigo = datos.filter(d => d.codigoKosher === ck);
      const preciosPorCodigo = Array.from(new Set(dataPorCodigo.map(d => d.precio)));
  
      return preciosPorCodigo.map(precio => {
        const dataPorPrecio = dataPorCodigo.filter(d => d.precio === precio);
        
        return {
          codigoKosher: ck,
          precio,
          data: dataPorPrecio,
          cantidadCajas: dataPorPrecio.reduce((acc, item) => acc + item.cantidadCajas, 0),
          cantidadPallet: dataPorPrecio.length,
          pesoNeto: dataPorPrecio.reduce((acc, item) => acc + item.pesoNeto, 0),
          pesoBruto: dataPorPrecio.reduce((acc, item) => acc + item.pesoBruto, 0)
        };
      });
    });
  }
 
  sumarPreciosPorPeso(precioData: PrecioData[]): number {
    return precioData.reduce((suma, pd) => 
      suma + pd.data.reduce((subtotal, d) => subtotal + (d.precio / 1000) * d.pesoNeto, 0)
    , 0);
  }
  
  
}
