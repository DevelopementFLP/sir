import { Component, OnInit } from '@angular/core';
import { Almacen } from 'src/app/13_SIR_Compras.Reportes/interfaces/Almacen.interface';
import { Empresa } from 'src/app/13_SIR_Compras.Reportes/interfaces/Empresa.interface';
import { Producto } from 'src/app/13_SIR_Compras.Reportes/interfaces/Producto.interface';
import { StockProducto } from 'src/app/13_SIR_Compras.Reportes/interfaces/StockProducto.interface';
import { GestionComprasServiceTsService } from 'src/app/13_SIR_Compras.Reportes/services/gestion-compras.service.ts.service';

@Component({
  selector: 'app-stock-producto',
  templateUrl: './stock-producto.component.html',
  styleUrls: ['../../../css/estilos.css','./stock-producto.component.css']
})
export class StockProductoComponent implements OnInit{

  stockProducto: StockProducto[] = [];
  almacenes: Almacen[] = [];
  productos: Producto[] = [];
  empresas: Empresa[] = [];
  mostrarPopUp: boolean = false;



  async ngOnInit(): Promise<void> {

    // await this.GetListaDeEmpresas();
    console.log(this.stockProducto.length);
    
  }

  constructor (private comprasService: GestionComprasServiceTsService) {}

  // async getListaDeStock(): Promise<void> {
  //   try {
  //     this.stockProducto = await lastValueFrom(this.comprasService.getlistadest());
  //   } catch(error) {
  //     console.error(error)
  //   }
  // }


  getNombreDesdeId(array: any[],id: number,nombrePropiedadId:string,nombrePropiedadNombre:string): string {
    return this.comprasService.getNombreDesdeId(id, array, nombrePropiedadId, nombrePropiedadNombre);
  }
}
