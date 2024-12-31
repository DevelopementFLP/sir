import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { CrearFichaTecnicaComponent } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/components/CreacionDeFichaTecnica/crear-ficha-tecnica/crear-ficha-tecnica.component';
import { FtFichaTecnicaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtFichaTecnicaDTO';
import { FtDestinoDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Destinos/FtDestinoDTO';
import { FtFichaTecnicaService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtFichaTecnica/FtFichaTecnica.service';
import { FtImagenesService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtPlantilla/FtImagenes.service';
import { FtProductoService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/CreacionDeFichaTecnicaServicios/FtProducto/FtProducto.service';
import { FtDestinosService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtDestinos/FtDestinos.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'modal-crear-ficha-en-pdf',
  templateUrl: './modal-crear-ficha-en-pdf.component.html',
  styleUrls: ['./modal-crear-ficha-en-pdf.component.css']
})
export class ModalCrearFichaEnPdfComponent {

  @ViewChild('fileUpload') fileUpload: FileUpload | undefined;
  @ViewChild(CrearFichaTecnicaComponent) crearFichaTecnicaComponent: CrearFichaTecnicaComponent | undefined;

  @Output() modalCerrado: EventEmitter<boolean> = new EventEmitter<boolean>(); 
  @Input() abriElModal: boolean = false;

  public codigoProducto: string = '';
  public listaCodigos: string[] = [];

  public nombreDeProducto: string = '';
  public contadorDePasadas: number = 0;

  public pdfSeleccionado: File | null = null;

  public seleccionDeDestino: FtDestinoDTO | null = null;
  public listaDeDestinos: FtDestinoDTO[] = [];


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['abriElModal'] && this.abriElModal) {
      this.LimpiarCampos();
      this.CargarDestinos();
    }
  }

  // public imagenSeleccionadaAreaCorte: File | null = null;
  // public urlImagenCorte: string | null = null;

  // public imagenSeleccionadaAreaEnvase: File | null = null;
  // public urlImagenEnvase: string | null = null;
 
  // public imagenSeleccionadaAreaEnvaseSecundario: File | null = null;
  // public urlImagenEnvaseSecundario: string | null = null;
 
  // public imagenSeleccionadaAreaEnvaseSecundario2: File | null = null;
  // public urlImagenEnvaseSecundario2: string | null = null;

  
  constructor(
    private _FtFichaTecnicaService: FtFichaTecnicaService,
    private _FtImagenesService: FtImagenesService,
    private _FtDestinoService: FtDestinosService,
    private _FtProductoService: FtProductoService,
  ) { }
  
  public AgregarCodigo() {
    if (this.codigoProducto!.trim() !== '') {
      const codigoProductoRecibido = this.codigoProducto!.trim();

      this._FtFichaTecnicaService.BuscarFichaTecnica(codigoProductoRecibido).subscribe(
        response => {
          if (response.esCorrecto && response.resultado) {
            Swal.fire({
              title: 'Error',
              text: 'Este código de producto ya está asociado a una ficha técnica.',
              icon: 'error'
            });
            this.codigoProducto = '';
            this.modalCerrado.emit(true);
            return;
          } else {
            this.listaCodigos.push(this.codigoProducto); 

            if(this.contadorDePasadas == 0){
              this.ObtenerNombreProducto(this.codigoProducto)
              this.contadorDePasadas++;
            }

            this.codigoProducto = '';  
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
                  this.nombreDeProducto = response.resultado.nombre || 'Resultado Indefinido';  
                  console.log(this.nombreDeProducto);                
              } else {
                  Swal.fire({
                      title: 'Error',
                      text: response.mensaje || 'No se encontró el producto.',
                      icon: 'error'
                  });
                  this.listaCodigos = [];
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
              this.codigoProducto = '';
          }
      );
  }


  public SeleccionarPdf(event: any) {
    this.pdfSeleccionado = event.files[0];
  }


  public CrearFichaTecnica(): void {

    if (this.listaCodigos.length === 0) {
      Swal.fire('Error', 'No hay productos para crear la ficha técnica', 'error');
      this.LimpiarCampos()
      this.modalCerrado.emit(true); 
      return;
    }

    if (this.pdfSeleccionado == null) {
      Swal.fire('Error', 'Seleccione un PDF', 'error');
      this.LimpiarCampos()
      this.modalCerrado.emit(true); 
      return;
    }

    // const imagenesRequeridas = [
    //   { imagen: this.imagenSeleccionadaAreaCorte, nombre: 'Imagen de Corte' },
    //   { imagen: this.imagenSeleccionadaAreaEnvase, nombre: 'Imagen de Envase' },
    //   { imagen: this.imagenSeleccionadaAreaEnvaseSecundario, nombre: 'Imagen de Envase Secundario' },
    //   { imagen: this.imagenSeleccionadaAreaEnvaseSecundario2, nombre: 'Imagen de Envase Secundario 2' },
    // ];

    // const imagenesFaltantes = imagenesRequeridas.filter(item => !item.imagen);

    // if (imagenesFaltantes.length > 0) {
    //   const errores = imagenesFaltantes.map(item => item.nombre).join(', ');
    //   Swal.fire('Error', `Faltan las siguientes imágenes: ${errores}`, 'error');
    //   this.LimpiarCampos()
    //   this.modalCerrado.emit(true); 
    //   return;
    // }

    const codigosDeProducto = this.listaCodigos.join(', '); 

    const fichaTecnica: FtFichaTecnicaDTO = {
        codigoDeProducto: codigosDeProducto,  
        descripcionDeProducto: '', 
        nombreDeProducto: this.nombreDeProducto || 'Indefinido',  
        descripcionLargaDeProducto: '',     
        marca: '',  
        destino: this.seleccionDeDestino?.nombre || 'Indefinido',   
        tipoDeUso: '',  
        alimentacion: '',  
        alergeno: '',  
        condicionAlmacenamiento: '',  
        vidaUtil: '',  
        tipoDeEnvase: '',  
        presentacionDeEnvase: '',  
        pesoPromedio: '',  
        unidadesPorCaja: '',  
        dimensiones: '',  
        
        // Especificaciones
        grasaVisible: '',  
        espesorCobertura: '',  
        ganglios: '',  
        hematomas: '',  
        huesosCartilagos: '',  
        idioma: '',  
        elementosExtranos: '',  
        color: '',  
        olor: '',  
        ph: '',  
        aerobiosMesofilosTotales: '',  
        enterobacterias: '',  
        stec0157: '',  
        stecNo0157: '',  
        salmonella: '',  
        estafilococos: '',  
        pseudomonas: '',  
        escherichiaColi: '',  
        coliformesTotales: '',  
        coliformesFecales: '',  

        observacion: '',  
        elaboradoPor: '',  
        aprobadoPor: '',  
        fechaCreacion: '',  
    };


    this._FtFichaTecnicaService.CrearFichaTecnica(fichaTecnica, this.pdfSeleccionado!).subscribe(
        response => {
            if (response.esCorrecto) {   

                // this.CrearImagenFichaTecnica();
                this.modalCerrado.emit(true); 
                this.LimpiarCampos()

                Swal.fire({
                    title: 'Éxito',
                    text: 'Ficha técnica creada correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                this.modalCerrado.emit(true); 
                this.LimpiarCampos()

                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo crear la ficha técnica: ' + response.mensaje,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        },
        error => {
            console.error('Error al crear la ficha técnica', error);
            this.modalCerrado.emit(true); 
            this.LimpiarCampos()
            Swal.fire('Error', 'Error al crear la ficha técnica', 'error');
        }
    );
  }


 
  // public MostrarImagenSeleccionada(event: any, seccion: number): void {
  //   const archivo = event.target.files[0];
  //   if (archivo) {

  //     if (seccion === 2) {

  //       this.urlImagenCorte = URL.createObjectURL(archivo);
  //       this.imagenSeleccionadaAreaCorte = archivo;

  //     }else if (seccion === 3) {

  //       this.urlImagenEnvase = URL.createObjectURL(archivo);
  //       this.imagenSeleccionadaAreaEnvase = archivo;

  //     } else if (seccion === 4) {

  //       this.urlImagenEnvaseSecundario = URL.createObjectURL(archivo);
  //       this.imagenSeleccionadaAreaEnvaseSecundario = archivo;

  //     } else if (seccion === 5) {

  //       this.urlImagenEnvaseSecundario2 = URL.createObjectURL(archivo);
  //       this.imagenSeleccionadaAreaEnvaseSecundario2 = archivo;

  //     }
  //   }
  // }

  // public CrearImagenFichaTecnica(): void {

  //   const imagenesPorSeccion = [
  //     { seccion: 2, imagen: this.imagenSeleccionadaAreaCorte },
  //     { seccion: 3, imagen: this.imagenSeleccionadaAreaEnvase },
  //     { seccion: 4, imagen: this.imagenSeleccionadaAreaEnvaseSecundario },
  //     { seccion: 5, imagen: this.imagenSeleccionadaAreaEnvaseSecundario2 }
  //   ];

  //   const imagenesParaInsertar = imagenesPorSeccion.filter(item => item.imagen);

  //   const codigosEnListaDeProductos = this.listaCodigos.join('- ');
    
  //   const requests = imagenesParaInsertar.map(item => {
  //     const codigoDeProducto = codigosEnListaDeProductos; 
  //     return this._FtImagenesService.CrearImagenFichaTecnica(codigoDeProducto, item.seccion, item.imagen!).toPromise();
  //   });

  //   Promise.all(requests)
  //       .then(responses => {
  //           const allSuccess = responses.every(response => response!.esCorrecto);
  //           if (allSuccess) {
  //               Swal.fire({
  //                 title: 'Exito',
  //                 text: 'Ficha técnica creada correctamente',
  //                 icon: 'success',
  //                 confirmButtonText: 'Aceptar'
  //               }); 
  //           } else {
  //               const errorMessages = responses.filter(response => !response!.esCorrecto).map(response => response!.mensaje);
  //               console.error(errorMessages.join(', '));
  //           }
  //       })
  //       .catch(error => {
  //           console.error('Error en la solicitud:', error);
  //           Swal.fire('Error', 'Error al crear imágenes', 'error');
  //       });
  // }


  // public BorrarImagen(seccion: number): void {
  //   switch (seccion) {
  //     case 2:
  //       this.urlImagenCorte = null;
  //       this.imagenSeleccionadaAreaCorte = null;
  //       break;
  //     case 3:
  //       this.urlImagenEnvase = null;
  //       this.imagenSeleccionadaAreaEnvase = null;
  //       break;
  //     case 4:
  //       this.urlImagenEnvaseSecundario = null;
  //       this.imagenSeleccionadaAreaEnvaseSecundario = null;
  //       break;
  //     case 5:
  //       this.urlImagenEnvaseSecundario2 = null;
  //       this.imagenSeleccionadaAreaEnvaseSecundario2 = null;
  //       break;
  //     default:
  //       console.warn('Sección no válida:', seccion);
  //   }
  // }

  public LimpiarCampos(): void {
    this.codigoProducto = '';
    this.listaCodigos = [];
    this.pdfSeleccionado = null; 
    this.listaDeDestinos = []; 
    this.seleccionDeDestino = null;
    if (this.fileUpload) {
      this.fileUpload.clear(); // Limpiar el componente p-fileUpload
    }
    this.nombreDeProducto= '';
    // this.urlImagenCorte = null;
    // this.imagenSeleccionadaAreaCorte = null;
    // this.urlImagenEnvase = null;
    // this.imagenSeleccionadaAreaEnvase = null;
    // this.urlImagenEnvaseSecundario = null;
    // this.imagenSeleccionadaAreaEnvaseSecundario = null;
    // this.urlImagenEnvaseSecundario2 = null;
    // this.imagenSeleccionadaAreaEnvaseSecundario2 = null;
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


}
