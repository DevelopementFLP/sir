import { Component } from '@angular/core';
import { DashSecundarioService } from '../../services/dashboard-secundario.service';
import { CajasHora } from '../../interfaces/CajasHora.interface';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-kilos-minuto',
  templateUrl: './kilos-minuto.component.html',
  styleUrls: ['./kilos-minuto.component.css']
})
export class KilosMinutoComponent {
  constructor(private dashService: DashSecundarioService) {}

  cajasPorHora: CajasHora[] | undefined;
  fecha: Date = new Date();
  fechaString: string = '';

  // arrays para gráfico
  horas: Date[] = [];
  cantidad: number[] = [];
  kilos: number[] = [];
  data: any;
  options: any;
  totalData: any;

  async ngOnInit(): Promise<void> {
    this.setFechaString();
    await this.getData();
    this.setChartOption(); 
  }

  private setFechaString(): void {
    this.fechaString = formatDate(this.fecha, "yyyy-MM-dd", "es-UY");
  }
  
  async getData(): Promise<void> {
    
    this.setFechaString();
    this.cajasPorHora = await this.dashService.getCajasHora(this.fechaString).toPromise();
    this.cajasPorHora = this.cajasPorHora?.filter(c => c.cantidad > 0);
    
    this.horas = this.cajasPorHora?.map(c => c.fecha)!;
    this.cantidad = this.cajasPorHora?.map(c => c.cantidad)!;
    this.kilos = this.cajasPorHora?.map(c => c.kilos)!;

    this.setChartData();
  }

  private setChartOption(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    
    this.options = {
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
  
  private setChartData(): void {
    this.data = {
      labels: this.horas,
      datasets: [
        {
          label: 'kilos / minuto',
          data: this.kilos,
          fill: true,
          tension: 0.1
        }
      ]
    }

    this.totalData = {
      labels: this.horas,
      datasets: [
        {
          label: 'kilos',
          data: this.getSumaCajas(),
          fill: true,
          tension: 0.1
        }
      ]
    }
  }


  private getSumaCajas(): number[] {
    const sumaCajas = this.cantidad.reduce((acumulador: number[], elemento, indice) => {
     if(indice === 0) return [elemento];
     else {
       const sumaAnterior = acumulador[indice - 1];
       const sumaActual = sumaAnterior + elemento;
       return [...acumulador, sumaActual];
     }
   }, [] as number[]) 
   return sumaCajas;  
 }
}
