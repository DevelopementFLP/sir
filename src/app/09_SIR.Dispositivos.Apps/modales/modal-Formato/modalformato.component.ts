
import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormatoDispositivoDTO } from '../../Interfaces/FormatosDTO';
import { FormatoService } from '../../Services/FormatoService.service';

import { UtilidadesService } from '../../Utilities/UtilidadesService.service';


@Component({
  selector: 'app-modalformato',
  templateUrl: './modalformato.component.html',
  styleUrls: ['./modalformato.component.css']
})
export class ModalformatoComponent {

  formularioFormatos: FormGroup;
  tituloDeAccion: string = "Agregar";
  botonDeAccion: string = "Guardar";

  constructor(
    private modalAcual: MatDialogRef<ModalformatoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosFormato: FormatoDispositivoDTO,
    private fb: FormBuilder,
    private _formatoServicio: FormatoService,
    private _utilidadesService: UtilidadesService
  )
    {
      this.formularioFormatos = fb.group({
        substringDesde: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        substringHasta: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        errorLectura: ['1', Validators.required]
      }) 

      if(datosFormato != null)
      {
        this.tituloDeAccion = "Editar",
        this.botonDeAccion = "Actualizar"
      }
    }

  ngOnInit(): void {
    if(this.datosFormato != null )
    {
      this.formularioFormatos.patchValue(
        {
          substringDesde: this.datosFormato.substringDesde,
          substringHasta: this.datosFormato.substringHasta,
          errorLectura: this.datosFormato.errorLectura,
        });
    }
  }

  guardarEditar_Formato(){

    const _formato: FormatoDispositivoDTO = {
      idFormato : this.datosFormato == null ? 0 : this.datosFormato.idFormato,
      substringDesde : this.formularioFormatos.value.substringDesde,
      substringHasta: this.formularioFormatos.value.substringHasta,      
      errorLectura: this.formularioFormatos.value.errorLectura,
    }

    if(this.datosFormato == null){

      this._formatoServicio.createFormatoDispositivo(_formato).subscribe({
        next: (data) =>{
          if(data.esCorrecto){
            this._utilidadesService.mostrarAlerta("El Formato fue registrado","Exito");
            this.modalAcual.close("true")
          }else
            this._utilidadesService.mostrarAlerta("No se pudo registrar el Formato","Error")
        },
        error:(e) => {}
      })

    }else{

      this._formatoServicio.editFormatoDispositivo(_formato).subscribe({
        next: (data) =>{
          if(data.esCorrecto){
            this._utilidadesService.mostrarAlerta("El Formato fue editado","Exito");
            this.modalAcual.close("true")
          }else
            this._utilidadesService.mostrarAlerta("No se pudo editar el Formato","Error")
        },
        error:(e) => {}
      })
    }
  }
}
