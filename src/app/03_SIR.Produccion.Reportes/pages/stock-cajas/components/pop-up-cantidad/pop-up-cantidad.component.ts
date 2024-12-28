import { Component,EventEmitter, Output} from '@angular/core';


@Component({
  selector: 'app-pop-up-cantidad',
  templateUrl: './pop-up-cantidad.component.html',
  styleUrls: ['./pop-up-cantidad.component.css']

})


export class PopUpCantidadComponent{
  sumaResta: string ="Sumar";


  
  activoSumar: boolean = true;
  cantidad: number = 0;
  @Output() cantidadSeleccionada = new EventEmitter<number>();
  activoRestar: boolean = false;

  nueva_cantidad: number = 0;

  mensaje: string ="";

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
  aceptarDialog(): void {
    const dialog = document.getElementById('confirmDialogPedidoCaja');
    if (dialog) {
      // Envia cantidad aceptando el dialogo
      this.cantidadSeleccionada.emit(this.cantidad);
      this.cantidad=0;
      dialog.style.display = 'none'; // Oculta el diálogo

    }
  }

enviarCantidad(){

  
  if(this.cantidad>=1000){
   
      this.mensaje = "El número de cajas es Mayor o igual a 1000 ¿desea continuar? ";
      // alert("El saldo necesario es de "+saldo+" cajas, ingrese una cantidad igual o menor a la cantidad necesaria");
      this.openDialog();
      return;
  }
  this.cantidadSeleccionada.emit(this.cantidad);
  this.cantidad=0;
}

cancelar(){
  this.cantidadSeleccionada.emit(0);
  this.cantidad=0;
}
  
  borrar_input(){
  
    this.cantidad=0;
  
  }
  

  sumar(valor: number) {

    this.cantidad = valor;
  }


  validarNumero(event: Event) {
    const input = event.target as HTMLInputElement;
    var valor: number = parseInt(input.value);

    if(valor < 0) {
      
      input.value = "0";
    }

    
    
  }


  valorSumaResta(){
    if(this.activoSumar==true){
      
      this.activoSumar=false;
      this.activoRestar=true;
      this.sumaResta = "Restar";
    }
    else if(this.activoRestar==true){
    
      this.activoRestar=false;
      this.activoSumar=true;
      this.sumaResta = "Sumar";
    }
    
  }


  confirmarCantidad() {
    this.cantidadSeleccionada.emit(this.cantidad);  // Emitir la cantidad seleccionada al componente padre
  }

  
  //  PopUp
  botonNumerico(numero: number){


    if(this.cantidad== 0 && numero == 0)
      return

    let resultado: number = this.cantidad * 10 + numero;

    if(resultado > 10000){
      alert("Ingrese una cantidad menor a 10.000");
      this.cantidad = 0;
    }else{

      this.cantidad = resultado;
    }
  }

  borrarUnNumero(){

    let cantidad: string = this.cantidad.toString();
     
    cantidad = cantidad.slice(0, -1); 
    this.cantidad = Number(cantidad); 

  }

  borrarTodo(){
    this.cantidad= 0;
  }

}