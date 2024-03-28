// To parse this data:
//
//   import { Convert } from "./file";
//
//   const haciendaTipificacion = Convert.toHaciendaTipificacion(json);

export interface HaciendaTipificacion {
    fechaFaena:     Date;
    especie:        Especie;
    anio:           number;
    tropa:          number;
    lote:           number;
    categoria:      Categoria;
    raza:           Raza;
    calidad:        Calidad;
    subCategoria:   string;
    tipificcion:    Tipificacion;
}

export enum Calidad {
    Blanca = "BLANCA",
    Gordo = "GORDO",
    Lana = "LANA",
    Pelado = "PELADO",
    Segund = "SEGUND",
    Toruno = "TORUNO",
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

export enum SubCategoria {
    NovillitoDI = "Novillito d.i.",
    NovillitoJoven24D = "Novillito joven 2-4d.",
    Novillo = "Novillo",
    Novillo6Dientes = "Novillo 6 Dientes",
    SinSubCateg = "Sin SubCateg",
    Vaca = "Vaca",
    Vaca6Dientes = "Vaca 6 Dientes",
    Vaquillona024D = "Vaquillona 0-2-4d.",
}

export enum Tipificacion {
    A = "A",
    A6 = "A6",
    Aa = "AA",
    Aj = "AJ",
    B = "B",
    B1 = "B1",
     B3 = "B3",
     C = "C",
     C6 = "C6",
     Cj = "CJ",
     D1 = "D1",
     D2 = "D2",
     Empty = "",
     N = "N",
     Nj = "NJ",
     P = "P",
     U = "U",
     V = "V",
     Va = "VA",
     Va6 = "VA6",
     Vc = "VC",
     Vqa = "VQA",
     Vqc = "VQC",
     W = "W",
     X = "X",
     Y = "Y",
     Z = "Z"
}

// Converts JSON strings to/from your types
export class Convert {
    public static toHaciendaTipificacion(json: string): HaciendaTipificacion[] {
        return JSON.parse(json);
    }

    public static haciendaTipificacionToJson(value: HaciendaTipificacion[]): string {
        return JSON.stringify(value);
    }
}
