import { Component, Input } from '@angular/core';
import { Funcionario } from '../../interfaces/Funcionario.interface';

@Component({
  selector: 'rrhh-func-viewer',
  templateUrl: './func-viewer.component.html',
  styleUrls: ['./func-viewer.component.css']
})
export class FuncViewerComponent {
  @Input()
  funcionarios: Funcionario[] = []

}
