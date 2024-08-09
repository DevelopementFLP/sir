import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgNumericKeyboardModule } from 'zen-numeric-keyboard';

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




enviarCantidad(){
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

    this.cantidad = this.cantidad * 10 + numero;
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