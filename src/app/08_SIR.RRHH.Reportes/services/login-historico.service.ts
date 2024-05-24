import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginHistorico } from '../interfaces/LoginHistorico.interface';
import { urlLoginHistorico } from 'src/settings';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoginHistoricoService {

  constructor(private http: HttpClient) { }

  getLoginHistorico(fecha: Date): Observable<LoginHistorico[]> {
    const fechaFormat: string = formatDate(fecha, "yyyyMMdd", "es-UY");
    return this.http.get<LoginHistorico[]>(`${urlLoginHistorico}?fechaDesde=${fechaFormat}&fechaHasta=${fechaFormat}`);
  }

}
