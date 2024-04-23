import { Injectable } from '@angular/core';
import { TipoHora } from '../interfaces/TipoHora.interface';
import { PadronFuncionario } from '../interfaces/PadronFuncionario.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { urlConfHoras, urlPadron, urlRegimen, urlUpdatePadron } from 'src/settings';
import { Marcas } from '../interfaces/Marcas.interface';
import { MarcaPorFuncionario } from '../interfaces/MarcaPorFuncionario.interface';
import { HorasPorFuncionario } from '../interfaces/HorasPorFuncionario.interface';
import { TiempoTrabajado } from '../interfaces/TiempoTrabajado.interface';
import { Incidencia } from '../interfaces/Incidencia.interface';
import { HorasIncidencias } from '../interfaces/HorasIncidencias.interface';
import { Regimen } from '../interfaces/Regimen.interface';
import { ConfHora } from '../interfaces/ConfHora.interface';
import { HorasComparar } from '../interfaces/HorasComparar.interface';

@Injectable({providedIn: 'root'})
export class ControlHorasService {
    codigos: TipoHora[] = [
        { codigo: 2, tipo: 'Comunes' },
        { codigo: 4, tipo: 'Dobles' },
        { codigo: 6, tipo: 'Nocturnas' }
    ];

    horasIncidencias: HorasIncidencias = {
        horas: [],
        incidencias: []
      }
    
    horasAComparar: HorasComparar[] = [];

    constructor(private http: HttpClient) { }
    
    getCodigosHoras(): TipoHora[] {
        return this.codigos;
    }

    getPadronFuncionarios(): Observable<PadronFuncionario[]> {
        return this.http.get<PadronFuncionario[]>(urlPadron);
    }

    postPadronFuncionarios(funcionarios: PadronFuncionario[]): Observable<string> {
        return this.http.post<string>(urlUpdatePadron, funcionarios);
    }

    getRegimenes(): Observable<Regimen[]> {
        return this.http.get<Regimen[]>(urlRegimen);
    }

    getConfHoras(): Observable<ConfHora[]> {
        return this.http.get<ConfHora[]>(urlConfHoras);
    }

    getHorasIncidencias(): HorasIncidencias {
        return this.horasIncidencias;
    }

    getHorasAComparar(): HorasComparar[] {
        return this.horasAComparar;
    }

    setHorasIncidencias(horasIncidencias: HorasIncidencias) {
        this.horasIncidencias.horas = [];
        this.horasIncidencias.incidencias = [];
        this.horasIncidencias = horasIncidencias;
    }

    setHorasAComparar(horasAComparar: HorasComparar[]) {
        this.horasAComparar = [];
        this.horasAComparar = horasAComparar;
    }

    generarMarcasPorFuncionario(marcas: Marcas[]): MarcaPorFuncionario[] {
        let marcasPorFunc: MarcaPorFuncionario[] = [];

        marcas.forEach(marca => {
            marcasPorFunc.push(
                {
                    nroFuncionario: marca.funcionario.toString(),
                    marcas: marca.marcas,
                    salida: marca.marcas.length % 2 === 0,
                    tiempoTotalTrabajado: this.contarTiempoTrabajado(marca.marcas)
                }
            )
        });
        return marcasPorFunc;
    }

    contarHorasPorFuncionarios(marcas: MarcaPorFuncionario[], padron: PadronFuncionario[]): HorasIncidencias {
        let horasPorFunc: HorasPorFuncionario[] = [];
        let incidencias: Incidencia[] = [];

        marcas.forEach(marca => {
            const regimen = this.getRegimen(marca.nroFuncionario, padron);
            if(!isNaN(marca.tiempoTotalTrabajado) && marca.salida) {
                const horasTrabajadas = this.contarHorasTrabajadas(regimen, marca.marcas[0], marca.marcas[marca.marcas.length -1]);
                const limiteHorasComunes = regimen === 8 ? 8 : 9.36;
                const horasNocturnas = this.contarHorasNocturnas(marca.marcas)
                horasPorFunc.push(
                    {
                        nroFuncionario: marca.nroFuncionario,
                        regimen: limiteHorasComunes,
                        horas: [
                            {codigo: 2, horas: this.sumarHorasMinutos(horasTrabajadas.horasComunes, horasTrabajadas.minutosComunes)},
                            {codigo: 4, horas: this.sumarHorasMinutosExtras(horasTrabajadas.horasExtras, horasTrabajadas.minutosExtras)},
                            {codigo: 6, horas: this.redondearHoras(horasNocturnas)}
                        ]
                    }
                )
            } else {
                if(isNaN(marca.tiempoTotalTrabajado))
                    incidencias.push({nroFuncionario: marca.nroFuncionario, nombres: '', apellidos: '', regimen: regimen.toString(), sector: '', motivo: 'Error en formato de marca'})
                else if (!marca.salida)
                    incidencias.push({nroFuncionario: marca.nroFuncionario, nombres: '', apellidos: '', regimen: regimen.toString(), sector: '', motivo: 'Falta alguna marca'})
            }
        });
        return {
            horas: horasPorFunc,
            incidencias: incidencias
        }
    }

    private contarTiempoTrabajado(marcas: number[]): number {
        const finIndex: number = marcas.length % 2 === 0 ? marcas.length : marcas.length - 1;

        let totalHorasTranscurridas = 0;

        for (let i = 0; i < finIndex; i = i + 2) {
            const horaEntradaActual = marcas[i];
            const horaSalidaActual = marcas[i + 1];

            if (horaEntradaActual >= horaSalidaActual) {
                console.log(horaEntradaActual, horaSalidaActual)
                throw new Error("La hora de entrada debe ser menor que la hora de salida");
            }

            const duracionIntervalo = horaSalidaActual - horaEntradaActual;
            totalHorasTranscurridas += duracionIntervalo;

            // Calcular el tiempo transcurrido hasta la siguiente entrada
            // if (i + 2 < finIndex) {
            //     const horaEntradaSiguiente = marcas[i + 2];
            //     const tiempoHastaSiguienteEntrada = horaEntradaSiguiente - horaSalidaActual;
            //     if (tiempoHastaSiguienteEntrada < 0) {
            //         throw new Error("La hora de salida actual debe ser menor que la siguiente hora de entrada");
            //     }
            //     totalHorasTranscurridas += tiempoHastaSiguienteEntrada;
            // }
        }
        return totalHorasTranscurridas;
    }

    private contarHorasTrabajadas(regimen: number, horaInicio: number, horaFinal: number) : TiempoTrabajado {
       // const horasTrabajadas = this.convertirDecimalAHora(tiempoTrabajado);
        const horasTrabajadas = this.calcularDiferenciaHoras(this.convertirDecimalAHora(horaInicio), this.convertirDecimalAHora(horaFinal));

        let totalMinutos = (horasTrabajadas.horas) * 60 + horasTrabajadas.minutos;
        let horasRegimenHorario = 8;

        if(regimen == 9.36)
        {
            horasRegimenHorario = 9.6;
        }
        
        const horasRegimen = Math.floor(regimen);
        const minutosRegimen = Math.ceil((horasRegimenHorario - horasRegimen) * 60);

        let horasComunes = Math.min(horasRegimen, totalMinutos / 60);
        let minutosComunes = Math.min(minutosRegimen, totalMinutos - (horasComunes * 60));
        let minutosExtras = totalMinutos - (horasComunes * 60 + minutosComunes);
        let horasExtras = 0;

        if(minutosComunes > minutosRegimen && regimen == 8) {
            minutosExtras += minutosComunes - minutosRegimen;
            minutosComunes = minutosRegimen;
        }

        if(minutosExtras > 60) {
            horasExtras = Math.trunc(minutosExtras / 60);
            minutosExtras = minutosExtras % 60;
        }

        if(horasExtras == 0 && minutosExtras == 0)
        minutosComunes = totalMinutos % 60;

        return {
            horasComunes: Math.floor(horasComunes),
            minutosComunes: Math.floor(minutosComunes),
            horasExtras: horasExtras,
            minutosExtras: Math.floor(minutosExtras)
        };
    }
     
    private contarHorasNocturnas(horas: number[]): number {
        const finIndex: number = horas.length % 2 === 0 ? horas.length : horas.length - 1;

        const horaInicio1 = new Date();
        horaInicio1.setHours(18, 0, 0, 0);  // 21:00
    
        const horaFin1 = new Date();
        horaFin1.setHours(20, 59, 59, 999); // 23:59:59.999 (último milisegundo del día)
    
        const horaInicio2 = new Date();
        horaInicio2.setHours(-3, 0, 0, 0);  // 00:00 (inicio del día siguiente)
    
        const horaFin2 = new Date();
        horaFin2.setHours(2, 0, 0, 0);      // 05:00
    
        let horasEnRango = 0;
    
        for (let i = 0; i < finIndex; i += 2) {
            const horaEntrada = this.convertirDecimalAHora(horas[i]);
            const horaSalida  = this.convertirDecimalAHora(horas[i + 1]);
    
    
            // Calcular horas dentro del primer rango (21:00 a 23:59:59.999)
            if (horaEntrada <= horaFin1 && horaSalida >= horaInicio1) {
                const inicioRango1 = horaEntrada < horaInicio1 ? horaInicio1 : horaEntrada;
                const finRango1 = horaSalida > horaFin1 ? horaFin1 : horaSalida;
                const duracionRango1 = (finRango1.getTime() - inicioRango1.getTime()) / (1000 * 60 * 60);
                horasEnRango += duracionRango1;
            }
    
            // Calcular horas dentro del segundo rango (00:00 a 05:00)
            if (horaEntrada <= horaFin2 && horaSalida >= horaInicio2) {
                const inicioRango2 = horaEntrada < horaInicio2 ? horaInicio2 : horaEntrada;
                const finRango2 = horaSalida > horaFin2 ? horaFin2 : horaSalida;
                const duracionRango2 = (finRango2.getTime() - inicioRango2.getTime()) / (1000 * 60 * 60);
                horasEnRango += duracionRango2;
            }
        }
        
        return this.redondearHoras(horasEnRango);
    }
    
    private redondearHoras(horas: number): number {
        const hrs: number = Math.trunc(horas);
        const mins: number = (horas - hrs) * 60;
        let hrsT: number = 0;

        if(mins >= 45) hrsT += 0.5;
        if(mins >= 15) hrsT += 0.5;
        hrsT += hrs;
        return hrsT;
    }

    private sumarHorasMinutos(horas: number, minutos: number): number {
        let hrsT: number = horas;

        if(minutos >= 52) hrsT += 0.5;
        if(minutos >= 22) hrsT += 0.5;
        return hrsT;
    }

    private sumarHorasMinutosExtras(horas: number, minutos: number): number {
        let hrsT: number = horas;

        if(minutos >= 42) hrsT += 0.5;
        if(minutos >= 12) hrsT += 0.5;
        return hrsT;
    }

    private calcularDiferenciaHoras(horaInicio: Date, horaFinal: Date): { horas: number, minutos: number } {
        const tiempoInicio = horaInicio.getTime();
        const tiempoFinal = horaFinal.getTime();
    
        let diferenciaMilisegundos = tiempoFinal - tiempoInicio;
    
        const horasDiferencia = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60));
        diferenciaMilisegundos %= (1000 * 60 * 60);
        
        const minutosDiferencia = Math.floor(diferenciaMilisegundos / (1000 * 60));
    
        return { horas: horasDiferencia, minutos: minutosDiferencia };
    }

    convertirDecimalAHora(decimal: number): Date {
        const horas = Math.floor(decimal * 24);
        const minutos = Math.round((decimal * 24 - horas) * 60);
     
        const fecha = new Date();
        fecha.setHours(horas - 3, minutos);
     
        const horaFormateada = new Intl.DateTimeFormat('es-ES', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
        }).format(fecha);
     
        return fecha
    }

    private getRegimen(funcionario: string, padron: PadronFuncionario[]): number {
        const empleado = padron.find(emp => emp.nroFuncionario === funcionario);
        if(empleado) return empleado.horasTrabajadas;
        return 0;
    }
}