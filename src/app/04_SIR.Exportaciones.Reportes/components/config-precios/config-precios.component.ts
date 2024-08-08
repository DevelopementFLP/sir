import { AddCodigosComponent } from '../add-codigos/add-codigos.component';
import { AdminPreciosComponent } from '../admin-precios/admin-precios.component';
import { CargaDTO } from '../../Interfaces/CargaDTO.interface';
import { CargaKosherService } from '../../services/carga-kosher.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Component, EventEmitter,OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { ConfMoneda } from '../../Interfaces/ConfMoneda.interface';
import { ConfPreciosDTO } from '../../Interfaces/ConfPreciosDTO.interface';
import { ConfProducto } from '../../Interfaces/ConfProducto.interface';
import { ContainerDTO } from '../../Interfaces/ContainerDTO.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DWCajaCarga } from '../../Interfaces/DWCajaCarga.interface';
import { DWContainer } from '../../Interfaces/DWContainer.interface';
import { formatDate } from '@angular/common';
import { KosherCommonService } from '../../services/kosher-common.service';
import { ArgumentOutOfRangeError, lastValueFrom, Subscription } from 'rxjs';
import { MultiSelect } from 'primeng/multiselect';
import { TabView } from 'primeng/tabview';

interface ContainerOptions {
  label: string, value: ContainerDTO[]
}

interface FechasExtremos {
  fechaMinima: Date,
  fechaMaxima: Date
}

@Component({
  selector: 'config-precios',
  templateUrl: './config-precios.component.html',
  styleUrls: ['./config-precios.component.css'],
  providers: [DialogService, MessageService, ConfirmationService],
  encapsulation: ViewEncapsulation.None
})
export class ConfigPreciosComponent implements OnInit, OnDestroy {

  private mustReset: Subscription | null = null;

  //#region Atributos
  @Output() getCodigosKosher = new EventEmitter<ConfProducto[]>();
  @Output() getCodigosPrecio = new EventEmitter<ConfPreciosDTO[]>();
  @Output() getDatosCarga = new EventEmitter<CargaDTO>();
  @Output() habilitarReporte = new EventEmitter<boolean>();

  @ViewChild('multiselect', {static: false}) multiSelect!: MultiSelect;
  @ViewChild('tabView', {static: false}) tabView!: TabView;
  @ViewChild('txtIdCarga', {static: false}) txtIdCarga!: HTMLInputElement;

  addCodigosRef!: DynamicDialogRef;
  adminPreciosRef! : DynamicDialogRef;
  codigosClonados: { [s: string]: ConfProducto } = {}
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
  mostrarNoIdCarga: boolean = false;
  mostrarPrecios: boolean = false;
  mostrarSeleccionContenedores: boolean = false;
  mostrarPrecioYCodigos: boolean = true;

  iconoButtonConfirmar: string = 'pi pi-question';
  mensaje: Message[] = [{ severity: 'error', summary: 'Sin datos', detail:"No hay contenedores para el identificador de carga ingresado." }];
  mensajeFechaCarga: Message[] = [];
  mensajeNoPrecios: Message[] = [{ severity: 'error', summary: 'Sin precios', detail:"No hay precios asociados al rango de fechas de producción. Haga clic en <span class='admin__text'>Administrar listas de precios</span> para agregarlos." }];
  mensajeRangoFechas: Message[] = [];
  txtButtonConfirmarPrecios: string = 'Confirmar estos precios y códigos';

  clasificacionKosher: string[] = [];
  codigosKosher: string[] = [];
  especie: string[] = []
  markKosher: string[] = [];
  tipoProducto: string[] = [];

  clasificacionKosherOptions!: any[];
  codigosKosherOptions!: any[];
  especieOptions!: any[];
  markKosherOptions!: any[];
  tipoProductoOptions!: any[];
 //#endregion
  
  //#region constructor
 constructor(
    private cargaKosherSrv: CargaKosherService,
    private dialogService: DialogService,
    private cs: CommonService,
    private ckcs: KosherCommonService
  ) {}
  //#endregion
  
  //#region onInit
  async ngOnInit(): Promise<void> {
    await this.getContainers();
    await this.mapContainerOptions();
    await this.getTiposMoneda();
    await this.getConfProductos();

    this.mustReset = this.ckcs.reset$.subscribe(() => {
      this.procederConReporte(false);
      this.dataContainers = []; 
      //this.mostrarPrecios = false;
      //this.precios = [];
      this.datosCajas = [];
      this.txtButtonConfirmarPrecios = "Confirmar estos precios y códigos";
      this.iconoButtonConfirmar = 'pi pi-question';
      this.mostrarPrecioYCodigos = true;
      //this.idCarga = [];
      //this.idCargaString = '';
      //this.mostrarSeleccionContenedores = false;
    });
  }
  //#endregion 

  //#region onDestroy
  ngOnDestroy(): void {
    if(this.adminPreciosRef) {
      this.adminPreciosRef.close();
      this.adminPreciosRef.destroy();
    }

    if(this.addCodigosRef) {
      this.addCodigosRef.close();
      this.addCodigosRef.destroy();
    }
  }
  //#endregion

  //#region Obtener datos de contenedores
  filterContainersByIdCarga(): void {
    this.idCarga = [];  
    this.containers = this.cs.deepCopy(this.containersOriginal);
    if(this.idCargaString != '') {
      var idCargaStringCopy = this.idCargaString;
      idCargaStringCopy = idCargaStringCopy.replaceAll(' ', '');
      const ids = idCargaStringCopy.split(",");
      ids.forEach(id => {
        if(this.cs.isNumber(id))
          this.idCarga.push(parseInt(id));
      });
      this.containers = this.containers?.filter(c => this.idCarga.includes(c.id_Carga));    
      this.mostrarSeleccionContenedores = this.containers!?.length > 0;
      this.selectedContainers = [];
      this.mostrarNoIdCarga = this.containers!?.length == 0;
    }
    else {
      this.mostrarNoIdCarga = true;
      this.mostrarSeleccionContenedores = false;
    }

    this.mapContainerOptions();
  }

  private async getContainers(): Promise<void> {
    this.containers = await lastValueFrom(this.cargaKosherSrv.getContainers());
    this.containersOriginal = this.cs.deepCopy(this.containers);
  }

  private mapContainerOptions(): void {
    this.containersOptions = this.containers!.map(container => ({
      label: container.container,
      value: [container]
    }));
  }
//#endregion

  //#region Tipos de moneda
  private async getTiposMoneda(): Promise<void> {
    try
    {
      this.tiposMoneda = await lastValueFrom(this.cargaKosherSrv.getTiposMoneda());
    } catch(error) {
      console.error(error);
    }
  }
  //#endregion
  
  //#region Obtener fechas de listas de precios
   private async getFechasListasPrecios(): Promise<void> {
    this.fechas = await lastValueFrom(this.cargaKosherSrv.getFechasListasPrecios());
  }
  //#endregion
  
  //#region Filtrar datos por contenedor
  async getDataByContainers(): Promise<void> {
    this.dataContainers = await lastValueFrom(this.cargaKosherSrv.getDataByContainer(this.idCarga, this.setContainersQuery()));
    this.datosCajas = await lastValueFrom(this.cargaKosherSrv.getCajasCarga(this.idCarga, this.setContainersQuery()));
    this.getRangoFechasProduccion();
    this.mostrarPrecios = this.dataContainers!?.length > 0;
    if(this.mostrarPrecios) {
      await this.getCodigosConPrecio();
      var datosCarga: CargaDTO = {
        idCarga: this.idCarga,
        contenedores: this.setContainersQuery()
      };
      this.getDatosCarga.emit(datosCarga);
    }
  } 
  
  private setContainersQuery(): string {
    let containers = this.selectedContainers.map(cont => cont.label).join(',');
    return containers;
  }

  private getRangoFechasProduccion(): void {
    var fechasE: FechasExtremos = { 
      fechaMinima: this.datosCajas?.reduce((min, d) => d.fechaCorrida! <= min! ? d.fechaCorrida! : min, this.datosCajas[0].fechaCorrida)!,
      fechaMaxima: this.datosCajas?.reduce((max, d) => d.fechaCorrida! >= max! ? d.fechaCorrida!: max, this.datosCajas[0].fechaCorrida)!
    }

    this.rangoFechas = fechasE;
    
    this.mensajeFechaCarga = [{ severity: 'success', summary: 'Fecha de carga:', detail: `${formatDate(this.dataContainers![0].exportdate, "dd/MM/yyyy", "es-UY")}`}];
    this.mensajeRangoFechas = [{ severity: 'success', summary: 'Fechas de producción:', detail: `<span class="fecha__title">Primera:</span> ${formatDate(fechasE.fechaMinima, "dd/MM/yyyy", "es-UY")}  -  <span class="fecha__title">Última:</span> ${formatDate(fechasE.fechaMaxima, "dd/MM/yyyy", "es-UY")}`}];
  }


  private async getCodigosConPrecio(): Promise<void> {
    await this.getFechasListasPrecios(); 
    const f: Date[] = this.buscarListasDePreciosPorProduccion();
    if(f.length > 0) {
      const fMin = formatDate(f[0], "yyyy-MM-dd", "es-UY");
      var fMax: string; 
      if(f[f.length - 1] > this.rangoFechas.fechaMaxima) fMax = fMin;
      else fMax = formatDate(f[f.length - 1], "yyyy-MM-dd", "es-UY ");

      this.precios = await lastValueFrom(this.cargaKosherSrv.getPreciosPorFecha(fMin, fMax));
      this.setListasPrecios();
      this.getCodigos();
    }
  }

  private setListasPrecios(): void {
    this.fechasPrecios = Array.from(new Set(this.precios!.map(p => p.fecha_Produccion)))?? undefined;
    if(this.fechasPrecios) {
      this.fechasPrecios.forEach(fecha => {
        this.listasPrecios!.push(this.precios?.filter(p => p.fecha_Produccion == fecha)!)   
      });
    }
  }

  private getCodigos(): void {
    this.codigos = Array.from(new Set(this.precios?.map(p => p.codigo_Producto))).sort((a, b) => {
      if(a < b) return -1;
      if(a == b) return 0;
      return 1;
    });
  }
 //#endregion

 //#region Precios
  getPrecioPorCodigoYFecha(codigo: string, fecha: Date): number {
    var precio = this.precios?.find(p => p.codigo_Producto == codigo && p.fecha_Produccion == fecha);
    if(precio) return precio.precio_Tonelada;
    return 0;
  }

  getTipoMonedaPorFecha(fecha: Date): string {
    var pr = this.precios?.find(p => p.fecha_Produccion == fecha);
    if(pr) {
      var mnd = this.tiposMoneda?.find(m => m.id == pr?.id_Moneda);
        if(mnd) return mnd.codigo;
    }
    return '';
  }

  adminPrecios(): void {
    this.adminPreciosRef = this.dialogService.open(AdminPreciosComponent, {
      data: {
        todasLasFechas: this.fechas,
        fechas: this.fechasPrecios,
        monedas: this.tiposMoneda
      },
      header: "Administrar listas de precios",
      width: "50vw",
      closable: true,
      closeOnEscape: true,
      dismissableMask: true
    });

    this.adminPreciosRef.onClose.subscribe(async (result: any) => {
      if (result !== undefined) {
        try {
          await this.getCodigosConPrecio();
          await this.getFechasListasPrecios();
         } catch (error) {
            console.error("ERROR: ", error);
         }
      }
    });
  }

  private buscarListasDePreciosPorProduccion(): Date[] {
    if(this.fechas.length === 0) return [];

    var fechas: Date[] = [];
    var fechasAux: Date[] = [];
  
    const fechasMinimas: Date[] = this.fechas.filter(f => f <= this.rangoFechas.fechaMinima);
    const fechasMaximas: Date[] = this.fechas.filter(f => f >= this.rangoFechas.fechaMinima);

     if(fechasMinimas.length > 0)
       fechasAux.push(fechasMinimas[fechasMinimas.length - 1]);
    // if(fechasMaximas.length > 0)
    //   fechasAux .push(fechasMaximas[fechasMaximas.length - 1]);

    fechas = Array.from(new Set([...fechasAux, ...fechasMaximas])).sort((a, b) => {
      if(a <= b) return -1;
      return 1;
    })
    
    return fechas;
  }
  //#endregion

  //#region Funciones auxiliares
  
  clear(): void {
    this.procederConReporte(false);
    this.dataContainers = []; 
    this.mostrarPrecios = false;
    this.precios = [];
    this.datosCajas = [];
    this.txtButtonConfirmarPrecios = "Confirmar estos precios y códigos";
    this.iconoButtonConfirmar = 'pi pi-question';
    this.mostrarPrecioYCodigos = true;
    this.idCarga = [];
    this.idCargaString = '';
    this.mostrarSeleccionContenedores = false;
  }

  private procederConReporte(value: boolean): void {
    this.habilitarReporte.emit(value);
  }

  todoListo(): void {
    this.procederConReporte(true);
    this.getCodigosPrecio.emit(this.precios);
    this.txtButtonConfirmarPrecios = "Precios y códigos confirmados!";
    this.iconoButtonConfirmar = 'pi pi-check';
    this.mostrarPrecioYCodigos = false;
  }
  //#endregion

  //#region ConfProductos
  private setPropiedadesConfProductos(): void {
    this.codigosKosher = this.ordenarArray(Array.from(new Set(this.confProductos?.map(cp => cp.codigoKosher!))));
    this.clasificacionKosher = this.ordenarArray(Array.from(new Set(this.confProductos?.map(cp => cp.clasificacionKosher!))));
    
    this.markKosher = this.ordenarArray(Array.from(new Set(this.confProductos?.map(cp => cp.markKosher!))));
    this.markKosher = this.markKosher.map(m => m == null ? '' : m);
    this.markKosher = Array.from(new Set(this.markKosher.map(m => m)));

    this.especie = this.ordenarArray(Array.from(new Set(this.confProductos?.map(cp => cp.especie!))));
    this.tipoProducto = this.ordenarArray(Array.from(new Set(this.confProductos?.map(cp => cp.tipoProducto!))));
    this.codigosKosherOptions = this.codigosKosher.map(ck => ({ label: ck, value: ck }));
    this.clasificacionKosherOptions = this.clasificacionKosher.map(ck => ({ label: ck, value: ck }));
    this.markKosherOptions = this.markKosher.map(ck => ({ label: ck, value: ck }));
    this.especieOptions = this.especie.map(ck => ({ label: ck, value: ck }));
    this.tipoProductoOptions = this.tipoProducto.map(ck => ({ label: ck, value: ck }));
  }

  private async getConfProductos(): Promise<void> {
    await lastValueFrom(this.cargaKosherSrv.getConfProductos())
      .then(result => {
        this.confProductos = result;
        this.confProductos = this.eliminarDuplicados(this.confProductos!, 'codigoProducto');
        this.setPropiedadesConfProductos();
        this.ckcs.setConfProductos(this.confProductos);
        this.confProductosOriginal = this.cs.deepCopy(this.confProductos);
      })
      .catch(error => {
        console.log(error);
      });
  }

  private ordenarArray(array: string[]): string[] {
    array.sort((a, b) => {
      if(a <= b) return -1;
      return 1;
    })

    return array;
  }

  eliminarDuplicados = (arr: ConfProducto[], key: string): ConfProducto[] => {
    const seen = new Set<string>();
    return arr.filter(item => {
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
      data:{
        codigosKosher: this.codigosKosher,
        clasificacionKosher: this.clasificacionKosher,
        markKosher: this.markKosher,
        especie: this.especie,
        tipoProducto: this.tipoProducto,
        codigos: Array.from(new Set(this.confProductos?.map(cp => cp.codigoProducto)))
      },
      header: "Agregar códigos",
      width: "90vw",
      height: "80vh",
      closable: true,
      closeOnEscape: true,
      dismissableMask: true
    });

    this.addCodigosRef.onClose.subscribe(async (result: any) => {
      //if(result != undefined) {
        await this.getConfProductos();
      //}
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

  onRowEditCancel(producto: ConfProducto,  index: number): void {
    this.deleteProducto(producto, index);
  }

  async guardarCambios(): Promise<void> {
    if(Object.keys(this.codigosClonados).length > 0)
    {
      try {
        const codigosActualizar: ConfProducto[] = Object.values(this.codigosClonados);
        await lastValueFrom(this.cargaKosherSrv.updateConfProductos(codigosActualizar));
        await this.getConfProductos();
        this.isEditing = false;
      } catch(error) {
        console.log(error);
      }
    }
  }

  cancelarCambios(): void {
    for(let producto in this.codigosClonados) {
      const prod = this.buscarProductoPorCodigo(producto);
      if(prod) {
        const i = this.confProductos?.indexOf(this.confProductos.find(c => c.codigoProducto == prod.codigoProducto)!) ?? -1;
        if(i >= 0) {
          this.deleteProducto(prod, i);
        }
      }
    }
    this.confProductos = this.cs.deepCopy(this.confProductosOriginal);
    this.isEditing = false;
  }
  
  private deleteProducto(producto: ConfProducto, index: number) : void {
    this.confProductos![index] = this.codigosClonados[producto.codigoProducto];
    delete this.codigosClonados[producto.codigoProducto];
  }

  private buscarProductoPorCodigo(codigo: string): ConfProducto | null {
    if(this.codigosClonados.hasOwnProperty(codigo.toString())) {
      return this.codigosClonados[codigo];
    }
    return null;
  }
  //#endregion
}
