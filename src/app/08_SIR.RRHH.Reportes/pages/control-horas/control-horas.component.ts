import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as xls from 'xlsx';
import { Horas } from '../../interfaces/Horas.interface';
import { Marcas } from '../../interfaces/Marcas.interface';
import { PadronFuncionario } from '../../interfaces/PadronFuncionario.interface';
import { ControlHorasService } from '../../services/control-horas.service';
import { formatDate } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
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
  providers: [DialogService, MessageService, ConfirmationService],
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
    public messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.reset();
    try{
      this.getPadronData();
    } catch (error) {
      this.mostrarMensaje('Hubo un rror al intentar obterner los datos.', 'Hubo un error', 'pi pi-exclamation-triangle');
    }
  }
  
  reset(): void {
    this.isSettingsVisible = true;
    this.isResultsVisible = false;
    this.isProcessVisible = false;
    this.isSeeFilesVisible = false;
    if(this.fileUpload){
      this.fileUpload.clear();
    }
    this.horasAComparar = [];
    this.dataToPrint = {
      incidencias: [],
      inconsistencias: []
    };
    this.horasIncidencias = {
      horas: [],
      incidencias: []
    };
    
  }

  private getPadronData() {
    try {
      this.padron = [];
      this.controlHorasService.getPadronFuncionarios().subscribe(
        data => {
          this.padron = data;
          this.lastUpdate = formatDate(this.padron[0].ultimaModificacion, "dd-MM-yyyy", "es-UY");
        }
      );
    } catch(error: any) {
      this.mostrarMensaje('Hubo un error al intentar obtener los datos del padrón.', 'Hubo un error', 'pi pi-exclamation-triangle');
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
        else
          this.mostrarMensaje('El archivo seleccionado ya fue cargado.', 'Archivo duplicado', 'pi pi-exclamation-triangle');
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
      this.mostrarMensaje('Alguno de los archivos no fue proporcionado. Verificar.', 'Error en archivos', 'pi pi-exclamation-triangle');
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
              this.mostrarMensaje('Alguno de los archivos no cumple con la estructura esperada. Verificar.', 'Error en archivos', 'pi pi-exclamation-triangle');
              reject();
              break;
            }
        } else {
          this.mostrarMensaje('Alguno de los archivos no cumple con la estructura esperada. Verificar.', 'Error en archivos', 'pi pi-exclamation-triangle');
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

    this.ref.onClose.subscribe((result: any) => {
      if (result !== undefined) {
        setTimeout(() => {
          this.controlHorasService.getPadronFuncionarios().subscribe(data => {
           this.padron = data;
           this.lastUpdate = formatDate(data[0].ultimaModificacion, "dd-MM-yyyy", "es-UY");
          })
        }, 1000);
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

   mostrarMensaje(mensaje: string, header: string, icon: string): void {
    this.confirmationService.confirm({
      header: header,
      message: mensaje,
      icon: icon,
      rejectVisible: false,
      dismissableMask: true,
      closeOnEscape: true,
      acceptLabel: 'Aceptar',
      accept: () => {},
    })
  }

}
