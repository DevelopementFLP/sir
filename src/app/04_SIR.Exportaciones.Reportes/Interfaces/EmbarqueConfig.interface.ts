import { Comision } from "./Comision.interface";

export interface EmbarqueConfig {
    idCarga:            number;
    //dua:                string;
    attn:               string;
    numeroVenta:        string;
    barco:              string;
    factura:            string;
    carpeta:            string;
    comision:           Comision;
    shippingMark:       string;
    fechaBL:            Date;
}