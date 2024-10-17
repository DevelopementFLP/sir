import { Component, OnInit } from '@angular/core';
import { FtTipoDeEnvaseService } from '../../service/FtTipoDeEnvase/FtTipoDeEnvase.service';
import { FtTipoDeEnvaseDTO } from './../../interface/TipoDeEnvase/FtTipoDeEnvaseDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-ft-seccion-tipo-de-envase',
  templateUrl: './ft-seccion-tipo-de-envase.component.html',
  styleUrls: ['./ft-seccion-tipo-de-envase.component.css']
})
export class FtSeccionTipoDeEnvaseComponent implements OnInit {

  public responseTiposDeEnvaseDTO: FtTipoDeEnvaseDTO[] = [];
  public tipoDeEnvaseSeleccionado: FtTipoDeEnvaseDTO | null = null;

  constructor(private _FtTipoDeEnvaseService: FtTipoDeEnvaseService) { }

  ngOnInit(): void {
    this.CargarTiposDeEnvase();
  }

  private CargarTiposDeEnvase(): void {
    this._FtTipoDeEnvaseService.GetListaDeTiposDeEnvaseFichaTecnica().subscribe({
      next: (response) => {
        this.responseTiposDeEnvaseDTO = response.resultado;
        console.log(this.responseTiposDeEnvaseDTO);
      },
      error: (error) => {
        console.error('Error al obtener los tipos de envase', error);
      }
    });
  }

  public CrearElemento() {
    const nuevoTipoDeEnvase: FtTipoDeEnvaseDTO = { 
      idTipoDeEnvase: 0,  
      nombre: '', 
      descripcion: ''
    };

    Swal.fire({
      title: 'Crear Nuevo Tipo de Envase',
      html: `
        <input id="nombreTipo" class="swal2-input" placeholder="Nombre">
        <input id="descripcion" class="swal2-input" placeholder="Descripción">
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          nombreTipo: (document.getElementById('nombreTipo') as HTMLInputElement).value,
          descripcion: (document.getElementById('descripcion') as HTMLInputElement).value
        };
      }
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        // Verificar que los campos no estén vacíos
        if (!resultado.value.nombreTipo || !resultado.value.descripcion) {
          Swal.fire('Error', 'Por favor completa todos los campos.', 'warning');
          return;
        }

        nuevoTipoDeEnvase.nombre = resultado.value.nombreTipo;
        nuevoTipoDeEnvase.descripcion = resultado.value.descripcion;

        this._FtTipoDeEnvaseService.CrearTipoDeEnvase(nuevoTipoDeEnvase).subscribe({
          next: () => {
            this.CargarTiposDeEnvase(); // Recargar la lista después de crear
            Swal.fire('Creado', 'El tipo de envase ha sido creado.', 'success');
          },
          error: (error) => {
            console.error('Error al crear el tipo de envase', error);
            Swal.fire('Error', 'No se pudo crear el tipo de envase.', 'error');
          }
        });
      }
    });
  }

  public EditarElemento(tipoDeEnvase: FtTipoDeEnvaseDTO) {
    this.tipoDeEnvaseSeleccionado = { ...tipoDeEnvase };
  }

  public GuardarCambios() {
    if (this.tipoDeEnvaseSeleccionado) {
      this._FtTipoDeEnvaseService.EditarTipoDeEnvase(this.tipoDeEnvaseSeleccionado).subscribe(() => {
        this.CargarTiposDeEnvase();
        this.tipoDeEnvaseSeleccionado = null; 
      });
    }
  }

  public EliminarElemento(tipoDeEnvase: FtTipoDeEnvaseDTO) {
    const idTipoDeEnvase = tipoDeEnvase.idTipoDeEnvase;

    Swal.fire({
      title: '¿Desea eliminar el tipo de envase?',
      text: `ID Tipo: ${idTipoDeEnvase}, Nombre: ${tipoDeEnvase.nombre}`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._FtTipoDeEnvaseService.EliminarTipoDeEnvase(idTipoDeEnvase).subscribe({
          next: () => {
            this.CargarTiposDeEnvase(); 
            Swal.fire('Eliminado', 'El tipo de envase ha sido eliminado.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar el tipo de envase', error);
            Swal.fire('Error', 'No se pudo eliminar el tipo de envase.', 'error');
          }
        });
      }
    });
  }
}
