import { Component } from '@angular/core';
import { ControlUsuariosService } from 'src/app/52_SIR.ControlUsuarios/control-usuarios.service';
import { Usuario } from 'src/app/52_SIR.ControlUsuarios/models/usuario.interface';
import { Modal } from 'src/app/shared/models/modal.interface';
import { EmailService } from 'src/app/shared/services/email.service';
import { ModalControlService } from 'src/app/shared/services/modal-control.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  nombreUsuario!: HTMLInputElement | null;
  existeUsuario: boolean = false;

  mod: Modal = {
    titulo: '',
    mensaje: '',
    estado: false
  }

  visible: boolean = false;

  constructor(
    private navigationService: NavigationService,
    private userService: ControlUsuariosService,
    private modalService: ModalControlService,
    private emailService: EmailService
  ) {}


  volverInicio(): void {
    this.navigationService.navegar('principal');
  }

  private estanDatosCargados(): boolean {
    this.nombreUsuario = <HTMLInputElement>document.getElementById('nombreUsuario'); 
    return this.nombreUsuario!.value != '';
  }

   public enviarSolicitudCambioContrasenia(): void {
    if (this.estanDatosCargados()){
      this.enviarSolicitud(this.nombreUsuario!.value);
      
    }
    else {
      this.mod = {
        titulo: "Faltan datos",
        mensaje: "Debes proporcionar el nombre de usuario para cambiar la contraseña.",
        estado: false
      };
      this.cambiarVisibilidad(true);
    }
         

  }

  private enviarSolicitud(nombreUsuario: string) {
    this.userService.obtenerUsuarioPorNombre(nombreUsuario).subscribe((data: Usuario[]) => {
      this.existeUsuario = data[0] != undefined && data[0].nombre_usuario != "";

      if (!this.existeUsuario) {
        this.mod = {
          titulo: "Usuario inexistente",
          mensaje: "El nombre de usuario ingresado no es válido. Verifíquelo e ingréselo nuevamente.",
          estado: false
        }
        this.cambiarVisibilidad(true);
      }
      else {
        this.emailService.enviarEmailPassword(nombreUsuario) 
      }
    });

    this.cambiarVisibilidad(false);
  }


  cambiarVisibilidad(visibilidad: boolean): void {
    this.visible = visibilidad;
    this.modalService.visible = visibilidad;
  }

  goBack(): void {
    this.navigationService.navegar('');
  }
}
