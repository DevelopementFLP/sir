import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GecosService } from 'src/app/shared/services/gecos.service';
import { MarelService } from 'src/app/shared/services/marel.service';
import { formatDate } from '@angular/common';
import { catchError, debounce } from 'rxjs';

@Component({
  selector: 'sir-mant-graseria',
  templateUrl: './graseria.component.html',
  styleUrls: ['./graseria.component.css'],
})
export class GraseriaComponent {
  fechaDesde: Date;
  fechaHasta: Date;
  fechaDesdeFormatted: string = '';
  fechaHastaFormatted: string = '';


  delanteros: number = 0;
  traseros: number = 0;
  kilosDelantero: number = 0;
  kilosTraseros: number = 0;
  cajasJumbo: number = 0;
  kilosJumbo: number = 0;
  cajasTotal: number = 0;
  kilosTotal: number = 0;
  
  constructor(
    private marelService: MarelService,
    private gecosService: GecosService

    ) {

      this.fechaDesde = new Date();
      this.fechaHasta = new Date();
    }
    
  getData(): void {
    this.resetValues();
    this.formatearFechas();
    this.getEntradasMarel();
    this.getCajasJumbo();
    this.getSalidasMarel();
  }

  private getEntradasMarel(): void {
    this.marelService
      .getDatosTotalEntarda(this.fechaDesdeFormatted, this.fechaHastaFormatted) 
      .subscribe((data) => {
        if (data != null && data != undefined) {
          this.traseros = data[0].cuartos;
          this.kilosTraseros = data[0].pesoCuartos;
          this.delanteros = data[1].cuartos;
          this.kilosDelantero = data[1].pesoCuartos;
        }
      });
  }

  private getSalidasMarel() : void {
    console.log(this.fechaDesdeFormatted, this.fechaHastaFormatted);
    this.marelService
      .getDatosTotalCajas(this.fechaDesdeFormatted, this.fechaHastaFormatted)
      .subscribe( (data) => {
         
          if(data != null && data != undefined) {
            this.cajasTotal = data[0].cajas;
            this.kilosTotal = data[0].kilos;
          }
        },
        )
    }

    private getCajasJumbo() : void {
      this.gecosService.getCajasJumbo(formatDate(this.fechaDesde, 'yyyy-MM-dd', 'es-UY'), formatDate(this.fechaHasta, 'yyyy-MM-dd', 'es-UY'), 'JUMBO')
        .subscribe( (data) => {
          this.cajasJumbo = data.cajas;
          this.kilosJumbo = data.kilos;
        })
    }

    private resetValues() : void {
      this.delanteros = 0;
      this.traseros = 0;
      this.kilosDelantero = 0;
      this.kilosTraseros = 0;
      this.cajasJumbo = 0;
      this.kilosJumbo = 0;
      this.cajasTotal = 0;
      this.kilosTotal = 0;
    }

    handleDateSelect(event: any, idCalendar: number) {
      if(idCalendar === 1)
        this.fechaDesde = event;
      else if(idCalendar === 2)
        this.fechaHasta = event;
    }

    private formatearFechas(sep: string = '') : void {
      this.fechaDesdeFormatted = formatDate(this.fechaDesde, 'yyyy'+ sep + 'MM' + sep +'dd', 'es-UY') + ' 00:00:00'
      this.fechaHastaFormatted = formatDate(this.fechaHasta, 'yyyy'+ sep + 'MM' + sep +'dd', 'es-UY', 'es-UY') + ' 23:59:59';
    }

}
