import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private router: Router
  ) { }

  public navegar(ruta: string): void {
    this.router.navigate(['/' + ruta ]);
  }

  public matchUrl(text: string): boolean {
    return this.router.url.includes(text);
  }
}
