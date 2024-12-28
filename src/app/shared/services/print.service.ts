import { Injectable } from '@angular/core';

import { PrintModel } from '../models/print-model.interface';
import { Alignment, Fill, Font, ImagePosition, Workbook, Worksheet } from 'exceljs';
import { formatDate } from '@angular/common';
import { LOGO_RGB_V1_BEIGE } from '../models/logos/RGB_v1-beige';
import { InconsistenciaDataPrint } from '../../08_SIR.RRHH.Reportes/interfaces/InconsistenciaDataPrint.interface';
import { Incidencia } from 'src/app/08_SIR.RRHH.Reportes/interfaces/Incidencia.interface';
import { CabezaFaenada } from 'src/app/07_SIR.Mantenimiento.Apps/interfaces/CabezaFaenada.interface';
import { DataTemperatura } from 'src/app/07_SIR.Mantenimiento.Apps/interfaces/DataTemperatura.interface';
import { Ubicacion } from 'src/app/07_SIR.Mantenimiento.Apps/interfaces/Ubicacion.interface';
import { Scada } from 'src/app/07_SIR.Mantenimiento.Apps/interfaces/Scada.interface';
import { TipoDispositivo } from 'src/app/07_SIR.Mantenimiento.Apps/interfaces/TipoDispositivo.interface';
import { UnidadMedida } from 'src/app/07_SIR.Mantenimiento.Apps/interfaces/UnidadMedida.interface';
import { EmbarqueConfig } from '../../04_SIR.Exportaciones.Reportes/Interfaces/EmbarqueConfig.interface';
import { KosherCommonService } from 'src/app/04_SIR.Exportaciones.Reportes/services/kosher-common.service';
import { DetalleEmbarquePrintService } from './detalle-embarque-print.service';
import { DataKosher } from 'src/app/04_SIR.Exportaciones.Reportes/Interfaces/DataKosher.interface';
import { DataKosherAgrupada } from 'src/app/04_SIR.Exportaciones.Reportes/Interfaces/DataKosherAgrupada.interface';
import { TotalDataAgrupada } from '../../04_SIR.Exportaciones.Reportes/Interfaces/TotalDataAgrupada.interface';
import { ReporteCuota } from 'src/app/03_SIR.Produccion.Reportes/pages/cuota/interfaces/ReporteCuota.interface';
import { LoteEntradaDTO } from 'src/app/03_SIR.Produccion.Reportes/pages/cuota/interfaces/LoteEntradaDTO.interface';
import { CommonCuotaService } from 'src/app/03_SIR.Produccion.Reportes/pages/cuota/services/common-cuota.service';
import { ConfTipoCuotaDTO } from 'src/app/03_SIR.Produccion.Reportes/pages/cuota/interfaces/ConfTipoCuotaDTO.interface';
import { SalidaDTO } from 'src/app/03_SIR.Produccion.Reportes/pages/cuota/interfaces/SalidaDTO.interface';
import { EntradaDisplay } from 'src/app/03_SIR.Produccion.Reportes/pages/cuota/interfaces/EntradaDisplay.interface';
import { CortesReporte } from 'src/app/03_SIR.Produccion.Reportes/pages/cuota/interfaces/CortesReporte.interface';
import { EntradaReporte } from 'src/app/03_SIR.Produccion.Reportes/pages/cuota/interfaces/EntradaReporte.interface';
import { EntradaDisplayReporte } from 'src/app/03_SIR.Produccion.Reportes/pages/cuota/interfaces/EntradaDisplayReporte.interface';
import { QamarkDTO } from 'src/app/03_SIR.Produccion.Reportes/pages/cuota/interfaces/QamarkDTO.interface';
import { Comparativo } from 'src/app/03_SIR.Produccion.Reportes/pages/cuota/interfaces/Comparativo.inteface';
import { ComparativoReporte } from 'src/app/03_SIR.Produccion.Reportes/pages/cuota/interfaces/ComparativoReporte.interface';
import { TipoCuotaDict } from 'src/app/03_SIR.Produccion.Reportes/pages/cuota/interfaces/TipoCuotaDict.interface';
import { ComparativoRend } from 'src/app/03_SIR.Produccion.Reportes/pages/rendimientos/interfaces/ComparativoRend.interface';
import { CorteLote } from 'src/app/03_SIR.Produccion.Reportes/pages/rendimientos/interfaces/CorteLote.interface';
import { DWSalidaDTO } from 'src/app/03_SIR.Produccion.Reportes/pages/cuota/interfaces/DWSalidaDTO.interface';
import { ComparativoRendData } from 'src/app/03_SIR.Produccion.Reportes/pages/rendimientos/interfaces/ComparativoRendData.interface';
import { DataRendimiento } from 'src/app/03_SIR.Produccion.Reportes/pages/rendimientos/interfaces/DataRendimiento.interface';
import { TipoFechaDataAgrupado } from 'src/app/03_SIR.Produccion.Reportes/pages/rendimientos/interfaces/TipoFechaDataAgrupado.interface';
import { CommonService } from 'src/app/03_SIR.Produccion.Reportes/pages/rendimientos/services/common.service';
import { RegistroConPrecio } from '../../05_SIR.Carga.Reportes/interfaces/RegistroConPrecio.interface';
import { CargaService } from 'src/app/05_SIR.Carga.Reportes/services/carga-service.service';
import { XFCL } from 'src/app/05_SIR.Carga.Reportes/interfaces/XFCL.interface';
import { TotalData } from 'src/app/05_SIR.Carga.Reportes/interfaces/TotalData.interface';
import { PrecioData } from 'src/app/05_SIR.Carga.Reportes/interfaces/PrecioData.interface';
import { PLPallet } from 'src/app/05_SIR.Carga.Reportes/interfaces/PLPallet.interface';
import { GrupoComparativo } from 'src/app/03_SIR.Produccion.Reportes/interfaces/GrupoComparativo.interface';
import { ComparativoCodigosService } from 'src/app/03_SIR.Produccion.Reportes/services/comparativo-codigos.service';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrintService {
  constructor(
    private kcs: KosherCommonService,
    private deps: DetalleEmbarquePrintService ,
    private ccs: CommonCuotaService,
    private crs: CommonService,
    private cargaService: CargaService,
    private comparativoCodigoService: ComparativoCodigosService
  ) {}

  printExcel(idReporte: number, dataToPrint: PrintModel, libro: Workbook) {
    switch (idReporte) {
      case 1:
        return this.printLogueoFuncionarios(dataToPrint, libro);
      case 2:
        return this.printLogueadasPorFuncionario(dataToPrint, libro);
      case 3:
        return this.printProductosGraseria(dataToPrint, libro);
      case 4: 
        return this.printInconsistencias(dataToPrint, libro);
      case 5:
        return this.printCabezasFaenadas(dataToPrint, libro);
      case 6:
        return this.printDispositivosScada(dataToPrint, libro);
      case 7:
        return this.printDetalleDeEmbarque(dataToPrint, libro);
      case 8:
        return this.printRendimientosCuota(dataToPrint, libro);
      case 9:
        return this.printComparativosRendimientos(dataToPrint, libro);
      case 10:
        return this.printPackingList(dataToPrint, libro);
      case 11:
        return this.printLibroComparativoPorCodigos(dataToPrint, libro)
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

    const parts: string[] = dataToPrint.nombreArchivo.split(' ');
    const sheet =  libro.addWorksheet('Logueos ' + parts[parts.length - 1]);
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

  /* INCONSISTENCIAS */
  private printInconsistencias(dataToPrint: PrintModel, libro: Workbook):void {
    const data: InconsistenciaDataPrint = dataToPrint.data as InconsistenciaDataPrint;
    const fuenteTitulo = { bold: true, size: 13};

    if(data.inconsistencias.length > 0) {
      const sheet = libro.addWorksheet('INCONSISTENCIAS');

      const mergeCells = [
        { start: { row: 6, col: 5  }, end: { row: 6, col:  6} },
        { start: { row: 6, col: 7  }, end: { row: 6, col:  8} },
        { start: { row: 6, col: 9  }, end: { row: 6, col:  10} },
      ]
  
      mergeCells.forEach(range => {
        sheet.mergeCells(range.start.row, range.start.col, range.end.row, range.end.col);
      })
  

      /* colores de fondo */
      const fondoComunes: Fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF9E79F' },
        bgColor: { argb: '00000000'  }
      }

      const fondoExtras: Fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFAD7A0' },
        bgColor: { argb: '00000000'  }
      }

      const fondoNocturnas: Fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF5CBA7' },
        bgColor: { argb: '00000000'  }
      }

      this.setLogo(libro, sheet);
      this.setTitle(libro, sheet, 'Inconsistencias', 'right', 12);

      sheet.getCell("E6").value = "Comunes";
      sheet.getCell("G6").value = "Extras";
      sheet.getCell("I6").value = "Nocturnas";
      sheet.getCell("B7").value = "Nro. Func.";
      sheet.getCell("C7").value = "Nombres";
      sheet.getCell("D7").value = "Apellidos";
      sheet.getCell("E7").value = "Pos sistema";
      sheet.getCell("F7").value = "Por marcas";
      sheet.getCell("G7").value = "Por sistema";
      sheet.getCell("H7").value = "Por marcas";
      sheet.getCell("I7").value = "Por sistema";
      sheet.getCell("J7").value = "Por marcas";
      sheet.getCell("K7").value = "Régimen";
      sheet.getCell("L7").value = "Sector";

      sheet.getCell("E6").fill = fondoComunes;
      sheet.getCell("G6").fill = fondoExtras;
      sheet.getCell("I6").fill = fondoNocturnas;
      sheet.getCell("E7").fill = fondoComunes;
      sheet.getCell("F7").fill = fondoComunes;
      sheet.getCell("G7").fill = fondoExtras;
      sheet.getCell("H7").fill = fondoExtras;
      sheet.getCell("I7").fill = fondoNocturnas;
      sheet.getCell("J7").fill = fondoNocturnas;

      for(let c = 5; c <= 9; c = c + 2)
        sheet.getCell(6, c).font = fuenteTitulo;
      
      for(let c = 2; c <= 12; c++)
        sheet.getCell(7, c).font = fuenteTitulo;
      
      let fila = 8;
      data.inconsistencias.forEach(info => {
        sheet.getCell(fila, 2).value = info.nroFuncionario;
        sheet.getCell(fila, 3).value = info.nombres;
        sheet.getCell(fila, 4).value = info.apellidos;
        sheet.getCell(fila, 5).value = info.relojHorasComunes;
        sheet.getCell(fila, 6).value = info.marcasHorasComunes;
        sheet.getCell(fila, 5).fill = fondoComunes;
        sheet.getCell(fila, 6).fill = fondoComunes;
        sheet.getCell(fila, 7).value = info.relojHorasDobles;
        sheet.getCell(fila, 8).value = info.marcasHorasDobles;
        sheet.getCell(fila, 7).fill = fondoExtras;
        sheet.getCell(fila, 8).fill = fondoExtras;
        sheet.getCell(fila, 9).value = info.relojHorasNocturnas;
        sheet.getCell(fila, 10).value = info.marcasHorasNocturnas;
        sheet.getCell(fila, 9).fill = fondoNocturnas;
        sheet.getCell(fila, 10).fill = fondoNocturnas;
        sheet.getCell(fila, 11).value = info.regimen;
        sheet.getCell(fila, 12).value = info.sector;
        fila++;
      });

      sheet.getColumn(2).width = 11;
      sheet.getColumn(3).width = 20;
      sheet.getColumn(4).width = 25;
      sheet.getColumn(5).width = 13;
      sheet.getColumn(6).width = 13;
      sheet.getColumn(7).width = 13;
      sheet.getColumn(8).width = 13;
      sheet.getColumn(9).width = 13;
      sheet.getColumn(10).width = 13;
      sheet.getColumn(11).width = 11;
      sheet.getColumn(12).width = 35;
  
  }

  if(data.incidencias.length > 0) {
    let f = 6;
    const sheet = libro.addWorksheet('ERRORES');
    this.setLogo(libro, sheet);
    this.setTitle(libro, sheet, 'Errores en marcas', 'right', 5);
    const motivos: string[] = Array.from(new Set(data.incidencias.map(m => m.motivo))).sort((a, b) => {
      if(a < b) return -1;
      if(a > b) return 1;
      return 0;
    });

    motivos.forEach(m => {
      sheet.mergeCells(f, 2, f, 6);
      sheet.getCell(f, 2).value = m;
      sheet.getCell(f, 2).font = fuenteTitulo;
      sheet.getCell(f, 2).fill = this.getFondo(m);
      f++;
      sheet.getCell(f, 2).value = "Nro. Func.";
      sheet.getCell(f, 3).value = "Nombres";
      sheet.getCell(f, 4).value = "Apellidos";
      sheet.getCell(f, 5).value = "Régimen";
      sheet.getCell(f, 6).value = "Sector";
      sheet.getCell(f, 2).font = fuenteTitulo;
      sheet.getCell(f, 3).font = fuenteTitulo;
      sheet.getCell(f, 4).font = fuenteTitulo;
      sheet.getCell(f, 5).font = fuenteTitulo;
      sheet.getCell(f, 6).font = fuenteTitulo;

      f++;

      const motivosInc: Incidencia[] = data.incidencias.filter(i => i.motivo === m);
      motivosInc.forEach(mI => {
        sheet.getCell(f, 2).value = mI.nroFuncionario;
        sheet.getCell(f, 3).value = mI.nombres;
        sheet.getCell(f, 4).value = mI.apellidos;
        sheet.getCell(f, 5).value = mI.regimen;
        sheet.getCell(f, 6).value = mI.sector;

        f++;
      });

      f ++;
    });

    sheet.getColumn(2).width = 11;
    sheet.getColumn(3).width = 20;
    sheet.getColumn(4).width = 25;
    sheet.getColumn(5).width = 11;
    sheet.getColumn(6).width = 35;
  }
}

  /* FUNCIONES COMUNES */
  /* LOGO */
  private setLogo(libro: Workbook, sheet: Worksheet): void {
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
  }

  private setTitle(libro: Workbook, sheet: Worksheet, title: string, alignment: any, endCol: number = 9) {
    const mergeCells = [
      { start: { row: 2, col: 2  }, end: { row: 4, col:  endCol} },
    ]

    mergeCells.forEach(range => {
      sheet.mergeCells(range.start.row, range.start.col, range.end.row, range.end.col);
    })

    const titular = sheet.getCell("B2");
    titular.fill = this.getFondoNegro();
    titular.font = { bold: true, size: 19, color: { argb: 'FFFFFFFF' } };
    titular.style.alignment = { vertical: 'middle', horizontal: alignment };
    titular.value = title + '   ';
  }

  /* FONDO NEGRO */
  private getFondoNegro(): Fill {
    return  { 
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF000000' },
      bgColor: { argb: '00000000'  }
    };  
  }

  private getFondoGris(): Fill {
    const lightGrayColor = { argb: 'FFF4F6F6' }; 
    return   {
      type: 'pattern',
      pattern: 'solid',
      fgColor: lightGrayColor 
    };
  }

  private getFondo(motivo: string): Fill {
    let color: string;

    switch (motivo) {
      case 'Error en formato de marca':
          color = 'FFD45472';
          break;
      case 'Falta alguna marca':
          color = 'FFFF922A';
          break;
      case 'Funcionario no está en padrón':
          color = 'FF35A4CC';
          break;
      default:
          color = '';
    }

    return   {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color} 
    };
  }

  private printCabezasFaenadas(dataToPrint: PrintModel, libro: Workbook): void {
    const data: CabezaFaenada[] = dataToPrint.data.cabezas as CabezaFaenada[];
    const nombre: string = "Cabezas vacunas faenadas";
    const sheet = libro.addWorksheet(nombre);
    const fuenteTitulo = { bold: true, size: 12};

    this.setLogo(libro, sheet);
    this.setTitle(libro, sheet, nombre, 'right', 10);

    sheet.getCell("B6").value = `Fecha de faena: ${dataToPrint.nombreArchivo.substring(nombre.length + 1)}`;
    sheet.getCell("B6").font = fuenteTitulo;
  
    const fechasFaena: string[] = this.getFechaFaenaUnica(data);
    var filaFechaFaena: number = 8;
    const columnas: string[] = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const sizes: number[] = [12, 10, 12, 30, 10, 16, 13, 15, 18]
    const titulos: string[] = ["Faena","IdInnova","IdGecos","Proveedor","Secuencial","Caravana","DotNumber","Peso segunda","Hora etiquetado"]

    columnas.forEach((col, i) => {
      sheet.getCell(col + filaFechaFaena).value = titulos[i];
      sheet.getCell(col + filaFechaFaena).font = fuenteTitulo;
      sheet.getColumn(i + 2).width = sizes[i];
    });

    filaFechaFaena++;

    fechasFaena.forEach(fecha => {
      sheet.getCell("B" + filaFechaFaena).value = fecha;
      sheet.getCell("B" + filaFechaFaena).font = fuenteTitulo;
      const datosFaena: CabezaFaenada[] = data.filter(d => formatDate(d.fechaFaena, "dd-MM-yyyy", "es-UY") == fecha);
      
      datosFaena.forEach(cf => {
        sheet.getCell("C" + (filaFechaFaena)).value = cf.idInnova;
        sheet.getCell("D" + (filaFechaFaena)).value = cf.idGecos;
        sheet.getCell("E" + (filaFechaFaena)).value = cf.proveedor;
        sheet.getCell("F" + (filaFechaFaena)).value = cf.secuencial;
        sheet.getCell("G" + (filaFechaFaena)).value = cf.caravana;
        sheet.getCell("H" + (filaFechaFaena)).value = cf.dotNumber;
        sheet.getCell("I" + (filaFechaFaena)).value = parseFloat(cf.pesoMedia.toFixed(2)) ;
        sheet.getCell("I" + (filaFechaFaena)).numFmt = '0.00';
        sheet.getCell("J" + (filaFechaFaena)).value = cf.fechaHoraEtiquetado;
        filaFechaFaena++;
      });
      filaFechaFaena += 2 ;
    });

    // Hoja Temperatuas
    const tituloHoja: string = 'Temp. C9 C10';
    var hojaTemp = libro.addWorksheet(tituloHoja);
    this.setLogo(libro, hojaTemp);
    this.setTitle(libro, hojaTemp, 'Temperatura Cámaras 9 y 10', 'right', 6);
    hojaTemp.getCell("B6").value = `Fecha de faena: ${dataToPrint.nombreArchivo.substring(nombre.length + 1)}`;
    hojaTemp.getCell("B6").font = fuenteTitulo;

    var filaCamara: number = 8;
    const temps: DataTemperatura[] = dataToPrint.data.temps as DataTemperatura[];
    const ids: number[] = this.getIdsCamara(temps);
    const tempsTitulos: string[] = ['Id dispositivo', 'Código dispositivo', 'Unidad de medida', 'Temperatura', 'Fecha y hora'];
    const colsTemps: string[] = columnas.slice(0, 5);
    const tempsSizes: number[] = [15, 25, 20, 15, 25];

    colsTemps.forEach((col, i) => {
      hojaTemp.getCell(col + filaCamara).value = tempsTitulos[i];
      hojaTemp.getCell(col + filaCamara).font = fuenteTitulo;
      hojaTemp.getColumn(i + 2).width = tempsSizes[i];
    });

    filaCamara++;
    
    ids.forEach(id => {
      const datosTemp: DataTemperatura[] = temps.filter(t => t.idDispositivo == id);
      hojaTemp.getCell("B" + filaCamara).value = id;
      hojaTemp.getCell("B" + filaCamara).font = fuenteTitulo;
      hojaTemp.getCell("B" + filaCamara).style.alignment = { vertical: 'middle', horizontal: 'center' }; 
      hojaTemp.getCell("C" + filaCamara).value = datosTemp[0].codigoDispositivo;
      hojaTemp.getCell("C" + filaCamara).font = fuenteTitulo;
      hojaTemp.getCell("C" + filaCamara).style.alignment = { vertical: 'middle', horizontal: 'center' };
      hojaTemp.getCell("D" + filaCamara).value = datosTemp[0].unidadMedida;
      hojaTemp.getCell("D" + filaCamara).font = fuenteTitulo;
      hojaTemp.getCell("D" + filaCamara).style.alignment = { vertical: 'middle', horizontal: 'center' };

      datosTemp.forEach(dT => {
        hojaTemp.getCell("E" + (filaCamara)).value = dT.valor;
        hojaTemp.getCell("F" + (filaCamara)).value = dT.fechaRegistro;
        filaCamara++
      });

      filaCamara += 2;
    });
  }
  
  private getFechaFaenaUnica(datos: CabezaFaenada[]): string[] {
    return Array.from(new Set(datos.map(c => formatDate(c.fechaFaena, "dd-MM-yyyy",  "es-UY"))));
  }

  private getIdsCamara(temps: DataTemperatura[]): number[] {
    return Array.from(new Set(temps.map(t => t.idDispositivo))).sort((a, b) =>{ 
      if(a <= b) return -1
      else return 1;
    }
    );
  }

  private printDispositivosScada(dataToPrint: PrintModel, libro: Workbook) {
    const nombre: string = dataToPrint.nombreArchivo;
    const dataScada: Scada[] = dataToPrint.data.datosScada as Scada[];
    const dispositivos: TipoDispositivo[] = dataToPrint.data.dispositivos as TipoDispositivo[];
    const ubicaciones: Ubicacion[] = dataToPrint.data.ubicaciones as Ubicacion[];
    const unidades: UnidadMedida[] = dataToPrint.data.unidades as UnidadMedida[];

    const fuenteTitulo = { bold: true, size: 12};

    if(dataScada) {
      const titulo: string = "Datos de dispositivos";
      const hojaDatos = libro.addWorksheet(titulo);
      this.setLogo(libro, hojaDatos);
      this.setTitle(libro, hojaDatos, titulo, 'right', 6);

      hojaDatos.getCell("B7").value = "Id SCADA";
      hojaDatos.getCell("B7").font = fuenteTitulo;
      hojaDatos.getCell("C7").value = "Tipo dispositivo";
      hojaDatos.getCell("C7").font = fuenteTitulo;
      hojaDatos.getCell("D7").value = "Ubicación";
      hojaDatos.getCell("D7").font = fuenteTitulo;
      hojaDatos.getCell("E7").value = "Unidad de medida";
      hojaDatos.getCell("E7").font = fuenteTitulo;
      hojaDatos.getCell("F7").value = "Nombre";
      hojaDatos.getCell("F7").font = fuenteTitulo;
      hojaDatos.getCell("G7").value = "Descrpción";
      hojaDatos.getCell("G7").font = fuenteTitulo;   
    
      var filaDatos: number = 8;
      dataScada.forEach(dato => {
        hojaDatos.getCell("B" + filaDatos).value = dato.deviceId;
        hojaDatos.getCell("C" + filaDatos).value = dispositivos ? dispositivos.find(d => d.idTipo == dato.idTipoDispositivo)?.nombre : dato.idTipoDispositivo;
        hojaDatos.getCell("D" + filaDatos).value = ubicaciones ? ubicaciones.find(u => u.idUbicacion == dato.idUbicacion)?.nombre : dato.idUbicacion;
        hojaDatos.getCell("E" + filaDatos).value = unidades ? unidades.find(u => u.idUnidadMedida == dato.idUnidadMedida)?.codigo : dato.idUnidadMedida;
        hojaDatos.getCell("F" + filaDatos).value = dato.nombre;
        hojaDatos.getCell("G" + filaDatos).value = dato.descripcion;
        
        filaDatos++;
      });

      hojaDatos.getColumn("B").width = 44;
      hojaDatos.getColumn("C").width = 16;
      hojaDatos.getColumn("D").width = 34;
      hojaDatos.getColumn("E").width = 25;
      hojaDatos.getColumn("F").width = 25;
      hojaDatos.getColumn("G").width = 25; 
    }

    if(dispositivos) {
      const titulo: string = "Tipos de dispositivos";
      const hojaTipos = libro.addWorksheet(titulo);
      this.setLogo(libro, hojaTipos);
      this.setTitle(libro, hojaTipos, titulo, 'right', 10);

      hojaTipos.getCell("B7").value = "Id";
      hojaTipos.getCell("B7").font = fuenteTitulo;
      hojaTipos.getCell("C7").value = "Nombre";
      hojaTipos.getCell("C7").font = fuenteTitulo;

      var filaDatos: number = 8;
      dispositivos.forEach(disp => {
        hojaTipos.getCell("B" + filaDatos).value = disp.idTipo;
        hojaTipos.getCell("C" + filaDatos).value = disp.nombre;

        filaDatos++;
      });

      hojaTipos.getColumn("C").width = 16;
    }

    if(ubicaciones) {
      const titulo: string = "Ubicaciones";
      const hojaUbicaciones = libro.addWorksheet(titulo);
      this.setLogo(libro, hojaUbicaciones);
      this.setTitle(libro, hojaUbicaciones, titulo, 'right', 4);

      hojaUbicaciones.getCell("B7").value = "Ubicación padre";
      hojaUbicaciones.getCell("B7").font = fuenteTitulo;
      hojaUbicaciones.getCell("C7").value = "Nombre ubicación";
      hojaUbicaciones.getCell("C7").font = fuenteTitulo;
      hojaUbicaciones.getCell("D7").value = "Descripción";
      hojaUbicaciones.getCell("D7").font = fuenteTitulo;

      var filaDatos: number = 8;
      ubicaciones.forEach( ub => {
        hojaUbicaciones.getCell("B" + filaDatos).value = ub.idUbicacionPadre == 0 ? '' : ubicaciones.find(u => u.idUbicacion == ub.idUbicacionPadre)?.nombre;
        hojaUbicaciones.getCell("C" + filaDatos).value = ub.nombre;
        hojaUbicaciones.getCell("D" + filaDatos).value = ub.descripcion;

        filaDatos++;
      });

      hojaUbicaciones.getColumn("B").width = 34;
      hojaUbicaciones.getColumn("C").width = 34;
      hojaUbicaciones.getColumn("D").width = 34;
    }

    if(unidades) {
      const titulo: string = "Unidades de medida";
      const hojaUnidades = libro.addWorksheet(titulo);
      this.setLogo(libro, hojaUnidades);
      this.setTitle(libro, hojaUnidades, titulo, 'right', 4);

      hojaUnidades.getCell("B7").value = "Unidad";
      hojaUnidades.getCell("B7").font = fuenteTitulo;
      hojaUnidades.getCell("C7").value = "Nombre";
      hojaUnidades.getCell("C7").font = fuenteTitulo;

      var filaDatos: number = 8;
      unidades.forEach( um => {
        hojaUnidades.getCell("B" + filaDatos).value = um.codigo;
        hojaUnidades.getCell("C" + filaDatos).value = um.nombre;

        filaDatos++;
      });

      hojaUnidades.getColumn("B").width = 20;
      hojaUnidades.getColumn("C").width = 34;
    }
  }

  /* DETALLE DE EMBARQUE */
  private printDetalleDeEmbarque(dataToPrint: PrintModel, libro: Workbook): void {
    const dataKosher: DataKosher[] = dataToPrint.data.cajas as DataKosher[];
    const containers: string[] = this.deps.obtenerContenedoresUnicos(dataKosher);
    const mercaderias: string[] = this.deps.obtenerMercaderiasUnicas(dataKosher);
    const especies: string[] = this.deps.obtenerEspeciesUnicas(dataKosher);
    const tipos: string[] = this.deps.obtenerTiposUnicos(dataKosher);
    const dataAgrupada: DataKosherAgrupada[] = this.kcs.setDatosAgrupados(dataKosher);
    const totalPallets: number = this.kcs.getTotalPalletsByContainer(dataAgrupada);
 
    const fondoTitulo: Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF2F3F4' },
      bgColor: { argb: '00000000'  }
    };

    const fondoSubTotal: Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEBF5FB' },
      bgColor: { argb: '00000000'  }
    };
  
    const fondoTotalGeneral: Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFADBD8' },
      bgColor: { argb: '00000000'  }
    };

    const fondoTotalMerca: Fill= {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' },
      bgColor: { argb: '00000000'  }
    }

    const fuenteTitulo = { bold: true, size: 12};
    const fuenteSubTitulos = { bold: true, size: 10 };
    const fuenteContainer = { bold: true, size: 10, color: { argb: 'FF2E86C1'} };
    const fuenteShippingMark = { bold: true, size: 10, color: { argb: 'FFE74C3C'} };
    const fuentePProm = { bold: true, color: {argb: 'FFCD6155'} };
    const fuenteTotalGeneral = { bold: true, size: 12 };
    const fuenteMerca = { bold: true, size: 10, color: {argb: 'FFCD6155'} };
    const fuenteTotalMerca = { bold: true, color: {argb: 'FF2E86C1'}};
    const fuenteConteinerNoCorte = { size: 10 };
    const fuenteEspecieTipo = { size: 10, italic: true };
    const fuenteTotalCortesDesglose = { bold: true, size: 12 , color: { argb: 'FF2E86C1'} };
    const fuenteTotalDesglose = { bold: true, size: 13 , color: { argb: 'FFCD6155'} };
    const fuenteEspecieCortes = { bold: true, size: 10 };

    const alineacionCentro: Partial<Alignment> = { vertical: 'middle', horizontal: 'center' };

    const formatoNumero: string = '#,##0.00';

    /* Hoja detalle */
    const tituloDetalle: string = "Detalle";
    const hojaDetalle = libro.addWorksheet(tituloDetalle);
    this.setLogo(libro, hojaDetalle);
    this.setTitle(libro, hojaDetalle, tituloDetalle, 'right', 16);
    const embarqueConfig: EmbarqueConfig | undefined = dataToPrint.data.config as EmbarqueConfig | undefined;
   
    hojaDetalle.getCell("B6").value = "DETALLE DE EMBARQUE ISRAEL - FRIGORÍFICO LAS PIEDRAS S.A.";
    hojaDetalle.getCell("B6").font = fuenteTitulo;
    
    hojaDetalle.getCell("O6").value = "SHIPPING MARK:";
    hojaDetalle.getCell("O6").font = fuenteShippingMark; 
    hojaDetalle.getCell("B8").value = "ATTN:";
    hojaDetalle.getCell("B8").font = fuenteSubTitulos;
    hojaDetalle.getCell("B9").value = "VENTA:";
    hojaDetalle.getCell("B9").font = fuenteSubTitulos;
    hojaDetalle.getCell("B10").value = "CLIENTE:";
    hojaDetalle.getCell("B10").font = fuenteSubTitulos;
    hojaDetalle.getCell("B11").value = "BARCO:";
    hojaDetalle.getCell("B11").font = fuenteSubTitulos;
    hojaDetalle.getCell("B12").value = "FACTURA:";
    hojaDetalle.getCell("B12").font = fuenteSubTitulos;
    hojaDetalle.getCell("B13").value = "CARPETA:";
    hojaDetalle.getCell("B13").font = fuenteSubTitulos;
    hojaDetalle.getCell("B14").value = "FECHA B/L:";
    hojaDetalle.getCell("B14").font = fuenteSubTitulos;
    hojaDetalle.getCell("C10").value = "NECHEMIA LACHOVITZ";
    
    if(embarqueConfig != undefined) {
      hojaDetalle.getCell("O7").value = embarqueConfig.shippingMark;
      hojaDetalle.getCell("C8").value = embarqueConfig.attn;
      hojaDetalle.getCell("C9").value = embarqueConfig.numeroVenta.toString();
      hojaDetalle.getCell("C11").value = embarqueConfig.barco;
      hojaDetalle.getCell("C12").value = embarqueConfig.factura;
      hojaDetalle.getCell("C13").value = embarqueConfig.carpeta;
      hojaDetalle.getCell("C14").value = formatDate(embarqueConfig.fechaBL, "dd/MM/yyyy", "es-UY");
    }

    hojaDetalle.getCell("J8").value = "CONTAINER:";
    hojaDetalle.getCell("J8").font = fuenteSubTitulos;

    var filaContainerName: number = 8;
    containers.forEach(container => {
      const c: string = container as string;
      hojaDetalle.getCell("K" + filaContainerName).value = c; 
      hojaDetalle.getCell("K" + filaContainerName).font = fuenteContainer;
      hojaDetalle.getCell("K" + filaContainerName).alignment = alineacionCentro;
      filaContainerName++;
    });

    const filaTitulos = filaContainerName < 16 ? 16 : filaContainerName + 2;
    const titulos: string[] = this.kcs.getTitulosReporte();
    const widhts: number[] = [18, 15, 8, 8, 15, 15, 15, 10, 25, 18, 18, 22, 18, 15, 15];
    var colNumber: number = 2;

    titulos.forEach((titulo, i) => {
      const row = hojaDetalle.getRow(filaTitulos);
      const cell = row.getCell(colNumber);
      cell.value = titulo;
      cell.font = fuenteSubTitulos;
      cell.fill = fondoTitulo;
      hojaDetalle.getColumn(colNumber).width = widhts[i];
      cell.style.alignment = alineacionCentro;
      colNumber++;
    });

    var filaCaja: number = filaTitulos + 1;
    const cortes = this.deps.obtenerCajasPorMercaderia(dataKosher, "CORTES");
    if(cortes.length > 0) {
    //mercaderias.forEach(merca => {
      if(cortes.length > 0) {
        const merca = 'CORTES';
        const cajasPorMerca = dataKosher.filter(dk => dk.mercaderia == merca);
        containers.forEach(cont => {
          const cajasPorMercaCont = cajasPorMerca.filter(c => c.container == cont);
          especies.forEach(esp => {
            const cajasPorMercaEsp = cajasPorMercaCont.filter(c => c.especie == esp);
            tipos.forEach(tipo => {
              const cajasPorMercaEspTipo = cajasPorMercaEsp.filter(c => c.tipoProducto == tipo);
              let sumPallets = 0;
              if(cajasPorMercaEspTipo.length > 0) {
                const precios = Array.from(new Set(cajasPorMercaEspTipo.map(cpmet => cpmet.precioTonelada))).sort((a, b) => { if(a >= b) return 1; else return -1});
                precios.forEach(precio => {
                  const cajasPorMercaEspTipoPrec = cajasPorMercaEspTipo.filter(c => c.precioTonelada == precio);
                  // const pallets = this.deps.obtenerPalletsUnicos(cajasPorMercaEspTipoPrec);
                  // console.log(pallets)
                  // pallets.forEach(pallet => {
                    // const c = cajasPorMercaEspTipoPrec.filter(c => c.idPallet == pallet);                  
                      const kilosNetos = this.deps.sumarKilosNetos(cajasPorMercaEspTipoPrec);
                      //hojaDetalle.getCell("B" + filaCaja).value = embarqueConfig.dua;
                      hojaDetalle.getCell("B" + filaCaja).alignment = alineacionCentro;
                      hojaDetalle.getCell("C" + filaCaja).value = merca;
                      hojaDetalle.getCell("C" + filaCaja).font = fuenteMerca;
                      hojaDetalle.getCell("C" + filaCaja).alignment = alineacionCentro;
                      hojaDetalle.getCell("D" + filaCaja).value = this.deps.cantidadPallets(cajasPorMercaEspTipoPrec);
                      sumPallets += this.deps.cantidadPallets(cajasPorMercaEspTipoPrec);
                      hojaDetalle.getCell("E" + filaCaja).value = this.deps.cantidadCajas(cajasPorMercaEspTipoPrec);
                      hojaDetalle.getCell("F" + filaCaja).value = parseFloat(kilosNetos.toFixed(2));
                      hojaDetalle.getCell("F" + filaCaja).numFmt = formatoNumero;
                      hojaDetalle.getCell("G" + filaCaja).value = parseFloat(this.deps.sumarKilosBrutos(cajasPorMercaEspTipoPrec).toFixed(2));
                      hojaDetalle.getCell("G" + filaCaja).numFmt = formatoNumero;
                      hojaDetalle.getCell("H" + filaCaja).value = parseFloat((kilosNetos * (precio / 1000)).toFixed(2));
                      hojaDetalle.getCell("H" + filaCaja).numFmt = formatoNumero;
                      hojaDetalle.getCell("I" + filaCaja).value = precio / 1000;
                      hojaDetalle.getCell("I" + filaCaja).numFmt = formatoNumero;
                      hojaDetalle.getCell("I" + filaCaja).alignment = alineacionCentro;
                      hojaDetalle.getCell("J" + filaCaja).value = esp + " " + tipo;
                      hojaDetalle.getCell("J" + filaCaja).alignment = alineacionCentro;
                      hojaDetalle.getCell("J" + filaCaja).font = fuenteEspecieTipo;
                      hojaDetalle.getCell("O" + filaCaja).value = parseFloat((kilosNetos * (precio / 1000)).toFixed(2));
                      hojaDetalle.getCell("O" + filaCaja).numFmt = formatoNumero;
                      hojaDetalle.getCell("P" + filaCaja).value = precio;
                      hojaDetalle.getCell("P" + filaCaja).numFmt = formatoNumero;
                      filaCaja++;
                  // });
                });
              }
              const cantCajas = this.deps.cantidadCajas(cajasPorMercaEspTipo);
              const dataByContainer: DataKosherAgrupada[] = dataAgrupada.filter(d => d.container === cont);
              const dataAgrupadaByCont: TotalDataAgrupada = this.kcs.totalDataAgrupadaPorContainer(dataByContainer);
              if(cantCajas > 0) {
                const kilosNetos = this.deps.sumarKilosNetos(cajasPorMercaEspTipo);
                const sumaPrecios = this.deps.sumarPrecios(cajasPorMercaEspTipo);
                hojaDetalle.getCell("D" + filaCaja).value = sumPallets;
                hojaDetalle.getCell("D" + filaCaja).font = fuenteSubTitulos;
                hojaDetalle.getCell("D" + filaCaja).style.fill = fondoSubTotal;
                hojaDetalle.getCell("E" + filaCaja).value = cantCajas;
                hojaDetalle.getCell("E" + filaCaja).font = fuenteSubTitulos;
                hojaDetalle.getCell("E" + filaCaja).style.fill = fondoSubTotal;
                hojaDetalle.getCell("F" + filaCaja).value = parseFloat(kilosNetos.toFixed(2));
                hojaDetalle.getCell("F" + filaCaja).numFmt = formatoNumero;
                hojaDetalle.getCell("F" + filaCaja).font = fuenteSubTitulos;
                hojaDetalle.getCell("F" + filaCaja).style.fill = fondoSubTotal;
                hojaDetalle.getCell("G" + filaCaja).value = parseFloat(this.deps.sumarKilosBrutos(cajasPorMercaEspTipo).toFixed(2));
                hojaDetalle.getCell("G" + filaCaja).font = fuenteSubTitulos;
                hojaDetalle.getCell("G" + filaCaja).style.fill = fondoSubTotal;
                hojaDetalle.getCell("G" + filaCaja).numFmt = formatoNumero;
                hojaDetalle.getCell("H" + filaCaja).value = parseFloat(sumaPrecios.toFixed(2));
                hojaDetalle.getCell("H" + filaCaja).font = fuenteSubTitulos;
                hojaDetalle.getCell("H" + filaCaja).style.fill = fondoSubTotal;
                hojaDetalle.getCell("H" + filaCaja).numFmt = formatoNumero;
                hojaDetalle.getCell("I" + filaCaja).value = parseFloat((sumaPrecios / kilosNetos * 1000).toFixed(2));
                hojaDetalle.getCell("I" + filaCaja).font = fuentePProm;
                hojaDetalle.getCell("I" + filaCaja).alignment = alineacionCentro;
                hojaDetalle.getCell("I" + filaCaja).numFmt = formatoNumero;
                hojaDetalle.getCell("K" + filaCaja).value = cont;
                hojaDetalle.getCell("K" + filaCaja).font = fuenteContainer;
                hojaDetalle.getCell("K" + filaCaja).alignment = alineacionCentro;
                hojaDetalle.getCell("L" + filaCaja).value = 0.0;
                hojaDetalle.getCell("L" + filaCaja).numFmt = formatoNumero;
                hojaDetalle.getCell("L" + filaCaja).font = fuenteSubTitulos;
                hojaDetalle.getCell("L" + filaCaja).style.fill = fondoSubTotal;
                hojaDetalle.getCell("M" + filaCaja).value = 0.0;
                hojaDetalle.getCell("M" + filaCaja).numFmt = formatoNumero;
                hojaDetalle.getCell("M" + filaCaja).font = fuenteSubTitulos;
                hojaDetalle.getCell("M" + filaCaja).style.fill = fondoSubTotal;
                hojaDetalle.getCell("N" + filaCaja).value = 0.0;
                hojaDetalle.getCell("N" + filaCaja).numFmt = formatoNumero;
                hojaDetalle.getCell("N" + filaCaja).font = fuenteSubTitulos;
                hojaDetalle.getCell("N" + filaCaja).style.fill = fondoSubTotal;
                hojaDetalle.getCell("O" + filaCaja).value = parseFloat(sumaPrecios.toFixed(2));
                hojaDetalle.getCell("O" + filaCaja).font = fuenteSubTitulos;
                hojaDetalle.getCell("O" + filaCaja).style.fill = fondoSubTotal;
                hojaDetalle.getCell("O" + filaCaja).numFmt = formatoNumero;
                hojaDetalle.getCell("P" + filaCaja).value = parseFloat((sumaPrecios / kilosNetos * 1000).toFixed(2));
                hojaDetalle.getCell("P" + filaCaja).font = fuenteSubTitulos;
                hojaDetalle.getCell("P" + filaCaja).style.fill = fondoSubTotal;
                hojaDetalle.getCell("P" + filaCaja).numFmt = formatoNumero;
                filaCaja += 2;
              }
            });
        });
      });
    }

    const kilosNetosCortes = this.deps.sumarKilosNetos(cortes);
    const sumaPreciosCortes = this.deps.sumarPrecios(cortes);
    const containerByMerca = dataAgrupada.filter(d => d.mercaderia === 'CORTES');
    
    hojaDetalle.getCell("C" + filaCaja).value = "TOTAL";
    hojaDetalle.getCell("C" + filaCaja).font = fuenteMerca;
    hojaDetalle.getCell("C" + filaCaja).alignment = alineacionCentro;
    hojaDetalle.getCell("D" + filaCaja).value = this.kcs.getTotalPalletsByContainer(containerByMerca);
    hojaDetalle.getCell("D" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("D" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("E" + filaCaja).value = this.deps.cantidadCajas(cortes);
    hojaDetalle.getCell("E" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("E" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("F" + filaCaja).value = parseFloat(kilosNetosCortes.toFixed(2));
    hojaDetalle.getCell("F" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("F" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("F" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("G" + filaCaja).value = parseFloat(this.deps.sumarKilosBrutos(cortes).toFixed(2));
    hojaDetalle.getCell("G" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("G" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("G" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("H" + filaCaja).value = parseFloat(sumaPreciosCortes.toFixed(2));
    hojaDetalle.getCell("H" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("H" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("H" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("K" + filaCaja).value = "TOTAL";
    hojaDetalle.getCell("K" + filaCaja).alignment = alineacionCentro;
    hojaDetalle.getCell("K" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("K" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("L" + filaCaja).value = 0;
    hojaDetalle.getCell("L" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("L" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("M" + filaCaja).value = 0;
    hojaDetalle.getCell("M" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("M" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("N" + filaCaja).value = 0;
    hojaDetalle.getCell("N" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("N" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("O" + filaCaja).value = parseFloat(sumaPreciosCortes.toFixed(2));
    hojaDetalle.getCell("O" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("O" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("O" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("P" + filaCaja).value = parseFloat((sumaPreciosCortes / kilosNetosCortes * 1000).toFixed(2));
    hojaDetalle.getCell("P" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("P" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("P" + filaCaja).numFmt = formatoNumero;
    filaCaja += 2;

  }
    // NO CORTES
    const noCortes = this.deps.obtenerCajasPorMercaderia(dataKosher);
    if(noCortes.length > 0) {
    const nombresMercaderias = Array.from(new Set(noCortes.map(nc => nc.mercaderia)));
    nombresMercaderias.sort((a, b) => {
      if(a <= b) return -1;
      return 1;
    });
    
    nombresMercaderias.forEach(merca => {
      const cajasPorMerca = noCortes.filter(nc => nc.mercaderia == merca);
      containers.forEach(cont => {
        const cajasPorContainer = cajasPorMerca.filter(cpm => cpm.container == cont);
        if(cajasPorContainer.length > 0) {
          especies.forEach(esp => {
            const cajasPorEspecie = cajasPorContainer.filter(cpc => cpc.especie == esp);
            if(cajasPorEspecie.length > 0 ) {
              tipos.forEach(t => {
                const cajasPorTipo = cajasPorEspecie.filter(cpe => cpe.tipoProducto == t);
                const precios = Array.from(new Set(cajasPorTipo.map(cpt => cpt.precioTonelada))).sort((a, b) => { if(a >= b) return 1; else return -1});
                if(precios.length > 0) {
                  precios.forEach(precio => {
                    const cajasPorPrecio = cajasPorTipo.filter(cpt => cpt.precioTonelada == precio);
                    const kilosNetos = this.deps.sumarKilosNetos(cajasPorPrecio);
                    //hojaDetalle.getCell("B" + filaCaja).value = embarqueConfig.dua;
                    hojaDetalle.getCell("B" + filaCaja).alignment = alineacionCentro;
                    hojaDetalle.getCell("C" + filaCaja).value = this.deps.nombresDict[merca];
                    hojaDetalle.getCell("C" + filaCaja).font = fuenteMerca;
                    hojaDetalle.getCell("C" + filaCaja).alignment = alineacionCentro;
                    hojaDetalle.getCell("D" + filaCaja).value = this.deps.cantidadPallets(cajasPorPrecio);
                    hojaDetalle.getCell("E" + filaCaja).value = this.deps.cantidadCajas(cajasPorPrecio);
                    hojaDetalle.getCell("F" + filaCaja).value = parseFloat(kilosNetos.toFixed(2));
                    hojaDetalle.getCell("F" + filaCaja).numFmt = formatoNumero;
                    hojaDetalle.getCell("G" + filaCaja).value = parseFloat(this.deps.sumarKilosBrutos(cajasPorPrecio).toFixed(2)); 
                    hojaDetalle.getCell("G" + filaCaja).numFmt = formatoNumero;
                    hojaDetalle.getCell("H" + filaCaja).value = parseFloat(((precio / 1000) * kilosNetos).toFixed(2));
                    hojaDetalle.getCell("H" + filaCaja).numFmt = formatoNumero;
                    hojaDetalle.getCell("I" + filaCaja).value = precio / 1000;
                    hojaDetalle.getCell("I" + filaCaja).numFmt = formatoNumero;
                    hojaDetalle.getCell("I" + filaCaja).alignment = alineacionCentro;
                    hojaDetalle.getCell("J" + filaCaja).value = esp + " " + t;
                    hojaDetalle.getCell("J" + filaCaja).font = fuenteEspecieTipo;
                    hojaDetalle.getCell("J" + filaCaja).alignment = alineacionCentro;
                    hojaDetalle.getCell("K" + filaCaja).value = cont;
                    hojaDetalle.getCell("K" + filaCaja).alignment = alineacionCentro;
                    hojaDetalle.getCell("K" + filaCaja).font = fuenteConteinerNoCorte;
                    hojaDetalle.getCell("O" + filaCaja).value = parseFloat(((precio / 1000) * kilosNetos).toFixed(2));
                    hojaDetalle.getCell("O" + filaCaja).numFmt = formatoNumero;
                    hojaDetalle.getCell("P" + filaCaja).value = precio;
                    hojaDetalle.getCell("P" + filaCaja).numFmt = formatoNumero;
                    filaCaja++;
                  });
                }
              });
            }
          });
        }
      });
      const kilosNetos = this.deps.sumarKilosNetos(cajasPorMerca);
      const sumaPrecios = this.deps.sumarPrecios(cajasPorMerca);
      
      hojaDetalle.getCell("C" + filaCaja).value = "TOTAL";
      hojaDetalle.getCell("C" + filaCaja).font = fuenteTotalMerca;
      hojaDetalle.getCell("C" + filaCaja).style.fill = fondoTotalMerca;
      hojaDetalle.getCell("C" + filaCaja).alignment = alineacionCentro;
      hojaDetalle.getCell("D" + filaCaja).value = this.deps.cantidadPallets(cajasPorMerca);
      hojaDetalle.getCell("D" + filaCaja).font = fuenteTotalMerca;
      hojaDetalle.getCell("D" + filaCaja).style.fill = fondoTotalMerca;
      hojaDetalle.getCell("E" + filaCaja).value = this.deps.cantidadCajas(cajasPorMerca);
      hojaDetalle.getCell("E" + filaCaja).font = fuenteTotalMerca;
      hojaDetalle.getCell("E" + filaCaja).style.fill = fondoTotalMerca;
      hojaDetalle.getCell("F" + filaCaja).value = parseFloat(kilosNetos.toFixed(2));
      hojaDetalle.getCell("F" + filaCaja).font = fuenteTotalMerca;
      hojaDetalle.getCell("F" + filaCaja).style.fill = fondoTotalMerca;
      hojaDetalle.getCell("F" + filaCaja).numFmt = formatoNumero;
      hojaDetalle.getCell("G" + filaCaja).value = parseFloat(this.deps.sumarKilosBrutos(cajasPorMerca).toFixed(2));
      hojaDetalle.getCell("G" + filaCaja).font = fuenteTotalMerca;
      hojaDetalle.getCell("G" + filaCaja).style.fill = fondoTotalMerca;
      hojaDetalle.getCell("G" + filaCaja).numFmt = formatoNumero;
      hojaDetalle.getCell("H" + filaCaja).value = parseFloat(sumaPrecios.toFixed(2));
      hojaDetalle.getCell("H" + filaCaja).font = fuenteTotalMerca;
      hojaDetalle.getCell("H" + filaCaja).style.fill = fondoTotalMerca;
      hojaDetalle.getCell("H" + filaCaja).numFmt = formatoNumero;
      hojaDetalle.getCell("I" + filaCaja).value = parseFloat((sumaPrecios / kilosNetos * 1000).toFixed(2));
      hojaDetalle.getCell("I" + filaCaja).font = fuentePProm;
      hojaDetalle.getCell("I" + filaCaja).alignment = alineacionCentro;
      hojaDetalle.getCell("I" + filaCaja).numFmt = formatoNumero;
      hojaDetalle.getCell("K" + filaCaja).value = "TOTAL";
      hojaDetalle.getCell("K" + filaCaja).font = fuenteTotalMerca;
      hojaDetalle.getCell("K" + filaCaja).alignment = alineacionCentro;
      hojaDetalle.getCell("K" + filaCaja).style.fill = fondoTotalMerca;
      hojaDetalle.getCell("L" + filaCaja).font = fuenteTotalMerca;
      hojaDetalle.getCell("L" + filaCaja).style.fill = fondoTotalMerca;
      hojaDetalle.getCell("M" + filaCaja).font = fuenteTotalMerca;
      hojaDetalle.getCell("M" + filaCaja).style.fill = fondoTotalMerca;
      hojaDetalle.getCell("N" + filaCaja).font = fuenteTotalMerca;
      hojaDetalle.getCell("N" + filaCaja).style.fill = fondoTotalMerca;
      hojaDetalle.getCell("O" + filaCaja).value = parseFloat(sumaPrecios.toFixed(2));
      hojaDetalle.getCell("O" + filaCaja).font = fuenteTotalMerca;
      hojaDetalle.getCell("O" + filaCaja).style.fill = fondoTotalMerca;
      hojaDetalle.getCell("O" + filaCaja).numFmt = formatoNumero;
      hojaDetalle.getCell("P" + filaCaja).value = parseFloat((sumaPrecios / kilosNetos * 1000).toFixed(2));
      hojaDetalle.getCell("P" + filaCaja).font = fuenteTotalMerca;
      hojaDetalle.getCell("P" + filaCaja).style.fill = fondoTotalMerca;
      hojaDetalle.getCell("P" + filaCaja).numFmt = formatoNumero;
      filaCaja += 2;
    });

    const kilosNetosNoCortes = this.deps.sumarKilosNetos(noCortes);
    const sumaPreciosNoCortes = this.deps.sumarPrecios(noCortes);
    const containerByMerca = dataAgrupada.filter(d => d.mercaderia != 'CORTES');
    hojaDetalle.getCell("C" + filaCaja).value = "TOTAL";
    hojaDetalle.getCell("C" + filaCaja).font = fuenteMerca;
    hojaDetalle.getCell("C" + filaCaja).alignment = alineacionCentro;
    hojaDetalle.getCell("D" + filaCaja).value = this.kcs.getTotalPalletsByContainer(containerByMerca);
    hojaDetalle.getCell("D" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("D" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("E" + filaCaja).value = this.deps.cantidadCajas(noCortes);
    hojaDetalle.getCell("E" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("E" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("F" + filaCaja).value = parseFloat(kilosNetosNoCortes.toFixed(2));
    hojaDetalle.getCell("F" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("F" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("F" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("G" + filaCaja).value = parseFloat(this.deps.sumarKilosBrutos(noCortes).toFixed(2));
    hojaDetalle.getCell("G" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("G" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("G" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("H" + filaCaja).value = parseFloat(sumaPreciosNoCortes.toFixed(2));
    hojaDetalle.getCell("H" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("H" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("H" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("K" + filaCaja).value = "TOTAL";
    hojaDetalle.getCell("K" + filaCaja).alignment = alineacionCentro;
    hojaDetalle.getCell("K" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("K" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("L" + filaCaja).value = 0;
    hojaDetalle.getCell("L" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("L" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("L" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("M" + filaCaja).value = 0;
    hojaDetalle.getCell("M" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("M" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("M" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("N" + filaCaja).value = 0;
    hojaDetalle.getCell("N" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("N" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("N" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("O" + filaCaja).value = parseFloat(sumaPreciosNoCortes.toFixed(2));
    hojaDetalle.getCell("O" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("O" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("O" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("P" + filaCaja).value = parseFloat((sumaPreciosNoCortes / kilosNetosNoCortes * 1000).toFixed(2));
    hojaDetalle.getCell("P" + filaCaja).font = fuenteTotalMerca;
    hojaDetalle.getCell("P" + filaCaja).style.fill = fondoTotalMerca;
    hojaDetalle.getCell("P" + filaCaja).numFmt = formatoNumero;
    filaCaja += 2;
  }
    //TOTAL GENERAL
    filaCaja += 2;
    const kilosNetos = this.deps.sumarKilosNetos(dataKosher);
    const sumaPrecios = this.deps.sumarPrecios(dataKosher);
    hojaDetalle.getCell("B" + filaCaja).value = "TOTAL GENERAL";
    hojaDetalle.getCell("B" + filaCaja).font = fuenteTotalGeneral;
    hojaDetalle.getCell("B" + filaCaja).style.fill = fondoTotalGeneral;
    hojaDetalle.getCell("C" + filaCaja).font = fuenteTotalGeneral;
    hojaDetalle.getCell("C" + filaCaja).style.fill = fondoTotalGeneral;
    hojaDetalle.getCell("D" + filaCaja).value = totalPallets;
    hojaDetalle.getCell("D" + filaCaja).font = fuenteTotalGeneral;
    hojaDetalle.getCell("D" + filaCaja).style.fill = fondoTotalGeneral;
    hojaDetalle.getCell("E" + filaCaja).value = this.deps.cantidadCajas(dataKosher);
    hojaDetalle.getCell("E" + filaCaja).font = fuenteTotalGeneral;
    hojaDetalle.getCell("E" + filaCaja).style.fill = fondoTotalGeneral;
    hojaDetalle.getCell("F" + filaCaja).value = parseFloat(kilosNetos.toFixed(2));
    hojaDetalle.getCell("F" + filaCaja).font = fuenteTotalGeneral;
    hojaDetalle.getCell("F" + filaCaja).style.fill = fondoTotalGeneral;
    hojaDetalle.getCell("F" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("G" + filaCaja).value = parseFloat(this.deps.sumarKilosBrutos(dataKosher).toFixed(2));
    hojaDetalle.getCell("G" + filaCaja).font = fuenteTotalGeneral;
    hojaDetalle.getCell("G" + filaCaja).style.fill = fondoTotalGeneral;
    hojaDetalle.getCell("G" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("H" + filaCaja).value = parseFloat(sumaPrecios.toFixed(2));
    hojaDetalle.getCell("H" + filaCaja).font = fuenteTotalGeneral;
    hojaDetalle.getCell("H" + filaCaja).style.fill = fondoTotalGeneral;
    hojaDetalle.getCell("H" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("L" + filaCaja).value = 0.0;
    hojaDetalle.getCell("L" + filaCaja).font = fuenteTotalGeneral;
    hojaDetalle.getCell("L" + filaCaja).style.fill = fondoTotalGeneral;
    hojaDetalle.getCell("L" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("M" + filaCaja).value = 0.0;
    hojaDetalle.getCell("M" + filaCaja).font = fuenteTotalGeneral;
    hojaDetalle.getCell("M" + filaCaja).style.fill = fondoTotalGeneral;
    hojaDetalle.getCell("M" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("N" + filaCaja).value = 0.0;
    hojaDetalle.getCell("N" + filaCaja).font = fuenteTotalGeneral;
    hojaDetalle.getCell("N" + filaCaja).style.fill = fondoTotalGeneral;
    hojaDetalle.getCell("N" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("O" + filaCaja).value = parseFloat(sumaPrecios.toFixed(2));
    hojaDetalle.getCell("O" + filaCaja).font = fuenteTotalGeneral;
    hojaDetalle.getCell("O" + filaCaja).style.fill = fondoTotalGeneral;
    hojaDetalle.getCell("O" + filaCaja).numFmt = formatoNumero;
    hojaDetalle.getCell("P" + filaCaja).value = parseFloat((sumaPrecios / kilosNetos * 1000).toFixed(2));
    hojaDetalle.getCell("P" + filaCaja).font = fuenteTotalGeneral;
    hojaDetalle.getCell("P" + filaCaja).style.fill = fondoTotalGeneral;
    hojaDetalle.getCell("P" + filaCaja).numFmt = formatoNumero;
  

    /* Hoja desglose */
    const tituloDesglose: string = "Desglose";
    const hojaDesglose = libro.addWorksheet(tituloDesglose);
    this.setLogo(libro, hojaDesglose);
    this.setTitle(libro, hojaDesglose, tituloDesglose, 'right', 8);

    var filaCaja = 6;
    if(cortes.length > 0) {
    especies.forEach(esp => {
      const cajasPorEspecie = cortes.filter(c => c.especie == esp);
      if(cajasPorEspecie.length > 0) {
        tipos.forEach(tipo => {
          const cajasPorTipo = cajasPorEspecie.filter(c => c.tipoProducto == tipo);
          if(cajasPorTipo.length > 0) {
            const precios = Array.from(new Set(cajasPorTipo.map(c => c.precioTonelada))).sort((a, b) => { if(a >= b) return 1; else return -1});
            if(precios.length > 0) {
              precios.forEach(precio => {
                const cajasPorPrecio = cajasPorTipo.filter(c => c.precioTonelada == precio);
                if(cajasPorPrecio.length > 0) {
                  const filaEspecie = filaCaja;
                  containers.forEach(cont => {
                    const cajasContainer = cajasPorPrecio.filter(c => c.container == cont);
                    if(cajasContainer.length > 0) {
                      const kilosNetos = this.deps.sumarKilosNetos(cajasPorPrecio);
                      hojaDesglose.getCell("B" + filaCaja).value = this.deps.cantidadPallets(cajasContainer);
                      hojaDesglose.getCell("C" + filaCaja).value = this.deps.cantidadCajas(cajasContainer);
                      hojaDesglose.getCell("D" + filaCaja).value = parseFloat(kilosNetos.toFixed(2));
                      hojaDesglose.getCell("D" + filaCaja).numFmt = formatoNumero;
                      hojaDesglose.getCell("E" + filaCaja).value = parseFloat(this.deps.sumarKilosBrutos(cajasContainer).toFixed(2));
                      hojaDesglose.getCell("E" + filaCaja).numFmt = formatoNumero;
                      hojaDesglose.getCell("F" + filaCaja).value = parseFloat(this.deps.sumarPrecios(cajasContainer).toFixed(2));
                      hojaDesglose.getCell("F" + filaCaja).numFmt = formatoNumero;
                      hojaDesglose.getCell("G" + filaEspecie).value = precio / 1000;
                      hojaDesglose.getCell("G" + filaCaja).numFmt = formatoNumero;
                      hojaDesglose.getCell("G" + filaEspecie).alignment = alineacionCentro;
                      hojaDesglose.getCell("G" + filaEspecie).font = fuenteEspecieCortes;
                      hojaDesglose.getCell("H" + filaEspecie).value = esp + " " + tipo;
                      hojaDesglose.getCell("H" + filaEspecie).alignment = alineacionCentro;
                      hojaDesglose.getCell("H" + filaEspecie).font = fuenteEspecieCortes;
                      filaCaja++; 
                    }
                  });
                    const kilosNetos = this.deps.sumarKilosNetos(cajasPorPrecio);
                    hojaDesglose.getCell("B" + filaCaja).value = this.deps.cantidadPallets(cajasPorPrecio);
                    hojaDesglose.getCell("B" + filaCaja).font = fuenteTotalCortesDesglose;
                    hojaDesglose.getCell("C" + filaCaja).value = this.deps.cantidadCajas(cajasPorPrecio);
                    hojaDesglose.getCell("C" + filaCaja).font = fuenteTotalCortesDesglose;
                    hojaDesglose.getCell("D" + filaCaja).value = parseFloat(kilosNetos.toFixed(2));
                    hojaDesglose.getCell("D" + filaCaja).font = fuenteTotalCortesDesglose;
                    hojaDesglose.getCell("D" + filaCaja).numFmt = formatoNumero;
                    hojaDesglose.getCell("E" + filaCaja).value = parseFloat(this.deps.sumarKilosBrutos(cajasPorPrecio).toFixed(2));
                    hojaDesglose.getCell("E" + filaCaja).font = fuenteTotalCortesDesglose;
                    hojaDesglose.getCell("E" + filaCaja).numFmt = formatoNumero;
                    hojaDesglose.getCell("F" + filaCaja).value = parseFloat(this.deps.sumarPrecios(cajasPorPrecio).toFixed(2));
                    hojaDesglose.getCell("F" + filaCaja).font = fuenteTotalCortesDesglose;
                    hojaDesglose.getCell("F" + filaCaja).numFmt = formatoNumero;
                    hojaDesglose.getCell("G" + filaEspecie).value = precio / 1000;
                    hojaDesglose.getCell("G" + filaCaja).numFmt = formatoNumero;
                    hojaDesglose.getCell("G" + filaEspecie).alignment = alineacionCentro;
                    hojaDesglose.getCell("G" + filaCaja).font = fuenteTotalCortesDesglose;
                    hojaDesglose.getCell("H" + filaEspecie).value = esp + " " + tipo;
                    hojaDesglose.getCell("H" + filaEspecie).alignment = alineacionCentro;
                    hojaDesglose.getCell("H" + filaCaja).font = fuenteTotalCortesDesglose;
                }
                filaCaja += 2;
              });
            }
          }
        });
      }
    });

    const containerByMerca = dataAgrupada.filter(d => d.mercaderia === 'CORTES');
    hojaDesglose.getCell("B" + filaCaja).value = this.kcs.getTotalPalletsByContainer(containerByMerca);
    hojaDesglose.getCell("B" + filaCaja).font = fuenteTotalDesglose;
    hojaDesglose.getCell("C" + filaCaja).value = this.deps.cantidadCajas(cortes);
    hojaDesglose.getCell("C" + filaCaja).font = fuenteTotalDesglose;
    hojaDesglose.getCell("D" + filaCaja).value = parseFloat(this.deps.sumarKilosNetos(cortes).toFixed(2));
    hojaDesglose.getCell("D" + filaCaja).font = fuenteTotalDesglose;
    hojaDesglose.getCell("D" + filaCaja).numFmt = formatoNumero;
    hojaDesglose.getCell("E" + filaCaja).value = parseFloat(this.deps.sumarKilosBrutos(cortes).toFixed(2));
    hojaDesglose.getCell("E" + filaCaja).font = fuenteTotalDesglose;
    hojaDesglose.getCell("E" + filaCaja).numFmt = formatoNumero;
    hojaDesglose.getCell("F" + filaCaja).value = parseFloat(this.deps.sumarPrecios(cortes).toFixed(2));
    hojaDesglose.getCell("F" + filaCaja).font = fuenteTotalDesglose;
    hojaDesglose.getCell("F" + filaCaja).numFmt = formatoNumero;

    }

    // NO CORTES
    filaCaja += 2;
    if(noCortes.length > 0) {
    mercaderias.forEach(merca => {
      const cajasMerca = noCortes.filter(c => c.mercaderia == merca);
      especies.forEach(esp => {
        const cajasPorEspecie = cajasMerca.filter(c => c.especie == esp);
        if(cajasPorEspecie.length > 0) {
          tipos.forEach(tipo => {
            const cajasPorTipo = cajasPorEspecie.filter(c => c.tipoProducto == tipo);
            if(cajasPorTipo.length > 0) {
              const precios = Array.from(new Set(cajasPorTipo.map(c => c.precioTonelada))).sort((a, b) => { if(a >= b) return 1; else return -1});
              if(precios.length > 0) {
                precios.forEach(precio => {
                  const cajasPorPrecio = cajasPorTipo.filter(c => c.precioTonelada == precio);
                  if(cajasPorPrecio.length > 0) {
                    hojaDesglose.getCell("B" + filaCaja).value = this.deps.nombresDict[merca];
                    hojaDesglose.getCell("B" + filaCaja).font = fuenteMerca;
                    hojaDesglose.getCell("B" + filaCaja).alignment = alineacionCentro;
                    filaCaja++;
                    const filaEspecie = filaCaja;
                    containers.forEach(cont => {
                      const cajasContainer = cajasPorPrecio.filter(c => c.container == cont);
                      if(cajasContainer.length > 0) {
                      const kilosNetos = this.deps.sumarKilosNetos(cajasPorPrecio);
                      hojaDesglose.getCell("B" + filaCaja).value = this.deps.cantidadPallets(cajasContainer);
                      hojaDesglose.getCell("C" + filaCaja).value = this.deps.cantidadCajas(cajasContainer);
                      hojaDesglose.getCell("D" + filaCaja).value = parseFloat(kilosNetos.toFixed(2));
                      hojaDesglose.getCell("D" + filaCaja).numFmt = formatoNumero;
                      hojaDesglose.getCell("E" + filaCaja).value = parseFloat(this.deps.sumarKilosBrutos(cajasContainer).toFixed(2));
                      hojaDesglose.getCell("E" + filaCaja).numFmt = formatoNumero;
                      hojaDesglose.getCell("F" + filaCaja).value = parseFloat(this.deps.sumarPrecios(cajasContainer).toFixed(2));
                      hojaDesglose.getCell("F" + filaCaja).numFmt = formatoNumero;
                      hojaDesglose.getCell("G" + filaEspecie).value = precio / 1000;
                      hojaDesglose.getCell("G" + filaCaja).numFmt = formatoNumero;
                      hojaDesglose.getCell("G" + filaEspecie).font = fuenteMerca;
                      hojaDesglose.getCell("G" + filaEspecie).alignment = alineacionCentro;
                      hojaDesglose.getCell("H" + filaEspecie).value = esp + " " + tipo;
                      hojaDesglose.getCell("H" + filaEspecie).font = fuenteMerca;
                      hojaDesglose.getCell("H" + filaEspecie).alignment = alineacionCentro;
                      filaCaja++; 
                    }
                    });
                      const kilosNetos = this.deps.sumarKilosNetos(cajasPorPrecio);
                      hojaDesglose.getCell("B" + filaCaja).value = this.deps.cantidadPallets(cajasPorPrecio);
                      hojaDesglose.getCell("B" + filaCaja).font = fuenteTotalDesglose;
                      hojaDesglose.getCell("C" + filaCaja).value = this.deps.cantidadCajas(cajasPorPrecio);
                      hojaDesglose.getCell("C" + filaCaja).font = fuenteTotalDesglose;
                      hojaDesglose.getCell("D" + filaCaja).value = parseFloat(kilosNetos.toFixed(2));
                      hojaDesglose.getCell("D" + filaCaja).font = fuenteTotalDesglose;
                      hojaDesglose.getCell("D" + filaCaja).numFmt = formatoNumero;
                      hojaDesglose.getCell("E" + filaCaja).value = parseFloat(this.deps.sumarKilosBrutos(cajasPorPrecio).toFixed(2));
                      hojaDesglose.getCell("E" + filaCaja).font = fuenteTotalDesglose;
                      hojaDesglose.getCell("E" + filaCaja).numFmt = formatoNumero;
                      hojaDesglose.getCell("F" + filaCaja).value = parseFloat(this.deps.sumarPrecios(cajasPorPrecio).toFixed(2));
                      hojaDesglose.getCell("F" + filaCaja).font = fuenteTotalDesglose;
                      hojaDesglose.getCell("F" + filaCaja).numFmt = formatoNumero;
                      hojaDesglose.getCell("G" + filaEspecie).value = precio;
                      hojaDesglose.getCell("G" + filaCaja).numFmt = formatoNumero;
                      hojaDesglose.getCell("G" + filaCaja).font = fuenteTotalDesglose;
                      hojaDesglose.getCell("H" + filaEspecie).value = esp + " " + tipo;
                      hojaDesglose.getCell("H" + filaCaja).font = fuenteTotalDesglose;
                  }
                  filaCaja += 2;
                });
              }
            }
          });
        }
      });
    });
    
    const containerByMerca = dataAgrupada.filter(d => d.mercaderia != 'CORTES');
    hojaDesglose.getCell("B" + filaCaja).value = this.kcs.getTotalPalletsByContainer(containerByMerca);
    hojaDesglose.getCell("B" + filaCaja).font = fuenteTotalDesglose;
    hojaDesglose.getCell("C" + filaCaja).value = this.deps.cantidadCajas(noCortes);
    hojaDesglose.getCell("C" + filaCaja).font = fuenteTotalDesglose;
    hojaDesglose.getCell("D" + filaCaja).value = parseFloat(this.deps.sumarKilosNetos(noCortes).toFixed(2));
    hojaDesglose.getCell("D" + filaCaja).font = fuenteTotalDesglose;
    hojaDesglose.getCell("D" + filaCaja).numFmt = formatoNumero;
    hojaDesglose.getCell("E" + filaCaja).value = parseFloat(this.deps.sumarKilosBrutos(noCortes).toFixed(2));
    hojaDesglose.getCell("E" + filaCaja).font = fuenteTotalDesglose;
    hojaDesglose.getCell("E" + filaCaja).numFmt = formatoNumero;
    hojaDesglose.getCell("F" + filaCaja).value = parseFloat(this.deps.sumarPrecios(noCortes).toFixed(2));
    hojaDesglose.getCell("F" + filaCaja).font = fuenteTotalDesglose;    
    hojaDesglose.getCell("F" + filaCaja).numFmt = formatoNumero;
  }

    // Total general
    filaCaja += 2;
    hojaDesglose.getCell("B" + filaCaja).value = totalPallets;
    hojaDesglose.getCell("B" + filaCaja).font = fuenteTotalDesglose;
    hojaDesglose.getCell("C" + filaCaja).value = this.deps.cantidadCajas(dataKosher);
    hojaDesglose.getCell("C" + filaCaja).font = fuenteTotalDesglose;
    hojaDesglose.getCell("D" + filaCaja).value = parseFloat(this.deps.sumarKilosNetos(dataKosher).toFixed(2));
    hojaDesglose.getCell("D" + filaCaja).font = fuenteTotalDesglose;
    hojaDesglose.getCell("D" + filaCaja).numFmt = formatoNumero;
    hojaDesglose.getCell("E" + filaCaja).value = parseFloat(this.deps.sumarKilosBrutos(dataKosher).toFixed(2));
    hojaDesglose.getCell("E" + filaCaja).font = fuenteTotalDesglose;
    hojaDesglose.getCell("E" + filaCaja).numFmt = formatoNumero;
    hojaDesglose.getCell("F" + filaCaja).value = parseFloat(this.deps.sumarPrecios(dataKosher).toFixed(2)) ;
    hojaDesglose.getCell("F" + filaCaja).font = fuenteTotalDesglose;
    hojaDesglose.getCell("F" + filaCaja).numFmt = formatoNumero;

    hojaDesglose.getColumn(4).width = 18;
    hojaDesglose.getColumn(5).width = 18;
    hojaDesglose.getColumn(6).width = 18;
    hojaDesglose.getColumn(8).width = 27;
  }

  private printRendimientosCuota(dataToPrint: PrintModel, libro: Workbook): void {
    //ESTILOS
    const fondoTituloEntrada:       Fill                  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' }, bgColor: { argb: '00000000' }};
    const colorFuenteEntrada:       Partial<Font>         = { bold: true, color: {argb: 'FFFFFFFF'} };
    const fuenteAnimal:             Partial<Font>         = { bold: true, size: 7 };
    const fuenteTituloNombreCuota:  Partial<Font>         = { bold: true, size: 12, color: { argb: 'FF1f618d'}};
    const fuenteTitulo:             Partial<Font>         = { bold: true, size: 12 };
    const fuenteSubTitulo:          Partial<Font>         = { bold: true, size: 11 };
    const fuenteTituloCortes:       Partial<Font>         = { bold: true, size: 9 };
    const alineacionCentro:         Partial<Alignment>    = { vertical: 'middle', horizontal: 'center' };
    const alineacionDerecha:        Partial<Alignment>    = { vertical: 'middle', horizontal: 'right' };
    const alineacionIzquierda:      Partial<Alignment>    = { vertical: 'middle', horizontal: 'left' };
    const formatoNumeroDecimal:     string                = '#,##0.00';
    const formatoNumeroMillar:      string                = '#,##0';

    const qamarks:                  QamarkDTO[]           = dataToPrint.data.qamarks as QamarkDTO[];
    const tiposCuota:               ConfTipoCuotaDTO[]    = dataToPrint.data.tiposCuota as ConfTipoCuotaDTO[];
    const dataReporte:              ReporteCuota[]        = dataToPrint.data.reporteCuotaData as ReporteCuota[];
    let idsReporte:                 number[]              = dataToPrint.data.idsReporte;
    let reportes:                   TipoCuotaDict         = dataToPrint.data.reportes;
    let comparativoData:            Comparativo[]         = [];
    let qamarksUnicos:              QamarkDTO[]           = [];
    let comparativoDataFiltrada:    Comparativo[]         = [];
    let comparativoCuota:           Comparativo[]         = [];
    let comparativoNoCuota:         Comparativo[]         = [];
    let cuotaComparativoReporte:    ComparativoReporte[]  = [];
    let noCuotaComparativoReporte:  ComparativoReporte[]  = [];
    let qamarksCuota:               number[]              = [];
    let qamarksNoCuota:             number[]              = [];

    idsReporte = Array.from(new Set(idsReporte.map(i => i)));
    idsReporte.forEach(id => {
      let columna:  number = 2;
      const reporte:    ReporteCuota[]        = dataReporte.filter(dr => dr.id === id);
      const fechas:     string[]              = Array.from(new Set(reporte.map(r => r.fecha)));
      const tipoCuota:  string | undefined    = tiposCuota.find(tc => tc.id === id)?.nombre;
      const titulo:     string                = tipoCuota ?? `cuota_${id}`;
      const hoja:       Worksheet             = libro.addWorksheet(titulo);
      
      this.setLogo(libro, hoja);
      this.setTitle(libro, hoja, titulo, 'right', 16);

      fechas.forEach(fecha => {
        const reporteFecha: ReporteCuota[]              = reporte.filter(r => r.fecha === fecha);
        let repo:                     ReporteCuota      = reporteFecha[0];      
        let entradaDelantero:         LoteEntradaDTO[]  = [];
        let entradaTrasero:           LoteEntradaDTO[]  = [];
        let cortesCuota:              SalidaDTO[]       = [];
        let cortesNoCuota:            SalidaDTO[]       = [];
        let cortesDelanterosNoCuota:  SalidaDTO[]       = [];
        let cortesTraserosNoCuota:    SalidaDTO[]       = [];
        let totalDelanteros:          EntradaDisplay[]  = [];
        let totalTraseros:            EntradaDisplay[]  = [];

        let cortesReporte!:           CortesReporte;  
        let entradaReporte!:          EntradaReporte;
        let totalEntradaPorTipo!:     EntradaDisplayReporte;

        let rendimientoCortesCuota:   number = 0;
        let rendimientoCortesNoCuota: number = 0;
        let rendimientoCortesTotal:   number = 0;
        let totalCajas:               number = 0;
        let totalPesoCortes:          number = 0;
        let totalPesoCortesCuota:     number = 0;
        let totalPesoCortesNoCuota:   number = 0;

        let pesoDelanteros:          number = 0;
        let pesoTraseros:            number = 0;

        entradaReporte            = this.ccs.separarEntradaPorTipo(repo);
        entradaDelantero          = entradaReporte.entradaDelantero;
        entradaTrasero            = entradaReporte.entradaTrasero;
        totalEntradaPorTipo       = this.ccs.agruparEntrada(entradaDelantero, entradaTrasero);
        totalDelanteros           = totalEntradaPorTipo.delantero;
        totalTraseros             = totalEntradaPorTipo.trasero;
        cortesReporte             = this.ccs.separarCortesPorTipo(repo);
        cortesCuota               = cortesReporte.cuota;
        cortesNoCuota             = this.ccs.combinarProductosIguales(cortesReporte.nocuota);
        cortesDelanterosNoCuota   = this.ccs.combinarProductosIguales(cortesReporte.delanteroNoCuota);
        cortesTraserosNoCuota     = this.ccs.combinarProductosIguales(cortesReporte.traseroNoCuota);
        totalPesoCortesCuota      = this.ccs.totalPesoPorCortes(cortesCuota);
        totalPesoCortesNoCuota    = this.ccs.totalPesoPorCortes(cortesNoCuota) + cortesReporte.manta[0].peso;
        rendimientoCortesCuota    = totalPesoCortesCuota / totalEntradaPorTipo.peso;
        rendimientoCortesNoCuota  = totalPesoCortesNoCuota / totalEntradaPorTipo.peso;
        totalPesoCortes           = this.ccs.totalPesoCajas(repo.cortes!);
        totalCajas                = this.ccs.totalCajas(repo.cortes!);
        rendimientoCortesTotal    = totalPesoCortes / totalEntradaPorTipo.peso;

        // ENTRADA
        let fila: number = 6;
        hoja.getRow(fila).getCell(columna).value  = fecha;
        hoja.getRow(fila).getCell(columna).font   = fuenteTitulo;
        fila++;
        hoja.getRow(fila).getCell(columna).value  = "ENTRADA";
        hoja.getRow(fila).getCell(columna).font   = fuenteTitulo;

        fila++;
        totalDelanteros.forEach(del => {
          hoja.getRow(fila).getCell(columna).value      = del.nombre;
          hoja.getRow(fila).getCell(columna).font       = fuenteSubTitulo;
          hoja.getRow(fila).getCell(columna + 3).value  = del.cuartos;
          hoja.getRow(fila).getCell(columna + 3).font   = fuenteSubTitulo;
          hoja.getRow(fila).getCell(columna + 3).numFmt = formatoNumeroMillar;
          hoja.getRow(fila).getCell(columna + 4).value  = del.peso;
          hoja.getRow(fila).getCell(columna + 4).font   = fuenteSubTitulo;
          hoja.getRow(fila).getCell(columna + 4).numFmt = formatoNumeroDecimal;
          fila++;  
        }); 

        totalTraseros.forEach(tra => {
          hoja.getRow(fila).getCell(columna).value      = tra.nombre;
          hoja.getRow(fila).getCell(columna).font       = fuenteSubTitulo;
          hoja.getRow(fila).getCell(columna + 3).value  = tra.cuartos;
          hoja.getRow(fila).getCell(columna + 3).font   = fuenteSubTitulo;
          hoja.getRow(fila).getCell(columna + 3).numFmt = formatoNumeroMillar;
          hoja.getRow(fila).getCell(columna + 4).value  = tra.peso;
          hoja.getRow(fila).getCell(columna + 4).font   = fuenteSubTitulo;
          hoja.getRow(fila).getCell(columna + 4).numFmt = formatoNumeroDecimal;
          fila++;  
        });

        hoja.getRow(fila).getCell(columna).value          = 'TOTAL';
        hoja.getRow(fila).getCell(columna).font           = fuenteTitulo;
        hoja.getRow(fila).getCell(columna + 3).value      = totalEntradaPorTipo.cuartos;
        hoja.getRow(fila).getCell(columna + 3).font       = fuenteTitulo;
        hoja.getRow(fila).getCell(columna + 3).numFmt     = formatoNumeroMillar;
        hoja.getRow(fila).getCell(columna + 4).value      = totalEntradaPorTipo.peso;
        hoja.getRow(fila).getCell(columna + 4).font       = fuenteTitulo;
        hoja.getRow(fila).getCell(columna + 4).numFmt     = formatoNumeroDecimal; 
        hoja.getRow(fila).getCell(columna + 5).value      = "Kg x canal S/FALDA\n y S/ASADO a 13C";
        hoja.getRow(fila).getCell(columna + 5).alignment  = {wrapText: true, vertical: 'middle', horizontal: 'center'};
        hoja.getRow(fila).getCell(columna + 5).font       = fuenteAnimal;
        
        fila++;
        hoja.getRow(fila).getCell(columna).value      = "TOTAL ANIMALES";
        hoja.getRow(fila).getCell(columna).fill       = fondoTituloEntrada;
        hoja.getRow(fila).getCell(columna).font       = colorFuenteEntrada;
        hoja.getRow(fila).getCell(columna + 1).fill   = fondoTituloEntrada;
        hoja.getRow(fila).getCell(columna + 2).fill   = fondoTituloEntrada;
        hoja.getRow(fila).getCell(columna + 3).value  = totalTraseros[0].cuartos != 0 ? totalTraseros[0].cuartos / 2 : totalDelanteros[0].cuartos / 2;
        hoja.getRow(fila).getCell(columna + 3).fill   = fondoTituloEntrada;
        hoja.getRow(fila).getCell(columna + 3).font   = colorFuenteEntrada;
        hoja.getRow(fila).getCell(columna + 3).numFmt = formatoNumeroMillar;
        hoja.getRow(fila).getCell(columna + 4).value  = totalEntradaPorTipo.peso;
        hoja.getRow(fila).getCell(columna + 4).fill   = fondoTituloEntrada;
        hoja.getRow(fila).getCell(columna + 4).font   = colorFuenteEntrada; 
        hoja.getRow(fila).getCell(columna + 4).numFmt = formatoNumeroDecimal;
        hoja.getRow(fila).getCell(columna + 5).value  = totalEntradaPorTipo.pesoAnimal;
        hoja.getRow(fila).getCell(columna + 5).fill   = fondoTituloEntrada;
        hoja.getRow(fila).getCell(columna + 5).font   = colorFuenteEntrada;
        hoja.getRow(fila).getCell(columna + 5).numFmt = formatoNumeroDecimal;

        hoja.getColumn(columna + 4).width = 12;

        // CORTES
        totalDelanteros.forEach(del => {
          pesoDelanteros += del.peso;
        });
    
        totalTraseros.forEach(tra => {
          pesoTraseros += tra.peso;
        });

        fila += 2;
        hoja.getRow(fila).getCell(columna).value  = 'SALIDA';
        hoja.getRow(fila).getCell(columna).font   = fuenteTitulo;
        
        fila++;
        hoja.getRow(fila).getCell(columna).value  = 'CORTES CUOTA';
        hoja.getRow(fila).getCell(columna).font   = fuenteSubTitulo;

        fila++;
        hoja.getRow(fila).getCell(columna).value      = 'Código';
        hoja.getRow(fila).getCell(columna + 1).value  = 'Producto';
        hoja.getRow(fila).getCell(columna + 2).value  = 'Piezas';
        hoja.getRow(fila).getCell(columna + 3).value  = 'Cajas';
        hoja.getRow(fila).getCell(columna + 4).value  = 'Peso';
        hoja.getRow(fila).getCell(columna + 5).value  = 'Kg/Un';
        hoja.getRow(fila).getCell(columna + 6).value  = '% Rend';

        hoja.getColumn(columna + 5).width  = 16;

        for(let i = 0; i <= 6; i++) {
          hoja.getRow(fila).getCell(columna + i).font = fuenteTituloCortes;
          if(i >= 2)
            hoja.getRow(fila).getCell(columna + i).alignment = alineacionDerecha;
        }
        
        fila++;
        cortesCuota.forEach(cc => {
          hoja.getRow(fila).getCell(columna).value      = cc.code;
          hoja.getRow(fila).getCell(columna + 1).value  = cc.name;
          hoja.getRow(fila).getCell(columna + 2).value  = cc.piezas;
          hoja.getRow(fila).getCell(columna + 2).numFmt = formatoNumeroMillar;
          hoja.getRow(fila).getCell(columna + 3).value  = cc.cajas;
          hoja.getRow(fila).getCell(columna + 3).numFmt = formatoNumeroMillar;
          hoja.getRow(fila).getCell(columna + 4).value  = cc.peso;
          hoja.getRow(fila).getCell(columna + 4).numFmt = formatoNumeroDecimal;
          hoja.getRow(fila).getCell(columna + 5).value  = cc.pesoPorPieza;
          hoja.getRow(fila).getCell(columna + 5).numFmt = formatoNumeroDecimal;
          hoja.getRow(fila).getCell(columna + 6).value  = cc.condition.startsWith('D') ? parseFloat(((cc.peso / pesoDelanteros) * 100).toFixed(2)) + ' %' : parseFloat(((cc.peso / pesoTraseros) * 100).toFixed(2)) + ' %';
          hoja.getRow(fila).getCell(columna + 6).alignment = alineacionDerecha;
          fila++;
        });

        hoja.getRow(fila).getCell(columna).value          = 'TOTAL CORTES CUOTA';
        hoja.getRow(fila).getCell(columna).font           = fuenteSubTitulo;
        hoja.getRow(fila).getCell(columna + 4).value      = totalPesoCortesCuota;
        hoja.getRow(fila).getCell(columna + 4).numFmt     = formatoNumeroDecimal;
        hoja.getRow(fila).getCell(columna + 4).font       = fuenteSubTitulo;
        hoja.getRow(fila).getCell(columna + 6).value      = parseFloat((rendimientoCortesCuota * 100).toFixed(2))  + ' %';
        hoja.getRow(fila).getCell(columna + 6).alignment  = alineacionDerecha;
        hoja.getRow(fila).getCell(columna + 6).font       = fuenteSubTitulo;
        
        fila += 2;
        hoja.getRow(fila).getCell(columna).value = 'CORTES SIN DESTINO CUOTA';
        hoja.getRow(fila).getCell(columna).font  = fuenteSubTitulo;

        fila++;
        hoja.getRow(fila).getCell(columna).value      = 'Código';
        hoja.getRow(fila).getCell(columna + 1).value  = 'Producto';
        hoja.getRow(fila).getCell(columna + 2).value  = 'Cortes';
        hoja.getRow(fila).getCell(columna + 3).value  = '';
        hoja.getRow(fila).getCell(columna + 4).value  = 'Peso';
        hoja.getRow(fila).getCell(columna + 5).value  = 'Kg/Un';
        hoja.getRow(fila).getCell(columna + 6).value  = '% Rend';

        for(let i = 0; i <= 6; i++) {
          hoja.getRow(fila).getCell(columna + i).font = fuenteTituloCortes;
          if(i >= 2)
            hoja.getRow(fila).getCell(columna + i).alignment = alineacionDerecha;
        }

        fila++;
        cortesDelanterosNoCuota.forEach(cc => {
          hoja.getRow(fila).getCell(columna).value          = cc.code;
          hoja.getRow(fila).getCell(columna + 1).value      = cc.name;
          hoja.getRow(fila).getCell(columna + 2).value      = cc.piezas;
          hoja.getRow(fila).getCell(columna + 3).value      = '';
          hoja.getRow(fila).getCell(columna + 4).value      = cc.peso;
          hoja.getRow(fila).getCell(columna + 4).numFmt     = formatoNumeroDecimal;
          hoja.getRow(fila).getCell(columna + 5).value      = cc.pesoPorPieza;
          hoja.getRow(fila).getCell(columna + 5).numFmt     = formatoNumeroDecimal;
          hoja.getRow(fila).getCell(columna + 6).value      = parseFloat(((cc.peso / pesoDelanteros) * 100).toFixed(2)) + ' %';
          hoja.getRow(fila).getCell(columna + 6).alignment  = alineacionDerecha;
          fila++;
        });

        cortesTraserosNoCuota.forEach(cc => {
          hoja.getRow(fila).getCell(columna).value          = cc.code;
          hoja.getRow(fila).getCell(columna + 1).value      = cc.name;
          hoja.getRow(fila).getCell(columna + 2).value      = cc.piezas;
          hoja.getRow(fila).getCell(columna + 3).value      = '';
          hoja.getRow(fila).getCell(columna + 4).value      = cc.peso;
          hoja.getRow(fila).getCell(columna + 4).numFmt     = formatoNumeroDecimal;
          hoja.getRow(fila).getCell(columna + 5).value      = cc.pesoPorPieza;
          hoja.getRow(fila).getCell(columna + 5).numFmt     = formatoNumeroDecimal;
          hoja.getRow(fila).getCell(columna + 6).value      = parseFloat(((cc.peso / pesoTraseros) * 100).toFixed(2)) + ' %';
          hoja.getRow(fila).getCell(columna + 6).alignment  = alineacionDerecha;
          fila++;
        });

        hoja.getRow(fila).getCell(columna + 1).value      = "TRIMMING";
        hoja.getRow(fila).getCell(columna + 4).value      = cortesReporte.trimming[0].peso;
        hoja.getRow(fila).getCell(columna + 4).numFmt     = formatoNumeroDecimal;
        hoja.getRow(fila).getCell(columna + 6).value      = parseFloat(((cortesReporte.trimming[0].peso / totalEntradaPorTipo.peso) * 100).toFixed(2)) + ' %';
        hoja.getRow(fila).getCell(columna + 6).alignment  = alineacionDerecha;

        fila++;
        hoja.getRow(fila).getCell(columna + 1).value      = "MANTA";
        hoja.getRow(fila).getCell(columna + 4).value      = cortesReporte.manta[0].peso;
        hoja.getRow(fila).getCell(columna + 4).numFmt     = formatoNumeroDecimal;
        hoja.getRow(fila).getCell(columna + 6).value      = parseFloat(((cortesReporte.manta[0].peso / totalEntradaPorTipo.peso) * 100).toFixed(2)) + ' %';
        hoja.getRow(fila).getCell(columna + 6).alignment  = alineacionDerecha;

        fila++;
        hoja.getRow(fila).getCell(columna).value          = 'TOTAL CORTES SIN DESTINO CUOTA';
        hoja.getRow(fila).getCell(columna).font           = fuenteSubTitulo;
        hoja.getRow(fila).getCell(columna + 4).value      = totalPesoCortesNoCuota;
        hoja.getRow(fila).getCell(columna + 4).font       = fuenteSubTitulo;
        hoja.getRow(fila).getCell(columna + 4).numFmt     = formatoNumeroDecimal;
        hoja.getRow(fila).getCell(columna + 6).value      = parseFloat((rendimientoCortesNoCuota * 100).toFixed(2))  + ' %';
        hoja.getRow(fila).getCell(columna + 6).alignment  = alineacionDerecha;
        hoja.getRow(fila).getCell(columna + 6).font       = fuenteSubTitulo;
        hoja.getRow(fila).getCell(columna + 6).alignment  = alineacionDerecha;

        fila += 2;
        hoja.getRow(fila).getCell(columna).value          = 'TOTAL';
        hoja.getRow(fila).getCell(columna).fill           = fondoTituloEntrada;
        hoja.getRow(fila).getCell(columna).font           = colorFuenteEntrada;
        hoja.getRow(fila).getCell(columna + 1).fill       = fondoTituloEntrada;
        hoja.getRow(fila).getCell(columna + 2).fill       = fondoTituloEntrada;
        hoja.getRow(fila).getCell(columna + 3).value      = totalCajas;
        hoja.getRow(fila).getCell(columna + 3).numFmt     = formatoNumeroMillar;
        hoja.getRow(fila).getCell(columna + 3).fill       = fondoTituloEntrada;
        hoja.getRow(fila).getCell(columna + 3).font       = colorFuenteEntrada;
        hoja.getRow(fila).getCell(columna + 4).value      = totalPesoCortes;
        hoja.getRow(fila).getCell(columna + 4).numFmt     = formatoNumeroDecimal;
        hoja.getRow(fila).getCell(columna + 4).fill       = fondoTituloEntrada;
        hoja.getRow(fila).getCell(columna + 4).font       = colorFuenteEntrada;
        hoja.getRow(fila).getCell(columna + 5).fill       = fondoTituloEntrada;
        hoja.getRow(fila).getCell(columna + 6).value      = parseFloat((rendimientoCortesTotal * 100).toFixed(2))  + ' %';
        hoja.getRow(fila).getCell(columna + 6).fill       = fondoTituloEntrada;
        hoja.getRow(fila).getCell(columna + 6).font       = colorFuenteEntrada;
        hoja.getRow(fila).getCell(columna + 6).alignment  = alineacionDerecha;

        hoja.getColumn(columna + 1).width = 36;
        columna += 8;
      });
    });

    // COMPARATIVO
    const hojaComp: Worksheet = libro.addWorksheet('COMPARATIVO');
    this.setLogo(libro, hojaComp);
    this.setTitle(libro, hojaComp, "COMPARATIVO", 'right', 16);
    comparativoData          = this.ccs.getComparativoData(idsReporte, reportes);
    qamarksUnicos            = this.ccs.getQamarksUnicos(comparativoData, qamarks);
    comparativoDataFiltrada  = this.ccs.agruparDataComparativo(comparativoData, idsReporte);
    comparativoData          = this.ccs.getComparativoData(idsReporte, reportes);
    comparativoCuota         = comparativoDataFiltrada.filter(cdf => cdf.tipo == 'CUOTA');
    comparativoNoCuota       = comparativoDataFiltrada.filter(cdf => cdf.tipo == 'NO CUOTA');
    
    comparativoCuota
    .sort((a, b) => {
      if(a.conditon <= b.conditon) return -1;
      return 1;
    })
    .sort((a, b) => {
      if(a.qamark <= b.qamark) return -1;
      return 1
    });
    
    comparativoNoCuota
    .sort((a, b) => {
      if(a.conditon <= b.conditon) return -1;
      return 1;
    })
    .sort((a, b) => {
      if(a.qamark <= b.qamark) return -1;
      return 1
    });

    cuotaComparativoReporte   = this.ccs.formatearDatosComparativo(comparativoCuota, qamarksUnicos, idsReporte);
    noCuotaComparativoReporte = this.ccs.formatearDatosComparativo(comparativoNoCuota, qamarksUnicos, idsReporte);
    
    qamarksCuota   = Array.from(new Set(cuotaComparativoReporte.map(c => c.qamark)));
    qamarksNoCuota = Array.from(new Set(noCuotaComparativoReporte.map(c => c.qamark)));

    let fila = 6;
    let columna = 2;

    hojaComp.getRow(fila).getCell(columna).value = "CORTE CUOTA"
    hojaComp.getRow(fila).getCell(columna).font  = fuenteTituloNombreCuota;
    fila += 2;

    qamarksCuota.forEach(qmc => {
      hojaComp.getRow(fila).getCell(columna).value = qamarks.find(q => q.qamark == qmc)?.name;
      hojaComp.getRow(fila).getCell(columna).font  = fuenteTitulo;
      fila++;
    });

    fila++;
    hojaComp.getRow(fila).getCell(columna).value = "CORTE SIN DESTINO CUOTA";
    hojaComp.getRow(fila).getCell(columna).font  = fuenteTituloNombreCuota;
    fila += 2;

    qamarksNoCuota.forEach(qmc => {
      hojaComp.getRow(fila).getCell(columna).value = qamarks.find(q => q.qamark == qmc)?.name;
      hojaComp.getRow(fila).getCell(columna).font  = fuenteTitulo;
      fila++;
    });

    columna++;
    idsReporte.forEach(id => {
      fila = 6;
      hojaComp.getRow(fila).getCell(columna).value  = tiposCuota.find(tc => tc.id == id)?.nombre;
      hojaComp.getRow(fila).getCell(columna).font   = fuenteTituloNombreCuota;
      hojaComp.mergeCells(fila, columna, fila, columna + 1);
      hojaComp.getRow(fila).getCell(columna).alignment = alineacionCentro;
      fila++;
      hojaComp.getRow(fila).getCell(columna).value          = "Kg Prom.";
      hojaComp.getRow(fila).getCell(columna).font           = fuenteTituloCortes;
      hojaComp.getRow(fila).getCell(columna).alignment      = alineacionIzquierda;
      hojaComp.getRow(fila).getCell(columna + 1).value      = "Rend. Prom.";
      hojaComp.getRow(fila).getCell(columna + 1).font       = fuenteTituloCortes;
      hojaComp.getRow(fila).getCell(columna + 1).alignment  = alineacionDerecha;
      fila++;
      
      const comp = this.comparativoPorIdCuota(id, cuotaComparativoReporte);
      comp.forEach((c, i) => {
        let col = columna;
        c.datos.forEach((d, j) => {
          if(j % 2 == 0){
            hojaComp.getRow(fila).getCell(col).value = parseFloat(d.toFixed(2));
            hojaComp.getRow(fila).getCell(col).alignment = alineacionIzquierda;
          }
          else {
            hojaComp.getRow(fila).getCell(col).value = parseFloat((d * 100).toFixed(2)) + ' %';
            hojaComp.getRow(fila).getCell(col).alignment = alineacionDerecha;
          }
          col++;
        });
        fila++;
      });
      
      fila += 2;
      hojaComp.getRow(fila).getCell(columna).value          = "Kg Prom.";
      hojaComp.getRow(fila).getCell(columna).font           = fuenteTituloCortes;
      hojaComp.getRow(fila).getCell(columna).alignment      = alineacionIzquierda;
      hojaComp.getColumn(columna).width                     = 10;
      hojaComp.getRow(fila).getCell(columna + 1).value      = "Rend. Prom.";
      hojaComp.getRow(fila).getCell(columna + 1).font       = fuenteTituloCortes;
      hojaComp.getRow(fila).getCell(columna + 1).alignment  = alineacionDerecha;
      hojaComp.getColumn(columna + 1).width                 = 10;
      
      fila++
      const cmpNc = this.comparativoPorIdCuota(id, noCuotaComparativoReporte);
      cmpNc.forEach((c, i) => {
        let col = columna;
        c.datos.forEach((d, j) => {
          if(j % 2 == 0) {
            hojaComp.getRow(fila).getCell(col).value = parseFloat(d.toFixed(2));
            hojaComp.getRow(fila).getCell(col).alignment = alineacionIzquierda;
          }  else {
            hojaComp.getRow(fila).getCell(col).value = parseFloat((d * 100).toFixed(2)) + ' %';
            hojaComp.getRow(fila).getCell(col).alignment = alineacionDerecha;
          }
          col++;
        });
        fila++;
      });
      hojaComp.getColumn(columna + 2).width = 3;
      columna += 3;
    });
    hojaComp.getColumn(2).width = 30;

     //COMPARATIVO POR CODIGOS
     {
      const qamarksComprativo = this.comparativoCodigoService.getQamarksEnGrupos();
      const gruposComparativo = this.comparativoCodigoService.getGruposComparativo();
      
      if(qamarksComprativo.length > 0 && gruposComparativo.length > 0) 
        this.printComparativoPorCodigos(qamarksComprativo, gruposComparativo, libro);
    }
  }

  comparativoPorIdCuota(id: number, c: ComparativoReporte[]): ComparativoReporte[] {
    return c.filter(c => c.idCuota == id);
  }

  private printComparativosRendimientos(dataToPrint: PrintModel, libro: Workbook) {
    const dataRendimientos: CorteLote[][] = dataToPrint.data.rendimientos as CorteLote[][];
    const dataComprativo: CorteLote[] = dataToPrint.data.comparativo as CorteLote[];
    const fechas: Date[] = dataToPrint.data.fechas as Date[];
    const nombresRendimientos: string[] = dataToPrint.data.nombresRend as string[];
    const qamarksDto: QamarkDTO[] = dataToPrint.data.qamarks as QamarkDTO[];

    const fuenteTituloNombre:       Partial<Font>         = { bold: true, size: 12, color: { argb: 'FF1f618d'}};
    const fuenteTitulo:             Partial<Font>         = { bold: true, size: 12 };
    const fuenteSubTitulo:          Partial<Font>         = { bold: true, size: 7 };
    const fuenteTituloCortes:       Partial<Font>         = { bold: true, size: 9 };
    const alineacionCentro:         Partial<Alignment>    = { vertical: 'middle', horizontal: 'center' };
    const alineacionDerecha:        Partial<Alignment>    = { vertical: 'middle', horizontal: 'right' };
    const alineacionIzquierda:      Partial<Alignment>    = { vertical: 'middle', horizontal: 'left' };
    const formatoNumeroDecimal:     string                = '#,##0.00';
    const formatoNumeroMillar:      string                = '#,##0';

    // RENDIMIENTOS
    nombresRendimientos.forEach((nr, i) => {
      let fila = 6;
      let columna = 2;

      const titulo: string    = nr ?? `rendimiento_${i}`;
      const hoja:   Worksheet = libro.addWorksheet(titulo);
      this.setLogo(libro, hoja);
      this.setTitle(libro, hoja, titulo, 'right', 16);

      let rendimientos: DataRendimiento[] = [];
      fechas.forEach(f => {
        const entrada = dataRendimientos[i][0].entrada.filter(e => this.crs.sonFechasIguales(e.fecha, f));
        if(entrada.length > 0) {
          const cortes  = dataRendimientos[i][0].cortes.filter(c => this.crs.sonFechasIguales(c.fecha, f));
          let entr = this.crs.agruparEntrada(entrada);
          let cts = this.crs.agruparCortes(cortes);
          rendimientos.push({
            fecha: f,
            entrada: entr,
            cortes: cts,
            totalCuartos: this.crs.cantidadTotalCuartos(entr),
            pesoCuartos: this.crs.pesoTotalCuartos(entr),
            totalCortes: this.crs.cantidadTotalCortes(cts),
            pesoCortes: this.crs.pesoTotalCortes(cts)
          });
        }
      });
      
      for(let i = 0; i < rendimientos.length; i++) {
        fila = 6;
        const data: DataRendimiento = rendimientos[i];
        hoja.getRow(fila).getCell(columna).value = "Fecha: " + formatDate(data.fecha, "dd/MM/yyyy", "es-UY");
        fila += 2;
        hoja.getRow(fila).getCell(columna).value = "ENTRADA";
        hoja.getRow(fila).getCell(columna).font = fuenteTitulo;
        fila++;
        hoja.getRow(fila).getCell(columna).value = "Código";
        hoja.getRow(fila).getCell(columna).font = fuenteTituloCortes;
        hoja.getRow(fila).getCell(columna + 1).value = "Tipo cuarto";
        hoja.getRow(fila).getCell(columna + 1).font = fuenteTituloCortes;
        hoja.getRow(fila).getCell(columna + 4).value = "Cuartos";
        hoja.getRow(fila).getCell(columna + 4).font = fuenteTituloCortes;
        hoja.getRow(fila).getCell(columna + 4).alignment = alineacionDerecha;
        hoja.getRow(fila).getCell(columna + 5).font = fuenteTituloCortes;
        hoja.getRow(fila).getCell(columna + 5).value = "Peso";
        hoja.getRow(fila).getCell(columna + 5).alignment = alineacionDerecha;

        const entrada = data.entrada;
        entrada.forEach(ent => {
          fila++;
          hoja.getRow(fila).getCell(columna).value = ent.code;
          hoja.getRow(fila).getCell(columna + 1).value = ent.tipoCuarto;
          hoja.getRow(fila).getCell(columna + 4).numFmt = formatoNumeroMillar;
          hoja.getRow(fila).getCell(columna + 4).value = ent.cuartos;
          hoja.getRow(fila).getCell(columna + 4).alignment = alineacionDerecha;
          hoja.getRow(fila).getCell(columna + 5).numFmt = formatoNumeroDecimal;
          hoja.getRow(fila).getCell(columna + 5).value = ent.peso.toFixed(2);
          hoja.getRow(fila).getCell(columna + 5).alignment = alineacionDerecha;
        });

        fila++;
        hoja.getRow(fila).getCell(columna).value = "TOTAL";
        hoja.getRow(fila).getCell(columna).font = fuenteTitulo;
        hoja.getRow(fila).getCell(columna + 4).numFmt = formatoNumeroMillar;
        hoja.getRow(fila).getCell(columna + 4).value = data.totalCuartos;
        hoja.getRow(fila).getCell(columna + 4).alignment = alineacionDerecha;
        hoja.getRow(fila).getCell(columna + 4).font = fuenteTitulo;
        hoja.getRow(fila).getCell(columna + 5).numFmt = formatoNumeroDecimal;
        hoja.getRow(fila).getCell(columna + 5).value = data.pesoCuartos.toFixed(2);
        hoja.getRow(fila).getCell(columna + 5).alignment = alineacionDerecha;
        hoja.getRow(fila).getCell(columna + 5).font = fuenteTitulo;

        fila += 2;

        hoja.getRow(fila).getCell(columna).value = "CORTES";
        hoja.getRow(fila).getCell(columna).font = fuenteTitulo;
        fila++;
        hoja.getRow(fila).getCell(columna).value = "Código";
        hoja.getRow(fila).getCell(columna).font = fuenteTituloCortes;
        hoja.getRow(fila).getCell(columna + 1).value = "Producto";
        hoja.getRow(fila).getCell(columna + 1).font = fuenteTituloCortes;
        hoja.getRow(fila).getCell(columna + 2).value = "Unidades";
        hoja.getRow(fila).getCell(columna + 2).font = fuenteTituloCortes;
        hoja.getRow(fila).getCell(columna + 3).value = "Peso";
        hoja.getRow(fila).getCell(columna + 3).font = fuenteTituloCortes;
        hoja.getRow(fila).getCell(columna + 4).value = "Peso Prom.";
        hoja.getRow(fila).getCell(columna + 4).font = fuenteTituloCortes;
        hoja.getRow(fila).getCell(columna + 5).value = "% Rend.";
        hoja.getRow(fila).getCell(columna + 5).font = fuenteTituloCortes;
        hoja.getColumn(columna + 1).width = 35;
      
        const cortes = data.cortes;
        cortes.forEach(cts => {
          fila++;
          hoja.getRow(fila).getCell(columna).value = cts.codigo;
          hoja.getRow(fila).getCell(columna + 1).value = cts.producto;
          hoja.getRow(fila).getCell(columna + 2).numFmt = formatoNumeroMillar;
          hoja.getRow(fila).getCell(columna + 2).value = cts.piezas;
          hoja.getRow(fila).getCell(columna + 3).numFmt = formatoNumeroMillar;
          hoja.getRow(fila).getCell(columna + 3).value = cts.peso.toFixed(2);
          hoja.getRow(fila).getCell(columna + 3).alignment = alineacionDerecha;
          hoja.getRow(fila).getCell(columna + 4).numFmt = formatoNumeroMillar;
          hoja.getRow(fila).getCell(columna + 4).value = (cts.peso / cts.piezas).toFixed(2);
          hoja.getRow(fila).getCell(columna + 4).alignment = alineacionDerecha;
          hoja.getRow(fila).getCell(columna + 5).numFmt = formatoNumeroMillar;
          hoja.getRow(fila).getCell(columna + 5).value = (cts.peso / data.pesoCuartos * 100).toFixed(2) + ' %';
          hoja.getRow(fila).getCell(columna + 5).alignment = alineacionDerecha;
        });

        fila++;
        hoja.getRow(fila).getCell(columna).value = 'TOTAL';
        hoja.getRow(fila).getCell(columna).font = fuenteTitulo;
        hoja.getRow(fila).getCell(columna + 2).numFmt = formatoNumeroMillar;
        hoja.getRow(fila).getCell(columna + 2).value = data.totalCortes;
        hoja.getRow(fila).getCell(columna + 2).font = fuenteTitulo;
        hoja.getRow(fila).getCell(columna + 3).numFmt = formatoNumeroMillar;
        hoja.getRow(fila).getCell(columna + 3).value = data.pesoCortes.toFixed(2);
        hoja.getRow(fila).getCell(columna + 3).alignment = alineacionDerecha;
        hoja.getRow(fila).getCell(columna + 3).font = fuenteTitulo;
        hoja.getRow(fila).getCell(columna + 5).numFmt = formatoNumeroMillar;
        hoja.getRow(fila).getCell(columna + 5).value = (data.pesoCortes / data.pesoCuartos * 100).toFixed(2) + ' %';
        hoja.getRow(fila).getCell(columna + 5).alignment = alineacionDerecha;
        hoja.getRow(fila).getCell(columna + 5).font = fuenteTitulo;
        columna += 7;
      }
    });

    // COMPARATIVO DIARIO
    {
      const titulo: string = 'COMPARATIVO POR FECHA';
      const hojaComp: Worksheet = libro.addWorksheet(titulo);
      this.setLogo(libro, hojaComp);
      this.setTitle(libro, hojaComp, titulo, 'right', 16);

      let qamarks:          number[] = [];
      let qamarksFiltrados: string[] = []
      let tiposSeleccionados: boolean[] = dataToPrint.data.tiposSeleccionados;
      let data: TipoFechaDataAgrupado[] = dataToPrint.data.dataAgrupada;
      let nombresComprativo: string[] = dataToPrint.data.nombresComparativos;
            
      // QAMARKS
      const len = dataComprativo.length;
      qamarks = [];
      for(let i = 0; i < len; i++) {
        const cortes = dataComprativo[i].cortes;
        const arrQamark = Array.from(new Set(cortes.map(c => c.marca)));
        qamarks = qamarks.concat(qamarks, arrQamark);
      }

      qamarks = Array.from(new Set(qamarks.map(m => m))).sort((a, b) => {if(a <= b) return -1; return 1;});
      
      // QAMARKS FILTRADOS
      qamarksFiltrados = [];

      qamarks.forEach(qm => {
        let q = qamarksDto.find(qma => qma.qamark == qm)?.name;
        if(q && !q.includes('MANTA') && !q.includes('TRIMM')) qamarksFiltrados.push(q)
      });

      hojaComp.getColumn(3).width = 1;

      qamarksFiltrados = qamarksFiltrados.sort((a, b) => {if(a <= b) return -1; return 1;});
      
      let fila: number = 9;
      let columna: number = 2;
      qamarksFiltrados.forEach(qm => {
        hojaComp.getRow(fila).getCell(columna).value  = qm;
        hojaComp.getRow(fila).getCell(columna).font = fuenteTituloCortes;
        hojaComp.getRow(fila).getCell(columna).alignment = alineacionDerecha;
        fila++;
      });

      columna = 4;
      
      tiposSeleccionados.forEach((rend, i) => {
        if(rend) {
          fila = 6;
          let cantFechas = 0;
          let colInicial = columna;
          const tipo = nombresComprativo[i];
          const datos = data.filter(x => x.tipo == tipo);
          
          hojaComp.getRow(fila).getCell(columna).value = tipo;
          fila++;

          for(let i = 0; i < datos[0].data.length; i++) {
            fila = 7;
            const fecha = datos[0].data[i].fecha;
            hojaComp.getRow(fila).getCell(columna).value = fecha;
            hojaComp.mergeCells(fila, columna, fila, columna + 1);
            hojaComp.getRow(fila).getCell(columna).alignment = alineacionCentro;
            hojaComp.getRow(fila + 1).getCell(columna + 1).alignment = alineacionDerecha;
            hojaComp.getRow(fila + 1).getCell(columna).value = "Peso Prom.";
            hojaComp.getRow(fila + 1).getCell(columna + 1).value = "% Rend.";
          
            fila += 2;
            datos[0].data[i].data.forEach(d => {
              hojaComp.getRow(fila).getCell(columna).value = d.pesoPromedio > 0 ? d.pesoPromedio.toFixed(2) : '-';
              hojaComp.getRow(fila).getCell(columna + 1).value = d.rendimiento > 0 ? (d.rendimiento * 100).toFixed(2) + ' %': '-';
              hojaComp.getRow(fila).getCell(columna + 1).alignment = alineacionDerecha;
              fila++;
            });
            hojaComp.getColumn(columna + 2).width = 5;
            columna += 3;
            cantFechas++;
          }

          hojaComp.mergeCells(6, colInicial, 6, columna - 2);
          hojaComp.getRow(6).getCell(colInicial).alignment = alineacionCentro;
          hojaComp.getRow(6).getCell(colInicial).font = fuenteTituloNombre;

          hojaComp.getColumn(columna - 1).width = 10;
        }
      });
    }

    //COMPARATIVO
    {
      const titulo: string = 'COMPARATIVO ACUMULADO';
      const hojaComp: Worksheet = libro.addWorksheet(titulo);
      this.setLogo(libro, hojaComp);
      this.setTitle(libro, hojaComp, titulo, 'right', 16);

      let qamarks:          number[] = [];
      let qamarksFiltrados: string[] = []
      let comparativoData:  ComparativoRend[] = [];
      let rendimientos:     ComparativoRendData[] = [];
      let dataAgrupada:     ComparativoRend[][] = [];

      // QAMARKS
      const len = dataComprativo.length;
      qamarks = [];
      for(let i = 0; i < len; i++) {
        const cortes = dataComprativo[i].cortes;
        const arrQamark = Array.from(new Set(cortes.map(c => c.marca)));
        qamarks = qamarks.concat(qamarks, arrQamark);
      }

      qamarks = Array.from(new Set(qamarks.map(m => m))).sort((a, b) => {if(a <= b) return -1; return 1;});
      
      // QAMARKS FILTRADOS
      qamarksFiltrados = [];

      qamarks.forEach(qm => {
        let q = qamarksDto.find(qma => qma.qamark == qm)?.name;
        if(q && !q.includes('MANTA') && !q.includes('TRIMM')) qamarksFiltrados.push(q)
      });

      hojaComp.getColumn(3).width = 1;

      qamarksFiltrados = qamarksFiltrados.sort((a, b) => {if(a <= b) return -1; return 1;});
      
      let fila: number = 8;
      let columna: number = 2;
      qamarksFiltrados.forEach(qm => {
        hojaComp.getRow(fila).getCell(columna).value  = qm;
        hojaComp.getRow(fila).getCell(columna).font = fuenteTituloCortes;
        hojaComp.getRow(fila).getCell(columna).alignment = alineacionDerecha;
        fila++;
      });

      fila = 6;
      columna = 4;

      nombresRendimientos.forEach(nm => {
        hojaComp.mergeCells(fila, columna, fila, columna + 1);
        hojaComp.getRow(fila).getCell(columna).alignment = alineacionCentro;
        hojaComp.getRow(fila).getCell(columna).value = nm;
        hojaComp.getRow(fila).getCell(columna).font = fuenteTituloNombre;
        hojaComp.getRow(fila + 1).getCell(columna).value = "Peso Prom.";
        hojaComp.getRow(fila + 1).getCell(columna).font = fuenteSubTitulo;
        hojaComp.getRow(fila + 1).getCell(columna + 1).value = "% Rend";
        hojaComp.getRow(fila + 1).getCell(columna + 1).font = fuenteSubTitulo;
        hojaComp.getRow(fila + 1).getCell(columna + 1).alignment = alineacionDerecha;
        columna += 3;
      });

      let comp: ComparativoRend[] = [];
      rendimientos = [];
      for(let i = 0; i < len; i++) {
        const data: CorteLote        = dataComprativo[i];
        const ent:  LoteEntradaDTO[] = data.entrada;
        const cts:  DWSalidaDTO[]    = data.cortes;
  
        if(ent.length > 0) {          
          let entr = this.crs.agruparEntrada(ent);
          let ct   = this.crs.agruparCortes(cts);
          rendimientos.push({
            tipo:   data.nombre,
            cortes:  ct,
            pesoCuartos:  this.crs.pesoTotalCuartos(entr)
          });
        }
      }

      comp = this.crs.setDataComparativoRendimiento(rendimientos, qamarksDto);
      
      comparativoData = comp;
      nombresRendimientos.forEach(tipo => {
        let d = comparativoData.filter(c => c.tipo == tipo).sort((a, b) => {
          if(a.qamark <= b.qamark) return -1;
          return 1;
        });
        dataAgrupada.push(d);      
      });  

      fila = 8;
      columna = 4;

      for(let i = 0; i < dataAgrupada.length; i++) {
        const compData: ComparativoRend[] = dataAgrupada[i];
        compData.forEach(cd => {
          hojaComp.getRow(fila).getCell(columna).numFmt     = formatoNumeroDecimal;
          hojaComp.getRow(fila).getCell(columna).alignment  = alineacionIzquierda;
          hojaComp.getRow(fila).getCell(columna).value = cd.pesoPromedio > 0 ? cd.pesoPromedio.toFixed(2) : '-';
          hojaComp.getRow(fila).getCell(columna + 1).value = cd.rendimiento > 0 ? (cd.rendimiento * 100).toFixed(2) + ' %' : '-';
          hojaComp.getRow(fila).getCell(columna + 1).alignment  = alineacionDerecha;
          fila++
        });

        fila = 8;
        columna += 3;
      }
    }

    //COMPARATIVO POR CODIGOS
    {
      const qamarksComprativo = this.comparativoCodigoService.getQamarksEnGrupos();
      const gruposComparativo = this.comparativoCodigoService.getGruposComparativo();
      
      if(qamarksComprativo.length > 0 && gruposComparativo.length > 0) 
        this.printComparativoPorCodigos(qamarksComprativo, gruposComparativo, libro);
    }
  }

  private printComparativoPorCodigos(qamarks: string[], grupos: GrupoComparativo[], libro: Workbook) {
    const titulo: string = 'COMPARATIVO POR CÓDIGOS';
    const hojaComp: Worksheet = libro.addWorksheet(titulo);
    this.setLogo(libro, hojaComp);
    this.setTitle(libro, hojaComp, titulo, 'right', 16);

    const detallesTitulos = ['Código', 'Producto', 'Peso', 'Rend'];

    const fuenteTitulo:             Partial<Font>         = { bold: true, size: 12 };
    const fuenteDetalles:           Partial<Font>         = { italic: true, size: 11 };
    const fuenteTituloCortes:       Partial<Font>         = { bold: true, size: 12, color: { argb: 'FF284F79'}};
    const fuenteTituloGrupos:       Partial<Font>         = { bold: true, size: 12, color: { argb: 'FFAF610D'}};
    const alineacionCentro:         Partial<Alignment>    = { vertical: 'middle', horizontal: 'center' };
    const alineacionDerecha:        Partial<Alignment>    = { vertical: 'middle', horizontal: 'right' };
    const formatoNumeroDecimal:     string                = '#,##0.00';

    let filaTitulos = 6;
    let filaQamark = 7;
    let columnaQamark = 2;
    let filaTituloGrupo = 6;

    hojaComp.getRow(filaTitulos).getCell(2).value = 'Corte';
    hojaComp.getRow(filaTitulos).getCell(2).font = fuenteTitulo;
    hojaComp.getRow(filaTitulos).getCell(2).alignment = alineacionCentro;
    hojaComp.getRow(filaTitulos).getCell(3).value = 'Detalles';
    hojaComp.getRow(filaTitulos).getCell(3).font = fuenteTitulo;
    hojaComp.getRow(filaTitulos).getCell(3).alignment = alineacionCentro;
    
    hojaComp.getColumn(2).width = 20;
    hojaComp.getColumn(3).width = 12;

    qamarks.forEach(qm => {
      let columnaTituloGrupo = 4;
      let filaASumarQamark = 0;
      let filaInicialRangoQamark = filaQamark;

      hojaComp.getRow(filaQamark).getCell(columnaQamark).value = qm;
      hojaComp.getRow(filaQamark).getCell(columnaQamark).font = fuenteTituloCortes;

      let columnaDetalleTitulo = 3;
      
      grupos.forEach(grupo => {
        hojaComp.getRow(filaTituloGrupo).getCell(columnaTituloGrupo).value = grupo.nombre;
        hojaComp.getRow(filaTituloGrupo).getCell(columnaTituloGrupo).font = fuenteTituloGrupos;
        hojaComp.getRow(filaTituloGrupo).getCell(columnaTituloGrupo).alignment = alineacionCentro;
        const productosPorGrupo = grupo.productos.filter(producto => producto.qamark === qm); console.log(productosPorGrupo, grupo);
        
        filaASumarQamark = Math.max(filaASumarQamark, productosPorGrupo.length > 1 ? (productosPorGrupo.length - 1) * 5 : 0);
        let filaDetalleTitulo = filaQamark;
        let filaDetalleProducto = filaQamark;
        productosPorGrupo.forEach(prod => {
          hojaComp.getRow(filaDetalleTitulo).getCell(columnaDetalleTitulo).value = detallesTitulos[0];
          hojaComp.getRow(filaDetalleTitulo).getCell(columnaDetalleTitulo).font = fuenteDetalles;
          hojaComp.getRow(filaDetalleTitulo).getCell(columnaDetalleTitulo).alignment = alineacionDerecha;
          hojaComp.getRow(filaDetalleTitulo + 1).getCell(columnaDetalleTitulo).value = detallesTitulos[1];
          hojaComp.getRow(filaDetalleTitulo + 1).getCell(columnaDetalleTitulo).font = fuenteDetalles;
          hojaComp.getRow(filaDetalleTitulo + 1).getCell(columnaDetalleTitulo).alignment = alineacionDerecha;
          hojaComp.getRow(filaDetalleTitulo + 2).getCell(columnaDetalleTitulo).value = detallesTitulos[2];
          hojaComp.getRow(filaDetalleTitulo + 2).getCell(columnaDetalleTitulo).font = fuenteDetalles;
          hojaComp.getRow(filaDetalleTitulo + 2).getCell(columnaDetalleTitulo).alignment = alineacionDerecha;
          hojaComp.getRow(filaDetalleTitulo + 3).getCell(columnaDetalleTitulo).value = detallesTitulos[3];
          hojaComp.getRow(filaDetalleTitulo + 3).getCell(columnaDetalleTitulo).font = fuenteDetalles;
          hojaComp.getRow(filaDetalleTitulo + 3).getCell(columnaDetalleTitulo).alignment = alineacionDerecha;
          hojaComp.getRow(filaDetalleProducto).getCell(columnaTituloGrupo).value = prod.codigo;
          hojaComp.getRow(filaDetalleProducto).getCell(columnaTituloGrupo).alignment = alineacionDerecha;
          hojaComp.getRow(filaDetalleProducto + 1).getCell(columnaTituloGrupo).value = prod.nombre;
          hojaComp.getRow(filaDetalleProducto + 1).getCell(columnaTituloGrupo).alignment = alineacionDerecha;
          hojaComp.getRow(filaDetalleProducto + 2).getCell(columnaTituloGrupo).numFmt = formatoNumeroDecimal;
          hojaComp.getRow(filaDetalleProducto + 2).getCell(columnaTituloGrupo).value = prod.pesoPromedio.toFixed(2);
          hojaComp.getRow(filaDetalleProducto + 2).getCell(columnaTituloGrupo).alignment = alineacionDerecha;
          hojaComp.getRow(filaDetalleProducto + 3).getCell(columnaTituloGrupo).numFmt = formatoNumeroDecimal;
          hojaComp.getRow(filaDetalleProducto + 3).getCell(columnaTituloGrupo).value = (prod.rendimiento * 100).toFixed(2) + ' %';
          hojaComp.getRow(filaDetalleProducto + 3).getCell(columnaTituloGrupo).alignment = alineacionDerecha;
          filaDetalleProducto += 5;
          filaDetalleTitulo += 5;
        });
        hojaComp.getColumn(columnaTituloGrupo).width = 40;
        columnaTituloGrupo += 1;
      });
      filaQamark += 5 + filaASumarQamark;
      hojaComp.mergeCells(filaInicialRangoQamark, 2, filaQamark - 2, 2);
      hojaComp.getRow(filaInicialRangoQamark).getCell(2).alignment = alineacionCentro;
    });
  }

  private printLibroComparativoPorCodigos(dataToPrint: PrintModel, libro: Workbook) {
    const qamarksComprativo = this.comparativoCodigoService.getQamarksEnGrupos();
    const gruposComparativo = this.comparativoCodigoService.getGruposComparativo();

    if(qamarksComprativo.length > 0 && gruposComparativo.length > 0) 
      this.printComparativoPorCodigos(qamarksComprativo, gruposComparativo, libro);
  }

  private printPackingList(dataToPrint: PrintModel, libro: Workbook): void {
    const data: RegistroConPrecio[] = dataToPrint.data.registros as RegistroConPrecio[];
    const totalGeneral: TotalData = this.cargaService.getTotalData(data);
    const xfclData: XFCL[] = this.cargaService.setDataXFCL(data);
    const cantidadContenedores: number = xfclData.length;
    const idsPallets: number[] = this.cargaService.getIdsPallets(data);
    const registrosPallet: PLPallet[] = this.cargaService.setDataRegistrosPallet(idsPallets, data);
    const propiedades: string[] = ['SHIPMENT NO.', 'SHIP ON VESSEL', 'SHIPPING MARK', 'SHIPPING DATE', 'CONTAINERS'];
    const titulosX: string[] = ['Vessel', 'No. Container', 'Invoice', 'Pallets no.', 'Code F.L.P.S.', 'S/C', 'Product', 'Mark', 'Box ID', 'Net weight', 'Gross weight', 'Produciton Date', 'Expire Date', 'Price code'];

    const fuenteTitulo:             Partial<Font>         = { bold: true, size: 10 };
    const fuenteSubtotal:           Partial<Font>         = { bold: true, size: 14, color: {argb: 'FFFFFFFF'} };
    const alineacionCentro:         Partial<Alignment>    = { vertical: 'middle', horizontal: 'center' };
    const formatoNumeroDecimal:     string                = '#,##0.00';
    const formatoNumeroMillar:      string                = '#,##0';

    const fondoTituloX: Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCFFCC' }, bgColor: { argb: '00000000' }};
    const fondoTotalX:  Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0070C0' }, bgColor: { argb: '00000000' }};

    // XFCL
    {
      const titulo: string    = 'X FCL';
      const hoja:   Worksheet = libro.addWorksheet(titulo);
      this.setLogo(libro, hoja);
      this.setTitle(libro, hoja, titulo, 'right', 16);

      let fila = 6;
      let columna = 2;
      
      for(let i = 0; i < propiedades.length; i++) {
        hoja.getRow(fila++).getCell(columna).value = `${propiedades[i]}:`;
      }
      fila--;
      hoja.getRow(fila++).getCell(columna + 1).value = `${cantidadContenedores}`;

      xfclData.forEach((xfcl, i) => {
        this.configurarCeldaTitulo(hoja, fila, columna++, `${i + 1}`, alineacionCentro, fuenteTitulo, fondoTituloX); 
        
        titulosX.forEach(titulo => {
          this.configurarCeldaTitulo(hoja, fila, columna++, `${titulo}`, alineacionCentro, fuenteTitulo, fondoTituloX);
        });

        columna = 4;
        fila++;

        xfcl.data.forEach(reg => {
          const celdas = [
            { columna: columna, valor: reg.contenedor, formato: null },
            { columna: columna + 2, valor: reg.idPallet, formato: null },
            { columna: columna + 3, valor: reg.codigoProducto, formato: null },
            { columna: columna + 4, valor: reg.clasificacionKosher, formato: null },
            { columna: columna + 5, valor: reg.codigoKosher, formato: null },
            { columna: columna + 6, valor: reg.markKosher, formato: null },
            { columna: columna + 7, valor: reg.cantidadCajas, formato: formatoNumeroMillar },
            { columna: columna + 8, valor: reg.pesoNeto, formato: formatoNumeroDecimal },
            { columna: columna + 9, valor: reg.pesoBruto, formato: formatoNumeroDecimal },
            { columna: columna + 10, valor: this.formatearFecha(reg.fechaProduccion), formato: null },
            { columna: columna + 11, valor: this.formatearFecha(reg.fechaExpiracion), formato: null },
            { columna: columna + 12, valor: reg.precio / 1000 }
          ];
        
          celdas.forEach(({ columna, valor, formato }) => {
            const celda = hoja.getRow(fila).getCell(columna);
            celda.alignment = alineacionCentro;
            celda.value = valor;
            if (formato) celda.numFmt = formato;
          });
        
          fila++;
        });
        

        const configuracionesCeldas = [
          { columna: 6, valor: xfcl.cantidadPallets, formato: formatoNumeroMillar },
          { columna: 11, valor: xfcl.cantidadCajas, formato: formatoNumeroMillar },
          { columna: 12, valor: xfcl.pesoNeto, formato: formatoNumeroDecimal },
          { columna: 13, valor: xfcl.pesoBruto, formato: formatoNumeroDecimal }
        ];
        
        configuracionesCeldas.forEach(({ columna, valor, formato }) => {
          const celda = hoja.getRow(fila).getCell(columna);
          celda.alignment = alineacionCentro;
          celda.font = fuenteSubtotal;
          celda.fill = fondoTotalX;
          celda.numFmt = formato;
          celda.value = valor;
        });
        
        columna = 2;
        fila++;
      });

      fila++;

      const celdas = [
        { columna: 6, valor: totalGeneral.cantidadPallets, formato: formatoNumeroMillar },
        { columna: 11, valor: totalGeneral.cantidadCajas, formato: formatoNumeroMillar },
        { columna: 12, valor: totalGeneral.pesoNeto, formato: formatoNumeroDecimal },
        { columna: 13, valor: totalGeneral.pesoBruto, formato: formatoNumeroDecimal }
      ];
      
      celdas.forEach(({ columna, valor, formato }) => {
        const celda = hoja.getRow(fila).getCell(columna);
        celda.alignment = alineacionCentro;
        celda.font = fuenteSubtotal;
        celda.fill = fondoTotalX;
        celda.numFmt = formato;
        celda.value = valor;
      });
      
      const columnWidths = [null, null, 15, 10, 20, 10, 12, 12, 6, 8, 15, 15, 15, 15, 15, 15];
      columnWidths.forEach((width, index) => {
        if (width) hoja.getColumn(index).width = width;
      });

    }
    
    // XCUT
    {
      const fuenteSubTotalXCUT: Partial<Font> = { bold: true, size: 14, color: { argb: 'FF1f618d'}};
      const titulo: string    = 'X CUT';
      const hoja:   Worksheet = libro.addWorksheet(titulo);
      this.setLogo(libro, hoja);
      this.setTitle(libro, hoja, titulo, 'right', 17);

      let fila = 6;
      let columna = 2;
      
      for(let i = 0; i < propiedades.length; i++) {
        hoja.getRow(fila++).getCell(columna).value = `${propiedades[i]}:`;
      }
      fila--;
      hoja.getRow(fila++).getCell(columna + 1).value = `${cantidadContenedores}`;

      const dataXCUT: PrecioData[] = this.cargaService.setDataXCUT(registrosPallet);
      
      this.configurarCeldaTitulo(hoja, fila, columna++, '', alineacionCentro, fuenteTitulo, fondoTituloX); 
        
      titulosX.forEach(titulo => {
        this.configurarCeldaTitulo(hoja, fila, columna++, `${titulo}`, alineacionCentro, fuenteTitulo, fondoTituloX);
      });

      columna = 4;
      fila++

      dataXCUT.forEach(xcut => {
        xcut.data.forEach(reg => {
          const valores = [
            { col: columna, val: reg.contenedor },
            { col: columna + 2, val: reg.idPallet },
            { col: columna + 3, val: reg.codigoProducto },
            { col: columna + 4, val: reg.clasificacionKosher },
            { col: columna + 5, val: reg.codigoKosher },
            { col: columna + 6, val: reg.markKosher },
            { col: columna + 7, val: reg.cantidadCajas },
            { col: columna + 8, val: reg.pesoNeto },
            { col: columna + 9, val: reg.pesoBruto },
            { col: columna + 10, val: this.formatearFecha(reg.fechaProduccion) },
            { col: columna + 11, val: this.formatearFecha(reg.fechaExpiracion) },
            { col: columna + 12, val: reg.precio / 1000 }
          ];
      
          valores.forEach(({ col, val }) => this.configurarCelda(hoja, fila, col, val, alineacionCentro));
          hoja.getRow(fila).getCell(12).numFmt = formatoNumeroDecimal;
          hoja.getRow(fila).getCell(13).numFmt = formatoNumeroDecimal;
          fila++;
        });
      
        // Subtotales de xcut
        const subtotales = [
          { col: 6, val: xcut.cantidadPallet },
          { col: 11, val: xcut.cantidadCajas },
          { col: 12, val: xcut.pesoNeto },
          { col: 13, val: xcut.pesoBruto },
          { col: 16, val: xcut.precio / 1000 },
          { col: 17, val: (xcut.precio / 1000) * xcut.pesoNeto }
        ];
      
        subtotales.forEach(({ col, val }) => this.configurarCelda(hoja, fila, col, val, alineacionCentro, fuenteSubTotalXCUT));
        hoja.getRow(fila).getCell(11).numFmt = formatoNumeroMillar;
        hoja.getRow(fila).getCell(12).numFmt = formatoNumeroDecimal;
        hoja.getRow(fila).getCell(13).numFmt = formatoNumeroDecimal;
        hoja.getRow(fila).getCell(17).numFmt = formatoNumeroDecimal;

        columna = 4;
        fila += 2;
      });

      fila++;
      this.configurarCeldaTitulo(hoja, fila, 6, totalGeneral.cantidadPallets, alineacionCentro, fuenteSubtotal, fondoTotalX);
      this.configurarCeldaTitulo(hoja, fila, 11, totalGeneral.cantidadCajas, alineacionCentro, fuenteSubtotal, fondoTotalX);
      this.configurarCeldaTitulo(hoja, fila, 12, totalGeneral.pesoNeto, alineacionCentro, fuenteSubtotal, fondoTotalX);
      this.configurarCeldaTitulo(hoja, fila, 13, totalGeneral.pesoBruto, alineacionCentro, fuenteSubtotal, fondoTotalX);
      this.configurarCeldaTitulo(hoja, fila, 17, this.cargaService.sumarPreciosPorPeso(dataXCUT), alineacionCentro, fuenteSubtotal, fondoTotalX);

      hoja.getRow(fila).getCell(11).numFmt = formatoNumeroMillar;
      hoja.getRow(fila).getCell(12).numFmt = formatoNumeroDecimal;
      hoja.getRow(fila).getCell(13).numFmt = formatoNumeroDecimal;
      hoja.getRow(fila).getCell(17).numFmt = formatoNumeroDecimal;

      const columnWidths = [null, null, 15, 10, 20, 10, 12, 12, 6, 8, 15, 15, 15, 15, 15, 15, 10, 15];
      columnWidths.forEach((width, index) => {
        if (width) hoja.getColumn(index).width = width;
      });
    }

    // PL Per Pallet
    {
      const titulo: string    = 'PL Per Pallet';
      const hoja:   Worksheet = libro.addWorksheet(titulo);
      this.setLogo(libro, hoja);
      this.setTitle(libro, hoja, titulo, 'right', 17);
      
      const titulosPallet:  string [] = ['SIF', 'Vessel name', 'B/L No.', 'Container No.', 'Loading date', 'Pallet No.', 'Product', 'Mark', 'S/C', 'No. of cartons', 'Net weight', 'Production date', 'Expire date', 'F.L.P.S. Code', 'Price', 'Shipping mark'];
      const fuenteTitulo:   Partial<Font> = { bold: true, size: 10, color: {argb: 'FFFFFF00'} };
      const fondoTituloX:   Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC65911' }, bgColor: { argb: '00000000' }};

      let fila = 6;
      let columna = 2;

      for(let j = 0; j < titulosPallet.length; j++) {
        hoja.getRow(fila).getCell(columna).font = fuenteTitulo;
        hoja.getRow(fila).getCell(columna).fill = fondoTituloX;
        hoja.getRow(fila).getCell(columna++).value = `${titulosPallet[j]}`;
      }
      
      fila++;
      columna = 5;

      registrosPallet.forEach(reg => {
        this.configurarCelda(hoja, fila, columna, reg.contenedor, alineacionCentro);
        this.configurarCelda(hoja, fila, columna + 2, reg.idPallet, alineacionCentro);
        this.configurarCelda(hoja, fila, columna + 3, reg.codigoKosher, alineacionCentro);
        this.configurarCelda(hoja, fila, columna + 4, reg.markKosher, alineacionCentro);
        this.configurarCelda(hoja, fila, columna + 5, reg.clasificacionKosher, alineacionCentro);
        this.configurarCelda(hoja, fila, columna + 6, reg.cantidadCajas, alineacionCentro);
        this.configurarCelda(hoja, fila, columna + 7, reg.pesoNeto, alineacionCentro);
        hoja.getRow(fila).getCell(columna + 7).numFmt = formatoNumeroDecimal;
        this.configurarCelda(hoja, fila, columna + 8, this.formatearFecha(reg.fechaProduccion), alineacionCentro);
        this.configurarCelda(hoja, fila, columna + 9, this.formatearFecha(reg.fechaExpiracion), alineacionCentro);
        this.configurarCelda(hoja, fila, columna + 10, reg.codigoProducto, alineacionCentro);
        this.configurarCelda(hoja, fila, columna + 11, reg.precio / 1000, alineacionCentro);
    
        fila++; 
        columna = 5;
    });

    const columnWidths = [null, null, 10, 12, 10, 20, 12, 12, 6, 8, 15, 15, 15, 15, 15, 15, 10, 15];
      columnWidths.forEach((width, index) => {
        if (width) hoja.getColumn(index).width = width;
      });
    }

    // PL Per Carton
    {
      const titulo: string    = 'PL Per Carton';
      const hoja:   Worksheet = libro.addWorksheet(titulo);
      this.setLogo(libro, hoja);
      this.setTitle(libro, hoja, titulo, 'right', 11);

      const titulosCarton: string[] = ['Customer', 'Invoice no.', 'Container no.', 'Pallet no.', 'Product code', 'Carton ID', 'Weight of the carton', 'Production date', 'Expire date', 'Precio']
      const fuenteTitulo: Partial<Font> = { bold: true, size: 10, color: {argb: 'FF000000'} };
      const fondoTituloX: Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' }, bgColor: { argb: '00000000' }};

      let columna = 2;
      let fila = 6;

      for(let j = 0; j < titulosCarton.length; j++) {
        hoja.getRow(fila).getCell(columna).font = fuenteTitulo;
        hoja.getRow(fila).getCell(columna).fill = fondoTituloX;
        hoja.getRow(fila).getCell(columna++).value = `${titulosCarton[j]}`;
      }

      columna = 2;
      fila++;

      data.forEach(reg => {
        hoja.getRow(fila).getCell(columna++).value = '423203';
        columna++;
        hoja.getRow(fila).getCell(columna++).value = reg.container;
        hoja.getRow(fila).getCell(columna++).value = reg.pallet;
        hoja.getRow(fila).getCell(columna++).value = reg.productcode;
        hoja.getRow(fila).getCell(columna++).value = reg.boxid;
        hoja.getRow(fila).getCell(columna).value = reg.netweight;
        hoja.getRow(fila).getCell(columna++).numFmt = formatoNumeroDecimal;
        hoja.getRow(fila).getCell(columna++).value = this.formatearFecha(reg.productiondate);
        hoja.getRow(fila).getCell(columna++).value = this.formatearFecha(reg.expiredate);
        hoja.getRow(fila).getCell(columna++).value = reg.precio / 1000;
        fila++;
        columna = 2;
      });

      const columnWidths = [null, null, 10, 10, 20, 10, 12, 32, 10, 12, 12, 12];
      columnWidths.forEach((width, index) => {
        if (width) hoja.getColumn(index).width = width;
      });
    }
  }

  private configurarCelda(hoja: Worksheet, fila: number, columna: number, valor: any, alignment: Partial<Alignment>, font: Partial<Font> | null = null) {
    const celda = hoja.getRow(fila).getCell(columna);
    celda.alignment = alignment;
    if (font) celda.font = font;
    celda.value = valor;
  }

  private configurarCeldaTitulo(hoja: Worksheet, fila: number, columna: number, valor: any, alineacion: Partial<Alignment>, fuenteTitulo: Partial<Font>, fondoTitulo: Fill) {
    const celda = hoja.getRow(fila).getCell(columna);
    celda.value = valor;
    celda.alignment = alineacion;
    celda.font = fuenteTitulo;
    celda.fill = fondoTitulo;
  }

  private formatearFecha(fecha: string): string {
    let f = new Date(fecha);
    return formatDate(
      f.setHours(f.getHours() + 3),
      'dd/MM/yyyy',
      'es-UY'
    );
  }
}
