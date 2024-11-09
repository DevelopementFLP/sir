import { Component, ViewChild } from '@angular/core';
import { ReporteDeMediasProductosDTO, ReporteDeMediasProveedorDTO } from '../../Interfaces/ReporteDeMediasDTO';
import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilities/UtilidadesService.service';
import { DataFaenaService } from '../../Services/Data-Faena.service';
import { ComponenteReporteFaenaProveedorComponent } from '../component-reporte-resumen-cuarteo-proveedor/component-reporte-resumen-cuarteo-proveedor.component';
import { MetodosExcelGenericosService } from 'src/app/09_SIR.Dispositivos.Apps/Helpers/Metodos-Excel-Genericos/metodos-Excel-Genericos.service';


import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { MetodosExcelCuarteoService } from '../../helpers/Metodos-Excel-Cuarteo/metodos-excel-cuarteo.service';

@Component({
  selector: 'app-components-body-resumen-de-cuarteo',
  templateUrl: './body-reporte-resumen-de-cuarteo.component.html',
  styleUrls: ['./body-reporte-resumen-de-cuarteo.component.css']
})
export class BodyReporteMediasComponent {

  public fechaDesde: Date | null = null;
  public fechaHasta: Date | null = null;
  public fechaDesdeFormateada: string | null = null;
  public fechaHastaFormateada: string | null = null;
  public horaDesde: number | null = null;
  public horaHasta: number | null = null;

  public listaDeHorasDesde: string[] = [];
  public listaDeHorasHasta: string[] = [];

  public sumaDePesos: number = 0;
  public sumaDeUnidades: number = 0;
  public sumaPorGrade: number = 0;
  public resultadoCuartosPorGrade: { grade: string, totalCuartos: number, porcentaje: number }[] = []; 
  public responseReporteDeMediasProducto: ReporteDeMediasProductosDTO[] = [];

  public generarListaDesde(): void {
    this.listaDeHorasDesde = [];
    for (let i = 14; i < 22; i += 2) {
      this.listaDeHorasDesde.push(i.toString().padStart(2, '0'));
    }
  }
  public generarListaDeHasta(): void {
    this.listaDeHorasHasta = [];
    for (let i = 2; i < 10; i += 2) {
      this.listaDeHorasHasta.push(i.toString().padStart(2, '0'));
    }
  }



  @ViewChild(ComponenteReporteFaenaProveedorComponent) _conexionConComponenteProveedor! : ComponenteReporteFaenaProveedorComponent;

  constructor(
    private _reporteDeMedia: DataFaenaService,
    private _utilidadesServicicio: UtilidadesService,
    private _metodosDeExcelGenericosServicio: MetodosExcelGenericosService,
    private _metodosDeExcelCuarteoServicio: MetodosExcelCuarteoService
  ){
  }



  public GetReporteDeMediasProducto(fechaDesde: Date, fechaHasta: Date, horaDesde: number, horaHasta: number) {
    if(fechaDesde != null && fechaHasta != null){      

      this.fechaDesdeFormateada = this.formatoFecha(fechaDesde)
      this.fechaHastaFormateada = this.formatoFecha(fechaHasta)

      if(this.fechaDesdeFormateada < this.fechaHastaFormateada){
              
        this._reporteDeMedia.GetReporteDeMediasProducto(this.fechaDesdeFormateada, this.fechaHastaFormateada, horaDesde, horaHasta).subscribe({
          next: (data) => {
            if (data.esCorrecto ) {
              this.responseReporteDeMediasProducto = data.resultado

              this.SumarPesosTotales();
              this.SumarUnidades();
              this.AgruparCuartosPorEtiqueta();

              this._conexionConComponenteProveedor.GetReporteDeMediasProveedor(this.fechaDesdeFormateada!, this.fechaHastaFormateada!, horaDesde, horaHasta);
            } else {
              this._utilidadesServicicio.mostrarAlerta("No se encontraron ","Datos")
            }
          },
          error: (e) => {
            console.error(e);
          }
        }); 
      }else{
        this._utilidadesServicicio.mostrarAlerta("La fecha hasta debe ser posterior a la fecha desde","Rango de Fechas")
      }   
   }else{
     this._utilidadesServicicio.mostrarAlerta("Debe seleccionar ","Rango de Fechas")
   }

    this.LimpiarCampos()
  } 

  formatoFecha(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  public SumarPesosTotales(){
    this.responseReporteDeMediasProducto.forEach(element => {
      this.sumaDePesos += Math.round(element.pesoCuartos);
    });
  }

  public SumarUnidades(){
    this.responseReporteDeMediasProducto.forEach(element => {
      this.sumaDeUnidades += element.cuartos;
    });
  }

  public AgruparCuartosPorEtiqueta(): { grade: string, totalCuartos: number, porcentaje: number }[] {
    const map = new Map<string, number>();
    this.resultadoCuartosPorGrade = [];

    this.responseReporteDeMediasProducto.forEach(item => {
      if (item.grade) {
        const cuartos = item.cuartos ? Number(item.cuartos) : 0;
        const currentTotal = map.get(item.grade) || 0;
        map.set(item.grade, currentTotal + cuartos);
      }
    });

    // Convertir el mapa a un array e incluir el porcentaje
    this.resultadoCuartosPorGrade = Array.from(map, ([grade, totalCuartos]) => ({
      grade,
      totalCuartos,
      porcentaje: parseFloat(((totalCuartos * 100) / this.sumaDeUnidades).toFixed(1))
    }));

    return this.resultadoCuartosPorGrade;
  }

  public LimpiarCampos(){
    this.responseReporteDeMediasProducto = [];
    this.resultadoCuartosPorGrade = []
    this.sumaDePesos = 0;
    this.sumaDeUnidades = 0;
    this.fechaDesde = null;
    this.fechaHasta = null;
  }


  //Orden de columnas en excel
  columnasDeTablaProducto: string[] = [
    'Producto',
    'Grade',
    'Cuartos',
    'Peso De Cuartos'
  ];

  mapeoDeColumnasProducto: { [key: string]: string } = {
    'Producto': 'producto',
    'Grade': 'grade',
    'Cuartos': 'cuartos' ,
    'Peso De Cuartos': 'pesoCuartos'
  };


  public async GenerarReporteExel(){

    const workbookMediasPorProducto = new ExcelJS.Workbook();
    const worksheetProductos = workbookMediasPorProducto.addWorksheet('Reporte Cuartos Por Producto');
    const worksheetProveedor = workbookMediasPorProducto.addWorksheet('Reporte Medias Por Proveedor');
    const contenidoDeExcel = this.responseReporteDeMediasProducto;

    const startRow = 5;
    const startColumn = 2; 

    this._metodosDeExcelCuarteoServicio.AgregarEncabezadosDeColumnas(this.columnasDeTablaProducto, worksheetProductos, 5, 2)

    //Mapeo de Columnas con Interfaz
    contenidoDeExcel.forEach((item, rowIndex) => {
      const row = this.columnasDeTablaProducto.map(header => item[this.mapeoDeColumnasProducto[header] as keyof ReporteDeMediasProductosDTO] || '');
      row.forEach((value, colIndex) => {
        worksheetProductos.getCell(startRow + 1 + rowIndex, startColumn + colIndex).value = value;
      });
    });

    this._metodosDeExcelGenericosServicio.AdjustColumnWidths(worksheetProductos);
    await this._metodosDeExcelGenericosServicio.InsertHederSheet(
                                                                  workbookMediasPorProducto,
                                                                  worksheetProductos, 
                                                                  'Medias Por Producto / ' + this.fechaDesdeFormateada + " --> " + this.fechaHastaFormateada,
                                                                  'B2',
                                                                  'J4');
    await this._metodosDeExcelGenericosServicio.InsertHederSheet(
                                                                  workbookMediasPorProducto,
                                                                  worksheetProveedor, 
                                                                  'Cuartos Por Proveedor / ' + this.fechaDesdeFormateada + " --> " + this.fechaHastaFormateada,
                                                                  'B2', 
                                                                  'J4');
    
    worksheetProductos.getRow(startRow).font = {
      size: 16,
      name: 'Cambria', 
      bold: true,
    }

    worksheetProductos.mergeCells("H5:J5")
    worksheetProductos.getCell("H5").value = "Resumen General";

    worksheetProductos.mergeCells("H6:I6")
    worksheetProductos.getCell("H6").value = "Cuartos Totales";
    worksheetProductos.getCell("H6").font = { 
      bold: true, 
      size: 12
    }

    worksheetProductos.mergeCells("H7:I7")
    worksheetProductos.getCell("H7").value = "Peso en KG Total";
    worksheetProductos.getCell("H7").font = { 
      bold: true, 
      size: 12
    }

    worksheetProductos.getCell("J6").value = this.sumaDeUnidades;
    worksheetProductos.getCell("J6").font = { 
      bold: true, 
      color: { argb: 'f61b05'}
    }
    worksheetProductos.getCell("J7").value = this.sumaDePesos;
    worksheetProductos.getCell("J7").font = { 
      bold: true, 
      color: { argb: 'f61b05'}
    }

    worksheetProductos.mergeCells("H9:I9")
    worksheetProductos.getCell("H9").value = "Cuartos Por Grade";
    worksheetProductos.getCell("H9").font = { 
      bold: true, 
      size: 14
    }
    worksheetProductos.getCell("H10").value = "Grade";
    worksheetProductos.getCell("H10").font = { 
      bold: true, 
      size: 12
    }
    worksheetProductos.getCell("I10").value = "Cuartos";
    worksheetProductos.getCell("I10").font = { 
      bold: true, 
      size: 12
    }
    worksheetProductos.getCell("J10").value = "% Del Total";
    worksheetProductos.getCell("J10").font = { 
      bold: true, 
      size: 12
    }

    this.resultadoCuartosPorGrade.forEach((item, index) => {
      const row = 11 + index;
      worksheetProductos.getCell(row, 8).value = item.grade;  // Columna H
      worksheetProductos.getCell(row, 8).font = { 
        bold: true, 
        color: { argb: 'f61b05'}
      }

      worksheetProductos.getCell(row, 9).value = item.totalCuartos;  // Columna I
      worksheetProductos.getCell(row, 9).font = { 
        bold: true, 
        color: { argb: 'f61b05'}
      }

      worksheetProductos.getCell(row, 10).value = item.porcentaje + " %";  // Columna J
      worksheetProductos.getCell(row, 10).font = { 
        bold: true, 
        color: { argb: 'f61b05'}
      }
      worksheetProductos.getCell(row, 10).alignment = { 
        horizontal: 'right'
      }
    });

    this._conexionConComponenteProveedor.GenerarHojaDeCuartosPorGrade(workbookMediasPorProducto, worksheetProveedor)

    worksheetProductos.getColumn(2).width = 30;
    worksheetProductos.getColumn(3).width = 15;
    worksheetProductos.getColumn(4).width = 15;
    worksheetProductos.getColumn(5).width = 25;
    worksheetProductos.getColumn(8).width = 15;
    worksheetProductos.getColumn(9).width = 10;
    worksheetProductos.getColumn(10).width = 15;


    const fechaActual = new Date();
    const horaActual = fechaActual.getHours() + ':' + fechaActual.getMinutes() + ':' + fechaActual.getSeconds();

    // Guardar el archivo
    const buffer = await workbookMediasPorProducto.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Reporte_De_Cuarteo ' + horaActual + '.xlsx');  
  }

}
