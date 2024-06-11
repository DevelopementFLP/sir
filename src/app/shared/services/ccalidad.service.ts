import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PCC } from '../models/pcc.interface';
import { Observable } from 'rxjs';
import { urlCCRechazoPH, urlPCC } from 'src/settings';
import { OrdinalPH } from 'src/app/06_SIR.ControlCalidad.Reportes/interfaces/OrdinalPH.interface';

@Injectable({
  providedIn: 'root'
})
export class CcalidadService {

  constructor(private http: HttpClient) { }

  public getPCCData( hora: number, especie: string ): Observable<PCC[]> {
    
    const params = new HttpParams()
    .set('hora', hora)
    .set('especie', especie);

    return this.http.get<PCC[]>(urlPCC + "/getPCC", {params});
  } 

  public postRechazosPH(rechazos: OrdinalPH[]): Observable<void> {
    return this.http.post<void>(urlCCRechazoPH, rechazos);
  }
}
