import { Injectable } from '@angular/core';
import { RatioResponse } from '../interfaces/RatioResponse.interface';

@Injectable({providedIn: 'root'})
export class CommonService {
    constructor() { }

     formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
    
       ordenarPorDispositivo(data: RatioResponse) {
        data!.data.sort((a, b) => {
          // Comparamos los valores de 'dispositivo' de a y b, ignorando mayúsculas y minúsculas
          const dispositivoA = a.dispositivo.toUpperCase();
          const dispositivoB = b.dispositivo.toUpperCase();
    
          if (dispositivoA < dispositivoB) {
            return -1; // 'a' viene antes que 'b'
          }
          if (dispositivoA > dispositivoB) {
            return 1; // 'b' viene antes que 'a'
          }
          return 0; // Los dispositivos son iguales
        });
      }
    
}