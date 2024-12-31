import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtAspectosGeneralesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtAspectosGeneralesDTO';
import { FtEspecificacionesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtEspecificacionesDTO';
import { FtAlergenosDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Alergenos/FtAlergenosDTO';
import { FtColorDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Colores/FtColorDTO';
import { FtCondicionDeAlmacenamientoDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/CondicionDeAlmacenamiento/FtCondicionAlmacenamientoDTO';
import { FtDestinoDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Destinos/FtDestinoDTO';
import { FtMarcaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Marcas/FtMarcaDTO';
import { FtOlorDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Olor/FtOlorDTO';
import { FtPhDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Ph/FtPhDTO';
import { FtPresentacionDeEnvaseDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/PresentacionDeEnvase/FtPresentacionDeEnvaseDTO';
import { FtTipoDeEnvaseDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/TipoDeEnvase/FtTipoDeEnvaseDTO';
import { FtTipoDeUsoDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/TipoDeUso/FtTipoDeUsoDTO';
import { FtVidaUtilDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/VidaUtil/FtVidaUtilDTO';
import { FtAspectosGeneralesService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtPlantilla/FtAspectosGenerales.service';
import { FtEspecificacionesService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtPlantilla/FtEspecificaciones.service';
import { FtPrecargaDeDatosService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtPrecargaDeDatos/FtPrecargaDeDatos.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'component-crear-plantilla-ficha-tecnica',
  templateUrl: './crear-plantilla-ficha-tecnica.component.html',
  styleUrls: ['./crear-plantilla-ficha-tecnica.component.css']
})
export class CrearPlantillaFichaTecnicaComponent {

  private aspectosGeneralesCargados = false;
  private especificacionesCargadas = false;

  public accionSeleccionada: string = 'crear';
  public mostrarInputsEditar: boolean = false;

   public seccionSeleccionada: string = '';
   public descripcionDePlantilla: string = '';

  seccionesDePlantilla = [
    { label: 'Aspectos Generales', value: 'formularioAspectosGenerales' },
    { label: 'Especificaciones', value: 'formularioDeEspecificaciones' }
  ];

  public plantillaSeleccionada: any;

  public formularioAspectosGenerales: FormGroup;
  public formularioEspecificaciones: FormGroup;
  
  public listaDeAspectosGeneralesPlantilla: FtAspectosGeneralesPlantillaDTO[] = [];

  public nombrePlantilla: string = "";
  public nombreDeProducto: string = "";

  //!Seccion General
  public listaDeMarcas: FtMarcaDTO[] = [];
  public listaDeTiposDeUso: FtTipoDeUsoDTO[] = [];
  public listaDeAlergenos: FtAlergenosDTO[] = [];
  public listaDeCondicionesAlmacenamiento: FtCondicionDeAlmacenamientoDTO[] = [];
  public listaDeVidaUtil: FtVidaUtilDTO[] = [];
  public listaDeTiposDeEnvase: FtTipoDeEnvaseDTO[] = [];
  public listaDePresentacionesDeEnvase: FtPresentacionDeEnvaseDTO[] = [];
  public listaDeDestinos: FtDestinoDTO[] = [];

  //!Seccion Especificaciones
  public listaDeColores: FtColorDTO[] = [];
  public listaDeOlores: FtOlorDTO[] = [];
  public listaDePh: FtPhDTO[] = [];


  constructor(
    private formulario: FormBuilder,
    private _FtAspectosGeneralesService: FtAspectosGeneralesService,
    private _FtEspecificacionesService: FtEspecificacionesService,
    private _FtPrecargaDeDatos: FtPrecargaDeDatosService
  ) {

    this.formularioAspectosGenerales = this.formulario.group({
      seccionDePlantilla: [''], 
      nombre: ['', Validators.required],
      nombreDeProducto: ['', Validators.required],
      idMarca: [null, Validators.required],
      idDestino: '1',
      idTipoDeUso: [null, Validators.required],
      idAlergeno: [null, Validators.required],
      idCondicionAlmacenamiento: [null, Validators.required], 
      idVidaUtil: [null, Validators.required],
      idTipoDeEnvase: [null, Validators.required],
      idPresentacionDeEnvase: [null, Validators.required],
      pesoPromedio: [null, [Validators.required, Validators.min(0)]],
      unidadesPorCaja: [null, [Validators.required, Validators.min(1)]],
      dimensiones: ['', Validators.required]
    });
    

    this.formularioEspecificaciones = this.formulario.group({
      nombre: ['', Validators.required], 
      grasaVisible: ['N/A'], 
      espesorCobertura: ['N/A'], 
      ganglios: ['Ausencia/Absence'], 
      hematomas: ['Ausencia/Absence'],     
      huesosCartilagos: ['Ausencia/Absence'], 
      elementosExtraños: ['Ausencia/Absence'], 
      idColor: [null, Validators.required], 
      idOlor: [null, Validators.required],
      idPh: [null, Validators.required], 

      aerobiosMesofilosTotales: ['Inicio/Start <5,0x10⁴   Fin/end <1,0x10⁷'], 
      enviarAerobiosMesofilosTotales: [true], 

      enterobacterias: ['<1x10³'], 
      enviarEnterobacterias: [true], 

      stec0157: ['Ausencia/Absence'], 
      enviarStec: [true], 

      stecNo0157: ['Ausencia/Absence'], 
      enviarNoStec: [true], 
      
      salmonella: ['Ausencia/Absence'], 
      enviarSalmonella: [true], 

      estafilococos: ['<1x10²'], 
      enviarEstafilococos: [true], 

      pseudomonas: ['Inicio/start <1,0x105  Fin/end <1,0x106'], 
      enviarPseudomonas: [true], 

      escherichiaColi: ['m= 5x102  /  M 5x103'], 
      enviarEscherichiaColi: [true], 

      coliformesTotales: ['<1x10³'], 
      enviarColiformes: [true], 

      coliformesFecales: ['<5x10¹'], 
      enviarColiformesFecales: [true], 
    });
  }    

  public GenerarListasDeCampos(datosDeLista: string) {
    if (this.seccionSeleccionada === 'formularioAspectosGenerales') {
        if (!this.aspectosGeneralesCargados) {
            this._FtPrecargaDeDatos.CargarAspectosGenerales();
            this.aspectosGeneralesCargados = true; 
        }

        switch (datosDeLista) {
            case 'marcas':
                return this._FtPrecargaDeDatos.listaDeMarcas;
            case 'tiposDeUso':
                return this._FtPrecargaDeDatos.listaDeTiposDeUso;
            case 'alergeno':
                return this._FtPrecargaDeDatos.listaDeAlergenos;
            case 'condicionDeAlmacenamiento':
                return this._FtPrecargaDeDatos.listaDeCondicionesAlmacenamiento;
            case 'vidaUtil':
                return this._FtPrecargaDeDatos.listaDeVidaUtil;
            case 'tipoDeEnvase':
                return this._FtPrecargaDeDatos.listaDeTiposDeEnvase;
            case 'presentacionDeEnvase':
                return this._FtPrecargaDeDatos.listaDePresentacionesDeEnvase;
            default:
                return [];
        }
    } else if (this.seccionSeleccionada === 'formularioDeEspecificaciones') {
        if (!this.especificacionesCargadas) {
            this._FtPrecargaDeDatos.CargarEspecificaciones();
            this.especificacionesCargadas = true; 
        }

        switch (datosDeLista) {
            case 'colores':
                return this._FtPrecargaDeDatos.listaDeColores;
            case 'olores':
                return this._FtPrecargaDeDatos.listaDeOlores;
            case 'ph':
                return this._FtPrecargaDeDatos.listaDePh;
            default:
                return [];
        }
    }
    return [];
  }


  public EnviarFormularioAspectosGenerales(): void {

    let nuevaPlantilla: any;

    if ( this.formularioAspectosGenerales.valid) {
      nuevaPlantilla = {
        seccionDePlantilla: 'AspectosGenerales',
        nombre: this.formularioAspectosGenerales.value.nombre,
        nombreDeProducto: this.formularioAspectosGenerales.value.nombreDeProducto,
        idMarca: this.formularioAspectosGenerales.value.idMarca,
        idTipoDeUso: this.formularioAspectosGenerales.value.idTipoDeUso,
        idAlergeno: this.formularioAspectosGenerales.value.idAlergeno,
        idCondicionAlmacenamiento: this.formularioAspectosGenerales.value.idCondicionAlmacenamiento,
        idVidaUtil: this.formularioAspectosGenerales.value.idVidaUtil,
        idTipoDeEnvase: this.formularioAspectosGenerales.value.idTipoDeEnvase,
        idPresentacionDeEnvase: this.formularioAspectosGenerales.value.idPresentacionDeEnvase,
        pesoPromedio: this.formularioAspectosGenerales.value.pesoPromedio,
        unidadesPorCaja: this.formularioAspectosGenerales.value.unidadesPorCaja,
        dimensiones: this.formularioAspectosGenerales.value.dimensiones,
      };
      
    } else {
      console.error('Formulario inválido o sección no seleccionada');
    }

    this._FtAspectosGeneralesService.CrearPlantillaAspectosGenerales(nuevaPlantilla).subscribe(
      (response: ApiResponse) => {
        
        Swal.fire({
                    title: 'Exito',
                    text: 'Formulario enviado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });                
                this.formularioAspectosGenerales.reset();
                this.seccionSeleccionada = '';
      },
      (error) => {
        console.error('Error al enviar a la API:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al enviar el formulario. Intente nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
      }
    );
  }

  public EnviarFormularioEspecificaciones(): void {
    let nuevaPlantilla: any;

    if (this.formularioEspecificaciones.valid) {
      nuevaPlantilla = {
          seccionDePlantilla: 'Especificaciones',
          nombre: this.formularioEspecificaciones.value.nombre,
          grasaVisible: this.formularioEspecificaciones.value.grasaVisible,
          espesorCobertura: this.formularioEspecificaciones.value.espesorCobertura,
          ganglios: this.formularioEspecificaciones.value.ganglios,
          hematomas: this.formularioEspecificaciones.value.hematomas,
          huesosCartilagos: this.formularioEspecificaciones.value.huesosCartilagos,
          elementosExtraños: this.formularioEspecificaciones.value.elementosExtraños,
          idColor: this.formularioEspecificaciones.value.idColor,
          idOlor: this.formularioEspecificaciones.value.idOlor,
          idPh: this.formularioEspecificaciones.value.idPh,
          aerobiosMesofilosTotales: this.formularioEspecificaciones.value.enviarAerobiosMesofilosTotales ? this.formularioEspecificaciones.value.aerobiosMesofilosTotales : 'NO APLICA',
          enterobacterias: this.formularioEspecificaciones.value.enviarEnterobacterias ? this.formularioEspecificaciones.value.enterobacterias : 'NO APLICA',
          stec0157: this.formularioEspecificaciones.value.enviarStec ? this.formularioEspecificaciones.value.stec0157 : 'NO APLICA',
          stecNo0157: this.formularioEspecificaciones.value.enviarNoStec ? this.formularioEspecificaciones.value.stecNo0157 : 'NO APLICA',
          salmonella: this.formularioEspecificaciones.value.enviarSalmonella ? this.formularioEspecificaciones.value.salmonella : 'NO APLICA',
          estafilococos: this.formularioEspecificaciones.value.enviarEstafilococos ? this.formularioEspecificaciones.value.estafilococos : 'NO APLICA',
          pseudomonas: this.formularioEspecificaciones.value.enviarPseudomonas ? this.formularioEspecificaciones.value.pseudomonas : 'NO APLICA',
          escherichiaColi: this.formularioEspecificaciones.value.enviarEscherichiaColi ? this.formularioEspecificaciones.value.escherichiaColi : 'NO APLICA',
          coliformesTotales: this.formularioEspecificaciones.value.enviarColiformes ? this.formularioEspecificaciones.value.coliformesTotales : 'NO APLICA',
          coliformesFecales: this.formularioEspecificaciones.value.enviarColiformesFecales ? this.formularioEspecificaciones.value.coliformesFecales : 'NO APLICA'
      };

        this._FtEspecificacionesService.CrearPlantillaEspecificaiones(nuevaPlantilla).subscribe(
            (response: ApiResponse) => {
                
              Swal.fire({
                title: 'Exito',
                text: 'Formulario enviado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });           
              this.nombrePlantilla = '';     
              this.seccionSeleccionada = '';

            },
            (error) => {

              Swal.fire({
                  title: 'Error',
                  text: 'Hubo un problema al enviar el formulario. Intente nuevamente.',
                  icon: 'error',
                  confirmButtonText: 'Aceptar'
              });
            }
          );
        } else {
          console.error('Formulario inválido o sección no seleccionada');
       }    
  }


  public EditarPlantillaDeAspectosGenerales(): void {

    if (!this.plantillaSeleccionada) {
      Swal.fire('Error', 'Por favor, primero busca una plantilla. o cambia la accion a editar', 'error');
      return; 
    }

    if (this.formularioAspectosGenerales.valid) {
      const plantillaEditada: FtAspectosGeneralesPlantillaDTO = {
        idPlantilla: this.plantillaSeleccionada.idPlantilla, 
        seccionDePlantilla: 'AspectosGenerales',
        nombre: this.formularioAspectosGenerales.value.nombre,
        nombreDeProducto: this.formularioAspectosGenerales.value.nombreDeProducto,
        idMarca: this.formularioAspectosGenerales.value.idMarca,
        idTipoDeUso: this.formularioAspectosGenerales.value.idTipoDeUso,
        idAlergeno: this.formularioAspectosGenerales.value.idAlergeno,
        idCondicionAlmacenamiento: this.formularioAspectosGenerales.value.idCondicionAlmacenamiento,
        idVidaUtil: this.formularioAspectosGenerales.value.idVidaUtil,
        idTipoDeEnvase: this.formularioAspectosGenerales.value.idTipoDeEnvase,
        idPresentacionDeEnvase: this.formularioAspectosGenerales.value.idPresentacionDeEnvase,
        pesoPromedio: this.formularioAspectosGenerales.value.pesoPromedio,
        unidadesPorCaja: this.formularioAspectosGenerales.value.unidadesPorCaja,
        dimensiones: this.formularioAspectosGenerales.value.dimensiones,
      };
  
      this._FtAspectosGeneralesService.EditarCamposDeAspectosGenerales(plantillaEditada).subscribe(
        (response: ApiResponse) => {
          if (response.esCorrecto) {
            Swal.fire('Éxito', 'La plantilla se editó correctamente.', 'success');
            // Limpiar el formulario o realizar otras acciones si es necesario
          } else {
            Swal.fire('Error', response.mensaje!, 'error');
          }
        },
        error => {
          Swal.fire('Error', 'Hubo un problema al editar la plantilla.', 'error');
        }
      );
    } else {
      Swal.fire('Advertencia', 'Por favor, completa todos los campos requeridos.', 'warning');
    }
  }

   

  public EditarFormularioEspecificaciones(): void {
    
    if (!this.plantillaSeleccionada) {
      Swal.fire('Error', 'Por favor, primero busca una plantilla. o cambia la accion a editar', 'error');
      return; 
    }

    if (this.formularioEspecificaciones.valid) {
      const plantillaEditada: FtEspecificacionesPlantillaDTO = {
        idPlantilla: this.plantillaSeleccionada.idPlantilla, 
        seccionDePlantilla: 'Especificaciones',
        nombre: this.formularioEspecificaciones.value.nombre,
        grasaVisible: this.formularioEspecificaciones.value.grasaVisible,
        espesorCobertura: this.formularioEspecificaciones.value.espesorCobertura,
        ganglios: this.formularioEspecificaciones.value.ganglios,
        hematomas: this.formularioEspecificaciones.value.hematomas,
        huesosCartilagos: this.formularioEspecificaciones.value.huesosCartilagos,
        elementosExtraños: this.formularioEspecificaciones.value.elementosExtraños,
        idColor: this.formularioEspecificaciones.value.idColor,
        idOlor: this.formularioEspecificaciones.value.idOlor,
        idPh: this.formularioEspecificaciones.value.idPh,
        aerobiosMesofilosTotales: this.formularioEspecificaciones.value.aerobiosMesofilosTotales,
        enterobacterias: this.formularioEspecificaciones.value.enviarEnterobacterias ? this.formularioEspecificaciones.value.enterobacterias : 'NO APLICA',
        stec0157: this.formularioEspecificaciones.value.enviarStec ? this.formularioEspecificaciones.value.stec0157 : 'NO APLICA',
        stecNo0157: this.formularioEspecificaciones.value.enviarNoStec ? this.formularioEspecificaciones.value.stecNo0157 : 'NO APLICA',
        salmonella: this.formularioEspecificaciones.value.enviarSalmonella ? this.formularioEspecificaciones.value.salmonella : 'NO APLICA',
        estafilococos: this.formularioEspecificaciones.value.enviarEstafilococos ? this.formularioEspecificaciones.value.estafilococos : 'NO APLICA',
        pseudomonas: this.formularioEspecificaciones.value.enviarPseudomonas ? this.formularioEspecificaciones.value.pseudomonas : 'NO APLICA',
        escherichiaColi: this.formularioEspecificaciones.value.enviarEscherichiaColi ? this.formularioEspecificaciones.value.escherichiaColi : 'NO APLICA',
        coliformesTotales: this.formularioEspecificaciones.value.enviarColiformes ? this.formularioEspecificaciones.value.coliformesTotales : 'NO APLICA',
        coliformesFecales: this.formularioEspecificaciones.value.coliformesFecales ? this.formularioEspecificaciones.value.coliformesFecales : 'NO APLICA',
      };
  
      this._FtEspecificacionesService.EditarCamposDeEspecificaciones(plantillaEditada).subscribe(
        (response: ApiResponse) => {
          Swal.fire({
            title: 'Éxito',
            text: 'Formulario editado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          // Reiniciar el formulario y secciones
          this.formularioEspecificaciones.reset();
          this.seccionSeleccionada = '';
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al editar el formulario. Intente nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    } else {
      console.error('Formulario inválido o sección no seleccionada');
    }
  }
}