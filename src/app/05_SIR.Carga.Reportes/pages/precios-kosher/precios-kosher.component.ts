import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { lastValueFrom } from 'rxjs';

import { AjustePesoNetoService } from 'src/app/04_SIR.Exportaciones.Reportes/services/ajuste-peso-neto.service';
import { CargaDTO } from 'src/app/04_SIR.Exportaciones.Reportes/Interfaces/CargaDTO.interface';
import { CargaKosherService } from 'src/app/04_SIR.Exportaciones.Reportes/services/carga-kosher.service';
import { CodigoPrecioFaltanteComponent } from 'src/app/04_SIR.Exportaciones.Reportes/components/codigo-precio-faltante/codigo-precio-faltante.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConfiguracionProductoKosher } from '../../interfaces/ConfiguracionProductoKosher.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfPreciosDTO } from 'src/app/04_SIR.Exportaciones.Reportes/Interfaces/ConfPreciosDTO.interface';
import { ContainerDTO } from 'src/app/04_SIR.Exportaciones.Reportes/Interfaces/ContainerDTO.interface';
import { DatoCargaExpo } from 'src/app/04_SIR.Exportaciones.Reportes/Interfaces/DatoCargaExpo.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { KosherCommonService } from 'src/app/04_SIR.Exportaciones.Reportes/services/kosher-common.service';
import { PesoBrutoContenedor } from 'src/app/04_SIR.Exportaciones.Reportes/Interfaces/PesoBrutoContenedor.interface';
import { PesoNetoContenedorComponent } from 'src/app/04_SIR.Exportaciones.Reportes/components/peso-neto-contenedor/peso-neto-contenedor.component';
import { PrecioFaltante } from '../../interfaces/PrecioFaltante.interface';
import { RegistroConPrecio } from '../../interfaces/RegistroConPrecio.interface';


@Component({
  selector: 'packing-list',
  templateUrl: './precios-kosher.component.html',
  styleUrls: ['./precios-kosher.component.css'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class PreciosKosherComponent implements OnInit {
  datosCarga: DatoCargaExpo[] = [];
  datosContenedores: ContainerDTO[] = [];
  fechaDesde!: Date;
  fechaHasta!: Date;
  fechaDesdeStr!: string;
  fechaHastaStr!: string;
  fechasReporte: string[] = [];
  hoy: Date = new Date();
  hoyStr: string = this.commonService.formatearFecha(this.hoy);

  codigosFaltantes: string[] = [];
  configProductos: ConfiguracionProductoKosher[] = [];
  datoCargaDto!: CargaDTO;
  datosCajasPrecio: RegistroConPrecio[] = [];
  datosCargaReporte: DatoCargaExpo[] = [];
  dropdownOpen: boolean = false;
  idReporte: number = 10;
  listasPrecios: ConfPreciosDTO[] = [];
  mostrarReporte: boolean = false;
  nombreReporte: string = 'Packing List';
  pesosBrutosContenedor: PesoBrutoContenedor[] = [];
  pesosDialogRef!: DynamicDialogRef;
  preciosFaltantes: PrecioFaltante[] = [];
  selectedCargas: number[] = [];

  intervaloFechasCarga: {inicio: string, fin: string}[] = [];

  constructor(
    private ajusteService: AjustePesoNetoService,
    private cargaService: CargaKosherService,
    private commonService: CommonService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private kosherCommonService: KosherCommonService
  ) { }

  async ngOnInit(): Promise<void> {
    this.resetearFechas();
  }

  protected async reiniciar(): Promise<void> {
    window.location.reload();
  }

  private resetearFechas(): void {
    this.fechaDesde = new Date();
    this.fechaHasta = new Date();
    this.fechaDesdeStr = this.commonService.formatearFecha(this.fechaDesde);
    this.fechaHastaStr = this.commonService.formatearFecha(this.fechaHasta);
    this.fechasReporte = [];
  }

  protected async buscarDatos(): Promise<void> {
    this.resetearDatos();

    this.intervaloFechasCarga = this.kosherCommonService.obtenerIntervalosFechasCarga(this.fechaDesdeStr, this.fechaHastaStr);
    
    for(let i = 0; i < this.intervaloFechasCarga.length; i++) {
      const intervalo = this.intervaloFechasCarga[i];
      const fDesde = this.ajustarFecha(new Date(intervalo.inicio)); 
      const fHasta = this.ajustarFecha(new Date(intervalo.fin));
      const datos = await lastValueFrom(this.cargaService.getProductosCargaPorRangoFechas(fDesde, fHasta));
      
      this.datosCarga = this.datosCarga.concat(datos);
    }    
    
    this.obtenerIdsCargaYNombresContenedores();
  }

  private obtenerIdsCargaYNombresContenedores(): void {
    const idsCarga = Array.from(new Set(this.datosCarga.map(d => d.id_Carga))).sort((a, b) => a - b);
    this.datosContenedores = idsCarga.map(id => ({
      id_Carga: id,
      container: this.datosCarga.find(dc => dc.id_Carga === id)?.container || '',
    })).filter(c => c.container).sort((a, b) => a.container.localeCompare(b.container));
  }
 
  protected hacerReporte(): void {
    this.datosCargaReporte = this.filtrarDatosPorContenedoresSeleccionados();

    this.datosCargaReporte.forEach(d => {
      d.productiondate = this.commonService.formatearFecha(new Date(d.productiondate));
      d.expiredate = this.commonService.formatearFecha(new Date(d.expiredate));
    });

    if (this.datosCargaReporte.length > 0) {
      this.fechasReporte = this.setRangoFechas(this.datosCargaReporte);
      this.datoCargaDto = this.setDatosCarga();
      this.mostrarConfiguracionPesoBruto(this.datoCargaDto);
    }
  }

  private filtrarDatosPorContenedoresSeleccionados(): DatoCargaExpo[] {
    return this.datosCarga.filter(d => this.selectedCargas.includes(d.id_Carga));
  }

  private resetearDatos(): void {
    this.codigosFaltantes = [];
    this.datosCarga = [];
    this.datosCargaReporte = [];
    this.mostrarReporte = false;
    this.pesosBrutosContenedor = [];
    this.selectedCargas = [];
    this.preciosFaltantes = [];
  }

  private setDatosCarga(): CargaDTO {
    const contenedores = this.datosContenedores
      .filter(d => this.selectedCargas.includes(d.id_Carga))
      .map(d => d.container)
      .join(',');

    return { idCarga: this.selectedCargas, contenedores };
  }

  private mostrarConfiguracionPesoBruto(datosCarga: CargaDTO): void {
    this.pesosDialogRef = this.dialogService.open(PesoNetoContenedorComponent, {
      data: {
        contenedores: datosCarga.contenedores
      },
      header: 'Peso bruto por contenedor',
      width: '50vw',
      closable: true,
      closeOnEscape: false,
      dismissableMask: false
    });

    this.pesosDialogRef.onClose.subscribe(async (res) => {
      if (res === undefined) return;

      this.pesosBrutosContenedor = res;
      this.datosCargaReporte = this.ajusteService.setPesoBrutoPorContenedor(this.datosCargaReporte, this.pesosBrutosContenedor);

      await this.setListasPrecios(this.fechasReporte);

      if (this.listasPrecios.length === 0) {
        const fechas = this.fechasReporte.map(f => formatDate(f, 'dd/MM/yyyy', 'es-UY')).join(", ");
        const mensajeAlerta = `No se encuentran listas de precios para las fechas de producción de esta carga.
                              <br><br>
                              Rango de fechas de producción: ${fechas}
                              <br><br>
                              <a href="/principal/carga/configuracionPreciosKosher" routerLink="['principal/carga/configuracionPreciosKosher]">Agregar lista de precios</a>`;
        this.mensajeAlerta(mensajeAlerta);
        return;
      }

      await this.getConfiguracionProductos();

      if (this.configProductos.length === 0) {
        const mensajeAlerta = `Parece que no hay ningún producto Kosher.
                              <br><br>
                              <a href="/principal/carga/configuracionPreciosKosher" routerLink="['principal/carga/configuracionPreciosKosher]>Ir a la configuración</a> para agregar.
                              <br><br>
                              Si el problema persiste, notifique al equipo de Sistemas.`;
        this.mensajeAlerta(mensajeAlerta);
        return;
      };

      this.setPreciosParaCodigos();

      if (this.codigosFaltantes.length > 0) {
        console.error("Códigos faltantes:", this.codigosFaltantes);
        this.mostrarCodigoPrecioFaltante();
        return;
      }

      if (this.preciosFaltantes.length > 0) {
        console.error("Precios faltantes:", this.preciosFaltantes);
        this.mostrarCodigoPrecioFaltante();
        return;
      }
      this.mostrarReporte = true;
    });
  }

  private async getConfiguracionProductos(): Promise<void> {
    try {
      this.configProductos = await lastValueFrom(this.cargaService.getConfiguracionProductosKosher());
    } catch (error) {
      this.mensajeAlerta("Error al obtener la configuración de productos. Código de error 0x211007");
    }
  }

  private setPreciosParaCodigos(): void {
    this.datosCajasPrecio = this.datosCargaReporte.map(caja => {
      const famc = this.fechaAnteriorMasCercana(caja.productiondate);
      const precio = famc ? this.precioParaCaja(caja.productcode, famc)?.precio_Tonelada ?? 0 : 0;
      const confProd = this.configProductos.find(c => c.codigoProducto === caja.productcode);
      const mark = confProd?.markKosher ?? '';
      const clasificacion = confProd?.clasificacionKosher ?? '';
      const codigoKosher = confProd?.codigoKosher ?? '';

      if (precio == 0 && !this.preciosFaltantes.some(p => p.codigo === caja.productcode && p.fecha === famc)) {
        this.preciosFaltantes.push({ codigo: caja.productcode, fecha: famc! });
      }

      if (!confProd && !this.codigosFaltantes.includes(caja.productcode)) {
        this.codigosFaltantes.push(caja.productcode);
      }

      return { ...caja, precio, mark, clasificacion, codigoKosher };
    })
      .sort((a, b) => a.id_Pallet - b.id_Pallet);;
  }


  private fechaAnteriorMasCercana(fecha: string): string | undefined {
    const fechasPrecios = Array.from(new Set(this.listasPrecios.map(l => l.fecha_Produccion)));
    const fechaEncontrada = fechasPrecios.reverse().find(f => this.esFechaMasGrande(fecha, this.commonService.formatearFecha(f)));

    return fechaEncontrada ? this.commonService.formatearFecha(fechaEncontrada) : undefined;
  }

  private esFechaMasGrande(fecha1: string, fecha2: string): boolean {
    return new Date(fecha1) >= new Date(fecha2);
  }

  private precioParaCaja(codigo: string, fecha: string): ConfPreciosDTO | undefined {
    return this.listasPrecios.find(p => p.codigo_Producto == codigo && this.commonService.formatearFecha(p.fecha_Produccion) == fecha);
  }

  private setRangoFechas(datos: DatoCargaExpo[]): string[] {
    const fechas = datos.map(d => d.productiondate).sort((a, b) => a.localeCompare(b));
    return [fechas[0], fechas[fechas.length - 1]];
  }

  private async setListasPrecios(fechas: string[]): Promise<void> {    
    const fechaFormateada = fechas[0];
    const primeraFecha = await lastValueFrom(this.cargaService.getPrimeraFechaPrecios(fechaFormateada));

    if ((primeraFecha === "")) {
      this.mensajeAlerta(`No se encuentra una lista de precios para la fecha de producción ${fechaFormateada}`);
      return;
    }
    
    this.listasPrecios = await lastValueFrom(this.cargaService.getPreciosPorFecha(primeraFecha, fechas[fechas.length - 1]));
  }

  private ajustarFecha(fecha: Date): Date { return new Date(fecha.setDate(fecha.getDate()));}
  protected clear(): void { }
  protected onCambioFecha(): void { this.nombreReporte = `Packing List ${this.fechaDesdeStr} - ${this.fechaHastaStr}` };

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleSelection(cargaId: number) {
    const index = this.selectedCargas.indexOf(cargaId);
    if (index > -1) {
      this.selectedCargas.splice(index, 1);
    } else {
      this.selectedCargas.push(cargaId);
    }
  }

  protected mensajeAlerta(mensaje: string): void {
    this.confirmationService.confirm({
      message: mensaje,
      header: 'Error',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      acceptLabel: "Aceptar",
      rejectVisible: false,
      rejectIcon: "none",
      accept: () => {
        this.messageService.add({

        })
      },
      key: 'mensajeDialog'
    });
  }

  protected mostrarCodigoPrecioFaltante(): void {
    this.dialogService.open(CodigoPrecioFaltanteComponent, {
      data: {
        noCodigos: this.codigosFaltantes,
        noPrecios: this.preciosFaltantes,
        mostrarEnlace: true
      },
      header: "Códigos y precios faltantes",
      dismissableMask: false,
      closable: true,
      closeOnEscape: false,
      width: '50vw'
    });
  }
}
