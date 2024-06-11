import { Component, Input, OnDestroy } from '@angular/core';
import { EstacionesCortesCajas } from '../../interfaces/EstacionesCortesCajas.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DashSecundarioService } from '../../services/dashboard-secundario.service';
import { ProductosPorEstacion } from '../../interfaces/ProductosPorEstacion.interface';
import { CortesPorEstacionComponent } from '../cortes-por-estacion/cortes-por-estacion.component';

@Component({
  selector: 'linea-empaque',
  templateUrl: './linea-empaque.component.html',
  styleUrls: ['./linea-empaque.component.css'],
  providers: [DialogService]
})
export class LineaEmpaqueComponent implements OnDestroy{

  @Input() nroLinea: number = 0;
  @Input() cantidadPuestos: number = 0;
  @Input() estaciones: EstacionesCortesCajas[] = [];
  
  dialogRef: DynamicDialogRef | undefined;

  constructor(
      private dialog: DialogService,
      private dashService: DashSecundarioService) {}

  ngOnDestroy(): void {
    if(this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef.destroy();
    }
  }

  getEstacion(nroPuesto: number): EstacionesCortesCajas | undefined {
    var puestoStr: string = nroPuesto <= 9 ? '0' + nroPuesto.toString() : nroPuesto.toString();
    return this.estaciones.find(p => p.station.endsWith(puestoStr))?? undefined;
  }

  getProductosPorEstacion(idStation: number): void {
    var station: string = '';
    var puesto: EstacionesCortesCajas | undefined = this.getEstacion(idStation);

    if(puesto) this.showProductosPorEstacion(puesto.station);
  }

  private async showProductosPorEstacion(station: string): Promise<void> {
    const minDesde: number = this.dashService.getTimeLapse();
    var cortesPuesto: ProductosPorEstacion | undefined; 
    
    cortesPuesto = await this.dashService.getProductosPorEstacion(station, minDesde).toPromise();

    if(cortesPuesto) {
      this.dialogRef = this.dialog.open(CortesPorEstacionComponent, {
        data: {
          productos: cortesPuesto
        },
        header:"Cortes por estación " + station,
        width: '50vw',
        closable: true,
        closeOnEscape: true,
        dismissableMask: true
      })
    }
    
  }
}
