import { Component, Input } from '@angular/core';
import { DashboardDesosadoService } from '../../services/dashboard-desosado.service';

@Component({
  selector: 'total-charqueo',
  templateUrl: './total-charqueo.component.html',
  styleUrls: ['./total-charqueo.component.css']
})
export class TotalCharqueoComponent {
  @Input() titulo: string = 'TOTAL';
  @Input() cortesRec: number = 0;
  @Input() cortesEnv: number = 0;
  @Input() kilosRec: number = 0;
  @Input() kilosEnv: number = 0;
  @Input() rend: number = 0;

  constructor(private dashService: DashboardDesosadoService) {}

  getRendimiento(kilosRecibidos: number, kilosEnviados: number): number {
    const rend: number = kilosEnviados / kilosRecibidos;
    return rend;
  }

  getIndiceRendimiento(): number {
    return this.dashService.getIndiceRendimientoCharqueadores();
  }
}
