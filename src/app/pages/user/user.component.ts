import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { ControlUsuariosService } from 'src/app/52_SIR.ControlUsuarios/control-usuarios.service';
import { Usuario } from 'src/app/52_SIR.ControlUsuarios/models/usuario.interface';

import { NavigationService } from 'src/app/shared/services/navigation.service';
import { SessionManagerService } from 'src/app/shared/services/session-manager.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [MessageService]
})
export class UserComponent implements OnInit {

  currentUser!: Usuario;
  isPasswordVisible: boolean = false;
  actualPassword: string = '';
  newPassword: string = '';
  repeatPassword: string = '';


  actualUserstr = localStorage.getItem('actualUser');
  actualUser!: Usuario;
  
  constructor(
    private smService: SessionManagerService,
    private navigation: NavigationService,
    private messageService: MessageService,
    private userService: ControlUsuariosService
  ) {}
  
  ngOnInit(): void {
    this.currentUser = this.smService.getStorage(); 
    this.actualUserstr = localStorage.getItem('actualUser'); 
    this.actualUser = this.smService.parseUsuario(this.actualUserstr!);
  }

  goBack(): void {
    this.navigation.navegar('');
  }

  private checkPassword(): boolean {
    return this.actualPassword === this.currentUser.contrasenia;
  }

  save(): void {
    if(!this.checkPassword()) {
      this.showError('La contraseña actual no es correcta.');
      return;
    }

    if(!this.isValidLength()){
      this.showError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if(!this.areEqualsPasswords()) {
      this.showError('Las contraseñas no coinciden.');
      return;
    }

    this.userService.cambiarContrasenia(this.newPassword, this.currentUser.id_usuario)
      .pipe(
        catchError( error => {
          this.showError("No se pudo cambiar la contraseña.");
          return throwError('Ocurrión un error al intentar cambiar la contraseña');
        })
      )
      .subscribe( ok => {
        this.showOk("La cotraseña se cambió correctamente.");
        this.actualPassword = '';
        this.newPassword = '';
        this.repeatPassword = '';
      })
  }

  private isValidLength(): boolean {
    return this.newPassword.length >= 6;
  }

  private areEqualsPasswords(): boolean {
    return this.newPassword === this.repeatPassword;
  }

  private showError(message: string) {
    this.messageService.add({ severity: 'custom-error', summary: 'Error', detail: message });
  }
  
  private showOk(message: string) {
    this.messageService.add({ severity: 'custom-success', summary: 'Todo bien', detail: message });
  }

}
