import { Injectable } from '@angular/core';
import { FtMarcaService } from '../../MantenimientoFichaTecnicaServicios/FtMarcas/FtMarcaService.service';
import { FtMarcaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Marcas/FtMarcaDTO';

@Injectable({
  providedIn: 'root'
})
export class FtPrecargaDeDatosService {

  public listaDeMarcas: FtMarcaDTO[] = [];

  constructor(
    private _FtMarcasService: FtMarcaService,
  ) { }

  public CargarMarcas(){
    this._FtMarcasService.GetListaDeMarcasFichaTecnica().subscribe({
      next: (response) => {
          this.listaDeMarcas = response.resultado.map((ph: FtMarcaDTO) => ({
              idMarca: ph.idMarca, 
              nombre: ph.descripcion 
          }));
          console.log(response)
      },
      error: (error) => {
          console.error('Error al obtener las Marcas', error);
      }
    });
  }

}
