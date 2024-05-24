import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { RRHHService } from '../../services/rrhh.service';
import { Funcionario } from '../../interfaces/Funcionario.interface';
import { formatDate } from '@angular/common';
import { interval } from 'rxjs';

import { trigger, state, style, transition, animate } from '@angular/animations';
import { LoginHistorico } from '../../interfaces/LoginHistorico.interface';
import { LoginHistoricoService } from '../../services/login-historico.service';

@Component({
  selector: 'app-logueo-func',
  templateUrl: './logueo-func.component.html',
  styleUrls: ['./logueo-func.component.css', './print.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateX(-80%)'
      })),
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => in', [
        animate('0.2s ease-in-out')
      ]),
      transition('in => void', [
        animate('0.2s ease-in-out')
      ])
    ])
  ]
})
export class LogueoFuncComponent implements OnInit {
  minDate: Date = new Date(2024, 4, 22);
  hoy: Date = new Date();
  fecha: Date = new Date();
  lineas: string[] = ['L1', 'L2', 'L3', 'L4', 'L5'];
  funcionarios        : Funcionario[]   = [];
  funcionariosPorLinea: Funcionario[][] = [];
  nombreReporte!       : string;
  idReporte: number = 1;


  lineOptions: any[] = [{label: "Ahora", value: 'Ahora'}, {label: "Histórico", value: 'Histórico'}]; 
  time: string = 'Ahora';
  funcionariosHistorico: LoginHistorico[] | undefined = [];
  funcionariosHistoricoPorLineas: LoginHistorico[][] = [];


  constructor(
    private rrhhService: RRHHService,
    private loginService: LoginHistoricoService) {}


  ngOnInit(): void {

    this.nombreReporte = 'FUNCIONARIOS LOGUEADOS POR LINEA - DESOSADO MAREL ' + formatDate(this.fecha, "dd-MM-yyyy", "es-UY")
    this.loadData();

    interval(300000)
      .subscribe(() => {
        this.loadData();
      });
  }

  loadData(): void {
    this.funcionarios = [];
    this.funcionariosPorLinea = [];
    
    this.rrhhService.getFuncionariosLogueados()
      .subscribe( funcs => {
        this.funcionarios = funcs;
        this.setFuncionariosPorLinea(this.funcionarios);
        this.funcionariosPorLinea = this.funcionariosPorLinea.filter(funcs => { return funcs.length > 0});
      })
  }

  private setFuncionariosPorLinea(funcionarios: Funcionario[]): void {
    this.lineas.forEach(linea => {
      this.funcionariosPorLinea.push(funcionarios.filter(l => {
        return l.linea.trim() === linea }))      
    });
  }

  private setFuncionariosHistoricoPorLinea(funcHistorico: LoginHistorico[]): void {
    this.lineas.forEach(linea => {
      this.funcionariosHistoricoPorLineas.push(funcHistorico.filter(l => {
        return this.getLinea(l.nombreEstacion) === linea;
      }))
    });
  }

  getLinea(nombreEstacion: string): string {
    const parts: string[] = nombreEstacion.split(' ');
    return parts[0];
  }

  getNombreLinea(linea: string): string {
    return "Linea " + linea.substring(1,1);
  }

  getNumeroLinea(linea: string) : number {
    return  parseInt(linea.substring(1));
  }

  getFecha(): string {
    return formatDate(new Date().toString(), "dd/MM/yyyy", "es-UY")
  }

  changeLoginView(event: PointerEvent) {
    if(this.time === 'Ahora'){
        this.fecha = new Date();
    }
    else
      this.getDataByFecha();
  }

  async getDataByFecha(): Promise<void> {
    try {
      this.funcionariosHistorico = [];
      this.funcionariosHistoricoPorLineas = [];
      this.funcionariosHistorico = await this.loginService.getLoginHistorico(this.fecha).toPromise();
      this.setFuncionariosHistoricoPorLinea(this.funcionariosHistorico!);
      console.log(this.fecha)
      this.nombreReporte = 'FUNCIONARIOS LOGUEADOS POR LINEA - DESOSADO MAREL ' + formatDate(this.fecha, "dd-MM-yyyy", "es-UY")
    } catch(error: any) {
      throw new Error(error);
    }
  }
}
