import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Producto } from 'src/app/13_SIR_Compras.Reportes/interfaces/Producto.interface';
import { Unidad } from 'src/app/13_SIR_Compras.Reportes/interfaces/Unidad.interface';
import { GestionComprasServiceTsService } from 'src/app/13_SIR_Compras.Reportes/services/gestion-compras.service.ts.service';

@Component({
  selector: 'app-ver-productos',
  templateUrl: './ver-productos.component.html',
  styleUrls: ['../../../css/estilos.css','./ver-productos.component.css']
})
export class VerProductosComponent implements OnInit {
  
    productoExistente:Producto[] = [];
    unidades: Unidad[] =[];
    filaSeleccionada: any = null; // Almacena La fila seleccionada
    editarProductoLlamarComponente: boolean = false;
  id:number = 9;
  
  ngOnInit(): void {
    this.iniciar();

  }




  async iniciar(){
    await this.getListaDeProductos();
    this.productoExistente = this.productoExistente.filter(p => p.activo == true);
    await this.getListaDeUnidades();


  }

    async getListaDeProductos(): Promise<void> {
      try {
        this.productoExistente = await lastValueFrom(this.comprasService.getListaDeProductosAsync());
      } catch(error) {
        console.error(error)
      }
    }
    async editarEstadoProductoEliminar(producto: Producto): Promise<boolean> {
      try {
        await lastValueFrom(this.comprasService.editarProducto(producto));
        return true;
      } catch(error) {
        console.error(error)
        return false;
      }
    }
    async eliminarProductoBd(idProducto:number): Promise<void> {
      try {
        await lastValueFrom(this.comprasService.eliminarProducto(idProducto));
      } catch(error) {
        console.error(error)

      }
    }
    async getListaDeUnidades(): Promise<void> {
      try {
        this.unidades = await lastValueFrom(this.comprasService.getListaDeUnidadProductoAsync());
      } catch(error) {
        console.error(error)
      }
    }

   constructor (private comprasService: GestionComprasServiceTsService,private router: Router) {}

  
  getNombreDesdeId(array: any[],id: number,nombrePropiedadId:string,nombrePropiedadNombre:string): string {
    return this.comprasService.getNombreDesdeId(id, array, nombrePropiedadId, nombrePropiedadNombre);
  }



  seleccionarFila(event: any): void {
    this.filaSeleccionada = event.data; // Guarda el objeto seleccionado
  }
  
  desSeleccionarFila(event: any): void {
    this.filaSeleccionada = null; // Limpia la selección
  }

  async eliminarProducto(){

    const confirmaEliminar = await this.comprasService.mostrarConfirmacion('¿Seguro que desea eliminar el producto?','No podrás revertir esta acción','warning',true,'Sí, Eliminar','Cancelar');
    // Si da cancelar sale de la función, de lo contrario sigue el código
    if(!confirmaEliminar)
      return;


    if(this.filaSeleccionada.idProducto){
        
      // Actualizo el producto a estado 0

      let producto: Producto ={
        activo: false,
        codigoDeProducto: this.filaSeleccionada.codigoDeProducto,
        codigoDeProductoAlternativo: this.filaSeleccionada.codigoDeProductoAlternativo,
        codigoDeProductoAlternativo2: this.filaSeleccionada.codigoDeProductoAlternativo2,
        descripcion: this.filaSeleccionada.descripcion,
        fechaDeActualizacion: this.filaSeleccionada.fechaActualizacion,
        fechaDeRegistro: this.filaSeleccionada.fechaDeRegistro,
        idProducto: this.filaSeleccionada.idProducto,
        idUnidad: this.filaSeleccionada.idUnidad,
        nombre: this.filaSeleccionada.nombre
      };
      if(await this.editarEstadoProductoEliminar(producto)){

       await this.iniciar();
        this.comprasService.mostrarMensajeExito('El producto ha sido eliminado');
      }
    }

  }

  editarProducto(){
    if (this.filaSeleccionada && this.filaSeleccionada.idProducto) {
      this.comprasService.setProductoEditar(this.filaSeleccionada);
      console.log(this.filaSeleccionada.idProducto);
      this.router.navigate(['/principal/compras/crearProducto']);
    }else{
      console.error("No id")
    }
  }

}
