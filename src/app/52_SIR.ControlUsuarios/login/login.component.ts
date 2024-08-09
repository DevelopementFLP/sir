import { Component, ElementRef, ViewChild, ViewEncapsulation, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


import { ControlUsuariosService } from '../control-usuarios.service';
import { LoginInterface } from '../models/loginUsuario.interface';
import { Usuario } from '../models/usuario.interface';
import { SessionManagerService } from 'src/app/shared/services/session-manager.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ActualUser } from 'src/app/shared/models/actualuser.interface';
import { MenuItem } from 'primeng/api';
import { DataService } from 'src/app/shared/services/data.service';
import { NavBarService } from 'src/app/shared/services/nav-bar.service';
import { Reporte } from 'src/app/shared/models/reporte.interface';
import { AccesoReporte } from '../interfaces/AccesoReporte.interface';
import { ReportesService } from 'src/app/shared/services/reportes.service';
import { map, filter } from 'rxjs';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  menuItems: MenuItem[] = [];
  reportes: AccesoReporte[] | undefined = [];

  constructor(
    private userService: ControlUsuariosService,
    private sessionManagerService: SessionManagerService,
    private navigationService: NavigationService,
    private dataService: DataService,
    private navBarService: NavBarService,
    private sessionManager: SessionManagerService,
    private reportesService: ReportesService
    ) {

      //this.userStored = this.sessionManagerService.getStorage();
      this.currentUser = this.sessionManagerService.getCurrentUser()!

      if(this.currentUser != null) {
        this.userStored = this.parseActualUser(this.currentUser);
        if(this.userStored != null)
          this.navigationService.navegar('principal');
      }

    }

  @ViewChild('txtUserName') txtUserName!: ElementRef<HTMLInputElement>;
  @ViewChild('txtPassword') txtPassword!: ElementRef<HTMLInputElement>;

  currentUser: string | null = null;
  userStored: ActualUser | undefined;
  hide: boolean = true;
  usuarioObtenido: Usuario[] = [];
  menu: MenuItem[] = [];

  userData = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  ngAfterViewInit(): void {
    if(this.txtUserName)
      this.txtUserName.nativeElement.focus();
  }

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
           
            this.dataService.getReportesPorAcceso(this.usuarioObtenido[0].id_perfil).subscribe(
              async (reportes: Reporte[]) => {
                await this.getReportes();
                this.menuItems = this.filtrarReportes(reportes);
                this.menuItems = this.navBarService.transformarAMenuItems(reportes);
                this.menuItems = this.navBarService.setExpansionState(this.menuItems);
                this.sessionManager.setMenu('menuItems', this.menuItems);
              },
            );
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

  private async getReportes(): Promise<void> {
    this.reportes =  await this.reportesService.getAccesoReportes(this.usuarioObtenido[0].id_usuario).toPromise()
  }

  private filtrarReportes(rep: MenuItem[]): MenuItem[] {
    const reportes: string[] = Array.from(new Set(this.reportes?.map(r => r.nombre_Reporte.trim())));

    if (rep.length > 0 && rep[0].items) {
        rep[0].items = rep[0].items.filter(element => {
            element.items = element.items?.filter(item => reportes.includes(item.label!.trim())) || [];
            return element.items.length > 0;
        });
    }

    return rep;
}


  private parseActualUser(jsonString: string): ActualUser {
    const jsonObject = JSON.parse(jsonString);

    const actualUser: ActualUser = {
      id_usuario: jsonObject.id_usuario,
      id_perfil: jsonObject.id_perfil,
      nombre_usuario: jsonObject.nombre_usuario,
      contrasenia: jsonObject.contrasenia,
      activo: jsonObject.activo,
      nombre_completo: jsonObject.nombre_completo,
      conf_perfiles: jsonObject.conf_perfiles
    };

    return actualUser;
  }
}