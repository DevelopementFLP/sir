import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  constructor() { }

  getScreenWidth(): number {
    return window.innerWidth;
  }

  onResize(callback: () => void): void {
    window.addEventListener('resize', callback);
  }
}
