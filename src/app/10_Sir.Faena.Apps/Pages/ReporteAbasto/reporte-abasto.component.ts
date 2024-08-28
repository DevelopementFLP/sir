import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AbastoService } from '../../Services/AbastoService.service';
import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilidades/UtilidadesService.service';
import { ListaDeLecturasDTO } from '../../Interfaces/ListaDeLecturasDTO';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-reporte-abasto',
  templateUrl: './reporte-abasto.component.html',
  styleUrls: ['./reporte-abasto.component.css']
})
export class ReporteAbastoComponent {

  public fechaDelDia: Date | null = null;
  public totalDePesos: number | null = null;
  public totalLecturas: number | null = null;
  public totalRegistrosSinEtiqueta: number | null = null;
  public totalRegistrosEtiquetados: number | null = null
  public pesoInput: number | null = null;
  public mostrarStockActual: boolean = false;


  columnasTablaListaDeAbasto: string[] = ['fechaDeRegistro', 'idAnimal', 'tropa', 'proveedor', 'peso', 'fechaDeFaena', 'clasificacion', 'secuencial']

  //Tipos de Datos
  dataInicioListaDeAbasto: ListaDeLecturasDTO[] = [];
  dataOriginalSinFiltros:  ListaDeLecturasDTO[] = [];

  //Tabla
  dataListaDeLecturasAbasto = new MatTableDataSource(this.dataInicioListaDeAbasto);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  ngAfterViewInit(): void {
    this.dataListaDeLecturasAbasto.paginator = this.paginacionTabla;
  }

  constructor(
    private _utilidadesServicicio: UtilidadesService,
    private _lecturaDeMediaService : AbastoService,
    private http: HttpClient
  ){}

  formatoFecha(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  GetListaDeLecturasAbasto(fechaDelDia: Date | null) {
      
      if(fechaDelDia){
      const fecha = this.formatoFecha(fechaDelDia);
      this._lecturaDeMediaService.GetVistaLecturasDeAbasto(fecha).subscribe({
        next: (data) => {
          if (data.esCorrecto && data.resultado.length > 0) {
            this.dataListaDeLecturasAbasto.data = data.resultado;
            this.dataOriginalSinFiltros = data.resultado;

            this.filtrarPorStock();           
            this.totalLecturas = data.resultado.length;

          } else {
            this._utilidadesServicicio.mostrarAlerta("No se encontraron ","Datos")
          }
        },
        error: (e) => {
          console.error(e);
        }
      });
      }else{
        this._utilidadesServicicio.mostrarAlerta("Seleccione una Fecha ","Error")
      }      
    }    

    filtrarPorStock() {
      if (this.mostrarStockActual) {
        
        // filtro 2 tablas con las entradas y salidas
        const entradas = this.dataOriginalSinFiltros.filter(item => item.operacion == "Entrada Abasto");
        const salidas = this.dataOriginalSinFiltros.filter(item => item.operacion == "Salida Abasto");

        // me quedo con los id de las salidas
        const idDeSalidas = new Set(salidas.map(item => item.idAnimal));
    
        // filtro las entradas que no tienen salidas por los ID
        const entradasSinSalida = entradas.filter(item => !idDeSalidas.has(item.idAnimal));
    
        this.dataListaDeLecturasAbasto.data = entradasSinSalida;
      } else {
        // Restablece los datos originales si el checkbox está desmarcado
        this.dataListaDeLecturasAbasto.data = [...this.dataOriginalSinFiltros];
      }
      this.sumarPesosPorLinea();
    }

    sumarPesosPorLinea(): void {
        let totalPesos = 0;
        let totalRegistrosEtiquetados = 0;
        let totalRegistrosSinEtiqueta = 0;

        this.dataListaDeLecturasAbasto.data.forEach((lectura) => {
            totalPesos += lectura.peso;

            if(lectura.proveedor == "Manual")
            {
              totalRegistrosSinEtiqueta += 1
            }
            else
            {
              totalRegistrosEtiquetados += 1
            }
        });

        this.totalDePesos = parseFloat(totalPesos.toFixed(2));
        this.totalRegistrosEtiquetados = totalRegistrosEtiquetados;
        this.totalRegistrosSinEtiqueta = totalRegistrosSinEtiqueta;
    }

//Orden de columnas en excel
customHeaders: string[] = [
  'Fecha de Registro',
  'Id Animal',
  'Tropa',
  'Proveedor',
  'Peso',
  'Fecha Faena',
  'Clasificacion',
  'Secuencial'
];


// Mapea los encabezados a los nombres de las columnas originales para moverlos como quiera
columnMapping: { [key: string]: string } = {
  'Fecha de Registro': 'fechaDeRegistro',
  'Id Animal': 'idAnimal',
  'Tropa': 'tropa',
  'Proveedor': 'proveedor',
  'Peso': 'peso',
  'Fecha Faena': 'fechaDeFaena',
  'Clasificacion': 'clasificacion',
  'Secuencial': 'secuencial'
};



async exportarAExcel(): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Abasto');

    const logoUrl = 'assets/images/logo_relleno_azul.png'; // Ruta a tu logo
    
    // Cargar la imagen como buffer
    const imageBuffer = await this.http.get(logoUrl, { responseType: 'arraybuffer' }).toPromise();
    // Agregar la imagen al libro de trabajo
    const imageId = workbook.addImage({
      buffer: imageBuffer,
      extension: 'png',
    });
    

    worksheet.mergeCells(('A1:A3'))
    // Insertar la imagen en la celda A1
    worksheet.addImage(imageId, {
      tl: { col: 0, row: 0}, // Coordenadas de la esquina superior izquierda
      ext: { width: 130, height: 55}, // Tamaño de la imagen
      editAs: 'undefined'
    });
  

    // Agregar encabezado      
    worksheet.mergeCells('B1:I2'); // Combina las celdas
    const textoDeceldaConbinadaNQF = worksheet.getCell('B1');
    textoDeceldaConbinadaNQF.value = 'REPORTE ABASTO';
    textoDeceldaConbinadaNQF.alignment = { horizontal: 'center', vertical: 'middle' };
    textoDeceldaConbinadaNQF.font = { bold: true, italic: true}
    textoDeceldaConbinadaNQF.border = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    }


     const startRow = 3; // Fila donde comienzan los datos
     const startColumn = 2; // Columna B es la columna 2
 
     // Agregar encabezados de columna
     this.customHeaders.forEach((header, index) => {
       worksheet.getCell(startRow, startColumn + index).value = header;
     });
 
     // Agregar datos a partir de la fila 4
     this.dataListaDeLecturasAbasto.data.forEach((item, rowIndex) => {
       const row = this.customHeaders.map(header => item[this.columnMapping[header] as keyof ListaDeLecturasDTO] || '');
       row.forEach((value, colIndex) => {
         worksheet.getCell(startRow + 1 + rowIndex, startColumn + colIndex).value = value;
       });
     });

    //Ancho de las columnas
    const columnWidths: { [key: string]: number } = {
      'Fecha de Registro': 20,
      'Id Animal' : 20,
      'Tropa' : 20,
      'Proveedor' : 30,
      'Peso' : 20,
      'Fecha Faena' : 30,
      'Clasificacion' : 20,
      'Secuencial' : 20
    };

    worksheet.columns.forEach((column, index) => {
      const header = this.customHeaders[index];
      column.width = columnWidths[header] || 30; // Asignar ancho personalizado o 25 si no está definido
    });

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber > 3) { // Empieza desde la fila 4
        row.eachCell({ includeEmpty: true }, (cell) => {
          if (cell.value === 'Manual') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'aadade' } // Color de fonde de la celda
            };
          }
        });
      }
    });
  
  
    //Añadir los datos
    this.dataListaDeLecturasAbasto.data.forEach(lectura => {
      worksheet.addRow({
        fechaDeRegistro: lectura.fechaDeRegistro,
        idAnimal: lectura.idAnimal,
        tropa: lectura.tropa,
        proveedor: lectura.proveedor,
        peso: lectura.peso,
        fechaDeFaena: lectura.fechaDeFaena,
        clasificacion: lectura.clasificacion,
        secuencial: lectura.secuencial
      });
    });

    worksheet.autoFilter = {
      from: 'B3',
      to: 'I3',
     }
    
    // Calcular la suma de los valores en la columna Peso por proveedor
    const sumaPorProveedor: { [key: string]: number } = {};
      this.dataListaDeLecturasAbasto.data.forEach(lectura => {
        if (lectura.proveedor && !isNaN(lectura.peso)) {
        if (!sumaPorProveedor[lectura.proveedor]) {
          sumaPorProveedor[lectura.proveedor] = 0;
        }
        sumaPorProveedor[lectura.proveedor] += lectura.peso;
      }
    });


    // Definir la tabla
    worksheet.addTable({
      name: 'SumaPorProveedorTable',
      ref: 'J4', // Asegúrate de que este rango no sobrescriba datos existentes
      headerRow: true,
      totalsRow: true, // Puedes cambiar a true si deseas una fila de totales
      style: {
        theme: 'TableStyleDark3',
        showRowStripes: true,
      },
      columns: [
        { name: 'Proveedor', filterButton: true },
        { name: 'Suma de Pesos', totalsRowFunction: 'sum', filterButton: false },
      ],
      rows: Object.keys(sumaPorProveedor).map(proveedor => [proveedor, sumaPorProveedor[proveedor]]),
    });


    worksheet.getColumn('J').width = 35;
    worksheet.getColumn('K').width = 20;


    worksheet.getCell('J3').value = 'Suma de Pesos por Proveedor';
    worksheet.getCell('J3').font = { bold: true };
    // worksheet.getCell('I3').alignment = { horizontal: 'left' };


    const fechaActual = new Date();
    const horaActual = fechaActual.getHours() + ':' + fechaActual.getMinutes() + ':' + fechaActual.getSeconds()

    // Guardar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Reporte_Abasto ' + horaActual + '.xlsx');
    }
}
  
