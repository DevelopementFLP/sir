import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CargaKosherService } from '../../services/carga-kosher.service';
import { DWContainer } from '../../Interfaces/DWContainer.interface';
import { ConfMoneda } from '../../Interfaces/ConfMoneda.interface';
import { ConfPreciosDTO } from '../../Interfaces/ConfPrecios.DTOinterface';
import { formatDate } from '@angular/common';
import { ContainerDTO } from '../../Interfaces/ContainerDTO.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdminPreciosComponent } from '../admin-precios/admin-precios.component';

interface ContainerOptions {
  label: string, value: ContainerDTO[]
}

interface FechasExtremos {
  fechaMinima: Date,
  fechaMaxima: Date
}

@Component({
  selector: 'config-precios',
  templateUrl: './config-precios.component.html',
  styleUrls: ['./config-precios.component.css'],
  providers: [DialogService, MessageService, ConfirmationService],
  encapsulation: ViewEncapsulation.None
})
export class ConfigPreciosComponent implements OnInit, OnDestroy {

  adminPreciosRef! : DynamicDialogRef;

  containersOriginal: ContainerDTO[] | undefined = [];

  containers: ContainerDTO[] | undefined = [];
  dataContainers: DWContainer[] | undefined = [];
 
  tiposMoneda: ConfMoneda[] | undefined = [];
  productosConPrecio: ConfPreciosDTO[] | undefined = [];
  precios: ConfPreciosDTO[] | undefined = [];
  fechasPrecios: Date[] | undefined = [];
  listasPrecios: ConfPreciosDTO[][] | undefined = [];
  codigos: string[] = [];

  containersOptions: ContainerOptions[] = [];
  selectedContainers: ContainerOptions[] = [];

  idCarga!: number;

  constructor(
    private cargaKosherSrv: CargaKosherService,
    private dialogService: DialogService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getContainers();
    await this.mapContainerOptions();
    await this.getTiposMoneda();
    await this.getPrecios();
    this.getFechasPrecios();
    this.setListasPrecios();
    this.getCodigos();
  }

  ngOnDestroy(): void {
    if(this.adminPreciosRef) {
      this.adminPreciosRef.close();
      this.adminPreciosRef.destroy();
    }
  }

  private async getContainers(): Promise<void> {
    this.containers = await this.cargaKosherSrv.getContainers().toPromise();
    this.containersOriginal = this.deepCopy(this.containers);
  }

  async getDataByContainers(): Promise<void> {
    this.dataContainers = await this.cargaKosherSrv.getDataByContainer(this.idCarga, this.setContainersQuery()).toPromise();
    await this.getCodigosConPrecio();
  } 
  
  private setContainersQuery(): string {
    let containers = this.selectedContainers.map(cont => cont.label).join(',');
    return containers;
  }

  private mapContainerOptions(): void {
    this.containersOptions = this.containers!.map(container => ({
      label: container.container,
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

  private async getPrecios(): Promise<void> {
    this.precios = await this.cargaKosherSrv.getPrecios().toPromise();
  }

  private getFechasExtremo(): FechasExtremos {
    var fechasE: FechasExtremos = { 
      fechaMinima: this.dataContainers?.reduce((min, d) => d.exportdate < min ? d.exportdate : min, this.dataContainers[0].exportdate)!,
      fechaMaxima: this.dataContainers?.reduce((max, d) => d.exportdate >= max ? d.exportdate: max, this.dataContainers[0].exportdate)!
    }

    return fechasE;
  }

  filterContainersByIdCarga(): void {
    this.containers = this.deepCopy(this.containersOriginal);
    if(this.idCarga)
      this.containers = this.containers?.filter(c =>c.id_Carga == this.idCarga);      
    
    this.mapContainerOptions();
  }

  deepCopy<T>(obj: T): T {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => this.deepCopy(item)) as any;
    }
    
    const newObj: Partial<T> = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = this.deepCopy(obj[key]);
        }
    }
    
    return newObj as T;
}

  private getFechasPrecios(): void {
    this.fechasPrecios = Array.from(new Set(this.precios!.map(p => p.fecha_Produccion)))?? undefined;
  }

  private setListasPrecios(): void {
    if(this.fechasPrecios) {
      this.fechasPrecios.forEach(fecha => {
        this.listasPrecios!.push(this.precios?.filter(p => p.fecha_Produccion == fecha)!)   
      });
    }
  }

  private getCodigos(): void {
    this.codigos = Array.from(new Set(this.precios?.map(p => p.codigo_Producto)));
  }

  getPrecioPorCodigoYFecha(codigo: string, fecha: Date): number {
    var precio = this.precios?.find(p => p.codigo_Producto == codigo && p.fecha_Produccion == fecha);
    if(precio) return precio.precio_Tonelada;
    return 0;
  }

  adminPrecios(): void {
    this.adminPreciosRef = this.dialogService.open(AdminPreciosComponent, {
      data: {
        fechas: this.fechasPrecios
      },
      header: "Administrar listas de precios",
      width: "50vw",
      closable: true,
      closeOnEscape: true,
      dismissableMask: true
    });
  }

}
