import { Component, OnInit } from '@angular/core';
import { AreaDestino } from '../../interfaces/AreaDestinto.interface';
import { Producto } from '../../interfaces/Producto.interface';
import { Unidad } from '../../interfaces/Unidad.interface';
import { Prioridad } from '../../interfaces/Prioridad.interface';
import { LineadeSolicitud } from '../../interfaces/LineaDeSolicitud.interface';
import { OrdenDeSolicitud } from '../../interfaces/OrdenDeSolicitud.interface';
import { Usuario } from '../../interfaces/Usuario.interface';
import { GestionComprasServiceTsService } from '../../services/gestion-compras.service.ts.service';
import { EstadoDeSolicitud } from '../../interfaces/EstadoDeSolicitud.interface';
import { lastValueFrom } from 'rxjs';
import { CentroDeCosto } from '../../interfaces/CentroDeCosto.interface';
import { Empresa } from '../../interfaces/Empresa.interface';
import { Departamento } from '../../interfaces/Departamento.interface';
import { SessionManagerService } from 'src/app/shared/services/session-manager.service';
import { ListaUsuariosSir } from '../../interfaces/ListaUsuariosSir.interface';


@Component({
  selector: 'app-solicitud-compra',
  templateUrl: './solicitud-compra.component.html',
  styleUrls: ['../../css/estilos.css','./solicitud-compra.component.css']
})
export class SolicitudCompraComponent implements OnInit{
  
  mostrarProductos: boolean = false;
  idArea!: number | undefined;
  areaDestino: AreaDestino[] = [];
  idProducto!: number;
  idOrden!: number;
  cantidad!: number;
  nombreProducto!: string;
  nombreUnidad!: string;
  codigoProducto!: string;
  idOrdenCreada!: number;
  ordenCompraExistente: OrdenDeSolicitud[] = [];
  solicitudExistente: LineadeSolicitud[] = [];
  solicitudExistenteFiltrada: LineadeSolicitud[] = [];
  productosActivos: Producto[] = [];
  unidadesActivas: Unidad[] = [];
  departamentosExistentes: Departamento[] = [];
  prioridadesActivas: Prioridad[] = [];
  centroDeCostos: CentroDeCosto[] = [];
  centroDeCostosFiltrados: CentroDeCosto[] = [];
  idCentroDeCosto!: number;
  crearLineaDeSolicitud: LineadeSolicitud[] = [];
  lineaDeSolicitudParaCrear: LineadeSolicitud[] = [];
  fechaNecesidad!: Date;
  crearOrdenDeSolicitud!: OrdenDeSolicitud;
  usuariosExistente: Usuario[] = [];
  usuariosANotificar: Usuario[] = [];
  idUsuarioANotificar!: number;
  idUsuarioSolicitante: number = 4;
  idEstadoSolicitud: number = 2;
  estadoDeSolicitud: EstadoDeSolicitud[] = [];
  idPrioridad!: number;
  empresas: Empresa[] = [];
  idEmpresa!: number;
  tablamostrar:boolean = false;
  mostrarTodasFilas: boolean = true;
  mostrarPopUp: boolean = false;
  mostrarUsuarios: boolean = false;
  idOrdenDeSolicitudDesplegar: number=-1;
  usuarioActualSir = this.sessionManagerService.parseUsuario((this.sessionManagerService.getCurrentUser()!))
  listaUsuariosSir: ListaUsuariosSir[] =[];
  comentario:string ="";


  minFecha: string = "";
  
  async ngOnInit(): Promise<void> {      
      await this.iniciar();
      console.log(this.ordenCompraExistente);
      console.log(this.empresas);
      console.log(this.productosActivos);
  }

  constructor (
    private comprasService: GestionComprasServiceTsService,
    private sessionManagerService: SessionManagerService) {}
  
    async getListaUsuariosSir(): Promise<void> {
      try {
        this.listaUsuariosSir = await lastValueFrom(this.comprasService.getListaDeUsuariosSirAsync());
      } catch(error) {
        console.error(error)
      }
    }

  async getListaDeUnidades(): Promise<void> {
    try {
      this.unidadesActivas = await lastValueFrom(this.comprasService.getListaDeUnidadProductoAsync());
    } catch(error) {
      console.error(error)
    }
  }
  async getListaDeAreaDestino(): Promise<void> {
    try {
      this.areaDestino = await lastValueFrom(this.comprasService.getListaDeAreaDestinosasync());
    } catch(error) {
      console.error(error)
    }
  }
  async getListaDeProductos(): Promise<void> {
    try {
      this.productosActivos = await lastValueFrom(this.comprasService.getListaDeProductosAsync());
    } catch(error) {
      console.error(error)
    }
  }
  async getListaDePrioridades(): Promise<void> {
    try {
      this.prioridadesActivas = await lastValueFrom(this.comprasService.getListaDePrioridadesDeOrdenesasync());
    } catch(error) {
      console.error(error)
    }
  }
  async getListaDeEstadosDeSolicitudes(): Promise<void> {
    try {
      this.estadoDeSolicitud = await lastValueFrom(this.comprasService.getListaDeEstadoDeSolicitudesasync());
    } catch(error) {
      console.error(error)
    }
  }
  async getListaDeUsuarios(): Promise<void> {
    try {
      this.usuariosExistente = await lastValueFrom(this.comprasService.getListaDeUsuariosAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async crearOrdenSolicitudInsert(orden: OrdenDeSolicitud): Promise<void> {
    try {
      const ordenCreada = await lastValueFrom(this.comprasService.crearOrdenDeSolicitud(orden));
      this.idOrdenCreada = -1;
      this.idOrdenCreada = ordenCreada.idOrdenDeSolicitud;
    } catch (error) {
      console.error(error);
      
    }
  }
  async crearLineaDeSolicitudInsert(orden: LineadeSolicitud[]): Promise<void> {
    try {
      await lastValueFrom(this.comprasService.CrearLineaDeSolicitud(orden));
    } catch (error) {
      console.error(error);
      
    }
  }

  async iniciar(): Promise<void> {
    const [
      listaUnidades, 
      listaAreaDestino, 
      listaProductos, 
      listaPrioridades, 
      listaUsuarios,
      listaEstados,
      centroDeCosto,
      empresas,
      listaOrdenDeSolicitud,
      listaLineaDeSolicitud,
      listaDeDepartamentos,
      listaDeUsuariosSir
    ] = await Promise.all([
      await lastValueFrom(this.comprasService.getListaDeUnidadProductoAsync()),
      await lastValueFrom(this.comprasService.getListaDeAreaDestinosasync()),
      await lastValueFrom(this.comprasService.getListaDeProductosAsync()),
      await lastValueFrom(this.comprasService.getListaDePrioridadesDeOrdenesasync()),
      await lastValueFrom(this.comprasService.getListaDeUsuariosAsync()),
      await lastValueFrom(this.comprasService.getListaDeEstadoDeSolicitudesasync()),
      await lastValueFrom(this.comprasService.getListaDeCentroDeCostosasync()),
      await lastValueFrom(this.comprasService.getListaDeEmpresasAsync()),
      await lastValueFrom(this.comprasService.getListaDeOrdenesDeSolicitudasync()),
      await lastValueFrom(this.comprasService.getListaDeLineasSolicitudasync()),
      await lastValueFrom(this.comprasService.getListaDeDepartamentosAsync()),
      await lastValueFrom(this.comprasService.getListaDeUsuariosSirAsync())
    ]);

    try {
      this.unidadesActivas = listaUnidades;
    } catch (error) {
      console.error(error)
    }

    try {
      this.areaDestino = listaAreaDestino;
    } catch (error) {
      console.error(error)
    }

    try {
      this.productosActivos = listaProductos;
    } catch (error) {
      console.error(error)
    }

    try {
      this.prioridadesActivas = listaPrioridades;
    } catch (error) {
      console.error(error)
    }

    try {
      this.usuariosExistente = listaUsuarios;
    } catch (error) {
      console.error(error)
    }
    try {
      this.estadoDeSolicitud = listaEstados;
    } catch (error) {
      console.error(error)
    }

    
    try {
      this.centroDeCostos = centroDeCosto;
    } catch (error) {
      console.error(error)
    }
    try {
      this.empresas = empresas;
    } catch (error) {
      console.error(error)
    }
    try {
      this.ordenCompraExistente = listaOrdenDeSolicitud;
      this.ordenCompraExistente = this.ordenCompraExistente.filter(e => e.idUsuarioSolicitante == this.idUsuarioSolicitante )
    } catch (error) {
      console.error(error)
    }
    try {
      this.solicitudExistente = listaLineaDeSolicitud;
    } catch (error) {
      console.error(error)
    }
    try {
      this.departamentosExistentes = listaDeDepartamentos;
    } catch (error) {
      console.error(error)
    }
    try { 
      this.listaUsuariosSir = listaDeUsuariosSir;
    } catch (error) {
      console.error(error)
    }
    this.setMinFecha();
  }


  async crearOrdenSolicitud(){

    // Creo orden de solicitud
    this.crearOrdenDeSolicitud = {
      fechaDecreacion: new Date(),
      idCentroDeCosto: Number(this.idCentroDeCosto),
      idEmpresa: Number(this.idEmpresa),
      idEstadoDeSolicitud: Number(this.idEstadoSolicitud),
      idOrdenDeSolicitud:0,
      idPriodidadDeOrden: Number(this.idPrioridad),
      idUsuarioSolicitante:Number(this.idUsuarioSolicitante),
      fechaDeNecesidad: this.fechaNecesidad,
      idUsuarioParaNotificar: Number(this.idUsuarioANotificar)
    }
    this.idOrdenCreada = -1;
    await this.crearOrdenSolicitudInsert(this.crearOrdenDeSolicitud)
    if(this.idOrdenCreada == -1)
      return alert("No se pudo crear la orden");
    
    this.lineaDeSolicitudParaCrear.forEach(c => {
      c.idOrdenDeSolicitud = this.idOrdenCreada;
    });

    // Crear linea de solicitud 
  await this.crearLineaDeSolicitudInsert(this.lineaDeSolicitudParaCrear);
    this.idProducto = 0;
    this.nombreProducto = "";
    this.idArea = undefined;
    this.cantidad = 0;
    this.idUsuarioANotificar =-1;
    this.iniciar()
    this.mostrarPopUp = false;

  }

  agregarProducto(){
    if(this.validarDatos() == false){
      return;
    }

    if(this.existeProducto() == true){
      return;
    }
   
   this.lineaDeSolicitudParaCrear.push({

     idLineaDeSolicitud: 0,
     idOrdenDeSolicitud: 0,
     idProducto: this.idProducto,
     idAreaDestino: Number(this.idArea),
     cantidad: this.cantidad,
     comentario: this.comentario
   })

this.idProducto = 0;
this.nombreProducto = "";
this.idArea = undefined;
this.cantidad = 0;

console.log(this.idEmpresa);

  }

  getUnidadDeProducto(idProducto: number): number{

    const producto = this.productosActivos.find(p => p.idProducto === idProducto);
    console.log(producto?.idUnidad);
    return producto?.idUnidad || -1;
  }
  
  seleccionarProducto(idProducto:number,nombre:string, codigoProducto:string){

    console.log(this.idArea);
    this.idProducto = idProducto;
    this.nombreProducto = nombre;
    this.codigoProducto = codigoProducto;
    this.mostrarProductos = false;

  }

  cerrarPopUpVerProductos(){
    this.mostrarProductos = false;
  }

  abrirPopUpMostrarProductos(){
    this.mostrarProductos = true;
  }


  validarDatos(): boolean{

    console.log(this.idEmpresa);
    // if(this.idEmpresa)

    if(this.idEmpresa == undefined){
      alert("Seleccione la empresa");
      return false;
    }

    if(this.idCentroDeCosto == undefined){
      alert("Seleccione el centro de costo");
      return false;
    }

    if(this.idPrioridad == undefined){
      alert("Seleccione la prioridad de la solicitud");
      return false;
    }

    if(this.fechaNecesidad == undefined){
      alert("Ingrese la fecha de necesidad");
      return false;
    }

    if(this.nombreProducto == undefined || this.nombreProducto == "" || this.idProducto == undefined){
      alert("Seleccione el producto a solicitar");
      return false;
    }

    if(this.cantidad <=0 || this.cantidad == undefined){
      alert("Ingrese una cantidad mayor a 0")
      return false;
    }

    if(this.idArea == undefined){
      alert("Ingrese el área de destino");
      return false
    }



    return true;
  }

  existeProducto(): boolean{
    let existe: boolean = false;
    
    if(this.lineaDeSolicitudParaCrear.find(e => e.idProducto == this.idProducto)){
      existe = true;
      alert("El producto ingresado ya está en la lista");
      return true;
    }
    
    return false;
  }

  mostrarPopUpSolicitudCompra(){
    this.mostrarPopUp = true;
  }

  cerrarPopUpSolicitudCompra(){
    this.mostrarPopUp = false;
  }

  desplegarFila(id: number) {
    if(this.idOrdenDeSolicitudDesplegar == id){
      this.idOrdenDeSolicitudDesplegar = -1;
      this.mostrarTodasFilas = true;
    }else{
      this.idOrdenDeSolicitudDesplegar = id;
      this.mostrarTodasFilas = false;
    }
    this.solicitudExistenteFiltrada = this.solicitudExistente;
    this.solicitudExistenteFiltrada = this.solicitudExistenteFiltrada.filter(se => se.idOrdenDeSolicitud == id);
  }

  contarLineas(id:number): number{

    const ordenesFiltradas = this.solicitudExistente;
    console.log(ordenesFiltradas.filter(se => se.idOrdenDeSolicitud == id))
    const cantidadLineas = ordenesFiltradas.filter(se => se.idOrdenDeSolicitud == id);
    return cantidadLineas.length;
  }


  getNombreDesdeId(array: any[],id: number,nombrePropiedadId:string,nombrePropiedadNombre:string): string {
    return this.comprasService.getNombreDesdeId(id, array, nombrePropiedadId, nombrePropiedadNombre);
  }


  CalcularResumen(idEstado:number):number{

    const ordenResumen = this.ordenCompraExistente.filter(p => p.idEstadoDeSolicitud == idEstado);
    console.log(ordenResumen);
    return ordenResumen.length | 0;

  }

  setearCentroDeCosto(idEmpresa: number){
    this.centroDeCostosFiltrados = this.centroDeCostos;
    this.centroDeCostosFiltrados = this.centroDeCostosFiltrados.filter(c => c.idEmpresa == idEmpresa);
    console.log(this.fechaNecesidad);
  }

  setMinFecha() {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = ('0' + (hoy.getMonth() + 1)).slice(-2); // Meses de 01 a 12
    const dia = ('0' + hoy.getDate()).slice(-2); // Días de 01 a 31

    // Construir la fecha mínima en formato YYYY-MM-DD
    this.minFecha = `${anio}-${mes}-${dia}`;
  }

  seleccionarUsuario(idUsuario: number,idDepartamento:number,idRol:number,idUsuarioSir: number,correoElectronico: string){

    this.usuariosANotificar.push({
      idUsuarioSolicitante: idUsuario,
      idDepartamento: idDepartamento,
      idRol: idRol,
      idUsuarioSir: idUsuarioSir,
      correoElectronico: correoElectronico
    })

    this.idUsuarioANotificar = idUsuario;
    console.log(this.usuariosANotificar);
    
    this.mostrarUsuarios = false;
  }


  eliminarUsuarioANotificar(idUsuario:number){

    this.usuariosANotificar = this.usuariosANotificar.filter(p => p.idUsuarioSolicitante!=idUsuario);
  }

  mostrarTodas(){
    this.mostrarTodasFilas = true;
    this.idOrdenDeSolicitudDesplegar = -1;
  }
}