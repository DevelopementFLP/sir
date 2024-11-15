import { Component, ViewChild } from '@angular/core';
import { IncidentesDTO } from '../../interface/IncidentesDTO';
import { IncidentesControlDeCalidadService } from '../../service/IncidentesControlDeCalidad.service';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';

@Component({
  selector: 'app-componente-pagina-principal-incidentes',
  templateUrl: './componente-pagina-principal-incidentes.component.html',
  styleUrls: ['./componente-pagina-principal-incidentes.component.css']
})
export class ComponentePaginaPrincipalIncidentesComponent {

  public listaDeIncidentes: IncidentesDTO[] = [];
  public loading: boolean = true;
  public incidentesPorPuesto: any[] = []; 
  public fechaInicio: Date | null = null; 

  // Variables para manejar la visibilidad de los modales
  public incidenteSeleccionado: IncidentesDTO | null = null;
  public imagenAmpliada: string = '';
  public imagenVisibleDialog: boolean = false;  
  public modalVisible: boolean = false;  

  constructor(  
    private _incidenteService: IncidentesControlDeCalidadService
  ) { }

  ngOnInit(): void {

  }


   // Método que llama al servicio para obtener los incidentes filtrados por la fecha
   public GenerarListaDeIncidentes(): void {
    if (!this.fechaInicio) {
      console.error('Por favor seleccione una fecha para cargar los incidentes');
      return; 
    }

    const fechaDelDia = this.fechaInicio.toISOString().split('T')[0];

    this.loading = true; 

    this._incidenteService.GetListaDeTipoDeIncidente(fechaDelDia).subscribe(
      (response: ApiResponse) => {
        if (response.resultado && Array.isArray(response.resultado)) {

          this.incidentesPorPuesto = this.groupIncidentsByEmployee(response.resultado);
          console.log(this.incidentesPorPuesto)

        } else {

          console.error('La respuesta no contiene una lista válida de incidentes.');

        }

        this.listaDeIncidentes = response.resultado;
        this.loading = false; 
        this.fechaInicio = null; 
      },
      (error) => {
        console.error('Error al cargar los incidentes', error);
        this.loading = false; 
      }
    );
  }

  // Función para agrupar los incidentes por 'codigoDeEmpleado'
  private groupIncidentsByEmployee(incidentes: any[]): any[] {

    const grupos: { [key: string]: any[] } = {};

    // Agrupamos los incidentes por 'codigoDeEmpleado'
    incidentes.forEach(incidente => {

      if (incidente.codigoDeEmpleado) {
        if (!grupos[incidente.codigoDeEmpleado]) {
          grupos[incidente.codigoDeEmpleado] = [];
        }
        grupos[incidente.codigoDeEmpleado].push(incidente);
      }
    });

    return Object.keys(grupos).map(codigo => ({
      codigoDeEmpleado: codigo,
      cantidad: grupos[codigo].length,
      incidentes: grupos[codigo]
    }));
  }

  public VerIncidenteDetalle(incidente: IncidentesDTO): void {
    this.incidenteSeleccionado = incidente;
    this.modalVisible = true; 
  }

  public VerImagen(imagenBase64: string): void {
    this.imagenAmpliada = imagenBase64;
    this.imagenVisibleDialog = true;  // Mostrar el modal de imagen ampliada
  }

  public closeModal(): void {
    this.modalVisible = false;  // Cerrar el modal de detalles
  }

  public closeImagenModal(): void {
    this.imagenVisibleDialog = false;  // Cerrar el modal de imagen ampliada
  }

}
