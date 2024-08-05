import { Component, Inject, inject, OnInit , AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { FormatoDispositivoDTO } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/FormatosDTO';
import { ModalformatoComponent } from 'src/app/09_SIR.Dispositivos.Apps/modales/modal-Formato/modalformato.component';
import { FormatoService } from 'src/app/09_SIR.Dispositivos.Apps/Services/FormatoService.service';

@Component({
  selector: 'app-formatos',
  templateUrl: './formatos.component.html',
  styleUrls: ['./formatos.component.css']
})
export class FormatosComponent {

  columnasTabla: string[] = ['idFormato', 'substring_desde','substring_hasta','error_lectura', 'acciones'];
  dataInicio:FormatoDispositivoDTO[] = [];
  
  dataListaformatos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _formatosService : FormatoService
  ){}

  obtenerFormatos(){

    this._formatosService.getFormatoDispositivo().subscribe({
      next: (data) => {
        if(data.esCorrecto)
          {
            this.dataListaformatos.data = data.resultado;
          }else
          {
            console.log("Entre en error al Obtener Ubicaciones")
          }          
      },
      error:(e) =>{}
    })
  }

  ngOnInit(): void {
    this.obtenerFormatos();
  }

  ngAfterViewInit(): void {
    this.dataListaformatos.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaformatos.filter = filterValue.trim().toLocaleLowerCase();
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
              // this._utilidadServicio.mostrarAlerta("El producto fue eliminado","Listo!");
              console.log("Te mate")
              this.obtenerFormatos();
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
