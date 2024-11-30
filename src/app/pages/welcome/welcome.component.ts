import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AnimalesFaenadosDay } from './interfaces/AnimalesFaenadosDay.interface';
import { AnimalesGradeYear } from './interfaces/AnimalesGradeYear.interface';
import { DashboardService } from './services/dashboard.service';
import { lastValueFrom } from 'rxjs';
import { AnimalesMes } from './interfaces/AnimalesMes.interface';
import { DataSetGrafico } from './interfaces/DataSetGrafico.interface';
import { AnimalesMesAnio } from './interfaces/AnimalesMesAnio.interface';
import { GroupedData } from './interfaces/GroupedData.interface';
import { UIChart } from 'primeng/chart';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['css/animate.css', './welcome.component.css', 'css/mediaquery_maxh690_maxw870.css', 'css/mediaquery_maxw1160.css', 'css/mediaquery_minw871_maxw1550.css']
})
export class WelcomeComponent implements OnInit, AfterViewChecked {

  @ViewChild('chartFD', {static: false}) chartFD!: UIChart;

  anioActual: number = new Date().getFullYear();
  anios: number[] = [];
  aniosSeleccionados: number[] = [];

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

  animalesGradeAgrupado:  Record<number, GroupedData> = {};
  dataAgrupadaShow: {grade: string, animales: number}[]= [];

  aFOptions: any;
  aFData: any;
  aGOptions: any;
  aGData: any;

  dataSets: DataSetGrafico[] = [];

  coloresGrafico: string[] = ['#AF6E23', '#f1c40f'];

  dataAgrupada: number[] = [];
  
  constructor(private dashService: DashboardService, private commonService: CommonService) {}

  mostrarContenido: boolean = false;
  
  
  async ngOnInit(): Promise<void> {
    await this.setData();
    this.setOptions(); 
    this.anios = Array.from(new Set(this.animalesFaenados.map(a => new Date(a.slday).getFullYear()))).sort((a, b) => a - b);
    this.aniosSeleccionados = this.anios;  
    this.totalAnimalesGrade = this.sumarTotalAnimalesGrade(this.animalesGradeYear);    
    this.setAnimalesMesData();
    this.setDataDisplay();
    setTimeout(() => {
      this.mostrarContenido = true;
    }, 0);  
  }

  ngAfterViewChecked(): void {
      if (this.chartFD && this.chartFD.chart) {
      const chartInstance = this.chartFD.chart; 
      this.addLegendClickListener(chartInstance);
    }
  }

  private async setData(): Promise<void> {
    try {
      const [animalesFaenados, animalesGradeYear] = await Promise.all([
        lastValueFrom(this.dashService.getAnimalesFaenadosDia()),
        lastValueFrom(this.dashService.getAnimalesGradeYear())
      ]);
  
      this.animalesFaenados = animalesFaenados;
      this.animalesGradeYear = animalesGradeYear;
      this.animalesGradeAgrupado = this.groupByGradeId(this.animalesGradeYear);
      this.dataAgrupadaShow = Object.values(this.animalesGradeAgrupado).map(item => ({
        grade: item.grade,
        animales: item.animales
      }));   
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  }

  get mitadIndex(): number {
    return Math.ceil(this.dataAgrupadaShow.length / 2);
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

  private setAGData(animales: AnimalesGradeYear[]): void {
    this.dataAgrupada = this.getAnimalesSuma(animales);
    this.aGData = {
      labels: Array.from(new Set(this.animalesGradeYear.map(a => a.grade))),
      datasets: [
        {
          label: `Porcentaje grade`,
          data: this.dataAgrupada.map(a => (a / this.totalAnimalesGrade) * 100),
          backgroundColor: '#fbeee6',
          borderColor: '#e67e22',
          borderWidth: 1
        }
      ]
    }
  }

  private groupByGradeId(data: AnimalesGradeYear[]): Record<number, GroupedData> {
    return data.reduce((acc, { gradeId, grade, animales }) => {
        if (!acc[gradeId]) {
            acc[gradeId] = { grade, animales: 0 };
        }
        acc[gradeId].animales += animales;
        return acc;
    }, {} as Record<number, GroupedData>);
}

private getAnimalesSuma(data: AnimalesGradeYear[]): number[] {
  const groupedData = this.groupByGradeId(data); 
  return Object.values(groupedData).map(item => item.animales);
}

  private setDataDisplay(): void {
    this.setDataSetGrafico();
    this.setAFData();
    this.setAGData(this.animalesGradeYear);
  }

  private setAnimalesMesData(): void {
    this.totalAnimalesFaenados = this.sumarTotalAnimales(this.animalesFaenados);
    this.animalesMesAnio = this.setAnimalesMesAnio();
  }

  private setAnimalesMesAnio(): AnimalesMesAnio[] {
    let animales: AnimalesMesAnio[] = [];
    this.aniosSeleccionados.forEach(anio => {
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
    return animales
      .filter(a => this.aniosSeleccionados.includes(new Date(a.slday).getFullYear()))
      .reduce((acc, item) => acc + item.animalesFaenados, 0);
  }

  private sumarTotalAnimalesGrade(animalesGradeYear: AnimalesGradeYear[]): number {
    return animalesGradeYear
    .filter(a => this.aniosSeleccionados.includes(a.year))  
    .reduce((acc, item) => acc + item.animales, 0);
  }

  private setDataSetGrafico(): void {
    this.aniosSeleccionados.forEach((anio, i) => {
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

  onDataSelectHandler(event: any) {
    const hidden = event.hidden;
    const anio = parseInt(event.legendText);
    this.filtrarDataDisplay(hidden, anio);
  }

  private filtrarDataDisplay(hidden: boolean, anio: number): void {
    const copiaAnimalesFaenados = this.commonService.deepCopy(this.animalesFaenados);
    const copiaAnimalesGrade = this.commonService.deepCopy(this.animalesGradeYear);

    let animalesFaenadosFiltrados = [];
    let animalesGradeFiltrados = [];

    if(hidden) {
      this.aniosSeleccionados.splice(this.aniosSeleccionados.indexOf(anio), 1).sort((a, b) => a - b); 
      animalesFaenadosFiltrados = copiaAnimalesFaenados.filter(a => new Date(a.slday).getFullYear() != anio);
      animalesGradeFiltrados = copiaAnimalesGrade.filter(a => a.year != anio);
    }else 
    {
      this.aniosSeleccionados.push(anio);
      this.aniosSeleccionados = this.aniosSeleccionados.sort((a, b) => a - b);
      animalesFaenadosFiltrados = copiaAnimalesFaenados.filter(a => this.aniosSeleccionados.includes(new Date(a.slday).getFullYear()));
      animalesGradeFiltrados = copiaAnimalesGrade.filter(a => this.aniosSeleccionados.includes(a.year));
    }

    this.totalAnimalesFaenados = this.sumarTotalAnimales(animalesFaenadosFiltrados);
    this.totalAnimalesGrade = this.sumarTotalAnimalesGrade(animalesGradeFiltrados);
    this.animalesGradeAgrupado = this.groupByGradeId(animalesGradeFiltrados);
      this.dataAgrupadaShow = Object.values(this.animalesGradeAgrupado).map(item => ({
        grade: item.grade,
        animales: item.animales
      }));
    this.setAGData(animalesGradeFiltrados);    
  }

  addLegendClickListener(chartInstance: any) {
    chartInstance.options.plugins.legend.onClick = (e: any, legendItem: any, legend: any) => {
      const index = legendItem.datasetIndex;
      const meta = chartInstance.getDatasetMeta(index);
      const legendText = legendItem.text;
      
      meta.hidden = meta.hidden === null ? !chartInstance.data.datasets[index].hidden : null;
      chartInstance.update(); 

      this.onDataSelectHandler({
        datasetIndex: index,
        hidden: meta.hidden,
        legendText: legendText
      });
    };
  }
}
