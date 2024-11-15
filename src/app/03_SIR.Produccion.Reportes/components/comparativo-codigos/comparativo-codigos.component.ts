import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComparativoCodigosService } from '../../services/comparativo-codigos.service';
import { ConfirmationService } from 'primeng/api';
import { ConfTipoCuotaDTO } from '../../pages/cuota/interfaces/ConfTipoCuotaDTO.interface';
import { ConfTipoRendimiento } from '../../pages/rendimientos/interfaces/ConfTipoRendimiento.interface';
import { GrupoAgrupadoQamark } from '../../interfaces/GrupoAgrupadoQamark.interface';
import { GrupoComparativo } from '../../interfaces/GrupoComparativo.interface';
import { MensajeAlerta } from '../../interfaces/MensajeAlerta.interface';
import { NuevoGrupoComponent } from '../nuevo-grupo/nuevo-grupo.component';
import { ProductoData } from '../../interfaces/ProductoData.interface';
import { QamarkDTO } from '../../pages/cuota/interfaces/QamarkDTO.interface';
import { TipoLote } from '../../pages/rendimientos/interfaces/TipoLote.interface';

@Component({
  selector: 'comparativo-codigos',
  templateUrl: './comparativo-codigos.component.html',
  styleUrls: ['./comparativo-codigos.component.css'],
  providers: [ DialogService, ConfirmationService ]
})
export class ComparativoCodigosComponent implements OnInit, OnChanges, OnDestroy{

  @Input() rangoFechas: string[] = [];
  @Input() lotesActivos: TipoLote[] = [];
  @Input() tiposRendimientos: ConfTipoRendimiento[] | ConfTipoCuotaDTO[] = [];
  @Input() qamarks: QamarkDTO[] = [];

  qamarksEnGrupos: string[] = [];
  productosAgrupadosPorQamark: GrupoAgrupadoQamark[] = [];

  productosData: ProductoData[] = [];
  grupos: GrupoComparativo[] = [];
  nuevoGrupoDialog!: DynamicDialogRef;

  qamarkRowspans: { [key: string]: number } = {};
  editando: boolean = false;

  mensajesAlerta: MensajeAlerta[] = [];

  @Output() qamarksChange = new EventEmitter<string[]>();
  @Output() gruposChange = new EventEmitter<GrupoComparativo[]>();

  constructor (
    private dialog: DialogService, 
    private comparativoService: ComparativoCodigosService,
    private confirmationService: ConfirmationService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.setDatos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setDatos();
  }

  ngOnDestroy(): void {
    this.cerrarDialogo();
  }

  private async setDatos(): Promise<void> {    
    this.productosData = await this.comparativoService.setProductoData(this.rangoFechas, this.lotesActivos, this.tiposRendimientos, this.qamarks);
    this.mensajesAlerta = this.setMensajesAlerta();    
  }

  protected abrirDialogoNuevoGrupo(grupo: GrupoComparativo | undefined) : void {
    this.editando = grupo != undefined;
    this.nuevoGrupoDialog = this.dialog.open(NuevoGrupoComponent, 
      {
        data:{
          productos: this.productosData,
          grupo: grupo
        },
        header: !this.editando ? 'Nuevo grupo a comparar' : `Editar grupo '${grupo?.nombre}'`,
        width: "50vw",
        height: "80vh",
        closable: true,
        closeOnEscape: false,
        dismissableMask: true
      }
    );
    
    this.nuevoGrupoDialog.onClose.subscribe((response: { nombre: string; productos: ProductoData[] } | undefined) => {      
      if (!response) return;
  
      const { nombre, productos } = response;
      if (this.editando) {
          this.editarGrupoExistente(grupo?.id!, nombre, productos);
          this.editando = false;
      } else
          this.agregarNuevoGrupo(nombre, productos);

      this.setDataAMostrar();
      this.emitirCambiosComparativoCodigo();
    });
  }

  private agregarNuevoGrupo(nombre: string, productos: ProductoData[]): void {
    this.grupos.push({
      id: this.grupos.length + 1,
      nombre: nombre,
      productos: productos.sort((a, b) => a.codigo.localeCompare(b.codigo))
    });
  }

  private editarGrupoExistente(idGrupo: number, nombre: string, productos: ProductoData[]): void {
    const grupo: GrupoComparativo | undefined = this.grupos.find(gr => gr.id === idGrupo);
    if(grupo != undefined) {
      grupo.nombre = nombre;
      grupo.productos = productos.sort((a, b) => a.codigo.localeCompare(b.codigo));
    }
  }

  protected cerrarDialogo(): void {
    if(this.nuevoGrupoDialog) {
      this.nuevoGrupoDialog.close();
      this.nuevoGrupoDialog.destroy();
    }
  }

  private borrarGrupos(): void {
    this.grupos = [];
    this.qamarksEnGrupos = [];
    this.emitirCambiosComparativoCodigo();
  }

  private setDataAMostrar(): void {
    this.qamarksEnGrupos = this.comparativoService.qamarksEnGrupos(this.grupos);
    this.calcularRowSpanPorQamark();    
  }

  protected buscarProductosPorQamark(productos: ProductoData[], qamark: string): ProductoData[] {
    return productos.filter(producto => producto.qamark === qamark);
  }

  private eliminarGrupo(indice: number): void {
    this.grupos.splice(indice, 1);
    this.setDataAMostrar();
    this.emitirCambiosComparativoCodigo();
  }

  protected editarGrupo(indice: number): void {
    this.abrirDialogoNuevoGrupo(this.grupos[indice]);
  }

  private maxProductosPorQamark(qamark: string): number {
    let maximoProductos = 0;

    this.grupos.forEach(grupo => {
      const cantidadProductosConQamark = this.buscarProductosPorQamark(grupo.productos, qamark).length;

      if(cantidadProductosConQamark > maximoProductos) {
        maximoProductos = cantidadProductosConQamark;
      }
    });

    return maximoProductos;
  }

  private calcularRowSpanPorQamark(): void {
    this.grupos.forEach(grupo => {
      grupo.productos.forEach(producto => {
        const qamark = producto.qamark;
        if (qamark) {
          this.qamarkRowspans[qamark] = this.maxProductosPorQamark(qamark);
        }
      });
    });
  }

  protected confirmarEliminacion(event: Event, indiceMensajes: number, indice?: number): void {
    const mensajeOriginal = this.mensajesAlerta[indiceMensajes].mensaje;
    
    let mensajeReemplazado = mensajeOriginal; 
    console.log(indice != undefined);
    
    if(indice != undefined) mensajeReemplazado = mensajeOriginal.replace('@grupo', this.grupos[indice].nombre);

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: mensajeReemplazado,
      header: this.mensajesAlerta[indiceMensajes].header,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: "p-button-text",
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.mensajesAlerta[indiceMensajes].accion?.(indice)
      },
      reject: () => {}
    })
  }

  private setMensajesAlerta(): MensajeAlerta[] {
    return [
      {
        header: 'Eliminar todo',
        mensaje: '¿Estás seguro de eliminar todos los grupos?',
        accion: () => this.borrarGrupos()
      },
      {
        header: 'Eliminar grupo',
        mensaje: "¿Estás seguro de eliminar el grupo '@grupo'?",
        accion: (indice?: number) => {
          if (indice !== undefined) {
              this.eliminarGrupo(indice);
          }
        } 
      }
    ];
  }

  emitirCambiosComparativoCodigo(): void {
    this.qamarksChange.emit(this.qamarksEnGrupos);
    this.gruposChange.emit(this.grupos);
  }
}
