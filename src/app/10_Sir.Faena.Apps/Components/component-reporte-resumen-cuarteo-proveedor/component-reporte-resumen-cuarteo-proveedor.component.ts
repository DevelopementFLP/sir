import { Component } from '@angular/core';
import { DataFaenaService } from '../../Services/Data-Faena.service';
import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilities/UtilidadesService.service';
import { ReporteDeMediasProveedorDTO } from '../../Interfaces/ReporteDeMediasDTO';


import * as ExcelJS from 'exceljs';
import { MetodosExcelCuarteoService } from '../../helpers/Metodos-Excel-Cuarteo/metodos-excel-cuarteo.service';

@Component({
  selector: 'component-reporte-resumen-cuarteo-proveedor',
  templateUrl: './component-reporte-resumen-cuarteo-proveedor.component.html',
  styleUrls: ['./component-reporte-resumen-cuarteo-proveedor.component.css']
})
export class ComponenteReporteFaenaProveedorComponent {
  public sumaDePesos: number = 0;
  public sumaDeUnidades: number = 0;
  public resultadoCuartosPorProveedor: { proveedor: string, totalCuartos: number }[] = []; 
  public resultadoCuartosPorGrade: { grade: string, totalMedias: number, totalKg: number }[] = []; 

  public responseReporteDeMediasProveedor: ReporteDeMediasProveedorDTO[] = [];

  constructor(
    private _reporteDeMedia: DataFaenaService,
    private _utilidadesServicicio: UtilidadesService,
    private _metodosDeExcelCuarteoServicio: MetodosExcelCuarteoService
  ){
  }

  public GetReporteDeMediasProveedor(fechaDesde: string, fechaHasta: string, horaDesde: number, horaHasta: number) {
    this._reporteDeMedia.GetReporteDeMediasProveedor(fechaDesde, fechaHasta, horaDesde, horaHasta).subscribe({
      next: (data) => {
        if (data.esCorrecto ) {
          this.responseReporteDeMediasProveedor = data.resultado
          this.sumarPesosTotales();
          this.sumarUnidades();
          this.AgruparCuartosPorProveedor();
          this.AgruparMediasPorGrade();
        } else {
          this._utilidadesServicicio.mostrarAlerta("No se encontraron ","Datos")
        }
      },
      error: (e) => {
        console.error(e);
      }
    });    

    this.LimpiarCampos();
  } 

  public sumarPesosTotales(){
    this.responseReporteDeMediasProveedor.forEach(element => {
      this.sumaDePesos += Math.round(element.pesoMedias);
    });
  }

  public sumarUnidades(){
    this.responseReporteDeMediasProveedor.forEach(element => {
      this.sumaDeUnidades += element.medias;
    });
  }

   public AgruparCuartosPorProveedor(): { proveedor: string, totalCuartos: number }[] {
    const map = new Map<string, number>();
    this.resultadoCuartosPorProveedor

    this.responseReporteDeMediasProveedor.forEach(item => {
      if (item.proveedor) {
        const medias = item.medias ? Number(item.medias) : 0;
        const currentTotal = map.get(item.proveedor) || 0;
        map.set(item.proveedor, currentTotal + medias);
      }
    });

    this.resultadoCuartosPorProveedor = Array.from(map, ([proveedor, totalCuartos]) => ({ proveedor, totalCuartos }));
    return this.resultadoCuartosPorProveedor;
  }

  public AgruparMediasPorGrade(): { grade: string, totalMedias: number }[] {
    const map = new Map<string, { totalMedias: number, totalKg: number }>();
    this.resultadoCuartosPorProveedor

    this.responseReporteDeMediasProveedor.forEach(item => {
      if (item.grade) {
        const medias = item.medias ? Number(item.medias) : 0;
        const kg = item.pesoMedias ? Number(Math.round(item.pesoMedias)) : 0;
        const currentTotal = map.get(item.grade) || { totalMedias: 0, totalKg: 0 };
        map.set(item.grade, {
          totalMedias: currentTotal.totalMedias + medias,
          totalKg: currentTotal.totalKg + kg
      });
      }
    });

    this.resultadoCuartosPorGrade = Array.from(map, ([grade, { totalMedias, totalKg }]) => ({ grade, totalMedias, totalKg }));
    return this.resultadoCuartosPorGrade;
  }


  public LimpiarCampos(){
    this.responseReporteDeMediasProveedor = [];
    this.resultadoCuartosPorProveedor = [];
    this.resultadoCuartosPorGrade = [];
    this.sumaDePesos = 0;
    this.sumaDeUnidades = 0;
  }


  //Orden de columnas en excel
  columnasDeTablaProveedor: string[] = [
  'Proveedor',
  'Tropa',
  'Grade',
  'Medias',
  'Peso Medias',
  ];

  mapeoDeColumnasProveedor: { [key: string]: string } = {
  'Proveedor': 'proveedor',
  'Tropa': 'tropa',
  'Grade': 'grade' ,
  'Medias': 'medias',
  'Peso Medias': 'pesoMedias'
  };


  public async GenerarHojaDeCuartosPorGrade(workbook: ExcelJS.Workbook, worksheet: ExcelJS.Worksheet){

    const contenidoDeExcel = this.responseReporteDeMediasProveedor;

    const startRow = 5;
    const startColumn = 2; 

    this._metodosDeExcelCuarteoServicio.AgregarEncabezadosDeColumnas(this.columnasDeTablaProveedor, worksheet, 5, 2)

    //Mapeo de Columnas con Interfaz
    contenidoDeExcel.forEach((item, rowIndex) => {
      const row = this.columnasDeTablaProveedor.map(header => item[this.mapeoDeColumnasProveedor[header] as keyof ReporteDeMediasProveedorDTO] || '');
      row.forEach((value, colIndex) => {
        worksheet.getCell(startRow + 1 + rowIndex, startColumn + colIndex).value = value;
      });
    });

    worksheet.getRow(startRow).font = {
      size: 16,
      name: 'Cambria', 
      bold: true,
    }

    //RESUMEN 1
    worksheet.mergeCells("H5:J5")
    worksheet.getCell("H5").value = "Resumen General";

    worksheet.mergeCells("H6:I6")
    worksheet.getCell("H6").value = "Medias Totales";
    worksheet.getCell("H6").font = { 
      bold: true, 
      size: 12
    }

    worksheet.mergeCells("H7:I7")
    worksheet.getCell("H7").value = "Peso en KG Total";
    worksheet.getCell("H7").font = { 
      bold: true, 
      size: 12
    }

    worksheet.getCell("J6").value = this.sumaDeUnidades;
    worksheet.getCell("J6").font = { 
      bold: true, 
      color: { argb: 'f61b05'}
    }
    worksheet.getCell("J7").value = this.sumaDePesos;
    worksheet.getCell("J7").font = { 
      bold: true, 
      color: { argb: 'f61b05'}
    }

    //RESUMEN 2
    worksheet.mergeCells("H9:I9")
    worksheet.getCell("H9").value = "Medias Por Proveedor";
    worksheet.getCell("H9").font = { 
      bold: true, 
      size: 14
    }
    worksheet.getCell("H10").value = "Proveedor";
    worksheet.getCell("H10").font = { 
      bold: true, 
      size: 12
    }
    worksheet.getCell("J10").value = "Medias";
    worksheet.getCell("J10").font = { 
      bold: true, 
      size: 12
    }

    

    this.resultadoCuartosPorProveedor.forEach((item, index) => {
      const row = 11 + index;
      worksheet.getCell(row, 8).value = item.proveedor;  // Columna H
      worksheet.getCell(row, 8).font = { 
        bold: true, 
        color: { argb: 'f61b05'}
      }

      worksheet.getCell(row, 10).value = item.totalCuartos;  // Columna I
      worksheet.getCell(row, 10).font = { 
        bold: true, 
        color: { argb: 'f61b05'}
      }
    });

    //RESUMEN 3
    
    const filaDondeTerminaLaTablaAnterior = 11 + this.resultadoCuartosPorProveedor.length + 1;

    worksheet.mergeCells("H" + filaDondeTerminaLaTablaAnterior + ":" + "I" + filaDondeTerminaLaTablaAnterior )
    worksheet.getCell("H" + filaDondeTerminaLaTablaAnterior).value = "Medias Por Grade";
    worksheet.getCell("H" + filaDondeTerminaLaTablaAnterior).font = { 
      bold: true, 
      size: 14
    }    
    worksheet.getCell("H" + (filaDondeTerminaLaTablaAnterior + 1)).value = "Grade";
    worksheet.getCell("H" + (filaDondeTerminaLaTablaAnterior + 1)).font = { 
      bold: true, 
      size: 12
    }
    worksheet.getCell("I" + (filaDondeTerminaLaTablaAnterior + 1)).value = "Medias";
    worksheet.getCell("I" + (filaDondeTerminaLaTablaAnterior + 1)).font = { 
      bold: true, 
      size: 12
    }
    worksheet.getCell("J" + (filaDondeTerminaLaTablaAnterior + 1)).value = "Peso";
    worksheet.getCell("J" + (filaDondeTerminaLaTablaAnterior + 1)).font = { 
      bold: true, 
      size: 12
    }

    this.resultadoCuartosPorGrade.forEach((item, index) => {
      const row = (filaDondeTerminaLaTablaAnterior + 2) + index;
      worksheet.getCell(row, 8).value = item.grade;  // Columna H
      worksheet.getCell(row, 8).font = { 
        bold: true, 
        color: { argb: 'f61b05'}
      }

      worksheet.getCell(row, 9).value = item.totalMedias;  // Columna I
      worksheet.getCell(row, 9).font = { 
        bold: true, 
        color: { argb: 'f61b05'}
      }

      worksheet.getCell(row, 10).value = item.totalKg;  // Columna I
      worksheet.getCell(row, 10).font = { 
        bold: true, 
        color: { argb: 'f61b05'}
      }
    });

    worksheet.getColumn(2).width = 28;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(8).width = 28;
    worksheet.getColumn(9).width = 10;
    worksheet.getColumn(10).width = 10;
  }
}
