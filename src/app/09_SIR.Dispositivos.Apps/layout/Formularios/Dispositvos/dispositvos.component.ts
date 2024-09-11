import { Component, Inject, inject, OnInit , AfterViewInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

//Modelos
import { DispositivoDTO } from '../../../Interfaces/DispositivoDTO';
import { FormatoDispositivoDTO } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/FormatosDTO';
import { TipoDispositivoDTO } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/TipoDispositivoDTO';
import { UbicacionDispositivoDTO } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/UbicacionDispositivoDTO';


//Modales
import { ModalDispositivoComponent } from 'src/app/09_SIR.Dispositivos.Apps/modales/modal-dispositivo/modal-dispositivo.component';
import { ModalformatoComponent } from 'src/app/09_SIR.Dispositivos.Apps/modales/modal-Formato/modalformato.component';
import { ModalTipoDispositivoComponent } from 'src/app/09_SIR.Dispositivos.Apps/modales/modal-tipoDispositivo/modal-tipo-dispositivo.component';
import { ModalUbicacionComponent } from 'src/app/09_SIR.Dispositivos.Apps/modales/modal-Ubicacion/modal-ubicacion.component';

//Servicios
import { DispositivosService } from '../../../Services/DispositivoService.service';
import { FormatoService } from 'src/app/09_SIR.Dispositivos.Apps/Services/FormatoService.service';
import { TiposDispositivosService } from 'src/app/09_SIR.Dispositivos.Apps/Services/TiposDispositivos.service';
import { UbicacionesService } from 'src/app/09_SIR.Dispositivos.Apps/Services/UbicacionesService.service';
import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilities/UtilidadesService.service';


@Component({
  selector: 'app-dispositvos',
  templateUrl: './dispositvos.component.html',
  styleUrls: ['./dispositvos.component.css']
})
export class DispositvosComponent implements OnInit {

  //Columnas de Tablas
  columnasTablaDispositivos: string[] = ['nombre','ip','puerto','descripcion','estado','tipo', 'ubicacion', 'formato', 'acciones'];
  columnaTablaFormatos: string[] = ['idFormato', 'substring_desde','substring_hasta','error_lectura', 'acciones'];
  columnasTablaTipos: string[] = ['nombre', 'comandoInicio','comandoFin', 'acciones'];
  columnasTablaUbicaciones: string[] = ['nombre','descripcion','estado', 'acciones'];


  //Data de Inicio
  dataInicioDispositivo:DispositivoDTO[] = [];
  dataInicioFormatos : FormatoDispositivoDTO[] = [];
  dataInicioTipoDeDato:TipoDispositivoDTO[] = [];
  dataInicioUbicaciones:UbicacionDispositivoDTO[] = [];

  //Listas
  dataListaDispositivos: DispositivoDTO[] = this.dataInicioDispositivo;
  dataListaformatos: FormatoDispositivoDTO[] = this.dataInicioFormatos;
  dataListaTipos: TipoDispositivoDTO[] = this.dataInicioTipoDeDato;
  dataListaUbicaciones: UbicacionDispositivoDTO[] = this.dataInicioUbicaciones;
  // dataListaDispositivos = new MatTableDataSource<DispositivoDTO>(this.dataInicioFormatos);
  // dataListaformatos = new MatTableDataSource<FormatoDispositivoDTO>(this.dataInicioFormatos);
  // dataListaTipos = new MatTableDataSource<TipoDispositivoDTO>(this.dataInicioTipoDeDato);
  // dataListaUbicaciones = new MatTableDataSource<UbicacionDispositivoDTO>(this.dataInicioUbicaciones);

  //Paginator
  @ViewChild('paginacionTablaDispositivos', { static: false }) paginacionTablaDispositivos! : MatPaginator;
  @ViewChild('paginacionTablaFormato') paginacionTablaformatos! : MatPaginator;
  @ViewChild('paginacionTablaTiposDispositivos') paginacionTablaTiposDeDispositivos! : MatPaginator;
  @ViewChild('paginacionTablaUbicaciones') paginacionTablaUbicaciones! : MatPaginator;


  constructor(
    private dialog: MatDialog,
    private _utilidadesServicicio: UtilidadesService,
    private _dispositivoServicio : DispositivosService,
    private _formatosService : FormatoService,
    private _TiposDispositivoServices : TiposDispositivosService,
    private _ubicacionesServicio : UbicacionesService
  ){}

  ngOnInit(): void {
    this.obtenerDispositivos();
    this.obtenerFormatos();
    this.obtenerTiposDispositivos();
    this.obtenerUbicaciones();
  }

  ngAfterViewInit(): void {
    // this.dataListaDispositivos.paginator = this.paginacionTablaDispositivos;
    // this.dataListaformatos.paginator = this.paginacionTablaformatos;
    // this.dataListaTipos.paginator = this.paginacionTablaTiposDeDispositivos;
    // this.dataListaUbicaciones.paginator = this.paginacionTablaUbicaciones;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataListaDispositivos.filter = filterValue.trim().toLocaleLowerCase();
    // this.dataListaformatos.filter = filterValue.trim().toLocaleLowerCase();
    // this.dataListaTipos.filter = filterValue.trim().toLocaleLowerCase();
    // this.dataListaUbicaciones.filter = filterValue.trim().toLocaleLowerCase();
  }


/* #region Zona_Dispositivos */
  obtenerDispositivos(){

    this._dispositivoServicio.getDispositivos().subscribe({
      next: (data) => {
        if(data.esCorrecto)
          {
            //this.dataListaDispositivos.data = data.resultado; 
            this.dataListaDispositivos = data.resultado;            
          }else
          {
            this._utilidadesServicicio.mostrarAlerta("No se encontraron ","Datos")
          }          
      },
      error:(e) =>{
        console.error('Error al obtener dispositivos', e);
        this._utilidadesServicicio.mostrarAlerta("Error al obtener datos", "Error");
      }
    })
  }

  nuevoDispositivo(){
    this.dialog.open(ModalDispositivoComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado =>{
      if(resultado === "true") this.obtenerDispositivos();
    });
  }

  editarDispositivo(producto:DispositivoDTO){
    this.dialog.open(ModalDispositivoComponent, {
      disableClose:true,
      data: producto
    }).afterClosed().subscribe(resultado =>{
      if(resultado === "true") this.obtenerDispositivos();
    });
  }


  eliminarDispositivo(producto:DispositivoDTO){

    Swal.fire({
      title: '¿Desea eliminar el Dispositivo?',
      text: producto.nombre,
      icon:"warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) =>{

      if(resultado.isConfirmed){

        this._dispositivoServicio.deleteDispositivos(producto.idDispositivo).subscribe({
          next:(data) =>{
            if(data.esCorrecto){
              this._utilidadesServicicio.mostrarAlerta("El Dispositivo fue eliminado","Listo!");
              this.obtenerDispositivos();
            }else
              this._utilidadesServicicio.mostrarAlerta("No se pudo eliminar el Dispositivo","Error");
          },
          error:(e) =>{}
        })
      }
    })
  }
/* #endregion */


/* #region Zona_Formatos */

  obtenerFormatos(){

    this._formatosService.getFormatoDispositivo().subscribe({
      next: (data) => {
        if(data.esCorrecto)
          {
            //this.dataListaformatos.data = data.resultado;
            this.dataListaformatos = data.resultado;
          }else
          {
            this._utilidadesServicicio.mostrarAlerta("No se encontraron ","Datos")
          }          
      },
      error:(e) =>{}
    })
  }

  nuevFormatoDisp(){
    this.dialog.open(ModalformatoComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado =>{
      if(resultado === "true") this.obtenerFormatos();
    });
  }

  editarFormato(formato: FormatoDispositivoDTO){
    this.dialog.open(ModalformatoComponent, {
      disableClose:true,
      data: formato
    }).afterClosed().subscribe(resultado =>{
      if(resultado === "true") this.obtenerFormatos();
    });
  }


  eliminarFormato(formato: FormatoDispositivoDTO){

    Swal.fire({
      title: '¿Desea eliminar el Formato?',
      text: "Formato Seleccionado",
      icon:"warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) =>{

      if(resultado.isConfirmed){

        this._formatosService.deleteFormatoDispositivo(formato.idFormato).subscribe({
          next:(data) =>{
            if(data.esCorrecto){
              this._utilidadesServicicio.mostrarAlerta("El Formato fue eliminado","Listo!");
              this.obtenerFormatos();
            }else
              this._utilidadesServicicio.mostrarAlerta("No se pudo eliminar el Formato","Error");
          },
          error:(e) =>{}
        })
      }
    })
  }

/* #endregion */

/* #region Zona_Tipos_De_Dispositivos */
obtenerTiposDispositivos(){

  this._TiposDispositivoServices.getTiposDispositivo().subscribe({
    next: (data) => {
      if(data.esCorrecto)
        {
          //this.dataListaTipos.data = data.resultado;
          this.dataListaTipos = data.resultado;
        }else
        {
          this._utilidadesServicicio.mostrarAlerta("No se encontraron ","Datos")
        }          
    },
    error:(e) =>{}
  })
}

nuevTipoDisp(){
  this.dialog.open(ModalTipoDispositivoComponent, {
    disableClose:true
  }).afterClosed().subscribe(resultado =>{
    if(resultado === "true") this.obtenerTiposDispositivos();
  });
}

editarTipoDispositivo(tipo: TipoDispositivoDTO){
  this.dialog.open(ModalTipoDispositivoComponent, {
    disableClose:true,
    data: tipo
  }).afterClosed().subscribe(resultado =>{
    if(resultado === "true") this.obtenerTiposDispositivos();
  });
}


eliminarTipoDispositivo(tipo: TipoDispositivoDTO){

  Swal.fire({
    title: '¿Desea eliminar el Tipo?',
    text: tipo.nombre,
    icon:"warning",
    confirmButtonColor: '#3085d6',
    confirmButtonText: "Si, eliminar",
    showCancelButton: true,
    cancelButtonColor: '#d33',
    cancelButtonText: 'No, volver'
  }).then((resultado) =>{

    if(resultado.isConfirmed){

      this._TiposDispositivoServices.deleteTiposDispositivo(tipo.idTipo).subscribe({
        next:(data) =>{
          if(data.esCorrecto){
            this._utilidadesServicicio.mostrarAlerta("El Tipo fue eliminado","Listo!");
            this.obtenerTiposDispositivos();
          }else
            this._utilidadesServicicio.mostrarAlerta("No se pudo eliminar el Tipo","Error");
        },
        error:(e) =>{}
      })
    }
  })
}

/* #endregion */

/* #region Zona_Ubicaciones */

obtenerUbicaciones(){

  this._ubicacionesServicio.getUbicacionDispositivo().subscribe({
    next: (data) => {
      if(data.esCorrecto)
        {
          //this.dataListaUbicaciones.data = data.resultado;
          this.dataListaUbicaciones = data.resultado;
          
        }else
        {
          console.log("Entre en error al Obtener Ubicaciones")
        }          
    },
    error:(e) =>{}
  })
}

nuevaUbicacionDisp(){
  this.dialog.open(ModalUbicacionComponent, {
    disableClose:true
  }).afterClosed().subscribe(resultado =>{
    if(resultado === "true") this.obtenerUbicaciones();
  });
}

editarUbicaciones(ubicacion: UbicacionDispositivoDTO){
  this.dialog.open(ModalUbicacionComponent, {
    disableClose:true,
    data: ubicacion
  }).afterClosed().subscribe(resultado =>{
    if(resultado === "true") this.obtenerUbicaciones();
  });
}


eliminarUbicacion(ubicacion: UbicacionDispositivoDTO){

  Swal.fire({
    title: '¿Desea eliminar la Ubicacion?',
    text: ubicacion.nombre,
    icon:"warning",
    confirmButtonColor: '#3085d6',
    confirmButtonText: "Si, eliminar",
    showCancelButton: true,
    cancelButtonColor: '#d33',
    cancelButtonText: 'No, volver'
  }).then((resultado) =>{

    if(resultado.isConfirmed){

      this._ubicacionesServicio.deleteUbicacionDispositivo(ubicacion.idUbicacion).subscribe({
        next:(data) =>{
          if(data.esCorrecto){
            this._utilidadesServicicio.mostrarAlerta("La Ubicacion fue eliminado","Listo!");
            this.obtenerUbicaciones();
          }else
            this._utilidadesServicicio.mostrarAlerta("No se pudo eliminar la Ubicacion","Error");
        },
        error:(e) =>{}
      })
    }
  })
}

/* #endregion */
}

