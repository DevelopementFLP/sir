import { Incidencia } from "./Incidencia.interface";

export interface IncidenciaAgrupada {
    motivo: string;
    funcionarios: Incidencia[];
}