import { DWSalidaDTO } from "../../cuota/interfaces/DWSalidaDTO.interface";

export interface ComparativoRendData {
    fecha?:          Date;
    tipo:           string;
    cortes:         DWSalidaDTO[];
    pesoCuartos:    number;
}