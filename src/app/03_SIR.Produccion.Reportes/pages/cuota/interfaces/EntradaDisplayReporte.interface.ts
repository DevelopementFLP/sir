import { EntradaDisplay } from "./EntradaDisplay.interface";

export interface EntradaDisplayReporte {
    delantero:  EntradaDisplay[];
    trasero:    EntradaDisplay[];
    cuartos:    number;
    peso:       number;
    pesoAnimal: number;
    animales:   number;
}