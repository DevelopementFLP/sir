import { Injectable } from '@angular/core';

import { FtTipoDeUsoDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/TipoDeUso/FtTipoDeUsoDTO';
import { FtAlergenosDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Alergenos/FtAlergenosDTO';
import { FtCondicionDeAlmacenamientoDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/CondicionDeAlmacenamiento/FtCondicionAlmacenamientoDTO';
import { FtVidaUtilDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/VidaUtil/FtVidaUtilDTO';
import { FtTipoDeEnvaseDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/TipoDeEnvase/FtTipoDeEnvaseDTO';
import { FtPresentacionDeEnvaseDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/PresentacionDeEnvase/FtPresentacionDeEnvaseDTO';
import { FtColorDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Colores/FtColorDTO';
import { FtOlorDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Olor/FtOlorDTO';
import { FtPhDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Ph/FtPhDTO';
import { FtTipoDeUsoService } from '../../MantenimientoFichaTecnicaServicios/FtTipoDeUso/FtTipoDeUso.service';
import { FtAlergenosService } from '../../MantenimientoFichaTecnicaServicios/FtAlergenos/FtAlergenos.service';
import { FtCondicionAlmacenamientoService } from '../../MantenimientoFichaTecnicaServicios/FtCondicionAlmacenamiento/FtCondicionAlmacenamiento.service';
import { FtVidaUtilService } from '../../MantenimientoFichaTecnicaServicios/FtVidaUtil/FtVidaUtil.service';
import { FtTipoDeEnvaseService } from '../../MantenimientoFichaTecnicaServicios/FtTipoDeEnvase/FtTipoDeEnvase.service';
import { FtPresentacionDeEnvaseService } from '../../MantenimientoFichaTecnicaServicios/FtPresentacionDeEnvase/FtPresentacionDeEnvase.service';
import { FtColorService } from '../../MantenimientoFichaTecnicaServicios/FtColor/FtColor.service';
import { FtOlorService } from '../../MantenimientoFichaTecnicaServicios/FtOlor/FtOlor.service';
import { FtPhService } from '../../MantenimientoFichaTecnicaServicios/FtPh/FtPh.service';
import { FtMarcaService } from '../../MantenimientoFichaTecnicaServicios/FtMarcas/FtMarcaService.service';
import { FtMarcaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Marcas/FtMarcaDTO';



import { FtMarcaService } from '../../MantenimientoFichaTecnicaServicios/FtMarcas/FtMarcaService.service';
import { FtMarcaDTO } from 'src/app/11_SIR_Produccion.Ficha.Tecnica/interface/MantenimientoFichaTecnicaInterface/Marcas/FtMarcaDTO';


@Injectable({
  providedIn: 'root'
})
export class FtPrecargaDeDatosService {

  public listaDeMarcas: FtMarcaDTO[] = [];
  public listaDeTiposDeUso: FtTipoDeUsoDTO[] = [];
  public listaDeAlergenos: FtAlergenosDTO[] = [];
  public listaDeCondicionesAlmacenamiento: FtCondicionDeAlmacenamientoDTO[] = [];
  public listaDeVidaUtil: FtVidaUtilDTO[] = [];
  public listaDeTiposDeEnvase: FtTipoDeEnvaseDTO[] = [];
  public listaDePresentacionesDeEnvase: FtPresentacionDeEnvaseDTO[] = [];
  public listaDeColores: FtColorDTO[] = [];
  public listaDeOlores: FtOlorDTO[] = [];
  public listaDePh: FtPhDTO[] = [];

  constructor(
    private _FtMarcasService: FtMarcaService,
    private _FtTipoUsoService: FtTipoDeUsoService,
    private _FtAlergenoService: FtAlergenosService,
    private _FtCondicionAlmacenamientoService: FtCondicionAlmacenamientoService,
    private _FtVidaUtilService: FtVidaUtilService,
    private _FtTipoEnvaseService: FtTipoDeEnvaseService,
    private _FtPresentacionEnvaseService: FtPresentacionDeEnvaseService,
    private _FtColorService: FtColorService,
    private _FtOloresService: FtOlorService,
    private _FtPhService: FtPhService
  ) {}

  public CargarAspectosGenerales() {
    this.CargarMarcas()
    this.CargarTiposDeUso();
    this.CargarAlergenos();
    this.CargarCondicionesAlmacenamiento();
    this.CargarVidaUtil();
    this.CargarTiposDeEnvase();
    this.CargarPresentacionesDeEnvase();
  }

  public CargarEspecificaciones() {
    this.CargarColores();
    this.CargarOlores();
    this.CargarPh();
  }


  public listaDeMarcas: FtMarcaDTO[] = [];

  constructor(
    private _FtMarcasService: FtMarcaService,
  ) { }


  public CargarMarcas(){
    this._FtMarcasService.GetListaDeMarcasFichaTecnica().subscribe({
      next: (response) => {

          this.listaDeMarcas = response.resultado

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


  public CargarTiposDeUso(): void {
    this._FtTipoUsoService.GetListaDeTiposDeUsoFichaTecnica().subscribe({
      next: (response) => {
        this.listaDeTiposDeUso = response.resultado
      },
      error: (error) => {
        console.error('Error al obtener los tipos de uso', error);
      }
    });
  }

  public CargarAlergenos(): void {
    this._FtAlergenoService.GetListaDeAlergenosFichaTecnica().subscribe({
      next: (response) => {
        this.listaDeAlergenos = response.resultado
      },
      error: (error) => {
        console.error('Error al obtener los alérgenos', error);
      }
    });
  }

  public CargarCondicionesAlmacenamiento(): void {
    this._FtCondicionAlmacenamientoService.GetListaDeCondicionesFichaTecnica().subscribe({
      next: (response) => {
        this.listaDeCondicionesAlmacenamiento = response.resultado
      },
      error: (error) => {
        console.error('Error al obtener las condiciones de almacenamiento', error);
      }
    });
  }

  public CargarVidaUtil(): void {
    this._FtVidaUtilService.GetListaDeVidaUtilFichaTecnica().subscribe({
      next: (response) => {
        this.listaDeVidaUtil = response.resultado
      },
      error: (error) => {
        console.error('Error al obtener la vida útil', error);
      }
    });
  }

  public CargarTiposDeEnvase(): void {
    this._FtTipoEnvaseService.GetListaDeTiposDeEnvaseFichaTecnica().subscribe({
      next: (response) => {
        this.listaDeTiposDeEnvase = response.resultado
      },
      error: (error) => {
        console.error('Error al obtener los tipos de envase', error);
      }
    });
  }

  public CargarPresentacionesDeEnvase(): void {
    this._FtPresentacionEnvaseService.GetListaDePresentacionesDeEnvaseFichaTecnica().subscribe({
      next: (response) => {
        this.listaDePresentacionesDeEnvase = response.resultado
      },
      error: (error) => {
        console.error('Error al obtener las presentaciones de envase', error);
      }
    });
  }

  public CargarColores(): void {
    this._FtColorService.GetListaDeColoresFichaTecnica().subscribe({
      next: (response) => {
        this.listaDeColores = response.resultado
      },
      error: (error) => {
        console.error('Error al obtener los colores', error);
      }
    });
  }

  public CargarOlores(): void {
    this._FtOloresService.GetListaDeOloresFichaTecnica().subscribe({
      next: (response) => {
        this.listaDeOlores = response.resultado
      },
      error: (error) => {
        console.error('Error al obtener los olores', error);
      }
    }); 
  }

  public CargarPh(): void {
    this._FtPhService.GetListaDePhFichaTecnica().subscribe({
      next: (response) => {
        this.listaDePh = response.resultado
      },
      error: (error) => {
        console.error('Error al obtener los PHs', error);
      }
    });
  }

}
