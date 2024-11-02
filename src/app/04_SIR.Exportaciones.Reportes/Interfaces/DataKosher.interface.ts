export interface DataKosher {
    mercaderia:             string;
    idPallet:               number;
    container:              string;
    idLargo:                string;
    codigoKosher?:          string;
    pesoNeto?:              number;
    pesoBruto?:             number;
    fechaCorrida?:          string;
    fechaVencimiento1?:     Date;
    especie?:               string;
    precioTonelada:         number;
    idMoneda:               number;
    codigoProducto:         string;
    clasificacionKosher?:   string;
    markKosher?:            string;
    tipoProducto?:          string;
}