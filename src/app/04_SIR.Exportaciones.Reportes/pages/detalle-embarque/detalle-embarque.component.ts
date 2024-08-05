import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmbarqueConfigComponent } from '../../components/embarque-config/embarque-config.component';
import { EmbarqueConfig } from '../../Interfaces/EmbarqueConfig.interface';
import { ConfirmationService } from 'primeng/api';
import { CargaKosherService } from '../../services/carga-kosher.service';
import { DWCajaCarga } from '../../Interfaces/DWCajaCarga.interface';
import { BehaviorSubject, lastValueFrom, Subscription } from 'rxjs';
import { CargaDTO } from '../../Interfaces/CargaDTO.interface';
import { KosherCommonService } from '../../services/kosher-common.service';
import { ConfPreciosDTO } from '../../Interfaces/ConfPreciosDTO.interface';
import { ConfProducto } from '../../Interfaces/ConfProducto.interface';

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
  
  confProductos: ConfProducto[] = [];

  codigosConPrecio: ConfPreciosDTO[] = [];

  configPopUp!: DynamicDialogRef;
  embarqueData!: EmbarqueConfig;
  errorIcon: string = "pi pi-exclamation-triangle";

  cajasCarga: DWCajaCarga[] | undefined = [];
  titulos: string[] = [];
  //#endregion
  
  //#region Lifecycle Hooks
  constructor(
    private dialog: DialogService,
    private confirmationService: ConfirmationService,
    private ckSrvc: CargaKosherService,
    private kcs: KosherCommonService
  ) {}

  ngOnInit(): void {
    this.titulos = this.kcs.getTitulosReporte();
  }

  ngOnDestroy(): void {
    if (this.datosCargaSub) {
      this.datosCargaSub.unsubscribe();
    }
    if (this.confProductosSub) {
      this.confProductosSub.unsubscribe();
    }
  }
  //#endregion

  //#region Reporte
  checkHacerReporteDetalleEmbarque(): void {
    if(this.embarqueData == undefined) {
      this.mostrarMensaje(
        'No se configuraron los datos del embarque.<br/>¿Deseas continuar de todos modos?', 
        'Datos de embarque', 
        this.errorIcon,
        true,
        "Sí, lo haré después",
        "No, configurar ahora"
      )
      .then(async () => {
        await this.hacerReporte();
      })
      .catch(() => {
        this.mostrarConfig();
      })
    } else
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
                  this.cajasCarga = await lastValueFrom(this.ckSrvc.getCajasCarga(datosCarga.idCarga, datosCarga.contenedores));
                 
                  if (this.cajasCarga && this.cajasCarga.length > 0) {
                      this.titulos = this.kcs.getTitulosReporte();
                      this.confProductosSub = this.confProductos$.subscribe(async () => {
                          this.confProductos = await lastValueFrom(this.ckSrvc.getConfProductos());
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

  //#endregion

  //#region Comunes
  habilitar($event: boolean) {  
    this.habilitarReporte = $event;
  }

  getDatosCarga($datos: CargaDTO) {
    this.datosCargaSubject.next($datos);
  }

  getPrecios($precios: ConfPreciosDTO[]) {
    this.codigosConPrecio = $precios;
  }

  getConfProductos(productos: ConfProducto[]) {
    this.kcs.setConfProductos(productos)
  }

  mostrarConfig(): void {
    this.configPopUp = this.dialog.open(EmbarqueConfigComponent, {
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
          this.kcs.setComision(this.embarqueData.comision)
          this.titulos = this.kcs.getTitulosReporte();
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
