import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CargaKosherService } from '../../services/carga-kosher.service';
import { ConfProducto } from '../../Interfaces/ConfProducto.interface';
import { lastValueFrom } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Dropdown } from 'primeng/dropdown';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-add-codigos',
  templateUrl: './add-codigos.component.html',
  styleUrls: ['./add-codigos.component.css'],
  providers: [ConfirmationService]
})
export class AddCodigosComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('codigoKosherD', {static: false}) codigoKosherDrop!: Dropdown;
  @ViewChild('clasificacionD', {static: false}) clasificacionDrop!: Dropdown;
  @ViewChild('markD', {static: false}) markDrop!: Dropdown;
  @ViewChild('especieD', {static: false}) especieDrop!: Dropdown;
  @ViewChild('tipoProductoD', {static: false}) tipoProductoDrop!: Dropdown;
  @ViewChild('codigoInp', {static: false}) codigoInp!: ElementRef;
  @ViewChild('nombreInp', {static: false}) nombreInp!: ElementRef;

  txtSeleccion: string = 'Seleccione';

  codigoI!: HTMLInputElement;
  nombre!: HTMLParagraphElement;
  ckDrop!: Dropdown;
  clasDrop!: Dropdown;
  mkDrop!: Dropdown;
  espDrop!: Dropdown;
  tpDrop!: Dropdown;

  codigosKosher: string[] = [];
  clasificacionKosher: string[] = [];
  markKosher: string[] = [];
  especie: string[] = []
  tipoProducto: string[] = [];
  codigos: string[] = [];

  nuevosCodigos: ConfProducto[] = [];

  isAdding: boolean = false;

  errorIcon: string = 'pi pi-exclamation-triangle';
  okIcon: string = 'pi pi-check';

  // ngModels para las opciones de los dropdowns
  ckSelected: string = '';
  clasSelected: string = '';
  markSelected: string = '';
  espSelected: string = '';
  tipoSelected: string = '';

  constructor(
    private cargaKosherSrv: CargaKosherService,
    private config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    public confirmationSrvc: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.setData();
  }

  ngAfterViewInit(): void {
    this.codigoI = this.codigoInp.nativeElement as HTMLInputElement;
    this.nombre = this.nombreInp.nativeElement as HTMLParagraphElement;
    this.ckDrop = this.codigoKosherDrop as Dropdown;
    this.clasDrop = this.clasificacionDrop as Dropdown;
    this.mkDrop = this.markDrop as Dropdown;
    this.espDrop = this.especieDrop as Dropdown;
    this.tpDrop = this.tipoProductoDrop as Dropdown;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }

  private setData(): void {
    if(this.config && this.config.data) {
      if(this.config.data.codigosKosher) {
        this.codigosKosher = this.config.data.codigosKosher;
        if(this.codigosKosher[0] != this.txtSeleccion)
          this.codigosKosher.unshift(this.txtSeleccion);
      }
      if(this.config.data.clasificacionKosher) {
        this.clasificacionKosher = this.config.data.clasificacionKosher;
        if(this.clasificacionKosher[0] != this.txtSeleccion)
          this.clasificacionKosher.unshift(this.txtSeleccion);
      }
      if(this.config.data.markKosher) {
        this.markKosher = this.config.data.markKosher;
        if(this.markKosher[0] != this.txtSeleccion)
          this.markKosher.unshift(this.txtSeleccion);
      }
      if(this.config.data.especie) {
        this.especie = this.config.data.especie;
        if(this.especie[0] != this.txtSeleccion)
          this.especie.unshift(this.txtSeleccion);
      }
      if(this.config.data.tipoProducto) {
        this.tipoProducto = this.config.data.tipoProducto;
        if(this.tipoProducto[0] != this.txtSeleccion)
          this.tipoProducto.unshift(this.txtSeleccion);
      }
      if(this.config.data.codigos) {
        this.codigos = this.config.data.codigos;
      }
    }
  }

  async addCodigos(): Promise<void> {
    await lastValueFrom(this.cargaKosherSrv.insertConfProductos(this.nuevosCodigos))
      .then(() => {
        this.mostrarMensaje("Los códigos se agregaron correctamente.", "Todo bien", this.okIcon, () => this.destruirDialogo(this.dialogRef));
      })
      .catch(error => {
        this.mostrarMensaje("Hubo un error al intentar agregar los códigos. Inténtelo nuevamente.", "Error", this.errorIcon);
      });
  }

  async getNombreProducto(): Promise<void> {
      const codigo: string = this.codigoI.value;

      if(codigo != '') {
        if(this.estaCodigoEnPadron(codigo)) {
          this.mostrarMensaje(`El código '${codigo}' ya está en el padrón.`, 'Código duplicado', this.errorIcon); 
          return; 
        } else {
          if(this.estaCodigoEnNuevo(codigo)) {
            this.mostrarMensaje(`El código '${codigo}' ya se va a agregar.`, 'Código duplicado', this.errorIcon);
            return;
          }
        }

        try {
          var nombre;
          await lastValueFrom(this.cargaKosherSrv.getNombreProducto(this.codigoI.value)).then(result => {
            nombre = result[0];
            this.isAdding = true;
          })
          .catch((error)=>{
          });
          if(nombre) {
            this.nombre.innerText = nombre;
          }
        } catch {
        }
      }
  }
  
  onDeleteCodigo(codigo: ConfProducto) {
    this.nuevosCodigos.splice(this.nuevosCodigos.indexOf(codigo), 1);
  }

  agregarCodigo(): void {
   if(this.sonDatosValidos()) {
      const producto: ConfProducto = {
        codigoProducto: this.codigoI.value,
        nomProducto: this.nombre.innerText,
        codigoKosher: this.ckDrop.value,
        clasificacionKosher: this.clasDrop.value,
        markKosher: this.markDrop.value,
        especie: this.espDrop.value,
        tipoProducto: this.tpDrop.value
      };

      this.nuevosCodigos.push(producto);
      this.isAdding = false;

      this.limpiarCampos();
      this.codigoI.focus();
    } else {
      this.mostrarMensaje('Por favor establezca las propiedades para este código.', 'Faltan propiedades', this.errorIcon);
    }
  }

  quitarCodigo(): void {
    this.limpiarCampos();
    this.isAdding = false;
  }

  cancelar(): void {
   this.destruirDialogo(this.dialogRef);
  }

  private sonDatosValidos(): boolean {
    return  this.codigoI.value != '' &&
            this.nombre.innerText != '' &&
            this.ckDrop.value != this.txtSeleccion &&
            this.clasDrop.value != this.txtSeleccion &&
            this.mkDrop.value != this.txtSeleccion &&
            this.espDrop.value != this.txtSeleccion &&
            this.tpDrop.value != this.txtSeleccion;
  }

  private limpiarCampos(): void {
    this.codigoI.value = ''; 
    this.nombre.innerText = '';

    this.ckSelected = this.txtSeleccion;
    this.clasSelected = this.txtSeleccion;
    this.markSelected = this.txtSeleccion;
    this.espSelected = this.txtSeleccion;
    this.tipoSelected = this.txtSeleccion;
  }

  private estaCodigoEnNuevo(codigo: string): boolean {
    return this.nuevosCodigos.find(nc => nc.codigoProducto == codigo) != undefined;
  }

  private estaCodigoEnPadron(codigo: string): boolean {
    return this.codigos.find(c => c === codigo) != undefined;
  }

  private mostrarMensaje(mensaje: string, header: string, icon: string, funct: Function = () => {}): void {
    this.confirmationSrvc.confirm({
      header: header,
      message: mensaje,
      icon: icon,
      rejectVisible: false,
      dismissableMask: true,
      closeOnEscape: true,
      acceptLabel: 'Aceptar',
      accept: funct,
    });
  }

  private destruirDialogo(dialog: DynamicDialogRef, accion: string | undefined = undefined): void {
    dialog.close(accion);
    dialog.destroy();
  }
}
