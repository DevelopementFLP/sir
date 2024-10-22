import { Component } from '@angular/core';
import { FtAspectosGeneralesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtAspectosGeneralesDTO';
import { FtEspecificacionesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtEspecificacionesDTO';
import { FtResponseAspectoGeneralDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/Response/FtResponseAspectosGeneralesDTO';
import { FtResponseEspecificacionesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/Response/FtResponseDeEspecificacionesDTO';
import { FtAspectosGeneralesService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtPlantilla/FtAspectosGenerales.service';
import { FtProductoService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtProducto/FtProducto.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'component-crear-ficha-tecnica',
  templateUrl: './crear-ficha-tecnica.component.html',
  styleUrls: ['./crear-ficha-tecnica.component.css']
})
export class CrearFichaTecnicaComponent {
    
  public contadorDePasadas: number = 0;
  public listaDeProductosParaCargar: string[] = [];
  public codigoProducto: string | null = null;
  public nombreProducto: string = '';
  public descripcionDelProducto: string = '';

  public imagenSeleccionadaAreaLogo: string | null = null;
  public imagenSeleccionadaAreaCorte: string | null = null;
  public imagenSeleccionadaAreaEnvase: string | null = null;
  public imagenSeleccionadaAreaEnvaseSecundario: string | null = null;
  public imagenSeleccionadaAreaEnvaseSecundario2: string | null = null;

  public listaDeAspectosGeneralesPlantilla: FtAspectosGeneralesPlantillaDTO[] = [];
  public listaDeEspecificacionesPlantilla: FtEspecificacionesPlantillaDTO[] = [];
  public camposDeAspectosGenerales: FtResponseAspectoGeneralDTO[] = []
  public camposDeEspecificaciones: FtResponseEspecificacionesPlantillaDTO[] = []
  public seleccionDeAspectosGenerales: number | null = null;
  public seleccionDeEspecificaciones: number | null = null;

  public observacionDelProducto: string = '';
  public fechaDelDia: string = '';

  //! Campos de la ficha Aspectos Generales
  public producto: string = '';
  public marca: string = '';
  public destino: string = '';
  public tipoDeUso: string = '';
  public alergeno: string = '';
  public almacenamiento: string = '';
  public vidaUtil: string = '';
  public tipoDeEnvase: string = '';
  public presentacionDeEnvase: string = '';
  public pesoPromedio: number = 0;
  public unidadesPorCaja: number = 0;
  public dimensiones: string = '';

  //! Campos de Especificaciones
  public nombre: string = '';
  public grasaVisible: string = '';
  public espesorCobertura: string = '';
  public ganglios: string = '';
  public hematomas: string = '';
  public huesosCartilagos: string = '';
  public elementosExtranos: string = '';
  public color: string = '';
  public olor: string = '';
  public ph: number = 0;
  public aerobiosMesofilosTotales: string = '';
  public enterobacterias: string = '';
  public stec0157: string = '';
  public stecNo0157: string = '';
  public salmonella: string = '';
  public estafilococos: string = '';
  public pseudomonas: string = '';
  public escherichiaColi: string = '';
  public coliformesTotales: string = '';




  constructor(
    private _FtAspectosGeneralesService: FtAspectosGeneralesService,
    private _FtProductoService: FtProductoService
  ) { }

  ngOnInit(): void {
    this.CargarAspectosGenerales();
    this.CargarEspecificaciones();
  }

 private CargarAspectosGenerales(): void {
  
    this._FtAspectosGeneralesService.GetListaAspectosGenerales().subscribe(
      response => {
        if (response.esCorrecto) {
          this.listaDeAspectosGeneralesPlantilla = response.resultado; 
        } else {
          console.error(response.mensaje); 
        }
      },
      error => {
        console.error('Error al cargar aspectos generales', error);
      }
    );
  }

  private CargarEspecificaciones(): void {
  
    this._FtAspectosGeneralesService.GetListaDeEspecificaciones().subscribe(
      response => {
        if (response.esCorrecto) {
          this.listaDeEspecificacionesPlantilla = response.resultado; 
        } else {
          console.error(response.mensaje); 
        }
      },
      error => {
        console.error('Error al cargar aspectos generales', error); 
      }
    );
  }

  public AgregarCodigo() {
    if (this.codigoProducto!.trim() !== '') {
        const codigoProductoRecibido = this.codigoProducto!.trim();
        // Verifica si el producto ya está en la lista
        if (!this.listaDeProductosParaCargar.includes(codigoProductoRecibido)) {
            this.listaDeProductosParaCargar.push(codigoProductoRecibido);

            this.obtenerNombreProducto(codigoProductoRecibido);
                                   
            this.codigoProducto = '';
        } else {
            Swal.fire({
                title: 'Error',
                text: 'El código ya ha sido agregado.',
                icon: 'error'
            });
        }
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Por favor ingrese un código válido.',
            icon: 'error'
        });
    }
  }


  public obtenerNombreProducto(codigoProducto: string): void {
    this._FtProductoService.GetProductoFiltradoFichaTecnica(codigoProducto).subscribe(
      response => {
        if (response.esCorrecto) {    
          if(this.contadorDePasadas <= 0){
            this.nombreProducto = response.resultado.nombre || 'Resultado Indefinido';   
            this.descripcionDelProducto = response.resultado.descripcion || 'Resultado Indefinido'; 
            this.ObtenerFechaDeHoy();    
            this.contadorDePasadas++;
          }             
        } else {
          Swal.fire({
            title: 'Error',
            text: response.mensaje || 'No se encontró el producto.',
            icon: 'error'
          });
          this.contadorDePasadas = 0;
          this.listaDeProductosParaCargar = [];
        }
      },
      error => {
        console.error('Error al obtener el producto', error);
        Swal.fire({
          title: 'Error',
          text: 'Error al obtener el producto.',
          icon: 'error'
        });
      }
    );
  }
  
  public DisparadorSelectAspectosGenerales(idPlantilla: number): void {
    console.log(idPlantilla)
    if (idPlantilla) { // Asegúrate de que idPlantilla no sea undefined
      this._FtAspectosGeneralesService.GetCamposDeAspectosGenerales(idPlantilla).subscribe(
        response => {
          if (response.esCorrecto) {
            const datos = response.resultado[0];
            this.producto = datos.nombreDePlantilla || '';
            this.marca = datos.marca || '';
            this.destino = datos.destino || '';
            this.tipoDeUso = datos.tipoDeUso || '';
            this.alergeno = datos.alergeno || '';
            this.almacenamiento = datos.almacenamiento || '';
            this.vidaUtil = datos.vidaUtil || '';
            this.tipoDeEnvase = datos.tipoDeEnvase || '';
            this.presentacionDeEnvase = datos.presentacionDeEnvase || '';
            this.pesoPromedio = datos.pesoPromedio || 0;
            this.unidadesPorCaja = datos.unidadesPorCaja || 0;
            this.dimensiones = datos.dimensiones || '';
          } else {
            console.error(response.mensaje);
          }
        },
        error => {
          console.error('Error al cargar campos de aspectos generales', error);
        }
      );
    } else {
      console.warn('ID de plantilla no válido'); // Manejo si el ID es null o undefined
    }
  }

  public DisparadorSelectEspecificaciones(idPlantilla: number): void {
    if (idPlantilla) { 
      this._FtAspectosGeneralesService.GetCamposDeEspecificaciones(idPlantilla).subscribe(
        response => {
          if (response.esCorrecto) {
            const datos = response.resultado[0]; 
  
            this.nombre = datos.nombre || '';
            this.grasaVisible = datos.grasaVisible || '';
            this.espesorCobertura = datos.espesorCobertura || '';
            this.ganglios = datos.ganglios || '';
            this.hematomas = datos.hematomas || '';
            this.huesosCartilagos = datos.huesosCartilagos || '';
            this.elementosExtranos = datos.elementosExtraños || '';
            this.color = datos.color || '';
            this.olor = datos.olor || '';
            this.ph = datos.ph || 0;
            this.aerobiosMesofilosTotales = datos.aerobiosMesofilosTotales || '';
            this.enterobacterias = datos.enterobacterias || '';
            this.stec0157 = datos.stec0157 || '';
            this.stecNo0157 = datos.stecNo0157 || '';
            this.salmonella = datos.salmonella || '';
            this.estafilococos = datos.estafilococos || '';
            this.pseudomonas = datos.pseudomonas || '';
            this.escherichiaColi = datos.escherichiaColi || '';
            this.coliformesTotales = datos.coliformesTotales || '';
            
          } else {
            console.error(response.mensaje);
          }
        },
        error => {
          console.error('Error al cargar campos de especificaciones', error);
        }
      );
    } else {
      console.warn('ID de plantilla no válido'); 
    }
  }


  public ObtenerFechaDeHoy(): void {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0'); 
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); 
    const año = hoy.getFullYear();
    
    this.fechaDelDia = `${dia}-${mes}-${año}`;
  }
  
  
  public mostrarImagenSeleccionada(event: Event, area: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        const reader = new FileReader();

        Array.from(input.files).forEach(file => {
            reader.onload = (e) => {
                switch (area) {
                    case 'logo':
                        this.imagenSeleccionadaAreaLogo = e.target?.result as string;
                        break;
                    case 'seccion-4':
                        this.imagenSeleccionadaAreaCorte = e.target?.result as string;
                        break;
                    case 'seccion-5':
                        this.imagenSeleccionadaAreaEnvase = e.target?.result as string;
                        break;
                    case 'seccion-7':
                        this.imagenSeleccionadaAreaEnvaseSecundario = e.target?.result as string;
                        break;
                    case 'seccion-7-segunda-imagen':
                        this.imagenSeleccionadaAreaEnvaseSecundario2 = e.target?.result as string;
                        break;
                    default:
                        console.warn('Área no válida');
                }
            };
            reader.readAsDataURL(file);
        });
    }
  }
}

