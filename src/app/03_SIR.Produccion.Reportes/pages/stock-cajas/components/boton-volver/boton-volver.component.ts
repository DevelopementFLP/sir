import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boton-volver',
  templateUrl: './boton-volver.component.html',
  styleUrls: ['./boton-volver.component.css']
})
export class BotonVolverComponent {

constructor(private router: Router){}


redirigir(){
  this.router.navigateByUrl('principal/produccion/stockCajas');
}

}

