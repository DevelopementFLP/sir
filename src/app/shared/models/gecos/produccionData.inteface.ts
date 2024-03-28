// To parse this data:
//
//   import { Convert } from "./file";
//
//   const produccion = Convert.toProduccion(json);

export interface Produccion {
    fechaProd:        Date;
    fechaFaena:       Date;
    idCajaGecos:      number;
    codProducto:      string;
    nomProducto:      string;
    peso:             number;
    sala:             Sala;
    puesto:           Puesto;
    codProceso:       CodPro;
    codPrograma:      CodPro;
    ph:               boolean;
    cantidad:         number;
    pesoBruto:        number;
    tara:             number;
    idCorrelPadre:    number;
    turno:            number;
    fechaModif:       Date;
    dotNumberINAC:    string;
    fechaCongelado:   Date;
    fechaProducido:   Date;
    fechaVencimiento: Date;
    categoria:        number;
    codCliente:       string;
    nomCliente:       string;
    codCamion:        CodCamion;
    nomCamion:        NomCamion;
    desvio:           Desvio;
    codigoKosher:     string;
    especie:          string;
    destino:          Destino;
    origenCaja:       OrigenCaja;
}

export enum CodCamion {
    Agc563 = "AGC563",
    Agd311 = "AGD311",
    Agd312 = "AGD312",
    Agd315 = "AGD315",
    Agd316 = "AGD316",
    Agg450 = "AGG450",
    Empty = "",
    The000004 = "000004",
    The000012 = "000012",
    The000067 = "000067",
    The000267 = "000267",
    The000328 = "000328",
    The000352 = "000352",
    The000438 = "000438",
    The000767 = "000767",
    The001262 = "001262",
    The001919 = "001919",
    The001920 = "001920",
    The001968 = "001968",
    The002063 = "002063",
    The008781 = "008781",
    The008782 = "008782",
}

export enum CodPro {
    Delant = "DELANT",
    Descua = "DESCUA",
    Desosa = "DESOSA",
    Fetead = "FETEAD",
    Menaba = "MENABA",
    Menfae = "MENFAE",
    Menude = "MENUDE",
    Ovifae = "OVIFAE",
    Porcio = "PORCIO",
    Reproc = "REPROC",
    Traser = "TRASER",
}

export enum Destino {
    Ababou = "ABABOU",
    Abasto = "ABASTO",
    Angflp = "ANGFLP",
    Arabia = "ARABIA",
    Cauri = "CAURI",
    China = "CHINA",
    Expo = "EXPO",
    Hilton = "HILTON",
    Hongko = "HONGKO",
    Italia = "ITALIA",
    Japon = "JAPON",
    Jbs = "JBS",
    Kousaf = "KOUSAF",
    Kousco = "KOUSCO",
    Norueg = "NORUEG",
    Plaza = "PLAZA",
    Rusia = "RUSIA",
    Seara = "SEARA",
    Suiza = "SUIZA",
    Ue = "UE",
    Usoint = "USOINT",
}

export enum Desvio {
    Conenf = "CONENF",
    Congel = "CONGEL",
    Conmad = "CONMAD",
    Enfria = "ENFRIA",
}

export enum NomCamion {
    AbastoPlazaItaliaSRL = "ABASTO PLAZA ITALIA S.R.L.",
    Capote = "CAPOTE",
    Crovetto = "CROVETTO",
    DEVOTOHNOSSANro15 = "DEVOTO HNOS. S.A. Nro.15",
    DEVOTOHNOSSANro21 = "DEVOTO HNOS. S.A. Nro.21",
    DEVOTOHNOSSANro22 = "DEVOTO HNOS. S.A. Nro.22",
    DEVOTOHNOSSANro7 = "DEVOTO HNOS. S.A. Nro. 7",
    DEVOTOHNOSSANro8 = "DEVOTO HNOS. S.A. Nro. 8",
    DOSSantos = "DOS SANTOS",
    Empty = "",
    Kebumar1Pedido1 = "KEBUMAR 1 - PEDIDO 1",
    MarcosTassara = "MARCOS TASSARA",
    Onacar1Pedido1 = "ONACAR 1 - PEDIDO 1",
    Onacar1Pedido2 = "ONACAR 1 - PEDIDO 2",
    Orosman1Pedido1 = "OROSMAN 1 - PEDIDO 1",
    Orosman1Pedido2 = "OROSMAN 1 - PEDIDO 2",
    Prando = "PRANDO",
    Reyes = "REYES",
    Serres = "SERRES",
    SupDiscoDelUruguayNº17 = "SUP.DISCO DEL URUGUAY Nº17",
    SuperCovadongaSA = "SUPER COVADONGA S.A.",
    Tassara2 = "TASSARA (2)",
}

export enum OrigenCaja {
    Gecos = "GECOS",
}

export enum Puesto {
    Aba = "ABA",
    Bac = "BAC",
    DES = "DES",
    Dt = "DT",
    Emp = "EMP",
    Enf = "ENF",
    FET = "FET",
    Men = "MEN",
    Por = "POR",
    Sb = "SB",
}

export enum Sala {
    Sala01 = "SALA01",
}

// Converts JSON strings to/from your types
export class Convert {
    public static toProduccion(json: string): Produccion[] {
        return JSON.parse(json);
    }

    public static produccionToJson(value: Produccion[]): string {
        return JSON.stringify(value);
    }
}
