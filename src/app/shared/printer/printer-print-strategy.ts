import { PrintStrategy } from "./print-strategy";

// Estrategia de impresión para impresora
export class PrinterPrintStrategy implements PrintStrategy {
    print(dataToPrint: any): void {
      //const WindowPrt = window.open('', '', 'left=0,top=50,width=900,height=900,toolbar=0,scrollbars=0,status=0');
      //if(WindowPrt) {
          let originalContents = document.body.innerHTML;
          document.body.innerHTML = dataToPrint['0'].innerHTML;
          //WindowPrt.document.write(dataToPrint['0'].innerHTML);
          //WindowPrt.document.close();
        //  WindowPrt.focus();
          window.print();
          document.body.innerHTML = originalContents;
          //WindowPrt.close();
      }
    }
