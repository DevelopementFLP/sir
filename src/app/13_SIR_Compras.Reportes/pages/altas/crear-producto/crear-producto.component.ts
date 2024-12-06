import { Component, OnInit } from '@angular/core';
import { Producto } from '../../../interfaces/Producto.interface';
import { Unidad } from '../../../interfaces/Unidad.interface';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['../../../css/estilos.css', './crear-producto.component.css']
})


export class CrearProductoComponent implements OnInit{
 
  idProducto: number = 0;
  codigoProducto: string ="";
  codigoProductoAlternativo: string ="";
  codigoProductoAlternativo2: string ="";
  fechaCreacion: Date = new Date;
  fechaActualizacion: Date = new Date;
  nombre: string ="";
  idUnidad: number = 0;
  descripcion: string = "";
  producto:Producto[] = [];
  unidades: Unidad[] =[];
  unidadSeleccionada:number=0;

  mostrarUnoEnUno: boolean = false;
 
  ngOnInit(): void {
    console.log("Bienvenido");
    this.unidades.push({
      idUnidad: 0,
      codigo: '1',
      nombre: 'Kilo'
    })

    this.unidades.push({
      idUnidad: 1,
      codigo: '2',
      nombre: 'Litro'
    })

    this.unidades.push({
      idUnidad: 2,
      codigo: '2',
      nombre: 'Gramo'
    })

    this.producto.push({
      idProducto: 0,
      codigoProducto: '11',
      codigoProductoAlternativo: '22',
      codigoProductoAlternativo2: '33',
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      nombre: 'uno',
      idUnidad: 0,
      descripcion: ''
    })
    this.producto.push({
      idProducto: 0,
      codigoProducto: '44',
      codigoProductoAlternativo: '55',
      codigoProductoAlternativo2: '66',
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      nombre: 'dos',
      idUnidad: 0,
      descripcion: ''
    })
    
  }


  

  crearProducto(){

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

    this.producto = [];
    this.producto.push({
      idProducto: 0,
      codigoProducto: this.codigoProducto,
      codigoProductoAlternativo: this.codigoProductoAlternativo,
      codigoProductoAlternativo2: this.codigoProductoAlternativo2,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion,
      nombre: this.nombre,
      idUnidad: this.idUnidad,
      descripcion: this.descripcion
    })
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
    if(this.producto.find(e => e.codigoProducto == this.codigoProducto)){
      existe = true;
      alert("El código del producto ingresado ya existe");
      return true;
    }
    if(this.producto.find(e => e.codigoProductoAlternativo == this.codigoProductoAlternativo)){
      existe = true;
      alert("El código ingresado del producto alternativo ya existe");
      return true;
    }
    if(this.producto.find(e => e.codigoProductoAlternativo2 == this.codigoProductoAlternativo2)){
      existe = true;
      alert("El código ingresado del producto alternativo 2  ya existe");
      return true;
    }
    
    return false;
  }



}
