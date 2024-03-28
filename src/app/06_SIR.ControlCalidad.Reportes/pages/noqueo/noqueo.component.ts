import { Component } from '@angular/core';

@Component({
  selector: 'app-noqueo',
  templateUrl: './noqueo.component.html',
  styleUrls: ['./noqueo.component.css']
})
export class NoqueoComponent {
  fechaFaena: Date | undefined;
  animalesFaenados: number = 0;

  promedioTension: number = 320;
  variacionTension: number = 10;

  promedioCorriente: number = 1.3;
  variacionCorriente: number = 0.25

  promedioTiempo: number = 4000;
  variacionTiempo: number = 900;
}
