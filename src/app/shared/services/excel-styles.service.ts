import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';



@Injectable({providedIn: 'root'})
export class ExcelStyleService {
    constructor() { }
    
    formatExcel(idReporte: number, wb: XLSX.WorkBook) {
        switch (idReporte) {
          case 1:
            return this.formatLogueoFuncionarios(wb);
          default:
            return [];
        }
      }
    
    private formatLogueoFuncionarios(wb: XLSX.WorkBook) {
      const ws = wb.Sheets['Hoja 1'];
      
      /* widths */
      const lineWidth = 15;
      const nameWidth = 25;
      const numberWidth = 5;
      const columnWidths: any = [];
      columnWidths[0]   =  {width: numberWidth};
      columnWidths[1]   =  {width: nameWidth};
      columnWidths[2]   =  {width: lineWidth};
      columnWidths[4]   =  {width: numberWidth};
      columnWidths[5]   =  {width: nameWidth};
      columnWidths[6]   =  {width: lineWidth};
      columnWidths[8]   =  {width: numberWidth};
      columnWidths[9]   =  {width: nameWidth};
      columnWidths[10]  =  {width: lineWidth};
      columnWidths[12]  =  {width: numberWidth};
      columnWidths[13]  =  {width: nameWidth};
      columnWidths[14]  =  {width: lineWidth};
      columnWidths[16]  =  {width: nameWidth};
      columnWidths[17]  =  {width: nameWidth};
      columnWidths[18]  =  {width: lineWidth};

      ws['!cols'] = []
      ws['!cols'] = columnWidths
      
      /* merges */
      const merges = [
        {s: {r:0, c:0}, e: {r:0, c:4}},
      ];

      ws['!merges'] = merges;

      /* rows */
      ws['!rows'] = []
      
      /* Estilos */


    }

}