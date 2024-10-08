import { state, transition, style, animate, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PrintContext } from '../printer/print-context';
import { PrinterPrintStrategy } from '../printer/printer-print-strategy';
import { ExcelPrintStrategy } from '../printer/excel-print-strategy';
import { PdfPrintStrategy } from '../printer/pdf-print-strategy';
import { PrintModel } from '../models/print-model.interface';
import { PrintService } from '../services/print.service';
import { ExcelStyleService } from '../services/excel-styles.service';
import { InconsistenciaDataPrint } from 'src/app/08_SIR.RRHH.Reportes/interfaces/InconsistenciaDataPrint.interface';

@Component({
  selector: 'sir-exportacion',
  templateUrl: './exportacion.component.html',
  styleUrls: ['./exportacion.component.css'],
  animations: [
    trigger('slideInOut', [
      state('void', style({ transform: 'translateX(100%)' })),
      transition(':enter', [
        animate('200ms ease-in-out', style({ transform: 'translateX(0%)' })) 
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({ transform: 'translateX(100%)' })) 
      ])
    ])
  ],
})
export class ExportacionComponent implements OnInit, OnChanges  {

  @Input() pdf:           boolean = false;
  @Input() excel:         boolean = false;
  @Input() printer:       boolean = false;
  @Input() nombreArchivo: string = '';
  @Input() data: InconsistenciaDataPrint | undefined = undefined;
  @Input() dataPrint: any;

  dataToPrint!: PrintModel;

  private printContext: PrintContext;

  @Input() idReporte: number = 0;

  constructor(
    private printService: PrintService,
    private formatService: ExcelStyleService){
    this.printContext = new PrintContext(new PrinterPrintStrategy());
  }

  ngOnInit(): void {
    this.dataToPrint = {
      nombreArchivo: this.nombreArchivo,
      data: this.data != undefined ? this.data : (this.dataPrint != undefined ? this.dataPrint : document.getElementsByClassName('printable'))
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['nombreArchivo']) {
      this.dataToPrint = {
        nombreArchivo: this.nombreArchivo,
        data: this.data != undefined ? this.data : (this.dataPrint != undefined ? this.dataPrint : document.getElementsByClassName('printable'))
      }
    }
  }

  printExcel() {
    this.printContext.setPrintStrategy(new ExcelPrintStrategy(this.idReporte, this.printService, this.formatService));
  
    this.printContext.print(this.dataToPrint);
  }

  printPdf() {
    this.printContext.setPrintStrategy(new PdfPrintStrategy());
    this.printContext.print(this.dataToPrint);
  }

  printPrinter() {
    this.printContext.setPrintStrategy(new PrinterPrintStrategy());
    this.printContext.print(this.dataToPrint);
  }
}
