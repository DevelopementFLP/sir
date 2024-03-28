export interface Dispositivo {
    id_Dispositivo:          number;
    nombre:                 string;
    ip:                     string;
    puerto:                 string;
    descripcion:            string;
    activo:                 boolean;
    id_Tipo:                number;
    id_Ubicacion:           number;
    id_Formato:             number;
}