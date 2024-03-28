// To parse this data:
//
//   import { Convert } from "./file";
//
//   const haciendaAnimales = Convert.toHaciendaAnimales(json);

export interface HaciendaAnimal {
    fechaFaena:    Date;
    tropa:         number;
    lote:          number;
    ordinalAnimal: number;
    rechazada:     number;
    segregada:     number;
    especie:       string;
}


// Converts JSON strings to/from your types
export class Convert {
    public static toHaciendaAnimales(json: string): HaciendaAnimal[] {
        return JSON.parse(json);
    }

    public static haciendaAnimalesToJson(value: HaciendaAnimal[]): string {
        return JSON.stringify(value);
    }
}
