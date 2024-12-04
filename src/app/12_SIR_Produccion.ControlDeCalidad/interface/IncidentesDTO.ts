export interface IncidentesDTO {
    idIncidente: number;
    codigoQr: string;
    puestoDeTrabajo: string;
    codigoDeEmpleado: string;
    nombreDeEmpleado: string;
    producto: string;
    hora: string;
    tipoDeIncidente: number;
    imagenDeIncidente: string;
    codigoDeProducto: string;
    fechaDeRegistro: string;
  }
  

  export interface EmpleadoAgrupado {
    codigoDeEmpleado: string;
    nombreDeEmpleado: string;
    incidentes: IncidentesDTO[];
    incidentesPorTipo?: any[]; 
  }
  
  export interface PuestoAgrupado {
    nombrePuesto: string;
    incidentes: IncidentesDTO[];
    incidentesPorEmpleado: EmpleadoAgrupado[];
  }