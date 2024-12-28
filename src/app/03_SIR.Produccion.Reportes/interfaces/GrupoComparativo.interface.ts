import { ProductoData } from "./ProductoData.interface";

export interface GrupoComparativo {
    id: number;
    nombre: string;
    productos: ProductoData[];
}