import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Tipo } from '../../interfaces/Tipo.interface';
import { StockCajasService } from '../../services/stock-cajas.service';
import { lastValueFrom } from 'rxjs';
import { Tamano } from '../../interfaces/Tamano.interface';
import { Diseno } from '../../interfaces/Diseno.interface';
import { Stock } from '../../interfaces/Stock.interface';
import { Caja } from '../../interfaces/Caja.interface';
import { stockMostrar } from '../../interfaces/stockMostrar.interface';


@Component({
  selector: 'app-ver-stock',
  templateUrl: './ver-stock.component.html',
  styleUrls: ['./ver-stock.component.css']
})


export class VerStockComponent implements OnInit, OnDestroy {

  private intervalId: any;

  tipos: Tipo[] | undefined = [];
  tamanos_cajas: Tamano[] | undefined = [];
  disenosCajas: Diseno[] | undefined =[];
  stockCajas: Stock[] | undefined = [];
  cajasCajas: Caja[] | undefined = [];
  StockCajasMostrar: stockMostrar[] | undefined = [];
  filtro: string ="";
  tamanoTipo:string ="Tipo"; 
  tipoSeleccionado: string | null = '';
  tamanioSeleccionado: string | null = '';
  popUpTamanoTipoVisible: boolean | undefined;

    // Variables para popup cuando presiona click en la imagen
    img_Grande_Url: string ="";
    popUpVisibleImgGrande: boolean = false;

    isWorking: boolean = false;

    // Variable para que permita al usuario modificar el stock o no, esto va a depender del logueo del usuario
  modificar:boolean = true;

  popUpVisible: boolean | undefined;

  popupVisibleEditar: boolean = false;
  idCaja: number = -1;
  cantidad: number = 0;
  stockActualizar: Stock[] = [];
  sumaResta: string ="Sumar";
  activoSumar: boolean = true;
  activoRestar: boolean = false;

  nueva_cantidad: number = 0;
  
  async ngOnInit(): Promise<void> {

    await this.iniciar();
  
    this.intervalId = setInterval(async () => {
      if(!this.isWorking)
        await this.iniciar();    
    }, 60000);

   
  }

  ngOnDestroy(): void {
      if(this.intervalId) clearInterval(this.intervalId)
  }

  constructor (private stockService: StockCajasService) {}

  async iniciar(){

    await this.getTiposCajasAsync();
    await this.getTamanoCajasAsync();
    await this.getDisenosAsync();
    await this.getStockCajasAsync();
    await this.getCajasAsync();

    this.llenarArrayCajas();
    this.filtrarPorTamano();
    
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


    // Función filtro que va en el input
  buscadorFiltro(): void {

    this.llenarArrayCajas();
    this.StockCajasMostrar = this.StockCajasMostrar?.filter(c => c.nombreDiseno.toLowerCase().includes(this.filtro.toLowerCase()))
  }

    //Llenar Array StockCajasMostrar
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

  validarNumero(event: Event) {
    const input = event.target as HTMLInputElement;
    var valor: number = parseInt(input.value);

    if(valor < 0) {
      
      input.value = "0";
    }
    
  }

 

  abrirPopupCantidadNueva(cantidad: number, idCaja: number) {

    
    this.popupVisibleEditar = true;
    this.cantidad = cantidad;
    this.idCaja = idCaja;
    this.isWorking = true;
  }

  cerrarPopupCantidadNueva() {
    this.popupVisibleEditar = false;
    this.nueva_cantidad = 0; // Reinicia la cantidad al cerrar el popup

    this.cantidad=0;
    this.idCaja = -1;
    this.isWorking = false;

  }

  sumar(valor: number) {
    // this.cantidad += valor;
    if(this.sumaResta=='Sumar')
      this.cantidad +=valor;
    
    else
      this.cantidad-= valor;

    
  }

  valorSumaResta(valor:string){
    this.sumaResta=valor;

    if(valor=="Sumar"){
      this.activoSumar=true
      this.activoRestar=false

    }else{
      this.activoRestar=true;
      this.activoSumar=false;
    }
  }

  async guardarCantidadNueva() {
    // Implementa la lógica para guardar los datos
  
    try {
      
      // Inserto Orden Armado
      this.actualizarStockCantidadNueva();
            
      // Vuelvo a cargar los datos para trabajar con datos actualizados

      await this.getCajasAsync();
      await this.getTiposCajasAsync();
      await this.getTamanoCajasAsync();
      await this.getDisenosAsync();
      await this.getStockCajasAsync();

      this.llenarArrayCajas();
      this.filtrarPorTamano();

      this.cerrarPopupCantidadNueva(); // Cierra el popup después de guardar

  
    } catch (error) {
       console.error('Error al cargar las Ordenes de Armado:', error);
    }


  }


  getCantidadCajasStock(idCaja: number): number {
    const cajasStock = this.stockCajas?.find(t => t.id_Caja === idCaja);
    return cajasStock ? cajasStock.stock : -1;
  }


  borrar_input(){

    this.cantidad=0;

  }

  mostrarPopUp(idCaja: number){
    this.popUpVisible = true;
    this.idCaja = idCaja;
    this.isWorking = true;
  
  }


  async actualizarStock(cantidadCajas:number, idCaja:number){


    this.stockActualizar=[];
    this.stockActualizar.push({
      id_Caja: idCaja,
      stock: this.getCantidadCajasStock(idCaja) + cantidadCajas,

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


  async actualizarStockCantidadNueva(){

    this.stockActualizar=[];
    this.stockActualizar.push({
      id_Caja: this.idCaja,
      stock: this.nueva_cantidad,

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


  async guardarCantidad($event: number) {

    //  Esto pasa cuando se confirma la cantidad en el popup
      this.cantidad = 0;
      this.cantidad=$event;
    
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
        this.filtrarPorTamano();

    
      } catch (error) {
         console.error('Error al cargar las Ordenes de Armado:', error);
      }



    }

   this.popUpVisible = false;
   this.isWorking = false;

    }



    async guardarCantidad2($event: number) {

      //  Esto pasa cuando se confirma la cantidad en el popup
        this.nueva_cantidad = 0;
        this.nueva_cantidad=$event;
      
       
      if($event != 0){
        // Es porque dió cancelar al botón de popUp
  
        try {
          
          // Inserto Orden Armado
          await this.actualizarStockCantidadNueva();
          
          // Vuelvo a cargar los datos para trabajar con datos actualizados
    
          await this.getCajasAsync();
          await this.getTiposCajasAsync();
          await this.getTamanoCajasAsync();
          await this.getDisenosAsync();
          await this.getStockCajasAsync();
  
          this.llenarArrayCajas();
          this.filtrarPorTamano();
  
      
        } catch (error) {
           console.error('Error al cargar las Ordenes de Armado:', error);
        }
  
  
  
      }
  
     this.popupVisibleEditar = false;
  
      }


      totalStock():number{
        let total:number = 0;
      

        this.StockCajasMostrar!.forEach(s => {
          total = total + s.cantidad;
        });



        return total;


      }



      getUrlCaja(idCaja: number): string {
        let idDiseno = this.getiddiseno(idCaja);
        const url = this.disenosCajas?.find(t => t.id_Diseno === idDiseno);   
        return url ? url.url : '';
        
      }


      abrirPopUpTamanoTipo(tamanoTipo: string){
        this.tamanoTipo = tamanoTipo;
        this.popUpTamanoTipoVisible = true;
        this.isWorking = true;
        
      }
      filtrarPorTamano(){

        let tamanio = this.tamanioSeleccionado;
        let tipo = this.tipoSeleccionado;
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
  
      } else if (tamanio=="" && tipo ==""){
        this.llenarArrayCajas();
      }
  
      // this.getStockDisponible(1);
    }
  

      guardarTamanoTipo($event: string){


        if(this.tamanoTipo=="Tamano"){
          this.tamanioSeleccionado = $event;
       
          
        }else if(this.tamanoTipo=="Tipo"){
          this.tipoSeleccionado = $event;
   
        }
        this.filtrarPorTamano();
        this.popUpTamanoTipoVisible = false;
        this.tamanoTipo="";
        this.isWorking = false;
      }

      

      borrarFiltro(){
        this.tamanioSeleccionado="";
        this.tipoSeleccionado="";
        this.llenarArrayCajas();
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
}

