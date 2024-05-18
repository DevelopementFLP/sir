import { Component, Input } from '@angular/core';

@Component({
  selector: 'total-empaque',
  templateUrl: './total-empaque.component.html',
  styleUrls: ['./total-empaque.component.css']
})
export class TotalEmpaqueComponent {
  @Input() titulo: string = 'TOTAL';
  @Input() cortes: number = 0;
  @Input() kilos: number = 0;
}
