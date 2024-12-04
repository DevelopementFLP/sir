import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { StockCajasService } from '../../services/stock-cajas.service';
import { Pedido } from '../../interfaces/Pedido.interface';
import { lastValueFrom } from 'rxjs';
import { PedidoActivo } from '../../interfaces/PedidoActivo.interface';
import { Caja } from '../../interfaces/Caja.interface';
import { Tamano } from '../../interfaces/Tamano.interface';
import { Diseno } from '../../interfaces/Diseno.interface';
import { Tipo } from '../../interfaces/Tipo.interface';
import { OrdenEntrega } from '../../interfaces/OrdenEntrega.inteface';
import { formatDate } from '@angular/common';
import { PedidoPadre } from '../../interfaces/PedidoPadre.interface';
import { PedidoPadreMostrar } from '../../interfaces/PedidoPadreMostrar.interface';

@Component({
  selector: 'app-pedidos-activos',
  templateUrl: './pedidos-activos.component.html',
  styleUrls: ['./pedidos-activos.component.css'],
})
export class PedidosActivosComponent implements OnInit, OnDestroy {

  private intervalId: any;

  @ViewChild('fechaPedido', {static: false}) fechaPedido!: HTMLInputElement;

  pedidosActualizar: Pedido[] = [];
  pedidos: Pedido[] | undefined =[];
  pedidoBorrar: Pedido[] = [];
  cajasCajas: Caja[] | undefined = [];
  tamanosCajas: Tamano[] | undefined =[];
  disenosCajas: Diseno[] | undefined = [];
  tipos: Tipo[] | undefined = [];
  ordenEntrega: OrdenEntrega[] | undefined = [];

  idPedidoBorrar:number = -1;
  idPedidoPadreVer:number = -1;

  pedidosPadre: PedidoPadre[] | undefined = [];
  pedidosPadreUpdate: PedidoPadre[] | undefined = [];
  filtroSeleccionado: string = "todos";

  mostrarPopUp:boolean = false;

  filtroFecha:number = 0;

  habilitarGuardarCambios: boolean = true;
  habilitadoGuardarCambiosPedido: boolean = true;

  pedidosUpdate: PedidoActivo[] =[];
  pedidosActivosMostrar: PedidoActivo[] | undefined = [];
  pedidosActivosPadreMostrar: PedidoActivo[] | undefined = [];
  pedidosMostrar: PedidoActivo[] | undefined = [];
  pedidosPadreMostrar: PedidoPadreMostrar[] | undefined = [];
  verTodosisChecked: boolean = true;
  filtrarFecha: boolean =false
  fechaFiltro = new Date()
  fechaFiltrada: string ="";
  fecha: Date | undefined; 

  mostrar: boolean = false;
  isWorking: boolean = false;
  desplegarFila: number | null = null;

  habilitadoFecha: boolean = true;


  @Output() idPedidoPadre = new EventEmitter<number>();
  async ngOnInit(): Promise<void> {
    await this.iniciar();    
    this.intervalId = setInterval(async () => {
      if(!this.isWorking)
        await this.iniciar();    
    }, 60000);

  }

  ngOnDestroy(): void {
    if(this.intervalId) clearInterval(this.intervalId);
  }

constructor (private stockService: StockCajasService) {}


  async iniciar(){

  await this.GetPedidosAsync();
  await this.GetPedidosPadreAsync();
  await this.getCajasAsync();
  await this.getTiposCajasAsync();
  await this.getTamanoCajasAsync();
  await this.getDisenosAsync();
  await this.getOrdenesEntregaAsync();
  this.llenarArrayCajas();

  // this.fechaFiltrada = this.formatoFecha(this.fechaFiltro);

  if(this.filtroFecha==0)
  this.filtrarPedidosTodos();

  if(this.filtroFecha==1)
    this.filtrarPedidosPorFecha(this.fechaFiltrada);
}


  async GetPedidosAsync(): Promise<void> {
    try {
      this.pedidos = await lastValueFrom(this.stockService.GetPedidosAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async GetPedidosPadreAsync(): Promise<void> {
    try {
      this.pedidosPadre = await lastValueFrom(this.stockService.GetPedidosPadreAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async getCajasAsync(): Promise<void> {
    try {
      this.cajasCajas = await lastValueFrom(this.stockService.getCajasAsync());
    } catch(error) {
      console.error(error)
    }
  }


  async getTiposCajasAsync(): Promise<void> {
    try {
      this.tipos = await lastValueFrom(this.stockService.getTiposCajasAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async getTamanoCajasAsync(): Promise<void> {
    try {
      this.tamanosCajas = await lastValueFrom(this.stockService.getTamanoCajasAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async getDisenosAsync(): Promise<void> {
    try {
      this.disenosCajas = await lastValueFrom(this.stockService.getDisenosAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async getOrdenesEntregaAsync(): Promise<void> {
    try {
      this.ordenEntrega = await lastValueFrom(this.stockService.getOrdenesEntregaAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async UpdatePedidoAsync(pedido: Pedido[]): Promise<void> {
    try {
      await lastValueFrom(this.stockService.UpdatePedidoAsync(pedido));
    } catch(error) {
      console.error(error)
    }
  }
  async UpdatePedidoPadreAsync(pedidoPadre: PedidoPadre[]): Promise<void> {
    try {
      await lastValueFrom(this.stockService.UpdatePedidoPadreAsync(pedidoPadre));
    } catch(error) {
      console.error(error)
    }
  }

  async DeletePedido(idPedido:number): Promise<void> {
    
    try {
      await lastValueFrom(this.stockService.DeletePedido(idPedido));
    } catch(error) {
      console.error(error)
    }
  }



  formatoFecha(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0'); // Obtener día y agregar cero a la izquierda si es necesario
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Obtener mes (se suma 1 porque los meses son base 0)
    const anio = fecha.getFullYear().toString(); // Obtener año

    return `${anio}-${mes}-${dia}`; // Formato dd/mm/yyyy
  }


 
  

  //  Obtener id para luego buscar el nombre
  getidtamano(idCaja: number): number {
    const idTamano = this.cajasCajas?.find(t => t.id_Caja === idCaja);
    return idTamano ? idTamano.id_Tamano : -1;
  }

    //  Obtener id para luego buscar el nombre
    getiddiseno(idCaja: number): number {
      const idDiseno = this.cajasCajas?.find(t => t.id_Caja === idCaja);
      return idDiseno ? idDiseno.id_Diseno : -1;
    }

     //  Obtener id para luego buscar el nombre
     getidtipo(idCaja: number): number {
      const idTipo = this.cajasCajas?.find(t => t.id_Caja === idCaja);
      return idTipo ? idTipo.id_Tipo : -1;
    }

    //Obtener Nombre del Tamaño con el id
  getNombreTamano(idTamano: number): string {
    const tamano = this.tamanosCajas?.find(t => t.id_Tamano === idTamano);
    return tamano ? tamano.nombre : 'Desconocido';
  }

    //Obtener Nombre del Diseño con el Id
  getobtenerdiseno(idDiseno: number): string {
    const diseno = this.disenosCajas?.find(t => t.id_Diseno === idDiseno);
    return diseno ? diseno.nombre : 'Desconocido';
  }

    //Obtener Nombre del Tipo con el ID
  getobtenertipo(idTipo: number): string {
    const tipo = this.tipos?.find(t => t.id_Tipo === idTipo);
    return tipo ? tipo.nombre : 'Desconocido';
  }



   //  Obtener id para luego buscar el nombre
   getCajasEntregadas(idPedido: number): number {
    const cajasEntregadas = this.ordenEntrega?.find(t => t.id_Pedido === idPedido);
    return cajasEntregadas ? cajasEntregadas.cajas_Entregadas : -1;
  }

  getIdPedidoPadre(idPedido: number): number {
    const idpedido = this.pedidos?.find(t => t.id_Pedido === idPedido);
    return idpedido ? idpedido.id_Pedido_Padre : -1;
  }

  getPrioridadPedidoPadre(idPedidoPadre: number): number {
    const prioridad = this.pedidosPadre?.find(t => t.id_Pedido_Padre === idPedidoPadre);
    return prioridad ? prioridad.prioridad_Pedido_Padre : -1;
  }

  getfechaPedido(idPedidoPadre: number): Date {
    const fecha = this.pedidosMostrar?.find(t => t.id_Pedido_Padre === idPedidoPadre);
    return fecha ? fecha.fecha_Pedido : new Date();
  }

  existePedidoActivo(idPedidoPadre: number): boolean {
    const idpedido = this.pedidos?.find(t => t.id_Pedido_Padre === idPedidoPadre);

    if(idpedido)
      return true
    else
    return false
   
  }

    //Llenar Array StockCajasMostrar
  llenarArrayCajas(){
    //  Llenar array con cada valor que voy a mostrar para que sea más fácil de utilizar
    this.pedidosMostrar = [];
    this.pedidos!.forEach(d => {
      this.pedidosMostrar!.push({
        idPedido:d.id_Pedido,
        id_Pedido_Padre: this.getIdPedidoPadre(d.id_Pedido),
        idCaja: d.id_Caja,
        diseno: this.getobtenerdiseno(this.getiddiseno(d.id_Caja)),
        tamano: this.getNombreTamano(this.getidtamano(d.id_Caja)),
        fecha_Pedido: d.fecha_Pedido,
        tipo: this.getobtenertipo(this.getidtipo(d.id_Caja)),
        cantidadPedida: d.stock_Pedido,
        cantidadEntregados: this.getCajasEntregadas(d.id_Pedido),
        estado: d.estado,
        prioridad_Pedido_Padre: this.getPrioridadPedidoPadre(this.getIdPedidoPadre(d.id_Pedido)),
        prioridad: d.prioridad,
        paraStock: d.para_Stock
      })
    });

   
    this.pedidosPadre!.sort((a, b) => a.prioridad_Pedido_Padre - b.prioridad_Pedido_Padre);


    this.pedidosActivosMostrar = this.pedidosMostrar;
    this.pedidosActivosMostrar!.sort((a,b) => b.prioridad - a.prioridad).sort((a, b) => {return new Date(a.fecha_Pedido).getTime() <= new Date(b.fecha_Pedido).getTime() ? -1 : 1});

    
    this.pedidosPadreMostrar = [];
    this.pedidosPadre!.forEach(p => {


      
    //  Busco que al menos haya un pedido activo con ese idpadre De lo contrario no muestro ese pedido padre

      if(this.existePedidoActivo(p.id_Pedido_Padre) == true){

        this.pedidosPadreMostrar?.push({
          id_Pedido_Padre: p.id_Pedido_Padre,
          prioridad_Pedido_Padre: p.prioridad_Pedido_Padre,
          fecha_pedido: this.getfechaPedido(p.id_Pedido_Padre)
        })
      }
        
      });

      this.pedidosPadreMostrar!.sort((a,b) => b.prioridad_Pedido_Padre - a.prioridad_Pedido_Padre);
      this.pedidosPadreMostrar!.sort((a, b) => {return new Date(a.fecha_pedido).getTime() <= new Date(b.fecha_pedido).getTime() ? -1 : 1});

      
      
      if(this.filtroFecha==0){
        this.fechaFiltrada = this.formatoFecha(this.fechaFiltro);
      }
      


  }

 
  filtrarPedidosPorFecha(fecha: string): void {
    this.habilitadoFecha = false;

    this.llenarArrayCajas(); 
    // this.pedidosMostrar = this.pedidosMostrar?.filter(p => p.cantidadEntregados < p.cantidadPedida && p.estado==true && formatDate(p.fecha_Pedido, "dd-MM-yyyy", "es-UY") == formatDate(fecha, "dd-MM-yyyy", "es-UY"))
    this.filtroFecha = 1;

    this.pedidosPadreMostrar = this.pedidosPadreMostrar?.filter(p => formatDate(p.fecha_pedido, "dd-MM-yyyy", "es-UY") == formatDate(fecha, "dd-MM-yyyy", "es-UY"))
  }

  filtrarPedidosTodos(): void{
    this.filtroFecha = 0;
    this.llenarArrayCajas(); 
    this.pedidosMostrar = this.pedidosMostrar?.filter(p => p.cantidadEntregados < p.cantidadPedida && p.estado==true);
    this.habilitadoFecha = true;
  }


  

  totalCajasSolicitadas(): number{
    let total: number = 0;



    this.pedidosActivosMostrar!.forEach(p => {
      total = total + p.cantidadPedida;
    });
    return total;
  }

  totalCajasEntregadas(): number{
    let total: number = 0;

    this.pedidosActivosMostrar!.forEach(p => {
      total = total + p.cantidadEntregados;
    });

    return total;
  }


  getUrlCaja(idCaja: number): string {
        
    let idDiseno = this.getiddiseno(idCaja);
    const url = this.disenosCajas?.find(t => t.id_Diseno === idDiseno);   
    return url ? url.url : '';
    
  }


  async cancelarPedido(idPedido: number){

    this.idPedidoBorrar = idPedido;
    this.openDialogEliminarPedidoCaja();

  }

  cambiarPrioridad(numeroPrioridad: number,id_Pedido_Padre:number, prioridadActual: number) {//numeroPrioridad:number, nombreDiseno:string,idDisenio:number,tamano:string,tipo:string){
 
    prioridadActual = prioridadActual + numeroPrioridad;
    if(prioridadActual>=0){
  
      this.habilitarGuardarCambios = false;
      this.isWorking = true;

      this.pedidosPadreMostrar!.forEach(p => {
        if(p.id_Pedido_Padre == id_Pedido_Padre){
          p.prioridad_Pedido_Padre = prioridadActual;
        }
        
      });
      

    }
    else{
      alert("No se permite poner una prioridad menor a cero");
    }
    };

  

  async guardarCambios(){
   try {
        
        await this.UpdatePedidoPadreAsync(this.pedidosPadreMostrar!);
       
       
        await this.iniciar();

        this.habilitarGuardarCambios = true;
        this.isWorking = false;

      } catch (error) {
        console.error(error);
      }
}
  verPedido(idPedidoPadre: number){

    this.llenarArrayCajas();
    
    this.idPedidoPadreVer = idPedidoPadre;
    this.pedidosActivosMostrar = this.pedidosActivosMostrar?.filter(p => p.id_Pedido_Padre == idPedidoPadre);
    
    this.isWorking = true;
    if(this.mostrarPopUp){

      this.mostrarPopUp = false;
    }else{
      this.mostrarPopUp=true;
    }
  


    

  }

  cerrarPopUpVerPedidos(){
    this.habilitadoGuardarCambiosPedido = true;
    this.mostrarPopUp=false;
    this.isWorking = false;
  }


  cambiarPrioridadCaja(numeroPrioridad: number,idPedido:number, prioridadActual: number, idPedidoPadre: number) {//numeroPrioridad:number, nombreDiseno:string,idDisenio:number,tamano:string,tipo:string){
 
   
    prioridadActual = prioridadActual + numeroPrioridad;
    if(prioridadActual>=0){
  
      this.habilitadoGuardarCambiosPedido = false;
      



      this.pedidosActivosMostrar!.forEach(p => {
        if(p.idPedido == idPedido){
          p.prioridad = prioridadActual;
          


        this.pedidosActivosMostrar = this.pedidosActivosMostrar?.filter(p => p.id_Pedido_Padre == idPedidoPadre);
        }

        this.pedidosActualizar = [];
        this.pedidosActivosMostrar!.forEach(p => {
          
          this.pedidosActualizar.push({
            id_Pedido: p.idPedido,
            id_Pedido_Padre: p.id_Pedido_Padre,
            id_Caja: p.idCaja,
            fecha_Pedido: p.fecha_Pedido,
            prioridad: p.prioridad,
            stock_Pedido: p.cantidadPedida,
            para_Stock: p.paraStock,
            estado: p.estado
          })
          
        });
        
      });

    }
    else{
      alert("No se permite poner una prioridad menor a cero");
    }
    };


    borrarPedido(idPedidoPadre:number){

      this.pedidoBorrar =[];
      this.pedidoBorrar = this.pedidos!.filter(p => p.id_Pedido_Padre == idPedidoPadre);
      this.openDialogEliminarPedidoPadre();
      this.isWorking = true;

    }





    openDialogEliminarPedidoPadre(): void {
      const dialog = document.getElementById('confirmDialog');
      if (dialog) {
        dialog.style.display = 'flex'; // Muestra el diálogo
      }
      this.isWorking = true;
    }




  
    closeDialog(): void {
      const dialog = document.getElementById('confirmDialog');
      if (dialog) {
        dialog.style.display = 'none'; // Oculta el diálogo
        this.isWorking = false;
      }
    }
  
    confirmBorrarPedido(): void {
      // Acción a realizar si el usuario confirma
      

      if(this.pedidoBorrar){
        this.pedidoBorrar.forEach(async p => {
     
     
     
          try {
            await this.DeletePedido(p.id_Pedido);
            await this.GetPedidosAsync();
            await this.GetPedidosPadreAsync();
            this.llenarArrayCajas();
          } catch (error) {
            console.error(error);
          }
          
        });
  
        this.closeDialog();
        this.isWorking = false;
        
      }
      
    }
  
    cancelBorrarPedido(): void {
      // Acción a realizar si el usuario cancela
   
      this.closeDialog();
      this.isWorking = false;
    }
  

// Dialogo para borrar pedido caja individual

openDialogEliminarPedidoCaja(): void {
  const dialog = document.getElementById('confirmDialogPedidoCaja');
  if (dialog) {
    dialog.style.display = 'flex'; // Muestra el diálogo
    
  }
}

closeDialogEliminarPedidoCaja(): void {
  const dialog = document.getElementById('confirmDialogPedidoCaja');
  if (dialog) {
    dialog.style.display = 'none'; // Oculta el diálogo
    
  }
}

  async confirmBorrarPedidoCaja(): Promise<void> {
  // Acción a realizar si el usuario confirma
    await this.DeletePedido(this.idPedidoBorrar);
    await this.GetPedidosAsync();
    this.llenarArrayCajas();
    this.pedidosActivosMostrar = this.pedidosActivosMostrar?.filter(p => p.id_Pedido_Padre == this.idPedidoPadreVer);
    this.closeDialogEliminarPedidoCaja();
   
    if(this.pedidosActivosMostrar!.length<=0){
      this.mostrarPopUp =false;
      this.isWorking = false;
    }

    this.idPedidoBorrar = -1;
 
  
}

cancelBorrarPedidoCaja(): void {
  // Acción a realizar si el usuario cancela

  this.closeDialogEliminarPedidoCaja();
 
}


  async guardarCambiosPedido(){

if(this.pedidosActualizar){

  try {
    await this.UpdatePedidoAsync(this.pedidosActualizar!);
    await this.GetPedidosAsync();
    await this.GetPedidosPadreAsync();

    this.llenarArrayCajas();



    if(this.filtroFecha==1)
      this.filtrarPedidosPorFecha(this.fechaFiltrada);
    if(this.filtroFecha==0)
      this.filtrarPedidosTodos();

  
    this.pedidosActivosMostrar = this.pedidosActivosMostrar?.filter(p => p.id_Pedido_Padre == this.idPedidoPadreVer);
    this.habilitadoGuardarCambiosPedido = true;
     

  } catch (error) {
    console.error(error);
  }
}

}

  getItems(idPedidoPadre: number): number {
    const pedidos2 = this.pedidos;
    const idpedido = pedidos2?.filter(t => t.id_Pedido_Padre == idPedidoPadre);
    
    return idpedido?.length ?? 0;
  }

  getCantidadEntregados(idPedidoPadre: number): number {

    const pedidos2 = this.pedidos;
    const idpedido = pedidos2?.filter(t => t.id_Pedido_Padre == idPedidoPadre);

    let cantidadEntregadosTotal = 0;
    let cantidadSolicitadaTotal = 0;

  idpedido!.forEach(p => {
    const cantidadFaltan = this.pedidosMostrar?.find(t => t.idPedido === p.id_Pedido);
    cantidadSolicitadaTotal = cantidadSolicitadaTotal + p.stock_Pedido;
    cantidadEntregadosTotal = cantidadEntregadosTotal + cantidadFaltan!.cantidadEntregados;
  });
    // let TotalPorcentaje = Math.round((cantidadEntregadosTotal * 100) / cantidadSolicitadaTotal)
    let TotalPorcentaje = ((cantidadEntregadosTotal * 100) / cantidadSolicitadaTotal).toFixed(2);
  
    return Number(TotalPorcentaje);
  
  }

  EnviarIdPedidoPadre(){

    this.idPedidoPadre.emit(this.idPedidoPadreVer)

  }

}