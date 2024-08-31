
import { ConfiguracionesDTO } from 'src/app/10_Sir.Faena.Apps/Interfaces/ConfiguracionesDTO';

import { Component, Inject } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AbastoService } from 'src/app/10_Sir.Faena.Apps/Services/AbastoService.service';

import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilidades/UtilidadesService.service';
import { LecturaDeAbastoDTO } from 'src/app/10_Sir.Faena.Apps/Interfaces/LecturaDeAbastoDTO';
import { GetInformacionService } from 'src/app/10_Sir.Faena.Apps/helpers/Data-Local-Storage/getInformacion.service';
import { disableDebugTools } from '@angular/platform-browser';


@Component({
  selector: 'app-modal-abasto',
  templateUrl: './modal-abasto.component.html',
  styleUrls: ['./modal-abasto.component.css']
})
export class ModalAbastoComponent {

  //Configuraciones
  public usuarioLogueado: string = "";
  public parametrosDeConfiguracion: ConfiguracionesDTO[] = []; 
  public correlativoDeLectura: string = "";
  public pesoFicticio: string = "";

  //Auxiliares
  public tituloDeAccion: string = "Agregar";
  public botonDeAccion: string = "Guardar";
  public lecturaSinEtiqueta: string[] = [];

  public lecturaQRInput: number | null = null;
  public ladoSeleccionado: number | null = null;
  public ordinalInput: number | null = null;
  public fechaDeFaena: Date | null = null;

  public codigoQrGenerado: string = "";

  constructor(
    private modalAcual: MatDialogRef<ModalAbastoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosFormato: LecturaDeAbastoDTO,
    private fb: FormBuilder,
    private _abastoService: AbastoService,
    private _utilidadesServicicio: UtilidadesService,
    private _configuracionService: GetInformacionService
  )
  {
    if(datosFormato != null)
    {
      this.tituloDeAccion = "Editar",
      this.botonDeAccion = "Actualizar"
    }
  }

  // Obtener configuraciones desde el helper
  async GetConfiguraciones() {
    try {
      this.parametrosDeConfiguracion = await this._configuracionService.obtenerConfiguraciones();
      this.loadConfiguraciones();
      this.setConfiguraciones();
    } catch (e) {
      // El error lo maneje en el helper
    }
  }

   // Cargar configuraciones desde localStorage o API
   loadConfiguraciones() {
    try {
      this.parametrosDeConfiguracion = this._configuracionService.cargarConfiguraciones();
      const usuarioLogueado = JSON.parse(localStorage.getItem('actualUser') || '{}');
      this.usuarioLogueado = usuarioLogueado.nombre_usuario;
      this.setConfiguraciones();
    } catch (e) {
      this.GetConfiguraciones();
    }
  }
  
  setConfiguraciones() {
    this.correlativoDeLectura = this.parametrosDeConfiguracion.find(p => p.idConfiguracion == 1)?.parametroDeConfiguracion!;
    this.pesoFicticio = this.parametrosDeConfiguracion.find(p => p.idConfiguracion == 2)?.parametroDeConfiguracion!;
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
    if (this.fechaDeFaena && this.ladoSeleccionado !== null && this.ordinalInput !== null) {        
      const fechaStr = this.fechaDeFaena.toISOString().split('T')[0].replace(/-/g, ''); // Formato YYYYMMDD
      const lado = this.ladoSeleccionado;
      const ordinalStr = this.ordinalInput.toString().padStart(4, '0'); // Completar 4 digitos con 0
      this.codigoQrGenerado = `${fechaStr}${this.correlativoDeLectura}${this.lecturaQRInput}${fechaStr}${ordinalStr}${lado}${this.pesoFicticio}`;
    }
    return this.codigoQrGenerado    
  }

  async guardarLecturaSinEtiqueta(){     
      const numeracionManual = this.generarCodigoDeQR()
      const ladoDeMedia = this.obtenerTextoLado()
      const fechaFormateada = this.formatearFecha(this.fechaDeFaena);

      if(this.ordinalInput != null && this.fechaDeFaena != null && this.ladoSeleccionado != null) {
        const fechaConFormato = this.fechaDeFaena!.toISOString().split('T')[0].replace(/-/g, '');
        const lecturaExiste = fechaConFormato + this.ordinalInput!.toString().padStart(4, '0') + this.ladoSeleccionado
          if(lecturaExiste){
            try {
              const respuesta = await this._abastoService.GetLecturaDeAbastoFiltrada(lecturaExiste).toPromise();
              if(respuesta!.resultado){
                this._utilidadesServicicio.mostrarAlerta('Ya existe una media ingresada con esos datos', 'Error');
                return;
              }
            } catch (error) {
              console.log(error)             
            }
          }            
        
        this._abastoService.createLecturaDeMediaAbastoManual(numeracionManual, ladoDeMedia, this.usuarioLogueado ,fechaFormateada, this.ordinalInput).subscribe({
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
    // const horas = String(fecha.getHours()).padStart(2, '0');
    // const minutos = String(fecha.getMinutes()).padStart(2, '0');
    // const segundos = String(fecha.getSeconds()).padStart(2, '0');

    return `${anio}-${mes}-${dia} `;
    // ${horas}:${minutos}:${segundos}
  }


  ngOnInit(): void {
    this.loadConfiguraciones();
  }
}
