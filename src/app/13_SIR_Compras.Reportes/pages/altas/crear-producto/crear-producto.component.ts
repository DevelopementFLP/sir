import { Component, OnInit } from '@angular/core';
import { Producto } from '../../../interfaces/Producto.interface';
import { Unidad } from '../../../interfaces/Unidad.interface';
import { GestionComprasServiceTsService } from 'src/app/13_SIR_Compras.Reportes/services/gestion-compras.service.ts.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['../../../css/estilos.css', './crear-producto.component.css']
})


export class CrearProductoComponent implements OnInit{
 
  idProducto: number = 0;
  codigoProducto: string ="";
  codigoProductoAlternativo: string ="";
  codigoProductoAlternativo2: string ="";
  fechaCreacion: Date = new Date;
  fechaActualizacion: Date = new Date;
  nombre: string ="";
  idUnidad: number = 0;
  descripcion: string = "";
  productoExistente:Producto[] = [];
  productoCrear!: Producto;
  unidades: Unidad[] =[];
  unidadSeleccionada:number=0;
  mostrarPopUp: boolean = false;

  mostrarUnoEnUno: boolean = false;
 
  async ngOnInit(): Promise<void> {

    await this.iniciar();
  }

  constructor (private comprasService: GestionComprasServiceTsService) {}

  async getListaDeProductos(): Promise<void> {
    try {
      this.productoExistente = await lastValueFrom(this.comprasService.getListaDeProductosAsync());
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

  async crearProductoInsert(producto: Producto): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.crearProducto(producto));
    } catch (error) {
      console.error(error);
      
    }
  }
  async borrarFilaDelete(id: number): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.eliminarProducto(id));
    } catch (error) {
      console.error(error);
    }
  }
  
  async iniciar(){
    await this.getListaDeProductos();
    this.productoExistente = this.productoExistente.filter(p => p.activo == true);
    await this.getListaDeUnidades();


  }

  async crearProducto(){

    if(this.validarDatos()==false){
      return;
    }

    // Verificar que no exista ya ese código en la bd
      // Codigo para verificar
    if(this.existeProducto() == true){
      return;
    }

    // Ingresar producto
    // Si todo es válido lleno el array y creo el producto

    this.productoCrear = {
      idProducto: 0,
      codigoDeProducto: this.codigoProducto,
      codigoDeProductoAlternativo: this.codigoProductoAlternativo,
      codigoDeProductoAlternativo2: this.codigoProductoAlternativo2,
      fechaDeRegistro: new Date(),
      fechaDeActualizacion: new Date(),
      nombre: this.nombre,
      idUnidad: Number(this.idUnidad),
      descripcion: this.descripcion,
      activo: true
    }
    console.log(this.productoCrear);
    await this.crearProductoInsert(this.productoCrear);
    await this.iniciar();
    this.mostrarPopUp = false;
    this.nombre ="";
    this.descripcion = "";
    this.codigoProducto ="";
    this.codigoProductoAlternativo="";
    this.codigoProductoAlternativo2 = "";
    
}


  validarDatos(): boolean{
    if(this.nombre==""){
      alert("Ingrese un nombre para el producto");
      return false;
    }
    if(this.descripcion==""){
      alert("Ingrese una descripción para el producto");
      console.log(this.descripcion);
      return false;
    }

    if(this.idUnidad <=0 ){
      alert("Ingrese la unidad del producto");
      return false;
    }

    if(this.codigoProducto==""){
      alert("Ingrese el código del producto");
      return false;
    }

    if(this.codigoProductoAlternativo==""){
      alert("Ingrese el código Alternativo del producto");
      return false;
    }
    
    if(this.codigoProductoAlternativo2==""){
      alert("Ingrese el código alternativo 2 del producto");
      return false;
    }

    return true;

  }


  existeProducto(): boolean{
    let existe: boolean = false;
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.productoExistente.find(e => e.codigoDeProducto == this.codigoProducto)){
      existe = true;
      alert("El código del producto ingresado ya existe");
      return true;
    }
    if(this.productoExistente.find(e => e.codigoDeProductoAlternativo == this.codigoProductoAlternativo)){
      existe = true;
      alert("El código ingresado del producto alternativo ya existe");
      return true;
    }
    if(this.productoExistente.find(e => e.codigoDeProductoAlternativo2 == this.codigoProductoAlternativo2)){
      existe = true;
      alert("El código ingresado del producto alternativo 2  ya existe");
      return true;
    }
    
    return false;
  }

  getNombreDesdeId(array: any[],id: number,nombrePropiedadId:string,nombrePropiedadNombre:string): string {
    return this.comprasService.getNombreDesdeId(id, array, nombrePropiedadId, nombrePropiedadNombre);
  }

  getNombreUnidad(idUnidad: number){

    const unidades = this.unidades.find(p => p.idUnidad === idUnidad);
    return unidades?.nombre.toString() ;
  }

  cerrarPopUpCrearProducto(){
    this.mostrarPopUp = false;
  }

  mostrarPopUpCrearProducto(){
    this.mostrarPopUp = true;
  }

  async borrarFila(id: number){

    await this.borrarFilaDelete(id);
    await this.iniciar();

  }
}
