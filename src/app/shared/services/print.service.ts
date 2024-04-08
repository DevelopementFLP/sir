import { Injectable } from '@angular/core';

import { PrintModel } from '../models/print-model.interface';
import { Fill, ImagePosition, Workbook } from 'exceljs';
import { formatDate } from '@angular/common';
import { LOGO_RGB_V1_BEIGE } from '../models/logos/RGB_v1-beige';

@Injectable({ providedIn: 'root' })
export class PrintService {
  constructor() {}

  printExcel(idReporte: number, dataToPrint: PrintModel, libro: Workbook) {
    switch (idReporte) {
      case 1:
        return this.printLogueoFuncionarios(dataToPrint, libro);
      case 2:
        return this.printLogueadasPorFuncionario(dataToPrint, libro);
      default:
        return [];
    }
  }



  /*LOGUEO FUNCIONARIOS*/
  private printLogueoFuncionarios(dataToPrint: PrintModel, libro: Workbook) {
    const lineas = this.nuevaHojaFuncionarios(dataToPrint, libro);
    return lineas;
  }

  private printLogueadasPorFuncionario(dataToPrint: PrintModel, libro: Workbook) {
    const data: string[] = dataToPrint.data['0'].innerText.split('\n');
    console.log(data);
    const funcionario:string = data[0];
    const fecha: string = data[1];
    const titulares: string[] = [data[2], data[3], data[4], data[5]];
    const tiempoTotalTitular: string = data[data.length - 2]; console.log(tiempoTotalTitular);
    const tiempoTotal: string = data[data.length - 1]; console.log(tiempoTotal);
    const sheet =  libro.addWorksheet('Logueadas ' + funcionario);
    let fila = 11;
    let columna = 2;

    const fondoNegro: Fill = { 
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF000000' },
      bgColor: { argb: '00000000'  }
    };  

    /* logo */
    const idLogo = libro.addImage({
      base64: LOGO_RGB_V1_BEIGE,
      extension: 'png'
    });
    
    const position: ImagePosition = {
      tl:   { col: 0.9, row: 0.0 },
      ext:  { width: 200, height: 100 }
    };

    sheet.addImage(idLogo, position)
    
    /* titulo */
    const mergeCells = [
      { start: { row: 2, col: 2  }, end: { row: 4, col:  9} },
    ]

    mergeCells.forEach(range => {
      sheet.mergeCells(range.start.row, range.start.col, range.end.row, range.end.col);
    })

    const titular = sheet.getCell("B2");
    titular.fill = fondoNegro;
    titular.font = { bold: true, size: 19, color: { argb: 'FFFFFFFF' } };
    titular.style.alignment = { vertical: 'middle', horizontal: 'right' };
    titular.value = 'Logueadas por funcionario';


    /* nombre funcionario */
    const celdaTitulo = sheet.getCell(fila - 5, 2);
    celdaTitulo.value = funcionario;
    celdaTitulo.font = { bold: true, size: 14}

    /* fecha */
    const celdaFecha = sheet.getCell(fila - 4, 2);
    celdaFecha.value = fecha;


    /* encabezados de tabla */
    const celdasTitulares = [
      { celda: { row: fila - 2, col: 2  } }, { celda: { row: fila - 2, col:  4} },
      { celda: { row: fila - 2, col: 6  } }, { celda: { row: fila - 2, col:  8} },
    ];

    for(let i = 0; i <= 3; i++) {
      const celda = sheet.getCell(celdasTitulares[i].celda.row, celdasTitulares[i].celda.col);
      celda.value = titulares[i];
      celda.font =  { bold: true, size: 12 };
    }

    /* datos logueo */
    for(let i = 6; i < data.length - 2; i++) {
      if(columna % 10 == 0)
      {
        fila++;
        columna = 2;
      }        
      const celda = sheet.getCell(fila, columna);
      celda.value = data[i];
      columna += 2;
    }

    /* total */
    const celdaTituloTotal = sheet.getCell(fila += 2, 2);
    celdaTituloTotal.value = tiempoTotalTitular;
    celdaTituloTotal.font = { bold: true, size: 12 };

    const celdaTiempoTotal = sheet.getCell(fila, 8);
    celdaTiempoTotal.value = tiempoTotal;
    celdaTiempoTotal.font = { bold: true, size: 12 };

  }

  private parseDataFuncionarios(data: PrintModel) {
    const lines = data.data['0'].innerText.split('\n');
    const parsedData: { [key: string]: string[] } = {};
    let currentLine = '';
    const lineas = [];

    for (const line of lines) {
      if (line.startsWith('Línea')) {
        currentLine = line.trim();
        parsedData[currentLine] = [];
      } else if (line.trim() !== '') {
        parsedData[currentLine].push(line.trim());
      }
    }

    const dataArray: any[][] = [];
    dataArray.push([data.nombreArchivo]);
    dataArray.push([]);
    for (const key in parsedData) {
      const lineArray = [key, ...parsedData[key]];
      dataArray.push(lineArray);
    }

    for (let i = 2; i < dataArray.length; i++) {
      const indHueseros = dataArray[i].findIndex((x) => x.includes('HUESEROS'));
      const indCharqueo = dataArray[i].findIndex((x) =>
        x.includes('CHARQUEADORES')
      );
      let finHueseros;
      const line = [];

      line.push(dataArray[i][0]);
      if (indHueseros >= 0) {
        line.push(dataArray[i][indHueseros]);
        if (indCharqueo >= 0) {
          finHueseros = indCharqueo - 1;
        } else {
          finHueseros = dataArray[i].length;
        }

        for (let j = indHueseros + 1; j < finHueseros - 3; j = j + 3) {
          line.push(
            dataArray[i][j] +
              ' ' +
              dataArray[i][j + 1] +
              ' ' +
              dataArray[i][j + 2]
          );
        }
      }

      if (indCharqueo >= 0) {
        line.push(dataArray[i][indCharqueo]);
        for (let j = indCharqueo + 1; j < dataArray[i].length - 2; j = j + 3) {
          line.push(
            dataArray[i][j] +
              ' ' +
              dataArray[i][j + 1] +
              ' ' +
              dataArray[i][j + 2]
          );
        }
      }

      lineas.push(line);
    }
    return dataArray;
  }

  private nuevaHojaFuncionarios(dataToPrint: PrintModel, libro: Workbook) {
    const lineas = this.parseDataFuncionarios(dataToPrint);
    const fecha: Date = new Date();
    const sheet =  libro.addWorksheet('Logueos ' + formatDate(fecha, "dd-MM-yyyy", "es-UY"));
    const lineWidth = 16;
    const nameWidth = 25;
    const numberWidth = 10;
    const rangoImpresion = "B2:T34";

    const grayColor = { argb: 'FFDDDDDD' }; 
    const lightGrayColor = { argb: 'FFF4F6F6' }; 

   const fondoHueseros: Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: grayColor 
    };

    const fondoCharqueadores: Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: lightGrayColor 
    };


    /* width nroFuncionario */
    sheet.getColumn(2).width  = numberWidth;
    sheet.getColumn(6).width  = numberWidth;
    sheet.getColumn(10).width = numberWidth;
    sheet.getColumn(14).width = numberWidth;
    sheet.getColumn(18).width = numberWidth;

    /* width nombre */
    sheet.getColumn(3).width  = nameWidth;
    sheet.getColumn(7).width  = nameWidth;
    sheet.getColumn(11).width = nameWidth;
    sheet.getColumn(15).width = nameWidth;
    sheet.getColumn(19).width = nameWidth;

    /* widht linea */
    sheet.getColumn(4).width  = lineWidth;
    sheet.getColumn(8).width  = lineWidth;
    sheet.getColumn(12).width = lineWidth;
    sheet.getColumn(16).width = lineWidth;
    sheet.getColumn(20).width = lineWidth;

    sheet.getColumn(1).width = 5;

    sheet.columns.forEach((column) => {
      column.alignment = {vertical: 'middle', horizontal: 'center'}
    });

    sheet.getColumn(3).alignment  = { horizontal: 'left' };
    sheet.getColumn(7).alignment  = { horizontal: 'left' };
    sheet.getColumn(11).alignment = { horizontal: 'left' };
    sheet.getColumn(15).alignment = { horizontal: 'left' };    
    sheet.getColumn(19).alignment = { horizontal: 'left' };;

    /* logo */
    const idLogo = libro.addImage({
      base64: LOGO_RGB_V1_BEIGE,
      extension: 'png'
    });
    
    const position: ImagePosition = {
      tl:   { col: 1.7, row: 0.0 },
      ext:  { width: 200, height: 100 }
    };

    sheet.addImage(idLogo, position)

    /* titulo */
    const lastCol = 20;
    const mergeCells = [
      { start: { row: 2, col: 2  }, end: { row: 4, col: lastCol } },
      { start: { row: 6, col: 2  }, end: { row: 6, col: 4  } },
      { start: { row: 6, col: 6  }, end: { row: 6, col: 8  } },
      { start: { row: 6, col: 10 }, end: { row: 6, col: 12 } },
      { start: { row: 6, col: 14 }, end: { row: 6, col: 16 } },
      { start: { row: 6, col: 18 }, end: { row: 6, col: 20 } },
      { start: { row: 8, col: 2  }, end: { row: 8, col: 4  } },
      { start: { row: 8, col: 6  }, end: { row: 8, col: 8  } },
      { start: { row: 8, col: 10 }, end: { row: 8, col: 12 } },
      { start: { row: 8, col: 14 }, end: { row: 8, col: 16 } },
      { start: { row: 8, col: 18 }, end: { row: 8, col: 20 } },
    ];

    mergeCells.forEach(range => {
      sheet.mergeCells(range.start.row, range.start.col, range.end.row, range.end.col);
    })
    
    const fondoNegro: Fill = { 
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF000000' },
      bgColor: { argb: '00000000'  }
    }; 
    const titleCell = sheet.getCell("D3");
    titleCell.value = dataToPrint.nombreArchivo;
    titleCell.font = { bold: true, size: 21, color: { argb: 'FFFFFFFF' } };
    titleCell.style.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.style.fill = fondoNegro;

    
    /* escribir la data */
    let fila = 6;
    let columna = 2;
    
    for (let l = 2; l < lineas.length; l++) {
      const indHueseros = lineas[l].findIndex((x) => x.includes('HUESEROS'));
      const indCharqueo = lineas[l].findIndex((x) => x.includes('CHARQUEADORES'));
      let finHueseros: number = 0;

      if (indHueseros >= 0) {
        if (indCharqueo >= 0) finHueseros = indCharqueo - 1;
        else  finHueseros = lineas[l].length;
      }
      
      const lineaTitle = sheet.getCell(fila, columna + 1);
      lineaTitle.value = lineas[l][0];
      lineaTitle.value = lineaTitle.value?.toString().toUpperCase();
      lineaTitle.font = { bold: true, size: 16, color: { argb: 'FF000000' } };
      lineaTitle.style.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC0C0C0' }, 
        bgColor: { argb: '00000000' }  
    }

      fila = fila + 2; 

      if(indHueseros >= 0) {
        const tituloHuesero = sheet.getCell(fila, columna + 1);
        tituloHuesero.value = lineas[l][1];
        tituloHuesero.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
        tituloHuesero.fill = fondoNegro;
        fila++;
        
        for (let j = 2; j < finHueseros; j = j + 3) {
          const celdaNro = sheet.getCell(fila, columna);
          celdaNro.value = lineas[l][j];
          celdaNro.font = { size: 12 };
          celdaNro.fill = fondoHueseros;

          const celdaNombre = sheet.getCell(fila, columna + 1);
          celdaNombre.value = lineas[l][j + 1];
          celdaNombre.font = { size: 12 };
          celdaNombre.fill = fondoHueseros;

          const celdaLinea = sheet.getCell(fila, columna + 2);
          celdaLinea.value = lineas[l][j + 2];
          celdaLinea.font = { size: 12 };
          celdaLinea.fill = fondoHueseros;

          fila++;
      }
      fila++;
    }

      if(indCharqueo >= 0) {
          const chMerge = [
             { start: { row: fila, col: columna }, end: { row: fila, col: columna + 2 } },          
          ]

          const startRow  = chMerge[0].start.row;
          const endRow    = chMerge[0].end.row;
          const startCol  = chMerge[0].start.col;
          const endCol    = chMerge[0].end.col;
          let isMerged = false;

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                const cell = sheet.getCell(row, col);
                
                if (cell.isMerged) {
                    isMerged = true;
                    break;
                }
            }
            if (isMerged) {
                break; 
            }
        }

        if (!isMerged) {
          sheet.mergeCells(chMerge[0].start.row, chMerge[0].start.col, chMerge[0].end.row, chMerge[0].end.col);
        } 
        const tituloCharqueo = sheet.getCell(fila, columna + 1);
        tituloCharqueo.value = lineas[l][indCharqueo];
        tituloCharqueo.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
        tituloCharqueo.fill = fondoNegro;
        
        
        fila++;

        for (let j = indCharqueo + 1; j < lineas[l].length; j = j + 3) {
          const celdaNro = sheet.getCell(fila, columna);
          celdaNro.value = lineas[l][j];
          celdaNro.font = { size: 12 };
          celdaNro.fill = fondoCharqueadores;

          const celdaNombre = sheet.getCell(fila, columna + 1);
          celdaNombre.value = lineas[l][j + 1];
          celdaNombre.font = { size: 12 };
          celdaNombre.fill = fondoCharqueadores;

          const celdaLinea = sheet.getCell(fila, columna + 2);
          celdaLinea.value = lineas[l][j + 2];
          celdaLinea.font = { size: 12 };
          celdaLinea.fill = fondoCharqueadores;

          fila++;
        }
    }

      fila = 6;
      columna += 4;
    }

    sheet.pageSetup.printArea = rangoImpresion;
    sheet.pageSetup.orientation = 'landscape';
    sheet.pageSetup.fitToPage = true;
  }
  /**/

}
