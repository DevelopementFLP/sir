import { MenuItem } from "primeng/api";

export interface Reporte {
    id_reporte: number,
    id_modulo: number,
    label: string,
    activo: boolean,
    icon: string,
    routerLink?: string,
    target: string
}