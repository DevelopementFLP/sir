import { Component, OnInit } from '@angular/core';
import { AnimalesFaenadosDay } from './interfaces/AnimalesFaenadosDay.interface';
import { AnimalesGradeYear } from './interfaces/AnimalesGradeYear.interface';
import { DashboardService } from './services/dashboard.service';
import { lastValueFrom } from 'rxjs';
import { AnimalesMes } from './interfaces/AnimalesMes.interface';
import { DataSetGrafico } from './interfaces/DataSetGrafico.interface';
import { AnimalesMesAnio } from './interfaces/AnimalesMesAnio.interface';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['css/animate.css', './welcome.component.css', 'css/mediaquery_maxh690_maxw870.css', 'css/mediaquery_maxw1160.css', 'css/mediaquery_minw871_maxw1550.css']
})
export class WelcomeComponent implements OnInit {

  anioActual: number = new Date().getFullYear();
  anios: number[] = [];

  documentStyle!: CSSStyleDeclaration;
  textColor!: string;
  textColorSecondary!: string;
  surfaceBorder!: string;

  animalesFaenados: AnimalesFaenadosDay[] = [];
  animalesGradeYear: AnimalesGradeYear[] = [];
  animalesPorMes: AnimalesMes[] = [];
  animalesMesAnio: AnimalesMesAnio[] = [];
  totalAnimalesFaenados: number = 0;
  totalAnimalesGrade: number = 0;

  aFOptions: any;
  aFData: any;
  aGOptions: any;
  aGData: any;

  dataSets: DataSetGrafico[] = [];

  coloresGrafico: string[] = ['#AF6E23', '#f1c40f'];
  
  constructor(private dashService: DashboardService) {}

  mostrarContenido: boolean = false;
  
  
  async ngOnInit(): Promise<void> {
    await this.setData();
    this.setOptions(); 
    this.totalAnimalesGrade = this.sumarTotalAnimalesGrade(this.animalesGradeYear);
    this.anios = Array.from(new Set(this.animalesFaenados.map(a => new Date(a.slday).getFullYear()))).sort((a, b) => a - b);  
    this.setAnimalesMesData();
    this.setDataDisplay();
    this.mostrarContenido = true;
  }


  private async setData(): Promise<void> {
    try {
      const [animalesFaenados, animalesGradeYear] = await Promise.all([
        lastValueFrom(this.dashService.getAnimalesFaenadosDia()),
        lastValueFrom(this.dashService.getAnimalesGradeYear())
      ]);
  
      this.animalesFaenados = animalesFaenados;
      this.animalesGradeYear = animalesGradeYear;
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  }

  get mitadIndex(): number {
    return Math.ceil(this.animalesGradeYear.length / 2);
  }

  private setOptions(): void {
    this.aFOptions = this.setOption('#154360', '#154360', '#154360');
    this.aGOptions = this.setOption('#154360', '#154360', '#154360');
  }

  private setOption(textColor: string, textColorSecondary: string, surfaceBorder: string): any {
    return {
      plugins: {
          legend: {
              labels: {
                  color: textColor,
                  rotation: 90
              }
          }
      },
      scales: {
          y: {
              beginAtZero: false,
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: '',
                  drawBorder: false
              }
          },
          x: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: '',
                  drawBorder: false
              }
          }
      }
    };
  }

  private setAFData(): void {
    this.aFData = {
      labels: this.setLabelsAnimalesFaenados(),
      datasets: this.dataSets
    }
  }

  private setAGData(): void {
    this.aGData = {
      labels: this.animalesGradeYear.map(a => a.grade),
      datasets: [
        {
          label: `Porcentaje grade`,
          data: this.animalesGradeYear.map(a => (a.animales / this.totalAnimalesGrade) * 100),
          backgroundColor: '#fbeee6',
          borderColor: '#e67e22',
          borderWidth: 1
        }
      ]
    }   
  }

  private setDataDisplay(): void {
    this.setDataSetGrafico();
    this.setAFData();
    this.setAGData();
  }

  private setAnimalesMesData(): void {
    this.totalAnimalesFaenados = this.sumarTotalAnimales(this.animalesFaenados);
    this.animalesMesAnio = this.setAnimalesMesAnio();
  }

  private setAnimalesMesAnio(): AnimalesMesAnio[] {
    let animales: AnimalesMesAnio[] = [];
    this.anios.forEach(anio => {
    animales.push({
      anio: anio,
      animales: this.setAnimalesMes(anio)
    })
    });
    return animales;
  }

  private setAnimalesMes(anio: number): AnimalesMes[] {
    let animales: AnimalesMes[] = Object.entries(
      this.animalesFaenados.filter(a => new Date(a.slday).getFullYear() === anio).reduce((acc, item) => {
        const fecha = new Date(item.slday);
        const mes = `${fecha.toLocaleString('es-ES', { month: 'long' }).toUpperCase()}`;
        if(!acc[mes]) {
          acc[mes] = 0;
        }

        acc[mes] += item.animalesFaenados;
        return acc;

      }, {} as Record<string, number>)).map(([mes, animales]) => ({mes, animales}));
    
    return animales;
  }

  private sumarTotalAnimales(animales: AnimalesFaenadosDay[]): number {
    return animales.reduce((acc, item) => acc + item.animalesFaenados, 0);
  }

  private sumarTotalAnimalesGrade(animalesGradeYear: AnimalesGradeYear[]): number {
    return animalesGradeYear.reduce((acc, item) => acc + item.animales, 0);
  }

  private setDataSetGrafico(): void {
    this.anios.forEach((anio, i) => {
      const animalesPorAnio = this.animalesMesAnio.find(a => a.anio === anio);
      this.dataSets.push({
        label: `${anio}`,
        data: animalesPorAnio!.animales.map(a => a.animales),
        borderColor: this.coloresGrafico[i],
        borderWidth: 1,
        tension: 0.3
      })
    });
  }

  private setLabelsAnimalesFaenados(): string[] {
    return Array.from(
      new Set(this.animalesMesAnio.flatMap((item) => item.animales.map((a) => a.mes)))
    );
  }
}
