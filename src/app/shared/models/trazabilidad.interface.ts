import { Especie } from './gecos/haciendaLotes.interface';

export interface Trazabilidad {
    clasificacion   : string;
    codigo          : string;
    destino         : string;    
    especie         : Especie;
    fechaFaena      : Date;
    fechaProduccion : Date | string;
    id              : string;
    producto        : string;
    tropa           : number;
}