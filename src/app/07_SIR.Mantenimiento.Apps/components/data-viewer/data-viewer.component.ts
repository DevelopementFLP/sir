import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-viewer',
  templateUrl: './data-viewer.component.html',
  styleUrls: ['./data-viewer.component.css']
})
export class DataViewerComponent {
  @Input() titulo: string = "";
  @Input() data: number = 0;

  @Input() porcentaje: boolean = false;
}
