import { Component, Input } from '@angular/core';
import { PrecioData } from '../../interfaces/PrecioData.interface';

@Component({
  selector: 'xcut-viewer',
  templateUrl: './xcut-viewer.component.html',
  styleUrls: ['./xcut-viewer.component.css']
})
export class XcutViewerComponent {
  @Input() datosXCUT!: PrecioData;
}
