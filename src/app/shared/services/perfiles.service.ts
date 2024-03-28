import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Perfil } from '../models/perfil.interface';
import { urlPerfiles } from 'src/settings';

@Injectable({
  providedIn: 'root'
})
export class PerfilesService {

  constructor(
    private http: HttpClient
  ) { }

  public getPerfilesList(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(urlPerfiles);
  }
}
