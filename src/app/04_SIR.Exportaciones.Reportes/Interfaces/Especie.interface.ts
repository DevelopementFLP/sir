import { TipoProducto } from "./TipoProducto.interface";

export interface Especie {
    totalPesoNeto: number;
    totalPesoBruto: number;
    tipoProductos: Record<string, TipoProducto>;
}