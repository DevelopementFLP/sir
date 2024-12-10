
import { Component, Input } from '@angular/core';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtImagenesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtImagenesDTO';
import { FtFichaTecnicaService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtFichaTecnica/FtFichaTecnica.service';
import { FtImagenesService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtPlantilla/FtImagenes.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-generar-ficha-tecnica-producto',
  templateUrl: './generar-ficha-tecnica-producto.component.html',
  styleUrls: ['./generar-ficha-tecnica-producto.component.css']
})
export class FichaTecnicaProductoComponent {


  public codigoDeProductoInput: string = "";
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


  public async BuscarFichaTecnica() {
    if(this.codigoDeProductoInput.length < 4){
        Swal.fire('Error', 'El Codigo de producto no puede ser menor a 4 Digitos', 'error');
        return;
    }else{
        this._ftFichaTecnicaService.BuscarFichaTecnica(this.codigoDeProductoInput).subscribe(
            (response: ApiResponse) => {
                if (response.esCorrecto) {
                
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
                    this.idioma
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
                
                } else {
                    Swal.fire('Error', 'No se encontró ficha técnica para el código ingresado.', 'error');
                }
            },
            (error) => {
                console.error('Error en la solicitud:', error);
            }
        );
    }

    this.BuscarImagenPorCodigo(this.codigoDeProductoInput)
    this.codigoDeProductoInput = "";
  }



  public async BuscarImagenPorCodigo(codigoDeProducto: string) {
    try {
        const response: ApiResponse | undefined = await this._ftImagenesService.BuscarImagenPorProducto(codigoDeProducto).toPromise();
        
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
                        Swal.fire('Error', mensajeError, 'error');
                }
            });
        } else {
            Swal.fire('Error', "No se encontraron imágenes o la respuesta es incorrecta.", 'error');
            this.resetImagenes();
        }
    } catch (error) {
        console.error("Error al buscar las imágenes: ", error);
        this.resetImagenes();
    }
  }

  // Método para resetear las imágenes
  private resetImagenes() {
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
            const canvas = await html2canvas(data, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = canvas.height * imgWidth / canvas.width;

            // Ajusta la altura de la imagen si es muy alta
            const maxHeight = pdf.internal.pageSize.getHeight();
            const scaleFactor = imgHeight > maxHeight ? maxHeight / imgHeight : 1;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight * scaleFactor);
            const nombreArchivo = `FT - ${this.destino} - ${this.nombreDeProducto} - ${this.codigoDeProducto}_${this.fechaDelDia}.pdf`;
            pdf.save(nombreArchivo);
            this.loadingDePdf = false;
        } else {
            console.error('No se encontró el elemento para exportar a PDF.');
            this.loadingDePdf = false; 
        }
    }


}


