import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, timestamp } from 'rxjs';


import { EstacionesCortesCajas } from '../interfaces/EstacionesCortesCajas.interface';
import { CajasHora } from '../interfaces/CajasHora.interface';
import { EstacionProceso } from '../interfaces/EstacionProceso.interface';
import { CortesSinEmpacar } from '../interfaces/CortesSinEmpacar.interface';
import { CajasAbiertas } from '../interfaces/CajasAbiertas.interface';
import { CajasCerradas } from '../interfaces/CajasCerradas.interface';
import { CajasTMS } from '../interfaces/CajasTMS.interface';
import { ProductosPorEstacion } from '../interfaces/ProductosPorEstacion.interface';
import { TiempoActualizacion } from '../interfaces/TiempoActualizacion.interface';
import { ReporteMenuItem } from '../interfaces/ReporteMenuItem.interface';
import { VelocidadCerradoComponent } from '../components/velocidad-cerrado/velocidad-cerrado.component';
import { KilosMinutoComponent } from '../components/kilos-minuto/kilos-minuto.component';
import { EagleResponse } from '../interfaces/EagleResponse.interface';
import { formatDate} from '@angular/common';

import { sirBaseUrl, eagleBaseUrl } from 'src/settings';

@Injectable({
  providedIn: 'root'
})
export class DashSecundarioService implements OnInit{

  constructor(private http: HttpClient) { }

  timeLapse: number = 0;

  ngOnInit(): void {
    
  }
 
  getTotalKilos(): Observable<number> {
    return this.http.get<number>(`${sirBaseUrl}GetKilosTotalesAsync`);
  }

  getLineasCajas(minsDesde: number): Observable<EstacionesCortesCajas[]> {
    return this.http.get<EstacionesCortesCajas[]>(`${sirBaseUrl}GetLineasCajasAsync?minutosDesde=${minsDesde}`);
  }

  getCajasHora(prday: string): Observable<CajasHora[]> {
    return this.http.get<CajasHora[]>(`${sirBaseUrl}GetCajasHoraAsync?prday=${prday}`);
  }

  getEstacionesCortesCajas(minsDesde: number): Observable<EstacionesCortesCajas[]> {
    return this.http.get<EstacionesCortesCajas[]>(`${sirBaseUrl}GetEstacionesCortesCajasAsync?minutosDesde=${minsDesde}`)
  }

  getEstacionesProceso(minsDesde: number): Observable<EstacionProceso[]> {
    return this.http.get<EstacionProceso[]>(`${sirBaseUrl}GetEstacionesProcesoAsync?minutosDesde=${minsDesde}`);
  }

  getCortesSinEmpacar(): Observable<CortesSinEmpacar[]> {
    return this.http.get<CortesSinEmpacar[]>(`${sirBaseUrl}GetCortesSinEmpacarAsync`);
  }

  getCajasAbiertas(): Observable<CajasAbiertas[]> {
    return this.http.get<CajasAbiertas[]>(`${sirBaseUrl}GetCajasAbiertasAsync`)
  }

  getCajasCerradas(): Observable<CajasCerradas[]> {
    return this.http.get<CajasCerradas[]>(`${sirBaseUrl}GetCajasCerradasAsync`);
  }

  getCajasTMSCerradas(): Observable<CajasTMS[]> {
    return this.http.get<CajasTMS[]>(`${sirBaseUrl}GetCajasTMSCerradasAsync`)
  }

  getProductosPorEstacion(station: string, minsDesde: number): Observable<ProductosPorEstacion> {
    return this.http.get<ProductosPorEstacion>(`${sirBaseUrl}GetProductosPorEstacionAsync?station=${station}&minutosDesde=${minsDesde}`);
  }

  getRefreshTime(): Observable<number> {
    return this.http.get<number>(`${sirBaseUrl}GetRefreshTime`);
  }

  getTiemposActualizacion(): Observable<TiempoActualizacion[]> {
    return this.http.get<TiempoActualizacion[]>(`${sirBaseUrl}GetTiemposActualizacionAsync`);
  }

  private getHoraPrimeraCajaWPL(fecha: string, idStation: number): Observable<string> {
    return this.http.get<string>(`${sirBaseUrl}GetPrimeraCajaWPLAsync?prday=${fecha}&idStation=${idStation}`)
  }

  private getHoraUltimaCajaWPL(fecha: string, idStation: number): Observable<string> {
    return this.http.get<string>(`${sirBaseUrl}GetUltimaCajaWPLAsync?prday=${fecha}&idStation=${idStation}`)
  }

  async getTiempoTotalWPL(idWPL: number, timeLapse: number): Promise<Date> {
    const horaActual: Date = new Date();
    const fecha: string = formatDate(horaActual, "yyyy-MM-dd", "es-UY");
    
    var horaPrimeraCaja: string = fecha; 
    
    if(timeLapse > 0) {
      horaActual.setHours(horaActual.getHours());
      horaActual.setMinutes(horaActual.getMinutes() - timeLapse);
      horaPrimeraCaja = formatDate(horaActual, "yyyy-MM-dd HH:mm:ss", "es-UY");
    }  
    else
      horaPrimeraCaja = await this.getHoraPrimeraCajaWPL(fecha, idWPL).toPromise() ?? fecha;


    const horaUltimaCaja: string = await this.getHoraUltimaCajaWPL(fecha, idWPL).toPromise() ?? fecha;
    
    const hrP: Date = new Date(horaPrimeraCaja)
    const hrU: Date = new Date(horaUltimaCaja)
    
    const diffHrs: number = (hrU!.getUTCHours() ?? 0) - (hrP!.getUTCHours() ?? 0);
    const diffMin: number = (hrU!.getUTCMinutes() ?? 0) - (hrP!.getUTCMinutes() ?? 0);
    const diffSec: number = (hrU!.getUTCSeconds() ?? 0) - (hrP!.getUTCSeconds() ?? 0);

    let tiempoTotal: Date = new Date();

    tiempoTotal.setUTCHours(diffHrs);
    tiempoTotal.setUTCMinutes(diffMin);
    tiempoTotal.setUTCSeconds(diffSec);

    return tiempoTotal;
  }



  getReportesMenuItem(): ReporteMenuItem[] {
    let reportes: ReporteMenuItem[] = [];

     reportes.push(//{
    //   id: 1,
    //   nombre: "Detalle TMS",
    //   showIcon: false,
    //   component: TMSViewrComponent
    // },
    {
      id: 2,
      nombre: "Velocidad de cerrado",
      showIcon: false,
      component: VelocidadCerradoComponent
    },
    {
      id: 3,
      nombre: "Kilos por minuto",
      showIcon: false,
      component: KilosMinutoComponent
    },
    {
      id: 4,
      nombre: "Dashboard Desosado Marel",
      showIcon: true,
      icono: 'pi pi-external-link',
      routerLink: '/principal/mantenimiento/dashboardDesosado'
    })

    return reportes;
  }

  getTimeLapse(): number {
    return this.timeLapse;
  }

  setTimeLapse(time: number): void {
    this.timeLapse = time;
  }

  getEagleData(date: string) : Observable<EagleResponse> {
    const headers = new HttpHeaders({
      'Connection-String-Name': 'EagleNuevaConnectionString'
    });

    return this.http.get<EagleResponse>(`${eagleBaseUrl}/EagleResponse/GetAll?date=${date}`, {headers});
  }
}
