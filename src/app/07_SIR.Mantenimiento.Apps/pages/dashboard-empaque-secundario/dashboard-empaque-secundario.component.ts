import { Component, OnDestroy, OnInit, Type } from '@angular/core';
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
  providers: [DialogService]
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
  cajasWPL: number[] = [];
  idsWPL: number[] = [4296, 4299, 4293];
  linea_1: EstacionesCortesCajas[] = [];  
  linea_2: EstacionesCortesCajas[] = [];  
  linea_3: EstacionesCortesCajas[] = [];  
  linea_4: EstacionesCortesCajas[] = [];  
  cajasTotal: number = 0;
  cajasLeidasEagle: number = 0;
  cajasRechazadasEagle: number = 0;
  cajasNoLeidasEagle: number = 0;
  porcRechazoEagle: number = 0;
  porcNoLeidasEagle: number = 0;
  wpls: WPLDict = { }

  /* local params */
  minsDesde: number = 0;
  prday: string = formatDate(new Date(), "yyyy-MM-dd", "es-UY");
  refreshTime?: number = 300000;
  reportList: ReporteMenuItem[] = [];
  lastUpdate: Date = new Date();
  velocidadCerradoActual: number = 0;
  velocidadCerradoDia: number = 0;
  lineas: number[] = [10, 10, 10, 12];

  /* dialog */
  dialog?: DynamicDialogRef;

  constructor(
    private empaqueSecundarioService: DashSecundarioService,
    private dialogService: DialogService,
    private dashService: DashboardService
  ) {}

  async ngOnInit(): Promise<void> {
    this.wpls[4296] = 0;
    this.wpls[4299] = 0;
    this.wpls[4293] = 0;

    this.reportList = this.empaqueSecundarioService.getReportesMenuItem();
    await this.GetTiemposActualizacion();
    //await this.GetEstacionesProceso();
    //await this.setCajasPromedioWLP();
    await this.GetEagleData();
    
    if(this.minsDesde > 0) this.filterRayosXData();
    
    // await this.GetEstacionesCortesCajas();
    
    //await this.GetEstacionesProceso();
    
    // await this.GetData();
    // setInterval(async () => {
    //   await this.GetData();
    // }, this.refreshTime);
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
  
  }

  private async GetData(): Promise<void> {
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
      await this.GetCortesSinEmpacar();
      await this.GetCajasAbiertas();
      await this.GetCajasCerradas();
      await this.GetCajasTMSCerradas();
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

  private getCajasWPL(station: number): number {
    return this.estacionesProceso?.filter(e => e.idStation == station)[0].cajas?? 0;
  }

  getTotalLinea(linea: string): EstacionesCortesCajas | undefined {
    return this.lineasCajas?.find(l => l.station == linea)?? undefined;
  }

  getTotales(): EstacionesCortesCajas {
    var cajas: number = 0;

    cajas = this.lineasCajas?.reduce((total, linea) => {
      return total + linea.cajas
    }, 0)!;

    var total: EstacionesCortesCajas = {
      cajas: cajas,
      cortes: 0,
      peso: this.kilosTotales?? 0,
      station: ''
    };

    return total;
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
  
  private async setCajasPromedioWLP(): Promise<void> {
    for(let wplKey in this.wpls) {
      const wpl: number = parseInt(wplKey);
      
      //if(Object.prototype.hasOwnProperty.call(this.wpls, wpl)) {
        const tiempoTotalWPL: Date = await this.empaqueSecundarioService.getTiempoTotalWPL(wpl);
        this.wpls[wpl] = Math.ceil(this.cajasWPL[this.idsWPL.indexOf(wpl)] / this.totalMinutes(tiempoTotalWPL));
      //}
    }
  }

  private totalMinutes(tiempo: Date): number {
    return tiempo.getUTCHours() * 60 + tiempo.getUTCMinutes();
  }


  private filterRayosXData(): void {
    let horaLapso: Date = new Date();
    horaLapso.setUTCHours(horaLapso.getUTCHours() - 3);
    horaLapso.setUTCHours(horaLapso.getUTCHours() - Math.trunc(this.minsDesde / 60));
    horaLapso.setUTCMinutes(horaLapso.getUTCMinutes() - this.minsDesde % 60);
    
    if(this.eagleData){
      this.eagleData.data = this.eagleData.data.filter(d => new Date(d.time) >= horaLapso);
      this.cajasRechazadasEagle = this.dashService.getRechazos(this.eagleData?.data!);
      this.cajasNoLeidasEagle = this.dashService.getNoLeidos(this.eagleData?.data!);
      this.cajasLeidasEagle = this.eagleData?.data.length! - this.cajasNoLeidasEagle;
      this.porcRechazoEagle = this.cajasRechazadasEagle / this.cajasLeidasEagle;
      this.porcNoLeidasEagle = this.cajasNoLeidasEagle / (this.cajasLeidasEagle + this.cajasNoLeidasEagle);
    }
  }

}
