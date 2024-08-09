
import { UbicacionDispositivoDTO } from "./UbicacionDispositivoDTO";
import { TipoDispositivoDTO } from "./TipoDispositivoDTO";
import { FormatoDispositivoDTO } from "./FormatosDTO";

export interface DispositivoDTO{
    idDispositivo: number,
    nombre: string,
    ip: string,
    puerto: number,
    descripcion: string,
    activo: boolean,
    idTipo: number,
    idUbicacion: number,
    idFormato: number,
    
    idTipoNavigation?: TipoDispositivoDTO; 
    idUbicacionNavigation?: UbicacionDispositivoDTO; 
    idFormatoNavigation?: FormatoDispositivoDTO;    
}