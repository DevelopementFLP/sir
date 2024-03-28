import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environments } from "../../environments/environments";
import { RatioResponse } from '../interfaces/RatioResponse.interface';
import { DispositivoResponse } from '../interfaces/DispositivoResponse.interface';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class DashboardService {
    
    private baseUrl: string = environments.baseUrl

    constructor(
        private http: HttpClient,
        private router: Router
        ) { }

    getRatioError(fechaDesde: string, fechaHasta: string) : Observable<RatioResponse> {
        const query = `${this.baseUrl}/GetErrorRatio?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
        return this.http.get<RatioResponse>(query);
    }

    gerRatioErrorByDeviceName(dispositivo: string, fechaDesde: string, fechaHasta: string) : Observable<RatioResponse> {
        const query = `${this.baseUrl}/GetErrorRatioByDeviceName?dispositivo=${dispositivo}&fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
        return this.http.get<RatioResponse>(query);
    } 

    getDeviceByName(dispositivo: String) : Observable<DispositivoResponse> {
        const query = `${this.baseUrl}/GetDispositivo?dispositivo=${dispositivo}`;
        return this.http.get<DispositivoResponse>(query);
    }

    checkServerConnection(): void {
        this.http.get(this.baseUrl)
          .pipe(
            catchError(error => {
              if (error && error.status === 0) {
                this.router.navigate(['/no-connection'])
                // Aquí puedes realizar acciones adicionales según el tipo de error
                return of(null)
              }
              return throwError(error);
            })
          )
          .subscribe(response => {
            console.log('Conexión exitosa:', response);
            // Aquí puedes realizar acciones adicionales en caso de una conexión exitosa
          });
      }

}