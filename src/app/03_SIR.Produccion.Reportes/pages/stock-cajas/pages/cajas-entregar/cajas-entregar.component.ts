import { Component, NgModule, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { StockCajasService } from '../../services/stock-cajas.service';
import { Pedido } from '../../interfaces/Pedido.interface';
import { lastValueFrom, interval } from 'rxjs';
import { Caja } from '../../interfaces/Caja.interface';
import { Tamano } from '../../interfaces/Tamano.interface';
import { Diseno } from '../../interfaces/Diseno.interface';
import { Tipo } from '../../interfaces/Tipo.interface';
import { OrdenEntrega } from '../../interfaces/OrdenEntrega.inteface';
import { formatDate } from '@angular/common';
import { PedidoRecibido } from '../../interfaces/PedidoRecibido.interface';
import { Stock } from '../../interfaces/Stock.interface';
import { Router } from '@angular/router';
import { PedidoPadre } from '../../interfaces/PedidoPadre.interface';

@Component({
  selector: 'app-cajas-entregar',
  templateUrl: './cajas-entregar.component.html',
  styleUrls: ['./cajas-entregar.component.css']
})
export class CajasEntregarComponent implements OnInit, OnDestroy{

  private intervalId: any;

  pedidos: Pedido[] | undefined =[];
  cajasCajas: Caja[] | undefined = [];
  tamanosCajas: Tamano[] | undefined =[];
  disenosCajas: Diseno[] | undefined = [];
  tipos: Tipo[] | undefined = [];


  visibleNoSolicitado: boolean = true;

  ordenEntregaInsertar: OrdenEntrega[] = [];
  stockCajas: Stock[] | undefined = [];
  stockUpdate: Stock[] = [];
  cantidad: number = 0;
  idPedido: number = -1;
  idCaja: number = -1;
  popUpVisible: boolean | undefined;
  pedidosRecibidos: PedidoRecibido[] | undefined = [];
  ordenEntrega: OrdenEntrega[] | undefined = [];

  pedidoPadre: PedidoPadre[] | undefined = [];
  fechaFiltro = new Date()
  fechaFiltrada: string ="";
  fecha: Date | undefined; 

  // Variables para popup cuando presiona click en la imagen
  img_Grande_Url: string ="";
  popUpVisibleImgGrande: boolean = false;

  isWorking: boolean = false;
  mensaje: string ="";
  
  
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

  constructor (
    private stockService: StockCajasService,
    private router: Router
  ) {}
  

  async iniciar(){
    await this.GetPedidosAsync();
    await this.getCajasAsync();
    await this.getTiposCajasAsync();
    await this.getTamanoCajasAsync();
    await this.getDisenosAsync();
    await this.getOrdenesEntregaAsync();
    await this.getStockCajasAsync();
    await this.GetPedidosPadreAsync();
    this.llenarArrayCajas();
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
      this.pedidoPadre = await lastValueFrom(this.stockService.GetPedidosPadreAsync());
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

  async getStockCajasAsync(): Promise<void> {
    try {
      this.stockCajas = await lastValueFrom(this.stockService.getStockCajasAsync());
    } catch(error) {
      console.error(error)
    }
  }


  async UpdateOrdenEntregaAsync(orden: OrdenEntrega[]): Promise<void> {
    try {
      await lastValueFrom(this.stockService.UpdateOrdenEntregaAsync(orden));
    } catch(error) {
      console.error(error)
    }
  }

  async UpdateStockAsync(stock: Stock[]): Promise<void> {
    try {
      await lastValueFrom(this.stockService.UpdateStockAsync(stock));
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




  // async getTamanoCajasAsync(): Promise<void> {
  //   try {
  //     this.tamanos_cajas = await lastValueFrom(this.stockService.getTamanoCajasAsync());
  //   } catch(error) {
  //     console.error(error)
  //   }
  // }



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

 
   //  Obtener id para luego buscar el nombre
   getIdCajaPedido(idPedido: number): number {
    const idCaja = this.pedidos?.find(t => t.id_Pedido === idPedido);
    return idCaja ? idCaja.id_Caja : -1;
  }
  
  getIdPedidoPadre(idPedido: number): number {
    const idPedidoPadre = this.pedidos?.find(t => t.id_Pedido === idPedido);
    return idPedidoPadre ? idPedidoPadre.id_Pedido_Padre : -1;
  }
  
  getFecha(idPedido: number): Date {
   const fecha = this.pedidos?.find(t => t.id_Pedido === idPedido);
   return fecha ? fecha.fecha_Pedido : new Date();
 }

 getEstadoPedido(idPedido: number): boolean {
  const estado = this.pedidos?.find(t => t.id_Pedido === idPedido);
  return estado ? estado.estado : false;
}



getCantidadCajasentregadas(idPedido: number): number {
  const cajasEntregadas = this.ordenEntrega?.find(t => t.id_Pedido === idPedido);
  return cajasEntregadas ? cajasEntregadas.cajas_Entregadas : -1;
}

getCantidadCajasSolicitadas(idPedido: number): number {
  const cajasSolicitadas = this.ordenEntrega?.find(t => t.id_Pedido === idPedido);
  return cajasSolicitadas ? cajasSolicitadas.cajas_A_Entregar : -1;
}




getCantidadCajasStock(idCaja: number): number {
  const cajasStock = this.stockCajas?.find(t => t.id_Caja === idCaja);
  return cajasStock ? cajasStock.stock : -1;
}

getPrioridad(idPedido: number): number {
  const prioridad = this.pedidos?.find(t => t.id_Pedido === idPedido);
  return prioridad ? prioridad.prioridad : -1;
}

getPrioridadPedidoPadre(idPedidoPadre: number): number {
  const prioridad = this.pedidoPadre?.find(t => t.id_Pedido_Padre === idPedidoPadre);
  return prioridad ? prioridad.prioridad_Pedido_Padre : -1;
}

    //Llenar Array StockCajasMostrar
  llenarArrayCajas(){
    //  Llenar array con cada valor que voy a mostrar para que sea más fácil de utilizar
    this.pedidosRecibidos = [];

    this.ordenEntrega!.forEach(d => {
      const idCaja:number = this.getIdCajaPedido(d.id_Pedido);
      this.pedidosRecibidos!.push({
        idPedido: d.id_Pedido,
        id_Pedido_Padre: this.getIdPedidoPadre(d.id_Pedido),
        idCaja: idCaja,
        diseno: this.getobtenerdiseno(this.getiddiseno(idCaja)),
        tamano: this.getNombreTamano(this.getidtamano(idCaja)),
        fecha_Pedido: this.getFecha(d.id_Pedido),
        tipo: this.getobtenertipo(this.getidtipo(idCaja)),
        cantidadArmar: d.cajas_A_Entregar,
        cantidadArmado: d.cajas_Entregadas,
        estado: this.getEstadoPedido(d.id_Pedido),
        prioridad: this.getPrioridad(d.id_Pedido),
        prioridad_Pedido_Padre: this.getPrioridadPedidoPadre(this.getIdPedidoPadre(d.id_Pedido))
      })
    });

    //  Mostrar solo los que son del día de hoy
    this.fechaFiltrada = this.formatoFecha(this.fechaFiltro);
    this.pedidosRecibidos = this.pedidosRecibidos?.filter(p => p.cantidadArmado < p.cantidadArmar && formatDate(p.fecha_Pedido, "dd-MM-yyyy", "es-UY") == formatDate(this.fechaFiltrada, "dd-MM-yyyy", "es-UY"))
    

    this.pedidosRecibidos!.sort((a, b) => a.prioridad - b.prioridad);
    this.pedidosRecibidos!.sort((a, b) => a.id_Pedido_Padre - b.id_Pedido_Padre);
    this.pedidosRecibidos!.sort((a, b) => a.prioridad_Pedido_Padre - b.prioridad_Pedido_Padre);
    // Sin filtro de fecha
    // this.pedidosRecibidos = this.pedidosRecibidos?.filter(p => p.cantidadArmado < p.cantidadArmar && p.estado==true)
  }


  async armarCajas(idPedido: number, cantidadentregadas:number, idCaja:number, terminarPedido:boolean){
    await this.getStockCajasAsync();
    await this.getOrdenesEntregaAsync();
    
    this.ordenEntregaInsertar=[];
    this.ordenEntregaInsertar.push({
      id_Pedido: idPedido,
      cajas_A_Entregar: 0,
      cajas_Entregadas: this.getCantidadCajasentregadas(idPedido) + cantidadentregadas
    })
    
    this.stockUpdate =[];


    this.stockUpdate.push({
      toLowerCase: function (): unknown {
        throw new Error('Function not implemented.');
      },
      id_Caja: idCaja,
      stock: this.getCantidadCajasStock(idCaja) - cantidadentregadas
    })

    
    
    try {
    
      
      await this.UpdateOrdenEntregaAsync(this.ordenEntregaInsertar!);
      await this.UpdateStockAsync(this.stockUpdate);
      
      if(terminarPedido == true){
        await this.DeletePedido(idPedido);

      }

    } catch (error) {
      // Captura de errores en caso de que ocurran en cualquiera de las llamadas
      console.error('Error al agregar cajas:', error);
    }


  }



  mostrarPopUp(idPedido:number,idCaja: number){
    
    this.popUpVisible = true;
    this.idPedido = idPedido;
    this.idCaja = idCaja;
    this.isWorking = true;
  }


  async guardarCantidad($event: number) {

    // Si entrega la totalidad de las cajas que restan entregar, informa que se actualice el estado del pedido en la función que llama para actualizar entrega y stock
    let terminarPedidoEstado: boolean = false;
    //  Esto pasa cuando se confirma la cantidad en el popup
      this.cantidad = 0;
      this.cantidad=$event;
    
        if(this.cantidad==0){
          this.popUpVisible = false;
          this.isWorking = false;
          return;
        }
      let cajas_Entregadas:number = this.getCantidadCajasentregadas(this.idPedido);
      let cajas_Solicitadas: number= this.getCantidadCajasSolicitadas(this.idPedido);
      let saldo: number = cajas_Solicitadas - cajas_Entregadas;

     
      if($event> saldo){
        this.mensaje = "El saldo necesario es de "+saldo+" cajas, ingrese una cantidad igual o menor a la cantidad necesaria";
        // alert("El saldo necesario es de "+saldo+" cajas, ingrese una cantidad igual o menor a la cantidad necesaria");
        this.openDialog();
        return;
      }

     
// Validar que la cantidad no sea mayor al saldo que necesita

// Verificar que no entregue cajas que no hayan en stock


      let stock: number = this.getCantidadCajasStock(this.idCaja);
      if(stock < $event){
        this.mensaje ="Su Stock no alcanza para la entrega, su stock es de: "+ stock+" ingrese una cantidad disponible";
        // alert("Su Stock no alcanza para la entrega, su stock es de: "+ stock+" ingrese una cantidad disponible");
        this.openDialog();
        return;
      }

      if($event == saldo){
        terminarPedidoEstado =true;
      }

    if($event != 0){
      // 0 Es porque dió cancelar al botón de popUp

      
      try {
        
        await this.armarCajas(this.idPedido,this.cantidad,this.idCaja,terminarPedidoEstado);
        await this.iniciar();

       
     
    
      } catch (error) {
         console.error('Error al cargar las Ordenes de Entrega:', error);
      }



    }

   this.popUpVisible = false;
   this.isWorking = false;

    }
    


    totalSaldo(): number{
      let total: number = 0;


      this.pedidosRecibidos!.forEach(p => {
      let saldo:number = 0;
      
      saldo = p.cantidadArmar- p.cantidadArmado
        total = total + saldo;
      });

      return total;
    }

    totalCajasArmadas(): number{
      let total: number = 0;

      this.pedidosRecibidos!.forEach(p => {
        total = total + p.cantidadArmado;
      });

      return total;
    }

    getUrlCaja(idCaja: number): string {
        
      let idDiseno = this.getiddiseno(idCaja);
      const url = this.disenosCajas?.find(t => t.id_Diseno === idDiseno);   
      return url ? url.url : '';
      
    }

    totalCajasSolicitadas(): number{
      let total: number = 0;

      this.pedidosRecibidos!.forEach(p => {
        total = total + p.cantidadArmar;
      });
      return total;
    }

    setUrlPopUpGrande(url: string){
      this.img_Grande_Url = url;
      this.popUpVisibleImgGrande=true;

      this.isWorking = true;
    }

    cerrar_PopUp_Grande(){
      this.img_Grande_Url ="";
      this.popUpVisibleImgGrande=false;
      this.isWorking = false;
    }


    redirigirCajasNoSolicitadas(){
      this.router.navigateByUrl('principal/produccion/stockCajas/entregaNoSolicitada');
    }


    clasePedidos(idPedidoPadre:number): string{
      
      
      const idsPadres: number[] = Array.from(new Set(this.pedidosRecibidos?.map(p => p.id_Pedido_Padre)));
      return idsPadres.indexOf(idPedidoPadre) % 2 == 0 ? "pedido1" : "pedido2";

    }



    openDialog(): void {
      const dialog = document.getElementById('confirmDialogPedidoCaja');
      if (dialog) {
        dialog.style.display = 'flex'; // Muestra el diálogo
        
      }
    }
    
    closeDialog(): void {
      const dialog = document.getElementById('confirmDialogPedidoCaja');
      if (dialog) {
        dialog.style.display = 'none'; // Oculta el diálogo
        
      }
    }


}