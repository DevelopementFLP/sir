import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Pedido } from '../../interfaces/Pedido.interface';
import { Caja } from '../../interfaces/Caja.interface';
import { Tamano } from '../../interfaces/Tamano.interface';
import { Diseno } from '../../interfaces/Diseno.interface';
import { Tipo } from '../../interfaces/Tipo.interface';
import { OrdenEntrega } from '../../interfaces/OrdenEntrega.inteface';
import { StockCajasService } from '../../services/stock-cajas.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { Stock } from '../../interfaces/Stock.interface';
import { PedidoRecibido } from '../../interfaces/PedidoRecibido.interface';
import { OrdenArmado } from '../../interfaces/OrdenArmado.interface';
import { formatDate } from '@angular/common';
import { PedidoPadre } from '../../interfaces/PedidoPadre.interface';


@Component({
  selector: 'app-pedidos-recibidos',
  templateUrl: './pedidos-recibidos.component.html',
  styleUrls: ['./pedidos-recibidos.component.css'] 
})
export class PedidosRecibidosComponent implements OnInit, OnDestroy {

  private intervalId: any;

  idPedido: number = -1;
  idCaja: number = -1;

  stockUpdate: Stock[] = [];
  cantidad: number = 0;
  pedidos: Pedido[] | undefined =[];
  cajasCajas: Caja[] | undefined = [];
  tamanosCajas: Tamano[] | undefined =[];
  disenosCajas: Diseno[] | undefined = [];
  tipos: Tipo[] | undefined = [];
  ordenEntrega: OrdenEntrega[] | undefined = [];
  pedidosRecibidos: PedidoRecibido[] | undefined = [];
  stockCajas: Stock[] | undefined = [];
  ordenesArmado: OrdenArmado[] | undefined = [];
  filtroFecha: number = 0;
  filtroSeleccionado: string = "todos";

  pedidoPadre: PedidoPadre[] | undefined = [];


  mensaje: string = "";
  
    // Variables para popup cuando presiona click en la imagen
    img_Grande_Url: string ="";
    popUpVisibleImgGrande: boolean = false;

  popUpVisible: boolean | undefined;
  ordenArmadoInsertar: OrdenArmado[] = [];

  fechaInput: string ="";
  


  fechaFiltro = new Date()
  fechaFiltrada: string ="";
  fecha: Date | undefined; 

   estado!: number;

   isWorking: boolean = false;

  constructor (private stockService: StockCajasService) {}


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

  async iniciar(): Promise<void> {
    await this.GetPedidosAsync();
    await this.getCajasAsync();
    await this.getTiposCajasAsync();
    await this.getTamanoCajasAsync();
    await this.getDisenosAsync();
    await this.getOrdenesEntregaAsync();
    await this.getStockCajasAsync();
    await this.getOrdenesArmadoAsync();
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


  async getOrdenesArmadoAsync(): Promise<void> {
    try {
      this.ordenesArmado = await lastValueFrom(this.stockService.getOrdenesArmadoAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async UpdateOrdenArmadoCajasArmadasAsync(orden: OrdenArmado[]): Promise<void> {
    try {
      await lastValueFrom(this.stockService.UpdateOrdenArmadoCajasArmadasAsync(orden));
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



  formatoFecha(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0'); // Obtener día y agregar cero a la izquierda si es necesario
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Obtener mes (se suma 1 porque los meses son base 0)
    const anio = fecha.getFullYear().toString(); // Obtener año

    return `${anio}-${mes}-${dia}`; // Formato dd/mm/yyyy
  }


 
  getStock(idCaja: number): number{
    const stockCaja = this.stockCajas?.find(t => t.id_Caja === idCaja);
    return stockCaja ? stockCaja.stock : -1;
  }

  getcajasArmar(idPedido: number): number{
    const cajasArmar = this.ordenesArmado?.find(t => t.id_Pedido === idPedido);
    return cajasArmar ? cajasArmar.cajas_A_Armar : -1;

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
    const idpedido = this.pedidos?.find(t => t.id_Pedido === idPedido);
    return idpedido ? idpedido.id_Pedido_Padre : -1;
  }
  
  
  
  getFecha(idPedido: number): Date {
   const fecha = this.pedidos?.find(t => t.id_Pedido === idPedido);
   return fecha ? fecha.fecha_Pedido : new Date();

 }

 getEstadoPedido(idPedido: number): boolean {
  const estado = this.pedidos?.find(t => t.id_Pedido === idPedido);
  return estado ? estado.estado : false;
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


    this.ordenesArmado!.forEach(d => {
    
      const idCaja:number = this.getIdCajaPedido(d.id_Pedido);
      this.pedidosRecibidos!.push({
        idPedido: d.id_Pedido,
        id_Pedido_Padre: this.getIdPedidoPadre(d.id_Pedido),
        idCaja: idCaja,
        diseno: this.getobtenerdiseno(this.getiddiseno(idCaja)),
        tamano: this.getNombreTamano(this.getidtamano(idCaja)),
        fecha_Pedido: this.getFecha(d.id_Pedido),
        tipo: this.getobtenertipo(this.getidtipo(idCaja)),
        cantidadArmar: d.cajas_A_Armar,
        cantidadArmado: d.cajas_Armadas,
        estado: this.getEstadoPedido(d.id_Pedido),
        prioridad: this.getPrioridad(d.id_Pedido),
        prioridad_Pedido_Padre: this.getPrioridadPedidoPadre(this.getIdPedidoPadre(d.id_Pedido))
      })

    
    
    });
    if(this.filtroFecha==0){
      this.fechaFiltrada = this.formatoFecha(this.fechaFiltro);
    }
    
    this.pedidosRecibidos = this.pedidosRecibidos?.filter(p => p.cantidadArmado < p.cantidadArmar && p.estado==true)

    this.pedidosRecibidos!.sort((a, b) => a.prioridad - b.prioridad);
    this.pedidosRecibidos!.sort((a, b) => a.id_Pedido_Padre - b.id_Pedido_Padre);
    this.pedidosRecibidos!.sort((a, b) => a.prioridad_Pedido_Padre - b.prioridad_Pedido_Padre);


    if(this.filtroFecha==1)
    this.pedidosRecibidos = this.pedidosRecibidos?.filter(p => p.cantidadArmado < p.cantidadArmar && p.estado==true && formatDate(p.fecha_Pedido, "dd-MM-yyyy", "es-UY") == formatDate(this.fechaInput, "dd-MM-yyyy", "es-UY"));
    
    if(this.filtroFecha==0)
      this.pedidosRecibidos = this.pedidosRecibidos?.filter(p => p.cantidadArmado < p.cantidadArmar && p.estado==true);
  }




  async armarCajas(idPedido: number, cantidadArmadas:number, idCaja:number){


    this.ordenArmadoInsertar=[];
    this.ordenArmadoInsertar.push({
      id_Pedido: idPedido,
      cajas_A_Armar: 0,
      cajas_Armadas: this.getCantidadCajasArmadas(idPedido) + cantidadArmadas,
      id_Destino: 0
    })
    
    

    
    this.stockUpdate =[];


    this.stockUpdate.push({
      toLowerCase: function (): unknown {
        throw new Error('Function not implemented.');
      },
      id_Caja: idCaja,
      stock: this.getCantidadCajasStock(idCaja) + cantidadArmadas
    })
    
    try {
    
     
     
      await this.UpdateOrdenArmadoCajasArmadasAsync(this.ordenArmadoInsertar!);
      await this.UpdateStockAsync(this.stockUpdate);
      
    } catch (error) {
      // Captura de errores en caso de que ocurran en cualquiera de las llamadas
      console.error('Error al agregar cajas:', error);
    }


  }

  

    //  Obtener id para luego buscar el nombre
    getCantidadCajasArmadas(idPedido: number): number {
      const cajasArmadas = this.ordenesArmado?.find(t => t.id_Pedido === idPedido);
      return cajasArmadas ? cajasArmadas.cajas_Armadas : -1;
    }

    getCantidadCajasSolicitadas(idPedido: number): number {
      const cajasSolicitadas = this.ordenesArmado?.find(t => t.id_Pedido === idPedido);
      return cajasSolicitadas ? cajasSolicitadas.cajas_A_Armar : -1;
    }
 
    
    getCantidadCajasStock(idCaja: number): number {
      const cajasStock = this.stockCajas?.find(t => t.id_Caja === idCaja);
      return cajasStock ? cajasStock.stock : -1;
    }


    mostrarPopUp(idPedido:number,idCaja: number){

      this.isWorking = true;

      this.popUpVisible = true;

      this.idPedido = idPedido;
      this.idCaja = idCaja;
     
    
    }


    async guardarCantidad($event: number) {

      //  Esto pasa cuando se confirma la cantidad en el popup
        this.cantidad = 0;
        this.cantidad=$event;
      
      
      let cajas_Armadas:number = this.getCantidadCajasArmadas(this.idPedido);
      let cajas_Solicitadas: number= this.getCantidadCajasSolicitadas(this.idPedido);
      let saldo: number = cajas_Solicitadas - cajas_Armadas;
 
      // Para que no inserte una cantidad mayor a la que se necesita
      if($event > saldo){
        this.mensaje = "Faltan " +saldo +" cajas ingrese una cantidad igual o menor"
        // alert("Faltan " +saldo +" cajas ingrese una cantidad igual o menor");
        this.openDialog();
        return;


      }

    

      if($event != 0){
        // Es porque dió cancelar al botón de popUp

        
        try {
          
          // Inserto Orden Armado
          await this.armarCajas(this.idPedido,this.cantidad,this.idCaja);
          
          // Vuelvo a cargar los datos para trabajar con datos actualizados
            await this.iniciar();

      

      
            if(this.filtroFecha==1)
              this.filtrarPedidosPorFecha(this.fechaFiltrada);
            if(this.filtroFecha==0)
              this.filtrarPedidosTodos();

      
        } catch (error) {
           console.error('Error al cargar las Ordenes de Armado:', error);
        }



      }

     this.popUpVisible = false;
     this.isWorking = false;

      }

      filtrarPedidosPorFecha(fecha: string): void {
        this.filtroFecha = 1;

        this.fechaInput = fecha;
        this.llenarArrayCajas(); 
        // this.pedidosRecibidos = this.pedidosRecibidos?.filter(p => p.cantidadArmado < p.cantidadArmar && p.estado==true && formatDate(p.fecha_Pedido, "dd-MM-yyyy", "es-UY") == formatDate(fecha, "dd-MM-yyyy", "es-UY"))
      }

      filtrarPedidosTodos(): void{
        this.filtroFecha = 0;
      
       
        this.llenarArrayCajas(); 
        // this.pedidosRecibidos = this.pedidosRecibidos?.filter(p => p.cantidadArmado < p.cantidadArmar && p.estado==true)
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

      totalCajasSolicitadas(): number{
        let total: number = 0;

        this.pedidosRecibidos!.forEach(p => {
          total = total + p.cantidadArmar;
        });
        return total;
      }



      getUrlCaja(idCaja: number): string {
        
        let idDiseno = this.getiddiseno(idCaja);
        const url = this.disenosCajas?.find(t => t.id_Diseno === idDiseno);   
        return url ? url.url : '';

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
 

      obtenerCantidadPedidosPadres(idPedido:number){


      

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
