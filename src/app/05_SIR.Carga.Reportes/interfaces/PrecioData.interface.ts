import { PLPallet } from "./PLPallet.interface";

export interface PrecioData {
    precio:         number;
    codigoKosher:   string;
    data:           PLPallet[];
    cantidadPallet: number;
    cantidadCajas:  number;
    pesoNeto:       number;
    pesoBruto:      number;
}