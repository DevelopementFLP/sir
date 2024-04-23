import { HorasComparar } from "./HorasComparar.interface";
import { HorasIncidencias } from "./HorasIncidencias.interface";
import { Incidencia } from "./Incidencia.interface";

export interface InconsistenciaDataPrint {
    incidencias: Incidencia[];
    inconsistencias: HorasComparar[];
}