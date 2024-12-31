
import { Component, OnInit } from '@angular/core';
import { FtAspectosGeneralesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtAspectosGeneralesDTO';
import { FtEspecificacionesPlantillaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtEspecificacionesDTO';
import { FtAspectosGeneralesService } from '../../service/CreacionDeFichaTecnicaServicios/FtPlantilla/FtAspectosGenerales.service';
import { FtEspecificacionesService } from '../../service/CreacionDeFichaTecnicaServicios/FtPlantilla/FtEspecificaciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-lista-de-plantillas',
  templateUrl: './lista-de-plantillas.component.html',
  styleUrls: ['./lista-de-plantillas.component.css']
})
export class ListaDePlantillasComponent implements OnInit {

  // Propiedades para almacenar las plantillas
  public plantillasAspectosGenerales: FtAspectosGeneralesPlantillaDTO[] = [];
  public plantillaAspectosGeneralesSeleccionada: FtAspectosGeneralesPlantillaDTO | null = null;
  
  public plantillasEspecificaciones: FtEspecificacionesPlantillaDTO[] = [];
  public plantillasEspecificacionesSeleccionada: FtEspecificacionesPlantillaDTO | null = null;

  public resultadoDePlantillaSeleccionada: any[] = []; 
  public loading: boolean = false;
  
  // Propiedad para almacenar el tipo de plantilla seleccionado
  public tipoPlantillaSeleccionado: string = 'aspectosGenerales';

  public modalEditarPlantillaAspectosGeneralesActivo = false;
  public modalEditarPlantillaEspecificacionesActivo = false;

  constructor(
    private _plantillaAspectosGeneralesService: FtAspectosGeneralesService,
    private _plantillaEspecificacionesService: FtEspecificacionesService
  ) {}

  ngOnInit(): void {
    this.CargarPlantillas();  
  }

  // Función para cargar las plantillas dependiendo del tipo seleccionado
  public CargarPlantillas(): void {
    this.loading = true;

    if (this.tipoPlantillaSeleccionado === 'aspectosGenerales') {
      this.ObtenerPlantillasAspectosGenerales();
    } else if (this.tipoPlantillaSeleccionado === 'especificaciones') {
      this.ObtenerPlantillasEspecificaciones();
    }
  }

  public ObtenerPlantillasAspectosGenerales(): void {
    this._plantillaAspectosGeneralesService.GetListaAspectosGenerales().subscribe(response => {
      if (response.esCorrecto) {
        this.plantillasAspectosGenerales = response.resultado;
        this.resultadoDePlantillaSeleccionada = this.plantillasAspectosGenerales;  
        this.loading = false;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Error al obtener aspectos generales: ${response.mensaje}`,
        });
        this.loading = false;
      }
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Error de Conexión',
        text: `Ocurrió un error al intentar obtener aspectos generales: ${error.message}`,
      });
      this.loading = false;
    });
  }

  public ObtenerPlantillasEspecificaciones(): void {
    this._plantillaEspecificacionesService.GetListaDeEspecificaciones().subscribe(response => {
      if (response.esCorrecto) {
        this.plantillasEspecificaciones = response.resultado;
        this.resultadoDePlantillaSeleccionada = this.plantillasEspecificaciones;  
        this.loading = false;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Error al obtener especificaciones: ${response.mensaje}`,
        });
        this.loading = false;
      }
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Error de Conexión',
        text: `Ocurrió un error al intentar obtener especificaciones: ${error.message}`,
      });
      this.loading = false;
    });
  }


  public AbrirModalEditarPlantillaAspectosGenerales(plantilla: FtAspectosGeneralesPlantillaDTO) {

      this.plantillaAspectosGeneralesSeleccionada = plantilla;
      this.modalEditarPlantillaAspectosGeneralesActivo = true;
  }

  public AbrirModalEditarPlantillaEspecificaciones(plantilla: FtEspecificacionesPlantillaDTO) {

    this.plantillasEspecificacionesSeleccionada = plantilla;
    this.modalEditarPlantillaEspecificacionesActivo = true;
}

  public CerrarModalEditarPlantilla() {
    this.modalEditarPlantillaAspectosGeneralesActivo = false;
    this.modalEditarPlantillaEspecificacionesActivo = false;
  }


  public EscucharCierreDeModal(tipoModal: string): void {
    if (tipoModal === 'aspectosGenerales') {
      this.modalEditarPlantillaAspectosGeneralesActivo = false;
      this.ObtenerPlantillasAspectosGenerales();
      this.tipoPlantillaSeleccionado = 'aspectosGenerales'; 
    } else if (tipoModal === 'especificaciones') {
      // Si el modal cerrado es de Especificaciones
      this.modalEditarPlantillaEspecificacionesActivo = false;
      this.ObtenerPlantillasEspecificaciones();
      this.tipoPlantillaSeleccionado = 'especificaciones'; 
    } else {
     
      this.modalEditarPlantillaAspectosGeneralesActivo = false;
      this.modalEditarPlantillaEspecificacionesActivo = false;
      this.resultadoDePlantillaSeleccionada = []; 
      this.tipoPlantillaSeleccionado = 'aspectosGenerales'; 
    }
  }
  

  public EliminarPlantilla(idPlantilla: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás recuperar esta plantilla una vez eliminada.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.tipoPlantillaSeleccionado === 'aspectosGenerales') {

          this._plantillaAspectosGeneralesService.EliminarAspectoGeneral(idPlantilla).subscribe(response => {
            if (response.esCorrecto) {
              this.ObtenerPlantillasAspectosGenerales();
              Swal.fire(
                'Eliminado!',
                'La plantilla de aspectos generales ha sido eliminada.',
                'success'
              );
            } else {
              console.error('Error al eliminar ficha técnica de Aspectos Generales: ', response.mensaje);
              Swal.fire(
                'Error',
                'Hubo un problema al eliminar la plantilla de aspectos generales.',
                'error'
              );
            }
          }, error => {
            console.error('Error de conexión al eliminar ficha técnica de Aspectos Generales: ', error);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la plantilla de aspectos generales.',
              'error'
            );
          });
        } else if (this.tipoPlantillaSeleccionado === 'especificaciones') {

          this._plantillaEspecificacionesService.EliminarEspecificaciones(idPlantilla).subscribe(response => {
            if (response.esCorrecto) {
              this.ObtenerPlantillasEspecificaciones();  
              Swal.fire(
                'Eliminado!',
                'La plantilla de especificaciones ha sido eliminada.',
                'success'
              );
            } else {
              console.error('Error al eliminar ficha técnica de Especificaciones: ', response.mensaje);
              Swal.fire(
                'Error',
                'Hubo un problema al eliminar la plantilla de especificaciones.',
                'error'
              );
            }
          }, error => {
            console.error('Error de conexión al eliminar ficha técnica de Especificaciones: ', error);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la plantilla de especificaciones.',
              'error'
            );
          });
        }
      }
    });
  }
  

}
