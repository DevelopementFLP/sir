import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { map } from 'rxjs';
import { CargaKosherService } from '../../services/carga-kosher.service';

@Component({
  selector: 'app-admin-precios',
  templateUrl: './admin-precios.component.html',
  styleUrls: ['./admin-precios.component.css']
})
export class AdminPreciosComponent implements OnInit {
  mostrarBotones: boolean = true;

  fechas: string[] = [];
  eliminarFechas: string[] = [];
  agregarFechas: string[] = [];

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private ckSrvc: CargaKosherService) {}

  ngOnInit(): void {
   this.setFechas();
  }

  private setFechas(): void {
    if(this.config) {
      if(this.config.data.fechas) {
        this.fechas = this.config.data.fechas.map((f: Date) => formatDate(f, "dd-MM-yyyy", "es-UY"));
      }
    }
  }

  eliminarLista(fecha: string) {
    this.eliminarFechas.push(fecha);
  }

  cancelarAgregar(): void {
    this.mostrarBotones = true;
    const agregar = document.querySelector('.listas--agregar');
    if(agregar) {
      agregar.classList.add('hide');
      agregar.classList.remove('show');
    }
  }

  cancelarEliminar(): void {
    this.mostrarBotones = true;

    this.eliminarFechas = [];
    this.setFechas();
    const eliminar = document.querySelector('.listas--eliminar');
    if(eliminar) {
      eliminar.classList.add('hide');
      eliminar.classList.remove('show');
    }
  }

  showEliminar(): void {
    this.mostrarBotones = false;
    const eliminar = document.querySelector('.listas--eliminar');
    const agregar = document.querySelector('.listas--agregar');

    if(eliminar) {
      eliminar.classList.add('show');
      eliminar.classList.remove('hide');
    }

    if(agregar) {
      agregar.classList.add('hide');
      agregar.classList.remove('show');
    }
  }

  showAgregar(): void {
    this.mostrarBotones = false;
    const eliminar = document.querySelector('.listas--eliminar');
    const agregar = document.querySelector('.listas--agregar');

    if(agregar) {
      agregar.classList.add('show');
      agregar.classList.remove('hide');
    }

    if(eliminar) {
      eliminar.classList.add('hide');
      eliminar.classList.remove('show');
    }
  }

  async deleteListaPrecios(): Promise<void> {
    try {
      await this.ckSrvc.deleteFechaPrecio(this.eliminarFechas).toPromise();
      this.dialogRef.close();
    }
    catch {
      console.log("Hubo un error al intentar eliminar alugna lista de precios.")
    }
  }
}
