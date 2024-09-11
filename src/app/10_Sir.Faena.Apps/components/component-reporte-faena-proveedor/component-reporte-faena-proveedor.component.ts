import { Component } from '@angular/core';
import { DataFaenaService } from '../../Services/Data-Faena.service';
import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilities/UtilidadesService.service';
import { ReporteDeMediasProveedorDTO } from '../../Interfaces/ReporteDeMediasDTO';

@Component({
  selector: 'app-component-reporte-faena-producto',
  templateUrl: './component-reporte-faena-proveedor.component.html',
  styleUrls: ['./component-reporte-faena-proveedor.component.css']
})
export class ComponenteReporteFaenaProductoComponent {
  public sumaDePesos: number = 0;
  public sumaDeUnidades: number = 0;
  public resultadoCuartosPorProveedor: { proveedor: string, totalCuartos: number }[] = []; 
  public resultadoCuartosPorGrade: { grade: string, totalCuartos: number, totalKg: number }[] = []; 

  public responseReporteDeMediasProveedor: ReporteDeMediasProveedorDTO[] = [];

  constructor(
    private _reporteDeMedia: DataFaenaService,
    private _utilidadesServicicio: UtilidadesService,
  ){
  }

  public GetReporteDeMediasProveedor(fechaDesde: string, fechaHasta: string) {
    this._reporteDeMedia.GetReporteDeMediasProveedor(fechaDesde, fechaHasta).subscribe({
      next: (data) => {
        if (data.esCorrecto ) {
          this.responseReporteDeMediasProveedor = data.resultado
          this.sumarPesosTotales();
          this.sumarUnidades();
          this.AgruparCuartosPorProveedor();
          this.AgruparMediasPorGrade();
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
    this.responseReporteDeMediasProveedor.forEach(element => {
      this.sumaDePesos += Math.round(element.pesoMedias);
    });
  }

  public sumarUnidades(){
    this.responseReporteDeMediasProveedor.forEach(element => {
      this.sumaDeUnidades += element.medias;
    });
  }

   public AgruparCuartosPorProveedor(): { proveedor: string, totalCuartos: number }[] {
    const map = new Map<string, number>();
    this.resultadoCuartosPorProveedor

    this.responseReporteDeMediasProveedor.forEach(item => {
      if (item.proveedor) {
        const medias = item.medias ? Number(item.medias) : 0;
        const currentTotal = map.get(item.proveedor) || 0;
        map.set(item.proveedor, currentTotal + medias);
      }
    });

    this.resultadoCuartosPorProveedor = Array.from(map, ([proveedor, totalCuartos]) => ({ proveedor, totalCuartos }));
    return this.resultadoCuartosPorProveedor;
  }

  public AgruparMediasPorGrade(): { grade: string, totalCuartos: number }[] {
    const map = new Map<string, { totalCuartos: number, totalKg: number }>();
    this.resultadoCuartosPorProveedor

    this.responseReporteDeMediasProveedor.forEach(item => {
      if (item.grade) {
        const medias = item.medias ? Number(item.medias) : 0;
        const kg = item.pesoMedias ? Number(Math.round(item.pesoMedias)) : 0;
        const currentTotal = map.get(item.grade) || { totalCuartos: 0, totalKg: 0 };
        map.set(item.grade, {
          totalCuartos: currentTotal.totalCuartos + medias,
          totalKg: currentTotal.totalKg + kg
      });
      }
    });

    this.resultadoCuartosPorGrade = Array.from(map, ([grade, { totalCuartos, totalKg }]) => ({ grade, totalCuartos, totalKg }));
    return this.resultadoCuartosPorGrade;
  }

}
