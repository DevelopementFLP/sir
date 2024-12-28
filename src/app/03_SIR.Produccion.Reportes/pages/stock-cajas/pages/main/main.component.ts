import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {


  fullscreen() {
    const elem = document.documentElement; // Esto selecciona toda la página
  
    // Verificar si la API de pantalla completa está disponible
    if (elem.requestFullscreen) {
  
      elem.requestFullscreen();
    }
    if (document.exitFullscreen) {

      document.exitFullscreen();
    }
}



}
