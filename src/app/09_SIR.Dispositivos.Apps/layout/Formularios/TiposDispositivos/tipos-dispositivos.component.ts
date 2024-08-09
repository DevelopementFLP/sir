import { Component,  ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';


import Swal from 'sweetalert2';

import { TipoDispositivoDTO } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/TipoDispositivoDTO';
import { UbicacionDispositivoDTO } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/UbicacionDispositivoDTO';

import { ModalTipoDispositivoComponent } from 'src/app/09_SIR.Dispositivos.Apps/modales/modal-tipoDispositivo/modal-tipo-dispositivo.component';
import { ModalUbicacionComponent } from 'src/app/09_SIR.Dispositivos.Apps/modales/modal-Ubicacion/modal-ubicacion.component';


import { TiposDispositivosService } from 'src/app/09_SIR.Dispositivos.Apps/Services/TiposDispositivos.service';
import { UbicacionesService } from 'src/app/09_SIR.Dispositivos.Apps/Services/UbicacionesService.service';



@Component({
  selector: 'app-tipos-dispositivos',
  templateUrl: './tipos-dispositivos.component.html',
  styleUrls: ['./tipos-dispositivos.component.css']
})
export class TiposDispositivosComponent {


  columnasTablaTipos: string[] = ['nombre', 'comandoInicio','comandoFin', 'acciones'];

  //Tipos de Datos
  dataInicioTipoDeDato:TipoDispositivoDTO[] = [];
  dataInicioUbicacion: UbicacionDispositivoDTO[] = [];

  //Tabla
  dataListaTipos = new MatTableDataSource(this.dataInicioTipoDeDato);
  dataListaUbicacion = new MatTableDataSource(this.dataInicioUbicacion); 


  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _TiposDispositivoServices : TiposDispositivosService,
    private _ubicacionesServicio : UbicacionesService
  ){}

  ngOnInit(): void {
    this.obtenerTiposDispositivos();
    this.obtenerUbicaciones();
  }

  ngAfterViewInit(): void {
    this.dataListaTipos.paginator = this.paginacionTabla;
    this.dataListaUbicacion.paginator = this.paginacionTabla;
  }


  //Tipo Dispositivo
  obtenerTiposDispositivos(){

    this._TiposDispositivoServices.getTiposDispositivo().subscribe({
      next: (data) => {
        if(data.esCorrecto)
          {
            this.dataListaTipos.data = data.resultado;
          }else
          {
            console.log("Entre en error al Obtener Ubicaciones")
          }          
      },
      error:(e) =>{}
    })
  }

  obtenerUbicaciones(){

    this._ubicacionesServicio.getUbicacionDispositivo().subscribe({
      next: (data) => {
        if(data.esCorrecto)
          {
            this.dataListaUbicacion.data = data.resultado;
            
          }else
          {
            console.log("Entre en error al Obtener Ubicaciones")
          }          
      },
      error:(e) =>{}
    })
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaTipos.filter = filterValue.trim().toLocaleLowerCase();
    this.dataListaUbicacion.filter = filterValue.trim().toLocaleLowerCase();
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
              // this._utilidadServicio.mostrarAlerta("El producto fue eliminado","Listo!");
              console.log("Te mate")
              this.obtenerTiposDispositivos();
            }else
              // this._utilidadServicio.mostrarAlerta("No se pudo eliminar el producto","Error");
              console.log("Algo rompiste")
          },
          error:(e) =>{}
        })
      }
    })
  }


//Ubicacion Dispositivo
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
              // this._utilidadServicio.mostrarAlerta("El producto fue eliminado","Listo!");
              console.log("Te mate")
              this.obtenerUbicaciones();
            }else
              // this._utilidadServicio.mostrarAlerta("No se pudo eliminar el producto","Error");
              console.log("Algo rompiste")
          },
          error:(e) =>{}
        })
      }
    })
  }
}
