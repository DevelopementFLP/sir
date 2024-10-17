import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UbicacionDispositivoDTO } from '../../Interfaces/UbicacionDispositivoDTO';
import { UbicacionesService } from '../../Services/UbicacionesService.service';
import { UtilidadesService } from '../../Utilities/UtilidadesService.service';



@Component({
  selector: 'app-modal-ubicacion',
  templateUrl: './modal-ubicacion.component.html',
  styleUrls: ['./modal-ubicacion.component.css']
})
export class ModalUbicacionComponent {

  formularioUbicaciones: FormGroup;
  tituloDeAccion: string = "Agregar";
  botonDeAccion: string = "Guardar";

  constructor(
    private modalAcual: MatDialogRef<ModalUbicacionComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUbicacion: UbicacionDispositivoDTO,
    private fb: FormBuilder,
    private _ubicacionesServicio: UbicacionesService,
    private _utilidadesServicio: UtilidadesService
  )
    {
      this.formularioUbicaciones = fb.group({
        nombre: ['', Validators.required],
        descripcion: ['', Validators.required],
        activo: ['', Validators.required]
      }) 

      if(datosUbicacion != null)
      {
        this.tituloDeAccion = "Editar",
        this.botonDeAccion = "Actualizar"
      }
    }

  ngOnInit(): void {
    if(this.datosUbicacion != null )
    {
      this.formularioUbicaciones.patchValue(
        {
            nombre: this.datosUbicacion.nombre,
            descripcion: this.datosUbicacion.descripcion,
            activo: this.datosUbicacion.activo
        });
    }
  }

  guardarEditar_Ubicacion(){

    const _ubicacion: UbicacionDispositivoDTO = {
      idUbicacion : this.datosUbicacion == null ? 0 : this.datosUbicacion.idUbicacion,
      nombre : this.formularioUbicaciones.value.nombre,
      descripcion: this.formularioUbicaciones.value.descripcion,      
      activo: this.formularioUbicaciones.value.activo,
    }
    
    if(this.datosUbicacion == null){

      this._ubicacionesServicio.createUbicacionDispositivo(_ubicacion).subscribe({
        next: (data) =>{
          if(data.esCorrecto){
            this._utilidadesServicio.mostrarAlerta("La Ubicacion fue registrado","Exito");
            this.modalAcual.close("true")
          }else
            this._utilidadesServicio.mostrarAlerta("No se pudo registrar la Ubicacion","Error")
        },
        error:(e) => {}
      })

    }else{

      this._ubicacionesServicio.editUbicacionDispositivo(_ubicacion).subscribe({
        next: (data) =>{
          if(data.esCorrecto){
            this._utilidadesServicio.mostrarAlerta("La Ubicacion fue editado","Exito");
            this.modalAcual.close("true")
          }else
            this._utilidadesServicio.mostrarAlerta("No se pudo editar la Ubicacion","Error")
        },
        error:(e) => {}
      })
    }
  }
}
