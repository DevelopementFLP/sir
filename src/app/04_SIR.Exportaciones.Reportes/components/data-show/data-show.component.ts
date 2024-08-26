import { Component, Input, OnInit } from '@angular/core';
import { GroupedDataKosher } from '../../types/DataKosherAgrupada.type';
import { DataKosher } from '../../Interfaces/DataKosher.interface';
import { TipoDataContainer } from '../../Interfaces/TipoDataContainer.interface';
import { TipoDataPrecio } from '../../Interfaces/TipoDataPrecio.interface';
import { DataKosherAgrupada } from '../../Interfaces/DataKosherAgrupada.interface';
import { TotalDataAgrupada } from '../../Interfaces/TotalDataAgrupada.interface';
import { KosherCommonService } from '../../services/kosher-common.service';

@Component({
  selector: 'data-show',
  templateUrl: './data-show.component.html',
  styleUrls: ['./data-show.component.css'],
})
export class DataShowComponent implements OnInit {
  @Input() dataGroup: GroupedDataKosher = {};
  @Input() datosKosher: DataKosher[] = [];
  @Input() dua: string = '';
  
  keysDataGroup: string[] = [];
  contenedores: string[] = [];

  totalPalletsByContainer: number = 0;

  datosAgrupados: DataKosherAgrupada[] = [];
  dataTotal!: TotalDataAgrupada;

  constructor(private cks: KosherCommonService) {}

  ngOnInit(): void {
    this.contenedores = Array.from(new Set(this.datosKosher.map(c => c.container)));

    this.datosAgrupados = this.cks.setDatosAgrupados(this.datosKosher);
    this.totalPalletsByContainer = this.cks.getTotalPalletsByContainer(this.datosAgrupados);
  }

  getDataByContainer(container: string): DataKosherAgrupada[] {
    var data: DataKosherAgrupada[] = this.datosAgrupados.filter(d => d.container === container);
    this.dataTotal = this.cks.totalDataAgrupadaPorContainer(data);
    return data;
  }

 
}
