import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmbarqueConfig } from '../../Interfaces/EmbarqueConfig.interface';


@Component({
  selector: 'app-embarque-config',
  templateUrl: './embarque-config.component.html',
  styleUrls: ['./embarque-config.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmbarqueConfigComponent implements OnInit {

  configForm!: FormGroup;
  embarqueConfigData: EmbarqueConfig | undefined = undefined;
  minDate: Date = new Date(1,1,2020);
  maxDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig
    ) {}

  ngOnInit(): void {
    this.setConfigFormFields();
    this.loadConfigData();
  }

  //#region Form configuration
  private setConfigFormFields(): void {
    this.configForm = this.fb.group({
      destinatarios: ['', Validators.required],
      nroVenta: ['', Validators.required],
      barco: ['', Validators.required],
      factura: ['', Validators.required],
      carpeta: ['', Validators.required],
      comisionSFOB: ['', Validators.required],
      comisionUSDTONS: ['', Validators.required],
      shippingMark: ['', Validators.required],
      fechaBL: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if(this.configForm.valid) {
      this.setEmbarqueConfigData();
      this.ref.close(this.embarqueConfigData);
    } else {
      this.validarCampos(this.configForm)
    }
  }

   private validarCampos(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if(control instanceof FormGroup)
        this.validarCampos(control);
      else {
        this.validarCampo(control);
      }
      });
  }

  validarCampo(control: AbstractControl<any, any> | null): void {
    control?.markAsTouched({onlySelf: true});
    control?.markAsDirty({onlySelf: true});
  }

  cerrarConfig(): void {
    this.ref.close();
  }

  private setEmbarqueConfigData(): void {
    var ctrl = this.configForm.controls;
    this.embarqueConfigData = {
      idCarga: 0,
      attn: ctrl['destinatarios'].value,
      numeroVenta: ctrl['nroVenta'].value,
      barco: ctrl['barco'].value,
      factura: ctrl['factura'].value,
      carpeta: ctrl['carpeta'].value,
      comision: {
        comisionSFOB:  ctrl['comisionSFOB'].value,
        comisionUSDTONS: ctrl['comisionUSDTONS'].value,
      },
      shippingMark: ctrl['shippingMark'].value,
      fechaBL: ctrl['fechaBL'].value
    }
  }

  private loadConfigData(): void {
    if(this.config.data.config) {
      this.embarqueConfigData = this.config.data.config as EmbarqueConfig;
    }

    if (this.embarqueConfigData) {
      this.configForm.patchValue({
        destinatarios: this.embarqueConfigData.attn,
        nroVenta: this.embarqueConfigData.numeroVenta,
        barco: this.embarqueConfigData.barco,
        factura: this.embarqueConfigData.factura,
        carpeta: this.embarqueConfigData.carpeta,
        comisionSFOB:  this.embarqueConfigData.comision.comisionSFOB,
        comisionUSDTONS: this.embarqueConfigData.comision.comisionUSDTONS,
        shippingMark: this.embarqueConfigData.shippingMark,
        fechaBL: this.embarqueConfigData.fechaBL
  });
  }
  //#endregion

  }
  
}