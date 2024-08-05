import { Precio } from "./Precio.interface";

export interface TipoDataPrecio {
    totalPesoNeto: number; 
    totalPesoBruto: number; 
    precios: Record<number, Precio>;
}