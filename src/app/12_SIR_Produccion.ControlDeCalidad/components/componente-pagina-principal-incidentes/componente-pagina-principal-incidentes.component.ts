import { Component, ViewChild } from '@angular/core';
import { EmpleadoAgrupado, IncidentesDTO, PuestoAgrupado } from '../../interface/IncidentesDTO';
import { IncidentesControlDeCalidadService } from '../../service/IncidentesControlDeCalidad.service';
import { ApiResponse } from 'src/app/09_SIR.Dispositivos.Apps/Interfaces/response-API';
import { FtFichaTecnicaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtFichaTecnicaDTO';

import Swal from 'sweetalert2';
import { ModalVerFichaTecnicaComponent } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/modal/FichaTecnica/modal-ver-ficha-tecnica/modal-ver-ficha-tecnica.component';

@Component({
  selector: 'app-componente-pagina-principal-incidentes',
  templateUrl: './componente-pagina-principal-incidentes.component.html',
  styleUrls: ['./componente-pagina-principal-incidentes.component.css']
})
export class ComponentePaginaPrincipalIncidentesComponent {

  @ViewChild(ModalVerFichaTecnicaComponent) modalFichaTecnica: ModalVerFichaTecnicaComponent | undefined;  // Referencia al modal

  public listaDeIncidentes: IncidentesDTO[] = [];
  public loading: boolean = true;
  public incidentesPorPuesto: any[] = []; 
  public fechaInicio: Date | null = null; 

  // Variables para manejar la visibilidad de los modales
  public incidenteSeleccionado: IncidentesDTO | null = null;
  public imagenAmpliada: string = '';
  public imagenVisibleDialog: boolean = false;  
  public modalVisible: boolean = false;  

  public modalVerFichaTecnicaActivo = false; 
  public fichaSeleccionada: FtFichaTecnicaDTO | null = null;

  public fichasTecnicas: FtFichaTecnicaDTO[] = [];

  constructor(  
    private _incidenteService: IncidentesControlDeCalidadService
  ) { }

  ngOnInit(): void {

  }

  // Método que llama al servicio para obtener los incidentes filtrados por la fecha
  public GenerarListaDeIncidentes(): void {
    if (!this.fechaInicio) {
      Swal.fire({
        icon: 'error',
        title: 'Seleccione una Fecha',
        text: 'Seleccione una fecha para iniciar la busqueda',
        confirmButtonText: 'Aceptar'
      });
      return; 
    }
  
    const fechaDelDia = this.fechaInicio.toISOString().split('T')[0];
  
    this.loading = true;
  
    this._incidenteService.GetListaDeTipoDeIncidente(fechaDelDia).subscribe(
      (response: ApiResponse) => {
        if (response.resultado && Array.isArray(response.resultado) && response.resultado.length > 0) {
          // Agrupamos los incidentes por puesto de trabajo y luego por empleado
          this.incidentesPorPuesto = this.UnificacionDeGruposDePuestoEmpleado(response.resultado);
        } else {
          console.error('No se encontraron incidentes para la fecha seleccionada.');
          // Mostrar alerta si no hay incidentes
          Swal.fire({
            icon: 'info',
            title: 'Sin resultados',
            text: 'No se encontraron incidentes para la fecha seleccionada.',
            confirmButtonText: 'Aceptar'
          });
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
  
  

  private GrupoIncidentsPorPuesto(incidentes: any[]): any[] {
    const puestos: { [key: string]: any } = {};
  
    // Función para extraer la primera palabra relevante del puesto de trabajo
    const obtenerNombrePuesto = (puesto: string): string => {
      const match = puesto.match(/\s*(\w+)\s*\d*$/); // Regex para capturar la primera palabra después de un espacio y números
      return match ? match[1] : puesto;  // Retorna la primera palabra relevante o el puesto completo si no se encuentra
    };
  
    // Agrupar incidentes por el nombre común del puesto de trabajo
    incidentes.forEach(incidente => {
      if (incidente.puestoDeTrabajo) {
        const nombrePuesto = obtenerNombrePuesto(incidente.puestoDeTrabajo);
  
        if (!puestos[nombrePuesto]) {
          puestos[nombrePuesto] = { nombrePuesto, incidentes: [] };
        }
  
        puestos[nombrePuesto].incidentes.push(incidente);
      }
    });
  
    // Convertir los grupos a un array de puestos
    return Object.keys(puestos).map(puesto => ({
      nombrePuesto: puestos[puesto].nombrePuesto,
      incidentes: puestos[puesto].incidentes
    }));
  }
  
  // Función para agrupar los incidentes por 'codigoDeEmpleado'
  private GrupoIncidentsPorEmpleado(incidentes: any[]): any[] {
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

  // Función para agrupar los incidentes por 'tipoDeIncidente'
  private GrupoIncidentsPorTipoDeIncidente(incidentes: any[]): any[] {
    const grupos: { [key: string]: any[] } = {};

    // Agrupamos los incidentes por 'tipoDeIncidente'
    incidentes.forEach(incidente => {
      if (incidente.tipoDeIncidente) {
        if (!grupos[incidente.tipoDeIncidente]) {
          grupos[incidente.tipoDeIncidente] = [];
        }
        grupos[incidente.tipoDeIncidente].push(incidente);
      }
    });

    // Convertimos el objeto de grupos en un array con los datos necesarios
    return Object.keys(grupos).map(tipo => ({
      tipoDeIncidente: tipo,
      cantidad: grupos[tipo].length,
      incidentes: grupos[tipo]
    }));
  }


  private UnificacionDeGruposDePuestoEmpleado(incidentes: IncidentesDTO[]): PuestoAgrupado[] {
    // Primero agrupamos los incidentes por puesto
    const puestosAgrupados = this.GrupoIncidentsPorPuesto(incidentes);
  
    // Ahora agrupamos los incidentes por tipo de incidente dentro de cada empleado
    puestosAgrupados.forEach((puesto: PuestoAgrupado) => {
      // Agrupamos los incidentes por empleado dentro de cada puesto
      puesto.incidentesPorEmpleado = this.GrupoIncidentsPorEmpleado(puesto.incidentes);
  
      // Dentro de cada empleado, agrupamos por tipo de incidente
      puesto.incidentesPorEmpleado.forEach((empleado: EmpleadoAgrupado) => {
        empleado.incidentesPorTipo = this.GrupoIncidentsPorTipoDeIncidente(empleado.incidentes);
      });
    });
  
    return puestosAgrupados;
  }
   

  public VerIncidenteDetalle(incidente: IncidentesDTO): void {
    this.incidenteSeleccionado = incidente;
    this.modalVisible = true; 
  }

  public VerImagen(imagenBase64: string): void {
    this.imagenAmpliada = imagenBase64;
    this.imagenVisibleDialog = true;  // Mostrar el modal de imagen ampliada
  }

  public CerrarModal(): void {
    this.modalVisible = false;  // Cerrar el modal de detalles
  }

  public CerrarImagenModal(): void {
    this.imagenVisibleDialog = false;  // Cerrar el modal de imagen ampliada
  }

  public AbrirModalFichaTecnica(incidente: any) {

  if (this.modalFichaTecnica) {
    this.modalVerFichaTecnicaActivo = true;
    this.modalFichaTecnica.BuscarFichaTecnica(incidente); 
    }
  }

  // Método para cerrar el modal de creación
  public CerrarModalVerFichaTecnica(): void {
    this.modalVerFichaTecnicaActivo = false;
  }

}
