import { state, transition, style, animate, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { PrintContext } from '../printer/print-context';
import { PrinterPrintStrategy } from '../printer/printer-print-strategy';
import { ExcelPrintStrategy } from '../printer/excel-print-strategy';
import { PdfPrintStrategy } from '../printer/pdf-print-strategy';
import { PrintModel } from '../models/print-model.interface';
import { PrintService } from '../services/print.service';
import { ExcelStyleService } from '../services/excel-styles.service';

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
export class ExportacionComponent implements OnInit   {

  @Input() pdf:           boolean = false;
  @Input() excel:         boolean = false;
  @Input() printer:       boolean = false;
  @Input() nombreArchivo: string = '';

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
      data: document.getElementsByClassName('printable')
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
