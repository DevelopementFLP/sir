import { PLPallet } from "./PLPallet.interface";

export interface XFCL {
    contenedor:         string;
    pesoNeto:           number;
    pesoBruto:          number;
    cantidadCajas:      number;
    cantidadPallets:    number;
    data:               PLPallet[];
}