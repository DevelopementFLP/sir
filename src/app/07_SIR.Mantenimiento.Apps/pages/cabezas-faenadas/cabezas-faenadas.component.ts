import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CabezaFaenada } from '../../interfaces/CabezaFaenada.interface';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { formatDate } from '@angular/common';
import { DataCabezaFaenada } from '../../interfaces/DataCabezaFaenada.interface';

@Component({
  selector: 'app-cabezas-faenadas',
  templateUrl: './cabezas-faenadas.component.html',
  styleUrls: ['./cabezas-faenadas.component.css', './max-width-600px.css', './min-width-601px.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CabezasFaenadasComponent implements OnInit {

  chartData: any;
  chartOptions: any;

  fechaFaenaDesde: Date = new Date();
  fechaFaenaHasta: Date = new Date();
  cabezasFaenadas: CabezaFaenada[] | undefined = [];

  idReporte: number = 5;
  nombreReporte: string = '';

  dataCabezas: DataCabezaFaenada = 
  {
    animales: 0,
    medias: 0,
    kilosPie: 0,
    kilosSegunda: 0
  }

  constructor( private mantenimientoSrvc: MantenimientoService) {}

  async ngOnInit(): Promise<void> {
    await this.setAll();
  }

  private async getCabezasFaenadas() {
    this.cabezasFaenadas = await this.mantenimientoSrvc.getCabezasFaenadas(this.formatFecha(this.fechaFaenaDesde), this.formatFecha(this.fechaFaenaHasta)).toPromise();
  }

  private formatFecha(fecha: Date): string {
    return formatDate(fecha, "yyyy-MM-dd", "es-UY");
  }

  private fechaReporte(fecha: Date): string {
    return formatDate(fecha, "dd-MM-yyyy", "es-UY");
  }

  private async setAll(): Promise<void> {
    await this.getCabezasFaenadas();
    await this.setData()
    await this.setChartData();
  } 

  private async setData(): Promise<void> {
      await this.loadDataFromResponse();
      this.nombreReporte = `Cabezas faenadas ${this.fechaReporte(this.fechaFaenaDesde)} al ${this.fechaReporte(this.fechaFaenaHasta)}`;
  }

  async searchData(): Promise<void> {
    await this.setAll();
  }

  private async loadDataFromResponse(): Promise<void> {
    this.dataCabezas = {
      animales: this.getAnimales() / 2,
      medias: this.getAnimales(),
      kilosPie: this.getKilosEnPie() / 2, 
      kilosSegunda: this.getKilosEnSegundaBalanza()
    }
  }

  private getAnimales(): number {
    return this.cabezasFaenadas?.length!;
  }

  private getKilosEnPie(): number {
    var total: number = 0;

    total = this.cabezasFaenadas!.reduce((total, c) => {
      return total + (c?.pesoEnPie ?? 0);
    }, 0);
  
    return total;
  }

  private getKilosEnSegundaBalanza(): number {
    var total: number = 0;

    total = this.cabezasFaenadas!.reduce((total, c) => {
      return total + (c?.pesoMedia ?? 0);
    }, 0);
  
    return total;
  }


  private setChartData(): void {
    this.setChartOptions();
    this.setChartValues();
  }


  private setChartOptions(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    
    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder
              }
          },
          y: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder
              }
          }
      }
    };
  }

  private setChartValues(): void {
    this.chartData = {
      labels: this.getChartHoras(),
      datasets: [{
        label: 'Peso Medias',
        data: this.getChartKilos(),
        fill: true,
        tension: 0.1
      }
    ]
    }
  }

  private getChartHoras(): Date[] {
    return this.extractProperty(this.cabezasFaenadas!, 'fechaHoraEtiquetado');
  }

  private getChartKilos(): number[] {
    return this.getSumaKilos(this.extractProperty(this.cabezasFaenadas!, 'pesoMedia'));
  }

  private extractProperty<T>(array: T[], property: keyof T): any[] {
    return array.map(item => item[property]);
  }

  private getSumaKilos(kilos: number[]): number[] {
    const sumaKilos = kilos.reduce((acumulador: number[], elemento, indice) => {
     if(indice === 0) return [elemento];
     else {
       const sumaAnterior = acumulador[indice - 1];
       const sumaActual = sumaAnterior + elemento;
       return [...acumulador, sumaActual];
     }
   }, [] as number[]) 
   return sumaKilos;  
 }

}
