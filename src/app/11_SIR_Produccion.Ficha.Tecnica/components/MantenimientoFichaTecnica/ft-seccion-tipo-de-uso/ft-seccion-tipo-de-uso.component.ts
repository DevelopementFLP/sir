import { Component, OnInit } from '@angular/core';
import { FtTipoDeUsoService } from '../../../service/MantenimientoFichaTecnicaServicios/FtTipoDeUso/FtTipoDeUso.service';
import { FtTipoDeUsoDTO } from '../../../interface/MantenimientoFichaTecnicaInterface/TipoDeUso/FtTipoDeUsoDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-ft-seccion-tipo-de-uso',
  templateUrl: './ft-seccion-tipo-de-uso.component.html',
  styleUrls: ['./ft-seccion-tipo-de-uso.component.css']
})
export class FtSeccionTipoDeUsoComponent implements OnInit {

  public responseTiposDeUsoDTO: FtTipoDeUsoDTO[] = [];
  public tipoDeUsoSeleccionado: FtTipoDeUsoDTO | null = null;

  constructor(private _FtTipoDeUsoService: FtTipoDeUsoService) { }

  ngOnInit(): void {
    this.CargarTiposDeUso();
  }

  private CargarTiposDeUso(): void {
    this._FtTipoDeUsoService.GetListaDeTiposDeUsoFichaTecnica().subscribe({
      next: (response) => {
        this.responseTiposDeUsoDTO = response.resultado;
      },
      error: (error) => {
        console.error('Error al obtener los tipos de uso', error);
      }
    });
  }

  public CrearElemento() {
    const nuevoTipoDeUso: FtTipoDeUsoDTO = { 
      idTipoDeUso: 0,  
      nombre: '', 
      descripcion: ''
    };

    Swal.fire({
      title: 'Crear Nuevo Tipo de Uso',
      html: `
        <input id="nombreTipoDeUso" class="swal2-input" placeholder="Nombre">
        <input id="descripcion" class="swal2-input" placeholder="Descripción">
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          nombreTipoDeUso: (document.getElementById('nombreTipoDeUso') as HTMLInputElement).value,
          descripcion: (document.getElementById('descripcion') as HTMLInputElement).value
        };
      }
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        // Verificar que los campos no estén vacíos
        if (!resultado.value.nombreTipoDeUso || !resultado.value.descripcion) {
          Swal.fire('Error', 'Por favor completa todos los campos.', 'warning');
          return;
        }

        nuevoTipoDeUso.nombre = resultado.value.nombreTipoDeUso;
        nuevoTipoDeUso.descripcion = resultado.value.descripcion;

        this._FtTipoDeUsoService.CrearTipoDeUso(nuevoTipoDeUso).subscribe({
          next: () => {
            this.CargarTiposDeUso(); // Recargar la lista después de crear
            Swal.fire('Creado', 'El tipo de uso ha sido creado.', 'success');
          },
          error: (error) => {
            console.error('Error al crear el tipo de uso', error);
            Swal.fire('Error', 'No se pudo crear el tipo de uso.', 'error');
          }
        });
      }
    });
  }

  public EditarElemento(tipoDeUso: FtTipoDeUsoDTO) {
    this.tipoDeUsoSeleccionado = { ...tipoDeUso };
  }

  public GuardarCambios() {
    if (this.tipoDeUsoSeleccionado) {
      this._FtTipoDeUsoService.EditarTipoDeUso(this.tipoDeUsoSeleccionado).subscribe(() => {
        this.CargarTiposDeUso();
        this.tipoDeUsoSeleccionado = null; 
      });
    }
  }

  public EliminarElemento(tipoDeUso: FtTipoDeUsoDTO) {
    const idTipoDeUso = tipoDeUso.idTipoDeUso;

    Swal.fire({
      title: '¿Desea eliminar el tipo de uso?',
      text: `ID Tipo de Uso: ${idTipoDeUso}, Nombre: ${tipoDeUso.nombre}`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._FtTipoDeUsoService.EliminarTipoDeUso(idTipoDeUso).subscribe({
          next: () => {
            this.CargarTiposDeUso(); 
            Swal.fire('Eliminado', 'El tipo de uso ha sido eliminado.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar el tipo de uso', error);
            Swal.fire('Error', 'No se pudo eliminar el tipo de uso.', 'error');
          }
        });
      }
    });
  }
}
