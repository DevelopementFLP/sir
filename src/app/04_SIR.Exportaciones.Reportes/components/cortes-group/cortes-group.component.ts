import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DWCajaCarga } from '../../Interfaces/DWCajaCarga.interface';
import { ConfPreciosDTO } from '../../Interfaces/ConfPreciosDTO.interface';
import { CodigoData } from '../../Interfaces/CodigoData.interface';
import { ConfProducto } from '../../Interfaces/ConfProducto.interface';
import { DataKosher } from '../../Interfaces/DataKosher.interface';
import { Subscription } from 'rxjs';
import { KosherCommonService } from '../../services/kosher-common.service';
import { GroupedDataKosher } from '../../types/DataKosherAgrupada.type';
import { EmbarqueConfig } from '../../Interfaces/EmbarqueConfig.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CodigoPrecioFaltanteComponent } from '../codigo-precio-faltante/codigo-precio-faltante.component';
import { formatDate } from '@angular/common';
import { DataKosherAgrupada } from '../../Interfaces/DataKosherAgrupada.interface';

@Component({
  selector: 'cortes-group',
  templateUrl: './cortes-group.component.html',
  styleUrls: ['./cortes-group.component.css'],
  providers: [DialogService]
})
export class CortesGroupComponent implements OnInit, OnChanges, OnDestroy {
  objectKeys = Object.keys;

  titulos: string[] = [];

  groupedData: GroupedDataKosher = {};
  dataCortes: GroupedDataKosher = {};
  dataMenudencias: GroupedDataKosher = {};

  @Input() embarqueData!: DWCajaCarga[];
  @Input() codigosPrecios!: ConfPreciosDTO[];
  @Input() productosKosher!: ConfProducto[];
  @Input() dataConfig!: EmbarqueConfig;

  @Output() habilitarReporte = new EventEmitter<boolean>();

  dialogRef!: DynamicDialogRef;

  private subscription!: Subscription;

  datosCajas: DWCajaCarga[][] = [];
  datosPrecios: CodigoData[] = [];
  datosKosher: DataKosher[] = [];
  datosCortesKosher: DataKosher[] = [];
  datosMenudenciasKosher: DataKosher[] = [];

  mostrarReporte: boolean = false;
  
  idReporte: number = 7;
  nombreReporte: string = 'DETALLE DE EMBARQUE';

  errorNoCodigo: string[] = [];
  errorNoPrecio: {codigo: string, fecha: Date}[] = [];
  
  dataAgrupada: DataKosherAgrupada[] = [];
  totalPallets: number = 0;


  constructor(
    private ckcs: KosherCommonService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.titulos = this.ckcs.getTitulosReporte();
    this.actualizarDatosCajas();
    this.subscription = this.ckcs.confProductos$.subscribe(data => {
      this.productosKosher = data;
    });
    
    this.datosCortesKosher = this.datosKosher.filter(d => !isNaN(parseFloat(d.codigoKosher!)));
    this.datosMenudenciasKosher = this.datosKosher.filter(d => isNaN(parseFloat(d.codigoKosher!)));
    this.dataCortes = this.agruparData(this.datosCortesKosher);
    this.dataMenudencias = this.agruparData(this.datosMenudenciasKosher);

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['embarqueData'] && !changes['embarqueData'].isFirstChange()) {
      this.actualizarDatosCajas();
      this.datosKosher = [];
        this.embarqueData.forEach(d => {
          this.setDatosKosher(d);
      });

      if(this.errorNoCodigo.length == 0 && this.errorNoPrecio.length == 0) {
        console.log(this.datosKosher)
        this.dataAgrupada = this.ckcs.setDatosAgrupados(this.datosKosher);
        this.totalPallets = this.ckcs.getTotalPalletsByContainer(this.dataAgrupada);
        this.datosCortesKosher = this.datosKosher.filter(d => !isNaN(parseFloat(d.codigoKosher!)));
        this.datosMenudenciasKosher = this.datosKosher.filter(d => isNaN(parseFloat(d.codigoKosher!)));
        this.dataCortes = this.agruparData(this.datosCortesKosher);
        this.dataMenudencias = this.agruparData(this.datosMenudenciasKosher);
        this.mostrarReporte = this.datosCortesKosher.length > 0 || this.datosMenudenciasKosher.length > 0;
      } else {
        this.mostrarDialogoErrores();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if(this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef.destroy();
    }
  }

  private actualizarDatosCajas(): void {
    if (!this.embarqueData) return;
   
    this.datosCajas = [];
    const containers: string[] = Array.from(new Set(this.embarqueData.map(cc => cc.container)));
    containers.forEach(container => {
      const data: DWCajaCarga[] = this.embarqueData.filter(cc => cc.container === container);
      this.datosCajas.push(data);
    });
  }

  precio(container: DWCajaCarga): number {
    if (container?.pesoNeto && container?.id_Pallet && container?.codProducto && container?.fechaCorrida)
      return this.getPrecio(container.id_Pallet, container.codProducto, container.fechaCorrida);
    
    return 0;
  }

  calculatePrecio(container: DWCajaCarga): number {
    if (container?.pesoNeto && container?.id_Pallet && container?.codProducto && container?.fechaCorrida) 
      return container.pesoNeto * this.getPrecio(container.id_Pallet, container.codProducto, container.fechaCorrida);
    
    return 0;
  }
  
  private getPrecio(idPallet: number, codProducto: string, fechaProduccion: Date): number {
    let precioData = this.datosPrecios.find(d => d.idPallet == idPallet && d.fechaProduccion == fechaProduccion && d.codigo == codProducto);
    if(precioData)
      return precioData.precio

    return 0;
  }

  private setDatosKosher(caja: DWCajaCarga): void {
    const codKosher: ConfProducto | undefined = this.getConfProductoParaCodigo(caja.codProducto);
    const precioFecha: ConfPreciosDTO | null = this.getPrecioParaFecha(caja.codProducto, caja.fechaCorrida!);

    if(codKosher) {
      if(precioFecha != null)
        {
        let data: DataKosher | undefined = undefined;
        data = {
          codigoProducto: caja.codProducto,
          mercaderia: this.tipoMercaderia(codKosher.codigoKosher!),
          container: caja.container,
          idLargo: caja.idLargo,
          idMoneda: precioFecha.id_Moneda,
          precioTonelada: precioFecha.precio_Tonelada,
          idPallet: caja.id_Pallet!,
          clasificacionKosher: codKosher.clasificacionKosher,
          codigoKosher: codKosher.codigoKosher,
          especie: codKosher.especie,
          fechaCorrida: caja.fechaCorrida,
          fechaVencimiento1: caja.fechaVencimiento_1,
          markKosher: codKosher.markKosher,
          pesoBruto: caja.pesoBruto,
          pesoNeto: caja.pesoNeto,
          tipoProducto: codKosher.tipoProducto
        };

        this.datosKosher.push(data);
      }
      else {
        if(caja.codProducto != null && this.errorNoPrecio.find(e => e.codigo == caja.codProducto && this.sonFechasIguales(e.fecha, caja.fechaCorrida!)) == undefined) {
          this.errorNoPrecio.push({codigo: caja.codProducto, fecha: caja.fechaCorrida!});
        }
      }
    }
    else {
      if(caja.codProducto != null && this.errorNoCodigo.find(e => e == caja.codProducto) == undefined)
        this.errorNoCodigo.push(caja.codProducto);
     }
  }

  private sonFechasIguales(fecha_1: Date, fecha_2: Date): boolean {
    return this.formatearFecha(fecha_1) == this.formatearFecha(fecha_2);
  }

  private formatearFecha(fecha: Date): string {
    return formatDate(fecha, "dd-MM-yyyy", "es-UY");
  }


  private getConfProductoParaCodigo(codigo: string): ConfProducto | undefined {
    return this.productosKosher.find(p => p.codigoProducto == codigo);
  }

  private tipoMercaderia(codigo: string): string {
    return isNaN(parseInt(codigo)) ? codigo : "CORTES";
  }

  private getPrecioParaFecha(codProducto: string, fechaProduccion: Date): ConfPreciosDTO | null {
    const precios: ConfPreciosDTO[] = this.codigosPrecios.filter(p => p.codigo_Producto === codProducto);
    let fechaPrecio: ConfPreciosDTO | null = null;

    if(precios) {
      fechaPrecio = this.getFechaAnteriorMasCercana(precios, fechaProduccion);
    }

    return fechaPrecio;
  }

  private getFechaAnteriorMasCercana(precios: ConfPreciosDTO[], fechaObjetivo: Date): ConfPreciosDTO | null {
    const objetivo = new Date(fechaObjetivo).getTime();
    let fechaMasCercanaObject: ConfPreciosDTO | null = null;
    let tiempoMasCercanoDiff = Infinity;
    
    for(const obj of precios) {
      const fechaProduccion = new Date(obj.fecha_Produccion).getTime();
      if(fechaProduccion === objetivo)
        return obj;

      if(fechaProduccion < objetivo) {
        const tiempoDiff = objetivo - fechaProduccion;
        if(tiempoDiff < tiempoMasCercanoDiff) {
          fechaMasCercanaObject = obj;
          tiempoMasCercanoDiff = tiempoDiff;
        }
      }
    }
    return fechaMasCercanaObject;
  }

  agruparData(data: DataKosher[]): GroupedDataKosher {
    return data.reduce((result, item) => {
        // Agrupar por mercaderia
        if (!result[item.mercaderia]) {
            result[item.mercaderia] = { totalPesoNeto: 0, totalPesoBruto: 0, containers: {} };
        }
        const mercaderiaGroup = result[item.mercaderia];

        // Sumar pesoNeto y pesoBruto
        mercaderiaGroup.totalPesoNeto += item.pesoNeto || 0;
        mercaderiaGroup.totalPesoBruto += item.pesoBruto || 0;

        // Agrupar por container
        if (!mercaderiaGroup.containers[item.container]) {
            mercaderiaGroup.containers[item.container] = { totalPesoNeto: 0, totalPesoBruto: 0, especies: {} };
        }
        const containerGroup = mercaderiaGroup.containers[item.container];

        // Sumar pesoNeto y pesoBruto
        containerGroup.totalPesoNeto += item.pesoNeto || 0;
        containerGroup.totalPesoBruto += item.pesoBruto || 0;

        // Agrupar por especie
        if (!containerGroup.especies[item.especie!]) {
            containerGroup.especies[item.especie!] = { totalPesoNeto: 0, totalPesoBruto: 0, tipoProductos: {} };
        }
        const especieGroup = containerGroup.especies[item.especie!];

        // Sumar pesoNeto y pesoBruto
        especieGroup.totalPesoNeto += item.pesoNeto || 0;
        especieGroup.totalPesoBruto += item.pesoBruto || 0;

        // Agrupar por tipoProducto
        if (!especieGroup.tipoProductos[item.tipoProducto!]) {
            especieGroup.tipoProductos[item.tipoProducto!] = { totalPesoNeto: 0, totalPesoBruto: 0, precios: {} };
        }
        const tipoProductoGroup = especieGroup.tipoProductos[item.tipoProducto!];

        // Sumar pesoNeto y pesoBruto
        tipoProductoGroup.totalPesoNeto += item.pesoNeto || 0;
        tipoProductoGroup.totalPesoBruto += item.pesoBruto || 0;

        // Agrupar por precioTonelada
        if (!tipoProductoGroup.precios[item.precioTonelada]) {
            tipoProductoGroup.precios[item.precioTonelada] = { totalPesoNeto: 0, totalPesoBruto: 0, items: [] };
        }
        const precioToneladaGroup = tipoProductoGroup.precios[item.precioTonelada];

        // Sumar pesoNeto y pesoBruto
        precioToneladaGroup.totalPesoNeto += item.pesoNeto || 0;
        precioToneladaGroup.totalPesoBruto += item.pesoBruto || 0;

        // Agrupar por idPallet
        precioToneladaGroup.items.push(item);

        return result;
    }, {} as GroupedDataKosher);
}

  mostrarExcel(): boolean {
    return this.dataConfig != undefined && this.datosKosher.length > 0;
  }

  mostrarDialogoErrores(): void {
    this.dialogRef = this.dialogService.open(CodigoPrecioFaltanteComponent, {
      data: {
        noCodigos: this.errorNoCodigo,
        noPrecios: this.errorNoPrecio
      },
      header: "Códigos y precios faltantes",
      dismissableMask: false,
      closable: true,
      closeOnEscape: false,
      width: '50vw'
    });

    this.dialogRef.onClose.subscribe((res) => {
      if(res != undefined) {
        this.habilitarReporte.emit(false);
        //this.ckcs.setReset();
      }
    });
  }
}

