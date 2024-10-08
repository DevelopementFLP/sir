import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IngenieriaService } from '../../services/ingenieria.service';
import { Scada } from '../../interfaces/Scada.interface';
import { TipoDispositivo } from '../../interfaces/TipoDispositivo.interface';
import { Ubicacion } from '../../interfaces/Ubicacion.interface';
import { Dropdown } from 'primeng/dropdown';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CambiosSinGuardarComponent } from '../../components/cambios-sin-guardar/cambios-sin-guardar.component';
import { ScadaDTO } from '../../interfaces/ScadaDTO.interface';
import { UnidadMedida } from '../../interfaces/UnidadMedida.interface';
import { CommonService } from 'src/app/shared/services/common.service';


@Component({
  selector: 'app-dispositivos-scada',
  templateUrl: './dispositivos-scada.component.html',
  styleUrls: ['./dispositivos-scada.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DialogService, MessageService, ConfirmationService],
})
export class DispositivosScadaComponent implements OnInit, OnDestroy {

  @ViewChild('txtNuevoTipo', {static: false}) nuevoTipoRef!: ElementRef;
  @ViewChild('txtNombreUbicacion', {static: false}) nombreUbicacionRef!: ElementRef;
  @ViewChild('txtDescripcionUbicacion', {static: false}) descripcionUbicacion!: ElementRef;
  @ViewChild('cbUbicacionParde', {static: false}) ubicacionPadre!: Dropdown;
  @ViewChild('txtCodigoUnidad', {static: false}) nuevaUnidadCodigoRef!: ElementRef;
  @ViewChild('txtNombreUnidad', {static: false}) nuevaUnidadNombreRef!: ElementRef;

  cambiosDialog: DynamicDialogRef | undefined;

  datosScada: Scada[] | undefined= [];
  dispositivos: TipoDispositivo[] | undefined = [];
  ubicaciones: Ubicacion[] | undefined = [];
  unidades: UnidadMedida[] | undefined = [];

  datosScadaOrigin: Scada[] | undefined = [];
  dispositivosOrigin: TipoDispositivo[] | undefined = [];
  ubicacionesOrigin: Ubicacion[] | undefined = [];
  unidadesOrigin: UnidadMedida[] | undefined = [];

  actualizarDatosScada: Scada[] = [];
  agregarDispositivos: TipoDispositivo[] = [];
  actualizarDispositivos: TipoDispositivo[] = [];
  eliminarDispositivos: TipoDispositivo[] = [];
  agregarUbicaciones: Ubicacion[] = [];
  actualizarUbicacion: Ubicacion[] = [];
  eliminarUbicacion: Ubicacion[] = [];
  agregarUnidades: UnidadMedida[] = [];
  actualizarUnidades: UnidadMedida[] = [];
  eliminarUnidades: UnidadMedida[] = [];

  hayCambios: boolean = false;

  idReporte: number = 6;
  nombreReporte: string = 'Configuración dispositivos SCADA';

  mostrarExportacion: boolean = false;
  
  dsp: Scada[] = [];
  dp: TipoDispositivo[] = [];
  up: Ubicacion[] = [];
  um: UnidadMedida[] = [];

  constructor(
    private ingSrvc: IngenieriaService,
    public dialogService: DialogService,
    public messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cs: CommonService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getAll();
  }

  async getAll(): Promise<void> {
    try {
      await Promise.all([
        this.getDatosScada(),
        this.getTiposDispositivos(),
        this.getUbicacionesDispositivos(),
        this.getUnidadesMedida()
      ]);
      this.mostrarExportacion = true;
    } catch (error) {
      console.error('Ocurrió un error durante la carga de datos:', error);
    }
  }

  ngOnDestroy(): void {
    if(this.cambiosDialog) {
      this.cambiosDialog.close();
      this.cambiosDialog.destroy();
    }
  }

  private async getDatosScada(): Promise<void> {
    this.datosScada = await this.ingSrvc.getDatosScada().toPromise();
    this.datosScadaOrigin = this.cs.deepCopy(this.datosScada); //[...this.datosScada!];
  }

  private async getTiposDispositivos(): Promise<void> {
    this.dispositivos = await this.ingSrvc.getTiposDispositivos().toPromise();
    this.dispositivosOrigin = this.cs.deepCopy(this.dispositivos); //[...this.dispositivos!];
  }

  private async getUbicacionesDispositivos(): Promise<void> {
    this.ubicaciones = await this.ingSrvc.getUbicacionesDispositivos().toPromise();
    this.ubicacionesOrigin = this.cs.deepCopy(this.ubicaciones); //[...this.ubicaciones!];
  }

  private async getUnidadesMedida(): Promise<void> {
    this.unidades = await this.ingSrvc.getUnidadesMedida().toPromise();
    this.unidadesOrigin = this.cs.deepCopy(this.unidades);
  }

  getUbicaciones(): string[] {
    return this.extractProperty(this.ubicaciones!, 'nombre');
  }

  private extractProperty<T>(array: T[], property: keyof T): any[] {
    return array.map(item => item[property]);
  }

  agregarNuevoTipoDispositivo(): void {
    const inp: HTMLInputElement = this.nuevoTipoRef.nativeElement as HTMLInputElement;
    if(inp) {
      const tipo: string = inp.value;
      if(tipo != '') {
        
        const nuevoTipo: TipoDispositivo = {
          idTipo: 0,
          nombre: tipo
        }

        this.dispositivos!.push(nuevoTipo);
        this.agregarDispositivos.push(nuevoTipo);
        this.hayCambios = true;
        this.mostrarExportacion = false;

        inp.value = '';
        inp.focus();
      }
    }
  }

  opcionSeleccionada!: any;

  agregarNuevaUbicacionDispositivo(): void {
    const cbUbicacionPadre: Dropdown = this.ubicacionPadre as Dropdown;
    const inpNombre: HTMLInputElement = this.nombreUbicacionRef.nativeElement as HTMLInputElement;
    const inpDescripcion: HTMLInputElement = this.descripcionUbicacion.nativeElement as HTMLInputElement;
    
    if(cbUbicacionPadre && inpNombre && inpDescripcion) {
      const ubicacionPadreSeleccionada: Ubicacion = cbUbicacionPadre.selectedOption;
      const nombre: string = inpNombre.value;
      const desc: string = inpDescripcion.value;

      if(ubicacionPadreSeleccionada && nombre != '' && desc != '') {
          
        const nuevaUbicacion: Ubicacion =  {
          idUbicacion: 0,
          idUbicacionPadre: this.opcionSeleccionada.idUbicacion,
          nombre: nombre,
          descripcion: desc
        };

        this.ubicaciones!.push(nuevaUbicacion);
        this.agregarUbicaciones.push(nuevaUbicacion);
        this.hayCambios = true;
        this.mostrarExportacion = false;

        this.opcionSeleccionada = undefined;
        inpNombre.value = '';
        inpDescripcion.value = '';
        inpNombre.focus();
      }
    }
  
  }

  agregarNuevaUnidadMedida(): void {
    const inpNombre: HTMLInputElement = this.nuevaUnidadNombreRef.nativeElement as HTMLInputElement;
    const inpCodigo: HTMLInputElement = this.nuevaUnidadCodigoRef.nativeElement as HTMLInputElement;
    
    if(inpNombre && inpCodigo) {
      const codigo: string = inpCodigo.value;
      const nombre: string = inpNombre.value;

      if(codigo != '' && nombre != '') {
        const nuevaUnidad: UnidadMedida = {
          idUnidadMedida: 0,
          codigo: codigo,
          nombre: nombre
        }

        this.unidades!.push(nuevaUnidad);
        this.agregarUnidades.push(nuevaUnidad);
        this.hayCambios = true;
        this.mostrarExportacion = false;

        inpNombre.value = '';
        inpCodigo.value = '';
        inpCodigo.focus();
      }
    }
  }


  onDeleteUbicacion(ubicacion: Ubicacion): void {
    if(ubicacion){
      const id: number = ubicacion.idUbicacion;
      const idUbicaciones: number[] = this.extractProperty(this.ubicaciones!, 'idUbicacionPadre');

      if( id > 0 && idUbicaciones.indexOf(id) >= 0) {
        this.mostrarMensaje('No se puede eliminar esta ubicación porque es padre de otra.', 'Eliminar ubicación', 'pi pi-exclamation-triangle');
      } else if(this.datosScada!.find(d => d.idUbicacion == id) != undefined) {
        this.mostrarMensaje('No se puede eliminar esta ubicación porque tiene dispositivos asociados.', 'Eliminar ubicación', 'pi pi-exclamation-triangle');
      } else {
        const indexInUbicaciones: number = this.ubicaciones!.indexOf(ubicacion);
        if(indexInUbicaciones >= 0) {
          console.log(indexInUbicaciones)
          this.ubicaciones!.splice(indexInUbicaciones, 1);
          this.eliminarUbicacion.push(ubicacion);

          if(this.agregarUbicaciones.indexOf(ubicacion) >= 0)
            this.agregarUbicaciones.splice(this.agregarUbicaciones.indexOf(ubicacion), 1);
  
          if(this.actualizarUbicacion.indexOf(ubicacion) >= 0)
            this.actualizarUbicacion.splice(this.actualizarUbicacion.indexOf(ubicacion), 1);

          this.hayCambios = true;
          this.mostrarExportacion = false;
        }
      }
    }
  }

  onDeleteTipoDispositivo(tipo: TipoDispositivo): void {
    if(tipo) {
      if(this.datosScada!.find(d => d.idTipoDispositivo == tipo.idTipo) != undefined) {
        this.mostrarMensaje('No se puede eliminar este tipo de dispositivo porque tiene dispositivos asociados.', 'Eliminar tipo dispositivo', 'pi pi-exclamation-triangle');
      } else {
        this.dispositivos!.splice(this.dispositivos!.indexOf(tipo), 1);
        this.eliminarDispositivos.push(tipo);

        if(this.agregarDispositivos.indexOf(tipo) >= 0)
          this.agregarDispositivos.splice(this.agregarDispositivos.indexOf(tipo), 1);

        if(this.actualizarDispositivos.indexOf(tipo) >= 0)
          this.actualizarDispositivos.splice(this.actualizarDispositivos.indexOf(tipo), 1);

        this.hayCambios = true;
        this.mostrarExportacion = false;
      }
    }
  }

  onDeleteUnidad(unidad: UnidadMedida): void {
    if(unidad) {
      if(this.datosScada!.find(d => d.idUnidadMedida == unidad.idUnidadMedida) != undefined) {
        this.mostrarMensaje('No se puede eliminar esta unidad de medida porque tiene dispositivos asociados.', 'Eliminar unidad de medida', 'pi pi-exclamation-triangle');
      } else {
        this.unidades?.splice(this.unidades.indexOf(unidad), 1);
        this.eliminarUnidades.push(unidad);

        if(this.agregarUnidades.indexOf(unidad) >= 0)
          this.agregarUnidades.splice(this.agregarUnidades.indexOf(unidad), 1);

        if(this.actualizarUnidades.indexOf(unidad) >= 0)
          this.actualizarUnidades.splice(this.actualizarUnidades.indexOf(unidad), 1);

        this.hayCambios = true;
        this.mostrarExportacion = false;
      }
    }
  }

  onEditUnidad(data: UnidadMedida): void {
    if(this.actualizarUnidades.find(d => d.idUnidadMedida == data.idUnidadMedida)) {
      const index: number = this.actualizarUnidades.indexOf(data);
      this.actualizarUnidades.splice(index, 1);
    }

    this.actualizarUnidades.push(data);
    this.hayCambios = true;
    this.mostrarExportacion = false;
  }

  onEditDataScada(data: Scada): void {
    if(this.actualizarDatosScada.find(d => d.deviceId == data.deviceId)) {
      const index: number = this.actualizarDatosScada.indexOf(data);
      this.actualizarDatosScada.splice(index, 1);
    }

    this.actualizarDatosScada.push(data);
    this.hayCambios = true;
    this.mostrarExportacion = false;
  }

  onEditTipoDispositivo(tipo: TipoDispositivo): void {
    if(this.actualizarDispositivos.find(d => d.idTipo === tipo.idTipo)) {
      const index: number = this.actualizarDispositivos.indexOf(tipo);
      this.actualizarDispositivos.splice(index, 1);  
    } 

    this.actualizarDispositivos.push(tipo);
    this.hayCambios = true;
    this.mostrarExportacion = false;
  }

  onEditUbicacion(ubicacion: Ubicacion): void {
    if(this.actualizarUbicacion.find(u => u.idUbicacion === ubicacion.idUbicacion)) {
      const index: number = this.actualizarUbicacion.indexOf(ubicacion);
      this.actualizarUbicacion.splice(index, 1);
    }

    this.actualizarUbicacion.push(ubicacion);
    this.hayCambios = true;
    this.mostrarExportacion = false;
  }

  mostrarMensaje(mensaje: string, header: string, icon: string): void {
    this.confirmationService.confirm({
      header: header,
      message: mensaje,
      icon: icon,
      rejectVisible: false,
      dismissableMask: true,
      closeOnEscape: true,
      acceptLabel: 'Aceptar',
      accept: () => {},
    });
  }

  showCambiosSinGuardar(): void {
    this.cambiosDialog = this.dialogService.open(CambiosSinGuardarComponent, {
      data: {
        updateDatosScada: this.actualizarDatosScada,
        addDispositivo: this.agregarDispositivos,
        updateDispositivo: this.actualizarDispositivos,
        deleteDispositivo: this.eliminarDispositivos,
        addUbicacion: this.agregarUbicaciones,
        updateUbicacion: this.actualizarUbicacion,
        deleteUbicacion: this.eliminarUbicacion,
        ubicaciones: this.ubicaciones,
        dispositivos: this.dispositivos,
        addUnidades: this.agregarUnidades,
        updateUnidades: this.actualizarUnidades,
        deleteUnidades: this.eliminarUnidades,
        unidades: this.unidades
      },
      header: 'Cambios sin guardar',
      closable: true,
      closeOnEscape: true,
      dismissableMask: true,
      width: '60vw',
      height: '80vh'
    })
  }

  async saveChanges(): Promise<void> {    
    if(this.agregarUbicaciones.length > 0)
      await this.ingSrvc.insertUbicaciones(this.agregarUbicaciones).toPromise();

    if(this.actualizarUbicacion.length > 0)
      await this.ingSrvc.updateUbicaciones(this.actualizarUbicacion).toPromise();

    if(this.eliminarUbicacion.length > 0) 
      await this.ingSrvc.deleteUbicaciones(this.eliminarUbicacion).toPromise();

    if(this.agregarDispositivos.length > 0)
      await this.ingSrvc.insertDispositivos(this.agregarDispositivos).toPromise();

    if(this.actualizarDispositivos.length > 0)
      await this.ingSrvc.updateTiposDispositivos(this.actualizarDispositivos).toPromise();

    if(this.eliminarDispositivos.length > 0) 
      await this.ingSrvc.deleteTiposDispositivos(this.eliminarDispositivos).toPromise();
  
    if(this.agregarUnidades.length > 0)
      await this.ingSrvc.insertUnidadesMedida(this.agregarUnidades).toPromise();

    if(this.actualizarUnidades.length > 0)
      await this.ingSrvc.updateUnidadesMedida(this.actualizarUnidades).toPromise();

    if(this.eliminarUnidades.length > 0)
      await this.ingSrvc.deleteUnidadesMedida(this.eliminarUnidades).toPromise();

    if(this.actualizarDatosScada.length > 0) {
      const datos: ScadaDTO[] = this.mapearDatosScada(this.actualizarDatosScada)
      if(datos != undefined && datos.length > 0)
        await this.ingSrvc.updateDatosScada(datos).toPromise();
    }

    this.actualizarDatosScada = [];
    this.agregarDispositivos = [];
    this.actualizarDispositivos = [];
    this.eliminarDispositivos = [];
    this.agregarUbicaciones = [];
    this.actualizarUbicacion = [];
    this.eliminarUbicacion = [];
    this.agregarUnidades = [];
    this.actualizarUnidades = [];
    this.eliminarUnidades = [];
    this.hayCambios = false;
    this.mostrarExportacion = true;

    await this.getAll();

  }

  private reset(): void {
    window.location.reload();
  }
  

  discardChanges(): void {
    // window.location.reload();
    this.actualizarDatosScada = [];
    this.agregarDispositivos = [];
    this.actualizarDispositivos = [];
    this.eliminarDispositivos = [];
    this.agregarUbicaciones = [];
    this.actualizarUbicacion = [];
    this.eliminarUbicacion = [];
    this.agregarUnidades = [];
    this.actualizarUnidades = [];
    this.eliminarUnidades = [];
    this.datosScada =  this.cs.deepCopy(this.datosScadaOrigin);     //[...this.datosScadaOrigin!];
    this.dispositivos = this.cs.deepCopy(this.dispositivosOrigin);  //[...this.dispositivosOrigin!];
    this.ubicaciones = this.cs.deepCopy(this.ubicacionesOrigin);    //[...this.ubicacionesOrigin!];
    this.unidades = this.cs.deepCopy(this.unidadesOrigin);
    this.hayCambios = false;
    this.mostrarExportacion = true;
  }

  private mapearDatosScada(datos: Scada[]): ScadaDTO[] {
    const data: ScadaDTO[] = [];
    datos.forEach(d => {
      data.push(this.mapToDTO(d));
    });

    return data;
  }

  private mapToDTO(scada: Scada): ScadaDTO {
    return {
      id: scada.id,
      deviceId: scada.deviceId,
      idTipoDispositivo: scada.idTipoDispositivo, 
      idUbicacion: scada.idUbicacion,
      idUnidadMedida: scada.idUnidadMedida,
      nombre: scada.nombre,
      descripcion: scada.descripcion
    }
  }
}
