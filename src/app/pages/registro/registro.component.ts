import { Component, OnInit } from '@angular/core';
import { Modal } from 'src/app/shared/models/modal.interface';
import { Perfil } from 'src/app/shared/models/perfil.interface';
import { Solicitud } from 'src/app/shared/models/solicitud.interface';
import { EmailService } from 'src/app/shared/services/email.service';
import { ModalControlService } from 'src/app/shared/services/modal-control.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { PerfilesService } from 'src/app/shared/services/perfiles.service';
import { MessageService } from 'primeng/api';
import { delay } from 'rxjs';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  providers: [MessageService],
})
export class RegistroComponent implements OnInit {
  sectores: Perfil[] = [];
  nombreSectores: string[] = [];
  sectorSeleccionado: string = '';
  solicitud!: Solicitud;
  nombre!: HTMLInputElement | null;
  apellido!: HTMLInputElement | null;
  nombreUsuario!: HTMLInputElement | null;
  sector!: HTMLSelectElement | null;
  existeUsuario: boolean = false;

  modal: Modal = {
    titulo: '',
    mensaje: '',
    estado: false,
  };

  visible: boolean = false;

  constructor(
    private perfilesService: PerfilesService,
    private modalService: ModalControlService,
    private navigationService: NavigationService,
    private mailService: EmailService,
    private msgService: MessageService
  ) {}

  ngOnInit(): void {
    this.getPerfiles();
  }

  public getPerfiles(): void {
    this.perfilesService.getPerfilesList().subscribe((data) => {
      this.sectores = data;
      if (this.sectores != null && this.sectores != undefined) {
        this.sectores.forEach((sector) => {
          if (sector.idPerfil != 1)
            this.nombreSectores.push(sector.nombrePerfil);
        });

        this.nombreSectores.sort((a, b) => {
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          return 0;
        });
      }
    });
  }

  private estanDatosCargados(): boolean {
    this.nombre = <HTMLInputElement>document.getElementById('nombre');
    this.apellido = <HTMLInputElement>document.getElementById('apellido');
    this.nombreUsuario = <HTMLInputElement>document.getElementById('email');
    this.sector = <HTMLSelectElement>document.getElementById('sector');

    return (
      this.nombre != null &&
      this.nombre.value != '' &&
      this.apellido != null &&
      this.apellido.value != '' &&
      this.nombreUsuario != null &&
      this.nombreUsuario.value != '' &&
      this.sector != null &&
      this.sector.innerText != ''
    );
  }

  private crearSolicitud(): Solicitud {
    this.solicitud = {
      nombre: this.nombre!.value,
      apellido: this.apellido!.value,
      nombreUsuario: this.nombreUsuario!.value,
      sector: this.sector!.innerText,
    };

    return this.solicitud;
  }

  public enviarNuevaSolicitud(): void {
    if (this.estanDatosCargados()) {
      if (this.enviarSolicitudPorEmail(this.crearSolicitud())) {
        this.showEmailEnviado();
        this.borrarData();
        setTimeout(() => {this.goBack()}, 5000);
      }
    } else {
      {
        this.modal = {
          titulo: 'Faltan datos',
          mensaje: 'Debes proporcionar toda la información solicitada.',
          estado: false,
        };

        this.cambiarVisibilidad(true);
      }
    }
  }

  private enviarSolicitudPorEmail(solicitud: Solicitud): boolean {
    let resultado: boolean = false;
    this.mailService.enviarEmailNuevoUsuario(solicitud).subscribe((res) => {
      resultado = res;
    });

    return resultado;
  }

  cambiarVisibilidad(visibilidad: boolean): void {
    this.visible = visibilidad;
    this.modalService.visible = visibilidad;
  }

  goBack(): void {
    this.navigationService.navegar('');
  }

  borrarData(): void {
    this.nombre = <HTMLInputElement>document.getElementById('nombre');
    this.apellido = <HTMLInputElement>document.getElementById('apellido');
    this.nombreUsuario = <HTMLInputElement>document.getElementById('email');
    this.sector = <HTMLSelectElement>document.getElementById('sector');

    this.nombre.value = '';
    this.apellido.value = '';
    this.nombreUsuario.value = '';
    this.sector.value = '';
  }

  showEmailEnviado(): void {
    this.msgService.add({
      severity: 'success',
      summary: 'Listo',
      detail: 'La solicitud fue enviada correctamente. Serás redirigido a la página de inicio en.'
    });
  }

  showEmailNoEnviado(): void {
    this.msgService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'La solicitud no pudo ser enviada. Reinténtelo.',
    });
  }

}
