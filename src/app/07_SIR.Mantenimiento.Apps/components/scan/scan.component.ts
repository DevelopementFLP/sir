import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { RatioErrorResponse } from '../../interfaces/RatioErrorResponse.interface';
import { Location, formatNumber } from '@angular/common';
import { catchError, interval, of } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { Dispositivo } from '../../interfaces/Dispositivo.interface';


@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css'],
})
export class ScanComponent implements OnInit, AfterViewInit {
  @Input() ubicacion: string = ';';
  @Input() dayData?: RatioErrorResponse;
  @Input() weekData?: RatioErrorResponse;
  
  dispositivo: Dispositivo | undefined;

  constructor(
    private location: Location,
    private dashboardService: DashboardService,
    private commonService: CommonService,
    private router: Router
  ) {}


  ngAfterViewInit(): void {
    this.dashboardService.checkServerConnection();
  }

  ngOnInit(): void {

    this.dashboardService.checkServerConnection();
    this.ubicacion = this.getCurrentPath();
    this.getDevice(this.ubicacion);

    this.fecthData(this.ubicacion);
    interval(300000).subscribe(() => {
      this.fecthData(this.ubicacion);
    });
  }

  private getDevice(location: string) {
    this.dashboardService.checkServerConnection();
    this.dashboardService
      .getDeviceByName(location)
        .pipe(
          catchError(error => {
            this.router.navigate(['/404']);
            return of(null)
          }) 
        )
        .subscribe((response) => {
          this.dispositivo = response?.data;
    });
  }

  private getCurrentPath() {
    const fullPath = this.location.path();
    const startIndex = fullPath.indexOf('/scan/') + '/scan/'.length;
    const pathAfterScan = fullPath.substring(startIndex);
    const decodedPath = decodeURIComponent(pathAfterScan);
    return decodedPath;
  }

  private fecthData(location: string) {
    const fechaActual: Date = new Date();
    const fechaDesde: Date = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      fechaActual.getDate(),
      0,
      0,
      0
    );
    const fechaHasta: Date = new Date(
      fechaDesde.getFullYear(),
      fechaDesde.getMonth(),
      fechaDesde.getDate(),
      fechaDesde.getHours() + 23,
      59,
      59
    );
    const formattedFechaDesde = this.commonService.formatDate(fechaDesde);
    const formattedFechaHasta = this.commonService.formatDate(fechaHasta);
    const fechaInicioWeek: Date =
      this.commonService.getFirstDayOfWeek(fechaDesde);
    const fechaFin: Date = this.commonService.getLastDayOfWeek(fechaDesde);
    const fechaFinWeek: Date = new Date(
      fechaFin.getFullYear(),
      fechaFin.getMonth(),
      fechaFin.getDate(),
      fechaFin.getHours() + 23,
      59,
      59
    );
    const formattedInicioWeek = this.commonService.formatDate(fechaInicioWeek);
    const formattedFinWeek = this.commonService.formatDate(fechaFinWeek);

    this.dashboardService
      .gerRatioErrorByDeviceName(
        location,
        formattedFechaDesde,
        formattedFechaHasta
      )
      .subscribe((dayData) => {
        this.dayData = dayData.data[0];
      });

    this.dashboardService
      .gerRatioErrorByDeviceName(
        location,
        formattedInicioWeek,
        formattedFinWeek
      )
      .subscribe((weekData) => {
        this.weekData = weekData.data[0];
      });
  }

  goToList(): void {
    this.router.navigate(['principal/mantenimiento/dashboardScanners/list'])
  }
}
