import { Component, OnInit } from '@angular/core';
import { FtPhService } from '../../service/FtPh/FtPh.service';
import { FtPhDTO } from './../../interface/Ph/FtPhDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-ft-seccion-ph',
  templateUrl: './ft-seccion-ph.component.html',
  styleUrls: ['./ft-seccion-ph.component.css']
})
export class FtSeccionPhComponent implements OnInit {

  public responsePhDTO: FtPhDTO[] = [];
  public phSeleccionado: FtPhDTO | null = null;

  constructor(private _FtPhService: FtPhService) { }

  ngOnInit(): void {
    this.CargarPh();
  }

  private CargarPh(): void {
    this._FtPhService.GetListaDePhFichaTecnica().subscribe({
      next: (response) => {
        this.responsePhDTO = response.resultado;
        console.log(this.responsePhDTO);
      },
      error: (error) => {
        console.error('Error al obtener los registros de pH', error);
      }
    });
  }

  public CrearElemento() {
    const nuevoPh: FtPhDTO = { 
      idPh: 0,  
      nombre: '', 
      valor: 0
    };

    Swal.fire({
      title: 'Crear Nuevo pH',
      html: `
        <input id="nombrePh" class="swal2-input" placeholder="Nombre">
        <input id="valor" type="number" class="swal2-input" placeholder="Valor">
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          nombrePh: (document.getElementById('nombrePh') as HTMLInputElement).value,
          valor: (document.getElementById('valor') as HTMLInputElement).value
        };
      }
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        // Verificar que los campos no estén vacíos
        if (!resultado.value.nombrePh || !resultado.value.valor) {
          Swal.fire('Error', 'Por favor completa todos los campos.', 'warning');
          return;
        }

        nuevoPh.nombre = resultado.value.nombrePh;
        nuevoPh.valor = parseFloat(resultado.value.valor);

        this._FtPhService.CrearPh(nuevoPh).subscribe({
          next: () => {
            this.CargarPh(); // Recargar la lista después de crear
            Swal.fire('Creado', 'El pH ha sido creado.', 'success');
          },
          error: (error) => {
            console.error('Error al crear el pH', error);
            Swal.fire('Error', 'No se pudo crear el pH.', 'error');
          }
        });
      }
    });
  }

  public EditarElemento(ph: FtPhDTO) {
    this.phSeleccionado = { ...ph };
  }

  public GuardarCambios() {
    if (this.phSeleccionado) {
      this._FtPhService.EditarPh(this.phSeleccionado).subscribe(() => {
        this.CargarPh();
        this.phSeleccionado = null; 
      });
    }
  }

  public EliminarElemento(ph: FtPhDTO) {
    const idPh = ph.idPh;

    Swal.fire({
      title: '¿Desea eliminar el pH?',
      text: `ID pH: ${idPh}, Nombre: ${ph.nombre}`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._FtPhService.EliminarPh(idPh).subscribe({
          next: () => {
            this.CargarPh(); 
            Swal.fire('Eliminado', 'El pH ha sido eliminado.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar el pH', error);
            Swal.fire('Error', 'No se pudo eliminar el pH.', 'error');
          }
        });
      }
    });
  }
}
