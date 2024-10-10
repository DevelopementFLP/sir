import { DWSalidaDTO } from "../../cuota/interfaces/DWSalidaDTO.interface";
import { LoteEntradaDTO } from "../../cuota/interfaces/LoteEntradaDTO.interface";
import { CorteDataDTO } from "./CorteDataDTO.interface";
import { TipoLote } from "./TipoLote.interface";

export interface CorteLote {
    id:         number;
    nombre:     string;
    lotes:      TipoLote[];
    entrada:    LoteEntradaDTO[]
    cortes:     DWSalidaDTO[];
}