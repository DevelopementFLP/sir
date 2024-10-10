import { DWSalidaDTO } from "../../cuota/interfaces/DWSalidaDTO.interface";
import { LoteEntradaDTO } from "../../cuota/interfaces/LoteEntradaDTO.interface";

export interface DataRendimiento {
    fecha:          Date;
    entrada:        LoteEntradaDTO[];
    cortes:         DWSalidaDTO[];
    totalCuartos:   number;
    pesoCuartos:    number;
    totalCortes:    number;
    pesoCortes:     number;
}