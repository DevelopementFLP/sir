import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as xls from 'xlsx';
import { Horas } from '../../interfaces/Horas.interface';
import { Marcas } from '../../interfaces/Marcas.interface';
import { PadronFuncionario } from '../../interfaces/PadronFuncionario.interface';
import { ControlHorasService } from '../../services/control-horas.service';
import { formatDate } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { SingleFileUploaderComponent } from '../../components/single-file-uploader/single-file-uploader.component';
import { MarcaPorFuncionario } from '../../interfaces/MarcaPorFuncionario.interface';
import { HorasPorFuncionario } from '../../interfaces/HorasPorFuncionario.interface';
import { HorasTrabajadas } from '../../interfaces/HorasTrabajadas.interface';
import { HorasIncidencias } from '../../interfaces/HorasIncidencias.interface';
import { HorasComparar } from '../../interfaces/HorasComparar.interface';
import { FileUpload } from 'primeng/fileupload';
import { InconsistenciaDataPrint } from '../../interfaces/InconsistenciaDataPrint.interface';

@Component({
  selector: 'app-control-horas',
  templateUrl: './control-horas.component.html',
  styleUrls: ['./control-horas.component.css'],
  providers: [DialogService, MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class ControlHorasComponent implements OnInit, OnDestroy {

  idReporte: number = 4;
  nombreArchivo: string = "Inconsistencias " + formatDate(new Date(), "dd-MM-yyyy", "es-UY");
  ref: DynamicDialogRef | undefined;
  @ViewChild(FileUpload) fileUpload!: FileUpload;

  isSettingsVisible: boolean = true;
  isResultsVisible: boolean = false;
  isProcessVisible: boolean = false;
  isSeeFilesVisible: boolean = false;

  maxFileSize: number = 10000000;
  maxFiles: number = 2;
  isFileSelected: boolean = false;
  filesSelected: number = 0;
  acceptedFiles: string = ".xls, .xlsx";

  filesToProcess: File[] = [];
  currentFileIndex = 0;
  files!: FileList;

  lastUpdate: string = '(no establecida)';
  excelData:  any;
  horasData:  any;
  marcasData: any;

  /* datos cargados para procesar */
  horasArray: Horas[] = [];
  marcasArray: Marcas[] = [];
  padron: PadronFuncionario[] | undefined = [];
  marcasPorFuncionario: MarcaPorFuncionario[] = [];
  horasPorFuncionario: HorasPorFuncionario[] = [];
  resumenHorasFuncionarioEnSistema: HorasPorFuncionario[] = [];
  horasIncidencias: HorasIncidencias = {
    horas: [],
    incidencias: []
  }
  horasAComparar: HorasComparar[] = [];

  dataToPrint!: InconsistenciaDataPrint;

  constructor(
    private controlHorasService: ControlHorasService,
    public dialogService: DialogService,
    public messageService: MessageService ) {}

  async ngOnInit(): Promise<void> {
    this.reset();
    try{
      await this.getPadronData();
    } catch (error) {
      console.log('Error al obtener los datos:', error);
    }

    /* TESTING */
    // this.testInicio();
  }

  reset(): void {
    this.isSettingsVisible = true;
    this.isResultsVisible = false;
    this.isProcessVisible = false;
    this.isSeeFilesVisible = false;
    if(this.fileUpload){
      this.fileUpload.clear();
    }
  }

  private async getPadronData(): Promise<void> {
    try{
      const data = await this.controlHorasService.getPadronFuncionarios().toPromise();
      this.padron = data;
      if(this.padron != undefined && this.padron.length > 0)
        this.lastUpdate = formatDate(this.padron[0].ultimaModificacion, "dd-MM-yyyy", "es-UY");
    } catch (error) {
      console.log('Error al obtener los datos del servicio:', error);
    }   
  }

  ngOnDestroy(): void {
    if(this.ref) this.ref.close();
  }

  onSelectFile(event: any): void {
    if (event && event.files) {
      const fileList: FileList = event.files;

      for (let i = 0; i < fileList.length; i++) {
        const file: File = fileList[i];
        if(!this.fileSelected(file))
          this.filesToProcess.push(file);
        else console.log('Archivo ya cargado.')
      }
    }
  }

  onClear(): void {
   this.filesToProcess = [];
  }

  onRemove(event: any): void {
    if(event && event.file) {
      const fileToRemove: File = event.file;
      this.filesToProcess = this.filesToProcess.filter(file => file !== fileToRemove);
    }
  }

  fileSelected(file: File): boolean {
    return this.filesToProcess.some(f => f.name === file.name);
  }

  aceptar(): void {
    this.isSettingsVisible = false;
    this.isProcessVisible = true;
    this.isSeeFilesVisible = true;
  }

  processFiles(): void {
    const promises: Promise<void>[] = [];

    this.filesToProcess.forEach(file => {
        promises.push(this.processFile(file));
    });

    Promise.all(promises).then(() => {
      this.isResultsVisible = true;
      this.isSettingsVisible = false;
      this.isProcessVisible = false;
      this.isSeeFilesVisible = false;

     
      /* horas */
      try {
        this.horasArray = this.horasData.map((item: { [x: string]: any; }) => ({
          funcionario: item['FS.'],
          codigoHoras: item['CODIGO HRS.'],
          horasGeneradas: item['HRS.GENERADAS'],
          rowNumber: item['__rowNum__'] 
        }));

      } catch (error) {
        console.log(error);
      }
      
      /* marcas */
      try {
        this.marcasArray = this.marcasData.map((item: {[key: string]: any}) => {
          const marcasKeys = Object.keys(item).filter(key => key.startsWith('MarFun'));
          const marcas = marcasKeys.map(key => item[key]);
        
          const result = {
            funcionario: item['FunCod'],
            nombre: item['FunNom'],
            apellido: item['FunApe'],
            fecha: item['MarFec'],
            rowNumber: item['__rowNum__'],
            marcas: marcas 
          };
          return result;
        });
    
        this.calcularInconsistencias();
      } catch (error) {
        this.showOptions();
        console.log(error);
      }
    }).catch(() => {
      this.showOptions();
      console.log('Alguno de los archivos no fue proporcionado. Verificar.')
    });
  }

  private showOptions(): void {
    this.isResultsVisible = false;
    this.isSettingsVisible = true;
    this.isProcessVisible = false;
    this.isSeeFilesVisible = false;
  }

  private calcularInconsistencias(): void {
    this.marcasPorFuncionario = this.controlHorasService.generarMarcasPorFuncionario(this.marcasArray);
    this.horasIncidencias = this.controlHorasService.contarHorasPorFuncionarios(this.marcasPorFuncionario, this.padron!);
    const funcionariosUnicos: number[] = Array.from(new Set(this.horasArray.map(func => func.funcionario)));

    funcionariosUnicos.forEach(func => {
      const horasSumadas: HorasTrabajadas[] = [];
      [2, 4, 6].forEach(codigo => {
        const horasFiltradas = this.horasArray.filter(h => h.funcionario === func && h.codigoHoras === codigo);
        const sumaHoras = horasFiltradas.reduce((total, item) => total + item.horasGeneradas, 0);
        horasSumadas.push({codigo: codigo, horas: sumaHoras});
      });

      this.resumenHorasFuncionarioEnSistema.push({
        nroFuncionario: func.toString(),
        regimen: this.padron?.find(p => p.nroFuncionario === func.toString())?.horasTrabajadas!,
        horas: horasSumadas
      })
    });

    this.horasIncidencias.incidencias.forEach(h => {
      const padron: PadronFuncionario | undefined = this.padron?.find(p => p.nroFuncionario === h.nroFuncionario);
        if(padron != null && padron != undefined){
          h.nombres = padron.nombres;
          h.apellidos = padron.apellidos;
          h.sector = padron.sector;
        }
    });

    this.horasAComparar = this.mergeHoras(this.resumenHorasFuncionarioEnSistema, this.horasIncidencias.horas, funcionariosUnicos);
    this.horasAComparar = this.horasAComparar.filter(h => this.esInconsistencia(h));

    this.dataToPrint = {
      incidencias: this.horasIncidencias.incidencias,
      inconsistencias: this.horasAComparar
    }
    
  }

  private testInicio() {
    this.isSettingsVisible = false;
    this.isResultsVisible = true;
    this.isProcessVisible = false;
    this.isSeeFilesVisible = false;
    this.marcasArray =  [
      {
        funcionario: 1387,
        nombre: 'MARCELO GABRIEL',
        apellido: 'PORTO GONZALEZ',
        fecha: new Date(),
        rowNumber: 1,
        marcas: [ 0.16805555555555554, 0.6222222222222222 ]
      },
      {
        funcionario: 1628,
        nombre: 'MARIO DANIEL',
        apellido: 'ALALLON COLLAZO',
        fecha: new Date(),
        rowNumber: 2,
        marcas: [ 0.18125, 0.4381944444444445, 0.4590277777777778, 0.611111111111111 ]
      },
      {
        funcionario: 1649,
        nombre: 'ANGEL MARIO',
        apellido: 'CABRERA REYNALDO',
        fecha: new Date(),
        rowNumber: 3,
        marcas: [
          0.24166666666666667, 0.2423611111111111, 0.46875, 0.48541666666666666, 0.6465277777777778
        ]
      },
      {
        funcionario: 1750,
        nombre: 'CLAVER CIRO',
        apellido: 'TORRES BELEDO',
        fecha: new Date(),
        rowNumber: 4,
        marcas: [
          0.20138888888888887, 0.44097222222222227, 0.4618055555555556, 0.6138888888888888
        ]
      },
      {
        funcionario: 1772,
        nombre: 'ELADIO YAMANDU',
        apellido: 'BRAVO CABRERA',
        fecha: new Date(),
        rowNumber: 5,
        marcas: [
          0.20138888888888887, 0.44027777777777777, 0.4618055555555556, 0.611111111111111
        ]
      },
      {
        funcionario: 2015,
        nombre: 'DANIEL JORGE',
        apellido: 'PESCA MOREIRA',
        fecha: new Date(),
        rowNumber: 6,
        marcas: [ 0.04722222222222222 ]
      },
      {
        funcionario: 2145,
        nombre: 'DEIVIS NELSON',
        apellido: 'PAITA VISCA',
        fecha: new Date(),
        rowNumber: 7,
        marcas: [
          0.20833333333333334, 0.3909722222222222, 0.42569444444444443, 0.6284722222222222
        ]
      },
      {
        funcionario: 2165,
        nombre: 'CARLOS ALBERTO',
        apellido: 'FRANDINI COSTA',
        fecha: new Date(),
        rowNumber: 8,
        marcas: [
          0.20069444444444443, 0.44097222222222227, 0.4618055555555556, 0.6145833333333334
        ]
      },
      {
        funcionario: 2269,
        nombre: 'CARLOS GERVASIO',
        apellido: 'CABRERA MACCHI',
        fecha: new Date(),
        rowNumber: 9,
        marcas: [
          0.4930555555555556, 0.6687500000000001, 0.7027777777777778, 0.904861111111111
        ]
      },
      {
        funcionario: 2411,
        nombre: 'NESTOR DARIO',
        apellido: 'DELGADO GUILLOTTI',
        fecha: new Date(),
        rowNumber: 10,
        marcas: [ 0.25069444444444444, 0.9111111111111111 ]
      },
      {
        funcionario: 2550,
        nombre: 'DARIO HEBERT',
        apellido: 'CISCO FUENTES',
        fecha: new Date(),
        rowNumber: 11,
        marcas: [
          0.24861111111111112, 0.5347222222222222, 0.5694444444444444, 0.5833333333333334
        ]
      },
      {
        funcionario: 2667,
        nombre: 'SERGIO LEONARDO',
        apellido: 'DOMINGUEZ SILVERA',
        fecha: new Date(),
        rowNumber: 12,
        marcas: [
          0.24305555555555555, 0.4756944444444444, 0.49374999999999997, 0.6361111111111112
        ]
      },
      {
        funcionario: 2823,
        nombre: 'ENRIQUE ALVARO',
        apellido: 'CACERES SOTTO',
        fecha: new Date(),
        rowNumber: 13,
        marcas: [
          0.28958333333333336, 0.4777777777777778, 0.49722222222222223, 0.6680555555555556
        ]
      },
      {
        funcionario: 2908,
        nombre: 'NESTOR LEONEL',
        apellido: 'TOMEO LENCE',
        fecha: new Date(),
        rowNumber: 14,
        marcas: [
          0.20069444444444443, 0.44027777777777777, 0.4611111111111111, 0.6201388888888889
        ]
      },
      {
        funcionario: 2910,
        nombre: 'HUMBERTO MARIA',
        apellido: 'LACUEVA BERRUTTI',
        fecha: new Date(),
        rowNumber: 15,
        marcas: [
          0.20694444444444446, 0.46458333333333335, 0.4993055555555555, 0.6222222222222222
        ]
      },
      {
        funcionario: 3077,
        nombre: 'RAFAEL MARIA',
        apellido: 'FRISCH FERRANDO',
        fecha: new Date(),
        rowNumber: 16,
        marcas: [
          0.2027777777777778, 0.46527777777777773, 0.49444444444444446, 0.5631944444444444
        ]
      },
      {
        funcionario: 3090,
        nombre: 'NESTOR DARIO',
        apellido: 'LENZI TORRES',
        fecha: new Date(),
        rowNumber: 17,
        marcas: [ 0.24861111111111112, 0.4694444444444445, 0.6430555555555556 ]
      },
      {
        funcionario: 3100,
        nombre: 'JOSE LUIS',
        apellido: 'OLIVERA PESCA',
        fecha: new Date(),
        rowNumber: 18,
        marcas: [
          0.16111111111111112, 0.46388888888888885, 0.49583333333333335, 0.5673611111111111
        ]
      },
      {
        funcionario: 3141,
        nombre: 'PEDRO EDGARDO',
        apellido: 'GONZALEZ HERNANDEZ',
        fecha: new Date(),
        rowNumber: 19,
        marcas: [
          0.21180555555555555, 0.4611111111111111, 0.49722222222222223, 0.545138888888889
        ]
      },
      {
        funcionario: 3154,
        nombre: 'LUIS DENIS',
        apellido: 'TOURON PASINI',
        fecha: new Date(),
        rowNumber: 20,
        marcas: [ 0.04652777777777778 ]
      },
      {
        funcionario: 3163,
        nombre: 'RUBEN ALVARO',
        apellido: 'TESSA CUITIÑO',
        fecha: new Date(),
        rowNumber: 21,
        marcas: [
          0.20069444444444443, 0.4465277777777778, 0.4694444444444445, 0.6215277777777778
        ]
      },
      {
        funcionario: 3203,
        nombre: 'FERNANDO RAFAEL',
        apellido: 'MOZZONE ACOSTA',
        fecha: new Date(),
        rowNumber: 22,
        marcas: [ 0.41805555555555557, 0.5930555555555556, 0.63125, 0.8194444444444445 ]
      },
      {
        funcionario: 3221,
        nombre: 'ROBERT OMAR',
        apellido: 'FRANCO REY',
        fecha: new Date(),
        rowNumber: 23,
        marcas: [ 0.21458333333333335, 0.5027777777777778, 0.5256944444444445, 0.65625 ]
      },
      {
        funcionario: 3227,
        nombre: 'DANIEL LUIS',
        apellido: 'CABRERA SANGUINETTI',
        fecha: new Date(),
        rowNumber: 24,
        marcas: [ 0.5409722222222222, 0.7159722222222222, 0.75, 0.875 ]
      },
      {
        funcionario: 3418,
        nombre: 'ANDRES SEBASTIAN',
        apellido: 'BARRIOS BALZA',
        fecha: new Date(),
        rowNumber: 25,
        marcas: [
          0.45694444444444443, 0.5583333333333333, 0.5819444444444445, 0.9597222222222223
        ]
      },
      {
        funcionario: 3423,
        nombre: 'LUIS EDUARDO',
        apellido: 'ALVAREZ LOPEZ',
        fecha: new Date(),
        rowNumber: 26,
        marcas: [
          0.16805555555555554, 0.4138888888888889, 0.45416666666666666, 0.5652777777777778
        ]
      },
      {
        funcionario: 3461,
        nombre: 'DIBER',
        apellido: 'ACOSTA GUILLOTTI',
        fecha: new Date(),
        rowNumber: 27,
        marcas: [
          0.20902777777777778, 0.41041666666666665, 0.43472222222222223, 0.6416666666666667
        ]
      },
      {
        funcionario: 3515,
        nombre: 'CESAR FRANCISCO',
        apellido: 'FACHELI SOSA',
        fecha: new Date(),
        rowNumber: 28,
        marcas: [
          0.4548611111111111, 0.7569444444444445, 0.7909722222222223, 0.7916666666666666
        ]
      },
      {
        funcionario: 3518,
        nombre: 'FERNANDO DANIEL',
        apellido: 'TEJERA CABRERA',
        fecha: new Date(),
        rowNumber: 29,
        marcas: [ 0.5777777777777778, 0.9166666666666666 ]
      },
      {
        funcionario: 3545,
        nombre: 'EDUARDO JOSE',
        apellido: 'RODRIGUEZ ROSSO',
        fecha: new Date(),
        rowNumber: 30,
        marcas: [
          0.18680555555555556, 0.42083333333333334, 0.4576388888888889, 0.5208333333333334
        ]
      },
      {
        funcionario: 3547,
        nombre: 'CARLOS DANIEL',
        apellido: 'DIAZ VELIZ',
        fecha: new Date(),
        rowNumber: 31,
        marcas: [ 0.5409722222222222, 0.7166666666666667, 0.751388888888889, 0.875 ]
      },
      {
        funcionario: 3599,
        nombre: 'LUIS IVAN',
        apellido: 'CASCO AMARAL',
        fecha: new Date(),
        rowNumber: 32,
        marcas: [
          0.20625000000000002, 0.44236111111111115, 0.46597222222222223, 0.6131944444444445
        ]
      },
      {
        funcionario: 3612,
        nombre: 'ANDRES MATIAS',
        apellido: 'ROGEL GOMEZ',
        fecha: new Date(),
        rowNumber: 33,
        marcas: [
          0.20625000000000002, 0.41250000000000003, 0.43194444444444446, 0.5979166666666667
        ]
      },
      {
        funcionario: 3634,
        nombre: 'CESAR GASTON',
        apellido: 'GASCO REYES ',
        fecha: new Date(),
        rowNumber: 34,
        marcas: [ 0.17152777777777775, 0.5916666666666667, 0.6083333333333333 ]
      },
      {
        funcionario: 3654,
        nombre: 'WASHINGTON GABRIEL',
        apellido: 'CABRERA SCHIAPPACASSES',
        fecha: new Date(),
        rowNumber: 35,
        marcas: [ 0.24375, 0.5159722222222222, 0.5409722222222222, 0.6430555555555556 ]
      },
      {
        funcionario: 3686,
        nombre: 'WILLIAM CESAR',
        apellido: 'GRUNULLU GALLO',
        fecha: new Date(),
        rowNumber: 36,
        marcas: [ 0.08125, 0.38055555555555554, 0.41111111111111115, 0.4166666666666667 ]
      },
      {
        funcionario: 3708,
        nombre: 'NESTOR FABIAN',
        apellido: 'MARTINEZ FIERRO',
        fecha: new Date(),
        rowNumber: 37,
        marcas: [ 0.18611111111111112, 0.4861111111111111, 0.5208333333333334 ]
      },
      {
        funcionario: 3737,
        nombre: 'JORGE NELSON',
        apellido: 'BURGOS ROMAN',
        fecha: new Date(),
        rowNumber: 38,
        marcas: [ 0.4986111111111111, 0.7152777777777778, 0.75, 0.8743055555555556 ]
      },
      {
        funcionario: 3764,
        nombre: 'OSCAR SEBASTIAN',
        apellido: 'RODRIGUEZ SILVEIRA',
        fecha: new Date(),
        rowNumber: 39,
        marcas: [ 0.5402777777777777, 0.7166666666666667, 0.751388888888889, 0.875 ]
      },
      {
        funcionario: 3772,
        nombre: 'WILLIAN JESUS',
        apellido: 'COLMAN FILIPOVICH',
        fecha: new Date(),
        rowNumber: 40,
        marcas: [ 0.2111111111111111, 0.5, 0.5347222222222222, 0.5416666666666666 ]
      },
      {
        funcionario: 3790,
        nombre: 'ABAYUBA ANGELO',
        apellido: 'PEREIRA TECHEIRA',
        fecha: new Date(),
        rowNumber: 41,
        marcas: [
          0.2659722222222222, 0.49652777777777773, 0.5243055555555556, 0.6298611111111111
        ]
      },
      {
        funcionario: 3821,
        nombre: 'JULIO CESAR',
        apellido: 'NEGRETTE ',
        fecha: new Date(),
        rowNumber: 42,
        marcas: [
          0.5777777777777778, 0.8013888888888889, 0.8326388888888889, 0.9520833333333334
        ]
      },
      {
        funcionario: 3825,
        nombre: 'LEONARDO JAVIER',
        apellido: 'CABRERA ALTEZ',
        fecha: new Date(),
        rowNumber: 43,
        marcas: [
          0.20694444444444446, 0.4138888888888889, 0.4465277777777778, 0.6194444444444445
        ]
      },
      {
        funcionario: 3834,
        nombre: 'JUAN CARLOS',
        apellido: 'ACOSTA ALMEIDA',
        fecha: new Date(),
        rowNumber: 44,
        marcas: [ 0.25069444444444444, 0.2520833333333333, 0.25416666666666665 ]
      },
      {
        funcionario: 3840,
        nombre: 'PABLO DANIEL',
        apellido: 'MESA GOMEZ',
        fecha: new Date(),
        rowNumber: 45,
        marcas: [
          0.2027777777777778, 0.4131944444444444, 0.45694444444444443, 0.5868055555555556
        ]
      },
      {
        funcionario: 3858,
        nombre: 'SEBASTIAN ARIEL',
        apellido: 'SANABIA ACOSTA',
        fecha: new Date(),
        rowNumber: 46,
        marcas: [
          0.16458333333333333, 0.37986111111111115, 0.42291666666666666, 0.5708333333333333
        ]
      },
      {
        funcionario: 3897,
        nombre: 'SCHUBERT JAVIER',
        apellido: 'NUÑEZ',
        fecha: new Date(),
        rowNumber: 47,
        marcas: [
          0.4986111111111111, 0.6180555555555556, 0.6520833333333333, 0.8784722222222222
        ]
      },
      {
        funcionario: 4008,
        nombre: 'MAXIMILIANO ',
        apellido: 'DELASCIO GALLERO',
        fecha: new Date(),
        rowNumber: 48,
        marcas: [ 0.02361111111111111, 0.049999999999999996, 0.10902777777777778 ]
      },
      {
        funcionario: 4032,
        nombre: 'VICTOR ANDRES',
        apellido: 'MOLINARI GIL',
        fecha: new Date(),
        rowNumber: 49,
        marcas: [ 0.25277777777777777, 0.9111111111111111 ]
      },
      {
        funcionario: 4092,
        nombre: 'ADOLFO ',
        apellido: 'HERNANDEZ ALDAO',
        fecha: new Date(),
        rowNumber: 50,
        marcas: [
          0.19930555555555554, 0.44027777777777777, 0.4611111111111111, 0.6145833333333334
        ]
      },
      {
        funcionario: 4128,
        nombre: 'NICOLAS MARCELO',
        apellido: 'LANDARTE MENDEZ',
        fecha: new Date(),
        rowNumber: 51,
        marcas: [
          0.2041666666666667, 0.41041666666666665, 0.43194444444444446, 0.5958333333333333
        ]
      },
      {
        funcionario: 4148,
        nombre: 'EDGAR JOEL',
        apellido: 'MAZA CABRERA',
        fecha: new Date(),
        rowNumber: 52,
        marcas: [ 0.4993055555555555, 0.7986111111111112 ]
      },
      {
        funcionario: 4193,
        nombre: 'FERNANDO NELSON',
        apellido: 'CAMPOS GONZALEZ',
        fecha: new Date(),
        rowNumber: 53,
        marcas: [ 0.2027777777777778, 0.4173611111111111, 0.43263888888888885, 0.6 ]
      },
      {
        funcionario: 4221,
        nombre: 'RUBEN JAVIER',
        apellido: 'COLOMBO',
        fecha: new Date(),
        rowNumber: 54,
        marcas: [
          0.2534722222222222, 0.4784722222222222, 0.5222222222222223, 0.5833333333333334
        ]
      },
      {
        funcionario: 4232,
        nombre: 'IGNACIO HUGO',
        apellido: 'BERRUTTI DE LEON',
        fecha: new Date(),
        rowNumber: 55,
        marcas: [
          0.20972222222222223, 0.41180555555555554, 0.43333333333333335, 0.6055555555555555
        ]
      },
      {
        funcionario: 4237,
        nombre: 'MARIO ROBERTO',
        apellido: 'MACHICADO PIÑEYRO',
        fecha: new Date(),
        rowNumber: 56,
        marcas: [ 0.05416666666666667 ]
      },
      {
        funcionario: 4241,
        nombre: 'ADAN FABRICIO',
        apellido: 'BAUDIN LOPEZ',
        fecha: new Date(),
        rowNumber: 57,
        marcas: [ 0.24513888888888888, 0.5833333333333334 ]
      },
      {
        funcionario: 4265,
        nombre: 'DIEGO MAURICIO',
        apellido: 'MACHADO VANOLLI',
        fecha: new Date(),
        rowNumber: 58,
        marcas: [ 0.18541666666666667 ]
      },
      {
        funcionario: 4275,
        nombre: 'JUAN PABLO',
        apellido: 'SENA FERREIRA',
        fecha: new Date(),
        rowNumber: 59,
        marcas: [ 0.020833333333333332, 0.04861111111111111, 0.10694444444444444 ]
      },
      {
        funcionario: 4302,
        nombre: 'NICOLAS DANIEL',
        apellido: 'BATTAGLINO GUTIERREZ',
        fecha: new Date(),
        rowNumber: 60,
        marcas: [
          0.17152777777777775, 0.3673611111111111, 0.4083333333333334, 0.5680555555555555
        ]
      },
      {
        funcionario: 4321,
        nombre: 'JORGE PABLO',
        apellido: 'DINI GARAYALDE',
        fecha: new Date(),
        rowNumber: 61,
        marcas: [
          0.16944444444444443, 0.4680555555555555, 0.4909722222222222, 0.6194444444444445
        ]
      },
      {
        funcionario: 4361,
        nombre: 'PABLO ANDRES',
        apellido: 'IBARRA BLANCO',
        fecha: new Date(),
        rowNumber: 62,
        marcas: [
          0.17152777777777775, 0.4930555555555556, 0.5069444444444444, 0.5166666666666667
        ]
      },
      {
        funcionario: 4373,
        nombre: 'ANIBAL GUZAMN',
        apellido: 'ALCINA PARRILLA',
        fecha: new Date(),
        rowNumber: 63,
        marcas: [
          0.20555555555555557, 0.5180555555555556, 0.5597222222222222, 0.6395833333333333
        ]
      },
      {
        funcionario: 4485,
        nombre: 'OSCAR DANILO ',
        apellido: 'RODRIGUEZ ',
        fecha: new Date(),
        rowNumber: 64,
        marcas: [
          0.3347222222222222, 0.5499999999999999, 0.5847222222222223, 0.6666666666666666
        ]
      },
      {
        funcionario: 4535,
        nombre: 'LUIS EDUARDO',
        apellido: 'RUIZ GONZALEZ',
        fecha: new Date(),
        rowNumber: 65,
        marcas: [ 0.02152777777777778, 0.04861111111111111, 0.10347222222222223 ]
      },
      {
        funcionario: 4542,
        nombre: 'GUILLERMO LEANDRO',
        apellido: 'RODRIGUEZ CAPELLI',
        fecha: new Date(),
        rowNumber: 66,
        marcas: [ 0.04652777777777778 ]
      },
      {
        funcionario: 4575,
        nombre: 'ELIAS DANIEL',
        apellido: 'CESPEDES DELGADO',
        fecha: new Date(),
        rowNumber: 67,
        marcas: [ 0.20694444444444446, 0.5083333333333333, 0.5416666666666666 ]
      },
      {
        funcionario: 4587,
        nombre: 'ALEXIS GABRIEL',
        apellido: 'ALVEZ MARTINEZ',
        fecha: new Date(),
        rowNumber: 68,
        marcas: [
          0.1673611111111111, 0.5027777777777778, 0.5256944444444445, 0.5854166666666667
        ]
      },
      {
        funcionario: 6236,
        nombre: 'ANGEL ISMAEL',
        apellido: 'BANDERA CABRERA',
        fecha: new Date(),
        rowNumber: 69,
        marcas: [
          0.5, 0.8104166666666667, 0.8409722222222222, 0.8715277777777778
        ]
      }]
    this.horasAComparar = [
      {
        nroFuncionario: '1628',
        regimen: 9.36,
        relojHorasComunes: 9.5,
        relojHorasDobles: 0.5,
        relojHorasNocturnas: 0.5,
        marcasHorasComunes: 9.5,
        marcasHorasDobles: 1,
        marcasHorasNocturnas: 0.5,
        sector: 'DESOSADO',
        nombres: 'MARIO DANIEL',
        apellidos: 'ALALLON COLLAZO'
      },
      {
        nroFuncionario: '1750',
        regimen: 9.36,
        relojHorasComunes: 9.5,
        relojHorasDobles: 0,
        relojHorasNocturnas: 0,
        marcasHorasComunes: 9.5,
        marcasHorasDobles: 0.5,
        marcasHorasNocturnas: 0,
        sector: 'DESOSADO',
        nombres: 'CLAVER CIRO',
        apellidos: 'TORRES BELEDO'
      },
      {
        nroFuncionario: '1772',
        regimen: 9.36,
        relojHorasComunes: 9.5,
        relojHorasDobles: 0,
        relojHorasNocturnas: 0,
        marcasHorasComunes: 9.5,
        marcasHorasDobles: 0.5,
        marcasHorasNocturnas: 0,
        sector: 'DESOSADO',
        nombres: 'ELADIO YAMANDU',
        apellidos: 'BRAVO CABRERA'
      },
      {
        nroFuncionario: '2165',
        regimen: 9.36,
        relojHorasComunes: 9.5,
        relojHorasDobles: 0,
        relojHorasNocturnas: 0,
        marcasHorasComunes: 9.5,
        marcasHorasDobles: 0.5,
        marcasHorasNocturnas: 0,
        sector: 'DESOSADO',
        nombres: 'CARLOS ALBERTO',
        apellidos: 'FRANDINI COSTA'
      },
      {
        nroFuncionario: '2269',
        regimen: 9.36,
        relojHorasComunes: 9.5,
        relojHorasDobles: 0,
        relojHorasNocturnas: 0.5,
        marcasHorasComunes: 9.5,
        marcasHorasDobles: 0.5,
        marcasHorasNocturnas: 0.5,
        sector: 'EMPAQUE MENUDENCIAS',
        nombres: 'CARLOS GERVASIO',
        apellidos: 'CABRERA MACCHI'
      },
      {
        nroFuncionario: '2411',
        regimen: 8,
        relojHorasComunes: 8,
        relojHorasDobles: 0,
        relojHorasNocturnas: 8,
        marcasHorasComunes: 8,
        marcasHorasDobles: 8,
        marcasHorasNocturnas: 1,
        sector: 'SALA DE MAQUINAS',
        nombres: 'NESTOR DARIO',
        apellidos: 'DELGADO GUILLOTTI'
      },
      {
        nroFuncionario: '4032',
        regimen: 8,
        relojHorasComunes: 8,
        relojHorasDobles: 4,
        relojHorasNocturnas: 8,
        marcasHorasComunes: 8,
        marcasHorasDobles: 8,
        marcasHorasNocturnas: 1,
        sector: 'SALA DE MAQUINAS',
        nombres: 'VICTOR ANDRES',
        apellidos: 'MOLINARI GIL'
      },
      {
        nroFuncionario: '4092',
        regimen: 9.36,
        relojHorasComunes: 9.5,
        relojHorasDobles: 0,
        relojHorasNocturnas: 0,
        marcasHorasComunes: 9.5,
        marcasHorasDobles: 0.5,
        marcasHorasNocturnas: 0,
        sector: 'DESOSADO',
        nombres: 'ADOLFO',
        apellidos: 'HERNANDEZ ALDAO'
      },
      {
        nroFuncionario: '4361',
        regimen: 9.36,
        relojHorasComunes: 8,
        relojHorasDobles: 0.5,
        relojHorasNocturnas: 1,
        marcasHorasComunes: 8,
        marcasHorasDobles: 0,
        marcasHorasNocturnas: 1,
        sector: 'COMPUTOS',
        nombres: 'PABLO ANDRES',
        apellidos: 'IBARRA BLANCO'
      },
      {
        nroFuncionario: '5447',
        regimen: 9.36,
        relojHorasComunes: 8,
        relojHorasDobles: 1.5,
        relojHorasNocturnas: 0,
        marcasHorasComunes: 9.5,
        marcasHorasDobles: 0,
        marcasHorasNocturnas: 0,
        sector: 'COMPUTOS',
        nombres: 'SHAYNE GONZALO',
        apellidos: 'SILVERA ROYON'
      },
      {
        nroFuncionario: '5790',
        regimen: 9.36,
        relojHorasComunes: 9.5,
        relojHorasDobles: 0,
        relojHorasNocturnas: 0,
        marcasHorasComunes: 9.5,
        marcasHorasDobles: 0.5,
        marcasHorasNocturnas: 0,
        sector: 'FAENA',
        nombres: 'OSCAR ANDRES',
        apellidos: 'ARTIGAS BARRETTO'
      },
      {
        nroFuncionario: '6099',
        regimen: 8,
        relojHorasComunes: 8,
        relojHorasDobles: 0,
        relojHorasNocturnas: 8,
        marcasHorasComunes: 8,
        marcasHorasDobles: 10.5,
        marcasHorasNocturnas: 1,
        sector: 'POTABILIZACION',
        nombres: 'FERNANDO ANDRES',
        apellidos: 'ESTEVEZ TORIELLI'
      },
      {
        nroFuncionario: '6360',
        regimen: 9.36,
        relojHorasComunes: 9.5,
        relojHorasDobles: 0.5,
        relojHorasNocturnas: 0,
        marcasHorasComunes: 9.5,
        marcasHorasDobles: 1,
        marcasHorasNocturnas: 0,
        sector: 'DEPOSITO',
        nombres: 'FERNANDO NICOLAS',
        apellidos: 'LOPEZ PEISINO'
      },
      {
        nroFuncionario: '6431',
        regimen: 9.36,
        relojHorasComunes: 9.5,
        relojHorasDobles: 1,
        relojHorasNocturnas: 0.75,
        marcasHorasComunes: 9.5,
        marcasHorasDobles: 1,
        marcasHorasNocturnas: 1,
        sector: 'DESOSADO',
        nombres: 'PABLO NERO',
        apellidos: 'MARQUISIO BADANI'
      },
      {
        nroFuncionario: '6513',
        regimen: 9.36,
        relojHorasComunes: 9.5,
        relojHorasDobles: 0,
        relojHorasNocturnas: 0,
        marcasHorasComunes: 9.5,
        marcasHorasDobles: 0.5,
        marcasHorasNocturnas: 0,
        sector: 'SUBPRODUCTOS',
        nombres: 'HUGO JESUS',
        apellidos: 'TABAREZ DE LOS SANTOS'
      },
      {
        nroFuncionario: '6615',
        regimen: 8,
        relojHorasComunes: 8,
        relojHorasDobles: 0,
        relojHorasNocturnas: 8,
        marcasHorasComunes: 8,
        marcasHorasDobles: 4,
        marcasHorasNocturnas: 0,
        sector: 'SALA DE MAQUINAS',
        nombres: 'BRYAN EDWARD',
        apellidos: 'FORD MORALES'
      },
      {
        nroFuncionario: '6801',
        regimen: 9.36,
        relojHorasComunes: 9.5,
        relojHorasDobles: 0.5,
        relojHorasNocturnas: 0,
        marcasHorasComunes: 9.5,
        marcasHorasDobles: 1,
        marcasHorasNocturnas: 0,
        sector: 'DEPOSITO',
        nombres: 'NICOLAS MARCELO',
        apellidos: 'GUILLOTTI CERNADA'
      },
      {
        nroFuncionario: '6913',
        regimen: 8,
        relojHorasComunes: 8,
        relojHorasDobles: 0,
        relojHorasNocturnas: 1,
        marcasHorasComunes: 8,
        marcasHorasDobles: 0.5,
        marcasHorasNocturnas: 1,
        sector: 'SALA DE MAQUINAS',
        nombres: 'RICHARD GASTON',
        apellidos: 'SEGOVIA FERANNDEZ'
      },
      {
        nroFuncionario: '6923',
        regimen: 8,
        relojHorasComunes: 6.5,
        relojHorasDobles: 0,
        relojHorasNocturnas: 6.5,
        marcasHorasComunes: 2,
        marcasHorasDobles: 0,
        marcasHorasNocturnas: 2,
        sector: 'CUARTEO',
        nombres: 'FERNANDO RAFAEL',
        apellidos: 'GONZALEZ OLIVERA'
      },
      {
        nroFuncionario: '6956',
        regimen: 9.36,
        relojHorasComunes: 9.5,
        relojHorasDobles: 1.5,
        relojHorasNocturnas: 1,
        marcasHorasComunes: 9.5,
        marcasHorasDobles: 1,
        marcasHorasNocturnas: 1,
        sector: 'DESOSADO',
        nombres: 'MARIA AGUSTINA',
        apellidos: 'BEITTONE MARTINEZ'
      },
      {
        nroFuncionario: '7098',
        regimen: 8,
        relojHorasComunes: 8,
        relojHorasDobles: 0,
        relojHorasNocturnas: 8,
        marcasHorasComunes: 1,
        marcasHorasDobles: 0,
        marcasHorasNocturnas: 1,
        sector: 'SALADERO',
        nombres: 'EZEQUIEL OSCAR',
        apellidos: 'ATTO NAVARRO'
      },
      {
        nroFuncionario: '7100',
        regimen: 9.36,
        relojHorasComunes: 9.5,
        relojHorasDobles: 0,
        relojHorasNocturnas: 0.75,
        marcasHorasComunes: 9.5,
        marcasHorasDobles: 0,
        marcasHorasNocturnas: 0.5,
        sector: 'EMPAQUE MENUDENCIAS',
        nombres: 'SEBASTIAN',
        apellidos: 'MORALES REYES'
      },
      {
        nroFuncionario: '7127',
        regimen: 8,
        relojHorasComunes: 9.5,
        relojHorasDobles: 0,
        relojHorasNocturnas: 0,
        marcasHorasComunes: 8,
        marcasHorasDobles: 1.5,
        marcasHorasNocturnas: 0,
        sector: 'ALMACENES',
        nombres: 'LUCIANO',
        apellidos: 'DAVID SUAREZ'
      },
      {
        nroFuncionario: '7170',
        regimen: 9.36,
        relojHorasComunes: 9.5,
        relojHorasDobles: 1,
        relojHorasNocturnas: 1,
        marcasHorasComunes: 9.5,
        marcasHorasDobles: 1,
        marcasHorasNocturnas: 0,
        sector: 'SUBPRODUCTOS',
        nombres: 'ALEX NICOLAS',
        apellidos: 'GONZALEZ RIVERA'
      },
      {
        nroFuncionario: '7171',
        regimen: 9.36,
        relojHorasComunes: 9.5,
        relojHorasDobles: 1,
        relojHorasNocturnas: 1,
        marcasHorasComunes: 9.5,
        marcasHorasDobles: 1,
        marcasHorasNocturnas: 0,
        sector: 'SUBPRODUCTOS',
        nombres: 'FRANCO',
        apellidos: 'BURGOS PIRIZ'
      }
    ];

    this.horasIncidencias = {
      horas: [
        {
          nroFuncionario: '1387',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 1.5 },
            { codigo: 6, horas: 1 }
          ]
        },
        {
          nroFuncionario: '1628',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 1 },
            { codigo: 6, horas: 0.5 }
          ]
        },
        {
          nroFuncionario: '1750',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0.5 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '1772',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0.5 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '2145',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0.5 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '2165',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0.5 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '2269',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0.5 },
            { codigo: 6, horas: 0.5 }
          ]
        },
        {
          nroFuncionario: '2411',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 8 },
            { codigo: 6, horas: 1 }
          ]
        },
        {
          nroFuncionario: '2550',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '2667',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '2823',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '2908',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0.5 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '2910',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0.5 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3077',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 8.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3100',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 1 }
          ]
        },
        {
          nroFuncionario: '3141',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3163',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0.5 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3203',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3221',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 1 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3227',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3418',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 2.5 },
            { codigo: 6, horas: 2 }
          ]
        },
        {
          nroFuncionario: '3423',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 1 }
          ]
        },
        {
          nroFuncionario: '3461',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 1 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3515',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3518',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 1 }
          ]
        },
        {
          nroFuncionario: '3545',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0.5 }
          ]
        },
        {
          nroFuncionario: '3547',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3599',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3612',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3654',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 1.5 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3686',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 3 }
          ]
        },
        {
          nroFuncionario: '3737',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 1 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3764',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3772',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3790',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 8.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3821',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 1 },
            { codigo: 6, horas: 2 }
          ]
        },
        {
          nroFuncionario: '3825',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0.5 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3840',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '3858',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 1 }
          ]
        },
        {
          nroFuncionario: '3897',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 1 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '4032',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 8 },
            { codigo: 6, horas: 1 }
          ]
        },
        {
          nroFuncionario: '4092',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0.5 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '4128',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '4148',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 7 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '4193',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '4221',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '4232',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '4241',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '4302',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 1 }
          ]
        },
        {
          nroFuncionario: '4321',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 1.5 },
            { codigo: 6, horas: 1 }
          ]
        },
        {
          nroFuncionario: '4361',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 1 }
          ]
        },
        {
          nroFuncionario: '4373',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 1 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '4485',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '4587',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 2 },
            { codigo: 6, horas: 1 }
          ]
        },
        {
          nroFuncionario: '4605',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '4648',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 1 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '4682',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '4701',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 3 }
          ]
        },
        {
          nroFuncionario: '4742',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '4762',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '4934',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 1 },
            { codigo: 6, horas: 0.5 }
          ]
        },
        {
          nroFuncionario: '4969',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '5047',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '5139',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '5196',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 1.5 },
            { codigo: 6, horas: 0.5 }
          ]
        },
        {
          nroFuncionario: '5221',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 1 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '5299',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 3 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '5318',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '5366',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 1 },
            { codigo: 6, horas: 0.5 }
          ]
        },
        {
          nroFuncionario: '5380',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 1 }
          ]
        },
        {
          nroFuncionario: '5385',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 6 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '5409',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0.5 },
            { codigo: 6, horas: 2 }
          ]
        },
        {
          nroFuncionario: '5447',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '5457',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '5496',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 2 }
          ]
        },
        {
          nroFuncionario: '5524',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '5591',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 1.5 },
            { codigo: 6, horas: 1 }
          ]
        },
        {
          nroFuncionario: '5611',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '5711',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '5780',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '5790',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0.5 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '5867',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '5877',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '5903',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 2 }
          ]
        },
        {
          nroFuncionario: '5949',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0.5 },
            { codigo: 6, horas: 0.5 }
          ]
        },
        {
          nroFuncionario: '6056',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '6071',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '6099',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 10.5 },
            { codigo: 6, horas: 1 }
          ]
        },
        {
          nroFuncionario: '6114',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '6117',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '6158',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '6159',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '6162',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0.5 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '6168',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 1.5 },
            { codigo: 6, horas: 1 }
          ]
        },
        {
          nroFuncionario: '6172',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0.5 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '6181',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '6182',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '6221',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '6229',
          regimen: 8,
          horas: [
            { codigo: 2, horas: 8 },
            { codigo: 4, horas: 0 },
            { codigo: 6, horas: 0 }
          ]
        },
        {
          nroFuncionario: '6240',
          regimen: 9.36,
          horas: [
            { codigo: 2, horas: 9.5 },
            { codigo: 4, horas: 0.5 },
            { codigo: 6, horas: 0 }
          ]
        }
      ],
      incidencias: [{
        nroFuncionario: '1649',
        nombres: 'ANGEL MARIO',
        apellidos: 'CABRERA REYNALDO',
        regimen: '9.36',
        sector: 'DESOSADO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '2015',
        nombres: 'DANIEL JORGE',
        apellidos: 'PESCA MOREIRA',
        regimen: '9.36',
        sector: 'MANGAS',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '3090',
        nombres: 'NESTOR DARIO',
        apellidos: 'LENZI TORRES',
        regimen: '9.36',
        sector: 'CONTROL DE CALIDAD',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '3154',
        nombres: 'LUIS DENIS',
        apellidos: 'TOURON PASINI',
        regimen: '8',
        sector: 'EXPEDICION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '3634',
        nombres: 'CESAR GASTON',
        apellidos: 'GASCO REYES',
        regimen: '8',
        sector: 'ALMACENES',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '3708',
        nombres: 'NESTOR FABIAN',
        apellidos: 'MARTINEZ FIERRO',
        regimen: '8',
        sector: 'GRASERIA',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '3834',
        nombres: 'JUAN CARLOS',
        apellidos: 'ACOSTA ALMEIDA',
        regimen: '8',
        sector: 'MANTENIMIENTO GENERAL',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '4008',
        nombres: 'MAXIMILIANO',
        apellidos: 'DELASCIO GALLERO',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '4237',
        nombres: 'MARIO ROBERTO',
        apellidos: 'MACHICADO PIÑEYRO',
        regimen: '8',
        sector: 'EXPEDICION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '4265',
        nombres: 'DIEGO MAURICIO',
        apellidos: 'MACHADO VANOLLI',
        regimen: '8',
        sector: 'EXPEDICION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '4275',
        nombres: 'JUAN PABLO',
        apellidos: 'SENA FERRERIA',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '4535',
        nombres: 'LUIS EDUARDO',
        apellidos: 'RUIZ GONZALEZ',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '4542',
        nombres: 'GUILLERMO LEONARDO',
        apellidos: 'RODRIGUEZ CAPELLI',
        regimen: '8',
        sector: 'EXPEDICION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '4575',
        nombres: 'ELIAS DANIEL',
        apellidos: 'CESPEDES DELGADO',
        regimen: '8',
        sector: 'GRASERIA',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '5460',
        nombres: 'GUILLERMO JAVIER',
        apellidos: 'VILLOLDO SAUCEDO',
        regimen: '9.36',
        sector: 'DESOSADO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '5754',
        nombres: 'MARIA ROSA',
        apellidos: 'GUTIERREZ ROCHA',
        regimen: '8',
        sector: 'CUADRILLA LIMPIEZA',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '5859',
        nombres: 'YACAIRA ALEJANDRA',
        apellidos: 'ROMAN MOREIRA',
        regimen: '8',
        sector: 'CUADRILLA LIMPIEZA',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '5864',
        nombres: 'DENIS EDUARDO',
        apellidos: 'CASANOVA CRERI',
        regimen: '9.36',
        sector: 'SERVICIOS GENERALES PRODUCCION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '5909',
        nombres: 'SANTIAGO FELIX',
        apellidos: 'SORIA MORAES',
        regimen: '8',
        sector: 'SALADERO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '5928',
        nombres: 'JORGE EDUARDO',
        apellidos: 'RIVERO OLIVERA',
        regimen: '8',
        sector: 'GRASERIA',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '5932',
        nombres: 'TERESA ADRIANA',
        apellidos: 'CARLINI -',
        regimen: '8',
        sector: 'CUADRILLA LIMPIEZA',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6093',
        nombres: 'WILSON RAUL',
        apellidos: 'MILANO MEDINA',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6122',
        nombres: 'ERNESTO FABIAN',
        apellidos: 'DA SILVA RODRIGUEZ',
        regimen: '8',
        sector: 'EXPEDICION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6233',
        nombres: 'MARIA JOSELEN',
        apellidos: 'CASTRILLO BURGOS',
        regimen: '8',
        sector: 'CUADRILLA LIMPIEZA',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6236',
        nombres: 'ANGEL ISMAEL',
        apellidos: 'BANDERA CABRERA',
        regimen: '9.36',
        sector: 'FAENA',
        motivo: 'Error en formato de marca'
      },
      {
        nroFuncionario: '6350',
        nombres: 'HEBER RODOLFO',
        apellidos: 'CAZARD SIENE',
        regimen: '8',
        sector: 'EXPEDICION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6372',
        nombres: 'FEDERICO',
        apellidos: 'VARELA BRAVO',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6443',
        nombres: 'JAVIER ALEXIS',
        apellidos: 'PEDRANZINI MARTINEZ',
        regimen: '8',
        sector: 'EXPEDICION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6446',
        nombres: 'ALEJANDRO EMANUEL',
        apellidos: 'MARTINEZ CUADRADO',
        regimen: '8',
        sector: 'EXPEDICION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6459',
        nombres: 'NICOLAS ALCIDES',
        apellidos: 'CABRERA COTELO',
        regimen: '8',
        sector: 'EXPEDICION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6470',
        nombres: 'MARCELO',
        apellidos: 'BRAVO -',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6473',
        nombres: 'SEBASTIAN ANDRES',
        apellidos: 'AMARAL PEREZ',
        regimen: '9.36',
        sector: 'FAENA',
        motivo: 'Error en formato de marca'
      },
      {
        nroFuncionario: '6538',
        nombres: 'DIEGO MARTIN',
        apellidos: 'PEDREIRA LUZ',
        regimen: '8',
        sector: 'EXPEDICION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6546',
        nombres: 'AGUSTIN ISMAEL',
        apellidos: 'TRUJILLO CABRERA',
        regimen: '8',
        sector: 'SALA DE CALDERAS',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6564',
        nombres: 'CARLOS ALEXIS',
        apellidos: 'RIVERO MARTINEZ',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6624',
        nombres: 'EMANUEL',
        apellidos: 'GERVASINI RODRIGUEZ',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6643',
        nombres: 'MAICOL LEONARDO',
        apellidos: 'DA SILVA LARROSA',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6649',
        nombres: 'MARY ISABELL',
        apellidos: 'CRIGINEE BAS',
        regimen: '8',
        sector: 'CUADRILLA LIMPIEZA',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6662',
        nombres: 'RUBEN STEVEN',
        apellidos: 'GARCIA GARCIA',
        regimen: '8',
        sector: 'EXPEDICION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6798',
        nombres: 'FERNANDO EMANUEL',
        apellidos: 'TORRES MARTINEZ',
        regimen: '8',
        sector: 'EXPEDICION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6824',
        nombres: 'SANTIAGO EMANUEL',
        apellidos: 'LAVITOLA AITA',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6832',
        nombres: 'FRANCO NEHUEL',
        apellidos: 'FARIAS SAYAVEDRAS',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6833',
        nombres: 'NAHUEL',
        apellidos: 'TABAREZ BACCINO',
        regimen: '8',
        sector: 'SALADERO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6834',
        nombres: 'GUILLERMO EZEQUIEL',
        apellidos: 'FABRAS ROMERO',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6868',
        nombres: 'MARIA INES',
        apellidos: 'SILVA COLLAZO',
        regimen: '8',
        sector: 'CUADRILLA LIMPIEZA',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6874',
        nombres: 'ALBARO',
        apellidos: 'MOREIRA MIRANDA',
        regimen: '8',
        sector: 'ALMACENES',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6880',
        nombres: 'ANDRES SEBASTIAN',
        apellidos: 'BERRIEL PEREZ',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6887',
        nombres: 'AGUSTIN',
        apellidos: 'RODRIGUEZ CACERES',
        regimen: '8',
        sector: 'EXPEDICION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6900',
        nombres: 'MATIAS',
        apellidos: 'HERNANDEZ ICARDI',
        regimen: '9.36',
        sector: 'FETEADO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6970',
        nombres: 'MAURICIO GABRIEL',
        apellidos: 'HERNANDEZ MARECO',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '6995',
        nombres: 'NAHUEL',
        apellidos: 'CAMELIA OCAMPO',
        regimen: '8',
        sector: 'MANTENIMIENTO GENERAL',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7025',
        nombres: 'JONATHAN',
        apellidos: 'OBENAUER ASCARRAGA',
        regimen: '8',
        sector: 'SALADERO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7039',
        nombres: 'GUSTAVO',
        apellidos: 'SANABIA REINALDO',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7061',
        nombres: 'YOHANN',
        apellidos: 'CABRERA CAPOTE',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7062',
        nombres: 'MARIA ISABEL',
        apellidos: 'ALVAREZ AITA',
        regimen: '8',
        sector: 'CUADRILLA LIMPIEZA',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7064',
        nombres: 'KATHERINE VIVIANA',
        apellidos: 'ROMAN MOREIRA',
        regimen: '8',
        sector: 'CUADRILLA LIMPIEZA',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7070',
        nombres: 'NESTOR DANIEL',
        apellidos: 'LENZI CERNADA',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7090',
        nombres: 'MAXIMILIANO ANDRES',
        apellidos: 'ROMANO GONZALEZ',
        regimen: '8',
        sector: 'SALADERO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7119',
        nombres: 'BRIAN SANTIAGO',
        apellidos: 'BATISTA COELHO',
        regimen: '8',
        sector: 'CUARTEO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7137',
        nombres: 'ROMAN',
        apellidos: 'CERNADA ROGEL',
        regimen: '8',
        sector: 'EXPEDICION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7138',
        nombres: 'DIEGO MARTIN',
        apellidos: 'SILVA QUIRINO',
        regimen: '9.36',
        sector: 'CAMARAS ENFRIADO',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7148',
        nombres: 'LEIDE YOANA',
        apellidos: 'DOS SANTOS BEGUIRISTAIN',
        regimen: '8',
        sector: 'CUADRILLA LIMPIEZA',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7152',
        nombres: 'PABLO EZEQUIEL',
        apellidos: 'GADEA CARBAJAL',
        regimen: '8',
        sector: 'EXPEDICION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7155',
        nombres: 'CLAUDIA VALERIA',
        apellidos: 'MOLINA FARIA',
        regimen: '8',
        sector: 'CUADRILLA LIMPIEZA',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7158',
        nombres: 'FERNANDA NADIN',
        apellidos: 'ROCCA BALDIVIA',
        regimen: '8',
        sector: 'CUADRILLA LIMPIEZA',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7161',
        nombres: 'CARLOS ANDRES',
        apellidos: 'ROLANDO BUSTOS',
        regimen: '8',
        sector: 'EXPEDICION',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7168',
        nombres: 'LAURA  LILIAN',
        apellidos: 'PELLEJERO ALVES',
        regimen: '8',
        sector: 'CUADRILLA LIMPIEZA',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7175',
        nombres: 'JESUS MIGUEL',
        apellidos: 'BENTANCOR PEREYRA',
        regimen: '9.36',
        sector: 'MANGAS',
        motivo: 'Falta alguna marca'
      },
      {
        nroFuncionario: '7177',
        nombres: 'ANGELA MICAELA',
        apellidos: 'MARRERO GONZALEZ',
        regimen: '8',
        sector: 'CUADRILLA LIMPIEZA',
        motivo: 'Error en formato de marca'
      }
    ]
    }

    this.dataToPrint = {
      incidencias: this.horasIncidencias.incidencias,
      inconsistencias: this.horasAComparar
    }
    
  }

  private esInconsistencia(horas: HorasComparar): boolean {
    return Math.abs(horas.marcasHorasComunes - horas.relojHorasComunes) > 1 ||
            horas.marcasHorasDobles != horas.relojHorasDobles ||
            horas.marcasHorasNocturnas != horas.relojHorasNocturnas;
  }

  private processFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      let fr = new FileReader();
      fr.readAsArrayBuffer(file);
      fr.onload = () => {
        let data = fr.result;
        let workbook = xls.read(data, {type: 'array'});
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        this.excelData = xls.utils.sheet_to_json(sheet, {raw: true});
        const _first = Object.keys(this.excelData[0]);

        if(_first != null && _first != undefined)
        {
          switch (_first[0])
          {
            case 'FS.':
              this.horasData = this.excelData;
              resolve();
              break;
            case 'FunCod':
              this.marcasData = this.excelData;
              resolve();
              break;
            default:
              console.log("Alguno de los archivos no cumple con los requisitos. Verificar.")
              reject();
              break;
            }
        } else {
          console.log("Alguno de los archivos no cumple con los requisitos. Verificar.");
          reject();
        }
      }
    });
  }
  
  mostrarOpciones(): void {
    this.isSettingsVisible = true;
    this.isProcessVisible = false;
    this.isSeeFilesVisible = false;
  }

  updateFuncionarios(): void {
    this.showDialog();
  }

  private showDialog(): void {
    this.ref = this.dialogService.open(SingleFileUploaderComponent, {
      header: 'Actualizar padrón de funcionarios',
      width: '50vw',
      contentStyle: { overflow: 'auto' },
      closeOnEscape: true,
      dismissableMask: true
    });

    this.ref.onClose.subscribe( (result: any) => {
      if (result !== undefined) {
        setTimeout(async () => {
          await this.getPadronData(); 
        }, 100);
      }
    });
  }

  private mergeHoras(hrsReloj: HorasPorFuncionario[], hrsCalculadas: HorasPorFuncionario[], funcionarios: number[]): HorasComparar[]{
    let horas: HorasComparar[] = [];

    funcionarios.forEach(funcionario => {
      const funReloj:  HorasPorFuncionario | undefined = hrsReloj.find(f => f.nroFuncionario === funcionario.toString());
      const funCalculado: HorasPorFuncionario | undefined = hrsCalculadas.find(f => f.nroFuncionario === funcionario.toString());
      const funcPadron: PadronFuncionario = this.padron?.find(p => p.nroFuncionario === funcionario.toString())!;
      if(funReloj != null && funReloj != undefined && funCalculado != null && funCalculado != undefined) {
        horas.push(
          {
            nroFuncionario: funcionario.toString(),
            regimen: funReloj.regimen,
            relojHorasComunes:    funReloj.horas[funReloj.horas.findIndex(i => i.codigo === 2)].horas,
            relojHorasDobles:     funReloj.horas[funReloj.horas.findIndex(i => i.codigo === 4)].horas,
            relojHorasNocturnas:  funReloj.horas[funReloj.horas.findIndex(i => i.codigo === 6)].horas,
            marcasHorasComunes:   funCalculado.horas[funReloj.horas.findIndex(i => i.codigo === 2)].horas,
            marcasHorasDobles:    funCalculado.horas[funReloj.horas.findIndex(i => i.codigo === 4)].horas,
            marcasHorasNocturnas: funCalculado.horas[funReloj.horas.findIndex(i => i.codigo === 6)].horas,
            sector: funcPadron.sector!,
            nombres: funcPadron.nombres,
            apellidos: funcPadron.apellidos

          })
      }
    });

    return horas;
  }
}
