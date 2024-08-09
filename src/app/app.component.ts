import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'sir';
  es: any;

  constructor(
      private config: PrimeNGConfig
    ) {}

  
  ngOnInit(): void {
    this.es = {
      firstDayOfWeek: 0,
      dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
      dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
      dayNamesMin: [ "Dom","Lun","Mar","Mie","Jue","Vie","Sáb" ],
      monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
      monthNamesShort: [ "Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic" ],
      today: 'Hoy',
      clear: 'Borrar',
      addRule: 'Agregar regla',
      apply: 'Aplicar',
      startsWith: 'Empieza con',
      contains: 'Contiene',
      notContains: 'No contiene',
      endsWith: 'Termina con',
      equals: 'Es igual',
      notEquals: 'No es igual',
      removeRule: 'Eliminar regla',
      matchAll: 'Coincidir todos',
      matchAny: 'Coincidir alguno',
      noFilter: 'Borrar filtro'
  };

  this.config.setTranslation(this.es);
 
} 

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
