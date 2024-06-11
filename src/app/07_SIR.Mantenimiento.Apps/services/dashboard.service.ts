import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environments } from "../../environments/environments";
import { RatioResponse } from '../interfaces/RatioResponse.interface';
import { DispositivoResponse } from '../interfaces/DispositivoResponse.interface';
import { Router } from '@angular/router';
import { EagleData } from '../interfaces/EagleData.interface';
import { EagleResponse } from '../interfaces/EagleResponse.interface';

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

      formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); 
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    getFirstDayOfWeek(date: Date) : Date {
        const dayOfWeek = date.getDay(); 
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); 
        return new Date(date.setDate(diff)); 
      }
    
    getLastDayOfWeek(date: Date) : Date {   
        const firstDayOfWeek = date;
        const lastDayOfWeek = new Date(firstDayOfWeek); 
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); 
        return lastDayOfWeek;
      }

    getFilteredData(dataEagle: EagleResponse, day: string) : EagleData[] {
        const targetDate: Date = new Date(day);
        return dataEagle.data.filter(date => {
            const dataDate: Date = new Date(date.time);
            return dataDate >= targetDate;
        })
    }

    getDaysOfWeek(firstDay: Date): string[] {
        const days: string[] = [];
        const currentDay: Date = new Date();
        let currentDatePointer = new Date(firstDay);

        while(currentDatePointer <= currentDay){
            days.push(this.formatDate(currentDatePointer));
            currentDatePointer.setDate(currentDatePointer.getDate() + 1);
        }
        return days;
    }

    getRechazos(dataEagle: EagleData[]): number {
        return dataEagle.filter( lectura => { return lectura.bankidx === 0 }).length;
      }
    
    getNoLeidos(dataEagle: EagleData[]): number {
        return dataEagle.filter( lectura => { return lectura.barcode === '' || lectura.barcode === '1000000000' }).length;
    }

    getDataByDate(dataEagle: EagleData[], daysOfWeek: string[]): EagleData[][] {
        const data: EagleData[][] = [];
       
        daysOfWeek.forEach(day => {
            const today: Date = new Date(day);
            const nextDay: Date = new Date(today);
            nextDay.setDate(today.getDate() + 1);
            data.push(dataEagle.filter( d => { return  new Date(d.time) > today && new Date(d.time) < nextDay }))
        });
        
        return data;
    }

    getLecturesCount(data: EagleData[][]): number[] {
        let n: number[] = [];
    
        data.forEach(d => {
            n.push(d.length)
        });
        return n;
    }

    getRechazoCount(data: EagleData[][]): number[]{
        let n: number[] = [];
        data.forEach(d => {
            n.push( d.filter(x => { return x.bankidx === 0 }).length)
        });
        return n;
    }

    getNoReadCount(data: EagleData[][]): number[]{
        let n: number[] = [];
        console.log(data)
        data.forEach(d => {
            n.push(d.filter(x => { return x.barcode === '' || x.barcode === '1000000000' }).length)
        });
        return n;
    }


}