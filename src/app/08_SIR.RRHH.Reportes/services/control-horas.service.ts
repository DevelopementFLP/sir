import { Injectable } from '@angular/core';
import { TipoHora } from '../interfaces/TipoHora.interface';
import { PadronFuncionario } from '../interfaces/PadronFuncionario.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { urlConfHoras, urlHorarioDesfasado, urlPadron, urlRegimen, urlUpdateHorariosDesfasados, urlUpdatePadron } from 'src/settings';
import { Marcas } from '../interfaces/Marcas.interface';
import { MarcaPorFuncionario } from '../interfaces/MarcaPorFuncionario.interface';
import { HorasPorFuncionario } from '../interfaces/HorasPorFuncionario.interface';
import { TiempoTrabajado } from '../interfaces/TiempoTrabajado.interface';
import { Incidencia } from '../interfaces/Incidencia.interface';
import { HorasIncidencias } from '../interfaces/HorasIncidencias.interface';
import { Regimen } from '../interfaces/Regimen.interface';
import { ConfHora } from '../interfaces/ConfHora.interface';
import { HorasComparar } from '../interfaces/HorasComparar.interface';
import { FuncionarioHorarioDesfasado } from '../interfaces/FuncionarioHorarioDesfasado.interface';

@Injectable({providedIn: 'root'})
export class ControlHorasService {
    codigos: TipoHora[] = [
        { codigo: 2, tipo: 'Comunes' },
        { codigo: 4, tipo: 'Dobles' },
        { codigo: 6, tipo: 'Nocturnas' }
    ];

    motivosIncidencia: string[] = [];

    horasIncidencias: HorasIncidencias = {
        horas: [],
        incidencias: []
      }
    
    horasAComparar: HorasComparar[] = [];

    constructor(private http: HttpClient) {

        this.setMotivoIncidencia();
     }
    

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

    getFuncionariosHorariosDesfasados(): Observable<FuncionarioHorarioDesfasado[]> {
        return this.http.get<FuncionarioHorarioDesfasado[]>(urlHorarioDesfasado);
    }

    postFuncionariosHorariosDesfasados(funcionarios: FuncionarioHorarioDesfasado[]): Observable<void> {
        return this.http.post<void>(urlUpdateHorariosDesfasados, funcionarios);
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

    generarMarcasPorFuncionario(marcas: Marcas[], horariosDesfasados: FuncionarioHorarioDesfasado[]): MarcaPorFuncionario[] {
        let marcasPorFunc: MarcaPorFuncionario[] = [];
        marcas.forEach(marca => {
            marcasPorFunc.push(
                {
                    nroFuncionario: marca.funcionario.toString(),
                    marcas: marca.marcas,
                    salida: marca.marcas.length > 1,
                    tiempoTotalTrabajado: this.contarTiempoTrabajado(marca.marcas, marca.funcionario.toString(), horariosDesfasados)
                }
            )
        });
        return marcasPorFunc;
    }

    private esHorarioDesfasado(nroFuncionario: string, horariosDesfasados: FuncionarioHorarioDesfasado[]): boolean {
        return horariosDesfasados.some(f => f.nroFuncionario === nroFuncionario);
    }

    contarHorasPorFuncionarios(fechaControl: Date | null, marcas: MarcaPorFuncionario[], padron: PadronFuncionario[], regimenes: Regimen[], horariosDesfasados: FuncionarioHorarioDesfasado[], confHoras: ConfHora[]): HorasIncidencias {
        let horasPorFunc: HorasPorFuncionario[] = [];
        let incidencias: Incidencia[] = [];
    
        marcas.forEach(marca => {
            
            const regimen = this.getRegimen(marca.nroFuncionario, padron);
            const tipoRemuneracion: string = this.getTipoRemuneracion(marca.nroFuncionario, padron);
            const enPadron = padron.find(f => f.nroFuncionario === marca.nroFuncionario);
            if(!isNaN(marca.tiempoTotalTrabajado) && marca.salida && enPadron) {
                const horarioDesfasado: boolean = this.esHorarioDesfasado(marca.nroFuncionario, horariosDesfasados);
                const inicio: number = horarioDesfasado ? marca.marcas[marca.marcas.length - 1] : marca.marcas[0];
                const fin: number = horarioDesfasado ? marca.marcas[0] : marca.marcas[marca.marcas.length - 1];
                const horasTrabajadas = this.contarHorasTrabajadas(fechaControl, regimen, inicio, fin, tipoRemuneracion);
                const limiteHorasComunes = regimen === 8 ? 8 : 9.36;
                const horasNocturnas = this.contarHorasNocturnas(marca.marcas, regimenes, regimen, horarioDesfasado)
                horasPorFunc.push(
                    {
                        nroFuncionario: marca.nroFuncionario,
                        regimen: limiteHorasComunes,
                        horas: [
                            {codigo: 2, horas: this.sumarHorasMinutos(horasTrabajadas.horasComunes, horasTrabajadas.minutosComunes, confHoras)},
                            {codigo: 4, horas: this.sumarHorasMinutosExtras(horasTrabajadas.horasExtras, horasTrabajadas.minutosExtras, confHoras)},
                            {codigo: 6, horas: this.redondearHoras(horasNocturnas)}
                        ]
                    }
                )
            } else {
                if(!enPadron)
                    incidencias.push({nroFuncionario: marca.nroFuncionario, nombres: '', apellidos: '', regimen: '', sector: '', motivo: this.motivosIncidencia[0]})
                else
                    if(isNaN(marca.tiempoTotalTrabajado))
                    incidencias.push({nroFuncionario: marca.nroFuncionario, nombres: '', apellidos: '', regimen: regimen.toString(), sector: '', motivo: this.motivosIncidencia[1]})
                else if (!marca.salida)
                    incidencias.push({nroFuncionario: marca.nroFuncionario, nombres: '', apellidos: '', regimen: regimen.toString(), sector: '', motivo: this.motivosIncidencia[2]})
            }
        });
        return {
            horas: horasPorFunc,
            incidencias: incidencias
        }
    }

    private contarTiempoTrabajado(marcas: number[], nroFuncionario: string, horariosDesfasados: FuncionarioHorarioDesfasado[]): number {
        let totalHorasTranscurridas = 0;

        if(this.esHorarioDesfasado(nroFuncionario, horariosDesfasados)) {
            const horaEntradaActual = marcas[marcas.length - 1];
            const horaSalidaActual = marcas[0];
            totalHorasTranscurridas = horaSalidaActual - horaEntradaActual;
            return totalHorasTranscurridas;
        }

        if(marcas.length % 2 !== 0) {
            const horaEntradaActual = marcas[0];
            const horaSalidaActual = marcas[marcas.length - 1];
            totalHorasTranscurridas = horaSalidaActual - horaEntradaActual;
            return totalHorasTranscurridas;
        }

        const finIndex: number = marcas.length;

        for (let i = 0; i < finIndex; i = i + 2) {
            const horaEntradaActual = marcas[i];
            const horaSalidaActual = marcas[i + 1];

            if (horaEntradaActual >= horaSalidaActual) {
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

    private contarHorasTrabajadas(fecha: Date | null, regimen: number, horaInicio: number, horaFinal: number, tipoRemuneracion: string) : TiempoTrabajado {
        const horasTrabajadas = this.calcularDiferenciaHoras(this.convertirDecimalAHora(horaInicio), this.convertirDecimalAHora(horaFinal));

        let totalMinutos = (horasTrabajadas.horas) * 60 + horasTrabajadas.minutos;
        let horasRegimenHorario = 8;

        if(regimen == 9.36) horasRegimenHorario = 9.6;
        
        const horasRegimen = Math.floor(regimen);
        const minutosRegimen = Math.ceil((horasRegimenHorario - horasRegimen) * 60);

        let horasComunes;
        const esSabado: boolean = (fecha && (fecha.getDay() === 6))!;

        if(tipoRemuneracion === 'Mensual' && esSabado)
            horasComunes = Math.min(4, totalMinutos / 60);
        else
            horasComunes = Math.min(horasRegimen, totalMinutos / 60);


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
     
    private contarHorasNocturnas(horas: number[], regimenes: Regimen[], regimen: number, horarioDesfasado: boolean): number {
        const reg: Regimen | undefined = regimenes.find(r => r.descripcion === regimen.toString());
        let horasEnRango = 0;
        
        if(!reg) return horasEnRango;
    
        const horaInicioRegimen: number = reg.inicioNocturnas - 3;
        const horaFinRegimen: number = reg.finNocturnas - 3;
        let hrs: number[] = [];

        if(horas.length % 2 === 0) hrs = horas;
        else {
            if(horas.length > 1) {
                hrs.push(horas[0]);
                hrs.push(horas[horas.length - 1])
            }
        }

        if(horarioDesfasado) hrs.unshift(hrs.pop()!);

        const horaInicio1 = new Date();
        horaInicio1.setHours(horaInicioRegimen, 0, 0, 0);  
    
        const horaFin1 = new Date();
        horaFin1.setHours(20, 59, 59, 999); // 23:59:59.999 (último milisegundo del día)
    
        const horaInicio2 = new Date();
        horaInicio2.setHours(-3, 0, 0, 0);  // 00:00 (inicio del día siguiente)
    
        const horaFin2 = new Date();
        horaFin2.setHours(horaFinRegimen, 0, 0, 0);     
    
    
        for (let i = 0; i < hrs.length; i += 2) {
            const horaEntrada = this.convertirDecimalAHora(hrs[i]);
            const horaSalida  = this.convertirDecimalAHora(hrs[i + 1]);

            let enRango1: boolean = horaEntrada <= horaFin1 && horaSalida >= horaInicio1;
            let enRango2: boolean = horaEntrada <= horaFin2 && horaSalida >= horaInicio2;

            if(horarioDesfasado)  {
                enRango1 = horaEntrada >= horaInicio1 && horaSalida <= horaFin1;
                enRango2 = horaEntrada >= horaInicio2 && horaSalida <= horaFin2;
            }

            // Calcular horas dentro del primer rango 
            if (enRango1) {
                const inicioRango1 = horaEntrada < horaInicio1 ? horaInicio1 : horaEntrada;
                
                const finRango1 = horaSalida > horaFin1 ? horaFin1 : horaSalida;
                
                let duracionRango1: number;
                const refDate: Date = new Date();
                refDate.setHours(9,0,0);
        
                if(horarioDesfasado) {
                    duracionRango1 = (horaFin1.getTime() - horaEntrada.getTime()) / (1000 * 60 * 60); 
                    if(horaSalida > horaFin2) 
                        duracionRango1 += (horaFin2.getTime() - horaInicio2.getTime()) / (1000 * 60 * 60);
                    
                }
                else
                    duracionRango1 = (finRango1.getTime() - inicioRango1.getTime()) / (1000 * 60 * 60);
                
                horasEnRango += duracionRango1;
            }
    
            // Calcular horas dentro del segundo rango 
            if (enRango2) {
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

        if(mins >= 45) hrsT += 1;
        else if(mins >= 15) hrsT += 0.5;
        hrsT += hrs;
        if(hrsT >= 5 ) hrsT = 8;
        return hrsT;
    }

    private sumarHorasMinutos(horas: number, minutos: number, confHoras: ConfHora[]): number {
        let hrsT: number = horas;

        if(minutos >= confHoras[1].minMinutos) hrsT += 0.5;
        if(minutos >= confHoras[0].minMinutos) hrsT += 0.5;
        return hrsT;
    }

    private sumarHorasMinutosExtras(horas: number, minutos: number, confHoras: ConfHora[]): number {
        let hrsT: number = horas;

        if(minutos >= confHoras[3].minMinutos) hrsT += 0.5;
        if(minutos >= confHoras[2].minMinutos) hrsT += 0.5;
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
        const empleado: PadronFuncionario | undefined = padron.find(emp => emp.nroFuncionario === funcionario);
        if(empleado) return empleado.horasTrabajadas;
        return 0;
    }

    private getTipoRemuneracion(funcionario: string, padron: PadronFuncionario[]): string {
        const empleado: PadronFuncionario | undefined = padron.find(emp => emp.nroFuncionario === funcionario);
        if(empleado) return empleado.tipoRemuneracion;
        return '';
    }

    getMotivosIncidencia(): string[] {
        return this.motivosIncidencia;
    }

    setMotivoIncidencia(): void {
        this.motivosIncidencia.push('Funcionario no está en padrón');
        this.motivosIncidencia.push('Error en formato de marca');
        this.motivosIncidencia.push('Falta alguna marca');
    }
}