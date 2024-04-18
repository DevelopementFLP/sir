import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import * as xls from 'xlsx';
import { PadronFuncionario } from '../../interfaces/PadronFuncionario.interface';
import { map } from 'rxjs';
import { PadronJornalero } from '../../interfaces/PadronJornalero.interface';
import { ControlHorasService } from '../../services/control-horas.service';

@Component({
  selector: 'app-single-file-uploader',
  templateUrl: './single-file-uploader.component.html',
  styleUrls: ['./single-file-uploader.component.css']
})
export class SingleFileUploaderComponent {

  constructor(
    private ref: DynamicDialogRef,
    private controlHorasService: ControlHorasService
  ) {}

  files: File[] = [];
  excelData:  any;

  seleccionarArchivo(event: any): void {
    this.files.push(event.files[0]);
  }

  eliminarArchivo(): void {
   this.files = [];
  }

  actualizarRegistros(): void {
    const promises: Promise<void>[] = [];
    promises.push(this.updatePadron());
    
    Promise.all(promises).then(() => {
      let padronArray: PadronJornalero[] = [];

      try {
        padronArray = this.excelData.map((item: {[key: string]: any}) => ({
          nroFuncionario:   item['Func.'],
          apellidos:        item['Apellidos'],
          nombres:          item['Nombres'],
          sector:           item['Sector'],
          tipoRemuneracion: item['Tipo Remuneracion'],
          horasTrabajadas:  item['Hrs. Trabajadas'],
          diasTrabajados:   item['Dias Trabajados'],
          rowNumber:        item['__rowNum__'] 
        }));
        
        const padronFuncionarios: PadronFuncionario[] = padronArray.map( funcionario => {         
          const nuevoFuncionario: PadronFuncionario = {
              id: 0, 
              nroFuncionario:     funcionario.nroFuncionario.toString(),
              apellidos:          funcionario.apellidos,
              nombres:            funcionario.nombres,
              sector:             funcionario.sector,
              tipoRemuneracion:   funcionario.tipoRemuneracion,
              horasTrabajadas:    funcionario.horasTrabajadas,
              diasTrabajados:     funcionario.diasTrabajados,
              ultimaModificacion: new Date()
          };    
          return nuevoFuncionario;
      });
        
      if (padronFuncionarios.length > 0) {
        this.controlHorasService.postPadronFuncionarios(padronFuncionarios).subscribe({
          next: (response) => {
            console.log(response); // Manejar el siguiente valor emitido por el Observable
          },
          error: (error) => {
            console.error('Error al enviar la solicitud:', error); // Manejar errores emitidos por el Observable
          },
          complete: () => {
            console.log('Observable completado'); // Manejar la finalización del Observable (opcional)
          }
        });
      }
      } catch (error) {
        console.log(error);
      }
    }).catch(() => {
      console.log('Hubo un error')
    });

    this.ref.close('Actualizado');
  }

  private updatePadron(): Promise<void> {
    return new Promise((resolve, reject) => {
      let fr = new FileReader();
      fr.readAsArrayBuffer(this.files[0]);
      fr.onload = () => {
        let data = fr.result;
        let workbook = xls.read(data, {type: 'array'});
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        this.excelData = xls.utils.sheet_to_json(sheet, {raw: true});
        const _first = Object.keys(this.excelData[0]);
       
        if(_first != null && _first != undefined){
          if(_first[0] === 'Func.')
            resolve();
          else {
            console.log("El archivo no cumple con los requerimientos.");
            reject();  
          }
        } else {
          console.log("El archivo no cumple con los requerimientos.");
          reject();
        }
      }
    });
  }
}
