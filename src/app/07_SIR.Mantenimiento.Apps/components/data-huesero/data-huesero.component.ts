import { Component, Input, OnInit } from '@angular/core';
import { DataHuesero } from '../../interfaces/DataHuesero.interface';
import { DashboardDesosadoService } from '../../services/dashboard-desosado.service';

@Component({
  selector: 'data-huesero',
  templateUrl: './data-huesero.component.html',
  styleUrls: ['./data-huesero.component.css']
})
export class DataHueseroComponent implements OnInit {

  @Input() dataHuesero: DataHuesero | undefined;
  @Input() idPuesto: number = 0;
  noData: string = '   ';

  constructor(private dashService: DashboardDesosadoService) {}

  ngOnInit(): void {
    
  }

  getPuesto(linea: string): string {
    let puesto: string = '';
    if(linea != '') {
      puesto = "H" + linea.split(' ')[2];
    }
    return puesto;
  }

  getPuestoVacio(id: number): string {
    const pre: string = id < 10 ? '0' : '';
    return "H" + pre + (id + 1).toString();
  }
  
  getRendimiento(huesero: DataHuesero | undefined): number {
    if(!huesero) return 0;
    const rend: number = huesero.kilosEnviados / huesero.kilosRecibidos;
    return rend;
  }

  getIndiceRendimiento(): number {
    return this.dashService.getIndiceRendimientoHueseros();
  }
}
