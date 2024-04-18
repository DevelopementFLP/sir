import { HorasTrabajadas } from "./HorasTrabajadas.interface";

export interface HorasPorFuncionario {
    nroFuncionario: string;
    regimen:        number;
    horas:          HorasTrabajadas[];
}