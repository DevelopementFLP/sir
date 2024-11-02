import { Component, Input } from '@angular/core';
import { RegistroConPrecio } from '../../interfaces/RegistroConPrecio.interface';

@Component({
  selector: 'pl-per-carton',
  templateUrl: './plper-carton.component.html',
  styleUrls: ['./plper-carton.component.css']
})
export class PLPerCartonComponent {
  @Input() datos: RegistroConPrecio [] = [];
}
