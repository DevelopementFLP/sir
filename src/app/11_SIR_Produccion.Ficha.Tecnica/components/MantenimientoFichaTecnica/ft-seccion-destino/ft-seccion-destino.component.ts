import { Component, OnInit } from '@angular/core';
import { FtDestinosService } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/service/MantenimientoFichaTecnicaServicios/FtDestinos/FtDestinos.service';
import { FtDestinoDTO } from '../../../interface/MantenimientoFichaTecnicaInterface/Destinos/FtDestinoDTO'; // Asegúrate de que el DTO exista
import Swal from 'sweetalert2';

@Component({
  selector: 'component-ft-seccion-destino',
  templateUrl: './ft-seccion-destino.component.html',
  styleUrls: ['./ft-seccion-destino.component.css']
})
export class FtSeccionDestinoComponent implements OnInit {

  public responseDestinoDTO: FtDestinoDTO[] = [];
  public destinoSeleccionado: FtDestinoDTO | null = null;

  constructor(
    private _FtDestinoService: FtDestinosService
  ) { }

  ngOnInit(): void {
    this.CargarDestinos();
  }

  public CargarDestinos(): void {
    this._FtDestinoService.GetListaDeDestinosFichaTecnica().subscribe({
      next: (response) => {
        this.responseDestinoDTO = response.resultado;
      },
      error: (error) => {
        console.error('Error al obtener los destinos', error);
      }
    });
  }

  public CrearElemento() {
    const nuevoDestino: FtDestinoDTO = { 
      idDestino: 0,
      nombre: '', 
      descripcion: ''
    };

    Swal.fire({
      title: 'Crear Nuevo Destino',
      html: `
        <input id="nombreDestino" class="swal2-input" placeholder="Nombre">
        <input id="descripcion" class="swal2-input" placeholder="Descripción">
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          nombreDestino: (document.getElementById('nombreDestino') as HTMLInputElement).value,
          descripcion: (document.getElementById('descripcion') as HTMLInputElement).value
        };
      }
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        // Verificar que los campos no estén vacíos
        if (!resultado.value.nombreDestino || !resultado.value.descripcion) {
          Swal.fire('Error', 'Por favor completa todos los campos.', 'warning');
          return;
        }

        nuevoDestino.nombre = resultado.value.nombreDestino;
        nuevoDestino.descripcion = resultado.value.descripcion;

        this._FtDestinoService.CrearDestinoFichaTecnica(nuevoDestino).subscribe({
          next: () => {
            this.CargarDestinos(); // Recargar la lista después de crear
            Swal.fire('Creado', 'El destino ha sido creado.', 'success');
          },
          error: (error) => {
            console.error('Error al crear el destino', error);
            Swal.fire('Error', 'No se pudo crear el destino.', 'error');
          }
        });
      }
    });
  }

  public EditarElemento(destino: FtDestinoDTO) {
    this.destinoSeleccionado = { ...destino };
  }

  public GuardarCambios() {
    if (this.destinoSeleccionado) {
      this._FtDestinoService.EditarDestinoFichaTecnica(this.destinoSeleccionado).subscribe(() => {
        this.CargarDestinos();
        this.destinoSeleccionado = null; 
      });
    }
  }

  public EliminarElemento(destino: FtDestinoDTO) {
    const idDestino = destino.idDestino;

    Swal.fire({
      title: '¿Desea eliminar el destino?',
      text: `ID Destino: ${idDestino}, Nombre: ${destino.nombre}`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._FtDestinoService.EliminarDestinoFichaTecnica(idDestino).subscribe({
          next: () => {
            this.CargarDestinos(); 
            Swal.fire(
              'Eliminado',
              'El destino ha sido eliminado.', 
              'success');
          },
          error: (error) => {
            console.error('Error al eliminar el destino', error);
            Swal.fire(
              'Error',
              'No se pudo eliminar el destino.',
              'error');
          }
        });
      }
    });
  }
}
