
import { Component, ViewChild } from '@angular/core';

import { FtAlergenosDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Alergenos/FtAlergenosDTO';
import { FtTipoDeAlimentacionDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Alimentacion/FtTipoDeAlimentacionDTO';
import { FtColorDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Colores/FtColorDTO';
import { FtOlorDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Olor/FtOlorDTO';
import { FtPhDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Ph/FtPhDTO';
import { FtPresentacionDeEnvaseDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/PresentacionDeEnvase/FtPresentacionDeEnvaseDTO';
import { FtTipoDeEnvaseDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/TipoDeEnvase/FtTipoDeEnvaseDTO';
import { FtTipoDeUsoDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/TipoDeUso/FtTipoDeUsoDTO';
import { FtVidaUtilDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/VidaUtil/FtVidaUtilDTO';
import { FtColorService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtColor/FtColor.service';
import { FtMarcaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Marcas/FtMarcaDTO';
import { FtMarcaService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtMarcas/FtMarcaService.service';
import { FtTipoDeUsoService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtTipoDeUso/FtTipoDeUso.service';
import { FtOlorService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtOlor/FtOlor.service';
import { FtPhService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtPh/FtPh.service';
import { FtAlergenosService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtAlergenos/FtAlergenos.service';
import { FtVidaUtilService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtVidaUtil/FtVidaUtil.service';
import { FtTipoDeAlimentacionService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtTipoDeAlimentacion/FtTipoDeAlimentacion.service';
import { FtTipoDeEnvaseService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtTipoDeEnvase/FtTipoDeEnvase.service';
import { FtPresentacionDeEnvaseService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtPresentacionDeEnvase/FtPresentacionDeEnvase.service';
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

  public codigoProducto: string | null = null;
  public nombreProducto: string | null = null;
  public descripcionProducto: string | null = null;
  public calibreProducto: string | null = null;

  constructor(
    private _productoService: FtProductoService
  ) {}

    public BuscarProducto() {    
        if(this.productoBuscado.length > 0){
        this._productoService.GetProductoFiltradoFichaTecnica(this.productoBuscado).subscribe({
            next: (response) => {
                if (response.esCorrecto && response.resultado) {
                    const producto = response.resultado;

                    // Asignar los IDs a las variables correspondientes
                    this.codigoProducto = producto.codigoProducto;
                    this.nombreProducto = producto.nombre;
                    this.descripcionProducto = producto.nombreDeProductoParaFicha;
                    this.calibreProducto = producto.calibre;

                    this._sweetAlertComponent.AlertaSuccessgenerica("Producto Encontrado", `El Producto con el Codigo: ${producto.codigoProducto} fue encontrado` )
                    this.productoEncontrado = true;
                    this.productoBuscado = '';

                } else {
                
                    Swal.fire({
                    title: 'Producto no encontrado',
                    text: `El producto con ID: ${this.productoBuscado} no existe.`,
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK',
                    })

                    this.LimpiarFormulario();
                }
            },
            error: (error) => {
                console.error('Error al obtener el producto', error);
            }
        });
        }else{
        this._sweetAlertComponent.AlertaErrorgenerica("Campo Vacio", `Ingrese un Codigo de Producto` )
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

    public LimpiarFormulario() {
        this.nombreProducto = null;
        this.descripcionProducto = null;
        this.calibreProducto = null;
    }
  
}
