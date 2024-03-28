import { Component, OnInit } from '@angular/core';
import { RRHHService } from '../../services/rrhh.service';
import { Funcionario } from '../../interfaces/Funcionario.interface';

@Component({
  selector: 'app-logueo-func',
  templateUrl: './logueo-func.component.html',
  styleUrls: ['./logueo-func.component.css']
})
export class LogueoFuncComponent implements OnInit {

  funcionarios: Funcionario[] = [];
  funcionariosPorLinea: Funcionario[][] = [];


  constructor(private rrhhService: RRHHService) {}

  ngOnInit(): void {
    this.rrhhService.getFuncionariosLogueados()
      .subscribe( funcs => {
        this.funcionarios = funcs;
        this.setFuncionariosPorLinea(this.funcionarios);
        this.funcionariosPorLinea = this.funcionariosPorLinea.filter(funcs => { return funcs.length > 0}); 
      })
  }

  private setFuncionariosPorLinea(funcionarios: Funcionario[]) {
    const lineas: string[] = ['L1', 'L2', 'L3', 'L4', 'L5'];
    lineas.forEach(linea => {
      this.funcionariosPorLinea.push(funcionarios.filter(l => {
        return l.linea.trim() === linea }))      
    });
  }

  getNombreLinea(linea: string): string {
    return "Linea " + linea.substring(1,1);
  }

  getNumeroLinea(linea: string) : number {
    return  parseInt(linea.substring(1));
  }
}
