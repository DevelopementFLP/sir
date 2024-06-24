
import { PrintModel } from "../models/print-model.interface";
import { PrintStrategy } from "./print-strategy";
import { PrintService } from "../services/print.service";
import { ExcelStyleService } from "../services/excel-styles.service";
import { Workbook } from "exceljs";
import * as fs from 'file-saver';
import { formatDate } from "@angular/common";

// Estrategia de impresión para Excel
export class ExcelPrintStrategy implements PrintStrategy {
  private nombreArchivo: string = '';
  private nombreHoja: string = 'Hoja 1';
  private _workbook!: Workbook;

  constructor(
    private idReporte: number,
    private printService: PrintService,
    private formatService: ExcelStyleService
    ) {}
  
  print(data: PrintModel): void {
    let dataToPrint = data;;
    this.nombreArchivo = data.nombreArchivo;

    this._workbook = new Workbook();
    const fecha: Date = new Date();
    this._workbook.creator = 'SIR - FLP - ' + fecha.getFullYear().toString();
   
    this.printService.printExcel(this.idReporte, dataToPrint, this._workbook)
    this._workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data])
      fs.saveAs(blob, this.nombreArchivo + ".xlsx");
    })

  }
}