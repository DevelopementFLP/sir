import { Injectable } from '@angular/core';

import { PrintModel } from '../models/print-model.interface';
import { Fill, Font, ImagePosition, Workbook } from 'exceljs';
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
      case 3:
        return this.printProductosGraseria(dataToPrint, libro);
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
    const funcionario:string = data[0];
    const fecha: string = data[1];
    const titulares: string[] = [data[2], data[3], data[4], data[5]];
    const tiempoTotalTitular: string = data[data.length - 2]; 
    const tiempoTotal: string = data[data.length - 1]; 
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

  /* PRODUCTOS A GRASERÍA MAREL */
  private printProductosGraseria(dataToPrint: PrintModel, libro: Workbook) {
    const data = dataToPrint.data['0'].innerText.split('\n');
    const titulo = data[0];
    const tituloDesde = data[2];
    const fechaDesde = data[7].split(' ')[0]; 
    const tituloHasta = data[4];
    const fechaHasta = data[7].split(' ')[1]; 
    const tituloDelanteros = data[8];
    const tituloTraseros = data[9];
    const tituloTotalCuartos = data[10];
    const cuartosDelanteros = data[11];
    const cuartosTraseros = data[12];
    const cuartosTotal = data[13];
    const tituloKilosDelanteros = data[14];
    const tituloKilosTraseros = data[15];
    const tituloKilosTotalCuartos = data[16];
    const kilosCuartosDelanteros = data[17];
    const kilosCuartosTraseros = data[18];
    const kilosCuartosTotalCuartos = data[19];
    const tituloCajas = data[20];
    const tituloKilosCajas = data[21];
    const cantidadCajas = data[22];
    const kilosCajas = data[23];
    const tituloCajasJumbo = data[24];
    const tituloKilosCajasJumbo = data[25];
    const cantidadCajasJumbo = data[26];
    const kilosCajasJumbo = data[27];
    const tituloKilosGraseria = data[28];
    const kilosGraseria = data[29];
    const sheet = libro.addWorksheet('PRODUCTOS A GRASERIA');

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
    titular.style.alignment = { vertical: 'middle', horizontal: 'center' };
    titular.value = titulo + '   ';

    /* fechas */
    const cellTituloDesde = sheet.getCell("B6");
    const cellTituloHasta = sheet.getCell("B7");

    cellTituloDesde.value = tituloDesde + ' ' + fechaDesde;
    //cellDesde.value = fechaDesde;
    cellTituloHasta.value = tituloHasta + ' ' + fechaHasta;
    //cellHasta.value = fechaHasta

    /* data */
    /* cuartos*/
    const cellTituloDelantero = sheet.getCell("B10");
    const cellTituloTrasero = sheet.getCell("B11");
    const cellTituloTotalCuartos = sheet.getCell("B12");
    const cellCuartosDelantero = sheet.getCell("C10");
    const cellCuartosTrasero = sheet.getCell("C11");
    const cellCuartosTotalCuartos = sheet.getCell("C12");
    const cellTituloKilosDelantero = sheet.getCell("E10");
    const cellTituloKilosTrasero = sheet.getCell("E11");
    const cellTituloKilosTotalCuartos = sheet.getCell("E12");
    const cellCuartosKilosDelantero = sheet.getCell("F10");
    const cellCuartosKilosTrasero = sheet.getCell("F11");
    const cellCuartosKilosTotalCuartos = sheet.getCell("F12");

    cellTituloDelantero.value = tituloDelanteros;
    cellTituloTrasero.value = tituloTraseros;
    cellTituloTotalCuartos.value = tituloTotalCuartos;
    cellCuartosDelantero.value = cuartosDelanteros;
    cellCuartosTrasero.value = cuartosTraseros;
    cellCuartosTotalCuartos.value = cuartosTotal;
    cellTituloKilosDelantero.value = tituloKilosDelanteros;
    cellTituloKilosTrasero.value = tituloKilosTraseros;
    cellTituloKilosTotalCuartos.value = tituloKilosTotalCuartos;
    cellCuartosKilosDelantero.value = kilosCuartosDelanteros;
    cellCuartosKilosTrasero.value = kilosCuartosTraseros;
    cellCuartosKilosTotalCuartos.value = kilosCuartosTotalCuartos;
    
    /* cajas */
    const cellTituloCajas = sheet.getCell("H10");
    const cellCajas = sheet.getCell("I10");
    const cellTituloKilosCajas = sheet.getCell("H11");
    const cellKilosCajas = sheet.getCell("I11");

    cellTituloCajas.value = tituloCajas;
    cellCajas.value = cantidadCajas;
    cellTituloKilosCajas.value = tituloKilosCajas;
    cellKilosCajas.value = kilosCajas;

    /* cajas jumbo */
    const cellTituloCajasJumbo = sheet.getCell("B15");
    const cellCajasJumbo = sheet.getCell("C15");
    const cellTituloKilosJumbo = sheet.getCell("B16");
    const cellKilosJumbo = sheet.getCell("C16");

    cellTituloCajasJumbo.value = tituloCajasJumbo;
    cellCajasJumbo.value = cantidadCajasJumbo;
    cellTituloKilosJumbo.value = tituloKilosCajasJumbo;
    cellKilosJumbo.value = kilosCajasJumbo;

    /* graseria */
    const cellTituloKilosGraseria = sheet.getCell("E16");
    const cellKilosGraseria = sheet.getCell("F16");

    cellTituloKilosGraseria.value = tituloKilosGraseria;
    cellKilosGraseria.value = kilosGraseria;

    /* ancho columnas */
    const titleWidth = 25;
    const valueWidth = 16;
    sheet.getColumn(2).width = titleWidth;
    sheet.getColumn(5).width = titleWidth;
    sheet.getColumn(8).width = titleWidth;
    sheet.getColumn(3).width = valueWidth;
    sheet.getColumn(6).width = valueWidth;
    sheet.getColumn(9).width = valueWidth;

    /* formato celdas */
    const fuenteFecha = { bold: true, size: 12 }

    cellTituloDesde.font = fuenteFecha;
    cellTituloHasta.font = fuenteFecha;

    const fuenteTitulo = { bold: true, size: 13};

    cellTituloDelantero.font = fuenteTitulo;
    cellTituloTrasero.font = fuenteTitulo;
    cellTituloTotalCuartos.font = fuenteTitulo;
    cellTituloKilosDelantero.font = fuenteTitulo;
    cellTituloKilosTrasero.font = fuenteTitulo;
    cellTituloKilosTotalCuartos.font = fuenteTitulo;
    cellTituloCajas.font = fuenteTitulo;
    cellTituloKilosCajas.font = fuenteTitulo;
    cellTituloCajasJumbo.font = fuenteTitulo;
    cellTituloKilosJumbo.font = fuenteTitulo;

    const fuenteValores = { size: 14 }

    cellCuartosDelantero.font = fuenteValores;
    cellCuartosDelantero.alignment =  { vertical: 'middle', horizontal: 'right' };
    cellCuartosTrasero.font = fuenteValores;
    cellCuartosTrasero.alignment =  { vertical: 'middle', horizontal: 'right' };
    cellCuartosTotalCuartos.font = fuenteValores;
    cellCuartosTotalCuartos.alignment =  { vertical: 'middle', horizontal: 'right' };
    cellCuartosKilosDelantero .font = fuenteValores;
    cellCuartosKilosDelantero.alignment =  { vertical: 'middle', horizontal: 'right' };
    cellCuartosKilosTrasero.font = fuenteValores;
    cellCuartosKilosTrasero.alignment =  { vertical: 'middle', horizontal: 'right' };
    cellCuartosKilosTotalCuartos.font = fuenteValores;
    cellCuartosKilosTotalCuartos.alignment =  { vertical: 'middle', horizontal: 'right' };
    cellCajas.font = fuenteValores;
    cellCajas.alignment = { vertical: 'middle', horizontal: 'right' };
    cellKilosCajas.font = fuenteValores;
    cellKilosCajas.alignment = { vertical: 'middle', horizontal: 'right' };
    cellCajasJumbo.font = fuenteValores;
    cellCajasJumbo.alignment = { vertical: 'middle', horizontal: 'right' };
    cellKilosJumbo.font = fuenteValores;
    cellKilosJumbo.alignment = { vertical: 'middle', horizontal: 'right' };
    
    const fondoTotal: Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEBEDEF'},
      bgColor: { argb: '00000000'}
    }

    cellCuartosTotalCuartos.fill = fondoTotal;
    cellCuartosKilosTotalCuartos.fill = fondoTotal;


    /* graseria */
    const fondoGraseria: Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF52BE80' },
      bgColor: { argb: '00000000'  }
    }

    cellTituloKilosGraseria.font = fuenteTitulo;
    cellKilosGraseria.font = fuenteValores;
    cellKilosGraseria.alignment = { vertical: 'middle', horizontal: 'right' };
    cellTituloKilosGraseria.fill = fondoGraseria;
    cellKilosGraseria.fill = fondoGraseria;

  }

  private getFechasReporte(tituloLibro: string): string[] {
    let fechas: string[] = [];
    const partes = tituloLibro.split(' ');
    fechas.push(partes[2]);
    fechas.push(partes[4]);

    return fechas;
  }

}
