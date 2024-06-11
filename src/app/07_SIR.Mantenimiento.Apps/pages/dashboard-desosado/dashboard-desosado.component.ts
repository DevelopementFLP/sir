import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DetalleCharqueadoresComponent } from '../../components/detalle-charqueadores/detalle-charqueadores.component';
import { LotesEntradaComponent } from '../../components/lotes-entrada/lotes-entrada.component';
import { DataHueseroViewerComponent } from '../../components/data-huesero-viewer/data-huesero-viewer.component';
import { DataCharqueoViewerComponent } from '../../components/data-charqueo-viewer/data-charqueo-viewer.component';
import { DataLineViewerComponent } from '../../components/data-line-viewer/data-line-viewer.component';
import { DashboardDesosadoService } from '../../services/dashboard-desosado.service';
import { LoteEntrada } from '../../interfaces/LoteEntrada.interface';
import { IndicadorCharqueador } from '../../interfaces/IndicadorCharqueador.interface';
import { DetalleHueserosComponent } from '../../components/detalle-hueseros/detalle-hueseros.component';
import { IndicadorHuesero } from '../../interfaces/IndicadorHuesero.interface';
import { IndicadorEmpaque } from '../../interfaces/IndicadorEmpaque.interface';
import { DataHuesero } from '../../interfaces/DataHuesero.interface';
import { DataCharqueo } from '../../interfaces/DataCharqueo.interface';
import { DataEmpaque } from '../../interfaces/DataEmpaque.interface';
import { TestService } from 'src/app/shared/services/test.service';


@Component({
  selector: 'app-dashboard-desosado',
  templateUrl: './dashboard-desosado.component.html',
  styleUrls: ['./general-styles.css', './max-width-767.css', './min-width-768.css', './min-width-992.css', './dashboard-desosado.component.css'],
  providers: [DialogService]
})
export class DashboardDesosadoComponent implements OnInit, OnDestroy {
  lineOptions: any[] = [{label: "L5 a L1", value: 'L5 a L1'}, {label: "L1 a L5", value: 'L1 a L5'}]; 
  orden: string = 'L1 a L5';

  seeOptions: any[] = [{label: "Todas", value: 'Todas'}, {label: "Activas", value: 'Activas'}];
  see: string = 'Todas';

  private lineasActivas: boolean[] = [true, true, true, true, true];

  refDetalleCharqueo: DynamicDialogRef | undefined;
  refDetalleHueseros: DynamicDialogRef | undefined;
  refLotes: DynamicDialogRef | undefined;
  refHuesero: DynamicDialogRef | undefined;
  refCharqueo: DynamicDialogRef | undefined;
  refLine: DynamicDialogRef  | undefined;

  refreshTime: number = 300000;

  hueseroLine: string = 'Huesero';
  charqueoLine: string = 'Charqueo';
  empaqueLine: string = 'Primary Packing';
  linesNumber: string[] = ['L1', 'L2', 'L3', 'L4', 'L5'];
  linesStations: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16'];

  lotesEntrada: LoteEntrada[] | undefined = [];
  detalleCharqueadores: IndicadorCharqueador[] | undefined = [];
  detalleHueseros: IndicadorHuesero[] | undefined = [];
  datosEmpaque: IndicadorEmpaque[] | undefined = [];

  hueserosL1: (IndicadorHuesero | undefined)[] = [];
  hueserosL2: (IndicadorHuesero | undefined)[] = [];
  hueserosL3: (IndicadorHuesero | undefined)[] = [];
  hueserosL4: (IndicadorHuesero | undefined)[] = [];
  hueserosL5: (IndicadorHuesero | undefined)[] = [];
  
  charqueadoresL1: (IndicadorCharqueador | undefined)[] = [];
  charqueadoresL2: (IndicadorCharqueador | undefined)[] = [];
  charqueadoresL3: (IndicadorCharqueador | undefined)[] = [];
  charqueadoresL4: (IndicadorCharqueador | undefined)[] = [];
  charqueadoresL5: (IndicadorCharqueador | undefined)[] = [];

  empaqueL1: (IndicadorEmpaque | undefined)[] = [];
  empaqueL2: (IndicadorEmpaque | undefined)[] = [];
  empaqueL3: (IndicadorEmpaque | undefined)[] = [];
  empaqueL4: (IndicadorEmpaque | undefined)[] = [];
  empaqueL5: (IndicadorEmpaque | undefined)[] = [];

  totalCuartosEntrada: number = 0;
  totalKilosEntrada: number = 0;

  /* rendimientos */
  rendHueseros_1: number = 0;
  rendHueseros_2: number = 0;
  rendHueseros_3: number = 0;
  rendHueseros_4: number = 0;
  rendHueseros_5: number = 0;
  rendCharqueadores_1: number = 0;
  rendCharqueadores_2: number = 0;
  rendCharqueadores_3: number = 0;
  rendCharqueadores_4: number = 0;
  rendCharqueadores_5: number = 0;

  esMayorPromedioHueseros_1: boolean = false;
  esMayorPromedioHueseros_2: boolean = false;
  esMayorPromedioHueseros_3: boolean = false;
  esMayorPromedioHueseros_4: boolean = false;
  esMayorPromedioHueseros_5: boolean = false;
  esMayorPromedioCharqueadores_1: boolean = false;
  esMayorPromedioCharqueadores_2: boolean = false;
  esMayorPromedioCharqueadores_3: boolean = false;
  esMayorPromedioCharqueadores_4: boolean = false;
  esMayorPromedioCharqueadores_5: boolean = false;
  

  constructor(
    public dialogService: DialogService,
    private dashBoardService: DashboardDesosadoService
  ) {}

 async ngOnInit(): Promise<void> {
  
  await this.updateData();
  try {
    let rT: string | undefined = await this.dashBoardService.getRefreshTime().toPromise()
    if(rT) 
      this.refreshTime = parseInt(rT);
  } catch {
    this.refreshTime = 300000;
  }

  setInterval(async () => {
    await this.getData();
    await this.setDWData();
  }, this.refreshTime);
}

  async updateData(): Promise<void> {
    await this.getDWData();

    if(this.lotesEntrada && this.lotesEntrada.length > 0 ||
       this.detalleHueseros && this.detalleHueseros.length > 0 || 
       this.detalleCharqueadores && this.detalleCharqueadores.length > 0 ||
       this.datosEmpaque && this.datosEmpaque.length > 0
     ) {
       //await this.getData();
     } else {
       await this.getData();
       await this.setDWData();
     }
  }

  async getData(): Promise<void> {
     // Lotes entrada
    try {
      await this.getLotesEntrada();
      this.setDataEntrada();
    } catch (error: any) {
      throw new Error("Error al obtener lotes de entrada", error);
    }

    // Hueseros
    try {
      await this.getDetalleHuesero();
      this.setDataHuesero()
    } catch (error: any) {
      throw new Error("Error al obtener los datos de hueseros", error);
    }

     // Charqueadores
     try {
      await this.getDetalleCharqueo();
      this.setDataCharqueo();
    } catch (error: any) {
     throw new Error("Error al obtener los datos de charqueo", error);
    }


    // Empaque
    try {
      await this.getDataEmpaque();
      this.setDataEmpaque();
    }
    catch(error: any) {
      throw new Error("Error al obterer los datos del empaque", error);
    }

    this.setRendimientos();
    this.setEsMayorPromedio();
  }

  async setDWData(): Promise<void> {
    // Entrada
    try {
      await this.dashBoardService.postDWLotesEntrada(this.lotesEntrada!).toPromise();
    } catch (error: any) {
      throw new Error("Hubo un error al intentar actualizar los datos de lotes de entrada en DW");
    }

    // Hueseros
    try {
      await this.dashBoardService.postDWDetalleHuesero(this.detalleHueseros!).toPromise();
    } catch (error: any) {
      throw new Error("Hubo un error al intentar actualizar los datos de hueseros en DW");
    }
    
    // Charqueo
    try {
      await this.dashBoardService.postDWDetalleCharqueo(this.detalleCharqueadores!).toPromise();
    } catch (error: any) {
      throw new Error("Hubo un error al intentar actualizar los datos de charqueo en DW");
    }

    // Empaque
    try {
      await this.dashBoardService.postDWDatosEmpaque(this.datosEmpaque!).toPromise();
    } catch (error: any) {
      throw new Error("Hubo un error al intentar actualizar los datos de empaque primario en DW");
    }
  }

  async getDWData(): Promise<void> {
    // Lotes entrada
    try {
      this.lotesEntrada = [];
      this.lotesEntrada = await this.dashBoardService.getDWLotesEntrada().toPromise();
      this.setDataEntrada();
    } catch (error: any) {
      throw new Error("Hubo un error al intentar obtener los datos de lotes de entrada en DW");
    }

    // Empaque
    try {
      this.detalleHueseros = [];
      this.detalleHueseros = await this.dashBoardService.getDWDetalleHueseros().toPromise();
      this.setDataHuesero();
    } catch (error: any) {
      throw new Error("Hubo un error al intentar obtener los datos de hueseros en DW");
    }

    // Charqueo
    try {
      this.detalleCharqueadores = [];
      this.detalleCharqueadores = await this.dashBoardService.getDWDetalleCharqueo().toPromise();
      this.setDataCharqueo();
    } catch (error: any) {
      throw new Error("Hubo un error al intentar obtener los datos de charqueo en DW");
    }

    // Empaque
    try {
      this.datosEmpaque = [];
      this.datosEmpaque = await this.dashBoardService.getDWDatosEmpaque().toPromise();
      this.setDataEmpaque();
    } catch (error: any) {
      throw new Error("Hubo un error al intentar obtener los datos de empaque primario en DW");
    }
  }

  private setDataEntrada(): void {
    this.totalCuartosEntrada = this.getTotalCuartosEntrada();
    this.totalKilosEntrada = this.getTotalKilosEntrada();
  }

  private setDataCharqueo(): void {
    this.charqueadoresL1 = [];
    this.charqueadoresL2 = [];
    this.charqueadoresL3 = [];
    this.charqueadoresL4 = [];
    this.charqueadoresL5 = [];
    this.getCharqueadores(0, this.charqueadoresL1);
    this.getCharqueadores(1, this.charqueadoresL2);
    this.getCharqueadores(2, this.charqueadoresL3);
    this.getCharqueadores(3, this.charqueadoresL4);
    this.getCharqueadores(4, this.charqueadoresL5);
  }

  private setDataHuesero(): void {
    this.hueserosL1 = [];
    this.hueserosL2 = [];
    this.hueserosL3 = [];
    this.hueserosL4 = [];
    this.hueserosL5 = [];
    this.getHueseros(0, this.hueserosL1); 
    this.getHueseros(1, this.hueserosL2); 
    this.getHueseros(2, this.hueserosL3); 
    this.getHueseros(3, this.hueserosL4); 
    this.getHueseros(4, this.hueserosL5); 
  }

  private setDataEmpaque(): void {
    this.empaqueL1 = [];
    this.empaqueL2 = [];
    this.empaqueL3 = [];
    this.empaqueL4 = [];
    this.empaqueL5 = [];
    this.getEmpaques(0, this.empaqueL1);
    this.getEmpaques(1, this.empaqueL2);
    this.getEmpaques(2, this.empaqueL3);
    this.getEmpaques(3, this.empaqueL4);
    this.getEmpaques(4, this.empaqueL5);
  }

  private getHueseros(lineId: number, line: (IndicadorHuesero | undefined)[]): void {
    let puesto: string;
   
    for(let i = 0; i < 5; i++) {
      puesto = this.linesNumber[lineId] + " " + this.hueseroLine + " " + this.linesStations[i];
      const huesero: IndicadorHuesero | undefined = this.detalleHueseros?.find(h => h.nombreEstación == puesto);
      line.push(huesero);
    }
  }

  private getCharqueadores(lineId: number, line: (IndicadorCharqueador | undefined)[]): void {
    let puesto: string;
   
    for(let i = 0; i < 16; i++) {
      puesto = this.linesNumber[lineId] + " " + this.charqueoLine + " " + this.linesStations[i];
      const charqueo: IndicadorCharqueador | undefined = this.detalleCharqueadores?.find(c => c.nombreEstacion == puesto);
      
      line.push(charqueo);
    }
  }

  private getEmpaques(lineId: number, line: (IndicadorEmpaque | undefined)[]): void {
    let puesto: string;
    for(let i = 0; i < 16; i++) {
      puesto = this.linesNumber[lineId] + " " + this.empaqueLine + " " + this.linesStations[i];
     
      const empaque: IndicadorEmpaque | undefined = this.datosEmpaque?.find(e => e.puesto == puesto);
      line.push(empaque);
      
    }
  }

  ngOnDestroy(): void {
    if(this.refDetalleCharqueo) this.refDetalleCharqueo.close();
    if(this.refDetalleHueseros) this.refDetalleHueseros.close();
    if(this.refLotes)     this.refLotes.close();
    if(this.refHuesero)   this.refHuesero.close();
    if(this.refCharqueo)  this.refCharqueo.close();
    if(this.refLine)      this.refLine.close();
  }

  toggleLineVisibility(event: PointerEvent): void { 
    if(this.see === 'Todas') {
      this.showAll();
    } else {
      this.setLineasActivas();
      this.showLines(this.lineasActivas);
    }
    
    this.reverseOrder(this.orden);
  }

  private showAll(): void {
    for(var i = 1; i <= 5; i++) {
      const lineElem: HTMLElement = document.querySelector('.linea-' + (i).toString())!;
      const lineName: HTMLElement = document.querySelector('.nombre-L' + (i).toString())!;
      if(lineElem.style.display === 'none') { 
        lineElem.style.display = 'flex';
        lineName.style.display = 'flex';
      } 
    }
  }

  private showLines(lineas: boolean[]): void {
    lineas.forEach((line: boolean, index: number) => {
      const lineElem: HTMLElement = document.querySelector('.linea-' + (index + 1).toString())!;
      const lineName: HTMLElement = document.querySelector('.nombre-L' + (index + 1).toString())!;

      if(!line) {
        lineElem.style.display = 'none';
        lineName.style.display = 'none';
      }
    });
  }
  
  onLineOrderSelected(event: PointerEvent): void {
    this.reverseOrder(this.orden);
  }

  private reverseOrder(orden: string): void {
    const contaier: HTMLElement = document.querySelector('.container')!;
    if(contaier) {
      if(orden === 'L1 a L5') {
        contaier.style.flexDirection = 'column';
      } else {
        contaier.style.flexDirection = 'column-reverse';
      }
    }
  }

  showDetalleHuesero(): void {
    this.refDetalleHueseros = this.dialogService.open(DetalleHueserosComponent, {
      data: {
        hueseros: this.detalleHueseros
      },
      header: 'DETALLE DE HUESEROS',
      width: '90vw',
      contentStyle: { overflow: 'auto' },
      closeOnEscape: true,
      dismissableMask: true
    });
  }

  showDetalleCharqueo(): void {
    this.refDetalleCharqueo = this.dialogService.open(DetalleCharqueadoresComponent, {
      data: {
        charqueadores: this.detalleCharqueadores
      },
      header: 'DETALLE DE CHARQUEADORES',
      width: '90vw',
      contentStyle: { overflow: 'auto' },
      closeOnEscape: true,
      dismissableMask: true
    });
  }

  showLotesEntrada(): void {
    this.refLotes = this.dialogService.open(LotesEntradaComponent, {
      data: {
        lotes: this.lotesEntrada
      },
      header: 'LOTES DE ENTRADA',
      width: '70vw',
      contentStyle: { overflow: 'auto'},
      closeOnEscape: true,
      dismissableMask: true
    })
  }

  showDataHuesero(huesero: IndicadorHuesero | undefined, event: Event):void {
    
    if(!huesero) {
      event.preventDefault();
      return;
    }

    this.refHuesero = this.dialogService.open(DataHueseroViewerComponent, {
      data: {
        huesero: huesero
      },
      header: 'Detalle de huesero',
      width: '30vw',
      contentStyle: { overflow: 'auto' },
      closeOnEscape: true,
      dismissableMask: true
    })
  }

  showDataCharqueo(charqueador: IndicadorCharqueador | undefined, event: Event): void {
    
    if(!charqueador) {
      event.preventDefault();
      return;
    }
    
      this.refCharqueo = this.dialogService.open(DataCharqueoViewerComponent, {
      data: {
        charqueador: charqueador
      },
      header: 'Detalle de charqueador',
      width: '30vw',
      contentStyle: { overflow: 'auto'},
      closeOnEscape: true,
      dismissableMask: true
    })
  }

  showDataLine(event: Event): void {
    const elem: HTMLDivElement = event.target as HTMLDivElement;
    const nroLinea: string = elem.classList[0].split('__')[0].split('-')[1];
    const lineas: string = '12345';

    if(lineas.indexOf(nroLinea) >= 0) {
      this.refLine = this.dialogService.open(DataLineViewerComponent, {
        data:{
          hueseros: this.getLineaHueseros(nroLinea),
          charqueadores: this.getLineaCharqueadores(nroLinea),
          empaque: this.getLineaEmpaque(nroLinea)
        },
        header: 'LINEA ' + nroLinea,
        width: '80vw',
        contentStyle: { overflow: 'auto'},
        closeOnEscape: true,
        dismissableMask: true
      })
    }
  }

  private getLineaHueseros(nroLinea: string): (IndicadorHuesero | undefined)[] {
     switch(nroLinea) {
      case '1':
        return this.hueserosL1;  
      case '2':
          return this.hueserosL2;
      case '3':
          return this.hueserosL3;
      case '4':
        return this.hueserosL4;
      case '5':
        return this.hueserosL5;
      default:
        return [];
     }
  }

  private getLineaCharqueadores(nroLinea: string): (IndicadorCharqueador | undefined)[] {
    switch(nroLinea) {
     case '1':
       return this.charqueadoresL1;  
     case '2':
         return this.charqueadoresL2;
     case '3':
         return this.charqueadoresL3;
     case '4':
       return this.charqueadoresL4;
     case '5':
       return this.charqueadoresL5;
     default:
       return [];
    }
 }

 private getLineaEmpaque(nroLinea: string): (IndicadorEmpaque | undefined)[] {
  switch(nroLinea) {
   case '1':
     return this.empaqueL1;  
   case '2':
       return this.empaqueL2;
   case '3':
       return this.empaqueL3;
   case '4':
     return this.empaqueL4;
   case '5':
     return this.empaqueL5;
   default:
     return [];
  }
}

  @HostListener('window:resize', ['$event'])
  onResize(event:Event) {
    if(window.innerWidth > 700 && window.innerWidth < 1400) {
      if(this.see === 'Activas') {
        this.see = 'Todas';
        this.showAll();
      }

      
    }
    this.reverseOrder(this.orden);
  }

  private async getLotesEntrada(): Promise<void> {
    try {
      this.lotesEntrada = await this.dashBoardService.getLotesEntrada().toPromise();
    } catch (error: any) {
      throw new Error("Se produjo un error: ", error);
    }
  }

  private async getDetalleCharqueo(): Promise<void> {
    try {
      this.detalleCharqueadores = await this.dashBoardService.getDetalleCharqueo().toPromise();
    } catch (error: any) {
      throw new Error("Se produjo un error: ", error);
    }
  }

  private async getDetalleHuesero(): Promise<void> {
    try {
      this.detalleHueseros = await this.dashBoardService.getDetalleHueseros().toPromise();
    } catch (error: any) {
      throw new Error("Se produjo un error: ", error);
    }
  }

  private async getDataEmpaque(): Promise<void> {
    try {
      this.datosEmpaque = await this.dashBoardService.getDatosEmpaque().toPromise();
    } catch (error: any) {
      throw new Error("Se produjo un error: ", error);
    }
  }

  private getTotalCuartosEntrada(): number {
    let cuartos: number = 0;
    
    cuartos = this.lotesEntrada?.reduce((total, cuarto) => {
      return total + cuarto.cuartos
    }, 0)!;

    return cuartos;
  }

  private getTotalKilosEntrada(): number {
    let cuartos: number = 0;
    
    cuartos = this.lotesEntrada?.reduce((total, cuarto) => {
      return total + cuarto.pesoCuartos
    }, 0)!;

    return cuartos;
  }

  getDataHuesero(huesero: IndicadorHuesero | undefined): DataHuesero | undefined {
    let dataHuesero: DataHuesero | undefined;

    if(huesero) {
      dataHuesero = {
      cuartos: huesero.cuartos,
      kilosEnviados: huesero.kgEnviados,
      kilosRecibidos: huesero.kgRecibidos,
      nombre: huesero.huesero,
      puesto: huesero.nombreEstación
      }
    }

    return dataHuesero;
  }

  getDataCharqueador(charqueador: IndicadorCharqueador | undefined): DataCharqueo | undefined {
    let dataCharqueo: DataCharqueo | undefined;
    
    if(charqueador) {
      dataCharqueo = {
        nombre: charqueador.charqueador,
        puesto: charqueador.nombreEstacion,
        cortesEnviados: charqueador.cortesEnviados,
        kilosEnviados: charqueador.kgEnviados,
        cortesRecibidos: charqueador.cortesRecibidos,
        kilosRecibidos: charqueador.kgRecibidos
      }
    }

    return dataCharqueo;
  }

  getDataPacking(empaque: IndicadorEmpaque | undefined): DataEmpaque | undefined {
    let dataEmpaque: DataEmpaque | undefined;

    if(empaque) {
      dataEmpaque = {
        cortes: empaque.cortes,
        kilos: empaque.peso,
        puesto: empaque.puesto
      }
    }

    return dataEmpaque;
  }

  getTotalCuartosLinea(linea: (IndicadorHuesero | undefined)[]): number {
    let cuartos: number = 0;

    if(linea != undefined){
    
      cuartos = linea.reduce((total, p) => {
        return total + (p?.cuartos ?? 0);
      }, 0);
    }

    return cuartos;
  }

  getTotalKilosRecibidosLinea(linea: (IndicadorHuesero | undefined)[]): number {
    let kilos: number = 0;

    if(linea != undefined) {
      kilos = linea.reduce((total, p) => {
        return total + (p?.kgRecibidos ?? 0);
      }, 0);
    }
    return kilos;
  }

  getTotalKilosEnviadosLinea(linea: (IndicadorHuesero | undefined)[]): number {
    let kilos: number = 0;

    if(linea != undefined) {
      kilos = linea.reduce((total, p) => {
        return total + (p?.kgEnviados ?? 0);
      }, 0);
    }
    return kilos;
  }

  getRendimientoHueseros(linea: (IndicadorHuesero | undefined)[]): number {
    let rend: number = 0;
    const kgRec: number = this.getTotalKilosRecibidosLinea(linea) ?? 0;
    let kgEnv: number = this.getTotalKilosEnviadosLinea(linea) ?? 0;

    if (kgRec > 0)
      rend = kgEnv / kgRec;
    return rend;
  }

  getTotalCuartosHueseros(): number {
    return this.getTotalCuartosLinea(this.hueserosL1) +
            this.getTotalCuartosLinea(this.hueserosL2) +
            this.getTotalCuartosLinea(this.hueserosL3) +
            this.getTotalCuartosLinea(this.hueserosL4) +
            this.getTotalCuartosLinea(this.hueserosL5)
  }

  getTotalKilosRecibidosHueseros(): number {
    return this.getTotalKilosRecibidosLinea(this.hueserosL1) +
            this.getTotalKilosRecibidosLinea(this.hueserosL2) +
            this.getTotalKilosRecibidosLinea(this.hueserosL3) +
            this.getTotalKilosRecibidosLinea(this.hueserosL4) +
            this.getTotalKilosRecibidosLinea(this.hueserosL5)
  }

  getTotalKilosEnviadosHueseros(): number {
    return this.getTotalKilosEnviadosLinea(this.hueserosL1) +
            this.getTotalKilosEnviadosLinea(this.hueserosL2) +
            this.getTotalKilosEnviadosLinea(this.hueserosL3) +
            this.getTotalKilosEnviadosLinea(this.hueserosL4) +
            this.getTotalKilosEnviadosLinea(this.hueserosL5)
  }

  getRendimientoTotalHueseros(): number {
    return (this.getTotalKilosEnviadosHueseros() / this.getTotalKilosRecibidosHueseros()) ?? 0;
  }

  getTotalCharqueoCortesRecibidos(linea: (IndicadorCharqueador | undefined)[]): number {
    let cortes: number = 0;

    if(linea != undefined){
    
      cortes = linea.reduce((total, p) => {
        return total + (p?.cortesRecibidos ?? 0);
      }, 0);
    }

    return cortes;
  }

  getTotalCharqueoCortesEnviados(linea: (IndicadorCharqueador | undefined)[]): number {
    let cortes: number = 0;

    if(linea != undefined){
    
      cortes = linea.reduce((total, p) => {
        return total + (p?.cortesEnviados ?? 0);
      }, 0);
    }

    return cortes;
  }

  getTotalCharqueoKilosRecibidos(linea: (IndicadorCharqueador | undefined)[]): number {
    let kilos: number = 0;

    if(linea != undefined){
    
      kilos = linea.reduce((total, p) => {
        return total + (p?.kgRecibidos ?? 0);
      }, 0);
    }

    return kilos;
  }

  getTotalCharqueoKilosEnviados(linea: (IndicadorCharqueador | undefined)[]): number {
    let kilos: number = 0;

    if(linea != undefined){
    
      kilos = linea.reduce((total, p) => {
        return total + (p?.kgEnviados ?? 0);
      }, 0);
    }

    return kilos;
  }

  getRendimientoCharqueador(linea: (IndicadorCharqueador | undefined)[]): number {
    let rend: number = 0;
    const kgRec: number = this.getTotalCharqueoKilosRecibidos(linea) ?? 0;
    let kgEnv: number = this.getTotalCharqueoKilosEnviados(linea) ?? 0;

    if (kgRec > 0)
      rend = kgEnv / kgRec;
    return rend;
  }

  getTotalCharqueadorCortesEnviados(): number {
    return this.getTotalCharqueoCortesEnviados(this.charqueadoresL1) +
            this.getTotalCharqueoCortesEnviados(this.charqueadoresL2) +
            this.getTotalCharqueoCortesEnviados(this.charqueadoresL3) +
            this.getTotalCharqueoCortesEnviados(this.charqueadoresL4) +
            this.getTotalCharqueoCortesEnviados(this.charqueadoresL5)
  }

  getTotalCharqueadorCortesRecibidos(): number {
    return this.getTotalCharqueoCortesRecibidos(this.charqueadoresL1) +
            this.getTotalCharqueoCortesRecibidos(this.charqueadoresL2) +
            this.getTotalCharqueoCortesRecibidos(this.charqueadoresL3) +
            this.getTotalCharqueoCortesRecibidos(this.charqueadoresL4) +
            this.getTotalCharqueoCortesRecibidos(this.charqueadoresL5)
  }

  getTotalCharqueadorKilosEnviados(): number {
    return this.getTotalCharqueoKilosEnviados(this.charqueadoresL1) +
            this.getTotalCharqueoKilosEnviados(this.charqueadoresL2) +
            this.getTotalCharqueoKilosEnviados(this.charqueadoresL3) +
            this.getTotalCharqueoKilosEnviados(this.charqueadoresL4) +
            this.getTotalCharqueoKilosEnviados(this.charqueadoresL5)
  }

  getTotalCharqueadorKilosRecibidos(): number {
    return this.getTotalCharqueoKilosRecibidos(this.charqueadoresL1) +
            this.getTotalCharqueoKilosRecibidos(this.charqueadoresL2) +
            this.getTotalCharqueoKilosRecibidos(this.charqueadoresL3) +
            this.getTotalCharqueoKilosRecibidos(this.charqueadoresL4) +
            this.getTotalCharqueoKilosRecibidos(this.charqueadoresL5)
  }
  
  getRendimientoTotalCharqueadores(): number {
    return (this.getTotalCharqueadorKilosEnviados() / this.getTotalCharqueadorKilosRecibidos()) ?? 0;
  }

  getTotalEmpaqueCortes(linea: (IndicadorEmpaque | undefined)[]): number {
    let cortes: number = 0;

    if(linea != undefined){
    
      cortes = linea.reduce((total, p) => {
        return total + (p?.cortes ?? 0);
      }, 0);
    }

    return cortes;
  }

  getTotalEmpaqueKilos(linea: (IndicadorEmpaque | undefined)[]): number {
    let kilos: number = 0;

    if(linea != undefined){
    
      kilos = linea.reduce((total, p) => {
        return total + (p?.peso ?? 0);
      }, 0);
    }

    return kilos;
  }

  getTotalLineasEmpaqueCortes(): number {
    return this.getTotalEmpaqueCortes(this.empaqueL1) +
            this.getTotalEmpaqueCortes(this.empaqueL2) +
            this.getTotalEmpaqueCortes(this.empaqueL3) +
            this.getTotalEmpaqueCortes(this.empaqueL4) +
            this.getTotalEmpaqueCortes(this.empaqueL5)
  }

  getTototalLineasEmpaqueKilos(): number {
    return this.getTotalEmpaqueKilos(this.empaqueL1) +
    this.getTotalEmpaqueKilos(this.empaqueL2) + 
    this.getTotalEmpaqueKilos(this.empaqueL3) +
    this.getTotalEmpaqueKilos(this.empaqueL4) +
    this.getTotalEmpaqueKilos(this.empaqueL5) 
  }

  getIndiceRendimientoHuesero(): number {
    return this.dashBoardService.getIndiceRendimientoHueseros();
  }

  getIndiceRendimientoCharqueadores(): number {
    return this.dashBoardService.getIndiceRendimientoCharqueadores();
  }

  private setRendimientos(): void {
    this.rendHueseros_1 = this.getRendimientoHueseros(this.hueserosL1);
    this.rendHueseros_2 = this.getRendimientoHueseros(this.hueserosL2);
    this.rendHueseros_3 = this.getRendimientoHueseros(this.hueserosL3);
    this.rendHueseros_4 = this.getRendimientoHueseros(this.hueserosL4);
    this.rendHueseros_5 = this.getRendimientoHueseros(this.hueserosL5);
    this.rendCharqueadores_1 = this.getRendimientoCharqueador(this.charqueadoresL1);
    this.rendCharqueadores_2 = this.getRendimientoCharqueador(this.charqueadoresL2);
    this.rendCharqueadores_3 = this.getRendimientoCharqueador(this.charqueadoresL3);
    this.rendCharqueadores_4 = this.getRendimientoCharqueador(this.charqueadoresL4);
    this.rendCharqueadores_5 = this.getRendimientoCharqueador(this.charqueadoresL5);
  }

  private setEsMayorPromedio(): void {
    const promedioHueseros: number = this.getIndiceRendimientoHuesero();
    const promedioCharqueadores: number = this.getIndiceRendimientoCharqueadores();

    this.esMayorPromedioHueseros_1 = this.rendHueseros_1 >= promedioHueseros;
    this.esMayorPromedioHueseros_2 = this.rendHueseros_2 >= promedioHueseros;
    this.esMayorPromedioHueseros_3 = this.rendHueseros_3 >= promedioHueseros;
    this.esMayorPromedioHueseros_4 = this.rendHueseros_4 >= promedioHueseros;
    this.esMayorPromedioHueseros_5 = this.rendHueseros_5 >= promedioHueseros;
    this.esMayorPromedioCharqueadores_1 = this.rendCharqueadores_1 >= promedioCharqueadores;
    this.esMayorPromedioCharqueadores_2 = this.rendCharqueadores_1 >= promedioCharqueadores;
    this.esMayorPromedioCharqueadores_3 = this.rendCharqueadores_1 >= promedioCharqueadores;
    this.esMayorPromedioCharqueadores_4 = this.rendCharqueadores_1 >= promedioCharqueadores;
    this.esMayorPromedioCharqueadores_5 = this.rendCharqueadores_1 >= promedioCharqueadores;
  }

  private setLineasActivas(): void {
    this.lineasActivas[0] = this.hayDatosEnLineas(this.hueserosL1, this.charqueadoresL1, this.empaqueL1);
    this.lineasActivas[1] = this.hayDatosEnLineas(this.hueserosL2, this.charqueadoresL2, this.empaqueL2);
    this.lineasActivas[2] = this.hayDatosEnLineas(this.hueserosL3, this.charqueadoresL3, this.empaqueL3);
    this.lineasActivas[3] = this.hayDatosEnLineas(this.hueserosL4, this.charqueadoresL4, this.empaqueL4);
    this.lineasActivas[4] = this.hayDatosEnLineas(this.hueserosL5, this.charqueadoresL5, this.empaqueL5);
  }

  private hayDatosEnLineas(h: (IndicadorHuesero | undefined)[], c: (IndicadorCharqueador | undefined)[], e: (IndicadorEmpaque | undefined)[]): boolean {
    return this.hayDatosHuesero(h) || this.hayDatosCharqueo(c) || this.hayDatosEmpaque(e);
  }

  private hayDatosHuesero(linea: (IndicadorHuesero | undefined)[]): boolean {
    return this.getTotalCuartosLinea(linea) > 0;
  }

  private hayDatosCharqueo(linea: (IndicadorCharqueador | undefined)[]): boolean {
    return this.getTotalCharqueoCortesEnviados(linea) > 0;
  }

  private hayDatosEmpaque(linea: (IndicadorEmpaque | undefined)[]): boolean {
    return this.getTotalEmpaqueKilos(linea) > 0;
  }

}
