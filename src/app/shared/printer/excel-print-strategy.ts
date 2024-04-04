import { formatDate } from "@angular/common";
import { PrintModel } from "../models/print-model.interface";
import { PrintStrategy } from "./print-strategy";
import * as XLSX from 'xlsx'
import { PrintService } from "../services/print.service";

// Estrategia de impresión para Excel
export class ExcelPrintStrategy implements PrintStrategy {
  private nombreArchivo: string = '';
  private nombreHoja: string = 'Hoja 1';

  constructor(private printService: PrintService) {}
  
  print(data: PrintModel): void {
    let dataToPrint = data;;
    this.nombreArchivo = data.nombreArchivo;
    const wb = XLSX.utils.book_new();
    const ws_name = this.nombreHoja;
    const ws = this.printService.printExcel(1, dataToPrint);
    
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    XLSX.writeFile(wb, this.nombreArchivo + '.xlsx');
  }
}