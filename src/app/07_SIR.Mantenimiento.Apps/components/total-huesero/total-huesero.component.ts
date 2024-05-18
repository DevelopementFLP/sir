import { Component, Input } from '@angular/core';
import { DashboardDesosadoService } from '../../services/dashboard-desosado.service';

@Component({
  selector: 'total-huesero',
  templateUrl: './total-huesero.component.html',
  styleUrls: ['./total-huesero.component.css']
})
export class TotalHueseroComponent {
  @Input() titulo: string = 'TOTAL';
  @Input() cuartos: number = 0;
  @Input() kilosRec: number = 0;
  @Input() kilosEnv: number = 0;
  @Input() rend: number = 0;

  constructor(private dashService: DashboardDesosadoService) {}

  getRendimiento(kilosRecibidos: number, kilosEnviados: number): number {
    const rend: number = kilosEnviados / kilosRecibidos;
    return rend;
  }

  getIndiceRendimiento(): number {
    return this.dashService.getIndiceRendimientoHueseros();
  }
}
