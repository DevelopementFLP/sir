import { Type } from "@angular/core";

export interface ReporteMenuItem {
    id:             number;
    nombre:         string;
    showIcon:       boolean;
    icono?:         string;
    routerLink?:    string;
    component?:      Type<any>;
}