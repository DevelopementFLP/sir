import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FtImagenesService } from '../../../service/CreacionDeFichaTecnicaServicios/FtPlantilla/FtImagenes.service';

import { FtImagenesPlantillaDTO } from '../../../interface/CreacionDeFichaTecnicaInterface/FtImagenesDTO';

import Swal from 'sweetalert2';

@Component({
  selector: 'modal-editar-foto-ficha-tecnica',
  templateUrl: './modal-editar-foto-ficha-tecnica.component.html',
  styleUrls: ['./modal-editar-foto-ficha-tecnica.component.css']
})
export class ModalEditarFotoFichaTecnicaComponent {

  @Input() codigoProducto: string = ''; // Recibe el código de producto
  @Input() modalAbierto: boolean = false; 
  public imagenes: FtImagenesPlantillaDTO[] = []; // Array para almacenar las imágenes cargadas

  public modalConfirmacionVisible: boolean = false; // Controla la visibilidad del modal de confirmación
  public imagenSeleccionada: FtImagenesPlantillaDTO | null = null; // Imagen seleccionada para editar

  constructor(
    private _FtImagenesService: FtImagenesService,
  ) { }


  ngOnChanges(): void {
    if ( this.modalAbierto) {

      if (this.codigoProducto) {
        this.limpiarImagenes();
        this.BuscarImagenPorCodigo(this.codigoProducto); 
      }
    }
  }

  // Método para buscar las imágenes por código de producto
  public async BuscarImagenPorCodigo(codigoDeProducto: string): Promise<void> {
    try {
      // Obtener el código de producto hasta el primer espacio
      const codigoCorto = codigoDeProducto.split(' ')[0];
  
      // Realizar la solicitud con el código recortado
      const response = await this._FtImagenesService.BuscarImagenPorProducto(codigoCorto).toPromise();
  
      if (response && response.esCorrecto && response.resultado) {
        this.imagenes = response.resultado; // Asigna las imágenes al array
      } else {
        this.imagenes = []; // Si no hay imágenes, se resetea el array
      }
    } catch (error) {
      console.error("Error al buscar las imágenes: ", error);
      this.imagenes = []; // Resetea las imágenes en caso de error
    }
  }
  


  public limpiarImagenes(){
    this.imagenes = []; // Resetea las imágenes
  }

  public EditarImagen(imagen: FtImagenesPlantillaDTO): void {
    // Llama al método para abrir el selector de archivos
    this.AbrirSelectorDeArchivos(imagen);
  }
  

  public AbrirSelectorDeArchivos(imagen: FtImagenesPlantillaDTO): void {

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*'; 
    input.click(); 
  
    input.onchange = (event: any) => {
      const archivoSeleccionado = event.target.files[0];
      if (archivoSeleccionado) {
        this.SubirImagen(imagen, archivoSeleccionado);
      }
    };
  }
  
  
   // Subir la imagen
   public async SubirImagen(imagen: FtImagenesPlantillaDTO, archivo: File): Promise<void> {
    // Enviar la imagen junto con los datos al servicio
    try {
      const response = await this._FtImagenesService.EditarImagenFichaTecnica(
        imagen.idFoto,          // El código del producto
        imagen.seccionDeImagen, // La sección de la imagen
        archivo                 // La nueva imagen seleccionada
      ).toPromise();

      if (response && response.esCorrecto) {
        // Recargar las imágenes después de la actualización
        this.BuscarImagenPorCodigo(this.codigoProducto);

        // Cerrar el modal
        this.modalAbierto = false;
      } else {
        console.error('Error al actualizar la imagen.');
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  }
  
}
