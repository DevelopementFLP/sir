import { Component, OnInit } from '@angular/core';
import { Tipo } from '../../interfaces/Tipo.interface';
import { Tamano } from '../../interfaces/Tamano.interface';
import { Diseno } from '../../interfaces/Diseno.interface';
import { Stock } from '../../interfaces/Stock.interface';
import { Caja } from '../../interfaces/Caja.interface';
import { stockMostrar } from '../../interfaces/stockMostrar.interface';
import { StockCajasService } from '../../services/stock-cajas.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-entrega-no-solicitada',
  templateUrl: './entrega-no-solicitada.component.html',
  styleUrls: ['./entrega-no-solicitada.component.css']
})
export class EntregaNoSolicitadaComponent implements OnInit {
  tipos: Tipo[] | undefined = [];
  tamanos_cajas: Tamano[] | undefined = [];
  disenosCajas: Diseno[] | undefined =[];
  stockCajas: Stock[] | undefined = [];
  cajasCajas: Caja[] | undefined = [];
  StockCajasMostrar: stockMostrar[] | undefined = [];
  filtro: string ="";

  tipoSeleccionado: string | null = '';
  tamanioSeleccionado: string | null = '';
  tamanoTipo:string ="Tipo"; 
  popUpVisible: boolean | undefined;
  popUpTamanoTipoVisible: boolean | undefined;
  popupVisibleEditar: boolean = false;
  idCaja: number = -1;
  cantidad: number = 0;
  stockActualizar: Stock[] = [];
  sumaResta: string ="Sumar";
  activoSumar: boolean = true;
  activoRestar: boolean = false;
  mensaje: string = "";
  
   // Variables para popup cuando presiona click en la imagen
   img_Grande_Url: string ="";
   popUpVisibleImgGrande: boolean = false;
  
  async ngOnInit(): Promise<void> {
       
    await this.getTiposCajasAsync();
    await this.getTamanoCajasAsync();
    await this.getDisenosAsync();
    await this.getStockCajasAsync();
    await this.getCajasAsync();

    this.llenarArrayCajas();
  }

  constructor (private stockService: StockCajasService) {}
  


  async getTiposCajasAsync(): Promise<void> {
    try {
      this.tipos = await lastValueFrom(this.stockService.getTiposCajasAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async getTamanoCajasAsync(): Promise<void> {
    try {
      this.tamanos_cajas = await lastValueFrom(this.stockService.getTamanoCajasAsync());
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

  async getStockCajasAsync(): Promise<void> {
    try {
      this.stockCajas = await lastValueFrom(this.stockService.getStockCajasAsync());
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


  async UpdateStockAsync(stock: Stock[]): Promise<void> {
    try {
      await lastValueFrom(this.stockService.UpdateStockAsync(stock));
    } catch(error) {
      console.error(error)
    }
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
    const tamano = this.tamanos_cajas?.find(t => t.id_Tamano === idTamano);
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




  getUrlCaja(idCaja: number): string {
    let idDiseno = this.getiddiseno(idCaja);
    const url = this.disenosCajas?.find(t => t.id_Diseno === idDiseno);   
    return url ? url.url : '';
    
  }

  getCantidadCajasStock(idCaja: number): number {
    const cajasStock = this.stockCajas?.find(t => t.id_Caja === idCaja);
    return cajasStock ? cajasStock.stock : -1;
  }

  mostrarPopUp(idCaja: number){
    this.popUpVisible = true;
    this.idCaja = idCaja;
  
  }

  llenarArrayCajas(){
    //  Llenar array con cada valor que voy a mostrar para que sea más fácil de utilizar
    this.StockCajasMostrar = [];
    this.stockCajas!.forEach(d => {
      this.StockCajasMostrar!.push({
        idCaja: d.id_Caja,
        nombreDiseno: this.getobtenerdiseno(this.getiddiseno(d.id_Caja)),
        nombreTamano: this.getNombreTamano(this.getidtamano(d.id_Caja)),
        nombreTipo: this.getobtenertipo(this.getidtipo(d.id_Caja)),
        cantidad: d.stock
      })
    });
  }

  async guardarCantidad($event: number) {

    //  Esto pasa cuando se confirma la cantidad en el popup
      this.cantidad = 0;
      this.cantidad=$event;
    

      let stock: number = this.getCantidadCajasStock(this.idCaja);
      if(stock < $event){
        // alert("Su Stock no alcanza para la entrega, su stock es de: "+ stock+" ingrese una cantidad disponible");
        this.mensaje= "Su Stock no alcanza para la entrega, su stock es de: "+ stock+" ingrese una cantidad disponible";
        this.openDialog();
        return;
      }

      
    if($event != 0){
      // Es porque dió cancelar al botón de popUp

      try {
        
        // Inserto Orden Armado
        await this.actualizarStock(this.cantidad,this.idCaja);
        
        // Vuelvo a cargar los datos para trabajar con datos actualizados
  
        await this.getCajasAsync();
        await this.getTiposCajasAsync();
        await this.getTamanoCajasAsync();
        await this.getDisenosAsync();
        await this.getStockCajasAsync();

        this.llenarArrayCajas();

    
      } catch (error) {
         console.error('Error al cargar las Ordenes de Armado:', error);
      }



    }

   this.popUpVisible = false;

    }



    async actualizarStock(cantidadCajas:number, idCaja:number){


      this.stockActualizar=[];
      this.stockActualizar.push({
        id_Caja: idCaja,
        stock: this.getCantidadCajasStock(idCaja) - cantidadCajas,
  
        toLowerCase: function (): unknown {
          throw new Error('Function not implemented.');
        }
      })
  
  
      try {
      
        await this.UpdateStockAsync(this.stockActualizar);
        
      } catch (error) {
        // Captura de errores en caso de que ocurran en cualquiera de las llamadas
        console.error('Error al agregar cajas:', error);
      }
  
  
    }

    abrirPopUpTamanoTipo(tamanoTipo: string){
      this.tamanoTipo = tamanoTipo;
      this.popUpTamanoTipoVisible = true;
      
    }




    guardarTamanoTipo($event: string){


      if(this.tamanoTipo=="Tamano"){
        this.tamanioSeleccionado = $event;
     
        
      }else if(this.tamanoTipo=="Tipo"){
        this.tipoSeleccionado = $event;
 
      }
      this.filtrarPorTamano(this.tamanioSeleccionado!,this.tipoSeleccionado!);
      this.popUpTamanoTipoVisible = false;
      this.tamanoTipo="";
    }



    filtrarPorTamano(tamanio: string, tipo:string){
    //  Si tipo es vacio y tamanio está con valor solo buscar por tamano
    if(tipo=="" && tamanio!=""){
      this.llenarArrayCajas();
      this.StockCajasMostrar = this.StockCajasMostrar!.filter( p => p.nombreTamano == tamanio);
        
      // Tamanio vacio y tipo con valor
    } else if (tamanio == "" && tipo!=""){
      this.llenarArrayCajas();
      this.StockCajasMostrar = this.StockCajasMostrar!.filter( p => p.nombreTipo == tipo);
      
      //  filtrar tamanio tipo 
    } else if (tamanio!="" && tipo!= ""){
      this.llenarArrayCajas();
      this.StockCajasMostrar = this.StockCajasMostrar!.filter( p => p.nombreTamano == tamanio && p.nombreTipo == tipo);

    }    

    // this.getStockDisponible(1);
  }

  borrarFiltro(){
    this.tamanioSeleccionado="";
    this.tipoSeleccionado="";
    this.llenarArrayCajas();
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

  cerrar_PopUp_Grande(){
    this.img_Grande_Url ="";
    this.popUpVisibleImgGrande=false;
  }

  setUrlPopUpGrande(url: string){
    this.img_Grande_Url = url;
    this.popUpVisibleImgGrande=true;
  
  }

}
