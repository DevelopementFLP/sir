import { Component, ViewChild } from '@angular/core';
import { FtFichaTecnicaDTO } from '../../interface/CreacionDeFichaTecnicaInterface/FtFichaTecnicaDTO';
import { FtFichaTecnicaService } from '../../service/CreacionDeFichaTecnicaServicios/FtFichaTecnica/FtFichaTecnica.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';

@Component({
  selector: 'component-lisa-de-fichas-tecnicas',
  templateUrl: './lisa-de-fichas-tecnicas.component.html',
  styleUrls: ['./lisa-de-fichas-tecnicas.component.css']
})
export class LisaDeFichasTecnicasComponent {

  @ViewChild('dt') table: Table | undefined;

  public fichaTecnica: FtFichaTecnicaDTO[] = []; 
  public fichaSeleccionada: FtFichaTecnicaDTO | null = null;
  public modalEditarFichaTecnicaActivo = false;
  public modalVerFichaTecnicaActivo = false; 
  public loading = true; 

  public esUsuarioAdmin: boolean = false; 
  rutaActual: string = ''; 

  public page: number = 1;  // Página inicial
  public size: number = 10; // Tamaño de la página

  constructor(
    private fichaTecnicaService: FtFichaTecnicaService,
    private router: Router // Inyecta Router
  ) { }

  ngOnInit(): void {

    const usuario = JSON.parse(localStorage.getItem('actualUser') || '{}');
    console.log(usuario);
    if (usuario && usuario.id_usuario == 27 || usuario.id_perfil == 1) {
      this.esUsuarioAdmin = true; 
    }
  
    this.ObtenerFichasTecnicas();
  }


  public ObtenerFichasTecnicas(): void {
    this.loading = true; 
  
    this.fichaTecnicaService.GetListaDeFichasTecnicas().subscribe(response => {
      if (response.esCorrecto) {
        this.fichaTecnica = response.resultado;
        this.loading = false;
      } else {
        // Si la respuesta no es correcta, muestra un error con SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Error al obtener fichas técnicas: ${response.mensaje}`,
        });
        this.loading = false;
      }
    }, error => {
      // Si hay un error de conexión, muestra el error con SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Error de Conexión',
        text: `Ocurrió un error al intentar obtener las fichas técnicas: ${error.message}`,
      });
      this.loading = false;
    });
  }


  public AbrirModalEditarFichaTecnica(ficha: FtFichaTecnicaDTO): void {
    this.fichaSeleccionada = ficha;
    this.modalEditarFichaTecnicaActivo = true;
  }

  // Método para cerrar el modal
  public CerrarModalEditarFichaTecnica() {
    this.modalEditarFichaTecnicaActivo = false;
  }

  // Método que se llama cuando el modal se cierra después de la edición
  public EscucharCierreDeModal(event: boolean, fichaActualizada: FtFichaTecnicaDTO | null): void {
    if (event && fichaActualizada) {

      const index = this.fichaTecnica.findIndex(ficha => ficha.idFichaTecnica === fichaActualizada.idFichaTecnica);
      if (index !== -1) {
        this.fichaTecnica[index] = fichaActualizada;  
        if (this.table) {
          this.table.reset();  
        }
      }
      this.modalEditarFichaTecnicaActivo = false;  
    } else if (!event) {
      this.modalEditarFichaTecnicaActivo = false;
    }
  }
  

   // Método para abrir el modal de creación de nueva ficha técnica
   public AbrirModalVerFichaTecnica(ficha: FtFichaTecnicaDTO): void {
    this.fichaSeleccionada = ficha;
    this.modalVerFichaTecnicaActivo = true;
  }

  // Método para cerrar el modal de creación
  public CerrarModalVerFichaTecnica(): void {
    this.modalVerFichaTecnicaActivo = false;  
  }

  EliminarFicha(id: number, codigoDeProducto: string): void {

    // Obtener el código de producto hasta el primer espacio
    const codigoCorto = codigoDeProducto.split(' ')[0];
    
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
        this.fichaTecnicaService.EliminarFichaTecnica(id, codigoCorto).subscribe(response => {
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