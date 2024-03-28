import { PrintStrategy } from "./print-strategy";
import * as XLSX from 'xlsx'

// Estrategia de impresión para Excel
export class ExcelPrintStrategy implements PrintStrategy {
  
  private fecha: string = '';
  private nombreArchivo: string = '';
  private nombreHoja: string = '';
  
  print(data: any): void {
      const wb = XLSX.utils.book_new();
      const ws_name = this.nombreHoja + ' ' + this.fecha;
      const content = data;

      const ws_data = [
          [content]
      ];

      const ws = XLSX.utils.aoa_to_sheet(ws_data);
      XLSX.utils.book_append_sheet(wb, ws, ws_name);
      XLSX.writeFile(wb, this.nombreArchivo + '.xlsx');
    }
  }