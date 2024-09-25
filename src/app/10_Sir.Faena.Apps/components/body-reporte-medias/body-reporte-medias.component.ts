import { Component, ViewChild } from '@angular/core';
import { ReporteDeMediasProductosDTO } from '../../Interfaces/ReporteDeMediasDTO';
import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilities/UtilidadesService.service';
import { DataFaenaService } from '../../Services/Data-Faena.service';
import { ComponentReporteFaenaGradeComponent } from '../component-reporte-faena-grade/component-reporte-faena-grade.component';
import { ComponenteReporteFaenaProductoComponent } from '../component-reporte-faena-proveedor/component-reporte-faena-proveedor.component';

@Component({
  selector: 'app-components-body-reporte-medias',
  templateUrl: './body-reporte-medias.component.html',
  styleUrls: ['./body-reporte-medias.component.css']
})
export class BodyReporteMediasComponent {

  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;

  public sumaDePesos: number = 0;
  public sumaDeUnidades: number = 0;
  public sumaPorGrade: number = 0;
  public resultadoCuartosPorGrade: { grade: string, totalCuartos: number }[] = []; 

  public responseReporteDeMediasProducto: ReporteDeMediasProductosDTO[] = [];

  @ViewChild(ComponenteReporteFaenaProductoComponent) _conexionConComponenteProveedor! : ComponenteReporteFaenaProductoComponent;
  @ViewChild(ComponentReporteFaenaGradeComponent) _conexionConComponenteGrade! : ComponentReporteFaenaGradeComponent;


  constructor(
    private _reporteDeMedia: DataFaenaService,
    private _utilidadesServicicio: UtilidadesService,
  ){
  }



  public GetReporteDeMediasProducto(fechaDesde: Date, fechaHasta: Date) {
    const fechaDesdeFormateada = this.formatoFecha(fechaDesde)
    const fechaHastaFormateada = this.formatoFecha(fechaHasta)

    this._reporteDeMedia.GetReporteDeMediasProducto(fechaDesdeFormateada, fechaHastaFormateada).subscribe({
      next: (data) => {
        if (data.esCorrecto ) {
          this.responseReporteDeMediasProducto = data.resultado

          this.SumarPesosTotales();
          this.SumarUnidades();
          this.AgruparCuartosPorEtiqueta();

          this._conexionConComponenteProveedor.GetReporteDeMediasProveedor(fechaDesdeFormateada, fechaHastaFormateada);
          //this._conexionConComponenteGrade.GetReporteDeMediasGrade(fechaDesdeFormateada, fechaHastaFormateada);
        } else {
          this._utilidadesServicicio.mostrarAlerta("No se encontraron ","Datos")
        }
      },
      error: (e) => {
        console.error(e);
      }
    });    
  } 

  formatoFecha(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  public SumarPesosTotales(){
    this.responseReporteDeMediasProducto.forEach(element => {
      this.sumaDePesos += Math.round(element.pesoCuartos);
    });
  }

  public SumarUnidades(){
    this.responseReporteDeMediasProducto.forEach(element => {
      this.sumaDeUnidades += element.cuartos;
    });
  }

  public AgruparCuartosPorEtiqueta(): { grade: string, totalCuartos: number }[] {
    const map = new Map<string, number>();
    this.resultadoCuartosPorGrade = [];

    this.responseReporteDeMediasProducto.forEach(item => {
      if (item.grade) {
        const cuartos = item.cuartos ? Number(item.cuartos) : 0;
        const currentTotal = map.get(item.grade) || 0;
        map.set(item.grade, currentTotal + cuartos);
      }
    });

    this.resultadoCuartosPorGrade = Array.from(map, ([grade, totalCuartos]) => ({ grade, totalCuartos }));

    return this.resultadoCuartosPorGrade;
  }

}
