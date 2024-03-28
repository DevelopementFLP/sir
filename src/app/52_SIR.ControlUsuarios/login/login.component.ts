import { Component, ElementRef, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


import { ControlUsuariosService } from '../control-usuarios.service';
import { LoginInterface } from '../models/loginUsuario.interface';
import { Usuario } from '../models/usuario.interface';
import { SessionManagerService } from 'src/app/shared/services/session-manager.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ActualUser } from 'src/app/shared/models/actualuser.interface';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./media_queries.css', './login.component.css']
})
export class LoginComponent {

  constructor(
    private userService: ControlUsuariosService,
    private sessionManagerService: SessionManagerService,
    private navigationService: NavigationService
    ) {

      this.userStored = this.sessionManagerService.getStorage();

      if(this.userStored != null) {
        this.navigationService.navegar('principal');
       }
    }

  @ViewChild('txtUserName') txtUserName!: ElementRef<HTMLInputElement>;
  @ViewChild('txtPassword') txtPassword!: ElementRef<HTMLInputElement>;

  userStored: ActualUser | undefined;
  hide: boolean = true;
  usuarioObtenido: Usuario[] = [];

  userData = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  IniciarSesion() {      
      var datosUsuario: LoginInterface = {
        nombreUsuario: this.txtUserName.nativeElement.value,
        contrasenia: this.txtPassword.nativeElement.value
      };

      this.userService.obtenerUsuarioPorNombre(datosUsuario.nombreUsuario!)
      .subscribe( resp => {
        this.usuarioObtenido = resp;
        if(this.usuarioObtenido.length == 0)
          this.userData.controls.userName.setErrors({'invalid': true});
        else {
          if(this.usuarioObtenido[0].contrasenia != datosUsuario.contrasenia)
            this.userData.controls.password.setErrors({'invalid': true});
          else
          {
            this.sessionManagerService.setStorage('actualUser', this.usuarioObtenido[0]);
            this.navigationService.navegar('principal');
            
          }
        }
      });

  }

  checkUserName() : string {
    return this.userData.controls.userName.hasError('required') ? 'Debes ingresar un nombre de usuario' :
    this.userData.controls.userName.hasError('invalid') ? 'No es un usuario válido' :
    '';
  }

  checkPassword() : string {
    return this.userData.controls.password.hasError('required') ? 'Debes ingresar tu contraseña' :
    this.userData.controls.password.hasError('invalid') ? 'La contraseña no es válida' :
    '';
  }

};