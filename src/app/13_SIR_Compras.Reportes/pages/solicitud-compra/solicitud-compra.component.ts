import { Component, OnInit } from '@angular/core';
import { AreaDestino } from '../../interfaces/AreaDestinto.interface';
import { Producto } from '../../interfaces/Producto.interface';
import { Unidad } from '../../interfaces/Unidad.interface';
import { Prioridad } from '../../interfaces/Prioridad.interface';
import { LineadeSolicitud } from '../../interfaces/LineaDeSolicitud.interface';


@Component({
  selector: 'app-solicitud-compra',
  templateUrl: './solicitud-compra.component.html',
  styleUrls: ['../../css/estilos.css','./solicitud-compra.component.css']
})
export class SolicitudCompraComponent implements OnInit{
  
  mostrarProductos: boolean = false;
  idArea!: number;
  areaDestino: AreaDestino[] = [];
  idProducto!: number;
  idOrden!: number;
  cantidad!: number;
  nombreProducto!: string;
  nombreUnidad!: string;
  codigoProducto!: string;

  productosActivos: Producto[] = [];
  unidadesActivas: Unidad[] = [];
  prioridadesActivas: Prioridad[] = [];
  idPrioridad!: number;
  crearSolicitud: LineadeSolicitud[] =[];
  tablamostrar:boolean = false;
  
  ngOnInit(): void {
 

    // Cargar al inicio desde la bd 
      // this.unidadesActivas
      // this.areaDestino
      // this.productosActivos
      // this.prioridadesActivas

    this.unidadesActivas.push({
      idUnidad: 1,
      codigo: '01',
      nombre: 'Unidad 1'
    })

    this.unidadesActivas.push({
      idUnidad: 2,
      codigo: '02',
      nombre: 'Unidad 2'
    })
    this.unidadesActivas.push({
      idUnidad: 3,
      codigo: '03',
      nombre: 'Unidad 3'
    })
    this.unidadesActivas.push({
      idUnidad: 4,
      codigo: '04',
      nombre: 'Unidad 4'
    })

    this.areaDestino.push({
      idArea: 0,
      nombre: 'Mantenimiento'
    })

    this.areaDestino.push({
      idArea: 1,
      nombre: 'Control calidad'
    })
   

    this.productosActivos.push({
      idProducto: 0,
      codigoProducto: '111',
      codigoProductoAlternativo: '123',
      codigoProductoAlternativo2: '123',
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      nombre: 'Eléctrodo',
      idUnidad: 1,
      descripcion: ''
    })
    this.productosActivos.push({
      idProducto: 1,
      codigoProducto: '222',
      codigoProductoAlternativo: '123',
      codigoProductoAlternativo2: '123',
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      nombre: 'Eléctrodo22',
      idUnidad: 4,
      descripcion: ''
    })
    this.productosActivos.push({
      idProducto: 2,
      codigoProducto: '333',
      codigoProductoAlternativo: '123',
      codigoProductoAlternativo2: '123',
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      nombre: 'Eléctrodo2',
      idUnidad: 2,
      descripcion: ''
    })
    this.productosActivos.push({
      idProducto: 3,
      codigoProducto: '444',
      codigoProductoAlternativo: '123',
      codigoProductoAlternativo2: '123',
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      nombre: 'Eléctrodo3',
      idUnidad: 3,
      descripcion: ''
    })


    this.prioridadesActivas.push({
      idPrioridad: 0,
      nombre: 'Baja'
    })
    this.prioridadesActivas.push({
      idPrioridad: 1,
      nombre: 'Media'
    })
    this.prioridadesActivas.push({
      idPrioridad: 2,
      nombre: 'Alta'
    })

    console.log(this.crearSolicitud);

  }

  crearOrdenSolicitud(){

    console.log(this.idArea);
    if(this.validarDatos() == false){
      return;
    }

    if(this.existeProducto() == true){
      return;
    }

    this.crearSolicitud.push({
      idLineaDeSolicitud: 0,
      idOrden: 0,
      idProducto: this.idProducto,
      idArea: Number(this.idArea),
      cantidad: this.cantidad
    })
  }



  getNombreUnidad(idUnidad: number){

    const unidades = this.unidadesActivas.find(p => p.idUnidad === idUnidad);
    return unidades?.nombre.toString() ;
  }
  getUnidadDeProducto(idProducto: number): number{

    const producto = this.productosActivos.find(p => p.idProducto === idProducto);
    return producto?.idUnidad || -1;
  }

  getNombreProducto(idProducto: number){

    const producto = this.productosActivos.find(p => p.idProducto === idProducto);
    return producto?.nombre;
  }
  getNombreAreaDestino(idArea: number){

    console.log(idArea);
    const area = this.areaDestino.find(p => p.idArea === idArea);
    return area?.nombre;
  }

  getCodigoProductoDeId(idProducto: number){
    const codigo = this.productosActivos.find(p => p.idProducto === idProducto);
    return codigo?.codigoProducto;
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
    if(this.idPrioridad == undefined){
      alert("Seleccione la prioridad de la solicitud");
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
    
    // Verifico si existe la empresa, primero lo paso todo a minuscula por si existe pero con mayuscula o al revés
    if(this.crearSolicitud.find(e => e.idProducto == this.idProducto)){
      existe = true;
      alert("El producto ingresado ya está en la lista");
      return true;
    }
    
    return false;
  }


}
