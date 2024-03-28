// To parse this data:
//
//   import { Convert } from "./file";
//
//   const tipificacionChile = Convert.toTipificacionChile(json);

export interface TipificacionChile {
    fecha:           Date;
    chile:           Chile;
    reses:           number;
    tropa:           number;
    especie:         Especie;
    lado:            number;
    denticion:       string;
    grading:         Grading;
    pesoNeto:        number;
    correlFaena:     number;
    categoria:       Categoria;
    grasa:           string;
    codProveedor:    string;
    dotNumber:       number;
    fechaEtiqueta:   Date | null;
    fechaUpd:        Date;
    inacur:          Categoria;
    categoriaAnimal: number;
    yieldgroup:      Yieldgroup;
    caravana:        string;
}

export enum Categoria {
    A = "A",
    A6 = "A6",
    Aa = "AA",
    Aj = "AJ",
    C = "C",
    C6 = "C6",
    Cj = "CJ",
    Va = "VA",
    Va6 = "VA6",
    Vc = "VC",
    Vqa = "VQA",
    Vqc = "VQC",
}

export enum Chile {
    C = "C",
    N = "N",
    U = "U",
    V = "V",
}

export enum Especie {
    B = "B",
}

export enum Grading {
    A = "A",
    B1 = "B1",
    B3 = "B3",
    D1 = "D1",
    D2 = "D2",
}

export enum Yieldgroup {
    NvA = "NvA",
    NvB = "NvB",
    NvC = "NvC",
    VcA = "VcA",
    VcB = "VcB",
    VcC = "VcC",
    VqA = "VqA",
    VqB = "VqB",
    VqC = "VqC",
}

// Converts JSON strings to/from your types
export class Convert {
    public static toTipificacionChile(json: string): TipificacionChile[] {
        return JSON.parse(json);
    }

    public static tipificacionChileToJson(value: TipificacionChile[]): string {
        return JSON.stringify(value);
    }
}
