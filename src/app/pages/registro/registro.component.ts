import { Component, OnInit} from '@angular/core';
import { ControlUsuariosService } from 'src/app/52_SIR.ControlUsuarios/control-usuarios.service';
import { Usuario } from 'src/app/52_SIR.ControlUsuarios/models/usuario.interface';
import { Modal } from 'src/app/shared/models/modal.interface';
import { Perfil } from 'src/app/shared/models/perfil.interface';
import { Solicitud } from 'src/app/shared/models/solicitud.interface';
import { ModalControlService } from 'src/app/shared/services/modal-control.service';
import { PerfilesService } from 'src/app/shared/services/perfiles.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  sectores: Perfil[] = [];
  nombreSectores: string[] = [];
  sectorSeleccionado: string = "";
  solicitud!: Solicitud;
  nombre!: HTMLInputElement | null;
  apellido!: HTMLInputElement | null;
  nombreUsuario!: HTMLInputElement | null;
  sector!: HTMLSelectElement | null;
  existeUsuario: boolean = false;

  modal: Modal = {
    titulo: '',
    mensaje: '',
    estado: false
  }
  
  visible:boolean = false;

  constructor(
    private perfilesService: PerfilesService,
    private userService: ControlUsuariosService,
    private modalService: ModalControlService
  ) {

   
  }

  ngOnInit(): void {
    this.getPerfiles();
  }

  public getPerfiles(): void {
    this.perfilesService.getPerfilesList().subscribe( data => {
      this.sectores = data;
      if(this.sectores != null && this.sectores != undefined)
      {
        this.sectores.forEach(sector => {
          if(sector.idPerfil != 1)
            this.nombreSectores.push(sector.nombrePerfil);
        });
      }
    });
  }

  private estanDatosCargados(): boolean {
    this.nombre = <HTMLInputElement>document.getElementById('nombre');
    this.apellido = <HTMLInputElement>document.getElementById('apellido');
    this.nombreUsuario = <HTMLInputElement>document.getElementById('nombreUsuario');
    this.sector = <HTMLSelectElement>document.getElementById('sector');
  
    return  this.nombre != null && this.nombre.value != "" &&
            this.apellido != null && this.apellido.value != "" &&
            this.nombreUsuario != null && this.nombreUsuario.value != "" &&
            this.sector != null && this.sector.innerText != "";
  }

  private crearSolicitud(): Solicitud {
    this.solicitud = {
      nombre: this.nombre!.value,
      apellido: this.apellido!.value,
      nombreUsuario: this.nombreUsuario!.value,
      sector: this.sector!.innerText
    };

    return this.solicitud;
  }

 
  private enviarSolicitud(solicitud: Solicitud): void {
    this.userService.obtenerUsuarioPorNombre(this.solicitud.nombreUsuario).subscribe( (data: Usuario[]) => {
      this.existeUsuario = data[0] != undefined && data[0].nombre_usuario != "";

      if(this.existeUsuario)
      {
       this.modal =  {
          titulo: "Usuario existente",
          mensaje: "El nombre de usuario que elegiste ya está en uso.\nPor favor elige otro.",
          estado: false
        };

        this.cambiarVisibilidad(true);
      }
      else {
        this.enviarSolicitudPorEmail();
      }
    });
  }

  private enviarSolicitudPorEmail(): void {
    this.userService.enviarEmail();
  }

  public enviarNuevaSolicitud(): void {
    if(this.estanDatosCargados()){
      this.enviarSolicitud(this.crearSolicitud());
    }
    else {
      {
        this.modal =  {
          titulo: "Faltan datos",
          mensaje: "Debe proporcionar toda la información solicitada.",
          estado: false
        };

        this.cambiarVisibilidad(true);
      }
    }
  }

  cambiarVisibilidad(visibilidad: boolean): void {
    this.visible = visibilidad;
    this.modalService.visible = visibilidad;
  }
}
