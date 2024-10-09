import { Component, OnInit } from '@angular/core';
import { FtVidaUtilService } from '../../service/FtVidaUtil/FtVidaUtil.service';
import { FtVidaUtilDTO } from './../../interface/VidaUtil/FtVidaUtilDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-ft-seccion-vida-util',
  templateUrl: './ft-seccion-vida-util.component.html',
  styleUrls: ['./ft-seccion-vida-util.component.css']
})
export class FtSeccionVidaUtilComponent implements OnInit {

  public responseVidaUtilDTO: FtVidaUtilDTO[] = [];
  public vidaUtilSeleccionada: FtVidaUtilDTO | null = null;

  constructor(private _FtVidaUtilService: FtVidaUtilService) { }

  ngOnInit(): void {
    this.CargarVidaUtil();
  }

  private CargarVidaUtil(): void {
    this._FtVidaUtilService.GetListaDeVidaUtilFichaTecnica().subscribe({
      next: (response) => {
        this.responseVidaUtilDTO = response.resultado;
        console.log(this.responseVidaUtilDTO);
      },
      error: (error) => {
        console.error('Error al obtener la lista de vida útil', error);
      }
    });
  }

  public CrearElemento() {
    const nuevaVidaUtil: FtVidaUtilDTO = { 
      idVidaUtil: 0,  
      nombre: '', 
      duracion: ''
    };

    Swal.fire({
      title: 'Crear Nueva Vida Útil',
      html: `
        <input id="nombreVida" class="swal2-input" placeholder="Nombre">
        <input id="duracion" class="swal2-input" placeholder="Duración">
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          nombreVida: (document.getElementById('nombreVida') as HTMLInputElement).value,
          duracion: (document.getElementById('duracion') as HTMLInputElement).value
        };
      }
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        // Verificar que los campos no estén vacíos
        if (!resultado.value.nombreVida || !resultado.value.duracion) {
          Swal.fire('Error', 'Por favor completa todos los campos.', 'warning');
          return;
        }

        nuevaVidaUtil.nombre = resultado.value.nombreVida;
        nuevaVidaUtil.duracion = resultado.value.duracion;

        this._FtVidaUtilService.CrearVidaUtil(nuevaVidaUtil).subscribe({
          next: () => {
            this.CargarVidaUtil(); // Recargar la lista después de crear
            Swal.fire('Creado', 'La vida útil ha sido creada.', 'success');
          },
          error: (error) => {
            console.error('Error al crear la vida útil', error);
            Swal.fire('Error', 'No se pudo crear la vida útil.', 'error');
          }
        });
      }
    });
  }

  public EditarElemento(vidaUtil: FtVidaUtilDTO) {
    this.vidaUtilSeleccionada = { ...vidaUtil };
  }

  public GuardarCambios() {
    if (this.vidaUtilSeleccionada) {
      this._FtVidaUtilService.EditarVidaUtil(this.vidaUtilSeleccionada).subscribe(() => {
        this.CargarVidaUtil();
        this.vidaUtilSeleccionada = null; 
      });
    }
  }

  public EliminarElemento(vidaUtil: FtVidaUtilDTO) {
    const idVidaUtil = vidaUtil.idVidaUtil;

    Swal.fire({
      title: '¿Desea eliminar la vida útil?',
      text: `ID Vida Útil: ${idVidaUtil}, Nombre: ${vidaUtil.nombre}`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._FtVidaUtilService.EliminarVidaUtil(idVidaUtil).subscribe({
          next: () => {
            this.CargarVidaUtil(); 
            Swal.fire('Eliminado', 'La vida útil ha sido eliminada.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar la vida útil', error);
            Swal.fire('Error', 'No se pudo eliminar la vida útil.', 'error');
          }
        });
      }
    });
  }
}
