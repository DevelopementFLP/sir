import { DataKosher } from "./DataKosher.interface";

export interface Precio {
    totalPesoNeto: number;
    totalPesoBruto: number;
    items: DataKosher[];
}