import { Component } from '@angular/core';

@Component({
  selector: 'app-menudencia-faena-vacuna',
  templateUrl: './menudencia-faena-vacuna.component.html',
  styleUrls: ['./menudencia-faena-vacuna.component.css']
})
export class MenudenciaFaenaVacunaComponent {
  fechaFaenaDesde: Date | undefined;
  fechaFaenaHasta: Date | undefined;
}
