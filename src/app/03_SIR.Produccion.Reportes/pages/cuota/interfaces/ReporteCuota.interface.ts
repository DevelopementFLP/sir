import { DWEntrada } from "./DWEntrada.interface";
import { LoteEntradaDTO } from "./LoteEntradaDTO.interface";
import { SalidaDTO } from "./SalidaDTO.interface";

export interface ReporteCuota {
    fecha:      string;
    id:         number;
    entrada:    LoteEntradaDTO[];
    cortes:     SalidaDTO[];
}