import { Component, OnInit } from '@angular/core';
import { FtPresentacionDeEnvaseService } from '../../service/FtPresentacionDeEnvase/FtPresentacionDeEnvase.service';
import { FtPresentacionDeEnvaseDTO } from './../../interface/PresentacionDeEnvase/FtPresentacionDeEnvaseDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-ft-seccion-tipo-presentacion-de-envase',
  templateUrl: './ft-seccion-tipo-presentacion-de-envase.component.html',
  styleUrls: ['./ft-seccion-tipo-presentacion-de-envase.component.css']
})
export class FtSeccionTipoPresentacionDeEnvaseComponent implements OnInit {

  public responsePresentacionesDTO: FtPresentacionDeEnvaseDTO[] = [];
  public presentacionSeleccionada: FtPresentacionDeEnvaseDTO | null = null;

  constructor(
    private _FtPresentacionDeEnvaseService: FtPresentacionDeEnvaseService
  ) { }

  ngOnInit(): void {
    this.CargarPresentaciones();
  }

  private CargarPresentaciones(): void {
    this._FtPresentacionDeEnvaseService.GetListaDePresentacionesDeEnvaseFichaTecnica().subscribe({
      next: (response) => {
        this.responsePresentacionesDTO = response.resultado;
        console.log(this.responsePresentacionesDTO);
      },
      error: (error) => {
        console.error('Error al obtener las presentaciones', error);
      }
    });
  }

  public CrearElemento() {
    const nuevaPresentacion: FtPresentacionDeEnvaseDTO = { 
      idPresentacionDeEnvase: 0,  
      nombre: '', 
      descripcion: ''
    };

    Swal.fire({
      title: 'Crear Nueva Presentación de Envase',
      html: `
        <input id="nombrePresentacion" class="swal2-input" placeholder="Nombre">
        <input id="descripcion" class="swal2-input" placeholder="Descripción">
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          nombrePresentacion: (document.getElementById('nombrePresentacion') as HTMLInputElement).value,
          descripcion: (document.getElementById('descripcion') as HTMLInputElement).value
        };
      }
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        // Verificar que los campos no estén vacíos
        if (!resultado.value.nombrePresentacion || !resultado.value.descripcion) {
          Swal.fire('Error', 'Por favor completa todos los campos.', 'warning');
          return;
        }

        nuevaPresentacion.nombre = resultado.value.nombrePresentacion;
        nuevaPresentacion.descripcion = resultado.value.descripcion;

        this._FtPresentacionDeEnvaseService.CrearPresentacionDeEnvase(nuevaPresentacion).subscribe({
          next: () => {
            this.CargarPresentaciones(); // Recargar la lista después de crear
            Swal.fire('Creado', 'La presentación de envase ha sido creada.', 'success');
          },
          error: (error) => {
            console.error('Error al crear la presentación', error);
            Swal.fire('Error', 'No se pudo crear la presentación.', 'error');
          }
        });
      }
    });
  }

  public EditarElemento(presentacion: FtPresentacionDeEnvaseDTO) {
    this.presentacionSeleccionada = { ...presentacion };
  }

  public GuardarCambios() {
    if (this.presentacionSeleccionada) {
      this._FtPresentacionDeEnvaseService.EditarPresentacionDeEnvase(this.presentacionSeleccionada).subscribe(() => {
        this.CargarPresentaciones();
        this.presentacionSeleccionada = null; 
      });
    }
  }

  public EliminarElemento(presentacion: FtPresentacionDeEnvaseDTO) {
    const idPresentacion = presentacion.idPresentacionDeEnvase;

    Swal.fire({
      title: '¿Desea eliminar la presentación de envase?',
      text: `ID Presentación: ${idPresentacion}, Nombre: ${presentacion.nombre}`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._FtPresentacionDeEnvaseService.EliminarPresentacionDeEnvase(idPresentacion).subscribe({
          next: () => {
            this.CargarPresentaciones(); 
            Swal.fire('Eliminado', 'La presentación de envase ha sido eliminada.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar la presentación', error);
            Swal.fire('Error', 'No se pudo eliminar la presentación.', 'error');
          }
        });
      }
    });
  }
}
