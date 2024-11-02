export interface FtFichaTecnicaDTO {
    idFichaTecnica?: number;
    codigoDeProducto?: string;
    descripcionDeProducto?: string; 
    nombreDeProducto?: string; 
    descripcionLargaDeProducto?: string; 
    marca?: string;               
    destino?: string; 
    tipoDeUso?: string;          
    alimentacion?: string; 
    alergeno?: string;           
    condicionAlmacenamiento?: string; 
    vidaUtil?: string;           
    tipoDeEnvase?: string;       
    presentacionDeEnvase?: string; 

    pesoPromedio?: number; 
    unidadesPorCaja?: number; 
    dimensiones?: string; 

    // Especificaciones
    grasaVisible?: string; 
    espesorCobertura?: string; 
    ganglios?: string; 
    hematomas?: string; 
    huesosCartilagos?: string; 
    idioma?: string; 
    elementosExtranos?: string; 

    // Calidad microbiológica
    color?: string; 
    olor?: string; 
    ph?: string;  
    aerobiosMesofilosTotales?: string; 
    enterobacterias?: string; 
    stec0157?: string; 
    stecNo0157?: string; 
    salmonella?: string; 
    estafilococos?: string; 
    pseudomonas?: string; 
    escherichiaColi?: string; 
    coliformesTotales?: string; 

    observacion?: string;
    elaboradoPor?: string;
    aprobadoPor?: string;
    fechaCreacion?: string;
}
