import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Empleado } from '../interfaces/Empleado.interface';

@Injectable({providedIn: 'root'})
export class FuncionariosService {
    
    private dataSubject = new BehaviorSubject<Empleado | null>(null);
    data$ = this.dataSubject.asObservable();

    constructor() { }
    
    setData(data: Empleado) {
        this.dataSubject.next(data);
    }

    clearData() {
        this.dataSubject.next(null);
    }
 }