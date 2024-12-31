
import { Component, ViewChild } from '@angular/core';
import { FtProductoService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtProducto/FtProducto.service';

import Swal from 'sweetalert2';
import { SweetAlertGenericosComponent } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/helper/sweet-alert-genericos/sweet-alert-genericos.component';

@Component({
  selector: 'component-crear-producto-ficha-tecnica',
  templateUrl: './crear-producto-ficha-tecnica.component.html',
  styleUrls: ['./crear-producto-ficha-tecnica.component.css']
})
export class CrearProductoFichaTecnicaComponent {

  @ViewChild(SweetAlertGenericosComponent) private _sweetAlertComponent!: SweetAlertGenericosComponent;

  public productoBuscado: string = '';
  public productoEncontrado: boolean = false;
  public buscaronUnProducto: boolean = false;

  public idProducto: number = 0;
  public codigoProducto: string | null = null;
  public nombreProducto: string | null = null;
  public descripcionProducto: string | null = null;
  public calibreProducto: string | null = null;

  constructor(
    private _productoService: FtProductoService
  ) {}

  public BuscarProducto() {    
    if (this.productoBuscado.length > 0) {
        this._productoService.GetProductoFiltradoFichaTecnica(this.productoBuscado).subscribe({
            next: (response) => {
                if (response.esCorrecto && response.resultado) {
                    const producto = response.resultado;
                    this.idProducto = producto.idProducto;

                    this.codigoProducto = producto.codigoProducto;
                    this.nombreProducto = producto.nombre;
                    this.descripcionProducto = producto.nombreDeProductoParaFicha;
                    this.calibreProducto = producto.calibre;

                    this._sweetAlertComponent.AlertaSuccessgenerica("Producto Encontrado", `El Producto con el Codigo: ${producto.codigoProducto} fue encontrado`);
                    this.productoEncontrado = true;
                    this.buscaronUnProducto = true;
                    this.productoBuscado = '';
                } else {

                    Swal.fire({
                        title: 'Producto no encontrado',
                        text: `El producto con ID: ${this.productoBuscado} no existe. ¿Deseas crearlo?`,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, Crear',
                        cancelButtonText: 'No, Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.buscaronUnProducto = true;
                            this.productoEncontrado = false;
                            this.codigoProducto = this.productoBuscado;
                            this.nombreProducto = null;
                            this.descripcionProducto = null;
                            this.calibreProducto = null;
                        } else {
                            this.productoBuscado = '';
                            this.LimpiarFormulario();
                        }
                    });
                }
            },
            error: (error) => {
                console.error('Error al obtener el producto', error);
            }
        });
    } else {
        this._sweetAlertComponent.AlertaErrorgenerica("Campo Vacio", `Ingrese un Codigo de Producto`);
    }
  }


    public ActualizarProducto() {
        if (!this.codigoProducto || !this.productoEncontrado) {
          this._sweetAlertComponent.AlertaErrorgenerica("Error", "No se puede actualizar. No hay producto seleccionado.");
          return;
        }
    
        const productoActualizado = {   
          idProducto: 0, 
          codigoProducto: this.codigoProducto!,
          nombre: this.nombreProducto!, 
          nombreDeProductoParaFicha: this.descripcionProducto!, 
          calibre: this.calibreProducto!, 
        };
    
        this._productoService.EditarProducto(productoActualizado).subscribe({
          next: (response) => {
            if (response) {
              this._sweetAlertComponent.AlertaSuccessgenerica("Producto Actualizado", `El producto se actualizó correctamente.`);
              this.LimpiarFormulario();
              this.productoEncontrado = false; 
            } else {
              this._sweetAlertComponent.AlertaErrorgenerica("Error", "No se pudo actualizar el producto.");
            }
          },
          error: (error) => {
            this._sweetAlertComponent.AlertaErrorgenerica("Error", `Error al actualizar el producto: ${error.message}`);
          }
        });
    }

    public CrearProducto() {
      if (!this.codigoProducto || !this.nombreProducto) {
          this._sweetAlertComponent.AlertaErrorgenerica("Campos Incompletos", "El campo Codigo y Nombre son requeridos para crear el producto.");
          return;
      }
  
      const nuevoProducto = {
          idProducto: 0,  
          codigoProducto: this.codigoProducto!,
          nombre: this.nombreProducto!,
          nombreDeProductoParaFicha: this.descripcionProducto! || '',
          calibre: this.calibreProducto! || '',
      };
  
      this._productoService.CrearProducto(nuevoProducto).subscribe({
          next: (response) => {
              if (response.esCorrecto) {
                  this._sweetAlertComponent.AlertaSuccessgenerica("Producto Creado", "El producto se ha creado exitosamente.");
                  this.LimpiarFormulario();
              } else {
                  this._sweetAlertComponent.AlertaErrorgenerica("Error", "No se pudo crear el producto.");
              }
          },
          error: (error) => {
              this._sweetAlertComponent.AlertaErrorgenerica("Error", `Error al crear el producto: ${error.message}`);
          }
      });
    }

    public EliminarProducto() {
      if (!this.idProducto) {
          this._sweetAlertComponent.AlertaErrorgenerica("Error", "No se ha seleccionado ningún producto.");
          return;
      }
  
      // Confirmar si el usuario desea eliminar el producto
      Swal.fire({
          title: '¿Estás seguro?',
          text: `¿Deseas eliminar el producto con el código: ${this.idProducto}?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, Eliminar',
          cancelButtonText: 'No, Cancelar'
      }).then((result) => {
          if (result.isConfirmed) {
              // Llamamos al servicio para eliminar el producto
              this._productoService.EliminarProducto(this.idProducto!).subscribe({
                  next: (response) => {
                      if (response.esCorrecto) {
                          this._sweetAlertComponent.AlertaSuccessgenerica("Producto Eliminado", "El producto ha sido eliminado exitosamente.");
                          this.LimpiarFormulario();  
                      } else {
                          this._sweetAlertComponent.AlertaErrorgenerica("Error", "No se pudo eliminar el producto.");
                      }
                  },
                  error: (error) => {
                      this._sweetAlertComponent.AlertaErrorgenerica("Error", `Error al eliminar el producto: ${error.message}`);
                  }
              });
          }
      });
  }  

    public LimpiarFormulario() {
        this.nombreProducto = null;
        this.descripcionProducto = null;
        this.calibreProducto = null;
        this.codigoProducto = null;
        this.productoBuscado = '';
        this.productoEncontrado = false;
        this.buscaronUnProducto = false;
    }
  
}
