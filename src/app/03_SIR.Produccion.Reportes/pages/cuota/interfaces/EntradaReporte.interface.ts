import { LoteEntradaDTO } from "./LoteEntradaDTO.interface";

export interface EntradaReporte {
    entradaDelantero:   LoteEntradaDTO[];
    entradaTrasero:     LoteEntradaDTO[];
    entradaDesconocida: LoteEntradaDTO[];
}