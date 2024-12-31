import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FtFichaTecnicaDTO } from '../../../interface/CreacionDeFichaTecnicaInterface/FtFichaTecnicaDTO';
import { FtFichaTecnicaService } from '../../../service/CreacionDeFichaTecnicaServicios/FtFichaTecnica/FtFichaTecnica.service';

import Swal from 'sweetalert2';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';

@Component({
  selector: 'modal-editar-ficha-tecnica',
  templateUrl: './editar-ficha-tecnica.component.html',
  styleUrls: ['./editar-ficha-tecnica.component.css']
})
export class EditarFichaTecnicaComponent {

  @Input() ficha: FtFichaTecnicaDTO | null = null;
  @Output() modalCerrado: EventEmitter<boolean> = new EventEmitter<boolean>(); 
  @Output() fichaActualizada: EventEmitter<FtFichaTecnicaDTO> = new EventEmitter<FtFichaTecnicaDTO>();

  public seModificoAlgunCampo: boolean = false;
  public modalEditarFotoTecnicaActivo: boolean = false; 
  public fichaSeleccionada: any;  
  public archivoPdf: string | null = null;
  public cargarVistaDePdf: boolean = false;
  public pdfSeleccionado: File | null = null;
  
  constructor(
    private _fichaTecnicaService: FtFichaTecnicaService,
  ) { }
 
  // Variables para cargar los datos de la ficha técnica en el formulario
  public idFichaTecnica: number = 0;
  public codigoProducto: string = '';
  public nombreProducto: string = '';
  public descripcionDelProducto: string = '';
  public descripcionLargaDeProducto: string = '';
  public destino: string = '';
  public marca: string = '';
  public tipoDeUso: string = '';
  public alergeno: string = '';
  public almacenamiento: string = '';
  public vidaUtil: string = '';
  public tipoDeEnvase: string = '';
  public presentacionDeEnvase: string = '';
  public pesoPromedio: string = '';
  public unidadesPorCaja: string = '';
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
      this.pdfSeleccionado = null;
      this.idFichaTecnica = this.ficha.idFichaTecnica;
      this.CargarDatosFichaTecnica(this.ficha);
    }
  }

  private CargarDatosFichaTecnica(ficha: FtFichaTecnicaDTO): void {
    
    if (ficha.archivoPdf) {
      this.archivoPdf = ficha.archivoPdf; 
      this.cargarVistaDePdf = true;
      this.codigoProducto = ficha.codigoDeProducto || 'NO APLICA';
      this.nombreProducto = ficha.nombreDeProducto || 'NO APLICA';
      this.destino = ficha.destino?.trim() || 'NO APLICA';

    } else {

      this.cargarVistaDePdf = false;

      // Datos generales del producto
      this.codigoProducto = ficha.codigoDeProducto || 'NO APLICA';
      this.nombreProducto = ficha.nombreDeProducto || 'NO APLICA';
      this.descripcionDelProducto = ficha.descripcionDeProducto || '';
      this.descripcionLargaDeProducto = ficha.descripcionLargaDeProducto || '';

      // Aspectos generales
      this.destino = ficha.destino?.trim() || 'NO APLICA';
      this.marca = ficha.marca?.trim() || 'NO APLICA';
      this.tipoDeUso = ficha.tipoDeUso?.trim() || 'NO APLICA';
      this.alergeno = ficha.alergeno?.trim() || 'NO APLICA';
      this.almacenamiento = ficha.condicionAlmacenamiento?.trim() || 'NO APLICA';
      this.vidaUtil = ficha.vidaUtil?.trim() || 'NO APLICA';
      this.tipoDeEnvase = ficha.tipoDeEnvase?.trim() || 'NO APLICA';
      this.presentacionDeEnvase = ficha.presentacionDeEnvase?.trim() || 'NO APLICA';
      this.pesoPromedio = ficha.pesoPromedio || 'NO APLICA'; 
      this.unidadesPorCaja = ficha.unidadesPorCaja || 'NO APLICA';
      this.dimensiones = ficha.dimensiones?.trim() || 'NO APLICA';

      // Especificaciones
      this.grasaVisible = ficha.grasaVisible?.trim() || 'NO APLICA';
      this.espesorCobertura = ficha.espesorCobertura?.trim() || 'NO APLICA';
      this.ganglios = ficha.ganglios?.trim() || 'NO APLICA';
      this.hematomas = ficha.hematomas?.trim() || 'NO APLICA';
      this.huesosCartilagos = ficha.huesosCartilagos?.trim() || 'NO APLICA';
      this.idioma = ficha.idioma?.trim() || 'NO APLICA';
      this.elementosExtranos = ficha.elementosExtranos?.trim() || 'NO APLICA';
      this.color = ficha.color?.trim() || 'NO APLICA';
      this.olor = ficha.olor?.trim() || 'NO APLICA';
      this.ph = ficha.ph?.trim() || 'NO APLICA';
      this.aerobiosMesofilosTotales = ficha.aerobiosMesofilosTotales?.trim() || 'NO APLICA';
      this.enterobacterias = ficha.enterobacterias?.trim() || 'NO APLICA';
      this.stec0157 = ficha.stec0157?.trim() || 'NO APLICA';
      this.stecNo0157 = ficha.stecNo0157?.trim() || 'NO APLICA';
      this.salmonella = ficha.salmonella?.trim() || 'NO APLICA';
      this.estafilococos = ficha.estafilococos?.trim() || 'NO APLICA';
      this.pseudomonas = ficha.pseudomonas?.trim() || 'NO APLICA';
      this.escherichiaColi = ficha.escherichiaColi?.trim() || 'NO APLICA';
      this.coliformesTotales = ficha.coliformesTotales?.trim() || 'NO APLICA';
      this.coliformesFecales = ficha.coliformesFecales?.trim() || 'NO APLICA';

      // Observaciones y firma
      this.observacionDelProducto = ficha.observacion?.trim() || '';
      this.elaboradoPor = ficha.elaboradoPor?.trim() || '';
      this.aprobadoPor = ficha.aprobadoPor?.trim() || '';
      this.fechaDelDia = ficha.fechaCreacion?.trim() || '';
    }
  }

  // Método para guardar los cambios de la ficha técnica
  public async EditarFichaTecnica(): Promise<void> {
    const fichaActualizada: FtFichaTecnicaDTO = {
      idFichaTecnica: this.idFichaTecnica, 
      nombreDeProducto: this.nombreProducto,
      descripcionDeProducto: this.descripcionDelProducto,
      descripcionLargaDeProducto: this.descripcionLargaDeProducto,
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

    if(this.pdfSeleccionado == null ){
      if (!this.nombreProducto || !this.descripcionDelProducto || !this.marca || !this.tipoDeUso || !this.almacenamiento || !this.vidaUtil) {
        Swal.fire('Advertencia', 'Por favor, completa todos los campos requeridos.', 'warning');
        return;
      }
    }

    // Llamar al servicio para editar la ficha técnica
    this._fichaTecnicaService.EditarFichaTecnica(fichaActualizada, this.pdfSeleccionado!).subscribe(
      (response: ApiResponse) => {
        if (response.esCorrecto) {
          Swal.fire('Éxito', 'La ficha técnica se actualizó correctamente.', 'success');
          
          this.fichaActualizada.emit(fichaActualizada);
          this.modalCerrado.emit(true);
          this.LimpiarCampos(); 
          
        } else {
          Swal.fire('Error', response.mensaje!, 'error');
          this.LimpiarCampos(); 
        }
      },
      error => {
        console.error('Error al editar la ficha técnica:', error);
        this.LimpiarCampos();
      }
    );
  }


  public VerificarCambios(): void {
    this.seModificoAlgunCampo = (
      this.nombreProducto !== this.ficha?.nombreDeProducto ||
      this.descripcionDelProducto !== this.ficha?.descripcionDeProducto ||
      this.descripcionLargaDeProducto !== this.ficha?.descripcionLargaDeProducto ||
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
    this.descripcionLargaDeProducto = '';
    this.destino = '';
    this.marca = '';
    this.tipoDeUso = '';
    this.alergeno = '';
    this.almacenamiento = '';
    this.vidaUtil = '';
    this.tipoDeEnvase = '';
    this.presentacionDeEnvase = '';
    this.pesoPromedio = '';
    this.unidadesPorCaja = '';
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

    this.pdfSeleccionado = null;
    this.cargarVistaDePdf = false;
    this.pdfSeleccionado = null;
  }

  // Función para abrir el modal de edición de imagen
  public AbrirModalEditarFoto(): void {
    if (this.ficha) {
      this.codigoProducto = this.ficha.codigoDeProducto!; // Asigna el código del producto
    }
    this.modalEditarFotoTecnicaActivo = true;  // Mostrar el modal
  }
  
  // Función para cerrar el modal
  public CerrarModalEditarFotoTecnica(): void {
    this.modalEditarFotoTecnicaActivo = false;
  }

  public SeleccionarPdf(event: any) {
    this.pdfSeleccionado = event.files[0];
    this.cargarVistaDePdf = true;
  }


}
