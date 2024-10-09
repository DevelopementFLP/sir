import { FtOlorDTO } from './../../interface/Olor/FtOlorDTO';
import { Component, OnInit } from '@angular/core';
import { FtOlorService } from '../../service/FtOlor/FtOlor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-ft-seccion-olor',
  templateUrl: './ft-seccion-olor.component.html',
  styleUrls: ['./ft-seccion-olor.component.css']
})
export class FtSeccionOlorComponent implements OnInit {

  public responseOlorDTO: FtOlorDTO[] = [];
  public olorSeleccionado: FtOlorDTO | null = null;

  constructor(private _FtOlorService: FtOlorService) { }

  ngOnInit(): void {
    this.CargarOlores();
  }

  private CargarOlores(): void {
    this._FtOlorService.GetListaDeOloresFichaTecnica().subscribe({
      next: (response) => {
        this.responseOlorDTO = response.resultado;
        console.log(this.responseOlorDTO);
      },
      error: (error) => {
        console.error('Error al obtener los olores', error);
      }
    });
  }

  public CrearElemento() {
    const nuevoOlor: FtOlorDTO = { 
      idOlor: 0,  
      nombre: '', 
      descripcion: ''
    };

    Swal.fire({
      title: 'Crear Nuevo Olor',
      html: `
        <input id="nombreOlor" class="swal2-input" placeholder="Nombre">
        <input id="descripcion" class="swal2-input" placeholder="Descripción">
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          nombreOlor: (document.getElementById('nombreOlor') as HTMLInputElement).value,
          descripcion: (document.getElementById('descripcion') as HTMLInputElement).value
        };
      }
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        // Verificar que los campos no estén vacíos
        if (!resultado.value.nombreOlor || !resultado.value.descripcion) {
          Swal.fire('Error', 'Por favor completa todos los campos.', 'warning');
          return;
        }

        nuevoOlor.nombre = resultado.value.nombreOlor;
        nuevoOlor.descripcion = resultado.value.descripcion;

        this._FtOlorService.CrearOlor(nuevoOlor).subscribe({
          next: () => {
            this.CargarOlores(); // Recargar la lista después de crear
            Swal.fire('Creado', 'El olor ha sido creado.', 'success');
          },
          error: (error) => {
            console.error('Error al crear el olor', error);
            Swal.fire('Error', 'No se pudo crear el olor.', 'error');
          }
        });
      }
    });
  }

  public EditarElemento(olor: FtOlorDTO) {
    this.olorSeleccionado = { ...olor };
  }

  public GuardarCambios() {
    if (this.olorSeleccionado) {
      this._FtOlorService.EditarOlor(this.olorSeleccionado).subscribe(() => {
        this.CargarOlores();
        this.olorSeleccionado = null; 
      });
    }
  }

  public EliminarElemento(olor: FtOlorDTO) {
    const idOlor = olor.idOlor;

    Swal.fire({
      title: '¿Desea eliminar el olor?',
      text: `ID Olor: ${idOlor}, Nombre: ${olor.nombre}`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._FtOlorService.EliminarOlor(idOlor).subscribe({
          next: () => {
            this.CargarOlores(); 
            Swal.fire('Eliminado', 'El olor ha sido eliminado.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar el olor', error);
            Swal.fire('Error', 'No se pudo eliminar el olor.', 'error');
          }
        });
      }
    });
  }
}
