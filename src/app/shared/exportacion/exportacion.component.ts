import { state, transition, style, animate, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input } from '@angular/core';
import { PrintContext } from '../printer/print-context';
import { PrintStrategy } from '../printer/print-strategy';
import { PrinterPrintStrategy } from '../printer/printer-print-strategy';
import { ExcelPrintStrategy } from '../printer/excel-print-strategy';
import { PdfPrintStrategy } from '../printer/pdf-print-strategy';

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
export class ExportacionComponent   {

  @Input() dataToPrint: any;

  private printContext: PrintContext;

  constructor(){
    this.printContext = new PrintContext(new PrinterPrintStrategy());
  }

  printExcel() {
    this.printContext.setPrintStrategy(new ExcelPrintStrategy());
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
