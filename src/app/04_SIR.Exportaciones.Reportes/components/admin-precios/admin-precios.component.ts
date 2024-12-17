import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CargaKosherService } from '../../services/carga-kosher.service';
import * as xls from 'xlsx';
import { FileUpload } from 'primeng/fileupload';
import { ConfMoneda } from '../../Interfaces/ConfMoneda.interface';
import { ConfPreciosDTO } from '../../Interfaces/ConfPreciosDTO.interface';
import { Accordion, AccordionTab } from 'primeng/accordion';
import { SessionManagerService } from 'src/app/shared/services/session-manager.service';
import { ConfPrecios } from '../../Interfaces/ConfPrecios.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonService } from 'src/app/shared/services/common.service';
import { PrecioCarga } from '../../Interfaces/PrecioCarga.interface';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-precios',
  templateUrl: './admin-precios.component.html',
  styleUrls: ['./admin-precios.component.css'],
  providers: [DialogService, MessageService, ConfirmationService],
  encapsulation: ViewEncapsulation.None,
})
export class AdminPreciosComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: FileUpload;
  @ViewChild('accordion', { static: false }) accordion!: Accordion;
  @ViewChild('tab1', { static: false }) tab1!: AccordionTab;
  @ViewChild('tab2', { static: false }) tab2!: AccordionTab;

  idUsuario: number = 0;
  activeIndex: number = -1;

  hayErrores: boolean = false;
  mostrarBotones: boolean = true;
  monedaSeleccionada: boolean = false;
  tipoMonedaSeleccionada: string = 'No seleccionada';
  idSeleccion: number = -1;

  files: File[] = [];
  preciosData: any;

  todasLasFechas: string[] = [];
  fechas: string[] = [];
  eliminarFechas: string[] = [];
  agregarFechas: string[] = [];
  monedas: ConfMoneda[] = [];
  precios: ConfPreciosDTO[] = [];
  insertarPrecios: ConfPrecios[] = [];

  fechasDuplicadas: string[] = [];
  fechasDistintas: ConfPrecios[] = [];

  errores: string[] = [];
  errorIcon: string = 'pi pi-exclamation-triangle';
  okIcon: string = 'pi pi-check';

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private ckSrvc: CargaKosherService,
    private sessionService: SessionManagerService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private comSrvc: CommonService
  ) {}

  ngOnInit(): void {
    this.idUsuario = this.getUserId();
    this.setFechas();
  }

  private getUserId(): number {
    return this.sessionService.parseUsuario(
      this.sessionService.getCurrentUser()!!
    ).id_perfil;
  }

  private setFechas(): void {
    if (this.config) {
      if (this.config.data.fechas)
        this.fechas = this.config.data.fechas.map((f: Date) =>
          formatDate(f, 'dd-MM-yyyy', 'es-UY')
        );
      if (this.config.data.monedas) this.monedas = this.config.data.monedas;
      if (this.config.data.todasLasFechas)
        this.todasLasFechas = this.config.data.todasLasFechas.map((f: Date) =>
          formatDate(f, 'dd-MM-yyyy', 'es-UY')
        );
    }
  }

  eliminarLista(fecha: string) {
    this.eliminarFechas.push(fecha);
  }

  cancelarAgregar(): void {
    this.mostrarBotones = true;
    const agregar = document.querySelector('.listas--agregar');
    if (agregar) {
      agregar.classList.add('hide');
      agregar.classList.remove('show');
    }

    this.fileUpload.clear();
    this.tipoMonedaSeleccionada = 'No seleccionada';
    this.idSeleccion = -1;
    this.monedaSeleccionada = false;
    this.activeIndex = -1;
  }

  cancelarEliminar(): void {
    this.mostrarBotones = true;

    this.eliminarFechas = [];
    this.setFechas();
    const eliminar = document.querySelector('.listas--eliminar');
    if (eliminar) {
      eliminar.classList.add('hide');
      eliminar.classList.remove('show');
    }
  }

  showEliminar(): void {
    this.mostrarBotones = false;
    const eliminar = document.querySelector('.listas--eliminar');
    const agregar = document.querySelector('.listas--agregar');

    if (eliminar) {
      eliminar.classList.add('show');
      eliminar.classList.remove('hide');
    }

    if (agregar) {
      agregar.classList.add('hide');
      agregar.classList.remove('show');
    }
  }

  showAgregar(): void {
    this.mostrarBotones = false;
    const eliminar = document.querySelector('.listas--eliminar');
    const agregar = document.querySelector('.listas--agregar');

    if (agregar) {
      agregar.classList.add('show');
      agregar.classList.remove('hide');
    }

    if (eliminar) {
      eliminar.classList.add('hide');
      eliminar.classList.remove('show');
    }
  }

  async deleteListaPrecios(): Promise<void> {
    try {
      await lastValueFrom(this.ckSrvc.deleteFechaPrecio(this.eliminarFechas));
      this.dialogRef.close('Eliminado');
    } catch {
      this.mostrarMensaje(
        'Hubo un error al intentar eliminar alguna lista de precios',
        'Error',
        this.errorIcon
      );
    }
  }

  seleccionarArchivo(event: any): void {
    if (event && event.files) {
      const fileList: FileList = event.files;

      for (let i = 0; i < fileList.length; i++) {
        const file: File = fileList[i];
        if (!this.isFileSelected(file)) this.files.push(file);
        else
          this.mostrarMensaje(
            `El archivo ${file.name} ya fue cargado.`,
            'Archivo duplicado',
            this.errorIcon
          );
      }
    }
  }

  private isFileSelected(file: File): boolean {
    return this.files.some((f) => f.name === file.name);
  }

  onClear(): void {
    this.files = [];
    this.fechasDuplicadas = [];
    this.fechasDistintas = [];
  }

  eliminarArchivo(event: any): void {
    if (event && event.file) {
      const fileToRemove: File = event.file;
      this.files = this.files.filter((f) => f != fileToRemove);
    }
  }

  public agregarNuevosPrecios(): void {
    const promises: Promise<void>[] = [];

    this.files.forEach((f) => {
      promises.push(this.processFile(f));
    });

    Promise.all(promises)
      .then(async () => {
        this.insertarPrecios.forEach((i) => {
          if (
            this.todasLasFechas.find(
              (f) => f == formatDate(i.fecha_Produccion, 'dd-MM-yyyy', 'es-UY')
            ) != undefined
          ) {
            if (
              this.fechasDuplicadas.find(
                (fd) =>
                  fd == formatDate(i.fecha_Produccion, 'dd-MM-yyyy', 'es-UY')
              ) == undefined
            )
              this.fechasDuplicadas.push(
                formatDate(i.fecha_Produccion, 'dd-MM-yyyy', 'es-UY')
              );
          } else this.fechasDistintas.push(i);
        });

        if (this.fechasDuplicadas.length > 0) {
          const fs = this.fechasDuplicadas.join(' ');
          this.mostrarMensaje(
            `Estas fechas ya están cargadas: ${fs}`,
            'Fechas duplicadas',
            this.errorIcon
          );
          this.fechasDuplicadas = [];
          this.fechasDistintas = [];
          this.insertarPrecios = [];
        }

        if (this.fechasDistintas.length > 0) {
          try {
            await lastValueFrom(this.ckSrvc.insertarListaPrecios(this.fechasDistintas));
              
            await this.mostrarMensaje(
              'Las listas de precios se agregaron correctamente.',
              'Todo bien',
              this.okIcon
            );
            this.dialogRef.close('Agregado');
            this.dialogRef.destroy();

            if (this.errores.length > 0) {
            }
          } catch (error) {
            this.hayErrores = true;
            this.mostrarMensaje(
              'Verificar lista de precios.',
              'Se produjo un error',
              this.errorIcon
            );
            console.log(error);
          }
        }
      })
      .catch((error) => {
        this.hayErrores = true;
        this.mostrarMensaje(
          'Verificar lista de precios.',
          'Se produjo un error',
          this.errorIcon
        );
        console.log(error);
      });
  }

  private processFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const handleError = (message: string, title: string) => {
        this.mostrarMensaje(message, title, this.errorIcon);
        reject();
      };

      let fileReader: FileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = () => {
        let data = fileReader.result;
        let workbook = xls.read(data, { type: 'array' });
        const sheets = workbook.SheetNames;
        const sheet = workbook.Sheets[sheets[0]];
        this.preciosData = xls.utils.sheet_to_json(sheet, { raw: true });
        
        if (this.preciosData) {
            this.insertarPrecios = [];
              this.preciosData.forEach((info: PrecioCarga) => {
                  const codProdValue: string = info.codigo;
                  const fechaProduccion: Date = this.convertirSerialAFecha(info.fecha);
                  if (codProdValue != undefined) {
                    if (this.insertarPrecios.find(p => p.codigo_Producto === codProdValue && this.comSrvc.formatearFecha(p.fecha_Produccion) === this.comSrvc.formatearFecha(fechaProduccion)) != undefined)
                      this.errores.push(
                        `El código ${codProdValue} para la fecha ${fechaProduccion} se encuentra más de una vez. Se guardó la primera ocurrencia.`
                      );
                    else {
                      const precioValue = info.precio;
                      const precio = precioValue != undefined && precioValue != 0 ? precioValue : 0;
                      if (precio != 0) this.agregarPrecio(info);
                    }
                  }
              });
              resolve();
        } else
          handleError(
            `Hubo un error al procesar el archivo ${file.name}.`,
            'Error'
          );
      };
    });
  }

  private convertirSerialAFecha(serial: number): Date {
    const excelEpoch = new Date(1900, 0, 1);
    const daysOffset = serial - 1;
    const actualDate = new Date(
      excelEpoch.getTime() + daysOffset * 24 * 60 * 60 * 1000
    );

    if (serial >= 60) actualDate.setDate(actualDate.getDate() - 1);
    return actualDate;
  }

  private agregarPrecio(info: PrecioCarga): void {
    this.insertarPrecios.push({
      codigo_Producto: info.codigo,
      fecha_Produccion: this.convertirSerialAFecha(info.fecha),
      id_Moneda: this.idSeleccion,
      precio_Tonelada: info.precio,
      fecha_Registro: new Date(),
      id_Usuario: this.idUsuario,
    });
  }

  onFileClick(file: File): void {
    console.log(file.name);
  }

  mostrarMensaje(mensaje: string, header: string, icon: string): Promise<void> {
    return new Promise<void>((resolve) => {
      this.confirmationService.confirm({
        header: header,
        message: mensaje,
        icon: icon,
        rejectVisible: false,
        dismissableMask: true,
        closeOnEscape: true,
        acceptLabel: 'Aceptar',
        accept: () => {
          resolve();
        },
      });
    });
  }
}
