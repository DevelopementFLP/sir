// To parse this data:
//
//   import { Convert } from "./file";
//
//   const haciendaLotes = Convert.toHaciendaLotes(json);

export interface HaciendaLotes {
    fechaFaena:   Date;
    tropa:        number;
    categoria:    Categoria;
    raza:         Raza;
    lote:         number;
    kilosprimera: number;
    //observacion:  string;
    reses:        number;
    rechazados:   number;
    productor:    string;
    especie:      Especie;
}

export enum Categoria {
    Borregas24 = "Borregas 2-4",
    Carnero = "Carnero",
    CorderoDL = "Cordero DL",
    Novillo = "Novillo",
    Ovejas = "Ovejas",
    Vaca = "Vaca",
    Vaquillona = "Vaquillona",
}

export enum Especie {
    B = "B",
    O = "O",
}

export enum Raza {
    Angus = "Angus",
    Cruza = "Cruza",
    Empty = "",
    Holando = "Holando",
}

// Converts JSON strings to/from your types
export class Convert {
    public static toHaciendaLotes(json: string): HaciendaLotes[] {
        return JSON.parse(json);
    }

    public static haciendaLotesToJson(value: HaciendaLotes[]): string {
        return JSON.stringify(value);
    }
}
