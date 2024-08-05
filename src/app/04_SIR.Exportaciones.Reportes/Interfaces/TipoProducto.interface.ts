import { Precio } from "./Precio.interface";

export interface TipoProducto {
    totalPesoNeto: number;
    totalPesoBruto: number;
    precios: Record<number, Precio>;  
}