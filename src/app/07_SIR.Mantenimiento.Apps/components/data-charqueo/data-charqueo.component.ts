import { Component, Input, OnInit } from '@angular/core';
import { DataCharqueo } from '../../interfaces/DataCharqueo.interface';
import { DashboardDesosadoService } from '../../services/dashboard-desosado.service';

@Component({
  selector: 'data-charqueo',
  templateUrl: './data-charqueo.component.html',
  styleUrls: ['./data-charqueo.component.css']
})
export class DataCharqueoComponent implements OnInit {
  @Input() dataCharqueo!: DataCharqueo | undefined;
  @Input() lado: number = 1;
  @Input() idPuesto: number = 0;
  
  constructor(private dashService: DashboardDesosadoService) {}

  ngOnInit(): void {
   
  }


  getPuesto(linea: string): string {
    let puesto: string = '';
    if(linea != '') {
      puesto = "C" + linea.split(' ')[2];
    }
    return puesto;
  }

  getPuestoVacio(id: number): string {
    const pre: string = id < 9 ? '0' : '';
    return "C" + pre + (id + 1).toString();
  }

  getRendimiento(charqueador: DataCharqueo | undefined): number {
    if(!charqueador) return 0;
    const rend: number = charqueador.kilosEnviados / charqueador.kilosRecibidos;
    return rend;
  }

  getIndiceRendimiento(): number {
    return this.dashService.getIndiceRendimientoCharqueadores();
  }
}
