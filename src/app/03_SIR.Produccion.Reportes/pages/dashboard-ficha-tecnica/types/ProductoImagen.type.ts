import { FtImagenesPlantillaDTO } from "src/app/11_SIR_Produccion.Ficha.Tecnica/interface/CreacionDeFichaTecnicaInterface/FtImagenesDTO";

export type ProductoImagen = {
    [producto: string]: FtImagenesPlantillaDTO[];
}