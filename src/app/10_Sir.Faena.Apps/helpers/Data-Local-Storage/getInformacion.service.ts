import { ConfiguracionesDTO } from './../../Interfaces/ConfiguracionesDTO';
import { Injectable } from '@angular/core';
import { ConfiguracionAbastoService } from '../../Services/configuracionAbasto.service';
import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilidades/UtilidadesService.service';

@Injectable({
  providedIn: 'root'
})
export class GetInformacionService {

  constructor(
    private _configuracionesAbasto: ConfiguracionAbastoService,
    private _utilidadesServicicio: UtilidadesService,
  ) { }

 // Obtener configuraciones desde la API y guardarlas en localStorage
  async obtenerConfiguraciones(): Promise<ConfiguracionesDTO[]> {
    try {
      const data = await this._configuracionesAbasto.GetParametrosSeccionAbasto().toPromise();
      const parametrosDeConfiguracion = data!.resultado;
      localStorage.setItem('configuraciones', JSON.stringify(parametrosDeConfiguracion));
      return parametrosDeConfiguracion;
    } catch (e) {
      this._utilidadesServicicio.mostrarAlerta("Error al obtener los datos", "Error");
      throw e;
    }
  }

   // Cargar configuraciones desde localStorage o API
   cargarConfiguraciones(): ConfiguracionesDTO[] {
     const configuracionDesdeLocalStorage = localStorage.getItem('configuraciones');
     if (configuracionDesdeLocalStorage) {
       return JSON.parse(configuracionDesdeLocalStorage);
     } else {
       throw new Error("No se encontraron configuraciones en localStorage");
     }
   }

}
