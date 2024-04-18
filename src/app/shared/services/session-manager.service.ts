import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Usuario } from 'src/app/52_SIR.ControlUsuarios/models/usuario.interface';
import { ActualUser } from '../models/actualuser.interface';
import { MenuItem } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class SessionManagerService {

  constructor(
    private storage: SessionStorageService,
  ) { }


  public getStorage(): ActualUser {
    return this.storage.retrieve('actualUser');
  }

  public setStorage(key: string, user: Usuario) {
    this.storage.store(key, user);
  }

  public clearStorage(key: string): void {
    this.storage.clear(key);
  }

  public setMenu(key: string, menu: MenuItem[]) {
    this.storage.store(key, menu);
  }

  public getMenu(): MenuItem[] {
    return this.storage.retrieve('menuItems');
  }
}
