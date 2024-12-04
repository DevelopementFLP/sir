
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

  // Método que se llama cuando el modal se cierra después de la edición
  public EscucharCierreDeModal(event: boolean): void {
    if (event) {
      this.modalEditarPlantillaAspectosGeneralesActivo = false;
      this.CargarPlantillas(); 
    }
  }

  public EliminarPlantilla(idPlantilla: number) {
    console.log(`Eliminando plantilla con ID: ${idPlantilla}`);
  }

}
