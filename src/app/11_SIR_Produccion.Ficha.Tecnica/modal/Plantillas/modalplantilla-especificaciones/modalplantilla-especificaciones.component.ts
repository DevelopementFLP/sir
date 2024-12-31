import { FtEspecificacionesPlantillaDTO } from './../../../interface/CreacionDeFichaTecnicaInterface/FtEspecificacionesDTO';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FtColorDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Colores/FtColorDTO';
import { FtOlorDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Olor/FtOlorDTO';
import { FtPhDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Ph/FtPhDTO';
import { FtEspecificacionesService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtPlantilla/FtEspecificaciones.service';
import { FtColorService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtColor/FtColor.service';
import { FtOlorService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtOlor/FtOlor.service';
import { FtPhService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtPh/FtPh.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'modal-plantilla-especificaciones',
  templateUrl: './modalplantilla-especificaciones.component.html',
  styleUrls: ['./modalplantilla-especificaciones.component.css']
})
export class ModalplantillaEspecificacionesComponent {

  @Input() plantilla: FtEspecificacionesPlantillaDTO | null = null;
  @Output() modalCerrado: EventEmitter<string> = new EventEmitter<string>();

  public variableDeModal: string = 'especificaciones';
  public seModificoAlgunCampo: boolean = false;

  
  public colores: FtColorDTO[] = [];
  public olores: FtOlorDTO[] = [];
  public phs: FtPhDTO[] = [];


  public idPlantilla: number = 0;
  public seccionDePlantilla: string = '';
  public nombre: string = '';
  public grasaVisible: string = '';
  public espesorCobertura: string = '';
  public ganglios: string = '';
  public hematomas: string = '';
  public huesosCartilagos: string = '';
  public elementosExtranos: string = '';
  public idColor:  number = 0;
  public idOlor:  number = 0;
  public idPh:  number = 0;
  public aerobiosMesofilosTotales: string = '';
  public enterobacterias: string = '';
  public stec0157: string = '';
  public stecNo0157: string = '';
  public salmonella: string = '';
  public estafilococos: string = '';
  public pseudomonas: string = '';
  public escherichiaColi: string = '';
  public coliformesTotales: string = '';
  public coliformesFecales: string = '';
  
  // Variables para los checkboxes
  public enviarAerobiosMesofilosTotales: boolean = false;
  public enviarEnterobacterias: boolean = false;
  public enviarSTEC0157: boolean = false;
  public enviarSTECNo0157: boolean = false;
  public enviarSalmonella: boolean = false;
  public enviarEstafilococos: boolean = false;
  public enviarPseudomonas: boolean = false;
  public enviarEscherichiaColi: boolean = false;
  public enviarColiformesTotales: boolean = false;
  public enviarColiformesFecales: boolean = false;

  constructor(
    private _especificacionesService: FtEspecificacionesService,
    private _colorService: FtColorService,
    private _olorService: FtOlorService,
    private _phService: FtPhService,
  ) {}


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['plantilla'] && this.plantilla && this.plantilla.idPlantilla !== undefined) {
      this.idPlantilla = this.plantilla.idPlantilla;
      this.CargarDatosPlantilla(this.plantilla);
      this.CargarOpcionesSelect();      
    }
  }

  private CargarDatosPlantilla(plantilla: FtEspecificacionesPlantillaDTO): void {

    // Cargar los valores de la plantilla
    this.seccionDePlantilla = plantilla.seccionDePlantilla || 'Especificaciones';
    this.nombre = plantilla.nombre || 'Pendiente';
    this.grasaVisible = plantilla.grasaVisible || 'N/A';
    this.espesorCobertura = plantilla.espesorCobertura || 'N/A';
    this.ganglios = plantilla.ganglios || 'N/A';
    this.hematomas = plantilla.hematomas || 'N/A';
    this.huesosCartilagos = plantilla.huesosCartilagos || 'N/A';
    this.elementosExtranos = plantilla.elementosExtraños || 'N/A';
    this.idColor = plantilla.idColor || 0;
    this.idOlor = plantilla.idOlor || 0;
    this.idPh = plantilla.idPh || 0;
    this.aerobiosMesofilosTotales = plantilla.aerobiosMesofilosTotales || 'N/A';
    this.enterobacterias = plantilla.enterobacterias || 'N/A';
    this.stec0157 = plantilla.stec0157 || 'N/A';
    this.stecNo0157 = plantilla.stecNo0157 || 'N/A';
    this.salmonella = plantilla.salmonella || 'N/A';
    this.estafilococos = plantilla.estafilococos || 'N/A';
    this.pseudomonas = plantilla.pseudomonas || 'N/A';
    this.escherichiaColi = plantilla.escherichiaColi || 'N/A';
    this.coliformesTotales = plantilla.coliformesTotales || 'N/A';
    this.coliformesFecales = plantilla.coliformesFecales || 'N/A';
  

    this.enviarAerobiosMesofilosTotales = this.aerobiosMesofilosTotales !== 'N/A' && this.aerobiosMesofilosTotales !== 'NO APLICA';
    this.enviarEnterobacterias = this.enterobacterias !== 'N/A' && this.enterobacterias !== 'NO APLICA';
    this.enviarSTEC0157 = this.stec0157 !== 'N/A' && this.stec0157 !== 'NO APLICA';
    this.enviarSTECNo0157 = this.stecNo0157 !== 'N/A' && this.stecNo0157 !== 'NO APLICA';
    this.enviarSalmonella = this.salmonella !== 'N/A' && this.salmonella !== 'NO APLICA';
    this.enviarEstafilococos = this.estafilococos !== 'N/A' && this.estafilococos !== 'NO APLICA';
    this.enviarPseudomonas = this.pseudomonas !== 'N/A' && this.pseudomonas !== 'NO APLICA';
    this.enviarEscherichiaColi = this.escherichiaColi !== 'N/A' && this.escherichiaColi !== 'NO APLICA';
    this.enviarColiformesTotales = this.coliformesTotales !== 'N/A' && this.coliformesTotales !== 'NO APLICA';
    this.enviarColiformesFecales = this.coliformesFecales !== 'N/A' && this.coliformesFecales !== 'NO APLICA';
  }
  


  private CargarOpcionesSelect(): void {

    this.colores = [];
    this.olores = [];
    this.phs = [];
  

    this._colorService.GetListaDeColoresFichaTecnica().subscribe(
      (response) => {
        if (response && response.resultado) {
          this.colores = response.resultado;
  
          if (this.idColor > 0) {
            const colorSeleccionada = this.colores.find(color => color.idColor === this.idColor);
            if (colorSeleccionada) {
              this.idColor = colorSeleccionada.idColor;
            }
          }
        } else {
          console.error('No se encontraron colores.');
        }
      },
      (error) => {
        console.error('Error al cargar las colores:', error);
      }
    );
  
    // Llamamos al servicio para obtener la lista de tipos de uso
    this._olorService.GetListaDeOloresFichaTecnica().subscribe(
      (response) => {
        if (response && response.resultado) {
          this.olores = response.resultado;
  
          if (this.idOlor > 0) {
            const olorSeleccionado = this.olores.find(olor => olor.idOlor === this.idOlor);
            if (olorSeleccionado) {
              this.idOlor = olorSeleccionado.idOlor;
            }
          }
        } else {
          console.error('No se encontraron olores.');
        }
      },
      (error) => {
        console.error('Error al cargar olores:', error);
      }
    );
  

    this._phService.GetListaDePhFichaTecnica().subscribe(
      (response) => {
        if (response && response.resultado) {
          this.phs = response.resultado;
  
          if (this.idPh > 0) {
            const phSeleccionado = this.phs.find(ph => ph.idPh === this.idPh);
            if (phSeleccionado) {
              this.idPh = phSeleccionado.idPh;
            }
          }
        } else {
          console.error('No se encontraron ph.');
        }
      },
      (error) => {
        console.error('Error al cargar los ph:', error);
      }
    );
  }

  public VerificarCambios(): void {

    this.seModificoAlgunCampo = (
      this.seccionDePlantilla !== this.plantilla?.seccionDePlantilla ||
      this.nombre !== this.plantilla?.nombre ||
      this.grasaVisible !== this.plantilla?.grasaVisible ||
      this.espesorCobertura !== this.plantilla?.espesorCobertura ||
      this.ganglios !== this.plantilla?.ganglios ||
      this.hematomas !== this.plantilla?.hematomas ||
      this.huesosCartilagos !== this.plantilla?.huesosCartilagos ||
      this.elementosExtranos !== this.plantilla?.elementosExtraños ||
      this.idColor !== this.plantilla?.idColor ||
      this.idOlor !== this.plantilla?.idOlor ||
      this.idPh !== this.plantilla?.idPh ||
      this.aerobiosMesofilosTotales !== this.plantilla?.aerobiosMesofilosTotales ||
      this.enterobacterias !== this.plantilla?.enterobacterias ||
      this.stec0157 !== this.plantilla?.stec0157 ||
      this.stecNo0157 !== this.plantilla?.stecNo0157 ||
      this.salmonella !== this.plantilla?.salmonella ||
      this.estafilococos !== this.plantilla?.estafilococos ||
      this.pseudomonas !== this.plantilla?.pseudomonas ||
      this.escherichiaColi !== this.plantilla?.escherichiaColi ||
      this.coliformesTotales !== this.plantilla?.coliformesTotales ||
      this.coliformesFecales !== this.plantilla?.coliformesFecales
      
    );
    
    // Si cualquier valor es diferente, se considera que el formulario ha sido modificado
    if (this.seModificoAlgunCampo) {
      console.log('Se detectaron cambios en los campos.');
    } else {
      console.log('No se detectaron cambios en los campos.');
    }
  }
  
  public async EditarPlantilla(): Promise<void> {

    const plantillaActualizada: FtEspecificacionesPlantillaDTO = {
      idPlantilla: this.idPlantilla,
      seccionDePlantilla: this.seccionDePlantilla,
      nombre: this.nombre,
      grasaVisible: this.grasaVisible,
      espesorCobertura: this.espesorCobertura,
      ganglios: this.ganglios,
      hematomas: this.hematomas,
      huesosCartilagos: this.huesosCartilagos,
      elementosExtraños: this.elementosExtranos,
      idColor: this.idColor,
      idOlor: this.idOlor,
      idPh: this.idPh,
      aerobiosMesofilosTotales: this.enviarAerobiosMesofilosTotales ? this.aerobiosMesofilosTotales : 'NO APLICA',
      enterobacterias: this.enviarEnterobacterias ? this.enterobacterias : 'NO APLICA',
      stec0157: this.enviarSTEC0157 ? this.stec0157 : 'NO APLICA',
      stecNo0157: this.enviarSTECNo0157 ? this.stecNo0157 : 'NO APLICA',
      salmonella: this.enviarSalmonella ? this.salmonella : 'NO APLICA',
      estafilococos: this.enviarEstafilococos ? this.estafilococos : 'NO APLICA',
      pseudomonas: this.enviarPseudomonas ? this.pseudomonas : 'NO APLICA',
      escherichiaColi: this.enviarEscherichiaColi ? this.escherichiaColi : 'NO APLICA',
      coliformesTotales: this.enviarColiformesTotales ? this.coliformesTotales : 'NO APLICA',
      coliformesFecales: this.enviarColiformesFecales ? this.coliformesFecales : 'NO APLICA',
    };

    if (!this.nombre || !this.grasaVisible || !this.espesorCobertura) {
      Swal.fire('Advertencia', 'Por favor, completa todos los campos requeridos.', 'warning');
      return;
    }

    this._especificacionesService.EditarCamposDeEspecificaciones(plantillaActualizada).subscribe(
      (response) => {
        if (response.esCorrecto) {
          Swal.fire('Éxito', 'La plantilla de especificaciones se actualizó correctamente.', 'success');
          this.modalCerrado.emit(this.variableDeModal);
        } else {
          Swal.fire('Error', response.mensaje || 'Ocurrió un error al actualizar la plantilla.', 'error');
          this.modalCerrado.emit(this.variableDeModal);
        }
      },
      (error) => {
        console.error('Error al editar la plantilla:', error);
        Swal.fire('Error', 'Ocurrió un error al actualizar la plantilla.', 'error');
        this.modalCerrado.emit(this.variableDeModal);
      }
    );
  }

}
