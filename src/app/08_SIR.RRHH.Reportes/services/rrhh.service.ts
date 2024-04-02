import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcionario } from '../interfaces/Funcionario.interface';
import { urlEmpleados, urlHorarioFuncionario, urlLogueoLineas, urlRRHH } from 'src/settings';
import { HorarioEmpleado } from '../interfaces/HorarioEmpleado.interface';
import { formatDate } from '@angular/common';
import { Empleado } from '../interfaces/Empleado.interface';

@Injectable({providedIn: 'root'})
export class RRHHService {
    constructor(private http: HttpClient) { }
    
    getFuncionariosLogueados(): Observable<Funcionario[]> {
        return this.http.get<Funcionario[]>(urlLogueoLineas);
    }

    getHorarioFuncionario(numeroFunc: string): Observable<HorarioEmpleado[]> {
        return this.http.get<HorarioEmpleado[]>(`${urlHorarioFuncionario}?fecha=${formatDate(new Date(), "yyyy-MM-dd", "es-UY")}&numeroFunc=${numeroFunc}`);
    }

    getHorarioFuncionarioPorFecha(fecha: Date, numeroFunc: string): Observable<HorarioEmpleado[]> {
        return this.http.get<HorarioEmpleado[]>(`${urlHorarioFuncionario}?fecha=${formatDate(fecha, "yyyy-MM-dd", "es-UY")}&numeroFunc=${numeroFunc}`);
    }

    getEmpleados(): Observable<Empleado[]> {
        return this.http.get<Empleado[]>(urlEmpleados);
    }
}