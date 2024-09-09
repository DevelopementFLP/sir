import { Data } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


import { AbastoService } from '../../Services/AbastoService.service';
import { UtilidadesService } from 'src/app/09_SIR.Dispositivos.Apps/Utilidades/UtilidadesService.service';
import { LecturaDeAbastoDTO } from '../../Interfaces/LecturaDeAbastoDTO';
import { ModalAbastoComponent } from './ModalFormularioAbasto/modal-abasto.component';
import { ConfiguracionesDTO } from '../../Interfaces/ConfiguracionesDTO';
import { GetInformacionService } from '../../helpers/Data-Local-Storage/getInformacion.service';

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
  loadConfiguraciones() {
    try {
      this.parametrosDeConfiguracion = this._configuracionService.cargarConfiguraciones();
    } catch (e) {
      this.GetConfiguraciones(); // Intentar obtener desde la API si no hay en localStorage
    }
  }


  // Establecer configuraciones en variables del componente
  setConfiguraciones() {
    this.usuarioDeEntrada = this.parametrosDeConfiguracion.find(p => p.idConfiguracion == 3)?.parametroDeConfiguracion!;
    this.usuarioDeSalida = this.parametrosDeConfiguracion.find(p => p.idConfiguracion == 4)?.parametroDeConfiguracion!;
    this.operacionEntrada = this.parametrosDeConfiguracion.find(p => p.idConfiguracion == 5)?.parametroDeConfiguracion!;
    this.operacionSalida = this.parametrosDeConfiguracion.find(p => p.idConfiguracion == 6)?.parametroDeConfiguracion!;
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

   //Tabla
  dataListaDeLecturas = new MatTableDataSource(this.dataInicioLecturasDeMedia);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;  


  ngAfterViewInit(): void {
    this.dataListaDeLecturas.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaDeLecturas.filter = filterValue.trim().toLocaleLowerCase();
  }

  // Obtiene y filtra las lecturas según el tipo de operación del usuario
  GetListaDeLecturas() {

    this._abastoService.GetLecturasDeAbasto().subscribe({
      next: (data) => {
        if (data.esCorrecto && data.resultado.length > 0) {
          this.dataInicioLecturasDeMedia = data.resultado; 

          // Filtrar los datos segun el usuario logueado
          if (this.usuarioLogueado == this.usuarioDeEntrada || this.usuarioLogueado == this.usuarioDeSalida) {
            this.dataListaDeLecturas.data = this.dataInicioLecturasDeMedia.filter(lectura => lectura.usuarioLogueado === this.usuarioLogueado);        
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


  async InsertarLecturaDeMedia(idMedia: string) {
    if(this.usuarioLogueado == this.usuarioDeSalida){
      try {
        const respuesta = await this._abastoService.GetLecturaDeAbastoFiltrada(idMedia).toPromise();
        if(respuesta?.esCorrecto){
          idMedia = respuesta.resultado.lecturaDeMedia;
        }
      } catch (error) {
        this._utilidadesServicicio.mostrarAlerta('No hay una entrada con ese QR', 'Error');
        return; 
      }
    }

    this._abastoService.createLecturaDeMediaAbasto(idMedia, this.valorDeOperacion, this.usuarioLogueado).subscribe({
      next: (data) => {
        if (data.esCorrecto) {
          this.codigoRecibido = ''; 
          this.GetListaDeLecturas();           
        } else {
          this._utilidadesServicicio.mostrarAlerta('No se puede insertar los datos', 'Error');
          this.codigoRecibido = '';
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


  ngOnInit(): void {
    this.GetConfiguraciones();    
    this.GetListaDeLecturas();    
  }
}

