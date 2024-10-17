import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtAlergenosDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Alergenos/FtAlergenosDTO';
import { FtColorDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Colores/FtColorDTO';
import { FtCondicionDeAlmacenamientoDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/CondicionDeAlmacenamiento/FtCondicionAlmacenamientoDTO';
import { FtMarcaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Marcas/FtMarcaDTO';
import { FtOlorDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Olor/FtOlorDTO';
import { FtPhDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Ph/FtPhDTO';
import { FtPresentacionDeEnvaseDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/PresentacionDeEnvase/FtPresentacionDeEnvaseDTO';
import { FtTipoDeEnvaseDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/TipoDeEnvase/FtTipoDeEnvaseDTO';
import { FtTipoDeUsoDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/TipoDeUso/FtTipoDeUsoDTO';
import { FtVidaUtilDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/VidaUtil/FtVidaUtilDTO';
import { FtAspectosGeneralesService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CrearProductoFichaTecnicaServicios/FtPlantilla/FtaspectosGenerales.service';
import { FtEspecificacionesService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CrearProductoFichaTecnicaServicios/FtPlantilla/FtEspecificaciones.service';
import { FtAlergenosService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtAlergenos/FtAlergenos.service';
import { FtColorService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtColor/FtColor.service';
import { FtCondicionAlmacenamientoService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtCondicionAlmacenamiento/FtCondicionAlmacenamiento.service';
import { FtMarcaService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtMarcas/FtMarcaService.service';
import { FtOlorService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtOlor/FtOlor.service';
import { FtPhService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtPh/FtPh.service';
import { FtPresentacionDeEnvaseService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtPresentacionDeEnvase/FtPresentacionDeEnvase.service';
import { FtTipoDeEnvaseService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtTipoDeEnvase/FtTipoDeEnvase.service';
import { FtTipoDeUsoService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtTipoDeUso/FtTipoDeUso.service';
import { FtVidaUtilService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtVidaUtil/FtVidaUtil.service';

@Component({
  selector: 'component-crear-plantilla-ficha-tecnica',
  templateUrl: './crear-plantilla-ficha-tecnica.component.html',
  styleUrls: ['./crear-plantilla-ficha-tecnica.component.css']
})
export class CrearPlantillaFichaTecnicaComponent {

  public formularioAspectosGenerales: FormGroup;
  public formularioEspecificaciones: FormGroup;
  public seccionSeleccionada: string = '';

  //!Seccion General
  public listaDeMarcas: FtMarcaDTO[] = [];
  //public listaDeDestinos: FtDestinoDTo[] = [];
  public listaDeTiposDeUso: FtTipoDeUsoDTO[] = [];
  public listaDeAlergenos: FtAlergenosDTO[] = [];
  public listaDeCondicionesAlmacenamiento: FtCondicionDeAlmacenamientoDTO[] = [];
  public listaDeVidaUtil: FtVidaUtilDTO[] = [];
  public listaDeTiposDeEnvase: FtTipoDeEnvaseDTO[] = [];
  public listaDePresentacionesDeEnvase: FtPresentacionDeEnvaseDTO[] = [];


  //!Seccion Especificaciones
  public listaDeColores: FtColorDTO[] = [];
  public listaDeOlores: FtOlorDTO[] = [];
  public listaDePh: FtPhDTO[] = [];

  ngOnInit(): void {
    this.CargarMarcas();
    this.CargarColores(); 
    this.CargarOlores();
    this.CargarPh();
    //this.CargarDestinos();
    this.CargarTiposDeUso();
    this.CargarAlergenos();
    this.CargarCondicionesAlmacenamiento();
    this.CargarVidaUtil();
    this.CargarTiposDeEnvase();
    this.CargarPresentacionesDeEnvase();
  }
  

  constructor(
    private formulario: FormBuilder,
    private _FtAspectosGeneralesService: FtAspectosGeneralesService,
    private _FtEspecificacionesService: FtEspecificacionesService,

    private _FtColorService: FtColorService,
    private _FtOloresService: FtOlorService,
    private _FtPhService: FtPhService,
    private _FtMarcasService: FtMarcaService,
    //private _FtDestinoService: FtDestinoService,
    private _FtTipoUsoService: FtTipoDeUsoService,
    private _FtAlergenoService: FtAlergenosService,
    private _FtCondicionAlmacenamientoService: FtCondicionAlmacenamientoService,
    private _FtVidaUtilService: FtVidaUtilService,
    private _FtTipoEnvaseService: FtTipoDeEnvaseService,
    private _FtPresentacionEnvaseService: FtPresentacionDeEnvaseService
  ) {
    this.formularioAspectosGenerales = this.formulario.group({
      seccionDePlantilla: [''], // Agregado
      nombre: ['', Validators.required],
      idMarca: [null, Validators.required],
      //idDestino: [null, Validators.required], // Descomentado para que sea requerido
      idDestino: '1',
      idTipoDeUso: [null, Validators.required],
      idAlergeno: [null, Validators.required],
      idCondicionAlmacenamiento: [null, Validators.required], // Corregido el nombre
      idVidaUtil: [null, Validators.required],
      idTipoDeEnvase: [null, Validators.required],
      idPresentacionDeEnvase: [null, Validators.required],
      pesoPromedio: [null, [Validators.required, Validators.min(0)]],
      unidadesPorCaja: [null, [Validators.required, Validators.min(1)]],
      dimensiones: ['', Validators.required] // Agregado
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
      aerobiosMesofilosTotales: ['', Validators.required], 

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

      coliformesTotales: ['<5x10¹'], 
      enviarColiformes: [true], 
    });
  }    

  public EnviarFormularioAspectosGenerales(): void {
    let nuevaPlantilla: any;

    if ( this.formularioAspectosGenerales.valid) {
      nuevaPlantilla = {
        seccionDePlantilla: 'Formularo Aspectos Generales',
        nombre: this.formularioAspectosGenerales.value.nombre,
        idMarca: this.formularioAspectosGenerales.value.idMarca,
        idDestino: this.formularioAspectosGenerales.value.idDestino, 
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
      console.log('formularioAspectosGenerales:', nuevaPlantilla);
      
    } else {
      console.error('Formulario inválido o sección no seleccionada');
    }

    this._FtAspectosGeneralesService.CrearPlantillaAspectosGenerales(nuevaPlantilla).subscribe(
      (response: ApiResponse) => {
        console.log('Respuesta de la API:', response);
        // Aquí puedes manejar la respuesta de la API
      },
      (error) => {
        console.error('Error al enviar a la API:', error);
      }
    );
  }


  public EnviarFormularioEspecificaciones(): void {
    let nuevaPlantilla: any;

    if (this.formularioEspecificaciones.valid) {
      nuevaPlantilla = {
          seccionDePlantilla: 'Formulario Especificaciones',
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
          enterobacterias: this.formularioEspecificaciones.value.enviarEnterobacterias ? this.formularioEspecificaciones.value.enterobacterias : 'no aplica',
          stec0157: this.formularioEspecificaciones.value.enviarStec ? this.formularioEspecificaciones.value.stec0157 : 'no aplica',
          stecNo0157: this.formularioEspecificaciones.value.enviarNoStec ? this.formularioEspecificaciones.value.stecNo0157 : 'no aplica',
          salmonella: this.formularioEspecificaciones.value.enviarSalmonella ? this.formularioEspecificaciones.value.salmonella : 'no aplica',
          estafilococos: this.formularioEspecificaciones.value.enviarEstafilococos ? this.formularioEspecificaciones.value.estafilococos : 'no aplica',
          pseudomonas: this.formularioEspecificaciones.value.enviarPseudomonas ? this.formularioEspecificaciones.value.pseudomonas : 'no aplica',
          escherichiaColi: this.formularioEspecificaciones.value.enviarEscherichiaColi ? this.formularioEspecificaciones.value.escherichiaColi : 'no aplica',
          coliformesTotales: this.formularioEspecificaciones.value.enviarColiformes ? this.formularioEspecificaciones.value.coliformesTotales : 'no aplica'
      };

        console.log('Formulario Especificaciones:', nuevaPlantilla);

        // Llama al servicio para crear la plantilla de especificaciones
        this._FtEspecificacionesService.CrearPlantillaEspecificaiones(nuevaPlantilla).subscribe(
            (response: ApiResponse) => {
                console.log('Respuesta de la API:', response);
                // Aquí puedes manejar la respuesta de la API
            },
            (error) => {
                console.error('Error al enviar a la API:', error);
            }
          );
        } else {
          console.error('Formulario inválido o sección no seleccionada');
      }    
  }

  //!Precarga de datos generales 

  private CargarMarcas(){
    this._FtMarcasService.GetListaDeMarcasFichaTecnica().subscribe({
      next: (response) => {
          this.listaDeMarcas = response.resultado.map((ph: FtMarcaDTO) => ({
              idMarca: ph.idMarca, 
              nombre: ph.descripcion 
          }));
      },
      error: (error) => {
          console.error('Error al obtener las Marcas', error);
      }
    });
  }
  
  // private CargarDestinos(): void {
  //   this._FtDestinoService.GetListaDeDestinosFichaTecnica().subscribe({
  //     next: (response) => {
  //       this.listaDeDestinos = response.resultado.map((destino: FtDestinoDTO) => ({
  //         idDestino: destino.idDestino,
  //         descripcion: destino.descripcion
  //       }));
  //     },
  //     error: (error) => {
  //       console.error('Error al obtener los destinos', error);
  //     }
  //   });
  // }
  
  private CargarTiposDeUso(): void {
    this._FtTipoUsoService.GetListaDeTiposDeUsoFichaTecnica().subscribe({
      next: (response) => {
        this.listaDeTiposDeUso = response.resultado.map((tipoUso: FtTipoDeUsoDTO) => ({
          idTipoDeUso: tipoUso.idTipoDeUso,
          descripcion: tipoUso.descripcion
        }));
      },
      error: (error) => {
        console.error('Error al obtener los tipos de uso', error);
      }
    });
  }
  
  private CargarAlergenos(): void {
    this._FtAlergenoService.GetListaDeAlergenosFichaTecnica().subscribe({
      next: (response) => {
        this.listaDeAlergenos = response.resultado.map((alergeno: FtAlergenosDTO) => ({
          idAlergeno: alergeno.idAlergeno,
          descripcion: alergeno.descripcion          
        }));
        
      },
      error: (error) => {
        console.error('Error al obtener los alérgenos', error);
      }
    });
  }
  
  private CargarCondicionesAlmacenamiento(): void {
    this._FtCondicionAlmacenamientoService.GetListaDeCondicionesFichaTecnica().subscribe({
      next: (response) => {
        this.listaDeCondicionesAlmacenamiento = response.resultado.map((condicion: FtCondicionDeAlmacenamientoDTO) => ({
          idCondicionDeAlmacenamiento: condicion.idCondicionDeAlmacenamiento,
          descripcion: condicion.descripcion
        }));
      },
      error: (error) => {
        console.error('Error al obtener las condiciones de almacenamiento', error);
      }
    });
  }
  
  private CargarVidaUtil(): void {
    this._FtVidaUtilService.GetListaDeVidaUtilFichaTecnica().subscribe({
      next: (response) => {
        this.listaDeVidaUtil = response.resultado.map((vidaUtil: FtVidaUtilDTO) => ({
          idVidaUtil: vidaUtil.idVidaUtil,
          nombre: vidaUtil.nombre
        }));
      },
      error: (error) => {
        console.error('Error al obtener la vida útil', error);
      }
    });
  }
  
  private CargarTiposDeEnvase(): void {
    this._FtTipoEnvaseService.GetListaDeTiposDeEnvaseFichaTecnica().subscribe({
      next: (response) => {
        this.listaDeTiposDeEnvase = response.resultado.map((tipoEnvase: FtTipoDeEnvaseDTO) => ({
          idTipoDeEnvase: tipoEnvase.idTipoDeEnvase,
          descripcion: tipoEnvase.descripcion
        }));
      },
      error: (error) => {
        console.error('Error al obtener los tipos de envase', error);
      }
    });
  }
  
  private CargarPresentacionesDeEnvase(): void {
    this._FtPresentacionEnvaseService.GetListaDePresentacionesDeEnvaseFichaTecnica().subscribe({
      next: (response) => {
        this.listaDePresentacionesDeEnvase = response.resultado.map((presentacion: FtPresentacionDeEnvaseDTO) => ({
          idPresentacionDeEnvase: presentacion.idPresentacionDeEnvase,
          descripcion: presentacion.descripcion
        }));
      },
      error: (error) => {
        console.error('Error al obtener las presentaciones de envase', error);
      }
    });
  }
  

  //!Precarga aspectos generales
 

  private CargarColores(): void {
    this._FtColorService.GetListaDeColoresFichaTecnica().subscribe({
      next: (response) => {
        this.listaDeColores = response.resultado.map((color: FtColorDTO) => ({
          idColor: color.idColor,
          descripcion: color.descripcion
        }));
      },
      error: (error) => {
        console.error('Error al obtener los colores', error);
      }
    });
  }

  private CargarOlores(): void {
      this._FtOloresService.GetListaDeOloresFichaTecnica().subscribe({
        next: (response) => {
            this.listaDeOlores = response.resultado.map((olor: FtOlorDTO) => ({
                idOlor: olor.idOlor, 
                descripcion: olor.descripcion 
            }));
        },
        error: (error) => {
            console.error('Error al obtener los olores', error);
        }
    }); 
  }

  private CargarPh(){
    this._FtPhService.GetListaDePhFichaTecnica().subscribe({
      next: (response) => {
          this.listaDePh = response.resultado.map((ph: FtPhDTO) => ({
              idPh: ph.idPh, 
              nombre: ph.nombre 
          }));
      },
      error: (error) => {
          console.error('Error al obtener los PHs', error);
      }
    });
  }
}