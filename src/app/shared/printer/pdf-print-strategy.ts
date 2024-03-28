import { PrintStrategy } from "./print-strategy";

// Estrategia de impresión para PDF
export class PdfPrintStrategy implements PrintStrategy {
    print(data: any): void {
      // Lógica para imprimir en PDF
      console.log('Imprimiendo en PDF');
      // Puedes usar alguna librería para generar archivos PDF.
    }
  }