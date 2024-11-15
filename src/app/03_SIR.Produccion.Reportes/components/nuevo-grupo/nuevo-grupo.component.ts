import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ProductoData } from '../../interfaces/ProductoData.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GrupoComparativo } from '../../interfaces/GrupoComparativo.interface';
import { ConfirmationService } from 'primeng/api';
import { MensajeAlerta } from '../../interfaces/MensajeAlerta.interface';

@Component({
  selector: 'app-nuevo-grupo',
  templateUrl: './nuevo-grupo.component.html',
  styleUrls: ['./nuevo-grupo.component.css'],
  providers: [ ConfirmationService ]
})
export class NuevoGrupoComponent implements OnInit {
  
  productoAgregar: {nombre: string; productos: ProductoData[]} | undefined = undefined;
  productosData: ProductoData[] = [];
  productosSeleccionados: ProductoData[] = [];
  productoSeleccionado: ProductoData | undefined = undefined;
  searchTerm: string = '';
  nombreGrupo: string = '';

  grupo: GrupoComparativo | undefined;

  mensajesAlerta: MensajeAlerta[] = [];

  @ViewChild('btnAgregarProducto', { static: false }) btnAgregarProducto!: ElementRef<HTMLButtonElement>;

  constructor(
    private configuration: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    const { data } = this.configuration ?? {};
    this.productosData = data?.productos ?? [];
    this.grupo = data?.grupo;
    this.nombreGrupo = this.grupo?.nombre ?? '';
    this.productosSeleccionados = this.grupo?.productos?.map(producto => ({ ...producto })).sort((a, b) => a.codigo.localeCompare(b.codigo)) ?? [];
    this.mensajesAlerta = this.setMensajesAlerta();
  }

  get productosFiltrados(): ProductoData[] {
    return this.productosData.filter(producto =>
      producto.codigo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  protected cerrarDialogo(): void {
    this.dialogRef.close(this.productoAgregar);
    this.productoSeleccionado = undefined;
    this.productosSeleccionados = [];
  }

  protected cancelar(): void {
    this.productoAgregar = undefined;
    this.cerrarDialogo();
  }

  protected guardarCambios(): void {
    this.productoAgregar = {
      nombre: this.nombreGrupo,
      productos: this.productosSeleccionados.sort((a, b) => a.codigo.localeCompare(b.codigo)) 
    }

    this.cerrarDialogo();
  }

  protected validadDatos(): boolean {
    return this.nombreGrupo != "" && this.productosSeleccionados.length > 0;
  }

  protected agregarProducto(): void {  
    if (this.productoSeleccionado) {
      if (!this.productosSeleccionados.includes(this.productoSeleccionado)) {
        this.productosSeleccionados.push(this.productoSeleccionado);
      }
      this.productosSeleccionados.sort((a, b) => a.codigo.localeCompare(b.codigo))
      this.productoSeleccionado = undefined;
      this.searchTerm = '';
    }
  }

  protected eliminarTodoSeleccionado(): void {
    this.productosSeleccionados = [];
  }

  private eliminarProducto(indice: number): void {
    this.productosSeleccionados.splice(indice, 1);
  }

  onProductoSeleccionado(): void {}
  
  protected confirmarEliminacion(event: Event, indiceMensajes: number, indice?: number): void {
    const mensajeOriginal = this.mensajesAlerta[indiceMensajes].mensaje;
    
    let mensajeReemplazado = mensajeOriginal; 
    console.log(indice != undefined);
    
    if(indice != undefined) mensajeReemplazado = mensajeOriginal.replace('@producto', this.productosSeleccionados[indice].codigo);

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
        mensaje: '¿Estás seguro de eliminar todos los productos de este grupo?',
        accion: () => this.eliminarTodoSeleccionado()
      },
      {
        header: 'Eliminar código',
        mensaje: "¿Estás seguro de eliminar el producto '@producto' de este grupo?",
        accion: (indice?: number) => {
          if (indice !== undefined) {
              this.eliminarProducto(indice);
          }
        } 
      }
    ];
  }

  protected handleEscape(): void {
    this.productoSeleccionado = undefined;
    this.searchTerm = '';
  }
}
