export interface DWCajaSalidaDTO {
    fecha:          Date;
    condition?:     string;
    qamark?:        number;
    customercode?:  string;
    code:           string;
    producto:       string;
    piezas:         number;
    cajas:          number;
    peso:           number;
}