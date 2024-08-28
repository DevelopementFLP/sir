import { ConfiguracionesDTO } from 'src/app/10_Sir.Faena.Apps/Interfaces/configuracionesDTO';

import { Component, Inject } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AbastoService } from 'src/app/10_Sir.Faena.Apps/Services/AbastoService.service';

import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilidades/UtilidadesService.service';
import { LecturaDeAbastoDTO } from 'src/app/10_Sir.Faena.Apps/Interfaces/LecturaDeAbastoDTO';


@Component({
  selector: 'app-modal-abasto',
  templateUrl: './modal-abasto.component.html',
  styleUrls: ['./modal-abasto.component.css']
})
export class ModalAbastoComponent {

  //Configuraciones
  public parametrosDeConfiguracion: ConfiguracionesDTO[] = []; 
  public correlativoDeLectura: string = "";
  public numeroDeOrdinal: string = "";

  //Auxiliares
  public tituloDeAccion: string = "Agregar";
  public botonDeAccion: string = "Guardar";
  public lecturaSinEtiqueta: string[] = [];

  public ladoSeleccionado:number | null = null;
  public pesoInput:number | null = null;
  public fechaDeFaena: Date | null = null;
  public codigoQrGenerado: string = "";

  constructor(
    private modalAcual: MatDialogRef<ModalAbastoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosFormato: LecturaDeAbastoDTO,
    private fb: FormBuilder,
    private _abastoService: AbastoService,
    private _utilidadesServicicio: UtilidadesService,
  )
  {
    if(datosFormato != null)
    {
      this.tituloDeAccion = "Editar",
      this.botonDeAccion = "Actualizar"
    }
  }

  ngOnInit(): void {
    this.loadConfiguraciones();
  }

    // Cargar configuraciones desde localStorage o API
    loadConfiguraciones() {
    const configuracionDesdeLocalStorage = localStorage.getItem('configuraciones');
    if (configuracionDesdeLocalStorage) {
      this.parametrosDeConfiguracion = JSON.parse(configuracionDesdeLocalStorage);
      this.setConfiguraciones();
    }
  }
  
  setConfiguraciones() {
    this.correlativoDeLectura = this.parametrosDeConfiguracion.find(p => p.idConfiguracion == 1)?.parametroDeConfiguracion!;
    this.numeroDeOrdinal = this.parametrosDeConfiguracion.find(p => p.idConfiguracion == 2)?.parametroDeConfiguracion!;
  }

    // Obtiene y filtra las lecturas según el tipo de operación del usuario

  obtenerTextoLado(): string {
    switch (this.ladoSeleccionado) {
      case 1:
        return 'Entrada Manual Media Izquierda';
      case 2:
        return 'Entrada Manual Media Derecha';
      default:
        return 'Entrada Manual';
    }
  }

  generarCodigoDeQR(): string {     
    if (this.fechaDeFaena && this.ladoSeleccionado !== null && this.pesoInput !== null) {        
      const fechaStr = this.fechaDeFaena.toISOString().split('T')[0].replace(/-/g, ''); // Formato YYYYMMDD
      const lado = this.ladoSeleccionado;
      const pesoStr = this.pesoInput.toString().padStart(4, '0'); // Completar 4 digitos con 0
      this.codigoQrGenerado = `${fechaStr}${this.correlativoDeLectura}${fechaStr}${this.numeroDeOrdinal}${lado}${pesoStr}`;
      console.log( this.codigoQrGenerado)
    }
    return this.codigoQrGenerado    
  }

  guardarLecturaSinEtiqueta(){      
      console.log(this.fechaDeFaena)
      if(this.pesoInput != null && this.fechaDeFaena != null && this.ladoSeleccionado != null) {
      const numeracionMAnual = this.generarCodigoDeQR()
      const ladoDeMedia = this.obtenerTextoLado()

      // Obtén la fecha actual y formatea en el formato deseado
      const fechaFormateada = this.formatearFecha(this.fechaDeFaena);
      this._abastoService.createLecturaDeMediaAbastoManual(numeracionMAnual, ladoDeMedia, fechaFormateada, this.pesoInput).subscribe({
        next: (data) =>{
          if(data.esCorrecto){
            this._utilidadesServicicio.mostrarAlerta("Lectura Manual Ingresada", "Exito");
            this.generarCodigoDeQR()
            this.modalAcual.close("true")
          }else
            this._utilidadesServicicio.mostrarAlerta("No se pudo registrar la lectura", "Error")
        },
        error:(e) => {}
      })
    }else{
      this._utilidadesServicicio.mostrarAlerta("Complete todos los datos requeridos", "Error")
    }
  }

    // Función para formatear la fecha en el formato deseado
  formatearFecha(fecha : any) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Meses comienzan desde 0
    const dia = String(fecha.getDate()).padStart(2, '0');
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');

    return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
  }

}
