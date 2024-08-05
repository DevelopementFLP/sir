import { Component, Inject, inject, OnInit , AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { UbicacionesService } from 'src/app/09_SIR.Dispositivos.Apps/Services/UbicacionesService.service';
import Swal from 'sweetalert2';
import { UbicacionDispositivoDTO } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/UbicacionDispositivoDTO';
import { ModalUbicacionComponent } from 'src/app/09_SIR.Dispositivos.Apps/modales/modal-Ubicacion/modal-ubicacion.component';

@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrls: ['./ubicaciones.component.css']
})
export class UbicacionesComponent {

  columnasTabla: string[] = ['nombre','descripcion','estado', 'acciones'];
  dataInicio:UbicacionDispositivoDTO[] = [];
  dataListaUbicaciones = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _ubicacionesServicio : UbicacionesService
  ){}

  obtenerUbicaciones(){

    this._ubicacionesServicio.getUbicacionDispositivo().subscribe({
      next: (data) => {
        if(data.esCorrecto)
          {
            this.dataListaUbicaciones.data = data.resultado;
            
          }else
          {
            console.log("Entre en error al Obtener Ubicaciones")
          }          
      },
      error:(e) =>{}
    })
  }

  ngOnInit(): void {
    this.obtenerUbicaciones();
  }

  ngAfterViewInit(): void {
    this.dataListaUbicaciones.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUbicaciones.filter = filterValue.trim().toLocaleLowerCase();
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
