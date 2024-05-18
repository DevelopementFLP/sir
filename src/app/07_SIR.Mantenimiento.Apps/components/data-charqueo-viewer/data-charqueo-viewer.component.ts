import { Component, OnInit } from '@angular/core';
import { IndicadorCharqueador } from '../../interfaces/IndicadorCharqueador.interface';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-data-charqueo-viewer',
  templateUrl: './data-charqueo-viewer.component.html',
  styleUrls: ['./data-charqueo-viewer.component.css']
})
export class DataCharqueoViewerComponent implements OnInit {

  charqueador: IndicadorCharqueador | undefined;

  constructor(private config: DynamicDialogConfig) {}

  ngOnInit(): void {
    if(this.config) {
      this.charqueador = this.config.data.charqueador;
    }
  }
}
