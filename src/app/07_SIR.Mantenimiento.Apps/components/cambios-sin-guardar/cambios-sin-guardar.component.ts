import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Scada } from '../../interfaces/Scada.interface';
import { TipoDispositivo } from '../../interfaces/TipoDispositivo.interface';
import { Ubicacion } from '../../interfaces/Ubicacion.interface';
import { UnidadMedida } from '../../interfaces/UnidadMedida.interface';

@Component({
  selector: 'app-cambios-sin-guardar',
  templateUrl: './cambios-sin-guardar.component.html',
  styleUrls: ['./cambios-sin-guardar.component.css']
})
export class CambiosSinGuardarComponent implements OnInit {

  actualizarDatosScada: Scada[] = [];
  agregarDispositivos: TipoDispositivo[] = [];
  actualizarDispositivos: TipoDispositivo[] = [];
  eliminarDispositivos: TipoDispositivo[] = [];
  agregarUbicaciones: Ubicacion[] = [];
  actualizarUbicaciones: Ubicacion[] = [];
  eliminarUbicaciones: Ubicacion[] = [];
  agregarUnidades: UnidadMedida[] = [];
  actualizarUnidades: UnidadMedida[] = [];
  eliminarUnidades: UnidadMedida[] = [];

  ubicaciones!: Ubicacion[];
  dispositivos!: TipoDispositivo[];
  unidades!: UnidadMedida[];

  constructor(private config: DynamicDialogConfig) {}

  ngOnInit(): void {
    if(this.config != null && this.config != undefined) {
      this.setData();
    }    
  }

  private setData(): void {
    this.actualizarDatosScada = this.config.data.updateDatosScada;
    this.agregarDispositivos = this.config.data.addDispositivo;
    this.actualizarDispositivos = this.config.data.updateDispositivo;
    this.eliminarDispositivos = this.config.data.deleteDispositivo;
    this.agregarUbicaciones = this.config.data.addUbicacion;
    this.actualizarUbicaciones = this.config.data.updateUbicacion;
    this.eliminarUbicaciones = this.config.data.deleteUbicacion;
    this.agregarUnidades = this.config.data.addUnidades;
    this.actualizarUnidades = this.config.data.updateUnidades;
    this.eliminarUnidades = this.config.data.deleteUnidades;
    this.ubicaciones = this.config.data.ubicaciones;
    this.dispositivos = this.config.data.dispositivos;
    this.unidades = this.config.data.unidades;
  }

  hayCambiosDatosScada(): boolean {
    return this.actualizarDatosScada.length > 0;
  }

  hayCambiosTiposDispositivos(): boolean {
    return this.agregarDispositivos.length > 0
          || this.actualizarDispositivos.length > 0
          || this.eliminarDispositivos.length > 0 
  }

  hayCambiosUbicaciones(): boolean {
    return this.agregarUbicaciones.length > 0
        || this.actualizarUbicaciones.length > 0
        || this.eliminarUbicaciones.length > 0
  }

  hayCambiosUnidades(): boolean {
    return this.agregarUnidades.length > 0
        || this.actualizarUnidades.length > 0
        || this.eliminarUnidades.length > 0;
  }

  nombreUbicacionPorId(id: number): string {
    return this.ubicaciones?.find(u => u.idUbicacion == id)?.nombre ?? '';
  }

  getNombreDispositivo(id: number): string {
    return this.dispositivos.find(d => d.idTipo == id)?.nombre!;
  }

  getNombreUbicacion(id: number): string {
    return this.ubicaciones.find(u => u.idUbicacion == id)?.nombre!;
  }

  getCodigoUnidadMedida(id: number): string {
    return this.unidades.find(u => u.idUnidadMedida == id)?.codigo!;
  }
}
