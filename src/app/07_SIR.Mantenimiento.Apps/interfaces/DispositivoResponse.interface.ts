import { Dispositivo } from "./Dispositivo.interface";

export interface DispositivoResponse {
    data:       Dispositivo;
    isSucces:   boolean;
    message:    string;
}