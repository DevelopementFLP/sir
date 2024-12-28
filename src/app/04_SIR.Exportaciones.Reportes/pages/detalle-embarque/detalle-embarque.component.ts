import { BehaviorSubject, lastValueFrom, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { formatDate } from '@angular/common';

import { AjustePesoNetoService } from '../../services/ajuste-peso-neto.service';
import { CargaDTO } from '../../Interfaces/CargaDTO.interface';
import { CargaKosherService } from '../../services/carga-kosher.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConfirmationService } from 'primeng/api';
import { ConfPreciosDTO } from '../../Interfaces/ConfPreciosDTO.interface';
import { ConfProducto } from '../../Interfaces/ConfProducto.interface';
import { DatoCargaExpo } from '../../Interfaces/DatoCargaExpo.interface';
import { DWCajaCarga } from '../../Interfaces/DWCajaCarga.interface';
import { DWContainer } from '../../Interfaces/DWContainer.interface';
import { EmbarqueConfig } from '../../Interfaces/EmbarqueConfig.interface';
import { EmbarqueConfigComponent } from '../../components/embarque-config/embarque-config.component';
import { KosherCommonService } from '../../services/kosher-common.service';
import { PesoBrutoContenedor } from '../../Interfaces/PesoBrutoContenedor.interface';

@Component({
  selector: 'app-detalle-embarque',
  templateUrl: './detalle-embarque.component.html',
  styleUrls: ['./detalle-embarque.component.css'],
  providers: [ DialogService, ConfirmationService ],
  encapsulation: ViewEncapsulation.None
})
export class DetalleEmbarqueComponent implements OnInit, OnDestroy {

  //#region Atributos
  private datosCargaSub: Subscription | null = null;
  private confProductosSub: Subscription | null = null;

  labelConfigurar: string = 'Configurar datos del embarque (No configurado)';
  habilitarReporte: boolean = false;
  defaultCargaDTO: CargaDTO  = {
    idCarga: [],
    contenedores: ""
  };

  private datosCargaSubject = new BehaviorSubject<CargaDTO>(this.defaultCargaDTO);
  datosCarga$ = this.datosCargaSubject.asObservable();

  private confProductosSubject = new BehaviorSubject<ConfProducto[]>([]);
  confProductos$ = this.confProductosSubject.asObservable();
  
  cajasCarga: DWCajaCarga[] | undefined = [];
  cajasCargaExpo: DatoCargaExpo[] = [];
  codigosConPrecio: ConfPreciosDTO[] = [];
  configPopUp!: DynamicDialogRef;
  confProductos: ConfProducto[] = [];
  dataContainers: DWContainer[] | undefined = [];
  datosCargaTotal: DatoCargaExpo[] = [];
  embarqueData: EmbarqueConfig | undefined;
  errorIcon: string = "pi pi-exclamation-triangle";
  pesosContenedores: PesoBrutoContenedor[] = [];
  titulos: string[] = [];
  //#endregion
  
  //#region Lifecycle Hooks
  constructor(
    private ajusteService: AjustePesoNetoService,
    private cargaKosherService: CargaKosherService,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private dialogService: DialogService,
    private kosherCommonService: KosherCommonService,
  ) {}

  ngOnInit(): void {
    this.titulos = this.kosherCommonService.getTitulosReporte();
  }

  ngOnDestroy(): void {
    this.unsubscribe(this.datosCargaSub);
    this.unsubscribe(this.confProductosSub);
  }

  private unsubscribe(subscrition: Subscription | null) {
    if(subscrition) subscrition.unsubscribe();
  }
  //#endregion

  //#region Reporte
  checkHacerReporteDetalleEmbarque(): void {
    if (!this.embarqueData) {
      this.mostrarMensaje(
        'No se configuraron los datos del embarque.<br/>¿Deseas continuar de todos modos?', 
        'Datos de embarque', 
        this.errorIcon,
        true,
        'Sí, lo configuraré después',
        'No, configurar ahora'
      )
      .then(() => this.hacerReporte())
      .catch(() => this.mostrarConfig());
      return;
    }
    this.hacerReporte();
  }

  private async hacerReporte(): Promise<void> {
    var errorMessage: string = 'Hubo un error al intentar obtener los datos del embarque. Intente nuevamente.';
    const handleError = (errorMsg: string = errorMessage) => {
      this.mostrarMensaje(
        errorMsg,
        'Error',
        this.errorIcon,
        false,
        'Aceptar'
      );
    };

    try {
      this.datosCargaSub = this.datosCarga$.subscribe(async datosCarga => {
        if (datosCarga) {
          try {
            this.cajasCarga = [];
            this.dataContainers = await lastValueFrom(
              this.cargaKosherService.getDataByContainer(
                datosCarga.idCarga,
                datosCarga.contenedores
              )
            );
            if (this.dataContainers.length > 0) {
              const fechas = Array.from(new Set(this.dataContainers.map(d => d.exportdate))).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
              let fechaDesdeStr: string = this.commonService.formatearFecha(fechas[0]);
              let fechaHastaStr: string = this.commonService.formatearFecha(fechas[fechas.length - 1]);
              let intervaloFechasCarga: { inicio: string, fin: string }[] = [];

              intervaloFechasCarga = this.kosherCommonService.obtenerIntervalosFechasCarga(fechaDesdeStr, fechaHastaStr);

              for (let i = 0; i < intervaloFechasCarga.length; i++) {
                const intervalo = intervaloFechasCarga[i];
                const fDesde = this.commonService.ajustarFecha(new Date(intervalo.inicio));
                const fHasta = this.commonService.ajustarFecha(new Date(intervalo.fin));
                const datos = await lastValueFrom(this.cargaKosherService.getProductosCargaPorRangoFechas(fDesde, fHasta));
                this.cajasCargaExpo = this.cajasCargaExpo.concat(datos);
              }
            }

            this.cajasCargaExpo = this.filtrarContenedoresPorIdsCarga(datosCarga.idCarga);
            this.cajasCargaExpo = this.ajusteService.setPesoBrutoPorContenedor(this.cajasCargaExpo, this.pesosContenedores);
            this.cajasCarga = this.mapContenedoresCajasCarga();

            if (this.cajasCarga && this.cajasCarga.length > 0) {
              this.titulos = this.kosherCommonService.getTitulosReporte();
              this.confProductosSub = this.confProductos$.subscribe(async () => {
                this.confProductos = await lastValueFrom(this.cargaKosherService.getConfProductos());
              });
            } else {
              handleError("No hay información de cajas asociada al identificador de carga, contenedores y precios seleccionados.");
            }
          } catch (error) {
            handleError();
          }
        }
      });
    } catch (error) {
      handleError();
    }
  }

  private filtrarContenedoresPorIdsCarga(ids: number[]): DatoCargaExpo[] {
    return this.cajasCargaExpo.filter(c => ids.includes(c.id_Carga));
  } 

  private mapContenedoresCajasCarga(): DWCajaCarga[] {
    var cajasCarga: DWCajaCarga[] = [];    
    this.cajasCargaExpo.forEach(caja => {
      var cajaCarga: DWCajaCarga;
      cajaCarga = {
        boxId: caja.boxid,
        codProducto: caja.productcode,
        container: caja.container,
        idLargo: '',
        sisOrigen: '',
        codigoKosher: undefined,
        especie: undefined,
        exportDate: new Date(caja.exportdate),
        extCodeInnova: undefined,
        fechaCorrida: this.formatearFecha(new Date(caja.productiondate)),
        fechaVencimiento_1: new Date(caja.expiredate),
        fechaVencimiento_2: undefined,
        id_Carga: caja.id_Carga,
        id_Pallet: caja.pallet,
        idGecos: undefined,
        idInnova: undefined,
        nomTipoProducto: undefined,
        pesoBruto: caja.grossweight,
        pesoNeto: caja.netweight
      }
      cajasCarga.push(cajaCarga);
    });

    return cajasCarga;
  }  
  //#endregion

  //#region Comunes
  private formatearFecha(fecha: Date): string {
    let f = new Date(fecha);
    return formatDate(
      f.setHours(f.getHours() + 3),
      'yyyy-MM-dd',
      'es-UY'
    );
  }

  habilitar($event: boolean) {  
    this.habilitarReporte = $event;
    if(!this.habilitarReporte) {
          this.embarqueData = undefined;
          this.labelConfigurar = 'Configurar datos del embarque (No configurado)'
    } else this.hacerReporte();
  }

  getDatosCarga($datos: CargaDTO): void {
    this.datosCargaSubject.next($datos);
  }

  getPrecios($precios: ConfPreciosDTO[]): void {
    this.codigosConPrecio = $precios;
  }

  setConfProductos(productos: ConfProducto[]): void {
    this.kosherCommonService.setConfProductos(productos)
  }

  getPesosContenedores(pesos: PesoBrutoContenedor[]): void {
    this.pesosContenedores = pesos;
  }

  mostrarConfig(): void {
    this.configPopUp = this.dialogService.open(EmbarqueConfigComponent, {
      header: 'Configurar datos del embarque',
      data: {
        config: this.embarqueData
      },
      width: '600px',
      closable: true,
      closeOnEscape: false,
      dismissableMask: false
    });

    this.configPopUp.onClose.subscribe(async (result: any) => {
      if (result !== undefined) {
        try {
          this.embarqueData = result as EmbarqueConfig;
          this.labelConfigurar = 'Configurar datos del embarque (Listo)'
          this.kosherCommonService.setComision(this.embarqueData.comision)
          this.titulos = this.kosherCommonService.getTitulosReporte();
         } catch (error) {
            console.error("ERROR: ", error);
         }
      }
    });
  }
  //#endregion

  //#region Mensajes
  mostrarMensaje(mensaje: string, header: string, icon: string, showReject: boolean, acceptLabel: string, rejectLabel: string = ''): Promise<void> {
    return new Promise<void>((resolve, reject) => { this.confirmationService.confirm({
        header: header,
        message: mensaje,
        icon: icon,
        rejectVisible: showReject,
        dismissableMask: false,
        closeOnEscape: false,
        acceptLabel: acceptLabel,
        rejectLabel: rejectLabel,
        rejectButtonStyleClass: 'p-button-danger',
        accept: () => {
          resolve();
        },
        reject: () => {
          reject();
        }
      });
    });
  }
  //#endregion
}
