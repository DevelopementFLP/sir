import { PrintStrategy } from "./print-strategy";

export class PrintContext {
    private printStrategy: PrintStrategy;
  
    constructor(printStrategy: PrintStrategy) {
      this.printStrategy = printStrategy;
    }
  
    setPrintStrategy(printStrategy: PrintStrategy) {
      this.printStrategy = printStrategy;
    }
  
    print(data: any) {
      this.printStrategy.print(data);
    }
  }
  