import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PesoBrutoContenedor } from '../../Interfaces/PesoBrutoContenedor.interface';

@Component({
  selector: 'app-peso-neto-contenedor',
  templateUrl: './peso-neto-contenedor.component.html',
  styleUrls: ['./peso-neto-contenedor.component.css']
})
export class PesoNetoContenedorComponent implements OnInit{

  pesosContenedores: PesoBrutoContenedor[] = [];
  contenedoresStr: string = '';
  contenedores: string[] = [];
  
  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
  ) {}

  ngOnInit(): void {
    if(this.config && this.config.data && this.config.data.contenedores) {
      this.contenedoresStr= this.config.data.contenedores;
      this.contenedores = this.contenedoresStr.split(',');

      this.contenedores.forEach(cont => {
        this.pesosContenedores.push({
          contenedor: cont,
          pesoBruto: 0
        })
      });
    }
  }

  guardar(): void {
    this.ref.close(this.pesosContenedores);
    this.ref.destroy();
  }

  habilitarGuardar(): boolean {
    return this.pesosContenedores.find(p => p.pesoBruto == 0) != undefined;
  }

  select(event: Event): void {
    const input = event.target as HTMLInputElement;
    if(input) input.select();
  }
}
