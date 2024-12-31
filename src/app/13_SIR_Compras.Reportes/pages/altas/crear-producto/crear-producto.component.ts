import { Component, Input, OnInit } from '@angular/core';
import { Producto } from '../../../interfaces/Producto.interface';
import { Unidad } from '../../../interfaces/Unidad.interface';
import { GestionComprasServiceTsService } from 'src/app/13_SIR_Compras.Reportes/services/gestion-compras.service.ts.service';
import { lastValueFrom } from 'rxjs';
import { ProductoAtributo } from 'src/app/13_SIR_Compras.Reportes/interfaces/ProductoAtributo.interface';
import { Atributos } from 'src/app/13_SIR_Compras.Reportes/interfaces/Atributos.interface';
import { FormControl } from '@angular/forms';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['../../../css/estilos.css', './crear-producto.component.css']
})


export class CrearProductoComponent implements OnInit{
 
  listaAtributosAgregados: ProductoAtributo[] =[];
  listaDeAtributosExistentes: Atributos[] = [];
  listaDeAtributosExistentesFiltro: Atributos[] = [];
  listaDeProductoAtributoExistentes: ProductoAtributo[] =[];
  listaDeAtributosValor: ProductoAtributo[] = [];
  listaDeAtributosValorFiltro: ProductoAtributo[] = [];
  idAtributoSeleccionado!: number;
  nombreAtributoSeleccionado = ''; // Modelo para el campo de búsqueda
  valorAtributoSeleccionado!: string;
  deshabilitarInputValor: boolean = false;
  habilitarAgregarAtributo: boolean = false;
  idProductoCreado!: number;
  textoFiltro: string = ''; // Texto filtrado
  mostrarAgregar: boolean = false; // Mostrar opción "Agregar"

  atributoSelecionado!: Atributos | null;
  ValorSeleccionado!: ProductoAtributo | null;
  productoEditando!: Producto | null;
  estaEditando: boolean = false;
  listaAtributosProductoEditando: ProductoAtributo[] = [];



  // Revisar estas variables si todas las uso
  @Input() productoEditar!: Producto;
  idProducto: number | undefined = 0;
  codigoProducto: string | undefined ="";
  codigoProductoAlternativo: string | undefined ="";
  codigoProductoAlternativo2: string  | undefined ="";
  fechaCreacion: Date = new Date;
  fechaActualizacion: Date = new Date;
  nombre: string | undefined ="";
  idUnidad: number | undefined = 0;
  descripcion: string | undefined = "";
  productoCrear!: Producto;
  productoExistente:Producto[] = [];
  unidades: Unidad[] =[];
  unidadSeleccionada:number=0;
  mostrarPopUp: boolean = false;

  mostrarUnoEnUno: boolean = false;
 
  async ngOnInit(): Promise<void> {


    
    await this.iniciar();
    this.listaDeAtributosExistentesFiltro = this.listaDeAtributosExistentes;
    this.productoEditando = this.comprasService.getProductoEditar();
    if(this.productoEditando){
      this.estaEditando = true;
      this.setearVariablesEditando();
    }
  }

  setearVariablesEditando(){
    this.nombre = this.productoEditando?.nombre;
    this.codigoProducto = this.productoEditando?.codigoDeProducto;
    this.codigoProductoAlternativo = this.productoEditando?.codigoDeProductoAlternativo;
    this.codigoProductoAlternativo2 = this.productoEditando?.codigoDeProductoAlternativo2;
    this.descripcion = this.productoEditando?.descripcion;
    this.idProducto = this.productoEditando?.idProducto;
    this.idUnidad = this.productoEditando?.idUnidad;
    this.listaAtributosProductoEditando = this.listaDeProductoAtributoExistentes.filter(l => l.idProducto == this.idProducto);
      this.listaAtributosProductoEditando.forEach(l => {   
        this.listaAtributosAgregados.push({
          idProductoAtributo: l.idProductoAtributo,
          idProducto: l.idProducto,
          idAtributo: l.idAtributo,
          valor: l.valor
        })
      });
  }

  seleccionarAtributo(nombre: string, idAtributo: number,dropdown: any) {
    this.nombreAtributoSeleccionado = nombre; // Actualiza el campo de entrada con el elemento seleccionado
    this.idAtributoSeleccionado = idAtributo; // Almacena el elemento seleccionado
    //  Guardo los valores que ya se han usado y filtro para que aparezca solo 1 vez el valor y no se duplique
    this.listaDeAtributosValor = this.listaDeProductoAtributoExistentes.filter(c => c.idAtributo == this.idAtributoSeleccionado).filter((value, index, self) => // Filtramos nombres duplicados
    index === self.findIndex((t) => (
      t.valor === value.valor // Comparamos los nombres
    ))
  );;
    this.listaDeAtributosValorFiltro = this.listaDeAtributosValor;
    this.valorAtributoSeleccionado = "";
    this.textoFiltro ="";
    this.limpiarFiltroDropDown(dropdown);
  }


  constructor (private comprasService: GestionComprasServiceTsService,private router: Router) {}


  // Cuando se filtra si no encuentra permite agregarlo
onFilter(event: any) {
  this.textoFiltro = event.filter;
  console.log(this.textoFiltro);
  console.log(this.listaDeAtributosValorFiltro.some(atributo => atributo.valor.toLowerCase() === this.textoFiltro.toLowerCase()));
  this.mostrarAgregar = !this.listaDeAtributosValorFiltro.some(
    atributo => atributo.valor.toLowerCase() === this.textoFiltro.toLowerCase()
  );
}

  async getListaDeProductos(): Promise<void> {
    try {
      this.productoExistente = await lastValueFrom(this.comprasService.getListaDeProductosAsync());
    } catch(error) {
      console.error(error)
    }
  }
  async getListaDeAtributos(): Promise<void> {
    try {
      this.listaDeAtributosExistentes = await lastValueFrom(this.comprasService.getListaDeAtributossync());
    } catch(error) {
      console.error(error)
    }
  }
  async getListaDeProductoAtributo(): Promise<void> {
    try {
      this.listaDeProductoAtributoExistentes = await lastValueFrom(this.comprasService.getListaDeProductoAtributo());
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
      const productoCreado = await lastValueFrom(this.comprasService.crearProducto(producto));
      this.idProductoCreado = -1;
      this.idProductoCreado = productoCreado.idProducto;
    } catch (error) {
      console.error(error);
      
    }
  }
  async editarProductoBd(producto: Producto): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.editarProducto(producto));
    } catch (error) {
      console.error(error);
      
    }
  }
  
  async crearProductoAtributoInsert(productoatributo: ProductoAtributo): Promise<boolean> {
    try {
      await lastValueFrom(this.comprasService.crearProductoAtributoAtributoInsert(productoatributo));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async borrarFilaDelete(id: number): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.eliminarProducto(id));
    } catch (error) {
      console.error(error);
    }
  }
  
  async borrarProductoAtributo(id: number): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.eliminarProductoAtributo(id));
    } catch (error) {
      console.error(error);
    }
  }
  
  async iniciar(){
    await this.getListaDeProductos();
    this.productoExistente = this.productoExistente.filter(p => p.activo == true);
    await this.getListaDeUnidades();
    await this.getListaDeAtributos();
    await this.getListaDeProductoAtributo();
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
      codigoDeProducto: this.codigoProducto!,
      codigoDeProductoAlternativo: this.codigoProductoAlternativo!,
      codigoDeProductoAlternativo2: this.codigoProductoAlternativo2!,
      fechaDeRegistro: new Date(),
      fechaDeActualizacion: new Date(),
      nombre: this.nombre!,
      idUnidad: Number(this.idUnidad),
      descripcion: this.descripcion!,
      activo: true
    }
    console.log(this.productoCrear);

    // Inserto en la tabla productos
    await this.crearProductoInsert(this.productoCrear);

    // Inserto en la tabla producto atributo
    if(this.listaAtributosAgregados.length>0){
      // Actualizo valor idproducto y lo inserto
      this.listaAtributosAgregados.forEach(async p => {
        let  atributoAgregar: ProductoAtributo;
        atributoAgregar = {
          idAtributo:p.idAtributo,
          idProducto: this.idProductoCreado,
          idProductoAtributo: p.idProductoAtributo,
          valor:p.valor
        }
        console.log(atributoAgregar);
        await this.crearProductoAtributoInsert(atributoAgregar);

      });
    }
    
    // Muestro cartel de producto creado
    this.comprasService.mostrarMensajeExito('¡El producto fue creado correctamente!')

    // Actualizo los datos y limpio los campos

    

    await this.iniciar();
    this.mostrarPopUp = false;
    this.nombre ="";
    this.descripcion = "";
    this.codigoProducto ="";
    this.codigoProductoAlternativo="";
    this.codigoProductoAlternativo2 = "";
    this.listaAtributosAgregados = [];
}


  async editarProducto(){
  if(this.validarDatos()==false){
    return;
  }


  this.productoCrear = {
    idProducto: this.productoEditando?.idProducto!,
    codigoDeProducto: this.codigoProducto!,
    codigoDeProductoAlternativo: this.codigoProductoAlternativo!,
    codigoDeProductoAlternativo2: this.codigoProductoAlternativo2!,
    fechaDeRegistro: new Date(),
    fechaDeActualizacion: new Date(),
    nombre: this.nombre!,
    idUnidad: Number(this.idUnidad),
    descripcion: this.descripcion!,
    activo: true
  }


   // Inserto en la tabla productos
   await this.editarProductoBd(this.productoCrear);

  //  Me fijo si agrego atributos que no estaban

  let atributosExisten = this.listaDeProductoAtributoExistentes.filter(l => l.idProducto == this.idProducto);

  // Si hay mas en la lista que los que están agregados es porque agregó más
  if(this.listaAtributosAgregados.length> atributosExisten.length){

    //  Saco de la lista los que ya están creados
    let listaParaCrear = this.listaAtributosAgregados;
    console.log(listaParaCrear);
    atributosExisten.forEach(l => {

      listaParaCrear.forEach(ll => {

        if(l.idProducto == ll.idProducto){
          // Saco ese atributo de la lista para crear
          listaParaCrear = listaParaCrear.filter(lista => lista.idProducto != l.idProducto);
        }
        
      });
      
    });

      console.log(listaParaCrear);

      listaParaCrear.forEach(async l => {
        let atributoCrear: ProductoAtributo
        atributoCrear = {
          idAtributo: l.idAtributo,
          idProducto: this.idProducto!,
          idProductoAtributo: 0,
          valor: l.valor
        }

        console.log(atributoCrear);
        if(await this.crearProductoAtributoInsert(atributoCrear)){
          this.comprasService.mostrarMensajeExito('El producto ha sido actualizado');
        }else{
          this.comprasService.mostrarMensajeDeError('El producto no se pudo actualizar');
        }

        
      });

  }

   // Actualizo los datos y limpio los campos
   await this.iniciar();
   this.mostrarPopUp = false;
   this.nombre ="";
   this.descripcion = "";
   this.codigoProducto ="";
   this.codigoProductoAlternativo="";
   this.codigoProductoAlternativo2 = "";
   this.listaAtributosAgregados = [];
   this.router.navigate(['/principal/compras/configuraciones']);
   

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

    if(this.idUnidad! <=0 ){
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


  agregarAtributoAListaProducto(){

    if(this.idAtributoSeleccionado==-1){
      alert("Seleccione un atributo");
      return;
    }

    if(this.nombreAtributoSeleccionado =""){
      alert("Ingrese un atributo");
      return;
    }
    if(this.valorAtributoSeleccionado == ""){
      alert("Escriba un valor para el producto seleccionado");
      return;
    }


    // Me fijo si ya agregó ese producto
    const atributoAgregado = this.listaAtributosAgregados.filter(a => a.idAtributo == this.idAtributoSeleccionado);
    if(atributoAgregado.length>0){
      alert("El producto agregado ya existe");
      return;
    }

    this.listaAtributosAgregados.push({
      idProductoAtributo: 0,
      idProducto: 0,
      idAtributo: Number(this.idAtributoSeleccionado),
      valor: this.valorAtributoSeleccionado
    })

    this.idAtributoSeleccionado =-1;
    this.nombreAtributoSeleccionado="";
    this.valorAtributoSeleccionado="";
    this.listaDeAtributosValor= [];
    this.habilitarAgregarAtributo = false;
  }

  async eliminarAtributoListaAgregado(idAtributo:number, idProductoAtributo: number){

    if(this.estaEditando){

      // Si está editando elimino directamente de la bd el valor

      const confirmaEliminar = await this.comprasService.mostrarConfirmacion('¿Seguro que desea eliminar el Atributo del producto?','No podrás revertir esta acción','warning',true,'Sí, Eliminar','Cancelar');
    // Si da cancelar sale de la función, de lo contrario sigue el código
    if(!confirmaEliminar)
      return;

      await this.borrarProductoAtributo(idProductoAtributo);
      this.listaAtributosAgregados = this.listaAtributosAgregados.filter(l => l.idProductoAtributo !=idProductoAtributo);
      console.log(this.listaAtributosAgregados);
      await this.iniciar();


      // Filtro lista de atributos para que no agregue los que ya están agregados
      this.filtrarAtributos();

    }else{

      this.listaAtributosAgregados = this.listaAtributosAgregados.filter(a => a.idAtributo!=idAtributo);
      this.filtrarAtributos();
      
    }
  }

  filtrarAtributos(){
// Filtro lista de atributos para que no agregue los que ya están agregados
this.listaDeAtributosExistentesFiltro = this.listaDeAtributosExistentes;
this.listaAtributosAgregados.forEach(p => {
  this.listaDeAtributosExistentesFiltro = this.listaDeAtributosExistentesFiltro.filter(l => l.idAtributo!=p.idAtributo);
});
  }

  agregarAtributoProductoDesdeTabla(valor:string,dropdown: any){
    this.valorAtributoSeleccionado = valor;


    // Agrego valor a la tabla
    this.agregarAtributoAListaProducto();
    
    // Filtro las variables 

    this.filtrarAtributos();
    // Limpio los campos para poder ingresar nuevos desde cero
    this.ValorSeleccionado = null;
    this.atributoSelecionado = null;
    this.listaDeAtributosValorFiltro =[];
    this.textoFiltro = "";

    this.limpiarFiltroDropDown(dropdown);


  }

  limpiarFiltroDropDown(dropdown: any){
    dropdown.filterValue = '';
    dropdown.resetFilter();
    this.textoFiltro ="";
    this.mostrarAgregar = false;
  }

  mostrarSeleccionado(): void {
    console.log(this.atributoSelecionado);
    console.log(this.ValorSeleccionado);
    
  }

}
