import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


import { AbastoService } from '../../Services/AbastoService.service';
import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilidades/UtilidadesService.service';
import { LecturaDeAbastoDTO } from '../../Interfaces/LecturaDeAbastoDTO';
import { ModalAbastoComponent } from './ModalFormularioAbasto/modal-abasto.component';
import { ConfiguracionAbastoService } from '../../Services/configuracionAbasto.service';
import { ConfiguracionesDTO } from '../../Interfaces/configuracionesDTO';

@Component({
  selector: 'app-reporte-faena',
  templateUrl: './formulario-abasto.component.html',
  styleUrls: ['./formulario-abasto.component.css']
})
export class FormularioAbastoComponent {

  //Configuraciones
  public usuarioLogueado: string = "";
  public parametrosDeConfiguracion: ConfiguracionesDTO[] = []; 
  public usuarioDeEntrada: string = "";
  public usuarioDeSalida: string = "";
  public operacionEntrada: string = ""
  public operacionSalida: string = ""

  //Auxiliares
  public codigoRecibido: string = '';
  public columnasTablaDeAbasto: string[] = ['lecturaDeScaner', 'idAnimal', 'secuencia', 'operacion']
  public valorDeOperacion: string = ""
  public totalLecturas: number = 0


   //Tipos de Datos
   dataInicioLecturasDeMedia: LecturaDeAbastoDTO[] = [];

  constructor(
    private dialog: MatDialog,
    private _utilidadesServicicio: UtilidadesService,
    private _lecturaDeMediaService : AbastoService,
    private _configuracionesAbasto: ConfiguracionAbastoService
  ){}

  // Obtener configuraciones desde la API y guardarlas en localStorage
  GetConfiguraciones() {
    this._configuracionesAbasto.GetParametrosSeccionAbasto().subscribe({
      next: (data) => {
        this.parametrosDeConfiguracion = data.resultado;
        localStorage.setItem('configuraciones', JSON.stringify(this.parametrosDeConfiguracion));
        this.setConfiguraciones();
      },
      error: (e) => {
        this._utilidadesServicicio.mostrarAlerta("Error al obtener los datos", "Error");
      }
    });
  }

   // Cargar configuraciones desde localStorage o API
   loadConfiguraciones() {
    const configuracionDesdeLocalStorage = localStorage.getItem('configuraciones');
    if (configuracionDesdeLocalStorage) {
      this.parametrosDeConfiguracion = JSON.parse(configuracionDesdeLocalStorage);
      this.setConfiguraciones();
    } else {
      this.GetConfiguraciones();
    }
  }

  // Establecer configuraciones en variables del componente
  setConfiguraciones() {
    this.usuarioDeEntrada = this.parametrosDeConfiguracion.find(p => p.idConfiguracion == 3)?.parametroDeConfiguracion!;
    this.usuarioDeSalida = this.parametrosDeConfiguracion.find(p => p.idConfiguracion == 4)?.parametroDeConfiguracion!;
    this.operacionEntrada = this.parametrosDeConfiguracion.find(p => p.idConfiguracion == 5)?.parametroDeConfiguracion!;
    this.operacionSalida = this.parametrosDeConfiguracion.find(p => p.idConfiguracion == 6)?.parametroDeConfiguracion!;
  }

   //Tabla
  dataListaDeLecturas = new MatTableDataSource(this.dataInicioLecturasDeMedia);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;  

  ngOnInit(): void {
    this.establecerOperacionValor();
    this.GetListaDeLecturas();
    this.GetConfiguraciones();
  }

  ngAfterViewInit(): void {
    this.dataListaDeLecturas.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaDeLecturas.filter = filterValue.trim().toLocaleLowerCase();
  }

   //Usuario Logueado
   establecerOperacionValor() {
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

// Obtiene y filtra las lecturas según el tipo de operación del usuario
GetListaDeLecturas() {
  this._lecturaDeMediaService.GetLecturasDeAbasto().subscribe({
    next: (data) => {
      if (data.esCorrecto && data.resultado.length > 0) {
        this.dataInicioLecturasDeMedia = data.resultado; // Asignar los datos recibidos

        // Filtrar los datos segun el usuario logueado
        if (this.usuarioLogueado == this.usuarioDeEntrada) {
          this.dataListaDeLecturas.data = this.dataInicioLecturasDeMedia.filter(lectura => lectura.operacion == this.operacionEntrada);
        } else if (this.usuarioLogueado == this.usuarioDeSalida) {
          this.dataListaDeLecturas.data = this.dataInicioLecturasDeMedia.filter(lectura => lectura.operacion == this.operacionSalida);
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


  InsertarLecturaDeMedia(idMedia: string) {
    this._lecturaDeMediaService.createLecturaDeMediaAbasto(idMedia, this.valorDeOperacion).subscribe({
      next: (data) => {
        if (data.esCorrecto) {
          this.GetListaDeLecturas(); 
          this.codigoRecibido = ''; 
        } else {
          this._utilidadesServicicio.mostrarAlerta('No se puede insertar los datos', 'Error');
        }
      },
      error: (e) => {
        console.error(e);
        this._utilidadesServicicio.mostrarAlerta('Error al enviar el código QR', 'Error');
      }
    });
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
      }
    });
  }
}

