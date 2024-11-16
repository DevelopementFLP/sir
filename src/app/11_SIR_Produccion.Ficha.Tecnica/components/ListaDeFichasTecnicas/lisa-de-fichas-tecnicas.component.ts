import { Component } from '@angular/core';
import { FtFichaTecnicaDTO } from '../../interface/CreacionDeFichaTecnicaInterface/FtFichaTecnicaDTO';
import { FtFichaTecnicaService } from '../../service/CreacionDeFichaTecnicaServicios/FtFichaTecnica/FtFichaTecnica.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'component-lisa-de-fichas-tecnicas',
  templateUrl: './lisa-de-fichas-tecnicas.component.html',
  styleUrls: ['./lisa-de-fichas-tecnicas.component.css']
})
export class LisaDeFichasTecnicasComponent {

  public fichaTecnica: FtFichaTecnicaDTO[] = []; 
  public fichaSeleccionada: FtFichaTecnicaDTO | null = null;
  public modalVisible = false;
  public loading = true; 

  constructor(
    private fichaTecnicaService: FtFichaTecnicaService,
    private dialog: MatDialog // Inyectamos MatDialog
  ) { }

  ngOnInit(): void {
    this.ObtenerFichasTecnicas();
  }


  public ObtenerFichasTecnicas(): void {
    this.fichaTecnicaService.GetListaDeFichasTecnicas().subscribe(response => {
      if (response.esCorrecto) {
        this.fichaTecnica = response.resultado; 
        this.loading = false;
      } else {
        console.error('Error al obtener fichas técnicas: ', response.mensaje);
        this.loading = false;
      }
    }, error => {
      console.error('Error de conexión: ', error);
      this.loading = false;
    });
  }


  public AbrirModal(ficha: FtFichaTecnicaDTO): void {
    this.fichaSeleccionada = ficha;
    this.modalVisible = true;
  }

  // Método para cerrar el modal
  public CerrarModal() {
    this.modalVisible = false;
    this.ObtenerFichasTecnicas();
  }

  EliminarFicha(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás recuperar esta ficha técnica una vez eliminada.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.fichaTecnicaService.EliminarFichaTecnica(id).subscribe(response => {
          if (response.esCorrecto) {
            this.ObtenerFichasTecnicas();
            Swal.fire(
              'Eliminado!',
              'La ficha técnica ha sido eliminada.',
              'success'
            );
          } else {
            console.error('Error al eliminar ficha técnica: ', response.mensaje);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la ficha técnica.',
              'error'
            );
          }
        }, error => {
          console.error('Error de conexión al eliminar ficha técnica: ', error);
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar la ficha técnica.',
            'error'
          );
        });
      }
    });
  }


}