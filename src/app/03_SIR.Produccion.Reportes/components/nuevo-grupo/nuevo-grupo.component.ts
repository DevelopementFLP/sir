import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ProductoData } from '../../interfaces/ProductoData.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GrupoComparativo } from '../../interfaces/GrupoComparativo.interface';

@Component({
  selector: 'app-nuevo-grupo',
  templateUrl: './nuevo-grupo.component.html',
  styleUrls: ['./nuevo-grupo.component.css']
})
export class NuevoGrupoComponent implements OnInit {
  
  productoAgregar: {nombre: string; productos: ProductoData[]} | undefined = undefined;
  productosData: ProductoData[] = [];
  productosSeleccionados: ProductoData[] = [];
  productoSeleccionado: ProductoData | undefined = undefined;
  searchTerm: string = '';
  nombreGrupo: string = '';

  grupo: GrupoComparativo | undefined;

  @ViewChild('btnAgregarProducto', { static: false }) btnAgregarProducto!: ElementRef<HTMLButtonElement>;

  constructor(
    private configuration: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    const { data } = this.configuration ?? {};
    this.productosData = data?.productos ?? [];
    this.grupo = data?.grupo;
    this.nombreGrupo = this.grupo?.nombre ?? '';
    this.productosSeleccionados = this.grupo?.productos?.map(producto => ({ ...producto })) ?? [];
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
      productos: this.productosSeleccionados 
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
      this.productoSeleccionado = undefined;
      this.searchTerm = '';
    }
  }

  protected eliminarTodoSeleccionado(): void {
    this.productosSeleccionados = [];
  }

  protected eliminarProducto(indice: number): void {
    this.productosSeleccionados.splice(indice, 1);
  }

  onProductoSeleccionado(): void {}
  
  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent): void {
    event.preventDefault();
    this.productoSeleccionado = undefined;
    this.searchTerm = '';
  }
}
