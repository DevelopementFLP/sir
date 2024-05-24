import { Component, Input, OnInit } from '@angular/core';
import { Funcionario } from '../../interfaces/Funcionario.interface';
import { LoginHistorico } from '../../interfaces/LoginHistorico.interface';

@Component({
  selector: 'rrhh-linea',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.css']
})
export class LineaComponent implements OnInit{
  @Input() linea: number = 0;
  @Input() funcionarios: Funcionario[] = [];
  @Input() funcionariosHistorico: LoginHistorico[] = [];
  @Input() hueseros: Funcionario[] = [];
  @Input() charqueadores: Funcionario[] = [];
  @Input() hueserosHistorico: LoginHistorico[] = [];
  @Input() charqueadoresHistorico: LoginHistorico[] = [];
  @Input() fecha!: Date;

  ngOnInit(): void {
    this.getHueseros(this.funcionarios);
    this.getCharqueadores(this.funcionarios);
    this.getHueserosHistorico(this.funcionariosHistorico);
    this.getCharqueadoresHistorico(this.funcionariosHistorico);
  }

  private getHueseros(funcionarios: Funcionario[]): void {
    this.hueseros = funcionarios.filter(funcs => { return funcs.nombreEstacion.includes('Huesero')});
  }

  private getCharqueadores(funcionarios: Funcionario[]): void {
    this.charqueadores = funcionarios.filter(funcs => { return funcs.nombreEstacion.includes('Charqueo')});
  }

  private getHueserosHistorico(funcionariosHistorico: LoginHistorico[]): void {
    this.hueserosHistorico = funcionariosHistorico.filter(funcs => { return funcs.nombreEstacion.includes('Huesero') });
  }

  private getCharqueadoresHistorico(funcionariosHistorico: LoginHistorico[]): void {
    this.charqueadoresHistorico = funcionariosHistorico.filter(funcs => { return funcs.nombreEstacion.includes('Charqueo') });
  }
}
