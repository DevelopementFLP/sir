export interface FtAspectosGeneralesPlantillaDTO {
  idPlantilla: number;
  seccionDePlantilla?: string;
  nombre: string;
  nombreDeProducto: string;
  idMarca: number;
  idTipoDeUso: number;
  idAlergeno: number;
  idCondicionAlmacenamiento: number;
  idVidaUtil: number;
  idTipoDeEnvase: number;
  idPresentacionDeEnvase: number;
  pesoPromedio: number;
  unidadesPorCaja: number;
  dimensiones: string;
}
