import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SessionManagerService } from 'src/app/shared/services/session-manager.service';
import { ConfPrecios } from '../../Interfaces/ConfPrecios.interface';
import { CargaKosherService } from '../../services/carga-kosher.service';
import { lastValueFrom } from 'rxjs';
import { ConfMoneda } from '../../Interfaces/ConfMoneda.interface';
import { formatDate } from '@angular/common';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-nuevo-precio',
  templateUrl: './nuevo-precio.component.html',
  styleUrls: ['./nuevo-precio.component.css'],
  providers: [ConfirmationService]
})
export class NuevoPrecioComponent implements OnInit, AfterViewInit {
  idUsuario: number = 0;
  preciosNuevos: ConfPrecios[] = [];
  monedas: ConfMoneda[] = [];
  monedaSeleccionada!: any;
  fechaSeleccionada: Date | undefined = undefined;
  errorIcon: string = 'pi pi-exclamation-triangle';
  okIcon: string = 'pi pi-check';

  @ViewChild('codigoProducto', {static: false}) txtCodigoProducto!: ElementRef;
  @ViewChild('txtPrecioTonelada') txtPrecioTonelada!: ElementRef;

  codigoProducto!: HTMLInputElement;
  precioTonelada!: HTMLInputElement;

  constructor(
    private config: DynamicDialogConfig,
    private cksrvc: CargaKosherService,
    private sessionService: SessionManagerService,
    private ref: DynamicDialogRef,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.idUsuario = this.getUserId();
    this.monedas = this.config.data.monedas;
  }

  ngAfterViewInit(): void {
    this.codigoProducto = this.txtCodigoProducto.nativeElement;
    this.precioTonelada = this.txtPrecioTonelada.nativeElement;  
  }

  private getUserId(): number {
    return this.sessionService.parseUsuario(this.sessionService.getCurrentUser()!!).id_perfil;
  }

  async guardar(): Promise<void> {
    await lastValueFrom(this.cksrvc.insertarListaPrecios(this.preciosNuevos));
    this.destroyDialog(this.ref, 'Guardado'); 
  }

  addToPreciosNuevos(): void {
    if(this.todoOk()) {
      if(!this.yaExisteCodigoParaFecha(this.codigoProducto.value, this.fechaSeleccionada!)) {
        this.preciosNuevos.push({
          codigo_Producto: this.codigoProducto.value,
          fecha_Produccion: this.fechaSeleccionada!,
          fecha_Registro: new Date(),
          id_Moneda: (this.monedaSeleccionada as ConfMoneda).id,
          id_Usuario: this.idUsuario,
          precio_Tonelada: parseFloat(this.precioTonelada.value)
        });
        this.limpiarCampos();
      } else {
        this.mostrarMensaje(
          `El código ${this.codigoProducto.value} para la fecha ${formatDate(this.fechaSeleccionada!, "dd-MM-yyyy", "es-UY")} ya fue ingresado.`,
          'Código duplicado',
          this.errorIcon
        );
      }
    } else
      this.mostrarMensaje('Ingrese todos los datos', 'Falta información', this.errorIcon);
  }

  cerrar(): void {
    this.destroyDialog(this.ref);
  }
  
  private destroyDialog(dialog: DynamicDialogRef, mensaje: string | undefined = undefined): void {
    dialog.close(mensaje);
    dialog.destroy();
  }

  nombreMoneda(idMoneda: number): string {
    return this.monedas.find(m => m.id === idMoneda)?.nombre!;
  }

  onDeleteCodigo(codigo: ConfPrecios): void {
    this.preciosNuevos.splice(this.preciosNuevos.indexOf(codigo), 1);
  }

  private todoOk(): boolean {
    return this.monedaSeleccionada != undefined &&
            this.codigoProducto.value != '' &&
            this.precioTonelada.value != '' && parseFloat(this.precioTonelada.value) > 0 &&
            this.fechaSeleccionada != undefined;
  }

  private yaExisteCodigoParaFecha(codigo: string, fecha: Date): boolean {
    return this.preciosNuevos.find(p => p.codigo_Producto == codigo && this.sonFechasIguales(p.fecha_Produccion, fecha)) != undefined;
  }

  private limpiarCampos(): void {
    this.fechaSeleccionada = undefined;
    this.monedaSeleccionada = undefined;
    this.codigoProducto.value = '';
    this.precioTonelada.value = '';
  }

  private sonFechasIguales(fecha_1: Date, fecha_2: Date): boolean {
    return this.formatearFecha(fecha_1) == this.formatearFecha(fecha_2);
  }

  private formatearFecha(fecha: Date): string {
    return formatDate(fecha, "dd-MM-yyyy", "es-UY");
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
    });
  }
}
