import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FtFichaTecnicaDTO } from '../../interface/CreacionDeFichaTecnicaInterface/FtFichaTecnicaDTO';
import { FtFichaTecnicaService } from '../../service/CreacionDeFichaTecnicaServicios/FtFichaTecnica/FtFichaTecnica.service';

import Swal from 'sweetalert2';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';

@Component({
  selector: 'app-editar-ficha-tecnica',
  templateUrl: './editar-ficha-tecnica.component.html',
  styleUrls: ['./editar-ficha-tecnica.component.css']
})
export class EditarFichaTecnicaComponent {

  @Input() ficha: FtFichaTecnicaDTO | null = null;
  @Output() cerrarModal = new EventEmitter<void>();

  public seModificoAlgunCampo: boolean = false;
  
  constructor(
    private _fichaTecnicaService: FtFichaTecnicaService,
  ) { }
 
  // Variables para cargar los datos de la ficha técnica en el formulario
  public idFichaTecnica: number = 0;
  public codigoProducto: string = '';
  public nombreProducto: string = '';
  public descripcionDelProducto: string = '';
  public destino: string = '';
  public marca: string = '';
  public tipoDeUso: string = '';
  public alergeno: string = '';
  public almacenamiento: string = '';
  public vidaUtil: string = '';
  public tipoDeEnvase: string = '';
  public presentacionDeEnvase: string = '';
  public pesoPromedio: number = 0;
  public unidadesPorCaja: number = 0;
  public dimensiones: string = '';
  public idioma: string = '';
  public grasaVisible: string = '';
  public espesorCobertura: string = '';
  public ganglios: string = '';
  public hematomas: string = '';
  public huesosCartilagos: string = '';
  public elementosExtranos: string = '';  
  public color: string = '';
  public olor: string = '';
  public ph: string = '';
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
  public observacionDelProducto: string = '';
  public elaboradoPor: string = '';
  public aprobadoPor: string = '';
  public fechaDelDia: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ficha && changes['ficha'] && this.ficha.idFichaTecnica !== undefined) {
      // Asignar el idFichaTecnica al recibir nuevos datos de ficha
      this.idFichaTecnica = this.ficha.idFichaTecnica;
      this.CargarDatosFichaTecnica(this.ficha);
      console.log(this.idFichaTecnica)
    }
  }

   private CargarDatosFichaTecnica(ficha: FtFichaTecnicaDTO): void {
    // Datos generales del producto
    this.codigoProducto = ficha.codigoDeProducto || '';
    this.nombreProducto = ficha.nombreDeProducto || '';
    this.descripcionDelProducto = ficha.descripcionLargaDeProducto || '';

    // Aspectos generales
    this.destino = ficha.destino || '';
    this.marca = ficha.marca || '';
    this.tipoDeUso = ficha.tipoDeUso || '';
    this.alergeno = ficha.alergeno || '';
    this.almacenamiento = ficha.condicionAlmacenamiento || '';
    this.vidaUtil = ficha.vidaUtil || '';
    this.tipoDeEnvase = ficha.tipoDeEnvase || '';
    this.presentacionDeEnvase = ficha.presentacionDeEnvase || '';
    this.pesoPromedio = ficha.pesoPromedio || 0;
    this.unidadesPorCaja = ficha.unidadesPorCaja || 0;
    this.dimensiones = ficha.dimensiones || '';

    // Especificaciones
    this.grasaVisible = ficha.grasaVisible || '';
    this.espesorCobertura = ficha.espesorCobertura || '';
    this.ganglios = ficha.ganglios || '';
    this.hematomas = ficha.hematomas || '';
    this.huesosCartilagos = ficha.huesosCartilagos || '';
    this.idioma = ficha.idioma || '';
    this.elementosExtranos = ficha.elementosExtranos || '';
    this.color = ficha.color || '';
    this.olor = ficha.olor || '';
    this.ph = ficha.ph || '';
    this.aerobiosMesofilosTotales = ficha.aerobiosMesofilosTotales || '';
    this.enterobacterias = ficha.enterobacterias || '';
    this.stec0157 = ficha.stec0157 || '';
    this.stecNo0157 = ficha.stecNo0157 || '';
    this.salmonella = ficha.salmonella || '';
    this.estafilococos = ficha.estafilococos || '';
    this.pseudomonas = ficha.pseudomonas || '';
    this.escherichiaColi = ficha.escherichiaColi || '';
    this.coliformesTotales = ficha.coliformesTotales || '';
    this.coliformesFecales = ficha.coliformesFecales || '';

    // Observaciones y firma
    this.observacionDelProducto = ficha.observacion || '';
    this.elaboradoPor = ficha.elaboradoPor || '';
    this.aprobadoPor = ficha.aprobadoPor || '';
    this.fechaDelDia = ficha.fechaCreacion || '';
  }


  // Método para guardar los cambios de la ficha técnica
  public async EditarFichaTecnica(): Promise<void> {
    const fichaActualizada: FtFichaTecnicaDTO = {
      idFichaTecnica: this.idFichaTecnica, 
      nombreDeProducto: this.nombreProducto,
      descripcionDeProducto: this.descripcionDelProducto,
      descripcionLargaDeProducto: this.descripcionDelProducto,
      destino: this.destino,
      marca: this.marca,
      tipoDeUso: this.tipoDeUso,
      alergeno: this.alergeno,
      condicionAlmacenamiento: this.almacenamiento,
      vidaUtil: this.vidaUtil,
      tipoDeEnvase: this.tipoDeEnvase,
      presentacionDeEnvase: this.presentacionDeEnvase,
      pesoPromedio: this.pesoPromedio,
      unidadesPorCaja: this.unidadesPorCaja,
      dimensiones: this.dimensiones,
      grasaVisible: this.grasaVisible,
      espesorCobertura: this.espesorCobertura,
      ganglios: this.ganglios,
      hematomas: this.hematomas,
      huesosCartilagos: this.huesosCartilagos,
      idioma: this.idioma,
      elementosExtranos: this.elementosExtranos,
      color: this.color,
      olor: this.olor,
      ph: this.ph,
      aerobiosMesofilosTotales: this.aerobiosMesofilosTotales,
      enterobacterias: this.enterobacterias,
      stec0157: this.stec0157,
      stecNo0157: this.stecNo0157,
      salmonella: this.salmonella,
      estafilococos: this.estafilococos,
      pseudomonas: this.pseudomonas,
      escherichiaColi: this.escherichiaColi,
      coliformesTotales: this.coliformesTotales,
      coliformesFecales: this.coliformesFecales,
      observacion: this.observacionDelProducto,
      elaboradoPor: this.elaboradoPor,
      aprobadoPor: this.aprobadoPor,
      fechaCreacion: this.fechaDelDia,
    };

    console.log(fichaActualizada)

    // Verificar si todos los campos requeridos están completos
    if (!this.nombreProducto || !this.descripcionDelProducto || !this.marca || !this.tipoDeUso || !this.almacenamiento || !this.vidaUtil) {
      Swal.fire('Advertencia', 'Por favor, completa todos los campos requeridos.', 'warning');
      return;
    }

    // Llamar al servicio para editar la ficha técnica
    this._fichaTecnicaService.EditarFichaTecnica(fichaActualizada).subscribe(
      (response: ApiResponse) => {
        if (response.esCorrecto) {
          Swal.fire('Éxito', 'La ficha técnica se actualizó correctamente.', 'success');
          
          this.LimpiarCampos(); 
          this.cerrarModal.emit(); 
          
        } else {
          Swal.fire('Error', response.mensaje!, 'error');
          this.LimpiarCampos();
          this.cerrarModal.emit(); 
        }
      },
      error => {
        console.error('Error al editar la ficha técnica:', error);
        this.LimpiarCampos();
        this.cerrarModal.emit(); 
      }
    );
  }


  public VerificarCambios(): void {
    this.seModificoAlgunCampo = (
      this.nombreProducto !== this.ficha?.nombreDeProducto ||
      this.descripcionDelProducto !== this.ficha?.descripcionLargaDeProducto ||
      this.codigoProducto !== this.ficha?.codigoDeProducto ||
      this.marca !== this.ficha?.marca ||
      this.tipoDeUso !== this.ficha?.tipoDeUso ||
      this.alergeno !== this.ficha?.alergeno ||
      this.almacenamiento !== this.ficha?.condicionAlmacenamiento ||
      this.vidaUtil !== this.ficha?.vidaUtil ||
      this.tipoDeEnvase !== this.ficha?.tipoDeEnvase ||
      this.presentacionDeEnvase !== this.ficha?.presentacionDeEnvase ||
      this.pesoPromedio !== this.ficha?.pesoPromedio ||
      this.unidadesPorCaja !== this.ficha?.unidadesPorCaja ||
      this.dimensiones !== this.ficha?.dimensiones ||
      this.grasaVisible !== this.ficha?.grasaVisible ||
      this.espesorCobertura !== this.ficha?.espesorCobertura ||
      this.ganglios !== this.ficha?.ganglios ||
      this.hematomas !== this.ficha?.hematomas ||
      this.huesosCartilagos !== this.ficha?.huesosCartilagos ||
      this.idioma !== this.ficha?.idioma ||
      this.elementosExtranos !== this.ficha?.elementosExtranos ||
      this.color !== this.ficha?.color ||
      this.olor !== this.ficha?.olor ||
      this.ph !== this.ficha?.ph ||
      this.aerobiosMesofilosTotales !== this.ficha?.aerobiosMesofilosTotales ||
      this.enterobacterias !== this.ficha?.enterobacterias ||
      this.stec0157 !== this.ficha?.stec0157 ||
      this.stecNo0157 !== this.ficha?.stecNo0157 ||
      this.salmonella !== this.ficha?.salmonella ||
      this.estafilococos !== this.ficha?.estafilococos ||
      this.pseudomonas !== this.ficha?.pseudomonas ||
      this.escherichiaColi !== this.ficha?.escherichiaColi ||
      this.coliformesTotales !== this.ficha?.coliformesTotales ||
      this.coliformesFecales !== this.ficha?.coliformesFecales ||
      this.observacionDelProducto !== this.ficha?.observacion
    );
  }


  // Método para limpiar los campos del formulario
  private LimpiarCampos(): void {
    // Limpiar los campos de texto y numéricos
    this.nombreProducto = '';
    this.descripcionDelProducto = '';
    this.destino = '';
    this.marca = '';
    this.tipoDeUso = '';
    this.alergeno = '';
    this.almacenamiento = '';
    this.vidaUtil = '';
    this.tipoDeEnvase = '';
    this.presentacionDeEnvase = '';
    this.pesoPromedio = 0;
    this.unidadesPorCaja = 0;
    this.dimensiones = '';
    this.grasaVisible = '';
    this.espesorCobertura = '';
    this.ganglios = '';
    this.hematomas = '';
    this.huesosCartilagos = '';
    this.idioma = '';
    this.elementosExtranos = '';
    this.color = '';
    this.olor = '';
    this.ph = '';
    this.aerobiosMesofilosTotales = '';
    this.enterobacterias = '';
    this.stec0157 = '';
    this.stecNo0157 = '';
    this.salmonella = '';
    this.estafilococos = '';
    this.pseudomonas = '';
    this.escherichiaColi = '';
    this.coliformesTotales = '';
    this.coliformesFecales = '';
    this.observacionDelProducto = '';

    this.seModificoAlgunCampo = false; 
  }

}
