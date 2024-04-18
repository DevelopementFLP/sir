import { HorasPorFuncionario } from "./HorasPorFuncionario.interface";
import { Incidencia } from "./Incidencia.interface";

export interface HorasIncidencias {
    horas: HorasPorFuncionario[];
    incidencias: Incidencia[]
}