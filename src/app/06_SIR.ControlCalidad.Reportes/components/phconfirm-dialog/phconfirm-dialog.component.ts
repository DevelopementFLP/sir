import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-phconfirm-dialog',
  templateUrl: './phconfirm-dialog.component.html',
  styleUrls: ['./phconfirm-dialog.component.css']
})
export class PHConfirmDialogComponent implements  OnInit{

  fechaFaena: string = '';
  rechazados: string[] = [];

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig) {}

  ngOnInit(): void {
    if(this.config) {
      this.fechaFaena = this.config.data.fechaFaena;
      this.rechazados = this.config.data.rechazados;
    }  
  }

  formatFecha(): string {
    return formatDate(this.fechaFaena, "dd/MM/yyyy", "es-UY")?? '';
  }

  closeDialog(): void {
    this.ref.close();
    this.ref.destroy();
  }

  guardarData(): void {
    this.ref.close('Guardado');
    this.ref.destroy();
  }
}
