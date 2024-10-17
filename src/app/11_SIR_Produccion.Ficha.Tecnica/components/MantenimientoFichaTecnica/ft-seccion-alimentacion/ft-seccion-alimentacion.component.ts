import { FtTipoDeAlimentacionDTO } from '../../../interface/MantenimientoFichaTecnicaInterface/Alimentacion/FtTipoDeAlimentacionDTO';
import { Component, OnInit } from '@angular/core';
import { FtTipoDeAlimentacionService } from '../../../service/MantenimientoFichaTecnicaServicios/FtTipoDeAlimentacion/FtTipoDeAlimentacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-ft-seccion-alimentacion',
  templateUrl: './ft-seccion-alimentacion.component.html',
  styleUrls: ['./ft-seccion-alimentacion.component.css']
})
export class FtSeccionAlimentacionComponent implements OnInit {

  public responseAlimentacionDTO: FtTipoDeAlimentacionDTO[] = [];
  public alimentacionSeleccionada: FtTipoDeAlimentacionDTO | null = null;

  constructor(
    private _FtTipoDeAlimentacionService: FtTipoDeAlimentacionService
  ) { }

  ngOnInit(): void {
    this.CargarTiposDeAlimentacion();
  }

  private CargarTiposDeAlimentacion(): void {
    this._FtTipoDeAlimentacionService.GetListaDeTiposDeAlimentacionFichaTecnica().subscribe({
      next: (response) => {
        this.responseAlimentacionDTO = response.resultado;
      },
      error: (error) => {
        console.error('Error al obtener los tipos de alimentación', error);
      }
    });
  }

  public CrearElemento() {
    const nuevaAlimentacion: FtTipoDeAlimentacionDTO = { 
      idAlimentacion: 0,  
      nombre: '', 
      tipo: ''
    };

    Swal.fire({
      title: 'Crear Nuevo Tipo de Alimentación',
      html: `
        <input id="nombreAlimentacion" class="swal2-input" placeholder="Nombre">
        <input id="tipo" class="swal2-input" placeholder="Tipo">
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          nombreAlimentacion: (document.getElementById('nombreAlimentacion') as HTMLInputElement).value,
          tipo: (document.getElementById('tipo') as HTMLInputElement).value
        };
      }
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        // Verificar que los campos no estén vacíos
        if (!resultado.value.nombreAlimentacion || !resultado.value.tipo) {
          Swal.fire('Error', 'Por favor completa todos los campos.', 'warning');
          return;
        }

        nuevaAlimentacion.nombre = resultado.value.nombreAlimentacion;
        nuevaAlimentacion.tipo = resultado.value.tipo;

        this._FtTipoDeAlimentacionService.CrearTipoDeAlimentacion(nuevaAlimentacion).subscribe({
          next: () => {
            this.CargarTiposDeAlimentacion(); // Recargar la lista después de crear
            Swal.fire('Creado', 'El tipo de alimentación ha sido creado.', 'success');
          },
          error: (error) => {
            console.error('Error al crear el tipo de alimentación', error);
            Swal.fire('Error', 'No se pudo crear el tipo de alimentación.', 'error');
          }
        });
      }
    });
  }

  public EditarElemento(alimentacion: FtTipoDeAlimentacionDTO) {
    this.alimentacionSeleccionada = { ...alimentacion };
  }

  public GuardarCambios() {
    if (this.alimentacionSeleccionada) {
      this._FtTipoDeAlimentacionService.EditarTipoDeAlimentacion(this.alimentacionSeleccionada).subscribe(() => {
        this.CargarTiposDeAlimentacion();
        this.alimentacionSeleccionada = null; 
      });
    }
  }

  public EliminarElemento(alimentacion: FtTipoDeAlimentacionDTO) {
    const idAlimentacion = alimentacion.idAlimentacion;

    Swal.fire({
      title: '¿Desea eliminar el tipo de alimentación?',
      text: `ID Alimentación: ${idAlimentacion}, Nombre: ${alimentacion.nombre}`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._FtTipoDeAlimentacionService.EliminarTipoDeAlimentacion(idAlimentacion).subscribe({
          next: () => {
            this.CargarTiposDeAlimentacion(); 
            Swal.fire('Eliminado', 'El tipo de alimentación ha sido eliminado.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar el tipo de alimentación', error);
            Swal.fire('Error', 'No se pudo eliminar el tipo de alimentación.', 'error');
          }
        });
      }
    });
  }
}
