
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
import { FtProductoService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CrearProductoFichaTecnicaServicios/FtProducto/FtProducto.service';

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
  public mostrarFormularioDeCreacion: boolean = false;
  public mostrarBuscadorDeCodigos: boolean = true;

  public codigoProducto: string | null = null;
  public nombreProducto: string | null = null;
  public descripcionProducto: string | null = null;
  public observacionProducto: string | null = null;
  public pesoPromedioProducto: number | null = null;
  public listaDeProductosAIngresar: string[] = [];

  public marca: FtMarcaDTO[] = [];
  public colores: FtColorDTO[] = [];
  public tiposUso: FtTipoDeUsoDTO[] = [];
  public olores: FtOlorDTO[] = [];
  public ph: FtPhDTO[] = [];
  public alergenos: FtAlergenosDTO[] = [];
  public vidasUtil: FtVidaUtilDTO[] = [];
  public alimentaciones: FtTipoDeAlimentacionDTO[] = [];
  public tiposEnvase: FtTipoDeEnvaseDTO[] = [];
  public presentacionesEnvase: FtPresentacionDeEnvaseDTO[] = [];
  
  // Variables para los elementos seleccionados
  public marcaSeleccionada: number | null = null;
  public colorSeleccionado: number | null = null;
  public tipoUsoSeleccionado: number | null = null;
  public olorSeleccionado: number | null = null;
  public phSeleccionado: number | null = null;
  public alergenoSeleccionado: number | null = null;
  public vidaUtilSeleccionada: number | null = null;
  public alimentacionSeleccionada: number | null = null;
  public tipoEnvaseSeleccionado: number | null = null;
  public presentacionEnvaseSeleccionada: number | null = null;



  constructor(
    private _FtColorService: FtColorService,
    private _FtMarcaService: FtMarcaService,
    private _FtTipoDeUsoService: FtTipoDeUsoService,
    private _FtOlorService: FtOlorService,
    private _FtPhService: FtPhService,
    private _FtAlergenosService: FtAlergenosService,
    private _FtVidaUtilService: FtVidaUtilService,
    private _FtTipoDeAlimentacionService: FtTipoDeAlimentacionService,
    private _FtTipoDeEnvaseService: FtTipoDeEnvaseService,
    private _FtPresentacionDeEnvaseService: FtPresentacionDeEnvaseService,
    private _productoService: FtProductoService
  ) {}

  ngOnInit() {
    this.CargarDatosGenerales();
  }

  public BuscarProducto() {    
    if(this.productoBuscado.length > 0){
      this._productoService.GetProductoFiltradoFichaTecnica(this.productoBuscado).subscribe({
        next: (response) => {
            if (response.esCorrecto && response.resultado) {
                const producto = response.resultado;

                // Asignar los IDs a las variables correspondientes
                this.codigoProducto = producto.codigo;
                this.nombreProducto = producto.nombre;
                this.descripcionProducto = producto.descripcion;
                this.observacionProducto = producto.observacion;
                this.pesoPromedioProducto = producto.pesoPromedio;
                this.marcaSeleccionada = producto.idMarca;
                this.colorSeleccionado = producto.idColor;
                this.tipoUsoSeleccionado = producto.idTipoDeUso;
                this.olorSeleccionado = producto.idOlor;
                this.phSeleccionado = producto.idPh;
                this.alergenoSeleccionado = producto.idAlergeno;
                this.vidaUtilSeleccionada = producto.idVidaUtil;
                this.alimentacionSeleccionada = producto.idAlimentacion;
                this.tipoEnvaseSeleccionado = producto.idTipoDeEnvase;
                this.presentacionEnvaseSeleccionada = producto.idPresentacionDeEnvase;

                this._sweetAlertComponent.AlertaSuccessgenerica("Producto Encontrado", `El Producto con el Codigo: ${producto.codigo} fue encontrado` )
                this.productoEncontrado = true;
                this.productoBuscado = '';

            } else {
               // Alerta si el producto no se encontró
                Swal.fire({
                  title: 'Producto no encontrado',
                  text: `El producto con ID: ${this.productoBuscado} no existe. ¿Desea crearlo?`,
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Sí, crear producto',
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'No, volver'
                }).then((resultado) => {
                  if (resultado.isConfirmed) {
                    this.mostrarFormularioDeCreacion = true;
                    this.productoEncontrado = false; 
                    this.productoBuscado = '';
                    this.mostrarBuscadorDeCodigos = false;
                    this.LimpiarFormulario()
                  }
                });      
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

public CargarDatosGenerales() {
  this._FtMarcaService.GetListaDeMarcasFichaTecnica().subscribe({
      next: (response) => {
          this.marca = response.resultado.map((marca: FtMarcaDTO) => ({
              id: marca.idMarca,
              descripcion: marca.descripcion 
          }));
      },
      error: (error) => {
          console.error('Error al obtener las marcas', error);
      }
  });

  this._FtColorService.GetListaDeColoresFichaTecnica().subscribe({
      next: (response) => {
          this.colores = response.resultado.map((color: FtColorDTO) => ({
              id: color.idColor, 
              descripcion: color.descripcion
          }));
      },
      error: (error) => {
          console.error('Error al obtener los colores', error);
      }
  });

  this._FtTipoDeUsoService.GetListaDeTiposDeUsoFichaTecnica().subscribe({
      next: (response) => {
          this.tiposUso = response.resultado.map((uso: FtTipoDeUsoDTO) => ({
              id: uso.idTipoDeUso,
              descripcion: uso.descripcion 
          }));
      },
      error: (error) => {
          console.error('Error al obtener los tipos de uso', error);
      }
  });

  this._FtOlorService.GetListaDeOloresFichaTecnica().subscribe({
      next: (response) => {
          this.olores = response.resultado.map((olor: FtOlorDTO) => ({
              id: olor.idOlor, 
              descripcion: olor.descripcion 
          }));
      },
      error: (error) => {
          console.error('Error al obtener los olores', error);
      }
  });

  this._FtPhService.GetListaDePhFichaTecnica().subscribe({
      next: (response) => {
          this.ph = response.resultado.map((ph: FtPhDTO) => ({
              id: ph.idPh, 
              nombre: ph.nombre 
          }));
      },
      error: (error) => {
          console.error('Error al obtener los PHs', error);
      }
  });

  this._FtAlergenosService.GetListaDeAlergenosFichaTecnica().subscribe({
      next: (response) => {
          this.alergenos = response.resultado.map((alergeno: FtAlergenosDTO) => ({
              id: alergeno.idAlergeno,
              descripcion: alergeno.descripcion
          }));
      },
      error: (error) => {
          console.error('Error al obtener los alergenos', error);
      }
  });

  this._FtVidaUtilService.GetListaDeVidaUtilFichaTecnica().subscribe({
      next: (response) => {
          this.vidasUtil = response.resultado.map((vidaUtil: FtVidaUtilDTO) => ({
              id: vidaUtil.idVidaUtil,    
              nombre: vidaUtil.nombre
          }));
      },
      error: (error) => {
          console.error('Error al obtener las vidas útiles', error);
      }
  });

  this._FtTipoDeAlimentacionService.GetListaDeTiposDeAlimentacionFichaTecnica().subscribe({
      next: (response) => {
          this.alimentaciones = response.resultado.map((alimentacion: FtTipoDeAlimentacionDTO) => ({
              id: alimentacion.idAlimentacion,
              tipo: alimentacion.tipo           
          }));
      },
      error: (error) => {
          console.error('Error al obtener las alimentaciones', error);
      }
  });

  this._FtTipoDeEnvaseService.GetListaDeTiposDeEnvaseFichaTecnica().subscribe({
      next: (response) => {
          this.tiposEnvase = response.resultado.map((tipoEnvase: FtTipoDeEnvaseDTO) => ({
              id: tipoEnvase.idTipoDeEnvase,    
              descripcion: tipoEnvase.descripcion  
          }));
      },
      error: (error) => {
          console.error('Error al obtener los tipos de envase', error);
      }
  });

  this._FtPresentacionDeEnvaseService.GetListaDePresentacionesDeEnvaseFichaTecnica().subscribe({
      next: (response) => {
          this.presentacionesEnvase = response.resultado.map((presentacion: FtPresentacionDeEnvaseDTO) => ({
              id: presentacion.idPresentacionDeEnvase,  
              descripcion: presentacion.descripcion       
          }));
      },
      error: (error) => {
          console.error('Error al obtener las presentaciones de envase', error);
      }
    });
  }

  public AgregarCodigo() {
    if (this.codigoProducto!.trim() !== '') {
      this.listaDeProductosAIngresar.push(this.codigoProducto!.trim());
      this.codigoProducto = '';
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor ingrese un código válido.',
        icon: 'error'
      });
    }
  }


  public EnviarFormulario() {

    if (
        !this.colorSeleccionado || !this.tipoUsoSeleccionado || !this.olorSeleccionado ||
        !this.phSeleccionado || !this.alergenoSeleccionado || !this.vidaUtilSeleccionada ||
        !this.alimentacionSeleccionada || !this.tipoEnvaseSeleccionado || !this.presentacionEnvaseSeleccionada) {
        
        console.error('Por favor, complete todos los campos antes de enviar el formulario.');
        return;
    }

    const productosNuevos = this.listaDeProductosAIngresar.map(codigo => ({
        idProducto: 0,
        nombre: this.nombreProducto!, 
        descripcion: this.descripcionProducto!, 
        codigo: codigo,
        observacion: this.observacionProducto!, 
        pesoPromedio: this.pesoPromedioProducto!, 
        idMarca: this.marcaSeleccionada!, 
        idCondicionAlmacenamiento: 4, 
        idColor: this.colorSeleccionado!,
        idTipoDeUso: this.tipoUsoSeleccionado!,
        idOlor: this.olorSeleccionado!,
        idPh: this.phSeleccionado!,
        idAlergeno: this.alergenoSeleccionado!,
        idVidaUtil: this.vidaUtilSeleccionada!,
        idAlimentacion: this.alimentacionSeleccionada!,
        idTipoDeEnvase: this.tipoEnvaseSeleccionado!,
        idPresentacionDeEnvase: this.presentacionEnvaseSeleccionada!,
    }));

    productosNuevos.forEach(producto => {
        this._productoService.CrearProducto(producto).subscribe({
            next: (response) => {
                this._sweetAlertComponent.AlertaSuccessgenerica("Productos Ingresados ", `Se agregaron correctamente los Productos` )
                this.LimpiarFormulario()
                this.listaDeProductosAIngresar = []
            },
            error: (error) => {
              this._sweetAlertComponent.AlertaErrorgenerica("Error ", `error ${error.Message}` )
            }
        });
    });
  }

  public ActualizarProducto() {
    if (!this.codigoProducto || !this.productoEncontrado) {
        this._sweetAlertComponent.AlertaErrorgenerica("Error", "No se puede actualizar. No hay producto seleccionado.");
        return;
    }

    const productoActualizado = {   
        idProducto: 0,
        nombre: this.nombreProducto!, 
        descripcion: this.descripcionProducto!, 
        codigo: this.codigoProducto,
        observacion: this.observacionProducto!, 
        pesoPromedio: this.pesoPromedioProducto!, 
        idMarca: this.marcaSeleccionada!, 
        idCondicionAlmacenamiento: 4, 
        idColor: this.colorSeleccionado!,
        idTipoDeUso: this.tipoUsoSeleccionado!,
        idOlor: this.olorSeleccionado!,
        idPh: this.phSeleccionado!,
        idAlergeno: this.alergenoSeleccionado!,
        idVidaUtil: this.vidaUtilSeleccionada!,
        idAlimentacion: this.alimentacionSeleccionada!,
        idTipoDeEnvase: this.tipoEnvaseSeleccionado!,
        idPresentacionDeEnvase: this.presentacionEnvaseSeleccionada!,
    };

    console.log(productoActualizado)
    this._productoService.EditarProducto(productoActualizado).subscribe({
        next: (response) => {
            this._sweetAlertComponent.AlertaSuccessgenerica("Producto Actualizado", `El producto se actualizó correctamente.`);
            this.LimpiarFormulario();
            this.productoEncontrado = false; 
        },
        error: (error) => {
            this._sweetAlertComponent.AlertaErrorgenerica("Error", `Error al actualizar el producto: ${error.message}`);
        }
    });
}

public EliminarProducto() {
    if (!this.codigoProducto || !this.productoEncontrado) {
        this._sweetAlertComponent.AlertaErrorgenerica("Error", "No se puede eliminar. No hay producto seleccionado.");
        return;
    }

    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Este producto será eliminado permanentemente!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonColor: '#3085d6',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            this._productoService.EliminarProducto(this.codigoProducto!).subscribe({
                next: (response) => {
                    this._sweetAlertComponent.AlertaSuccessgenerica("Producto Eliminado", `El producto se eliminó correctamente.`);
                    this.LimpiarFormulario();
                    this.productoEncontrado = false; 
                },
                error: (error) => {
                    this._sweetAlertComponent.AlertaErrorgenerica("Error", `Error al eliminar el producto: ${error.message}`);
                }
            });
        }
    });
}


  public LimpiarFormulario() {
    this.listaDeProductosAIngresar = [];
    this.codigoProducto = null; 
    this.nombreProducto = null;
    this.descripcionProducto = null;
    this.observacionProducto = null;
    this.pesoPromedioProducto = null;
    this.marcaSeleccionada = null;
    this.colorSeleccionado = null;
    this.tipoUsoSeleccionado = null;
    this.olorSeleccionado = null;
    this.phSeleccionado = null;
    this.alergenoSeleccionado = null;
    this.vidaUtilSeleccionada = null;
    this.alimentacionSeleccionada = null;
    this.tipoEnvaseSeleccionado = null;
    this.presentacionEnvaseSeleccionada = null;
  }

  public MostrarBuscador(){
    this.mostrarBuscadorDeCodigos = true;
    this.mostrarFormularioDeCreacion = false;
    this.productoEncontrado = false; 
  }
  
}
