import { Especie } from "./Especie.interface";

export interface TipoDataContainer {
    totalPesoNeto: number;
    totalPesoBruto: number;
    especies: Record<string, Especie>;
}