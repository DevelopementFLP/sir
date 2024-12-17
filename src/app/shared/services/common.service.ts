import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  deepCopy<T>(obj: T): T {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => this.deepCopy(item)) as any;
    }
    
    const newObj: Partial<T> = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = this.deepCopy(obj[key]);
        }
    }
    
    return newObj as T;
  }

  extractProperty<T>(array: T[], property: keyof T): any[] {
    return array.map(item => item[property]);
  }

  isNumber(value: string): boolean {
    const numberPattern = /^-?\d+(\.\d+)?$/;
    return numberPattern.test(value);
  }

  formatearFecha(fecha: Date): string {
    let f = new Date(fecha);
    return formatDate(
      f.setHours(f.getHours() + 3),
      'yyyy-MM-dd',
      'es-UY'
    );
  }

}
