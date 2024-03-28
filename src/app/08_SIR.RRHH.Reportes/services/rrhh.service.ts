import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcionario } from '../interfaces/Funcionario.interface';
import { urlRRHH } from 'src/settings';

@Injectable({providedIn: 'root'})
export class RRHHService {
    constructor(private http: HttpClient) { }
    
    getFuncionariosLogueados(): Observable<Funcionario[]>
    {
        return this.http.get<Funcionario[]>(urlRRHH);
    }
}