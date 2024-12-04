import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtFichaTecnicaService } from '../../../service/CreacionDeFichaTecnicaServicios/FtFichaTecnica/FtFichaTecnica.service';
import { FtFichaTecnicaDTO } from '../../../interface/CreacionDeFichaTecnicaInterface/FtFichaTecnicaDTO';
import { FtImagenesPlantillaDTO } from '../../../interface/CreacionDeFichaTecnicaInterface/FtImagenesDTO';
import { FtImagenesService } from '../../../service/CreacionDeFichaTecnicaServicios/FtPlantilla/FtImagenes.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'modal-ver-ficha-tecnica',
  templateUrl: './modal-ver-ficha-tecnica.component.html',
  styleUrls: ['./modal-ver-ficha-tecnica.component.css']
})
export class ModalVerFichaTecnicaComponent {

  @Input() ficha: FtFichaTecnicaDTO | null = null;
  @Output() cerrarModal = new EventEmitter<void>();

  public cerrar() {
    this.cerrarModal.emit();  // Emitir el evento para cerrar el modal
  }
  
  public loadingDePdf: boolean = false;

  //!Imagenes
  public logoGenerico: string = "assets/images/logos/logo_ficha_tecnica_1.png"
  public imagenBase64AreaLogo: string | null = null;
  public imagenBase64AreaCorte: string | null = null;
  public imagenBase64AreaEnvase: string | null = null;
  public imagenBase64AreaEnvaseSecundario: string | null = null;
  public imagenBase64AreaEnvaseSecundario2: string | null = null;

  //! Campos de la ficha Aspectos Generales
  public idFichaTecnica?: number;
  public codigoDeProducto: string = "";
  public descripcionDeProducto: string = '';
  public nombreDeProducto: string = '';
  public descripcionLargaDeProducto: string = '';
  public marca: string = '';
  public destino: string = '';
  public tipoDeUso: string = '';
  public alimentacion: string = 'Pendiente';
  public alergeno: string = '';
  public condicionAlmacenamiento: string = '';
  public vidaUtil: string = '';
  public tipoDeEnvase: string = '';
  public presentacionDeEnvase: string = '';
  public pesoPromedio: number = 0;
  public unidadesPorCaja: number = 0;
  public dimensiones: string = '';

  //! Campos de Especificaciones
  public grasaVisible: string = '';
  public espesorCobertura: string = '';
  public ganglios: string = '';
  public hematomas: string = '';
  public huesosCartilagos: string = '';
  public idioma: string = '';
  public elementosExtranos: string = '';

  //! Calidad microbiológica
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

  //! Campos de Plantilla
  public observacionDelProducto: string = '';
  public elaboradoPor: string = 'Departamento de Produccion';
  public aprobadoPor: string = 'Jefe de Desosado';
  public fechaDelDia: string = '';

  constructor(
    private _ftFichaTecnicaService: FtFichaTecnicaService,
    private _ftImagenesService: FtImagenesService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ficha && changes['ficha'] && this.ficha.idFichaTecnica !== undefined) {
      // Asignar el idFichaTecnica al recibir nuevos datos de ficha
      this.codigoDeProducto = this.ficha.codigoDeProducto!;
      this.BuscarFichaTecnica(this.codigoDeProducto);
      console.log(this.codigoDeProducto)
    }
  }


  public async BuscarFichaTecnica(codigoDeProducto: string) {

    this.LimpiarDatos();

    this._ftFichaTecnicaService.BuscarFichaTecnica(codigoDeProducto).subscribe(
      (response: ApiResponse) => {
        if (response.esCorrecto && response.resultado.length > 0) {
          console.log(response.resultado);
          
          const fichaTecnica = response.resultado[0];
          
          // Campos de la ficha - Aspectos Generales
          this.idFichaTecnica = fichaTecnica.idFichaTecnica;
          this.codigoDeProducto = fichaTecnica.codigoDeProducto;
          this.descripcionDeProducto = fichaTecnica.descripcionDeProducto;
          this.nombreDeProducto = fichaTecnica.nombreDeProducto;
          this.descripcionLargaDeProducto = fichaTecnica.descripcionLargaDeProducto;
          this.marca = fichaTecnica.marca;
          this.destino = fichaTecnica.destino; 
          this.tipoDeUso = fichaTecnica.tipoDeUso;  
          this.alimentacion = 'Pendiente'; 
          this.alergeno = fichaTecnica.alergeno;
          this.condicionAlmacenamiento = fichaTecnica.condicionAlmacenamiento;
          this.vidaUtil = fichaTecnica.vidaUtil;
          this.tipoDeEnvase = fichaTecnica.tipoDeEnvase;
          this.presentacionDeEnvase = fichaTecnica.presentacionDeEnvase;
          this.pesoPromedio = fichaTecnica.pesoPromedio || 0;
          this.unidadesPorCaja = fichaTecnica.unidadesPorCaja || 0;
          this.dimensiones = fichaTecnica.dimensiones;
  
          // Campos de Especificaciones
          this.grasaVisible = fichaTecnica.grasaVisible;
          this.espesorCobertura = fichaTecnica.espesorCobertura;
          this.ganglios = fichaTecnica.ganglios;
          this.hematomas = fichaTecnica.hematomas;
          this.huesosCartilagos = fichaTecnica.huesosCartilagos;
          this.idioma = fichaTecnica.idioma;
          this.elementosExtranos = fichaTecnica.elementosExtranos;
  
          // Calidad microbiológica
          this.color = fichaTecnica.color;
          this.olor = fichaTecnica.olor;
          this.ph = fichaTecnica.ph;
          this.aerobiosMesofilosTotales = fichaTecnica.aerobiosMesofilosTotales;
          this.enterobacterias = fichaTecnica.enterobacterias;
          this.stec0157 = fichaTecnica.stec0157;
          this.stecNo0157 = fichaTecnica.stecNo0157;
          this.salmonella = fichaTecnica.salmonella;
          this.estafilococos = fichaTecnica.estafilococos;
          this.pseudomonas = fichaTecnica.pseudomonas;
          this.escherichiaColi = fichaTecnica.escherichiaColi;
          this.coliformesTotales = fichaTecnica.coliformesTotales;
          this.coliformesFecales = fichaTecnica.coliformesFecales;
  
          // Campos de Plantilla
          this.observacionDelProducto = fichaTecnica.observacion || '';
          this.elaboradoPor = fichaTecnica.elaboradoPor || 'Departamento de Produccion';
          this.aprobadoPor = fichaTecnica.aprobadoPor || 'Jefe de Desosado';
          this.fechaDelDia = fichaTecnica.fechaCreacion || '';


          this.BuscarImagenPorCodigo(codigoDeProducto);
          
        } 
      },
      (error) => {
        console.error('Error en la solicitud:', error);
      }
    );
    
  }
  

    public async BuscarImagenPorCodigo(codigoDeProducto: string) {

      // Obtener el código de producto hasta el primer espacio
      const codigoCorto = codigoDeProducto.split(' ')[0];

      try {
          const response: ApiResponse | undefined = await this._ftImagenesService.BuscarImagenPorProducto(codigoCorto).toPromise();
          
          if (response && response.esCorrecto && response.resultado) {
              
              // Especifica el tipo de imagen como ImagenesPlantillaDTO
              const imagenes: FtImagenesPlantillaDTO[] = response.resultado;
  
              imagenes.forEach((imagen: FtImagenesPlantillaDTO) => {
                  const imagenBase64 = imagen.contenidoImagen;
  
                  switch (imagen.seccionDeImagen) {
                      case 1:
                          this.imagenBase64AreaLogo = imagenBase64;
                          break;
                      case 2:
                          this.imagenBase64AreaCorte = imagenBase64;
                          break;
                      case 3:
                          this.imagenBase64AreaEnvase = imagenBase64;
                          break;
                      case 4:
                          this.imagenBase64AreaEnvaseSecundario = imagenBase64;
                          break;
                      case 5:
                          this.imagenBase64AreaEnvaseSecundario2 = imagenBase64;
                          break;
                      default:
                          const mensajeError = "Sección de imagen no reconocida: " + imagen.seccionDeImagen;
                  }
              });
          } else {
              this.ResetearImagenes();
          }
      } catch (error) {
          console.error("Error al buscar las imágenes: ", error);
          this.ResetearImagenes();
      }
    }

  // Método para resetear las imágenes
  private ResetearImagenes() {
    this.imagenBase64AreaLogo = null;
    this.imagenBase64AreaCorte = null;
    this.imagenBase64AreaEnvase = null;
    this.imagenBase64AreaEnvaseSecundario = null;
    this.imagenBase64AreaEnvaseSecundario2 = null;
  }

  public async GenerarPDF() {
    this.loadingDePdf = true;
    
    const data = document.getElementById('contenidoFichaTecnica');
        if (data) {
            const canvas = await html2canvas(data, { scale: 3 });
            const imgData = canvas.toDataURL('image/jpeg', 0.7) // el png no se puee comprimir
            const pdf = new jsPDF('p', 'mm', 'a4');

            const margin = 2;

            const imgWidth = pdf.internal.pageSize.getWidth() - margin * 2;

            const imgHeight = canvas.height * imgWidth / canvas.width;

            const maxHeight = pdf.internal.pageSize.getHeight() - margin * 2; 
            const scaleFactor = imgHeight > maxHeight ? maxHeight / imgHeight : 1;

            pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight * scaleFactor);

            const nombreArchivo = `FT - ${this.destino} - ${this.nombreDeProducto} - ${this.codigoDeProducto}_${this.fechaDelDia}.pdf`;
            pdf.save(nombreArchivo);

            this.loadingDePdf = false;
        } else {
            console.error('No se encontró el elemento para exportar a PDF.');
            this.loadingDePdf = false; 
        }
    }


  public LimpiarDatos() {
    // Limpiar campos de ficha técnica
    this.idFichaTecnica = undefined;
    this.codigoDeProducto = '';
    this.descripcionDeProducto = '';
    this.nombreDeProducto = '';
    this.descripcionLargaDeProducto = '';
    this.marca = '';
    this.destino = '';
    this.tipoDeUso = '';
    this.alimentacion = 'Pendiente';
    this.alergeno = '';
    this.condicionAlmacenamiento = '';
    this.vidaUtil = '';
    this.tipoDeEnvase = '';
    this.presentacionDeEnvase = '';
    this.pesoPromedio = 0;
    this.unidadesPorCaja = 0;
    this.dimensiones = '';
  
    // Limpiar campos de especificaciones
    this.grasaVisible = '';
    this.espesorCobertura = '';
    this.ganglios = '';
    this.hematomas = '';
    this.huesosCartilagos = '';
    this.idioma = '';
    this.elementosExtranos = '';
  
    // Limpiar calidad microbiológica
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
  
    // Limpiar campos de plantilla
    this.observacionDelProducto = '';
    this.elaboradoPor = 'Departamento de Produccion';
    this.aprobadoPor = 'Jefe de Desosado';
    this.fechaDelDia = '';
  
    // Limpiar imágenes
    this.ResetearImagenes();
  }

  
  
}
