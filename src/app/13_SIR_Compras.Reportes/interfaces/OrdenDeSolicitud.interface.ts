export interface OrdenDeSolicitud{
    idOrdenDeSolicitud: number;
    fechaDecreacion: Date;
    idEstadoDeSolicitud: number;
    idUsuarioSolicitante: number;
    idPriodidadDeOrden: number;
    idCentroDeCosto: number;
    idEmpresa: number;
    fechaDeNecesidad: Date;
    idUsuarioParaNotificar: number;
}

