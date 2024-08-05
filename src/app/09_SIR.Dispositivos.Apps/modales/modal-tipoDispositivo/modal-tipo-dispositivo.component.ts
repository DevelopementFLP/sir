import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TipoDispositivoDTO } from '../../Interfaces/TipoDispositivoDTO';
import { TiposDispositivosService } from '../../Services/TiposDispositivos.service';

import { UtilidadesService } from '../../Utilidades/UtilidadesService.service';


@Component({
  selector: 'app-modal-tipo-dispositivo',
  templateUrl: './modal-tipo-dispositivo.component.html',
  styleUrls: ['./modal-tipo-dispositivo.component.css']
})
export class ModalTipoDispositivoComponent {

  formularioTipoDispositivo: FormGroup;
  tituloDeAccion: string = "Agregar";
  botonDeAccion: string = "Guardar";

  constructor(
    private modalAcual: MatDialogRef<ModalTipoDispositivoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosTiposDispositivos: TipoDispositivoDTO,
    private fb: FormBuilder,
    private _formatoTipoDispositivo: TiposDispositivosService,
    private _utilidadesService: UtilidadesService
  )
    {
      this.formularioTipoDispositivo = fb.group({
        nombre: ['', Validators.required],
        comandoInicio: ['', Validators.required],
        comandoFin: ['', Validators.required]
      }) 

      if(datosTiposDispositivos != null)
      {
        this.tituloDeAccion = "Editar",
        this.botonDeAccion = "Actualizar"
      }
    }

  ngOnInit(): void {
    if(this.datosTiposDispositivos != null )
    {
      this.formularioTipoDispositivo.patchValue(
        {
          nombre: this.datosTiposDispositivos.nombre,
          comandoInicio: this.datosTiposDispositivos.comandoInicio,
          comandoFin: this.datosTiposDispositivos.comandoFin,
        });
    }
  }

  guardarEditar_TipoDispositivo(){

    const _tipoDispositivo: TipoDispositivoDTO = {
      idTipo : this.datosTiposDispositivos == null ? 0 : this.datosTiposDispositivos.idTipo,
      nombre : this.formularioTipoDispositivo.value.nombre,
      comandoInicio: this.formularioTipoDispositivo.value.comandoInicio,      
      comandoFin: this.formularioTipoDispositivo.value.comandoFin,
    }
    

    if(this.datosTiposDispositivos == null){

      this._formatoTipoDispositivo.createTiposDispositivo(_tipoDispositivo).subscribe({
        next: (data) =>{
          if(data.esCorrecto){
            this._utilidadesService.mostrarAlerta("El Tipo fue registrado","Exito");
            this.modalAcual.close("true")
          }else
            this._utilidadesService.mostrarAlerta("No se pudo registrar el Tipo","Error")
        },
        error:(e) => {}
      })

    }else{

      this._formatoTipoDispositivo.editTiposDispositivo(_tipoDispositivo).subscribe({
        next: (data) =>{
          if(data.esCorrecto){
            this._utilidadesService.mostrarAlerta("El Tipo fue editado","Exito");
            this.modalAcual.close("true")
          }else
            this._utilidadesService.mostrarAlerta("No se pudo editar el Tipo","Error")
        },
        error:(e) => {}
      })
    }
  }
}
