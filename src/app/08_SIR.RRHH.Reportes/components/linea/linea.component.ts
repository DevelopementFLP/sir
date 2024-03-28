import { Component, Input, OnInit } from '@angular/core';
import { Funcionario } from '../../interfaces/Funcionario.interface';

@Component({
  selector: 'rrhh-linea',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.css']
})
export class LineaComponent implements OnInit{
  @Input() linea: number = 0;
  @Input() funcionarios: Funcionario[] = [];
  @Input() hueseros: Funcionario[] = [];
  @Input() charqueadores: Funcionario[] = [];

  ngOnInit(): void {
    this.getHueseros(this.funcionarios);
    this.getCharqueadores(this.funcionarios);
  }

  getHueseros(funcionarios: Funcionario[]): void {
    this.hueseros = funcionarios.filter(funcs => { return funcs.nombreEstacion.includes('Huesero')});
  }

  getCharqueadores(funcionarios: Funcionario[]): void {
    this.charqueadores = funcionarios.filter(funcs => { return funcs.nombreEstacion.includes('Charqueo')});
  }
}
