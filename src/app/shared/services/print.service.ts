import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { PrintModel } from '../models/print-model.interface';

@Injectable({ providedIn: 'root' })
export class PrintService {
  constructor() {}

  printExcel(idReporte: number, dataToPrint: PrintModel) {
    switch (idReporte) {
      case 1:
        return this.printLogueoFuncionarios(dataToPrint);
      default:
        return [];
    }
  }

  /*LOGUEO FUNCIONARIOS*/

  private printLogueoFuncionarios(dataToPrint: PrintModel) {
    const lineas = this.hojaFuncionarios(dataToPrint);
    return lineas;
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

  private hojaFuncionarios(dataToPrint: PrintModel): XLSX.WorkSheet {
    let ws = XLSX.utils.aoa_to_sheet([]);
    const lineas = this.parseDataFuncionarios(dataToPrint);
    console.log(dataToPrint);
    console.log(lineas);
    const filaInicio = 1;
    let fila = 3;
    let columna = 65;

    XLSX.utils.sheet_add_aoa(ws, [[lineas[0][0]]], {origin: "A1"});

    for (let l = 2; l < lineas.length; l++) {
      const indHueseros = lineas[l].findIndex((x) => x.includes('HUESEROS'));
      const indCharqueo = lineas[l].findIndex((x) =>
        x.includes('CHARQUEADORES')
      );
      let finHueseros: number = 0;

      if (indHueseros >= 0) {
        if (indCharqueo >= 0) {
          finHueseros = indCharqueo - 1;
        } else {
          finHueseros = lineas[l].length;
        }
      }

      XLSX.utils.sheet_add_aoa(ws, [[lineas[l][0]]], {
        origin: String.fromCharCode(columna) + fila.toString() ,
      });
      fila = fila + 2;

      if(indHueseros >= 0) {
      XLSX.utils.sheet_add_aoa(ws, [[lineas[l][1]]], {
        origin: String.fromCharCode(columna) + fila.toString(),
      });
      fila++;

      for (let j = 2; j < finHueseros; j = j + 3) {
        XLSX.utils.sheet_add_aoa(ws, [[lineas[l][j]]], {
          origin: String.fromCharCode(columna) + fila.toString(),
        });
        XLSX.utils.sheet_add_aoa(ws, [[lineas[l][j + 1]]], {
          origin: String.fromCharCode(columna + 1) + fila.toString(),
        });
        XLSX.utils.sheet_add_aoa(ws, [[lineas[l][j + 2]]], {
          origin: String.fromCharCode(columna + 2) + fila.toString(),
        });

        fila++;
      }
    }

    fila++;

      if(indCharqueo >= 0) {
        console.log(lineas[l][indCharqueo])
        XLSX.utils.sheet_add_aoa(ws, [[lineas[l][indCharqueo]]], {
            origin: String.fromCharCode(columna) + fila.toString(),
          });
          fila++;
      for (let j = indCharqueo + 1; j < lineas[l].length; j = j + 3) {
        XLSX.utils.sheet_add_aoa(ws, [[lineas[l][j]]], {
          origin: String.fromCharCode(columna) + fila.toString(),
        });
        XLSX.utils.sheet_add_aoa(ws, [[lineas[l][j + 1]]], {
          origin: String.fromCharCode(columna + 1) + fila.toString(),
        });
        XLSX.utils.sheet_add_aoa(ws, [[lineas[l][j + 2]]], {
          origin: String.fromCharCode(columna + 2) + fila.toString(),
        });

        fila++;
      }
    }

      fila = 3;
      columna += 4;
    }
    return ws;
  }
  /**/
}
