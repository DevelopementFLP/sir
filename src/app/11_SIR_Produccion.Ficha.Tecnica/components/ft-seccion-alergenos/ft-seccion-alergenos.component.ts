import { Component, OnInit } from '@angular/core';
import { FtAlergenosService } from '../../service/FtAlergenos/FtAlergenos.service';
import { FtAlergenosDTO } from './../../interface/Alergenos/FtAlergenosDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-ft-seccion-alergenos',
  templateUrl: './ft-seccion-alergenos.component.html',
  styleUrls: ['./ft-seccion-alergenos.component.css']
})
export class FtSeccionAlergenosComponent implements OnInit {

  public responseAlergenosDTO: FtAlergenosDTO[] = [];
  public alergenosSeleccionados: FtAlergenosDTO | null = null;

  constructor(
    private _FtAlergenosService: FtAlergenosService
  ) { }

  ngOnInit(): void {
    this.CargarAlergenos();
  }

  private CargarAlergenos(): void {
    this._FtAlergenosService.GetListaDeAlergenosFichaTecnica().subscribe({
      next: (response) => {
        this.responseAlergenosDTO = response.resultado;
        console.log(this.responseAlergenosDTO);
      },
      error: (error) => {
        console.error('Error al obtener los alérgenos', error);
      }
    });
  }

  public CrearElemento() {
    const nuevoAlergeno: FtAlergenosDTO = { 
      idAlergenos: 0,  
      nombre: '', 
      descripcion: ''
    };

    Swal.fire({
      title: 'Crear Nuevo Alérgeno',
      html: `
        <input id="nombreAlergeno" class="swal2-input" placeholder="Nombre">
        <input id="descripcion" class="swal2-input" placeholder="Descripción">
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          nombreAlergeno: (document.getElementById('nombreAlergeno') as HTMLInputElement).value,
          descripcion: (document.getElementById('descripcion') as HTMLInputElement).value
        };
      }
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        // Verificar que los campos no estén vacíos
        if (!resultado.value.nombreAlergeno || !resultado.value.descripcion) {
          Swal.fire('Error', 'Por favor completa todos los campos.', 'warning');
          return;
        }

        nuevoAlergeno.nombre = resultado.value.nombreAlergeno;
        nuevoAlergeno.descripcion = resultado.value.descripcion;

        this._FtAlergenosService.CrearAlergeno(nuevoAlergeno).subscribe({
          next: () => {
            this.CargarAlergenos(); // Recargar la lista después de crear
            Swal.fire('Creado', 'El alérgeno ha sido creado.', 'success');
          },
          error: (error) => {
            console.error('Error al crear el alérgeno', error);
            Swal.fire('Error', 'No se pudo crear el alérgeno.', 'error');
          }
        });
      }
    });
  }

  public EditarElemento(alergeno: FtAlergenosDTO) {
    this.alergenosSeleccionados = { ...alergeno };
  }

  public GuardarCambios() {
    if (this.alergenosSeleccionados) {
      this._FtAlergenosService.EditarAlergeno(this.alergenosSeleccionados).subscribe(() => {
        this.CargarAlergenos();
        this.alergenosSeleccionados = null; 
      });
    }
  }

  public EliminarElemento(alergeno: FtAlergenosDTO) {
    const idAlergeno = alergeno.idAlergenos;

    Swal.fire({
      title: '¿Desea eliminar el alérgeno?',
      text: `ID Alérgeno: ${idAlergeno}, Nombre: ${alergeno.nombre}`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._FtAlergenosService.EliminarAlergeno(idAlergeno).subscribe({
          next: () => {
            this.CargarAlergenos(); 
            Swal.fire('Eliminado', 'El alérgeno ha sido eliminado.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar el alérgeno', error);
            Swal.fire('Error', 'No se pudo eliminar el alérgeno.', 'error');
          }
        });
      }
    });
  }
}
