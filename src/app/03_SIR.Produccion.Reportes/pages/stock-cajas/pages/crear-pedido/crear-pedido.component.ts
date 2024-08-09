import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { StockCajasService } from '../../services/stock-cajas.service';
import { Tipo } from '../../interfaces/Tipo.interface';
import { Tamano } from '../../interfaces/Tamano.interface';
import { Fieldset } from 'primeng/fieldset';
import { CajaComponent } from '../../components/caja/caja.component';
import { DatePipe, formatDate } from '@angular/common';


@Component({
  selector: 'app-crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrls: ['./crear-pedido.component.css']
})
export class CrearPedidoComponent implements OnInit {

  @ViewChild('seleccionTiposCajas', {static: false}) seleccionTiposCaja!: ElementRef;

  tipoSeleccionado: string | null = '';
  tamanioSeleccionado: string | null = '';

  tipos: Tipo[] | undefined = [];
  tamanos_cajas: Tamano[] | undefined = [];

  esTamanioSeleccionado: boolean = false;
  esTipoSeleccionado: boolean = false;

  nombreCaja: string[] | undefined;
  cantidadCaja: number[] | undefined;
  tamanoCaja: string[] | undefined;
  tipoCaja: string[] | undefined;

   fechahoy = new Date();
  async ngOnInit(): Promise<void> {
    
    await this.GetTiposCajasAsync();
    await this.GetTamanoCajasAsync();
  }

  constructor (private stockService: StockCajasService) {}
  async GetTiposCajasAsync(): Promise<void> {
    this.tipos = await this.stockService.getTiposCajasAsync().toPromise();
  }

  async GetTamanoCajasAsync(): Promise<void> {
    this.tamanos_cajas = await this.stockService.getTamanoCajasAsync().toPromise();
  
  }


  habilitarTipos(): void {
    var seleccionTipos = this.seleccionTiposCaja.nativeElement as HTMLFieldSetElement;

    if(seleccionTipos) {
      seleccionTipos.disabled = false;
    }
  }
  
  borrarSeleccion(): void {
    this.tipoSeleccionado = null;
    this.tamanioSeleccionado = null;

    const seleccionTipos = this.seleccionTiposCaja.nativeElement as HTMLFieldSetElement;
    if(seleccionTipos)
      seleccionTipos.disabled = true;
  }
  
}

