import { DWSalidaDTO } from "../pages/cuota/interfaces/DWSalidaDTO.interface";
import { LoteEntradaDTO } from "../pages/cuota/interfaces/LoteEntradaDTO.interface";

export interface TipoRendimientoData {
    id: number;
    entrada: LoteEntradaDTO[];
    cortes: DWSalidaDTO[];
    totalPesoEntrada: number;
}