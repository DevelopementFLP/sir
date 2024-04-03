import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Empleado } from '../interfaces/Empleado.interface';
import { HorarioEmpleado } from '../interfaces/HorarioEmpleado.interface';

@Injectable({providedIn: 'root'})
export class FuncionariosService {
    
    private dataSubject = new BehaviorSubject<Empleado | null>(null);
    data$ = this.dataSubject.asObservable();

    constructor() { }
    
    setData(data: Empleado) {
        this.dataSubject.next(data);
    }

    clearData() {
        this.dataSubject.next(null);
    }

    getTiempoTotal(horarios: HorarioEmpleado[]): string {
        let dias = 0, horas = 0, minutos = 0, segundos = 0;
        
        horarios.forEach(log => {
          let horario = log.hours.toString().split('T')[1];
          let partes = horario.split(':');
    
          horas     += parseInt(partes[0]);
          minutos   += parseInt(partes[1]);
          segundos  += parseInt(partes[2].split(".")[0]);
        });
    
        let totalSegundos: number = horas * 3600 + minutos * 60 + segundos;
        dias = Math.floor(totalSegundos / (24 * 3600));
        const horasRestantes: number = totalSegundos % (24 * 3600);
        horas = Math.floor(horasRestantes / 3600);
        const minutosRestantes: number = horasRestantes % 3600;
        minutos = Math.floor(minutosRestantes / 60);
        segundos = minutosRestantes % 60; 
    
        const horasFormateo:    string = horas    < 10  ? "0" + horas.toString()    : horas.toString();
        const minutosFormateo:  string = minutos  < 10  ? "0" + minutos.toString()  : minutos.toString();
        const segundosFormateo: string = segundos    < 10  ? "0" + segundos.toString() : segundos.toString();

        let salida = horasFormateo + ":" + minutosFormateo + ":" + segundosFormateo
        return  dias > 0 ? dias.toString() + " día " + salida : salida;
      }
 }