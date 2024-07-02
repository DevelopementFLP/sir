import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CargaKosherService } from '../../services/carga-kosher.service';
import { DWContainer } from '../../Interfaces/DWContainer.interface';
import { ConfMoneda } from '../../Interfaces/ConfMoneda.interface';
import { ConfPreciosDTO } from '../../Interfaces/ConfPrecios.DTOinterface';
import { formatDate } from '@angular/common';

interface ContainerOptions {
  label: string, value: string[]
}

interface FechasExtremos {
  fechaMinima: Date,
  fechaMaxima: Date
}

@Component({
  selector: 'app-detalle-embarque',
  templateUrl: './detalle-embarque.component.html',
  styleUrls: ['./detalle-embarque.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DetalleEmbarqueComponent implements OnInit{

  containers: string[] | undefined= [];
  dataContainers: DWContainer[] | undefined = [];
  tiposMoneda: ConfMoneda[] | undefined = [];
  productosConPrecio: ConfPreciosDTO[] | undefined = [];

  containersOptions: ContainerOptions[] = [];
  selectedContainers: ContainerOptions[] = [];

  constructor(private cargaKosherSrv: CargaKosherService) {}

  async ngOnInit(): Promise<void> {
    await this.getContainers();
    await this.mapContainerOptions();
    await this.getTiposMoneda();
  }

  private async getContainers(): Promise<void> {
    this.containers = await this.cargaKosherSrv.getContainers().toPromise();
  }

  async getDataByContainers(): Promise<void> {
    this.dataContainers = await this.cargaKosherSrv.getDataByContainer(this.setContainersQuery()).toPromise();
    await this.getCodigosConPrecio();
  } 
  
  private setContainersQuery(): string {
    let containers = this.selectedContainers.map(cont => cont.label).join(',');
    return containers;
  }

  private mapContainerOptions(): void {
    this.containersOptions = this.containers!.map(container => ({
      label: container,
      value: [container]
    }));
  }

  private async getTiposMoneda(): Promise<void> {
    this.tiposMoneda = await this.cargaKosherSrv.getTiposMoneda().toPromise();
  }

  private async getCodigosConPrecio(): Promise<void> {
    const fechas: FechasExtremos = this.getFechasExtremo();
    const fMin = formatDate(fechas.fechaMinima, "yyyy-MM-dd", "es-UY"); 
    const fMax = formatDate(fechas.fechaMaxima, "yyyy-MM-dd", "es-UY "); 
    
    this.productosConPrecio = await this.cargaKosherSrv.getPreciosPorFecha(fMin, fMax).toPromise();
  }


  private getFechasExtremo(): FechasExtremos {
    var fechasE: FechasExtremos = { 
      fechaMinima: this.dataContainers?.reduce((min, d) => d.exportdate < min ? d.exportdate : min, this.dataContainers[0].exportdate)!,
      fechaMaxima: this.dataContainers?.reduce((max, d) => d.exportdate >= max ? d.exportdate: max, this.dataContainers[0].exportdate)!
    }

    return fechasE;
  }

}
