import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { urlConfiguracionPorModulo, urlInsertReporteConfiguracionParametro } from 'src/settings';
import { ConfigurationParameter } from '../../50_SIR.Configuracion.Parametros/interfaces/ConfigurationParameter.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private http: HttpClient) { }

  getConfiguracionPorModulo(): Observable<ConfigurationParameter> {
    return this.http.get<ConfigurationParameter>(urlConfiguracionPorModulo);
  }

  inactivarReporteConfigurationParameter(id: number) {
    return this.http.post(`urlInactivarReporteConfiguracionParametro/${id}`, null);
  }

  deleteReporteConfigurationParameter(id: number): Observable<any> {
    return this.http.delete(`urlDeleteReporteConfiguracionParametro/${id}`);
  }

  insertReporteConfigurationParameter(configuration: ConfigurationParameter): Observable<any>{
    return this.http.post(urlInsertReporteConfiguracionParametro, configuration);
  }

  updateStatusReporteConfigurationParameter(id: number): Observable<any> {
    return this.http.patch(`urlActivarReporteConfiguracionParametro/${id}`, null);
  }
}
