import { Component, OnInit } from '@angular/core';
import { FtColorService } from '../../../service/MantenimientoFichaTecnicaServicios/FtColor/FtColor.service';
import { FtColorDTO } from '../../../interface/MantenimientoFichaTecnicaInterface/Colores/FtColorDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-ft-seccion-color',
  templateUrl: './ft-seccion-color.component.html',
  styleUrls: ['./ft-seccion-color.component.css']
})
export class FtSeccionColorComponent implements OnInit {

  public responseColorDTO: FtColorDTO[] = [];
  public colorSeleccionado: FtColorDTO | null = null;

  constructor(private _FtColorService: FtColorService) { }

  ngOnInit(): void {
    this.CargarColores();
  }

  public CargarColores(): void {
    this._FtColorService.GetListaDeColoresFichaTecnica().subscribe({
      next: (response) => {
        this.responseColorDTO = response.resultado;
      },
      error: (error) => {
        console.error('Error al obtener los colores', error);
      }
    });
  }

  public CrearElemento() {
    const nuevoColor: FtColorDTO = { 
      idColor: 0,  
      nombre: '', 
      descripcion: ''
    };

    Swal.fire({
      title: 'Crear Nuevo Color',
      html: `
        <input id="nombreColor" class="swal2-input" placeholder="Nombre">
        <input id="descripcion" class="swal2-input" placeholder="Descripción">
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          nombreColor: (document.getElementById('nombreColor') as HTMLInputElement).value,
          descripcion: (document.getElementById('descripcion') as HTMLInputElement).value
        };
      }
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        // Verificar que los campos no estén vacíos
        if (!resultado.value.nombreColor || !resultado.value.descripcion) {
          Swal.fire('Error', 'Por favor completa todos los campos.', 'warning');
          return;
        }

        nuevoColor.nombre = resultado.value.nombreColor;
        nuevoColor.descripcion = resultado.value.descripcion;

        this._FtColorService.CrearColor(nuevoColor).subscribe({
          next: () => {
            this.CargarColores(); // Recargar la lista después de crear
            Swal.fire('Creado', 'El color ha sido creado.', 'success');
          },
          error: (error) => {
            console.error('Error al crear el color', error);
            Swal.fire('Error', 'No se pudo crear el color.', 'error');
          }
        });
      }
    });
  }

  public EditarElemento(color: FtColorDTO) {
    this.colorSeleccionado = { ...color };
  }

  public GuardarCambios() {
    if (this.colorSeleccionado) {
      this._FtColorService.EditarColor(this.colorSeleccionado).subscribe(() => {
        this.CargarColores();
        this.colorSeleccionado = null; 
      });
    }
  }

  public EliminarElemento(color: FtColorDTO) {
    const idColor = color.idColor;

    Swal.fire({
      title: '¿Desea eliminar el color?',
      text: `ID Color: ${idColor}, Nombre: ${color.nombre}`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._FtColorService.EliminarColor(idColor).subscribe({
          next: () => {
            this.CargarColores(); 
            Swal.fire('Eliminado', 'El color ha sido eliminado.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar el color', error);
            Swal.fire('Error', 'No se pudo eliminar el color.', 'error');
          }
        });
      }
    });
  }
}
