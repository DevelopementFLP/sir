import { Component, OnInit } from '@angular/core';
import { IndicadorHuesero } from '../../interfaces/IndicadorHuesero.interface';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-data-huesero-viewer',
  templateUrl: './data-huesero-viewer.component.html',
  styleUrls: ['./data-huesero-viewer.component.css']
})
export class DataHueseroViewerComponent implements OnInit {

  huesero: IndicadorHuesero | undefined;

  constructor(private config: DynamicDialogConfig) {}

  ngOnInit(): void {
    if(this.config) {
      this.huesero = this.config.data.huesero;
    }
  }
}
