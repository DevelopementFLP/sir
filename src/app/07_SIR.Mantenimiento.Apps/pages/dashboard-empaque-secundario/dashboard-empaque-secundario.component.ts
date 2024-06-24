import { Component, OnDestroy, OnInit, Type, ViewEncapsulation } from '@angular/core';
import { DashSecundarioService } from '../../services/dashboard-secundario.service';
import { EstacionesCortesCajas } from '../../interfaces/EstacionesCortesCajas.interface';
import { CajasHora } from '../../interfaces/CajasHora.interface';
import { formatDate } from '@angular/common';
import { EstacionProceso } from '../../interfaces/EstacionProceso.interface';
import { CortesSinEmpacar } from '../../interfaces/CortesSinEmpacar.interface';
import { CajasAbiertas } from '../../interfaces/CajasAbiertas.interface';
import { CajasCerradas } from '../../interfaces/CajasCerradas.interface';
import { CajasTMS } from '../../interfaces/CajasTMS.interface';
import { ProductosPorEstacion } from '../../interfaces/ProductosPorEstacion.interface';
import { TiempoActualizacion } from '../../interfaces/TiempoActualizacion.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogData } from '../../interfaces/DialogData.interface';
import { ReporteMenuItem } from '../../interfaces/ReporteMenuItem.interface';
import { EagleResponse } from '../../interfaces/EagleResponse.interface';
import { DashboardService } from '../../services/dashboard.service';
import { WPLDict } from '../../types/WplDict.type';


@Component({
  selector: 'dashboard-empaque-secundario',
  templateUrl: './dashboard-empaque-secundario.component.html',
  styleUrls: ['./dashboard-empaque-secundario.component.css', 'max-width-999.css', 'min-width-1000.css'],
  providers: [DialogService],
  encapsulation: ViewEncapsulation.None
})
export class DashboardEmpaqueSecundarioComponent implements OnInit, OnDestroy {

  /* Data from backend */ 
  kilosTotales?: number = 0;
  lineasCajas?: EstacionesCortesCajas[] = [];
  cajasHora?: CajasHora[] = [];
  estacionesCortesCajas?: EstacionesCortesCajas[] = [];
  estacionesProceso?: EstacionProceso[] = [];
  cortesSinEmpacar?: CortesSinEmpacar[] = [];
  cajasAbiertas?: CajasAbiertas[] = [];
  cajasCerradas?: CajasCerradas[] = [];
  cajasTMSCerradas?: CajasTMS[] = [];
  productosPorEstacion?: ProductosPorEstacion;
  tiemposActualizacion?: TiempoActualizacion[] = [];
  eagleData: EagleResponse | undefined;
  cajasReproceso: number = 0;
  cajasReproceso2: number = 0;
  cajasWPL: number[] = [];
  idsWPL: number[] = [4296, 4299, 4293];
  linea_1: EstacionesCortesCajas[] = [];  
  linea_2: EstacionesCortesCajas[] = [];  
  linea_3: EstacionesCortesCajas[] = [];  
  linea_4: EstacionesCortesCajas[] = [];  
  
  /* local params */
  minsDesde: number = 0;
  minsDesdeText: string = '';
  prday: string = formatDate(new Date(), "yyyy-MM-dd", "es-UY");
  refreshTime?: number = 300000;
  reportList: ReporteMenuItem[] = [];
  lastUpdate: Date = new Date();
  velocidadCerradoActual: number = 0;
  velocidadCerradoDia: number = 0;
  lineas: number[] = [10, 10, 10, 12];
  cajasTotal: number = 0;
  cajasLeidasEagle: number = 0;
  cajasRechazadasEagle: number = 0;
  cajasNoLeidasEagle: number = 0;
  porcRechazoEagle: number = 0;
  porcNoLeidasEagle: number = 0;
  wpls: WPLDict = { }
  wplsAllDay: WPLDict = { }

  total!: EstacionesCortesCajas;

  /* dialog */
  dialog?: DynamicDialogRef;

  constructor(
    private empaqueSecundarioService: DashSecundarioService,
    private dialogService: DialogService,
    private dashService: DashboardService
  ) {}

  async ngOnInit(): Promise<void> {
  
    await this.GetData();
    
    setInterval(async () => {
      await this.GetData();
    }, this.refreshTime);
  }

  ngOnDestroy(): void {
    this.destroyDialog(this.dialog);
  }
  
  
  private destroyDialog(dialog?: DynamicDialogRef): void {
    if(dialog) {
      dialog.close();
      dialog.destroy();
    }
  }
  
  updateData(): void {
    this.GetData();
  }

  private async GetData(): Promise<void> {
    this.wpls[4296] = 0;
    this.wpls[4299] = 0;
    this.wpls[4293] = 0;
    this.wplsAllDay[4296] = 0;
    this.wplsAllDay[4299] = 0;
    this.wplsAllDay[4293] = 0;
    this.cajasWPL = [];
    this.reportList = this.empaqueSecundarioService.getReportesMenuItem();
    this.lastUpdate = new Date();

    
    await this.GetTiemposActualizacion();
    await this.GetRefreshTime();
    await this.GetInnovaData();
    await this.GetEagleData();

    if(this.minsDesde > 0) {
      this.filterRayosXData();
    }
  }

  private async GetInnovaData(): Promise<void> {
    try {
      await this.GetKilosTotales();
      await this.GetLineasCajas();
      await this.GetCajasHora();
      await this.GetEstacionesCortesCajas();
      await this.GetEstacionesProceso();
      await this.setCajasPromedioWLP(this.cajasWPL, this.wpls)
      await this.GetCortesSinEmpacar();
      await this.GetCajasAbiertas();
      await this.GetCajasCerradas();
      await this.GetCajasTMSCerradas();
      await this.getTotales();
    } catch (error: any) {
      throw new Error(error);
    }
  }

  private async GetKilosTotales(): Promise<void> {
    this.kilosTotales = await this.empaqueSecundarioService.getTotalKilos().toPromise();
  }

  private async GetLineasCajas(): Promise<void> {
    this.lineasCajas = await this.empaqueSecundarioService.getLineasCajas(this.minsDesde).toPromise();
  }

  private async GetCajasHora(): Promise<void> {
    this.cajasHora = await this.empaqueSecundarioService.getCajasHora(this.prday).toPromise();
  }

  private async GetEstacionesCortesCajas(): Promise<void> {
    this.estacionesCortesCajas = await this.empaqueSecundarioService.getEstacionesCortesCajas(this.minsDesde).toPromise();
    this.setLineasEmpaque();
  }

  private async GetEstacionesProceso(): Promise<void> {
    this.estacionesProceso = await this.empaqueSecundarioService.getEstacionesProceso(this.minsDesde).toPromise();
    this.cajasReproceso = this.getCajasReproceso();
    this.cajasReproceso2 = this.getCajasReproceso2();
    this.cajasWPL.push(this.getCajasWPL(4296));
    this.cajasWPL.push(this.getCajasWPL(4299));
    this.cajasWPL.push(this.getCajasWPL(4293));
  }

  private async GetCortesSinEmpacar(): Promise<void> {
    this.cortesSinEmpacar = await this.empaqueSecundarioService.getCortesSinEmpacar().toPromise();
  }

  private async GetCajasAbiertas(): Promise<void> {
    this.cajasAbiertas = await this.empaqueSecundarioService.getCajasAbiertas().toPromise();
  }

  private async GetCajasCerradas(): Promise<void> {
    this.cajasCerradas = await this.empaqueSecundarioService.getCajasCerradas().toPromise();
  }

  private async GetCajasTMSCerradas(): Promise<void> {
    this.cajasTMSCerradas = await this.empaqueSecundarioService.getCajasTMSCerradas().toPromise();
  }

  async GetProductosPorEstacion(station: string): Promise<ProductosPorEstacion | undefined> {
    return await this.empaqueSecundarioService.getProductosPorEstacion(station, this.minsDesde).toPromise();
  }

  async GetRefreshTime(): Promise<void> {
    this.refreshTime = await this.empaqueSecundarioService.getRefreshTime().toPromise();
  }

  async GetTiemposActualizacion(): Promise<void> {
    this.tiemposActualizacion = await this.empaqueSecundarioService.getTiemposActualizacion().toPromise();
  }

  async GetEagleData(): Promise<void> {
    this.eagleData = await this.empaqueSecundarioService.getEagleData(formatDate(new Date(), "yyyy-MM-dd", "es-UY")).toPromise()!;
    this.cajasRechazadasEagle = this.dashService.getRechazos(this.eagleData?.data!);
    this.cajasNoLeidasEagle = this.dashService.getNoLeidos(this.eagleData?.data!);
    this.cajasLeidasEagle = this.eagleData?.data.length! - this.cajasNoLeidasEagle;
    this.porcRechazoEagle = this.cajasRechazadasEagle / this.cajasLeidasEagle;
    this.porcNoLeidasEagle = this.cajasNoLeidasEagle / (this.cajasLeidasEagle + this.cajasNoLeidasEagle);
  }

  selectTime(time: TiempoActualizacion): void {
    this.minsDesde = time.valor;
    this.empaqueSecundarioService.setTimeLapse(this.minsDesde);
    this.minsDesdeText = time.descripcion;
    this.GetData();
  }

  private showDialog(component: Type<any>, data: DialogData, dialog: DynamicDialogRef): void {
    dialog = this.dialogService.open(component, {
      data: data.data,
      header: data.titulo,
      width: '80vw',
      height:'100vh',
      closable: true,
      closeOnEscape: true,
      dismissableMask: true
    })
  }

  mostrarReporte(item: ReporteMenuItem): void {
   let data: DialogData = {
    titulo: item.nombre,
    data: []
   }
   
   this.showDialog(item.component!, data, this.dialog!);
  }

  private getCajasReproceso(): number {
    return this.estacionesProceso?.filter(e => e.idStation == 298)[0].cajas?? 0;
  }

  private getCajasReproceso2(): number {
    const station: EstacionProceso | undefined = this.estacionesProceso?.find(e => e.idStation == 4256);
    var cajas: number = 0;

    if(station)
      cajas = station.cajas;

    return cajas;
  }

  private getCajasWPL(station: number): number {
    var cajas: number = 0;
    if(this.estacionesProceso?.filter(e => e.idStation == station)[0])
      cajas = this.estacionesProceso?.filter(e => e.idStation == station)[0].cajas;
    return cajas;
  }

  getTotalLinea(linea: string): EstacionesCortesCajas | undefined {
    return this.lineasCajas?.find(l => l.station == linea)?? undefined;
  }

  async getTotales(): Promise<void> {
    var cajas: number = 0;
    var lineaCajasTotal: EstacionesCortesCajas[] | undefined;
    
    if(this.minsDesde != 0) {
      lineaCajasTotal = await this.empaqueSecundarioService.getLineasCajas(this.minsDesde).toPromise(); 
      cajas =lineaCajasTotal?.reduce((total, linea) => {
        return total + linea.cajas
      }, 0)!;
    } else {
      cajas = this.lineasCajas?.reduce((total, linea) => {
        return total + linea.cajas
      }, 0)!;
    }

    var total: EstacionesCortesCajas = {
      cajas: cajas,
      cortes: 0,
      peso: this.kilosTotales?? 0,
      station: ''
    };

   this.total = total;
  }

  private setLineasEmpaque(): void {
    this.linea_1 = this.getLineaEmpaque(1);
    this.linea_2 = this.getLineaEmpaque(2);
    this.linea_3 = this.getLineaEmpaque(3);
    this.linea_4 = this.getLineaEmpaque(4);
  }

  getLineaEmpaque(nroLinea: number): EstacionesCortesCajas[] {
    return this.estacionesCortesCajas?.filter(e => e.station.startsWith('SP L' + nroLinea))?? [];
  }
  
  private async setCajasPromedioWLP(wpls: number[], wplDict: WPLDict): Promise<void> {
    this.velocidadCerradoActual = 0;
    
    for(let wplKey in wplDict) {
      const wpl: number = parseInt(wplKey);
      
      //if(Object.prototype.hasOwnProperty.call(this.wpls, wpl)) {
        const tiempoTotalWPL: Date = await this.empaqueSecundarioService.getTiempoTotalWPL(wpl, this.minsDesde);
        wplDict[wpl] = Math.ceil(wpls[this.idsWPL.indexOf(wpl)] / this.totalMinutes(tiempoTotalWPL));
        this.velocidadCerradoActual += wplDict[wpl];
        if(this.minsDesde == 0) this.velocidadCerradoDia = this.velocidadCerradoActual;
        //else this.getVelocidadWPLDia();
       
      //}
    }
  }

  private totalMinutes(tiempo: Date): number {
    return tiempo.getUTCHours() * 60 + tiempo.getUTCMinutes();
  }


  private filterRayosXData(): void {
    let horaLapso: Date = new Date();
    horaLapso.setHours(horaLapso.getHours() - 3);
    horaLapso.setHours(horaLapso.getHours() - Math.trunc(this.minsDesde / 60));
    horaLapso.setMinutes(horaLapso.getMinutes() - this.minsDesde % 60);
    if(this.eagleData) {
      this.eagleData.data = this.eagleData.data.filter(d => {
        let dateTime = new Date(d.time);
        dateTime.setHours(dateTime.getHours() - 3);
        return dateTime.getTime() >= horaLapso.getTime();
    });

      this.cajasRechazadasEagle = this.dashService.getRechazos(this.eagleData?.data!);
      this.cajasNoLeidasEagle = this.dashService.getNoLeidos(this.eagleData?.data!);
      this.cajasLeidasEagle = this.eagleData?.data.length! - this.cajasNoLeidasEagle;
      this.porcRechazoEagle = this.cajasRechazadasEagle / this.cajasLeidasEagle;
      this.porcNoLeidasEagle = this.cajasNoLeidasEagle / (this.cajasLeidasEagle + this.cajasNoLeidasEagle);
    }
  }

  private async getVelocidadWPLDia(): Promise<void> {
    var eP: EstacionProceso[] | undefined = await this.empaqueSecundarioService.getEstacionesProceso(0).toPromise();
    const wpl1 = eP?.filter(e => e.idStation == 4296)[0].cajas?? 0;
    const wpl2 = eP?.filter(e => e.idStation == 4299)[0].cajas?? 0;
    const wpl3 = eP?.filter(e => e.idStation == 4293)[0].cajas?? 0;

    var wpls: number[] = [];
    wpls.push(wpl1);
    wpls.push(wpl2);
    wpls.push(wpl3);

    await this.setCajasPromedioWLP(wpls, this.wplsAllDay);
    this.velocidadCerradoDia = this.wplsAllDay[4296] + this.wplsAllDay[4299] + this.wplsAllDay[4293]
  }

}
