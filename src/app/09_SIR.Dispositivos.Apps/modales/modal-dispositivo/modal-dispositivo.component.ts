import { Component, Inject , OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

//Modelos
import { DispositivoDTO } from '../../Interfaces/DispositivoDTO';
import { DispositivosService } from '../../Services/DispositivoService.service';

//Modelos Externos
import { FormatoDispositivoDTO } from '../../Interfaces/FormatosDTO';
import { FormatoService } from '../../Services/FormatoService.service';
import { UbicacionDispositivoDTO } from '../../Interfaces/UbicacionDispositivoDTO';
import { UbicacionesService } from '../../Services/UbicacionesService.service';
import { TipoDispositivoDTO } from '../../Interfaces/TipoDispositivoDTO';
import { TiposDispositivosService } from '../../Services/TiposDispositivos.service';

import { UtilidadesService } from '../../Utilities/UtilidadesService.service';

@Component({
  selector: 'app-modal-dispositivo',
  templateUrl: './modal-dispositivo.component.html',
  styleUrls: ['./modal-dispositivo.component.css']
})
export class ModalDispositivoComponent implements OnInit {

  formularioDispositivo: FormGroup;
  tituloDeAccion: string = "Agregar";
  botonDeAccion: string = "Guardar";
  //--------
  ListaFormatos: FormatoDispositivoDTO[] = []; 
  listaDeUbicaciones: UbicacionDispositivoDTO[] = [];
  listaDeTiposDispositivos: TipoDispositivoDTO[] = [];

  constructor(
    private modalAcual: MatDialogRef<ModalDispositivoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosDispositivo: DispositivoDTO,
    private fb: FormBuilder,
    private _dispositivoServicio: DispositivosService,
    private _formatoServicio: FormatoService,
    private _ubicacionesService: UbicacionesService,
    private _tipoDispositivoService: TiposDispositivosService,
    private _utililidadesService: UtilidadesService
  )
    {
      this.formularioDispositivo = fb.group({
        nombre: ['', Validators.required],
        ip: ['', Validators.required],
        puerto: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        descripcion: ['', Validators.required],
        activo: ['', Validators.required],
        idTipo: ['', Validators.required],
        idUbicacion: ['', Validators.required],
        idFormato: ['', Validators.required]
      }) 

      if(datosDispositivo != null)
      {
        this.tituloDeAccion = "Editar",
        this.botonDeAccion = "Actualizar"
      }

      this._formatoServicio.getFormatoDispositivo().subscribe({
        next: (data) => {
          if(data.resultado) this.ListaFormatos = data.resultado
        },
        error:(e) =>{}
      })

      this._ubicacionesService.getUbicacionDispositivo().subscribe({
        next: (data) => {
          if(data.resultado) this.listaDeUbicaciones = data.resultado
        },
        error:(e) =>{}
      })

      this._tipoDispositivoService.getTiposDispositivo().subscribe({
        next: (data) => {
          if(data.resultado) this.listaDeTiposDispositivos = data.resultado
          console.log(data.resultado)
        },
        error:(e) =>{}
      })
    }

  ngOnInit(): void {
    if(this.datosDispositivo != null )
    {
      this.formularioDispositivo.patchValue(
        {
            nombre: this.datosDispositivo.nombre,
            ip: this.datosDispositivo.ip,
            puerto: this.datosDispositivo.puerto,
            descripcion: this.datosDispositivo.descripcion,
            activo: this.datosDispositivo.activo ? 1 : 0,
            idTipo: this.datosDispositivo.idTipo,
            idUbicacion: this.datosDispositivo.idUbicacion,
            idFormato: this.datosDispositivo.idFormato,
        });
    }
  }

  guardarEditar_Producto(){

    const _dispositivo: DispositivoDTO = {
      idDispositivo : this.datosDispositivo == null ? 0 : this.datosDispositivo.idDispositivo,
      nombre : this.formularioDispositivo.value.nombre,
      ip: this.formularioDispositivo.value.ip,
      puerto: this.formularioDispositivo.value.puerto,
      descripcion: this.formularioDispositivo.value.descripcion,      
      activo: this.formularioDispositivo.value.activo,
      idTipo: this.formularioDispositivo.value.idTipo,
      idUbicacion: this.formularioDispositivo.value.idUbicacion,
      idFormato: this.formularioDispositivo.value.idFormato,  
     
    }

    console.log(_dispositivo)

    if(this.datosDispositivo == null){

      this._dispositivoServicio.createDispositivos(_dispositivo).subscribe({
        next: (data) =>{          
          if(data.esCorrecto){
            this._utililidadesService.mostrarAlerta("El Dispositivo fue registrado","Exito");
            this.modalAcual.close("true")
          }else
            this._utililidadesService.mostrarAlerta("No se pudo registrar el Dispositivo","Error")
        },
        error:(e) => {}
      })

    }else{

      this._dispositivoServicio.editDispositivos(_dispositivo).subscribe({
        next: (data) =>{
          if(data.esCorrecto){
            this._utililidadesService.mostrarAlerta("El Dispositivo fue editado","Exito");
            this.modalAcual.close("true")
          }else
            this._utililidadesService.mostrarAlerta("No se pudo editar el Dispositivo","Error")
        },
        error:(e) => {}
      })
    }
  }
}
