import { Component, Input } from '@angular/core';
import { XFCL } from '../../interfaces/XFCL.interface';

@Component({
  selector: 'xfcl-viewer',
  templateUrl: './xfcl-viewer.component.html',
  styleUrls: ['./xfcl-viewer.component.css']
})
export class XfclViewerComponent {

  @Input() datosXFCL!: XFCL;

}
