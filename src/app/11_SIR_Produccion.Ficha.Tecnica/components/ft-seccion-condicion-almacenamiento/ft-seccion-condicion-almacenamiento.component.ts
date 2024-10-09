import { Component, OnInit } from '@angular/core';
import { FtCondicionDeAlmacenamientoDTO } from '../../interface/CondicionDeAlmacenamiento/FtCondicionAlmacenamientoDTO';
import { FtCondicionAlmacenamientoService } from '../../service/FtCondicionAlmacenamiento/FtCondicionAlmacenamiento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-ft-seccion-condicion-almacenamiento',
  templateUrl: './ft-seccion-condicion-almacenamiento.component.html',
  styleUrls: ['./ft-seccion-condicion-almacenamiento.component.css']
})
export class FtSeccionCondicionAlmacenamientoComponent implements OnInit {

  public responseCondicionAlmacenamientoDTO: FtCondicionDeAlmacenamientoDTO[] = [];
  public condicionSeleccionada: FtCondicionDeAlmacenamientoDTO | null = null;

  constructor(
    private _FtCondicionAlmacenamiento: FtCondicionAlmacenamientoService
  ) { }

  ngOnInit(): void {
    this.CargarCondicionAlmacenamiento();
  }

  private CargarCondicionAlmacenamiento(): void {
    this._FtCondicionAlmacenamiento.GetListaDeCondicionesFichaTecnica().subscribe({
      next: (response) => {
        this.responseCondicionAlmacenamientoDTO = response.resultado;
        console.log(this.responseCondicionAlmacenamientoDTO);
      },
      error: (error) => {
        console.error('Error al obtener las condiciones de almacenamiento', error);
      }
    });
  }

  public CrearElemento() {
    
    const nuevaCondicion: FtCondicionDeAlmacenamientoDTO = { 
        idCondicionDeAlmacenamiento: 0,  
        nombre: '', 
        descripcion: ''
    };

    Swal.fire({
        title: 'Crear Nueva Condición de Almacenamiento',
        html: `
            <input id="nombreCondicion" class="swal2-input" placeholder="Nombre">
            <input id="descripcion" class="swal2-input" placeholder="Descripción">
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return {
                nombreCondicion: (document.getElementById('nombreCondicion') as HTMLInputElement).value,
                descripcion: (document.getElementById('descripcion') as HTMLInputElement).value
            };
        }
        
    }).then((resultado) => {
        if (resultado.isConfirmed) {

            // Verificar que los campos no estén vacíos
            if (!resultado.value.nombreCondicion || !resultado.value.descripcion) {
              Swal.fire('Error', 'Por favor completa todos los campos.', 'warning');
              return;
            }

            nuevaCondicion.nombre = resultado.value.nombreCondicion;
            nuevaCondicion.descripcion = resultado.value.descripcion;

            this._FtCondicionAlmacenamiento.CrearCondicion(nuevaCondicion).subscribe({
                next: () => {
                    this.CargarCondicionAlmacenamiento(); // Recargar la lista después de crear
                    Swal.fire('Creado', 'La condición ha sido creada.', 'success');
                },
                error: (error) => {
                    console.error('Error al crear la condición', error);
                    Swal.fire('Error', 'No se pudo crear la condición.', 'error');
                }
            });
        }
    });
  }

  public EditarElemento(condicion: FtCondicionDeAlmacenamientoDTO){
    this.condicionSeleccionada = { ...condicion };
  }

  public GuardarCambios() {
    if (this.condicionSeleccionada) {
      this._FtCondicionAlmacenamiento.EditarCondicion(this.condicionSeleccionada).subscribe(() => {
        this.CargarCondicionAlmacenamiento();
        this.condicionSeleccionada = null; 
      });
    }
  }

  public EliminarElemento(condicion: FtCondicionDeAlmacenamientoDTO) {
    const idCondicion = condicion.idCondicionDeAlmacenamiento;
    
    Swal.fire({
        title: '¿Desea eliminar la condición de almacenamiento?',
        text: `ID: ${idCondicion}, Nombre: ${condicion.nombre}`,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: 'No, volver'
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            this._FtCondicionAlmacenamiento.EliminarCondicion(idCondicion).subscribe({
                next: () => {
                    this.CargarCondicionAlmacenamiento(); 
                    Swal.fire('Eliminado', 'La condición ha sido eliminada.', 'success');
                },
                error: (error) => {
                    console.error('Error al eliminar la condición', error);
                    Swal.fire('Error', 'No se pudo eliminar la condición.', 'error');
                }
            });
        }
    });
  }
}
