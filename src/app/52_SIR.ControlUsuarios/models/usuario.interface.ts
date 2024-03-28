export interface Usuario {
    activo: boolean,
    conf_perfiles: number | null,
    contrasenia: string,
    id_perfil: number,
    id_usuario: number,
    nombre_completo: string,
    nombre_usuario: string
}