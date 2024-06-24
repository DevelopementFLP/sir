import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Scada } from '../../interfaces/Scada.interface';
import { TipoDispositivo } from '../../interfaces/TipoDispositivo.interface';
import { Ubicacion } from '../../interfaces/Ubicacion.interface';

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

  ubicaciones!: Ubicacion[];
  dispositivos!: TipoDispositivo[];

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
    this.ubicaciones = this.config.data.ubicaciones;
    this.dispositivos = this.config.data.dispositivos;
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

  nombreUbicacionPorId(id: number): string {
    return this.ubicaciones?.find(u => u.idUbicacion == id)?.nombre ?? '';
  }

  getNombreDispositivo(id: number): string {
    console.log(id)
    console.log(this.dispositivos.find(d => d.idTipo == id)?.nombre!)
    return this.dispositivos.find(d => d.idTipo == id)?.nombre!;
  }

  getNombreUbicacion(id: number): string {
    return this.ubicaciones.find(u => u.idUbicacion == id)?.nombre!;
  }
}
