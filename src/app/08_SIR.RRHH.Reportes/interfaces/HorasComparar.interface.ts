import { HorasTrabajadas } from "./HorasTrabajadas.interface";

export interface HorasComparar {
    nroFuncionario:         string;
    nombres:                string;
    apellidos:              string;
    regimen:                number;
    relojHorasComunes:      number;
    relojHorasDobles:       number;
    relojHorasNocturnas:    number;
    marcasHorasComunes:     number;
    marcasHorasDobles:      number;
    marcasHorasNocturnas:   number;
    sector:                 string;
}