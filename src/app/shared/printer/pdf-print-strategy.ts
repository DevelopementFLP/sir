import { PrintStrategy } from "./print-strategy";

// Estrategia de impresión para PDF
export class PdfPrintStrategy implements PrintStrategy {
    print(data: any): void {

      console.log('Imprimiendo en PDF');
    }
  }