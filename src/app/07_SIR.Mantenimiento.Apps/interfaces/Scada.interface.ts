import { TipoDispositivo } from "./TipoDispositivo.interface";
import { Ubicacion } from "./Ubicacion.interface";

export interface Scada {
    id:                 number;
    deviceId:           number;
    idTipoDispositivo:  number;
    idUbicacion:        number;
    nombre:             string;
    descripcion:        string;
}