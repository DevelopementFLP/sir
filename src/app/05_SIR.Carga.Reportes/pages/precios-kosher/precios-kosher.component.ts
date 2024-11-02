import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ContainerDTO } from 'src/app/04_SIR.Exportaciones.Reportes/Interfaces/ContainerDTO.interface';
import { CargaKosherService } from 'src/app/04_SIR.Exportaciones.Reportes/services/carga-kosher.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { DatoCargaExpo } from 'src/app/04_SIR.Exportaciones.Reportes/Interfaces/DatoCargaExpo.interface';
import { PesoBrutoContenedor } from 'src/app/04_SIR.Exportaciones.Reportes/Interfaces/PesoBrutoContenedor.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CargaDTO } from 'src/app/04_SIR.Exportaciones.Reportes/Interfaces/CargaDTO.interface';
import { PesoNetoContenedorComponent } from 'src/app/04_SIR.Exportaciones.Reportes/components/peso-neto-contenedor/peso-neto-contenedor.component';
import { AjustePesoNetoService } from 'src/app/04_SIR.Exportaciones.Reportes/services/ajuste-peso-neto.service';
import { ConfPreciosDTO } from 'src/app/04_SIR.Exportaciones.Reportes/Interfaces/ConfPreciosDTO.interface';
import { RegistroConPrecio } from '../../interfaces/RegistroConPrecio.interface';
import { ConfiguracionProductoKosher } from '../../interfaces/ConfiguracionProductoKosher.interface';
import { PrecioFaltante } from '../../interfaces/PrecioFaltante.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CodigoPrecioFaltanteComponent } from 'src/app/04_SIR.Exportaciones.Reportes/components/codigo-precio-faltante/codigo-precio-faltante.component';


@Component({
  selector: 'packing-list',
  templateUrl: './precios-kosher.component.html',
  styleUrls: ['./precios-kosher.component.css'],
  providers: [ DialogService, ConfirmationService, MessageService ]
})
export class PreciosKosherComponent implements OnInit {
  fechaDesde!:        Date;
  fechaDesdeStr!:     string;
  fechasReporte:      Date[] = [];
  hoy:                Date            = new Date();
  hoyStr:             string          = this.formatearFecha(this.hoy);
  datosCarga:         DatoCargaExpo[] = [];
  datosContenedores:  ContainerDTO[]  = [];

  dropdownOpen: boolean = false;
  selectedCargas:         number[]        = [];
  mostrarReporte:         boolean         = false; 
  datosCargaReporte:      DatoCargaExpo[] = [];
  pesosBrutosContenedor:  PesoBrutoContenedor[] = [];

  pesosDialogRef!:  DynamicDialogRef;
  datoCargaDto!:    CargaDTO;
  listasPrecios:    ConfPreciosDTO[] = [];
  datosCajasPrecio: RegistroConPrecio[] = [];
  configProductos:  ConfiguracionProductoKosher[] = [];

  codigosFaltantes: string[] = [];
  preciosFaltantes: PrecioFaltante[] = [];

  nombreReporte:  string = 'Packing List';
  idReporte:      number = 10;

  constructor(
    private cargaService: CargaKosherService,
    private dialogService: DialogService,
    private ajusteService: AjustePesoNetoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  
  async ngOnInit(): Promise<void> {
    this.resetearFechas();    
  }

  private resetearFechas(): void {
    this.fechaDesde     = new Date();
    this.fechaDesdeStr  = this.formatearFecha(this.fechaDesde);
    this.fechasReporte  = [];
  }

  protected async buscarDatos(): Promise<void> {
    this.resetearDatos();
    this.fechaDesde = this.ajustarFecha(new Date(this.fechaDesdeStr)); 
    this.datosCarga = await lastValueFrom(this.cargaService.getProductosCarga(this.fechaDesde));
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
      d.productiondate = this.formatearFecha(new Date(d.productiondate));
    });

    if(this.datosCargaReporte.length > 0) {
      this.fechasReporte = this.setRangoFechas(this.datosCargaReporte);
      this.datoCargaDto = this.setDatosCarga();
      this.mostrarConfiguracionPesoBruto(this.datoCargaDto);
    }
  }

  private filtrarDatosPorContenedoresSeleccionados(): DatoCargaExpo[] {
    return this.datosCarga.filter(d => this.selectedCargas.includes(d.id_Carga));
  }

  private resetearDatos(): void {
    this.codigosFaltantes       = [];
    this.datosCarga             = [];
    this.datosCargaReporte      = [];
    this.mostrarReporte         = false;
    this.pesosBrutosContenedor  = [];
    this.selectedCargas         = [];
    this.preciosFaltantes       = [];
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
    
      if (this.listasPrecios.length === 0) return;
    
      await this.getConfiguracionProductos();
    
      if (this.configProductos.length === 0) return;
    
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
      console.error("Error al obtener la configuración de productos:", error);
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
        this.preciosFaltantes.push({codigo: caja.productcode, fecha: famc!});
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
    const fechaEncontrada = fechasPrecios.reverse().find(f => this.esFechaMasGrande(fecha, this.formatearFecha(f)));
    
    return fechaEncontrada ? this.formatearFecha(fechaEncontrada) : undefined;
  }

  private esFechaMasGrande(fecha1: string, fecha2: string): boolean {
    return new Date(fecha1) >= new Date(fecha2);
  }

  private precioParaCaja(codigo: string, fecha: string): ConfPreciosDTO | undefined {    
    return this.listasPrecios.find(p => p.codigo_Producto == codigo && this.formatearFecha(p.fecha_Produccion) == fecha);
  }

  private setRangoFechas(datos: DatoCargaExpo[]): Date[] {
    const fechas = datos.map(d => new Date(d.productiondate)).sort((a, b) => a.getTime() - b.getTime());
    return [fechas[0], fechas[fechas.length - 1]];
  }

  private async setListasPrecios(fechas: Date[]): Promise<void> {
    const fechaFormateada = this.formatearFecha(fechas[0]);
    const primeraFecha = await lastValueFrom(this.cargaService.getPrimeraFechaPrecios(fechaFormateada));
    if((primeraFecha === "")){
      console.error(`No se encuentra una lista de precios para la fecha de producción ${fechaFormateada}`);
      this.mensajeAlerta(`No se encuentra una lista de precios para la fecha de producción ${fechaFormateada}`);
      return;
    }
    
    this.listasPrecios = await lastValueFrom(this.cargaService.getPreciosPorFecha(fechaFormateada, this.formatearFecha(fechas[fechas.length - 1])));
  }

  protected onCambioFecha(): void { this.nombreReporte = `Packing List ${this.fechaDesdeStr}` };
  protected clear(): void {}
  
  private formatearFecha(fecha: Date): string {
    let f = new Date(fecha);
    return formatDate(
      f.setHours(f.getHours() + 3),
      'yyyy-MM-dd',
      'es-UY'
    );
  }

  private ajustarFecha(fecha: Date): Date {
    return new Date(fecha.setDate(fecha.getDate() + 1));
  }

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
        noPrecios: this.preciosFaltantes
      },
      header: "Códigos y precios faltantes",
      dismissableMask: false,
      closable: true,
      closeOnEscape: false,
      width: '50vw'
    });
  }
}
