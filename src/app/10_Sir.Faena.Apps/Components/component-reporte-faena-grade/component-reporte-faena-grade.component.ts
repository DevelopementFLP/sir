import { Component } from '@angular/core';
import { DataFaenaService } from '../../Services/Data-Faena.service';
import { ReporteDeMediasGradeDTO } from '../../Interfaces/ReporteDeMediasDTO';
import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilities/UtilidadesService.service';

@Component({
  selector: 'app-component-reporte-faena-grade',
  templateUrl: './component-reporte-faena-grade.component.html',
  styleUrls: ['./component-reporte-faena-grade.component.css']
})
export class ComponentReporteFaenaGradeComponent {

  public sumaDePesos: number = 0;
  public sumaDeUnidades: number = 0;
  public resultadoPesoPorGrade: { grade: string, totalCuartos: number }[] = []; 

  public responseReporteDeMediasGrade: ReporteDeMediasGradeDTO[] = [];

  constructor(
    private _reporteDeMedia: DataFaenaService,
    private _utilidadesServicicio: UtilidadesService,
  ){
  }

  
  public GetReporteDeMediasGrade(fechaDesde: string, fechaHasta: string) {
    this._reporteDeMedia.GetReporteDeMediasGrade(fechaDesde, fechaHasta).subscribe({
      next: (data) => {
        if (data.esCorrecto ) {
          this.responseReporteDeMediasGrade = data.resultado
          this.sumarPesosTotales();
          this.sumarUnidades();
          this.AgruparCuartosPorEtiqueta();
        } else {
          this._utilidadesServicicio.mostrarAlerta("No se encontraron ","Datos")
        }
      },
      error: (e) => {
        console.error(e);
      }
    });    
  } 

  public sumarPesosTotales(){
    this.responseReporteDeMediasGrade.forEach(element => {
      this.sumaDePesos += Math.round(element.pesoMedias);
    });
  }

  public sumarUnidades(){
    this.responseReporteDeMediasGrade.forEach(element => {
      this.sumaDeUnidades += element.medias;
    });
  }

  public AgruparCuartosPorEtiqueta(): { grade: string, totalCuartos: number }[] {
    const map = new Map<string, number>();
    this.resultadoPesoPorGrade

    this.responseReporteDeMediasGrade.forEach(item => {
      if (item.grade) {
        const pesos = item.medias ? Number(item.medias) : 0;
        const currentTotal = map.get(item.grade) || 0;
        map.set(item.grade, currentTotal + pesos);
      }
    });

    this.resultadoPesoPorGrade = Array.from(map, ([grade, totalCuartos]) => ({ grade, totalCuartos }));

    return this.resultadoPesoPorGrade;
  }
}
