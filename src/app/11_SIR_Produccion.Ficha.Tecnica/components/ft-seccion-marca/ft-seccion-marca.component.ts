
import { FtMarcaServiceService } from '../../service/FtMarcas/FtMarcaService.service';
import { FtMarcaDTO } from './../../interface/Marcas/FtMarcaDTO';
import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

@Component({
  selector: 'component-ft-seccion-marca',
  templateUrl: './ft-seccion-marca.component.html',
  styleUrls: ['./ft-seccion-marca.component.css']
})
export class FtSeccionMarcaComponent implements OnInit {

  public responseMarcasDTO: FtMarcaDTO[] = [];
  public marcaSeleccionada: FtMarcaDTO | null = null;

  constructor(
    private _FtmarcaService: FtMarcaServiceService
  ) { }

  ngOnInit(): void {
    this.CargarMarcas();
  }

  private CargarMarcas(): void {
    this._FtmarcaService.GetListaDeMarcasFichaTecnica().subscribe({
      next: (response) => {
        this.responseMarcasDTO = response.resultado;
        console.log(this.responseMarcasDTO)
      },
      error: (error) => {
        console.error('Error al obtener las marcas', error);
      }
    });
  }

  public CrearElemento() {
    
    const nuevaMarca: FtMarcaDTO = { 
        idMarca: 0,  
        nombre: '', 
        descripcion: ''
    };

    Swal.fire({
        title: 'Crear Nueva Marca',
        html: `
            <input id="nombreMarca" class="swal2-input" placeholder="Nombre">
            <input id="descripcion" class="swal2-input" placeholder="Descripción">
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return {
                nombreMarca: (document.getElementById('nombreMarca') as HTMLInputElement).value,
                descripcion: (document.getElementById('descripcion') as HTMLInputElement).value
            };
        }
        
    }).then((resultado) => {
        if (resultado.isConfirmed) {

            // Verificar que los campos no estén vacíos
            if (!resultado.value.nombreMarca || !resultado.value.descripcion) {
              Swal.fire('Error', 'Por favor completa todos los campos.', 'warning');
              return;
            }

            nuevaMarca.nombre = resultado.value.nombreMarca;
            nuevaMarca.descripcion = resultado.value.descripcion;

            this._FtmarcaService.CrearMarca(nuevaMarca).subscribe({
                next: () => {
                    this.CargarMarcas(); // Recargar la lista después de crear
                    Swal.fire('Creado', 'La marca ha sido creada.', 'success');
                },
                error: (error) => {
                    console.error('Error al crear la marca', error);
                    Swal.fire('Error', 'No se pudo crear la marca.', 'error');
                }
            });
        }
    });
  }


  public EditarElemento(marca: FtMarcaDTO){
    this.marcaSeleccionada = { ...marca };
  }

  public GuardarCambios() {
    if (this.marcaSeleccionada) {
      this._FtmarcaService.EditarMarca(this.marcaSeleccionada).subscribe(() => {
        this.CargarMarcas();
        this.marcaSeleccionada = null; 
      });
    }
  }

  public EliminarElemento(marca: FtMarcaDTO) {
    const idMarca = marca.idMarca;
    
    Swal.fire({
        title: '¿Desea eliminar la marca?',
        text: `ID Marca: ${idMarca}, Nombre: ${marca.nombre}`,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: 'No, volver'
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            this._FtmarcaService.EliminarMarca(idMarca).subscribe({
                next: () => {
                    this.CargarMarcas(); 
                    Swal.fire('Eliminado', 'La marca ha sido eliminada.', 'success');
                },
                error: (error) => {
                    console.error('Error al eliminar la marca', error);
                    Swal.fire('Error', 'No se pudo eliminar la marca.', 'error');
                }
            });
        }
    });
  }
}
