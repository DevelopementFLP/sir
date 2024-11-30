import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnimalesFaenadosDay } from '../interfaces/AnimalesFaenadosDay.interface';
import { urlAnimalesFaenados, urlAnimalesGradeYear } from 'src/settings';
import { AnimalesGradeYear } from '../interfaces/AnimalesGradeYear.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getAnimalesFaenadosDia(): Observable<AnimalesFaenadosDay[]> {
    return this.http.get<AnimalesFaenadosDay[]>(urlAnimalesFaenados);
  }

  getAnimalesGradeYear(): Observable<AnimalesGradeYear[]> {
    return this.http.get<AnimalesGradeYear[]>(urlAnimalesGradeYear);
  }
}
