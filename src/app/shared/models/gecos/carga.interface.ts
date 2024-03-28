// To parse this data:
//
//   import { Convert } from "./file";
//
//   const carga = Convert.toCarga(json);

export interface Carga {
    exportdate:     Date;
    container:      Container;
    pallet:         number;
    productcode:    string;
    boxid:          string;
    netweight:      number;
    grossweight:    number;
    productiondate: Date;
    expiredate:     Date;
    finalizada:     boolean;
}

export enum Container {
    Caiu5523937 = "CAIU 552393-7",
    Caiu5524698 = "CAIU 552469-8",
    Hlxu3743212 = "HLXU 374321-2",
    Tclu1298834 = "TCLU 129883-4",
    Temu9471310 = "TEMU 947131-0",
    Tllu1085354 = "TLLU 108535-4",
    Tllu1086514 = "TLLU 108651-4",
    Ttnu8620135 = "TTNU 862013-5",
}

// Converts JSON strings to/from your types
export class Convert {
    public static toCarga(json: string): Carga[] {
        return JSON.parse(json);
    }

    public static cargaToJson(value: Carga[]): string {
        return JSON.stringify(value);
    }
}
