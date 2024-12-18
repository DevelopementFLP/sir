import { AddCodigosComponent } from '../add-codigos/add-codigos.component';
import { AdminPreciosComponent } from '../admin-precios/admin-precios.component';
import { CargaDTO } from '../../Interfaces/CargaDTO.interface';
import { CargaKosherService } from '../../services/carga-kosher.service';
import { CommonService } from 'src/app/shared/services/common.service';
import {
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ConfirmationService,
  Message,
  MessageService,
  SortEvent,
  SortMeta,
} from 'primeng/api';
import { ConfMoneda } from '../../Interfaces/ConfMoneda.interface';
import { ConfPreciosDTO } from '../../Interfaces/ConfPreciosDTO.interface';
import { ConfProducto } from '../../Interfaces/ConfProducto.interface';
import { ContainerDTO } from '../../Interfaces/ContainerDTO.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DWCajaCarga } from '../../Interfaces/DWCajaCarga.interface';
import { DWContainer } from '../../Interfaces/DWContainer.interface';
import { formatDate } from '@angular/common';
import { KosherCommonService } from '../../services/kosher-common.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { MultiSelect } from 'primeng/multiselect';
import { TabView } from 'primeng/tabview';
import { SessionManagerService } from 'src/app/shared/services/session-manager.service';
import { Usuario } from 'src/app/52_SIR.ControlUsuarios/models/usuario.interface';
import { CodigoPrecio } from '../../Interfaces/CodigoPrecio.interface';
import { Table } from 'primeng/table';
import { CodigoFechaPrecio } from '../../Interfaces/CodigoFechaPrecio.interface';
import { NuevoPrecioComponent } from '../nuevo-precio/nuevo-precio.component';
import { PesoBrutoContenedor } from '../../Interfaces/PesoBrutoContenedor.interface';
import { PesoNetoContenedorComponent } from '../peso-neto-contenedor/peso-neto-contenedor.component';
import { DatoCargaExpo } from '../../Interfaces/DatoCargaExpo.interface';
import { ConfPrecios } from '../../Interfaces/ConfPrecios.interface';

interface ContainerOptions {
  label: string;
  value: ContainerDTO[];
}

interface FechasExtremos {
  fechaMinima: Date;
  fechaMaxima: Date;
}

@Component({
  selector: 'config-precios',
  templateUrl: './config-precios.component.html',
  styleUrls: ['./config-precios.component.css'],
  providers: [DialogService, MessageService, ConfirmationService],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigPreciosComponent implements OnInit, OnDestroy {
  private mustReset: Subscription | null = null;

  //#region Atributos
  @Output() getCodigosKosher = new EventEmitter<ConfProducto[]>();
  @Output() getCodigosPrecio = new EventEmitter<ConfPreciosDTO[]>();
  @Output() getDatosCarga = new EventEmitter<CargaDTO>();
  @Output() habilitarReporte = new EventEmitter<boolean>();
  @Output() pesosContenedoresEmmiter = new EventEmitter<PesoBrutoContenedor[]>();

  @ViewChild('multiselect', { static: false }) multiSelect!: MultiSelect;
  @ViewChild('tabView', { static: false }) tabView!: TabView;
  @ViewChild('txtIdCarga', { static: false }) txtIdCarga!: HTMLInputElement;

  nuevoPrecioRef!: DynamicDialogRef;
  addCodigosRef!: DynamicDialogRef;
  adminPreciosRef!: DynamicDialogRef;
  codigosClonados: { [s: string]: ConfProducto } = {};
  confProductos: ConfProducto[] | undefined = [];
  confProductosOriginal: ConfProducto[] | undefined = [];
  containers: ContainerDTO[] | undefined = [];
  containersOriginal: ContainerDTO[] | undefined = [];
  dataContainers: DWContainer[] | undefined = [];
  datosCajas: DWCajaCarga[] = [];

  codigos: string[] = [];
  containersOptions: ContainerOptions[] = [];
  fechas: Date[] = [];
  fechasPrecios: Date[] | undefined = [];
  listasPrecios: ConfPreciosDTO[][] | undefined = [];
  precios: ConfPreciosDTO[] | undefined = [];
  productosConPrecio: ConfPreciosDTO[] | undefined = [];
  rangoFechas!: FechasExtremos;
  selectedContainers: ContainerOptions[] = [];
  tiposMoneda: ConfMoneda[] | undefined = [];

  idCarga: number[] = [];
  idCargaString: string = '';

  canAddAndDelete: boolean = true;
  isEditing: boolean = false;
  isPrecioEditing: boolean = false;
  mostrarNoIdCarga: boolean = false;
  mostrarPrecios: boolean = false;
  mostrarSeleccionContenedores: boolean = false;
  mostrarPrecioYCodigos: boolean = true;

  iconoButtonConfirmar: string = 'pi pi-question';
  mensaje: Message[] = [
    {
      severity: 'error',
      summary: 'Sin datos',
      detail: 'No hay contenedores para el identificador de carga ingresado.',
    },
  ];
  mensajeFechaCarga: Message[] = [];
  mensajeNoPrecios: Message[] = [
    {
      severity: 'error',
      summary: 'Sin precios',
      detail:
        "No hay precios asociados al rango de fechas de producción. Haga clic en <span class='admin__text'>Administrar listas de precios</span> para agregarlos.",
    },
  ];
  mensajeRangoFechas: Message[] = [];
  txtButtonConfirmarPrecios: string = 'Confirmar estos precios y códigos';

  clasificacionKosher: string[] = [];
  codigosKosher: string[] = [];
  especie: string[] = [];
  markKosher: string[] = [];
  tipoProducto: string[] = [];

  clasificacionKosherOptions!: any[];
  codigosKosherOptions!: any[];
  especieOptions!: any[];
  markKosherOptions!: any[];
  tipoProductoOptions!: any[];

  esUsuarioCarga: boolean = false;
  esUsuarioExpo: boolean = false;

  codigoPrecios: CodigoPrecio[] | undefined = [];
  codigoPreciosOriginal: CodigoPrecio[] | undefined = [];
  codigosPreciosClonados: { [s: string]: CodigoPrecio } = {};

  pesosContenedores: PesoBrutoContenedor[] = [];
  pesosDialogRef!: DynamicDialogRef;
  pesosCargador: boolean = false;

  idUsuario: number = 0;
  isDialogOpen: boolean = false;
  //#endregion

  //#region constructor
  constructor(
    private cargaService: CargaKosherService,
    private dialogService: DialogService,
    private cs: CommonService,
    private ckcs: KosherCommonService,
    private sms: SessionManagerService
  ) {}
  //#endregion

  //#region onInit
  async ngOnInit(): Promise<void> {
    this.checkUser();
    this.resetearFechas();
    
    await Promise.all([
      this.getContainers(),
      this.mapContainerOptions(),
      this.getTiposMoneda(),
      this.getConfProductos(),
      this.getCodigosConPrecio()
    ]);

    this.mustReset = this.ckcs.reset$.subscribe(() => {
      this.procederConReporte(false);
      this.dataContainers = [];
      this.datosCajas = [];
      this.txtButtonConfirmarPrecios = 'Confirmar precios y códigos';
      this.iconoButtonConfirmar = 'pi pi-question';
      this.mostrarPrecioYCodigos = true;
    });

    this.prepararData();
  }
  //#endregion

  private checkUser(): void {
    var id: string = '';
    var usuarioStr: string | null = this.sms.getCurrentUser();

    if (usuarioStr) {
      const usuario: Usuario = this.sms.parseUsuario(usuarioStr);
      if (usuario.id_perfil == 3) this.esUsuarioExpo = true;
      else if (usuario.id_perfil == 5) this.esUsuarioCarga = true;
      else {
        this.esUsuarioCarga = false;
        this.esUsuarioExpo = false;
      }
      id = usuario.id_usuario.toString();
      this.idUsuario = usuario.id_usuario;
    }
  }

  //#region onDestroy
  ngOnDestroy(): void {
    this.destroyDialog(this.adminPreciosRef);
    this.destroyDialog(this.addCodigosRef);
    this.destroyDialog(this.nuevoPrecioRef);
    this.destroyDialog(this.pesosDialogRef);
  }

  private destroyDialog(dialog: DynamicDialogRef): void {
    if (dialog) {
      dialog.close();
      dialog.destroy();
    }
  }
  //#endregion

  //#region Obtener datos de contenedores
  filterContainersByIdCarga(): void {
    this.idCarga = [];
    this.containers = this.cs.deepCopy(this.containersOriginal);
    if (this.idCargaString != '') {
      var idCargaStringCopy = this.idCargaString;
      idCargaStringCopy = idCargaStringCopy.replaceAll(' ', '');
      const ids = idCargaStringCopy.split(',');
      ids.forEach((id) => {
        if (this.cs.isNumber(id)) this.idCarga.push(parseInt(id));
      });
      this.containers = this.containers?.filter((c) =>
        this.idCarga.includes(c.id_Carga)
      );
      this.mostrarSeleccionContenedores = this.containers!?.length > 0;
      this.selectedContainers = [];
      this.mostrarNoIdCarga = this.containers!?.length == 0;
    } else {
      this.mostrarNoIdCarga = true;
      this.mostrarSeleccionContenedores = false;
    }

    this.mapContainerOptions();
  }

  private async getContainers(): Promise<void> {
    this.containers = await lastValueFrom(this.cargaService.getContainers());
    this.containersOriginal = this.cs.deepCopy(this.containers);
  }

  private mapContainerOptions(): void {
    this.containersOptions = this.containers!.map((container) => ({
      label: container.container,
      value: [container],
    }));
  }
  //#endregion

  //#region Tipos de moneda
  private async getTiposMoneda(): Promise<void> {
    try {
      this.tiposMoneda = await lastValueFrom(
        this.cargaService.getTiposMoneda()
      );
    } catch (error) {
      console.error(error);
    }
  }
  //#endregion

  //#region Obtener fechas de listas de precios
  private async getFechasListasPrecios(): Promise<void> {
    this.fechas = await lastValueFrom(
      this.cargaService.getFechasListasPrecios()
    );
  }
  //#endregion

  //#region Filtrar datos por contenedor
  async getDataByContainers(): Promise<void> {
    this.dataContainers = await lastValueFrom(
      this.cargaService.getDataByContainer(
        this.idCarga,
        this.setContainersQuery()
      )
    );
    this.mostrarPrecios = true;
    if (this.mostrarPrecios) {
      await this.getCodigosConPrecio();
      var datosCarga: CargaDTO = {
        idCarga: this.idCarga,
        contenedores: this.setContainersQuery(),
      };
      this.getDatosCarga.emit(datosCarga);

      this.mostrarConfiguracionPesoBruto(datosCarga);
    }
  }

  private mostrarConfiguracionPesoBruto(datosCarga: CargaDTO): void {
    this.pesosDialogRef = this.dialogService.open(PesoNetoContenedorComponent, {
      data: {
        contenedores: datosCarga.contenedores,
      },
      header: 'Peso bruto por contenedor',
      width: '50vw',
      closable: true,
      closeOnEscape: false,
      dismissableMask: false,
    });

    this.pesosDialogRef.onClose.subscribe((res) => {
      this.isDialogOpen = false;
      if (res != undefined) {
        this.pesosContenedores = res;
        this.todoListo(this.pesosContenedores);
      }
    });
  }

  private setContainersQuery(): string {
    let containers = this.selectedContainers
      .map((cont) => cont.label)
      .join(',');
    return containers;
  }

  private async getCodigosConPrecio(): Promise<void> {
    this.precios = await lastValueFrom(this.cargaService.getPrecios());
    this.setListasPrecios();
    this.getCodigos();
    this.setCodigoPrecios();
  }

  private setListasPrecios(): void {
    this.fechasPrecios =
      Array.from(new Set(this.precios!.map((p) => p.fecha_Produccion))) ??
      undefined;
  }

  private getCodigos(): void {
    this.codigos = Array.from(
      new Set(this.precios?.map((p) => p.codigo_Producto))
    ).sort((a, b) => {
      if (a < b) return -1;
      if (a == b) return 0;
      return 1;
    });
  }

  private setCodigoPrecios(): void {
    this.codigoPrecios = [];
    this.codigos.forEach((codigo) => {
      var cP: CodigoPrecio = {
        codigo: codigo,
        precios: this.getPreciosPorFechas(codigo),
      };

      this.codigoPrecios!.push(cP);
    });

    this.codigoPreciosOriginal = this.cs.deepCopy(this.codigoPrecios);
  }
  //#endregion

  //#region Precios
  private getPreciosPorFechas(codigo: string): number[] {
    var precios: number[] = [];

    this.fechasPrecios!.forEach((fecha) => {
      precios.push(this.getPrecioPorCodigoYFecha(codigo, fecha));
    });

    return precios;
  }

  getPrecioPorCodigoYFecha(codigo: string, fecha: Date): number {
    var precio = this.precios?.find(
      (p) => p.codigo_Producto == codigo && p.fecha_Produccion == fecha
    );
    if (precio) return precio.precio_Tonelada;
    return 0;
  }

  getIdMonedaPorFecha(fecha: Date): number {
    var pr = this.precios?.find((p) => p.fecha_Produccion == fecha);
    if (pr) {
      var mnd = this.tiposMoneda?.find((m) => m.id == pr?.id_Moneda);
      if (mnd) return mnd.id;
    }
    return 0;
  }

  getTipoMonedaPorFecha(fecha: Date): string {
    var pr = this.precios?.find((p) => p.fecha_Produccion == fecha);
    if (pr) {
      var mnd = this.tiposMoneda?.find((m) => m.id == pr?.id_Moneda);
      if (mnd) return mnd.codigo;
    }
    return '';
  }

  adminPrecios(): void {
    this.adminPreciosRef = this.dialogService.open(AdminPreciosComponent, {
      data: {
        todasLasFechas: this.fechas,
        fechas: this.fechasPrecios,
        monedas: this.tiposMoneda,
      },
      header: 'Administrar listas de precios',
      width: '50vw',
      closable: true,
      closeOnEscape: false,
      dismissableMask: false,
    });

    this.adminPreciosRef.onClose.subscribe(async (result: any) => {
      this.isDialogOpen = false;
      if (result !== undefined) {
        try {
          // await this.getCodigosConPrecio();
          // await this.getFechasListasPrecios();
          await this.ngOnInit();
        } catch (error) {
          console.error('ERROR: ', error);
        }
      }
    });
  }

  addPrecio(): void {
    this.nuevoPrecioRef = this.dialogService.open(NuevoPrecioComponent, {
      data: {
        monedas: this.tiposMoneda,
      },
      header: 'Agregar precios y códigos',
      width: '80vw',
      height: '70vh',
      closable: true,
      closeOnEscape: false,
      dismissableMask: false,
    });

    this.nuevoPrecioRef.onClose.subscribe(async (result: any) => {
      this.isDialogOpen = false;
      if (result != undefined) {
        await this.getCodigosConPrecio();
      }
    });
  }
  //#endregion

  //#region Funciones auxiliares
  private getUrl(): string {
    return window.location.href;
  }

  esDetalle(): boolean {
    return this.getUrl().includes('exportaciones/detalleEmbarque');
  }

  esPrecios(): boolean {
    return this.getUrl().includes('carga/configuracionPreciosKosher');
  }

  clear(): void {
    this.procederConReporte(false);
    this.dataContainers = [];
    this.mostrarPrecios = false;
    this.precios = [];
    this.datosCajas = [];
    this.txtButtonConfirmarPrecios = 'Confirmar precios y códigos';
    this.iconoButtonConfirmar = 'pi pi-question';
    this.mostrarPrecioYCodigos = true;
    this.idCarga = [];
    this.idCargaString = '';
    this.mostrarSeleccionContenedores = false;
  }

  private procederConReporte(value: boolean): void {
    this.habilitarReporte.emit(value);
  }

  todoListo(pesosContenedores: PesoBrutoContenedor[]): void {
    if (pesosContenedores.length > 0) {
      this.procederConReporte(true);
      this.pesosContenedoresEmmiter.emit(pesosContenedores);
      this.getCodigosPrecio.emit(this.precios);
      this.txtButtonConfirmarPrecios = 'Precios y códigos confirmados!';
      this.iconoButtonConfirmar = 'pi pi-check';
      this.mostrarPrecioYCodigos = false;
    }
  }
  //#endregion

  //#region ConfProductos
  private setPropiedadesConfProductos(): void {
    this.codigosKosher = this.ordenarArray(
      Array.from(new Set(this.confProductos?.map((cp) => cp.codigoKosher!)))
    );
    this.clasificacionKosher = this.ordenarArray(
      Array.from(
        new Set(this.confProductos?.map((cp) => cp.clasificacionKosher!))
      )
    );

    this.markKosher = this.ordenarArray(
      Array.from(new Set(this.confProductos?.map((cp) => cp.markKosher!)))
    );
    this.markKosher = this.markKosher.map((m) => (m == null ? '' : m));
    this.markKosher = Array.from(new Set(this.markKosher.map((m) => m)));

    this.especie = this.ordenarArray(
      Array.from(new Set(this.confProductos?.map((cp) => cp.especie!)))
    );
    this.tipoProducto = this.ordenarArray(
      Array.from(new Set(this.confProductos?.map((cp) => cp.tipoProducto!)))
    );
    this.codigosKosherOptions = this.codigosKosher.map((ck) => ({
      label: ck,
      value: ck,
    }));
    this.clasificacionKosherOptions = this.clasificacionKosher.map((ck) => ({
      label: ck,
      value: ck,
    }));
    this.markKosherOptions = this.markKosher.map((ck) => ({
      label: ck,
      value: ck,
    }));
    this.especieOptions = this.especie.map((ck) => ({ label: ck, value: ck }));
    this.tipoProductoOptions = this.tipoProducto.map((ck) => ({
      label: ck,
      value: ck,
    }));
  }

  private async getConfProductos(): Promise<void> {
    await lastValueFrom(this.cargaService.getConfProductos())
      .then((result) => {
        this.confProductos = result;
        this.confProductos = this.eliminarDuplicados(
          this.confProductos!,
          'codigoProducto'
        );
        this.setPropiedadesConfProductos();
        this.ckcs.setConfProductos(this.confProductos);
        this.confProductosOriginal = this.cs.deepCopy(this.confProductos);
      })
      .catch((error) => {
        console.log(error);
      });      
  }

  private ordenarArray(array: string[]): string[] {
    array.sort((a, b) => {
      if (a <= b) return -1;
      return 1;
    });
    return array;
  }

  eliminarDuplicados = (arr: ConfProducto[], key: string): ConfProducto[] => {
    const seen = new Set<string>();
    return arr.filter((item) => {
      const duplicado = seen.has(item.codigoProducto);
      seen.add(item.codigoProducto);
      return !duplicado;
    });
  };

  getNewConfProductos(event: ConfProducto[]) {
    this.ckcs.setConfProductos(event);
  }
  //#endregion

  //#region Add
  agregarCodigos(): void {
    this.addCodigosRef = this.dialogService.open(AddCodigosComponent, {
      data: {
        codigosKosher: this.codigosKosher,
        clasificacionKosher: this.clasificacionKosher,
        markKosher: this.markKosher,
        especie: this.especie,
        tipoProducto: this.tipoProducto,
        codigos: Array.from(
          new Set(this.confProductos?.map((cp) => cp.codigoProducto))
        ),
      },
      header: 'Agregar códigos',
      width: '90vw',
      height: '80vh',
      closable: true,
      closeOnEscape: false,
      dismissableMask: false,
    });

    this.addCodigosRef.onClose.subscribe(async (result: any) => {
      this.isDialogOpen = false;
      await this.getConfProductos();
    });
  }
  //#endregion

  //#region Edit
  onRowEditInit(producto: ConfProducto): void {
    this.codigosClonados[producto.codigoProducto as string] = { ...producto };
  }

  onRowEditSave(producto: ConfProducto): void {
    delete this.codigosClonados[producto.codigoProducto];
    this.codigosClonados[producto.codigoProducto as string] = { ...producto };
    this.isEditing = true;
  }

  onRowEditCancel(producto: ConfProducto, index: number): void {
    this.deleteProducto(producto, index);
  }

  async guardarCambios(): Promise<void> {
    if (Object.keys(this.codigosClonados).length === 0) return;
    const codigosActualizar: ConfProducto[] = Object.values(this.codigosClonados);
    try {
      await lastValueFrom(this.cargaService.updateConfProductos(codigosActualizar));
      await this.getConfProductos();
      this.isEditing = false;
    } catch (error) {
      console.error("Error al actualizar los productos:", error);
    }
  }
  

  cancelarCambios(): void {
    for (let producto in this.codigosClonados) {
      const prod = this.buscarProductoPorCodigo(producto);
      if (prod) {
        const i =
          this.confProductos?.indexOf(
            this.confProductos.find(
              (c) => c.codigoProducto == prod.codigoProducto
            )!
          ) ?? -1;
        if (i >= 0) {
          this.deleteProducto(prod, i);
        }
      }
    }
    this.confProductos = this.cs.deepCopy(this.confProductosOriginal);
    this.isEditing = false;
  }

  private deleteProducto(producto: ConfProducto, index: number): void {
    this.confProductos![index] = this.codigosClonados[producto.codigoProducto];
    delete this.codigosClonados[producto.codigoProducto];
  }

  private buscarProductoPorCodigo(codigo: string): ConfProducto | null {
    if (this.codigosClonados.hasOwnProperty(codigo.toString()))
      return this.codigosClonados[codigo];

    return null;
  }
  //#endregion

  //#region SortTable
  sortField!: string;
  sortOrder!: number;
  multiSortMeta: SortMeta[] = [];

  fechaIndex(index: number): string {
    return `precios_${index}`;
  }

  onSort(event: SortEvent) {
    const field = event.field;
    const order = event.order;

    if (field && field.startsWith('precios_')) {
      const index = this.extractIndexFromField(field);

      const sortedArray = [...this.codigoPrecios!].sort((a, b) => {
        const val1 = a.precios[index];
        const val2 = b.precios[index];

        if (val1 == null && val2 == null) return 0;
        if (val1 == null) return order === 1 ? -1 : 1;
        if (val2 == null) return order === 1 ? 1 : -1;

        return (val1 > val2 ? 1 : val1 < val2 ? -1 : 0) * order!;
      });

      this.codigoPrecios = sortedArray;
    }
  }

  extractIndexFromField(field: string): number {
    return parseInt(field.split('_')[1], 10);
  }
  //#endregion

  //#region Search
  @ViewChild('dt2') table!: Table;

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input?.value ?? '';
    this.table.filterGlobal(value, 'contains');
  }
  //#endregion

  //#region NUEVO
  dropdownOpen: boolean = false;
  selectedCargas: number[] = [];
  datosContenedores: ContainerDTO[] = [];
  fechaDesde!: Date;
  fechaDesdeStr!: string;
  hoy: Date = new Date();
  hoyStr: string = this.formatearFecha(this.hoy);
  datosCarga: DatoCargaExpo[] = [];
  datosCargaReporte: DatoCargaExpo[] = [];
  datoCargaDto!:    CargaDTO;

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

  protected async hacerReporte(): Promise<void> {
    this.datosCargaReporte = this.filtrarDatosPorContenedoresSeleccionados();

    if (this.datosCargaReporte.length > 0) {
      this.datosCargaReporte.forEach((d) => {
        d.productiondate = this.formatearFecha(new Date(d.productiondate));
      });

      this.mostrarPrecios = true;
      if (this.mostrarPrecios) {
        await this.getCodigosConPrecio();
       
        this.datoCargaDto = this.setDatosCarga();
        this.getDatosCarga.emit(this.datoCargaDto);

        this.mostrarConfiguracionPesoBruto(this.datoCargaDto);
      }
    }
  }

  mostrarSeleccion: boolean = false;

  protected async buscarDatos(): Promise<void> {
    this.resetearDatos();
    this.fechaDesde = this.ajustarFecha(new Date(this.fechaDesdeStr));
    this.datosCarga = await lastValueFrom(
      this.cargaService.getProductosCarga(this.fechaDesde)
    );
   
    this.mostrarPrecios = this.datosCarga.length > 0;
    
    this.obtenerIdsCargaYNombresContenedores();
  }

  protected onCambioFecha(): void {}
  private formatearFecha(fecha: Date): string {
    let f = new Date(fecha);
    return formatDate(f.setHours(f.getHours() + 3), 'yyyy-MM-dd', 'es-UY');
  }

  private resetearFechas(): void {
    this.fechaDesde = new Date();
    this.fechaDesdeStr = this.formatearFecha(this.fechaDesde);
  }

  private resetearDatos(): void {
    this.datosCarga             = [];
    this.datosCargaReporte      = [];
    this.selectedCargas         = [];
    this.mostrarSeleccion = false;
  }

  private ajustarFecha(fecha: Date): Date {
    return new Date(fecha.setDate(fecha.getDate() + 1));
  }

  private obtenerIdsCargaYNombresContenedores(): void {
    const idsCarga = Array.from(
      new Set(this.datosCarga.map((d) => d.id_Carga))
    ).sort((a, b) => a - b);
    this.datosContenedores = idsCarga
      .map((id) => ({
        id_Carga: id,
        container:
          this.datosCarga.find((dc) => dc.id_Carga === id)?.container || '',
      }))
      .filter((c) => c.container)
      .sort((a, b) => a.container.localeCompare(b.container));
  }

  private filtrarDatosPorContenedoresSeleccionados(): DatoCargaExpo[] {
    return this.datosCarga.filter((d) =>
      this.selectedCargas.includes(d.id_Carga)
    );
  }

  private setDatosCarga(): CargaDTO {
    const contenedores = this.datosContenedores
      .filter(d => this.selectedCargas.includes(d.id_Carga))
      .map(d => d.container)
      .join(',');
    
    return { idCarga: this.selectedCargas, contenedores };
  }

  protected async reiniciar(): Promise<void> {
    window.location.reload();
  }

  //#endregion


  //#region PRECIOS NUEVO FORMATO
  productos: string[] = [];
  fechasUnicas: Date[] = [];
  matrizPrecios: number[][] = [];
  codigoFiltro: string = '';
  filtroConPrecioCero: boolean = false;
  productosFiltrados: string[] = [];
  productoSeleccionado: string | null = null;
  preciosSeleccionados: number[] = [];

  private prepararData(): void {
    const fechasUnicasSet = new Set<Date>();
    const productosSet = new Set<string>();
    
    this.precios?.forEach(p => {
      fechasUnicasSet.add(p.fecha_Produccion);
      productosSet.add(p.codigo_Producto);
    });

    //* Obtener fechas únicas
    this.fechasUnicas = Array.from(fechasUnicasSet).sort((a, b) => +a - +b);
    
    //* Obtener productos únicos
    this.productos = Array.from(productosSet);

    //* Inicializa la matriz de precios
    this.matrizPrecios = Array.from({length: this.productos.length}, () => Array(this.fechasUnicas.length).fill(0));

    //* Llenar la matriz de precios
    this.precios?.forEach(p => {
      const productoIndex = this.productos.indexOf(p.codigo_Producto);
      const fechaIndex = this.fechasUnicas.indexOf(p.fecha_Produccion);
      if(productoIndex !== -1 && fechaIndex != -1)
        this.matrizPrecios[productoIndex][fechaIndex] = p.precio_Tonelada;
    });

    //* Inicializar productos filtrados
    this.productosFiltrados = this.productos;
  }

  protected filtrarProductos() {
    this.productosFiltrados = this.productos.filter((producto) => {
      const precios = this.matrizPrecios[this.productos.indexOf(producto)];
      const tienePrecioCero = precios.some(precio => precio === 0);
      const cumpleFiltroCodigo = producto.includes(this.codigoFiltro);
      const cumpleFiltroPrecioCero = this.filtroConPrecioCero ? tienePrecioCero : true;
  
      return cumpleFiltroCodigo && cumpleFiltroPrecioCero;
    });
  }

  protected editarPrecio(producto: string): void {
    const index = this.productos.indexOf(producto);
    if(index !== -1) {
      this.productoSeleccionado = producto;
      this.preciosSeleccionados = this.matrizPrecios[index];
    }
  }

  protected async onPreciosActualizados(event: { producto: string; preciosViejos: number[]; preciosNuevos: number[] }): Promise<void> {
    const index = this.productos.indexOf(event.producto);
  
    if (index !== -1) {
      this.matrizPrecios[index] = event.preciosNuevos;
  
      const editar: CodigoFechaPrecio[] = [];
      const insertar: ConfPrecios[] = [];
  
      this.fechasUnicas.forEach((fecha, i) => {
        const [precioViejo, precioNuevo] = [event.preciosViejos[i], event.preciosNuevos[i]];
  
        if (precioViejo === 0 && precioNuevo !== 0) {
          insertar.push({
            codigo_Producto: event.producto,
            fecha_Produccion: fecha,
            fecha_Registro: new Date(),
            id_Moneda: this.getIdMonedaPorFecha(fecha),
            id_Usuario: this.idUsuario,
            precio_Tonelada: precioNuevo
          });
        } 
        else if (precioViejo !== 0 && precioNuevo !== precioViejo) {
          editar.push({
            codigo: event.producto,
            fechaProduccion: fecha,
            precio: precioNuevo
          });
        }
      });
  
      await Promise.all([
        lastValueFrom(this.cargaService.updateCodigoPrecio(editar)),
        lastValueFrom(this.cargaService.insertarListaPrecios(insertar))
      ]);
    }

    this.cerrarEdicion();
  }

  private cerrarEdicion() {
    this.productoSeleccionado = null;
    this.preciosSeleccionados = [];
  }

  protected onCerrarEdicion(): void {
    this.cerrarEdicion();
  }
  //#endregion
  
}
