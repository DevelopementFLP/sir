import { Component, OnInit } from '@angular/core';
import { GecosService } from 'src/app/shared/services/gecos.service';
import { Cliente } from '../../interfaces/Cliente.interface';
import { Contenedor } from '../../interfaces/Contenedor.interface';
import { Carga } from '../../interfaces/Carga.interface';
import { formatDate } from '@angular/common';
import { DwCaja } from 'src/app/shared/interfaces/DwCaja.interface';
import { DwcajasService } from 'src/app/shared/services/dwcajas.service';


@Component({
  selector: 'app-precios-kosher',
  templateUrl: './precios-kosher.component.html',
  styleUrls: ['./precios-kosher.component.css']
})
export class PreciosKosherComponent implements OnInit {

  datosCarga: Carga[] | undefined = [];
  fechaDesde: Date | undefined;
  fechaHasta: Date | undefined;
  clientes!: Cliente[];
  clientesSeleccionados: Cliente[] = []
  contenedores!: Contenedor[];
  contenedoresSeleccionados: Contenedor[] = [];

  constructor(
    private gecosService: GecosService
  ) {}

  async ngOnInit(): Promise<void> {
    //this.clientes = [{ nombre: 'Seleccione clientes'}];
    //this.contenedores = [{ idContenedor: 'Seleccione contenedores' }];

    this.setFechas();
    //await this.getDatosCarga();
    
    await this.testDwCajas();
  }

  private async getDatosCarga(): Promise<void> {
    this.datosCarga = await this.gecosService.getDatosCarga(this.fD(this.fechaDesde!), this.fD(this.fechaHasta!)).toPromise();
  }

  private fD(f: Date): string {
    return formatDate(f, "yyyy-MM-dd HH:mm:ss", "es-UY");
  }

  private setFechas(): void {
    this.fechaDesde = new Date();
    this.fechaHasta = new Date();
  }

  private async testDwCajas(): Promise<void> {
    console.log(await this.gecosService.getCajasGecos(this.fechaDesde!, this.fechaHasta!).toPromise());
  }

}
