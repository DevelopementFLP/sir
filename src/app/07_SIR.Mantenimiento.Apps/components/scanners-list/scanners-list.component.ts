import { Component, OnInit } from '@angular/core';
import { RatioResponse } from '../../interfaces/RatioResponse.interface';
import { DashboardService } from '../../services/dashboard.service';
import { RatioResult } from '../../interfaces/RatioResult.interface';
import { interval } from 'rxjs';
import { RatioErrorResponse } from '../../interfaces/RatioErrorResponse.interface';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-scanners-list',
  templateUrl: './scanners-list.component.html',
  styleUrls: ['./scanners-list.component.css']
})
export class ScannersListComponent implements OnInit {

  constructor(
    private dashboardService: DashboardService,
    private commonService: CommonService
    ) {}

  public dayData?: RatioResponse;
  public weekData?: RatioResponse;
  public datos: RatioResult = new RatioResult()

  ngOnInit(): void {
    this.fetchData();

    interval(300000).subscribe(() => {
      this.fetchData();
    });
  }

  private fetchData(): void {
    this.dashboardService.checkServerConnection();

    const fechaActual: Date = new Date();
    const fechaDesde: Date = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate(), 0, 0, 0);
    const fechaHasta: Date = new Date(fechaDesde.getFullYear(), fechaDesde.getMonth(), fechaDesde.getDate(), fechaDesde.getHours() + 23 , 59, 59);
    const formattedFechaDesde = this.commonService.formatDate(fechaDesde);
    const formattedFechaHasta = this.commonService.formatDate(fechaHasta);
    const fechaInicioWeek: Date = this.commonService.getFirstDayOfWeek(fechaDesde);
    const fechaFin: Date = this.commonService.getLastDayOfWeek(fechaDesde);
    const fechaFinWeek: Date = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate(), fechaFin.getHours() + 23, 59, 59);
    const formattedInicioWeek = this.commonService.formatDate(fechaInicioWeek);
    const formattedFinWeek = this.commonService.formatDate(fechaFinWeek);

    this.dashboardService
      .getRatioError(formattedFechaDesde, formattedFechaHasta)
      .subscribe((dayData) => {
        this.dayData = dayData;
        this.datos.dayData = this.dayData; 
        
        this.commonService.ordenarPorDispositivo(this.datos.dayData);
      });

      this.dashboardService
      .getRatioError(formattedInicioWeek, formattedFinWeek)
      .subscribe((weekData) => {
        this.weekData = weekData;
        this.datos.weekData = this.weekData;
    
        this.commonService.ordenarPorDispositivo(this.datos.weekData);
      });
  }

  
  getData(i: number) : RatioErrorResponse | undefined{
    const dispositivo = this.weekData?.data[i].dispositivo;
    const dispositivoBuscado = this.buscarDispositivoPorNombre(dispositivo!);

    return dispositivoBuscado || undefined;
  }

  private buscarDispositivoPorNombre(nombre: string) {
    const dispositivo = this.dayData?.data.find(disp => disp.dispositivo === nombre);
    return dispositivo;
  }

}
