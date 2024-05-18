import { Component, OnInit } from '@angular/core';
import { DetalleCharqueo } from '../../interfaces/DetalleCharqueo.interface';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IndicadorCharqueador } from '../../interfaces/IndicadorCharqueador.interface';

@Component({
  selector: 'app-detalle-charqueadores',
  templateUrl: './detalle-charqueadores.component.html',
  styleUrls: ['./detalle-charqueadores.component.css']
})
export class DetalleCharqueadoresComponent implements OnInit {
  detalleCharqueo: IndicadorCharqueador[] = [];
  totalCortesRecibidos: number = 0;
  totalCortesEnviados: number = 0;
  totalKilosEnviados: number = 0;
  totalKilosRecibidos: number = 0;
  rendPromedio: number = 0;
  kilosPromedio: number = 0;

  constructor(public config: DynamicDialogConfig) {}

  ngOnInit(): void {
    if(this.config){
      this.detalleCharqueo = this.config.data.charqueadores;
      this.totalCortesEnviados = this.cortesEnviados();
      this.totalCortesRecibidos = this.cortesRecibidos();
      this.totalKilosEnviados = this.kilosEnviados();
      this.totalKilosRecibidos = this.kilosRecibidos();
      this.rendPromedio = this.detalleCharqueo[0].procRendPromedio;
      this.kilosPromedio = this.detalleCharqueo[0].promedioKilosSalidaCharqueador;
    }
  }

  cortesRecibidos(): number {
    const cortes = this.detalleCharqueo.reduce((total, detalle) => {
      return total + detalle.cortesRecibidos;
    }, 0);

    return cortes;
  }

  cortesEnviados(): number {
    const cortes = this.detalleCharqueo.reduce((total, detalle) => {
      return total + detalle.cortesEnviados;
    }, 0);

    return cortes;
  }

  kilosRecibidos(): number {
    const kilos = this.detalleCharqueo.reduce((total, detalle) => {
      return total + detalle.kgRecibidos;
    }, 0);

    return kilos;
  }

  kilosEnviados(): number {
    const kilos = this.detalleCharqueo.reduce((total, detalle) => {
      return total + detalle.kgEnviados;
    }, 0);

    return kilos;
  }
}
