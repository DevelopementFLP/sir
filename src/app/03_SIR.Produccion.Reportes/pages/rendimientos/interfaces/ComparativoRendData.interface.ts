import { DWSalidaDTO } from "../../cuota/interfaces/DWSalidaDTO.interface";

export interface ComparativoRendData {
    tipo:           string;
    cortes:         DWSalidaDTO[];
    pesoCuartos:    number;
}