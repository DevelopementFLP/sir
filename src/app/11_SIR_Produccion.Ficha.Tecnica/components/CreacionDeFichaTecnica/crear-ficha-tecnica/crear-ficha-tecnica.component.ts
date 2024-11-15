
import { Component } from '@angular/core';
import { FtAspectosGeneralesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtAspectosGeneralesDTO';
import { FtEspecificacionesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtEspecificacionesDTO';
import { FtResponseAspectoGeneralDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/Response/FtResponseAspectosGeneralesDTO';
import { FtResponseEspecificacionesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/Response/FtResponseDeEspecificacionesDTO';
import { FtAspectosGeneralesService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtPlantilla/FtAspectosGenerales.service';
import { FtImagenesService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtPlantilla/FtImagenes.service';
import { FtProductoService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtProducto/FtProducto.service';

import { FtFichaTecnicaService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtFichaTecnica/FtFichaTecnica.service';

import Swal from 'sweetalert2';
import { FtFichaTecnicaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtFichaTecnicaDTO';
import { FtDestinosService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtDestinos/FtDestinos.service';
import { FtDestinoDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Destinos/FtDestinoDTO';
import { FtEspecificacionesService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtPlantilla/FtEspecificaciones.service';

@Component({
  selector: 'component-crear-ficha-tecnica',
  templateUrl: './crear-ficha-tecnica.component.html',
  styleUrls: ['./crear-ficha-tecnica.component.css']
})
export class CrearFichaTecnicaComponent {
    
  public contadorDePasadas: number = 0;
  public listaDeProductosParaCargar: string[] = [];
  public codigoProducto: string = '';
  public nombreProducto: string = '';
  public calibreDeProducto: string = '';
  public descripcionDelProducto: string = '';

  public imagenSeleccionadaAreaLogo: File | null = null;
  public urlLogo: string | null = null;
  
  public imagenSeleccionadaAreaCorte: File | null = null;
  public urlImagenCorte: string | null = null; 

  public imagenSeleccionadaAreaEnvase: File | null = null;
  public urlImagenEnvase: string | null = null;

  public imagenSeleccionadaAreaEnvaseSecundario: File | null = null;
  public urlImagenEnvaseSecundario: string | null = null;

  public imagenSeleccionadaAreaEnvaseSecundario2: File | null = null;
  public urlImagenEnvaseSecundario2: string | null = null;

  public listaDeAspectosGeneralesPlantilla: FtAspectosGeneralesPlantillaDTO[] = [];
  public listaDeEspecificacionesPlantilla: FtEspecificacionesPlantillaDTO[] = [];
  public camposDeAspectosGenerales: FtResponseAspectoGeneralDTO[] = []
  public camposDeEspecificaciones: FtResponseEspecificacionesPlantillaDTO[] = []
  public seleccionDeAspectosGenerales: number | null = null;
  public seleccionDeEspecificaciones: number | null = null;

  public listaDeDestinos: FtDestinoDTO[] = [];
  public seleccionDeDestino: FtDestinoDTO | null = null;

  
  //! Campos de la ficha Aspectos Generales
  public producto: string = '';
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

  //! Campos de Especificaciones
  public nombre: string = '';
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

  //! Campos de Plantilla
  public elaboradoPor: string = 'Departamento de Produccion';
  public aprobadoPor: string = 'Jefe de Desosado';
  public observacionDelProducto: string = '';
  public fechaDelDia: string = '';

  constructor(
    private _FtAspectosGeneralesService: FtAspectosGeneralesService,
    private _FtEspecificacionesService: FtEspecificacionesService,
    private _FtProductoService: FtProductoService,
    private _FtImagenesService: FtImagenesService,
    private _FtFichaTecnicaService: FtFichaTecnicaService,
    private _FtDestinoService: FtDestinosService,
  ) { }

  ngOnInit(): void {
    this.CargarAspectosGenerales();
    this.CargarEspecificaciones();
    this.CargarDestinos();
  }

  public AgregarCodigo() {
    if (this.codigoProducto!.trim() !== '') {
        const codigoProductoRecibido = this.codigoProducto!.trim();

        this._FtFichaTecnicaService.BuscarFichaTecnica(codigoProductoRecibido).subscribe(
            response => {
                if (response.esCorrecto && response.resultado) {
                    // Si el producto ya tiene una ficha técnica asociada, mostramos la alerta
                    Swal.fire({
                        title: 'Error',
                        text: 'Este código de producto ya está asociado a una ficha técnica.',
                        icon: 'error'
                    });
                    this.codigoProducto = ''; 
                    return;
                } else {
                    this.ObtenerNombreProducto(codigoProductoRecibido); 
                }
            },
            error => {
                console.error('Error al buscar ficha técnica', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Error al verificar el código de producto.',
                    icon: 'error'
                });
                this.codigoProducto = ''; 
            }
        );
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Por favor ingrese un código válido.',
            icon: 'error'
        });
    }
  }


  public ObtenerNombreProducto(codigoProducto: string): void {
    this._FtProductoService.GetProductoFiltradoFichaTecnica(codigoProducto).subscribe(
        response => {
            if (response.esCorrecto) {   
                const calibre = response.resultado.calibre; 
                const productoConCalibre = `${codigoProducto}  ${calibre}`; 

                if (!this.listaDeProductosParaCargar.includes(productoConCalibre)) {
                    this.listaDeProductosParaCargar.push(productoConCalibre);
                }
                else {
                  Swal.fire({
                      title: 'Error',
                      text: 'El código ya ha sido agregado.',
                      icon: 'error'
                  });
                  this.codigoProducto = '';
              }

                this.nombreProducto = response.resultado.nombre || 'Resultado Indefinido';   
                this.descripcionDelProducto = response.resultado.nombreDeProductoParaFicha || 'Resultado Indefinido'; 
                this.ObtenerFechaDeHoy();    
                this.contadorDePasadas++;
                this.codigoProducto = '';
            } else {
                Swal.fire({
                    title: 'Error',
                    text: response.mensaje || 'No se encontró el producto.',
                    icon: 'error'
                });
                this.contadorDePasadas = 0;
                this.listaDeProductosParaCargar = [];
                this.codigoProducto = '';
            }
        },
        error => {
            console.error('Error al obtener el producto', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al obtener el producto.',
                icon: 'error'
            });
            this.contadorDePasadas = 0;
            this.listaDeProductosParaCargar = [];
            this.codigoProducto = '';
        }
    );
  }

  private CargarAspectosGenerales(): void {
  
    this._FtAspectosGeneralesService.GetListaAspectosGenerales().subscribe(
      response => {
        if (response.esCorrecto) {
          this.listaDeAspectosGeneralesPlantilla = response.resultado; 
        } else {
          Swal.fire('Error', response.mensaje!, 'error'); 
        }
      },
      error => {
        Swal.fire('Error', 'Error al cargar aspectos generales', 'error');
      }
    );
  }

  private CargarEspecificaciones(): void {
  
    this._FtEspecificacionesService.GetListaDeEspecificaciones().subscribe(
      response => {
        if (response.esCorrecto) {
          this.listaDeEspecificacionesPlantilla = response.resultado; 
        } else {
          Swal.fire('Error', response.mensaje!, 'error'); 
        }
      },
      error => {
        Swal.fire('Error', 'Error al cargar especificaciones', 'error'); 
      }
    );
  }

  private CargarDestinos(): void {
    this._FtDestinoService.GetListaDeDestinosFichaTecnica().subscribe({
      next: (response) => {
        this.listaDeDestinos = response.resultado.map((destino: FtDestinoDTO) => ({
          idDestino: destino.idDestino,
          nombre: destino.nombre
        }));
      },
      error: (error) => {
        console.error('Error al obtener los destinos', error);
      }
    });
  }
  
  
  public DisparadorSelectAspectosGenerales(idPlantilla: number): void {

    if (idPlantilla) { // Asegúrate de que idPlantilla no sea undefined
      this._FtAspectosGeneralesService.GetCamposDeAspectosGenerales(idPlantilla).subscribe(
        response => {
          if (response.esCorrecto) {
            const datos = response.resultado[0];
            this.producto = datos.nombreDePlantilla || '';
            this.marca = datos.marca || '';
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

            Swal.fire({
              title: 'Error',
              text: 'Error al Cargar los Aspectos Generales' + response.mensaje,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });    
          }
        },
        error => {
          console.error('Error al cargar campos de aspectos generales', error);
        }
      );
    } else {
      console.warn('ID de plantilla no válido'); 
    }
  }

  public DisparadorSelectEspecificaciones(idPlantilla: number): void {
    if (idPlantilla) { 
      this._FtEspecificacionesService.GetCamposDeEspecificaciones(idPlantilla).subscribe(
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
            this.ph = datos.ph || '';
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

            Swal.fire({
              title: 'Error',
              text: 'Error al Cargar los Aspectos Generales' + response.mensaje,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });    
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

  public CrearFichaTecnica(): void {
   
    if (this.listaDeProductosParaCargar.length === 0) {
        Swal.fire('Error', 'No hay productos para crear la ficha técnica', 'error');
        return;
    }

    if(!this.seleccionDeEspecificaciones || !this.seleccionDeAspectosGenerales || !this.seleccionDeDestino){
      Swal.fire('Error', 'Por favor Seleccione Todas las Plantillas', 'error');
      return;
    }

    if(!this.idioma){
      Swal.fire('Error', 'Por favor Ingrese al menos 1 Idioma', 'error');
      return;
    }

    const imagenesPorSeccion = [
      this.imagenSeleccionadaAreaLogo,
      this.imagenSeleccionadaAreaCorte,
      this.imagenSeleccionadaAreaEnvase,
      this.imagenSeleccionadaAreaEnvaseSecundario,
    ];

    const imagenesCargadas = imagenesPorSeccion.filter(imagen => imagen !== null).length;
    if (imagenesCargadas < 4) {
        Swal.fire('Error', 'Por favor cargue todas las imágenes (minimo 4)', 'error');
        return;
    }

    const codigosDeProducto = this.listaDeProductosParaCargar.join(' - ');

    const fichaTecnica: FtFichaTecnicaDTO = {
        // Identificación
        codigoDeProducto: codigosDeProducto,
        descripcionDeProducto: this.producto || '',
        nombreDeProducto: this.nombreProducto || '',
        descripcionLargaDeProducto: this.descripcionDelProducto || '', 
                    
        // Aspectos generales     
        marca: this.marca || '',
        destino: this.seleccionDeDestino!.nombre, 
        tipoDeUso: this.tipoDeUso || '',
        alimentacion: 'Pendiente',              
        alergeno: this.alergeno || '',                      
        condicionAlmacenamiento: this.almacenamiento || '', 
        vidaUtil: this.vidaUtil || '',                      
        tipoDeEnvase: this.tipoDeEnvase || '',              
        presentacionDeEnvase: this.presentacionDeEnvase || '',       
        pesoPromedio: this.pesoPromedio || 0, 
        unidadesPorCaja: this.unidadesPorCaja || 0, 
        dimensiones: this.dimensiones || '',
        
        // Especificaciones
        grasaVisible: this.grasaVisible || '',
        espesorCobertura: this.espesorCobertura || '',
        ganglios: this.ganglios || '',
        hematomas: this.hematomas || '',
        huesosCartilagos: this.huesosCartilagos || '',
        idioma: this.idioma || '',
        elementosExtranos: this.elementosExtranos || '',
        color: this.color || '',                
        olor: this.olor || '',                  
        ph: this.ph || '',                      
        aerobiosMesofilosTotales: this.aerobiosMesofilosTotales || '',
        enterobacterias: this.enterobacterias || '',
        stec0157: this.stec0157 || '',
        stecNo0157: this.stecNo0157 || '',
        salmonella: this.salmonella || '',
        estafilococos: this.estafilococos || '',
        pseudomonas: this.pseudomonas || '',
        escherichiaColi: this.escherichiaColi || '',
        coliformesTotales: this.coliformesTotales || '',

        observacion: this.observacionDelProducto || '',
        elaboradoPor: this.elaboradoPor || '', 
        aprobadoPor: this.aprobadoPor || '', 
        fechaCreacion: this.fechaDelDia || '', 
    };

    this._FtFichaTecnicaService.CrearFichaTecnica(fichaTecnica).subscribe(
        response => {
            if (response.esCorrecto) {   
                
              this.CrearImagenFichaTecnica();
              
            } else {

              Swal.fire({
                title: 'Error',
                text: 'No se pudo crear la ficha técnica' + response.mensaje,
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });    

            }
        },
        error => {
            console.error('Error al crear la ficha técnica', error);
            Swal.fire('Error', 'Error al crear la ficha técnica', 'error');
        }
    );    
  }


  public ObtenerFechaDeHoy(): void {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0'); 
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); 
    const año = hoy.getFullYear();
    
    this.fechaDelDia = `${dia}-${mes}-${año}`;
  }
  
  
  public MostrarImagenSeleccionada(event: Event, area: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        const reader = new FileReader();

        Array.from(input.files).forEach(file => {
            reader.onload = (e) => {
                switch (area) {
                    case 1:
                        this.urlLogo = e.target?.result as string; 
                        this.imagenSeleccionadaAreaLogo = file;
                        break;
                    case 2:
                        this.urlImagenCorte = e.target?.result as string; 
                        this.imagenSeleccionadaAreaCorte = file;
                        break;
                    case 3:
                        this.urlImagenEnvase = e.target?.result as string; 
                        this.imagenSeleccionadaAreaEnvase = file; 
                        break;
                    case 4:
                        this.urlImagenEnvaseSecundario = e.target?.result as string; 
                        this.imagenSeleccionadaAreaEnvaseSecundario = file;
                        break;
                    case 5:
                      this.urlImagenEnvaseSecundario2 = e.target?.result as string; 
                      this.imagenSeleccionadaAreaEnvaseSecundario2 = file;
                        break;
                    default:
                        console.warn('Área no válida');
                }
            };
            reader.readAsDataURL(file);
        });
    }
  }


  public BorrarImagen(seccion: number): void {

    switch (seccion) {
        case 1:
            this.urlLogo = null; 
            this.imagenSeleccionadaAreaLogo = null;
            break;
        case 2:
            this.urlImagenCorte = null; 
            this.imagenSeleccionadaAreaCorte = null; 
            break;
        case 3:
            this.urlImagenEnvase = null; 
            this.imagenSeleccionadaAreaEnvase = null; 
            break;
        case 4:
            this.urlImagenEnvaseSecundario = null;
            this.imagenSeleccionadaAreaEnvaseSecundario = null; 
            break;
        case 5:
            this.urlImagenEnvaseSecundario2 = null;
            this.imagenSeleccionadaAreaEnvaseSecundario2 = null; 
            break;
        default:
            console.warn('Sección no válida:', seccion);
    }
  }


  public CrearImagenFichaTecnica(): void {

    const imagenesPorSeccion = [
      { seccion: 1, imagen: this.imagenSeleccionadaAreaLogo },
      { seccion: 2, imagen: this.imagenSeleccionadaAreaCorte },
      { seccion: 3, imagen: this.imagenSeleccionadaAreaEnvase },
      { seccion: 4, imagen: this.imagenSeleccionadaAreaEnvaseSecundario },
      { seccion: 5, imagen: this.imagenSeleccionadaAreaEnvaseSecundario2 }
    ];

    const imagenesParaInsertar = imagenesPorSeccion.filter(item => item.imagen);

    const codigosEnListaDeProductos = this.listaDeProductosParaCargar.join('- ');
    
    const requests = imagenesParaInsertar.map(item => {
      const codigoDeProducto = codigosEnListaDeProductos; // Asegúrate de usar el código correcto
      return this._FtImagenesService.CrearImagenFichaTecnica(codigoDeProducto, item.seccion, item.imagen!).toPromise();
    });

    Promise.all(requests)
        .then(responses => {
            // Verificar si todas las respuestas fueron exitosas
            const allSuccess = responses.every(response => response!.esCorrecto);
            if (allSuccess) {
                Swal.fire({
                  title: 'Exito',
                  text: 'Ficha técnica creada correctamente',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                }); 

                this.LimpiarCampos();
            } else {
                const errorMessages = responses.filter(response => !response!.esCorrecto).map(response => response!.mensaje);
                console.error(errorMessages.join(', '));
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            Swal.fire('Error', 'Error al crear imágenes', 'error');
        });
  }

  public LimpiarCampos() {
    this.nombreProducto = '';
    this.descripcionDelProducto = '';
    this.imagenSeleccionadaAreaLogo = null;
    this.urlLogo = null;
    this.imagenSeleccionadaAreaCorte = null;
    this.urlImagenCorte = null; 
    this.imagenSeleccionadaAreaEnvase = null;
    this.urlImagenEnvase = null;
    this.imagenSeleccionadaAreaEnvaseSecundario = null;
    this.urlImagenEnvaseSecundario = null;
    this.imagenSeleccionadaAreaEnvaseSecundario2 = null;
    this.urlImagenEnvaseSecundario2 = null;
    this.listaDeAspectosGeneralesPlantilla = [];
    this.listaDeEspecificacionesPlantilla = [];
    this.camposDeAspectosGenerales = [];
    this.camposDeEspecificaciones = [];
    this.seleccionDeAspectosGenerales = null;
    this.seleccionDeEspecificaciones = null;
    this.listaDeDestinos = [];
    this.seleccionDeDestino = null;
    this.producto = '';
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
    this.nombre = '';
    this.grasaVisible = '';
    this.espesorCobertura = '';
    this.ganglios = '';
    this.hematomas = '';
    this.huesosCartilagos = '';
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
    this.elaboradoPor = 'Departamento de Produccion';
    this.aprobadoPor = 'Jefe de Desosado';
    this.observacionDelProducto = '';
    this.fechaDelDia = '';
    this.listaDeProductosParaCargar = [];
  }
}

