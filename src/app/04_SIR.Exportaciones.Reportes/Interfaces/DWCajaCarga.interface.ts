export interface DWCajaCarga {
    id_Carga?: number;
    id_Pallet?: number;
    container: string;
    boxId: string;
    exportDate?: Date;
    idLargo: string;
    sisOrigen: string;
    idInnova?: number;
    idGecos?: number;
    extCodeInnova?: string;
    codProducto: string;
    codigoKosher?: string;
    pesoNeto?: number;
    pesoBruto?: number;
    fechaCorrida?: Date;
    fechaVencimiento_1?: Date;
    fechaVencimiento_2?: Date;
    especie?: string;
    nomTipoProducto?: string;
  }
  