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
import { ArchivoAdjuntoLineaDeSolicitud } from '../../interfaces/ArchivoAdjuntoLineaDeSolicitud.interface';
import { ArchivosAdjuntos } from '../../interfaces/ArchivosAdjuntos.interface';

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
  lineasCreadas: LineadeSolicitud[] = []
  ordenCompraExistente: OrdenDeSolicitud[] = [];
  ordenCompraExistenteFiltro: OrdenDeSolicitud[] = [];
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
  estadosMostrarDashboard: EstadoDeSolicitud [] = [];
  idPrioridad!: number;
  empresas: Empresa[] = [];
  idEmpresa!: number;
  tablamostrar:boolean = false;
  mostrarTodasFilas: boolean = true;
  mostrarPopUp: boolean = false;
  mostrarUsuarios: boolean = false;
  mostrarPopUpCambiarEstado: boolean = false;
  mostrarPopUpVerArchivoAdjunto: boolean = false;
  idOrdenDeSolicitudDesplegar: number=-1;
  usuarioActualSir = this.sessionManagerService.parseUsuario((this.sessionManagerService.getCurrentUser()!))
  listaUsuariosSir: ListaUsuariosSir[] =[];
  comentario:string ="";
  idEstadoCambiar!: number;
  archivoAdjuntoOrden!: File | null;
  archivoAdjuntoLineaDeSolicitud!: File | null;
  archivoLinea: File | null = null; /* Para poder resetear el archivo después de agregar el producto*/
  archivoAdjunto!: File | null;
  archivosAdjuntos: ArchivoAdjuntoLineaDeSolicitud[] =[];
  getArchivoAdjunto: ArchivosAdjuntos[] =[];
  listaArchivosAdjuntos: ArchivosAdjuntos [] = [];

  ordenVerTieneAdjunto: boolean = false;
  lineaVerTieneAdjunto: boolean = false;
  archivosAdjuntosLineas: ArchivosAdjuntos[] = [];
  archivoAdjuntoImagen!: string | null;
  nombreArchivoOrdenSolicitud: string | null = null;
  nombreArchivoLineaDeSolicitud: string | null = null;
  etiquetaArchivoOrden = 'Subir archivo';
  etiquetaArchivoLinea = 'Subir archivo';


  estaEditandoOrden: boolean = false;

  minFecha: string = "";
  


  async ngOnInit(): Promise<void> {      
      await this.iniciar();
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
  async crearArchivoAdjunto(idOrden:number,seccion:number,archivoAdjunto: File): Promise<void> {
    try {

    await lastValueFrom(this.comprasService.crearArchivoAdjunto(idOrden,seccion,archivoAdjunto));

    } catch (error) {
      console.error(error);
      
    }
  }
  async editarArchivoAdjunto(idOrden:number,seccion:number,archivoAdjunto: File): Promise<void> {
    try {

    await lastValueFrom(this.comprasService.editarArchivoAdjunto(idOrden,seccion,archivoAdjunto));

    } catch (error) {
      console.error(error);
      
    }
  }

  async crearLineaDeSolicitudInsert(orden: LineadeSolicitud[]): Promise<void> {
    try {
      this.lineasCreadas = await lastValueFrom(this.comprasService.CrearLineaDeSolicitud(orden));
      console.log(this.lineasCreadas);

    } catch (error) {
      console.error(error);
      
    }
  }

   async editarOrdenDeSolicitud(orden: OrdenDeSolicitud): Promise<void> {
      try {
        await lastValueFrom(this.comprasService.editarOrdenDeSolicitud(orden));
      } catch(error) {
        console.error(error)
      }
    }
   async editarLineaDeSolicitud(linea: LineadeSolicitud[]): Promise<void> {
      try {
        await lastValueFrom(this.comprasService.EditarLineaDeSolicitud(linea));
      } catch(error) {
        console.error(error)
      }
    }

    async eliminarOrdenDeSolicitud(idOrdenDeSolicitud:number): Promise<void> {
      try {
        await lastValueFrom(this.comprasService.eliminarOrdenDeSolicutd(idOrdenDeSolicitud));
      } catch(error) {
        console.error(error)
      }
    }
    async eliminarLineaDeSolicitud(idLinea:number): Promise<void> {
      try {
        await lastValueFrom(this.comprasService.EliminarLineaDeSolicitud(idLinea));
      } catch(error) {
        console.error(error)
      }
    }
    async getListaDeArchivosAdjuntos(idReferencia:number,seccion:number): Promise<void> {
      try {
        this.getArchivoAdjunto = await lastValueFrom(this.comprasService.getListaDeArchivosAdjuntos(idReferencia,seccion));
      } catch(error) {
        console.error(error)
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
      this.estadosMostrarDashboard = this.estadoDeSolicitud.filter(e => e.mostrarEnPantalla==true);
      // Ordeno los estados por su orden en base de datos
      this.estadosMostrarDashboard = this.estadosMostrarDashboard.sort((a,b) => a.orden - b.orden);
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
      this.ordenCompraExistente = this.ordenCompraExistente.filter(e => e.idUsuarioSolicitante == this.idUsuarioSolicitante);
      this.ordenCompraExistenteFiltro = this.ordenCompraExistente;
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
    
    if(this.estaEditandoOrden == false){
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
      
      // Inserto dato adjunto a la órden
      console.log(this.archivoAdjuntoOrden);
      if(this.archivoAdjuntoOrden)
      await this.crearArchivoAdjunto(this.idOrdenCreada,1,this.archivoAdjuntoOrden);
      
      
      // Crear linea de solicitud 
      await this.crearLineaDeSolicitudInsert(this.lineaDeSolicitudParaCrear);
      

      //  Inserto dato adjunto a las líneas
        console.log(this.archivosAdjuntos);
        this.archivosAdjuntos.forEach(async c => {

        let lineas = this.lineasCreadas.find(lc => lc.idProducto == c.idProducto);
        let idLinea = lineas?.idLineaDeSolicitud;
        console.log(idLinea);
        await this.crearArchivoAdjunto(idLinea!,2,c.archivoAdjunto);
        
      });
      

      this.comprasService.mostrarMensajeExito('¡La órden se creó correctamente!')
      
    }else{
      
      //  Está editando la orden por lo tanto solo actualizo
      
      this.crearOrdenDeSolicitud = {
        fechaDecreacion: new Date(),
        idCentroDeCosto: Number(this.idCentroDeCosto),
        idEmpresa: Number(this.idEmpresa),
        idEstadoDeSolicitud: Number(this.idEstadoSolicitud),
        idOrdenDeSolicitud:Number(this.idOrdenDeSolicitudDesplegar),
        idPriodidadDeOrden: Number(this.idPrioridad),
        idUsuarioSolicitante:Number(this.idUsuarioSolicitante),
        fechaDeNecesidad: this.fechaNecesidad,
        idUsuarioParaNotificar: Number(this.idUsuarioANotificar)
      }
      
      await this.editarOrdenDeSolicitud(this.crearOrdenDeSolicitud);
      //  Si carga un archivo actualizo el adjunto
      if(this.archivoAdjuntoOrden){
        console.log(this.archivoAdjuntoOrden);
        console.log(this.idOrdenDeSolicitudDesplegar);
        console.log("Edito archivo");
        await this.editarArchivoAdjunto(this.idOrdenDeSolicitudDesplegar,1,this.archivoAdjuntoOrden);
      }
      
      
      
      // Creo orden de solicitud solo si agregó nuevo
      
      // Si es mayor es porque agregó más líneas
      if(this.lineaDeSolicitudParaCrear.length>this.solicitudExistenteFiltrada.length){
        
        // Filtro la solicitud para agregar solo las líneas que no están agregadas
        let lineaSolicitudParaCrearFiltrada = this.lineaDeSolicitudParaCrear;
        
        this.lineaDeSolicitudParaCrear.forEach(l => {
          
          this.solicitudExistenteFiltrada.forEach(s => {
            
            if(l.idProducto == s.idProducto){
              lineaSolicitudParaCrearFiltrada = lineaSolicitudParaCrearFiltrada.filter(p => p.idProducto != l.idProducto);
            }
        
          });
          
        });
        
        
        
        lineaSolicitudParaCrearFiltrada.forEach(c => {
          c.idOrdenDeSolicitud = this.idOrdenDeSolicitudDesplegar;
          c.idLineaDeSolicitud = 0;
        });
        await this.crearLineaDeSolicitudInsert(lineaSolicitudParaCrearFiltrada); 
        
         //  Inserto dato adjunto a las líneas
         console.log(this.archivosAdjuntos);
         this.archivosAdjuntos.forEach(async c => {
 
         let lineas = this.lineasCreadas.find(lc => lc.idProducto == c.idProducto);
         let idLinea = lineas?.idLineaDeSolicitud;
         console.log(idLinea);
         await this.crearArchivoAdjunto(idLinea!,2,c.archivoAdjunto);
         
       });
        
        
        
      }
      
    }
    this.comprasService.mostrarMensajeExito('¡La órden se editó correctamente!')
    
    //  Poner esto en una función de limpiar campos
    this.archivoAdjuntoOrden = null;
    this.archivoAdjuntoLineaDeSolicitud = null;
    this.archivosAdjuntos = [];
    
    await this.iniciar()
    this.solicitudExistenteFiltrada = this.solicitudExistente;
    this.solicitudExistenteFiltrada = this.solicitudExistenteFiltrada.filter(se => se.idOrdenDeSolicitud == this.idOrdenDeSolicitudDesplegar);
    this.limpiarCampos();
    this.cargarArchivosAdjuntos();
  }

  limpiarCampos(){
    this.idProducto = 0;
    this.nombreProducto = "";
    this.idArea = undefined;
    this.cantidad = 0;
    this.idUsuarioANotificar =-1;
    this.estaEditandoOrden = false;
    this.idEmpresa = -1;
    this.idCentroDeCosto = -1;
    this.idPrioridad = -1;
    this.fechaNecesidad = new Date();
    this.idUsuarioANotificar =-1;
    this.usuariosANotificar = [];
    this.mostrarPopUp = false;
    this.archivoAdjunto = null;
    this.archivoAdjuntoOrden = null;
    this.archivoLinea = null;
    this.nombreArchivoLineaDeSolicitud = "";
    this.nombreArchivoOrdenSolicitud = "";
    this.etiquetaArchivoOrden = "Subir Archivo";
    this.etiquetaArchivoLinea = "Subir Archivo";
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


   if(this.archivoLinea){
    console.log("agrego adjunto");
    this.archivosAdjuntos.push({
      idProducto: this.idProducto,
      archivoAdjunto: this.archivoAdjuntoLineaDeSolicitud!
    })
   }
   

this.idProducto = 0;
this.nombreProducto = "";
this.idArea = undefined;
this.cantidad = 0;
this.comentario = "";
this.archivoLinea = null;
this.etiquetaArchivoLinea = "Subir Archivo"
this.nombreArchivoLineaDeSolicitud = "";
  }

  getUnidadDeProducto(idProducto: number): number{

    const producto = this.productosActivos.find(p => p.idProducto === idProducto);
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
    if(this.usuariosANotificar.length<=0){
      alert("Ingrese el usuario a notificar");
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
    this.estaEditandoOrden = false;
    this.limpiarCampos();
  }

  async desplegarFila(id: number) {
    if(this.idOrdenDeSolicitudDesplegar == id){
      this.idOrdenDeSolicitudDesplegar = -1;
      this.mostrarTodasFilas = true;
    }else{
      this.idOrdenDeSolicitudDesplegar = id;
      this.mostrarTodasFilas = false;
    }
    this.solicitudExistenteFiltrada = this.solicitudExistente;
    this.solicitudExistenteFiltrada = this.solicitudExistenteFiltrada.filter(se => se.idOrdenDeSolicitud == id);

    // this.tieneAdjuntoOrden(id);
    this.cargarArchivosAdjuntos();



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
console.log(idEstado);

    if(idEstado==-1){

      const ordenResumen = this.ordenCompraExistente;
      return ordenResumen.length | 0;
    }else{

      
      const ordenResumen = this.ordenCompraExistente.filter(p => p.idEstadoDeSolicitud == idEstado);
      console.log(ordenResumen);
      return ordenResumen.length | 0;
    }

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
    this.mostrarUsuarios = false;
  }


  eliminarUsuarioANotificar(idUsuario:number){

    this.usuariosANotificar = this.usuariosANotificar.filter(p => p.idUsuarioSolicitante!=idUsuario);
  }

  mostrarTodas(){
    this.mostrarTodasFilas = true;
    this.idOrdenDeSolicitudDesplegar = -1;
    this.ordenVerTieneAdjunto = false;
  }


  obtenerColorEstado(idEstado: number): string{

    const estado = this.estadoDeSolicitud.find(c => c.idEstadoDeSolicitud == idEstado);   
    return estado ? estado.color || "" : '';
  }

  async eliminarProductoASolicitar(idProducto: number, idLinea: number){

    if(this.estaEditandoOrden){

      
        const confirmaEliminar = await this.comprasService.mostrarConfirmacion('¿Seguro que desea eliminar?','No podrás revertir esta acción','warning',true,'Sí, Eliminar','Cancelar');
       
        // Si da cancelar sale de la función, de lo contrario sigue el código
        if(!confirmaEliminar)
          return;



      // Elimino la orden de la base de datos
      await this.eliminarLineaDeSolicitud(idLinea);
      this.lineaDeSolicitudParaCrear = this.lineaDeSolicitudParaCrear.filter(c => c.idProducto!= idProducto);
      await this.iniciar();
      // Actualizo el array solicitudes filtradas
      this.solicitudExistenteFiltrada = this.solicitudExistente;
      this.solicitudExistenteFiltrada = this.solicitudExistenteFiltrada.filter(se => se.idOrdenDeSolicitud == this.idOrdenDeSolicitudDesplegar);
    }else{
      this.lineaDeSolicitudParaCrear = this.lineaDeSolicitudParaCrear.filter(c => c.idProducto != idProducto);
    }
  }

  async actualizarEstado(){

    const ordenActualizar = this.ordenCompraExistente.find(c => c.idOrdenDeSolicitud == this.idOrdenDeSolicitudDesplegar);
    if(ordenActualizar){
      ordenActualizar.idEstadoDeSolicitud = Number(this.idEstadoCambiar);
      await this.editarOrdenDeSolicitud(ordenActualizar);


      // Verificar primero si no existe ya un archivo para esta orden con la seccion 3(sección para presupuesto aprobado)

      
      if(this.archivoAdjuntoOrden){
        
        this.getArchivoAdjunto =[];
        await this.getListaDeArchivosAdjuntos(this.idOrdenDeSolicitudDesplegar,3);
        if(this.getArchivoAdjunto.length<=0){ 
          await this.crearArchivoAdjunto(this.idOrdenDeSolicitudDesplegar,3,this.archivoAdjuntoOrden);
        }else{
          await this.editarArchivoAdjunto(this.idOrdenDeSolicitudDesplegar,3,this.archivoAdjuntoOrden);
        }
      }
        
      await this.cargarArchivosAdjuntos();
      await this.iniciar()
      this.mostrarPopUpCambiarEstado = false;
      this.comprasService.mostrarMensajeExito('La Órden Se Actualizó Correctamente');
    }



  }

  async eliminarOrden(){

    const confirmaEliminar = await this.comprasService.mostrarConfirmacion('¿Seguro que desea eliminar la Órden?','No podrás revertir esta acción','warning',true,'Sí, Eliminar','Cancelar');
    // Si da cancelar sale de la función, de lo contrario sigue el código
    if(!confirmaEliminar)
      return;

    await this.eliminarOrdenDeSolicitud(this.idOrdenDeSolicitudDesplegar);
    await this.iniciar();
    this.mostrarTodasFilas = true;
    this.idOrdenDeSolicitudDesplegar = -1;

    this.comprasService.mostrarMensajeExito('Órden eliminada con éxito');
  }


  editarOrden(){
    
    
    this.estaEditandoOrden = true;
    this.mostrarPopUp = true;
    const ordenEditar = this.ordenCompraExistente.find(p => p.idOrdenDeSolicitud == this.idOrdenDeSolicitudDesplegar);
    const usuario = this.usuariosExistente.find(c => c.idUsuarioSolicitante == ordenEditar?.idUsuarioSolicitante);
    this.idEmpresa = Number(ordenEditar?.idEmpresa);
    this.centroDeCostosFiltrados = this.centroDeCostos.filter(c => c.idEmpresa == this.idEmpresa);
    this.idCentroDeCosto = Number(ordenEditar?.idCentroDeCosto);
    this.idPrioridad = Number(ordenEditar?.idPriodidadDeOrden);
    this.fechaNecesidad = ordenEditar!.fechaDeNecesidad;
    this.idUsuarioANotificar = ordenEditar!.idUsuarioParaNotificar;
    this.usuariosANotificar.push({
      idUsuarioSolicitante: Number(ordenEditar?.idUsuarioParaNotificar),
      idDepartamento: Number(usuario?.idDepartamento),
      idRol: Number(usuario?.idRol),
      idUsuarioSir: Number(usuario?.idUsuarioSir),
      correoElectronico: usuario!.correoElectronico
    })
    
    this.lineaDeSolicitudParaCrear = this.solicitudExistente.filter(s => s.idOrdenDeSolicitud == ordenEditar?.idOrdenDeSolicitud);

  }
 
 
  seleccionarArchivoLineaDeSolicitud(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    this.archivoAdjuntoLineaDeSolicitud = input.files[0]; // Obtiene el primer archivo seleccionado
    this.nombreArchivoLineaDeSolicitud = input.files[0].name;
    this.etiquetaArchivoLinea = "Archivo Cargado";
    console.log('Archivo seleccionado:', this.archivoAdjuntoLineaDeSolicitud);
  }
}

  async tieneAdjuntoOrden(idReferencia:number): Promise<boolean>{

    this.getArchivoAdjunto =[];
    await this.getListaDeArchivosAdjuntos(idReferencia,1);

    if(this.getArchivoAdjunto.length>0){
      let urlimagen = this.getArchivoAdjunto.find(c => c.idReferencia == idReferencia);
      this.archivoAdjuntoImagen = urlimagen?.archivoAdjunto || '';
      this.ordenVerTieneAdjunto = true;
      return true;
    }else{
      this.ordenVerTieneAdjunto = false;
      return false;
    }
  }

  async cargarArchivosAdjuntos(){



    this.getArchivoAdjunto =[];
    this.listaArchivosAdjuntos =[];
    await this.getListaDeArchivosAdjuntos(this.idOrdenDeSolicitudDesplegar,1);
    if(this.getArchivoAdjunto.length>0){
      let lista = this.getArchivoAdjunto;
      this.listaArchivosAdjuntos.push(...lista);  

    }    
    
    for (const s of this.solicitudExistenteFiltrada) {
      await this.getListaDeArchivosAdjuntos(s.idLineaDeSolicitud,2); 
      let lista = this.getArchivoAdjunto;
      this.listaArchivosAdjuntos.push(...lista);     
    }
    
    console.log(this.listaArchivosAdjuntos);

    // Adjuntos presupuesto aprobado
    this.getArchivoAdjunto =[];
    await this.getListaDeArchivosAdjuntos(this.idOrdenDeSolicitudDesplegar,3);
    if(this.getArchivoAdjunto.length>0){
      let lista = this.getArchivoAdjunto;
      this.listaArchivosAdjuntos.push(...lista);  
    }    
    console.log(this.listaArchivosAdjuntos);
  }

  // Consulto si tiene un archivo adjunto para mostrar el botón de adjunto o no
  tieneAdjunto(idReferencia: number, seccion: number): boolean{

    let linea = this.listaArchivosAdjuntos.find(c => c.idReferencia == idReferencia && c.seccion == seccion);
    if(linea?.archivoAdjunto){
      return true;
    }else{
      return false;
    }
  }

  verAdjunto(idReferencia:number,seccion:number){
  
    let adjunto = this.listaArchivosAdjuntos.find(l => l.idReferencia == idReferencia && l.seccion == seccion);
    if(adjunto?.idArchivoAdjunto){
      this.archivoAdjuntoImagen = adjunto?.archivoAdjunto || '';
      this.mostrarPopUpVerArchivoAdjunto = true;  
    }
  }


  filtrarOdenesPorEstado(idEstado:number){

    if(idEstado == -1){

      this.ordenCompraExistenteFiltro = this.ordenCompraExistente;
    }
    else{

      this.ordenCompraExistenteFiltro = this.ordenCompraExistente.filter(oc => oc.idEstadoDeSolicitud == idEstado);
    }

  }

  abrirSelectorDeArchivo(idArchivo:string): void {
    const fileInput = document.getElementById(idArchivo) as HTMLInputElement;
    fileInput?.click(); // Simula el clic en el input file
  }


  seleccionarArchivoOrdenDeSolicitud(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      this.archivoAdjuntoOrden = input.files[0]; // Obtiene el primer archivo seleccionado
      this.nombreArchivoOrdenSolicitud = input.files[0].name; // Guarda el nombre del archivo seleccionado
      console.log('Archivo seleccionado:', this.archivoAdjuntoOrden);
      this.etiquetaArchivoOrden = 'Archivo cargado';
    }
  }
 

  

}
