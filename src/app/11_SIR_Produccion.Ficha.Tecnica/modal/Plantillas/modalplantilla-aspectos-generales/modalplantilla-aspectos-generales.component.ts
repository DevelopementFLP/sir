import { FtPresentacionDeEnvaseDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/PresentacionDeEnvase/FtPresentacionDeEnvaseDTO';
import { FtTipoDeEnvaseDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/TipoDeEnvase/FtTipoDeEnvaseDTO';
import { FtCondicionDeAlmacenamientoDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/CondicionDeAlmacenamiento/FtCondicionAlmacenamientoDTO';
import { FtCondicionAlmacenamientoService } from './../../../service/MantenimientoFichaTecnicaServicios/FtCondicionAlmacenamiento/FtCondicionAlmacenamiento.service';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FtAspectosGeneralesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtAspectosGeneralesDTO';
import { FtAlergenosDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Alergenos/FtAlergenosDTO';
import { FtMarcaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Marcas/FtMarcaDTO';
import { FtTipoDeUsoDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/TipoDeUso/FtTipoDeUsoDTO';
import { FtAspectosGeneralesService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtPlantilla/FtAspectosGenerales.service';
import { FtAlergenosService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtAlergenos/FtAlergenos.service';
import { FtMarcaService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtMarcas/FtMarcaService.service';
import { FtPresentacionDeEnvaseService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtPresentacionDeEnvase/FtPresentacionDeEnvase.service';
import { FtTipoDeEnvaseService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtTipoDeEnvase/FtTipoDeEnvase.service';
import { FtTipoDeUsoService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtTipoDeUso/FtTipoDeUso.service';
import { FtVidaUtilService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtVidaUtil/FtVidaUtil.service';
import Swal from 'sweetalert2';
import { FtVidaUtilDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/VidaUtil/FtVidaUtilDTO';

@Component({
  selector: 'modal-plantilla-aspectos-generales',
  templateUrl: './modalplantilla-aspectos-generales.component.html',
  styleUrls: ['./modalplantilla-aspectos-generales.component.css']
})
export class ModalplantillaAspectosGeneralesComponent {

  @Input() plantilla: FtAspectosGeneralesPlantillaDTO | null = null;
  @Output() modalCerrado: EventEmitter<boolean> = new EventEmitter<boolean>();

  public seModificoAlgunCampo: boolean = false;

  // Opciones para los select
  public marcas: FtMarcaDTO[] = [];
  public tiposDeUso: FtTipoDeUsoDTO[] = [];
  public alergenos: FtAlergenosDTO[] = [];
  public condicionesDeAlmacenamiento: FtCondicionDeAlmacenamientoDTO[] = [];
  public vidasUtil: FtVidaUtilDTO[] = [];
  public tiposDeEnvase: FtTipoDeEnvaseDTO[] = [];
  public presentacionesDeEnvase: FtPresentacionDeEnvaseDTO[] = [];

  // Variables para los campos de la plantilla
  public idPlantilla: number = 0;
  public seccionDePlantilla: string = '';
  public nombreDePlantilla: string = '';
  public nombreDeProducto: string = '';
  public idMarca: number = 0;
  public idTipoDeUso: number = 0;
  public idAlergeno: number = 0;
  public idCondicionAlmacenamiento: number = 0;
  public idVidaUtil: number = 0;
  public idTipoDeEnvase: number = 0;
  public idPresentacionDeEnvase: number = 0;
  public pesoPromedio: number = 0;
  public unidadesPorCaja: number = 0;
  public dimensiones: string = '';

  constructor(
    private _aspectosGeneralesService: FtAspectosGeneralesService,
    private _marcasService: FtMarcaService,
    private _tipoDeUsoService: FtTipoDeUsoService,
    private _alergenoService: FtAlergenosService,
    private _condicionService: FtCondicionAlmacenamientoService,
    private _vidaUtilService: FtVidaUtilService,
    private _tipoDeEnvase: FtTipoDeEnvaseService,
    private _presentacionDeEnvaseService: FtPresentacionDeEnvaseService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.plantilla && changes['plantilla'] && this.plantilla.idPlantilla !== undefined) {
      this.idPlantilla = this.plantilla.idPlantilla;
      this.CargarDatosPlantilla(this.plantilla);
      this.CargarOpcionesSelect();      
    }
  }

  private CargarDatosPlantilla(plantilla: FtAspectosGeneralesPlantillaDTO): void {

    this.seccionDePlantilla = plantilla.seccionDePlantilla || 'NO APLICA';
    this.nombreDePlantilla = plantilla.nombre || 'NO APLICA';
    this.nombreDeProducto = plantilla.nombreDeProducto || 'NO APLICA';
  
    this.idMarca = plantilla.idMarca || 0;
    this.idTipoDeUso = plantilla.idTipoDeUso || 0;
    this.idAlergeno = plantilla.idAlergeno || 0;
    this.idCondicionAlmacenamiento = plantilla.idCondicionAlmacenamiento || 0;
    this.idVidaUtil = plantilla.idVidaUtil || 0;
    this.idTipoDeEnvase = plantilla.idTipoDeEnvase || 0;
    this.idPresentacionDeEnvase = plantilla.idPresentacionDeEnvase || 0;
    this.pesoPromedio = plantilla.pesoPromedio || 0;
    this.unidadesPorCaja = plantilla.unidadesPorCaja || 0;
    this.dimensiones = plantilla.dimensiones?.trim() || 'NO APLICA';
  
    // Asignar las marcas
    if (this.marcas.length > 0 && this.idMarca > 0) {
      const marcaSeleccionada = this.marcas.find(marca => marca.idMarca === this.idMarca);
      if (marcaSeleccionada) {
        this.idMarca = marcaSeleccionada.idMarca;
      }
    }
  
    // Asignar los tipos de uso
    if (this.tiposDeUso.length > 0 && this.idTipoDeUso > 0) {
      const tipoDeUsoSeleccionado = this.tiposDeUso.find(tipoDeUso => tipoDeUso.idTipoDeUso === this.idTipoDeUso);
      if (tipoDeUsoSeleccionado) {
        this.idTipoDeUso = tipoDeUsoSeleccionado.idTipoDeUso;
      }
    }
  
    // Asignar los alergenos
    if (this.alergenos.length > 0 && this.idAlergeno > 0) {
      const alergenoSeleccionado = this.alergenos.find(alergeno => alergeno.idAlergeno === this.idAlergeno);
      if (alergenoSeleccionado) {
        this.idAlergeno = alergenoSeleccionado.idAlergeno;
      }
    }
  
    // Asignar las condiciones de almacenamiento
    if (this.condicionesDeAlmacenamiento.length > 0 && this.idCondicionAlmacenamiento > 0) {
      const condicionSeleccionada = this.condicionesDeAlmacenamiento.find(condicion => condicion.idCondicionDeAlmacenamiento === this.idCondicionAlmacenamiento);
      if (condicionSeleccionada) {
        this.idCondicionAlmacenamiento = condicionSeleccionada.idCondicionDeAlmacenamiento;
        console.log(this.idCondicionAlmacenamiento)
      }
    }
  
    // Asignar las vidas útiles
    if (this.vidasUtil.length > 0 && this.idVidaUtil > 0) {
      const vidaUtilSeleccionada = this.vidasUtil.find(vidaUtil => vidaUtil.idVidaUtil === this.idVidaUtil);
      if (vidaUtilSeleccionada) {
        this.idVidaUtil = vidaUtilSeleccionada.idVidaUtil;
      }
    }
  
    // Asignar los tipos de envase
    if (this.tiposDeEnvase.length > 0 && this.idTipoDeEnvase > 0) {
      const tipoDeEnvaseSeleccionado = this.tiposDeEnvase.find(tipoDeEnvase => tipoDeEnvase.idTipoDeEnvase === this.idTipoDeEnvase);
      if (tipoDeEnvaseSeleccionado) {
        this.idTipoDeEnvase = tipoDeEnvaseSeleccionado.idTipoDeEnvase;
      }
    }

     // Asignar los tipos de envase
     if (this.presentacionesDeEnvase.length > 0 && this.idPresentacionDeEnvase > 0) {
      const prsentacionDeEnvase = this.presentacionesDeEnvase.find(prsentacionDeEnvase => prsentacionDeEnvase.idPresentacionDeEnvase === this.idPresentacionDeEnvase);
      if (prsentacionDeEnvase) {
        this.idPresentacionDeEnvase = prsentacionDeEnvase.idPresentacionDeEnvase;
      }
    }
  }
  

  private CargarOpcionesSelect(): void {

    
    // Llamamos al servicio para obtener la lista de marcas
    this._marcasService.GetListaDeMarcasFichaTecnica().subscribe(
      (response) => {
        if (response && response.resultado) {
          this.marcas = response.resultado;  
        } else {
          console.error('No se encontraron marcas.');
        }
      },
      (error) => {
        console.error('Error al cargar las marcas:', error);
      }
    );
  
    // Llamamos al servicio para obtener la lista de tipos de uso
    this._tipoDeUsoService.GetListaDeTiposDeUsoFichaTecnica().subscribe(
      (response) => {
        if (response && response.resultado) {
          this.tiposDeUso = response.resultado;
        } else {
          console.error('No se encontraron tipos de uso.');
        }
      },
      (error) => {
        console.error('Error al cargar los tipos de uso:', error);
      }
    );
  
    // Llamamos al servicio para obtener la lista de alergenos
    this._alergenoService.GetListaDeAlergenosFichaTecnica().subscribe(
      (response) => {
        if (response && response.resultado) {
          this.alergenos = response.resultado;
        } else {
          console.error('No se encontraron alergenos.');
        }
      },
      (error) => {
        console.error('Error al cargar los alergenos:', error);
      }
    );
  
    // Llamamos al servicio para obtener la lista de condiciones de almacenamiento
    this._condicionService.GetListaDeCondicionesFichaTecnica().subscribe(
      (response) => {
        if (response && response.resultado) {
          this.condicionesDeAlmacenamiento = response.resultado;
        } else {
          console.error('No se encontraron condiciones de almacenamiento.');
        }
      },
      (error) => {
        console.error('Error al cargar las condiciones de almacenamiento:', error);
      }
    );
  
    // Llamamos al servicio para obtener la lista de vida útil
    this._vidaUtilService.GetListaDeVidaUtilFichaTecnica().subscribe(
      (response) => {
        if (response && response.resultado) {
          this.vidasUtil = response.resultado;
        } else {
          console.error('No se encontraron vidas útiles.');
        }
      },
      (error) => {
        console.error('Error al cargar las vidas útiles:', error);
      }
    );
  
    // Llamamos al servicio para obtener la lista de tipos de envase
    this._tipoDeEnvase.GetListaDeTiposDeEnvaseFichaTecnica().subscribe(
      (response) => {
        if (response && response.resultado) {
          this.tiposDeEnvase = response.resultado;
        } else {
          console.error('No se encontraron tipos de envase.');
        }
      },
      (error) => {
        console.error('Error al cargar los tipos de envase:', error);
      }
    );

     this._presentacionDeEnvaseService.GetListaDePresentacionesDeEnvaseFichaTecnica().subscribe(
      (response) => {
        if (response && response.resultado) {
          this.presentacionesDeEnvase = response.resultado;
        } else {
          console.error('No se encontraron tipos de envase.');
        }
      },
      (error) => {
        console.error('Error al cargar los tipos de envase:', error);
      }
    );
  }
  

  public VerificarCambios(): void {
    // Verificar si algún campo ha sido modificado
    this.seModificoAlgunCampo = (
      this.seccionDePlantilla !== this.plantilla?.seccionDePlantilla ||
      this.nombreDePlantilla !== this.plantilla?.nombre ||
      this.nombreDeProducto !== this.plantilla?.nombreDeProducto ||
      this.idMarca !== this.plantilla?.idMarca ||
      this.idTipoDeUso !== this.plantilla?.idTipoDeUso ||
      this.idAlergeno !== this.plantilla?.idAlergeno ||
      this.idCondicionAlmacenamiento !== this.plantilla?.idCondicionAlmacenamiento ||
      this.idVidaUtil !== this.plantilla?.idVidaUtil ||
      this.idTipoDeEnvase !== this.plantilla?.idTipoDeEnvase ||
      this.idPresentacionDeEnvase !== this.plantilla?.idPresentacionDeEnvase ||
      this.pesoPromedio !== this.plantilla?.pesoPromedio ||
      this.unidadesPorCaja !== this.plantilla?.unidadesPorCaja ||
      this.dimensiones !== this.plantilla?.dimensiones
    );
  }

  public async EditarPlantilla(): Promise<void> {
    const plantillaActualizada: FtAspectosGeneralesPlantillaDTO = {
      idPlantilla: this.idPlantilla,
      seccionDePlantilla: this.seccionDePlantilla,
      nombre: this.nombreDePlantilla,
      nombreDeProducto: this.nombreDeProducto,
      idMarca: this.idMarca,
      idTipoDeUso: this.idTipoDeUso,
      idAlergeno: this.idAlergeno,
      idCondicionAlmacenamiento: this.idCondicionAlmacenamiento,
      idVidaUtil: this.idVidaUtil,
      idTipoDeEnvase: this.idTipoDeEnvase,
      idPresentacionDeEnvase: this.idPresentacionDeEnvase,
      pesoPromedio: this.pesoPromedio,
      unidadesPorCaja: this.unidadesPorCaja,
      dimensiones: this.dimensiones,
    };

    // Verificar si todos los campos requeridos están completos
    if (!this.nombreDePlantilla || !this.nombreDeProducto || !this.idMarca || !this.idTipoDeUso || !this.idCondicionAlmacenamiento || !this.idVidaUtil) {
      Swal.fire('Advertencia', 'Por favor, completa todos los campos requeridos.', 'warning');
      return;
    }

    // Llamar al servicio para editar la plantilla
    this._aspectosGeneralesService.EditarCamposDeAspectosGenerales(plantillaActualizada).subscribe(
      (response) => {
        if (response.esCorrecto) {
          Swal.fire('Éxito', 'La plantilla de aspectos generales se actualizó correctamente.', 'success');
          this.LimpiarCampos();
          this.modalCerrado.emit(true);
        } else {
          Swal.fire('Error', response.mensaje || 'Ocurrió un error al actualizar la plantilla.', 'error');
          this.LimpiarCampos();
        }
      },
      (error) => {
        console.error('Error al editar la plantilla:', error);
        this.LimpiarCampos();
      }
    );
  }

  private LimpiarCampos(): void {
    this.seccionDePlantilla = '';
    this.nombreDePlantilla = '';
    this.nombreDeProducto = '';
    this.idMarca = 0;
    this.idTipoDeUso = 0;
    this.idAlergeno = 0;
    this.idCondicionAlmacenamiento = 0;
    this.idVidaUtil = 0;
    this.idTipoDeEnvase = 0;
    this.idPresentacionDeEnvase = 0;
    this.pesoPromedio = 0;
    this.unidadesPorCaja = 0;
    this.dimensiones = '';
    this.seModificoAlgunCampo = false;
  }
  
}
