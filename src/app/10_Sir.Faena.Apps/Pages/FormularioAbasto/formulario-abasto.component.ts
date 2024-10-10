
import { Component, ViewChild, ElementRef  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


import { AbastoService } from '../../Services/AbastoService.service';
import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilities/UtilidadesService.service';
import { LecturaDeAbastoDTO } from '../../Interfaces/LecturaDeAbastoDTO';
import { ModalAbastoComponent } from './ModalFormularioAbasto/modal-abasto.component';
import { ConfiguracionesDTO } from '../../Interfaces/ConfiguracionesDTO';
import { GetInformacionService } from '../../helpers/Data-Local-Storage/getInformacion.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte-faena',
  templateUrl: './formulario-abasto.component.html',
  styleUrls: ['./formulario-abasto.component.css']
})
export class FormularioAbastoComponent {

  @ViewChild('lecturaInput') lecturaInput!: ElementRef;

  //Configuraciones
  public usuarioLogueado: string = "";
  public parametrosDeConfiguracion: ConfiguracionesDTO[] = []; 
  public usuarioDeEntrada: string = "";
  public usuarioDeSalida: string = "";
  public operacionEntrada: string = ""
  public operacionSalida: string = ""
  public ultimoSecuencialEscaneado: string = "";
  public ultimoLadoEscaneado: string = "";

  //Auxiliares
  public codigoRecibido: string = '';
  public columnasTablaDeAbasto: string[] = ['lecturaDeScaner', 'idAnimal', 'secuencia', 'operacion', 'fechaDeRegistro', 'acciones']
  public valorDeOperacion: string = ""
  public totalLecturas: number = 0


  //Tipos de Datos
  dataInicioLecturasDeMedia: LecturaDeAbastoDTO[] = [];

  constructor(
    private dialog: MatDialog,
    private _utilidadesServicicio: UtilidadesService,
    private _abastoService : AbastoService,
    private _configuracionService: GetInformacionService
  ){}

   // Obtener configuraciones desde el helper
   async GetConfiguraciones() {
    try {
      this.parametrosDeConfiguracion = await this._configuracionService.obtenerConfiguraciones();
      this.loadConfiguraciones();
      this.setConfiguraciones();
      this.establecerOperacionValor();
    } catch (e) {
      // El error lo maneje en el helper
    }
  }

  // Cargar configuraciones desde localStorage o API
  public loadConfiguraciones() {
    try {
      this.parametrosDeConfiguracion = this._configuracionService.cargarConfiguraciones();
    } catch (e) {
      this.GetConfiguraciones(); // Intentar obtener desde la API si no hay en localStorage
    }
  }


  // Establecer configuraciones en variables del componente
  public setConfiguraciones() {
    this.usuarioDeEntrada = this.parametrosDeConfiguracion.find(p => p.idConfiguracion == 3)?.parametroDeConfiguracion!;
    this.usuarioDeSalida = this.parametrosDeConfiguracion.find(p => p.idConfiguracion == 4)?.parametroDeConfiguracion!;
    this.operacionEntrada = this.parametrosDeConfiguracion.find(p => p.idConfiguracion == 5)?.parametroDeConfiguracion!;
    this.operacionSalida = this.parametrosDeConfiguracion.find(p => p.idConfiguracion == 6)?.parametroDeConfiguracion!;
  }

   //Usuario Logueado
   public establecerOperacionValor() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('actualUser') || '{}');
    this.usuarioLogueado = usuarioLogueado.nombre_usuario;
    if (usuarioLogueado.nombre_usuario == this.usuarioDeEntrada)
    {
      this.valorDeOperacion = this.operacionEntrada; // Valor de operación para el usuario
    }
    else if (usuarioLogueado.nombre_usuario == this.usuarioDeSalida)
    {
      this.valorDeOperacion = this.operacionSalida;
    }
    else
    {
      this.valorDeOperacion = 'Operación desconocida';
    }   
  }

   //Tabla
  dataListaDeLecturas = new MatTableDataSource(this.dataInicioLecturasDeMedia);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;  


  ngAfterViewInit(): void {
    this.dataListaDeLecturas.paginator = this.paginacionTabla;
  }

  public aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaDeLecturas.filter = filterValue.trim().toLocaleLowerCase();
  }

  // Obtiene y filtra las lecturas según el tipo de operación del usuario
  public GetListaDeLecturas() {

    this._abastoService.GetLecturasDeAbasto().subscribe({
      next: (data) => {
        if (data.esCorrecto && data.resultado.length > 0) {
          this.dataInicioLecturasDeMedia = data.resultado; 

          // Filtrar los datos segun el usuario logueado
          if (this.usuarioLogueado == this.usuarioDeEntrada || this.usuarioLogueado == this.usuarioDeSalida) {
            this.dataListaDeLecturas.data = this.dataInicioLecturasDeMedia.filter(lectura => lectura.usuarioLogueado === this.usuarioLogueado);   
            this.ultimoSecuencialEscaneado = data.resultado[0].secuencial;    
            this.ultimoLadoEscaneado = data.resultado[0].idAnimal.substring(12) 
          } else {          
            this.dataListaDeLecturas.data = this.dataInicioLecturasDeMedia;
          }

          this.totalLecturas = this.dataListaDeLecturas.data.length;
        } else {
          this._utilidadesServicicio.mostrarAlerta("No se encontraron datos", "Información");
        }
      },
      error: (e) => {
        console.error(e);
        this._utilidadesServicicio.mostrarAlerta("Error al obtener los datos", "Error");
      }
    });
  }


  public async InsertarLecturaDeMedia(idMedia: string) {
    
    if(idMedia.length <= 39){
      if(this.usuarioLogueado == this.usuarioDeSalida){
        try {
          const respuesta = await this._abastoService.GetLecturaDeAbastoFiltrada(idMedia).toPromise();
          if(respuesta?.esCorrecto){
            idMedia = respuesta.resultado.lecturaDeMedia;
          }
        } catch (error) {
          this._utilidadesServicicio.mostrarAlerta('No hay una entrada con ese QR', 'Error');
          this.codigoRecibido = '';
          return; 
        }
      }

      this._abastoService.createLecturaDeMediaAbasto(idMedia, this.valorDeOperacion, this.usuarioLogueado).subscribe({
        next: (data) => {
          if (data.esCorrecto) {
            this.codigoRecibido = ''; 
            this.GetListaDeLecturas();           
          } else {
            this._utilidadesServicicio.mostrarAlerta('Dato Duplicado o Error de lectura', 'Error');
            this.codigoRecibido = '';
          }
        },
        error: (e) => {
          console.error(e);
          this._utilidadesServicicio.mostrarAlerta('Error al enviar el código QR', 'Error');
        }
      });
    }else{
      this._utilidadesServicicio.mostrarAlerta("La lectura no puede exceder los 39 caracteres", "Error")
      this.codigoRecibido = '';
      return;
    }
      
  }

  ubicarUltimaFilaInsertada(row: LecturaDeAbastoDTO): boolean {
    return this.dataInicioLecturasDeMedia.length > 0 &&
           row === this.dataInicioLecturasDeMedia[0];
  }

  abrirModalDeLecturasAbasto() {
    const dialogRef = this.dialog.open(ModalAbastoComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.GetListaDeLecturas();
        this.setFocus();
      }
    });
  }

  public eliminarLectura(element: any): void {
    const idAnimal = element.idAnimal; // Asegúrate de que idAnimal está disponible en el elemento
  
    Swal.fire({
      title: '¿Desea eliminar la lectura?',
      text: `ID Animal: ${idAnimal}`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._abastoService.DeleteLecturaDeAbasto(idAnimal).subscribe({
          next: (data) => {
            if (data.esCorrecto) {
              const index = this.dataListaDeLecturas.data.indexOf(element);
              if (index >= 0) {
                this.dataListaDeLecturas.data.splice(index, 1);
                this._utilidadesServicicio.mostrarAlerta('Lectura eliminada', 'Éxito');
                this.GetListaDeLecturas();
                this.setFocus();
              }
            } else {
              this._utilidadesServicicio.mostrarAlerta('Error al eliminar la lectura', 'Error');
            }
          },
          error: (error) => {
            this._utilidadesServicicio.mostrarAlerta('Error en la solicitud', 'Error');
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.GetConfiguraciones();    
    this.GetListaDeLecturas();    
    this.setFocus()
  }

  private setFocus(): void {
    setTimeout(() => {
      this.lecturaInput.nativeElement.focus();
    }, 0);
  }
}

