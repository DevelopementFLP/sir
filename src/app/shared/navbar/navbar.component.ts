import { AfterContentInit, Component, HostListener, OnInit } from '@angular/core';
import { Usuario } from 'src/app/52_SIR.ControlUsuarios/models/usuario.interface';
import { SessionManagerService } from '../services/session-manager.service';
import { NavBarService } from '../services/nav-bar.service';
import { NavigationService } from '../services/navigation.service';
import { MenuItem } from 'primeng/api';
import { MenuItemModel } from '../interfaces/MenuItemModel.interface';
import { strings } from '@material/textfield';
import { map } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  actualUser: Usuario;
  menuUsuario: MenuItem[] = [];
  resultadoBusqueda: MenuItemModel[] = [];
  secciones: string[] = [];

  constructor(
    private sessionManagerService: SessionManagerService,
    private navbarService: NavBarService,
    private navigation: NavigationService
  ) {

    this.actualUser = this.sessionManagerService.getStorage();

  }

  ngOnInit(): void {
   
  }


  getIdUsuario(usuario: Usuario) : number {
    return usuario.id_usuario;
  }
  
    getNombreUsuario(usuario: Usuario) : string {
    return usuario.nombre_completo.split(' ')[0];
  }
  
   esAdmin(usuario: Usuario) : boolean {
    return usuario.id_perfil == 1;
  }

  toogleMenuVisibility(): void {
    this.navbarService.toogleMenuVisibility();

  }

  goMain(): void {
    this.navigation.navegar('');
  }


  /* Buscador */
  isSearchExpanded: boolean = false;
  searchQuery: string = '';
  icono: string = 'search';
  toolTipText: string = 'Buscar';
  isResVisible: boolean = false;

  toggleSearch() {
    this.isSearchExpanded = !this.isSearchExpanded;
    if (!this.isSearchExpanded) {
      this.searchQuery = ''; 
      this.resultadoBusqueda = [];
      this.icono = 'search';
      this.toolTipText = 'Buscar';
      this.isResVisible = false;
    } else {
      const input: HTMLInputElement | null = document.getElementById('searchInput') as HTMLInputElement;
      if(input) {
        this.icono = 'search_off';
        this.toolTipText = 'Cerrar búsqueda';
        this.menuUsuario = this.sessionManagerService.getMenu();
        this.isResVisible = true;
        input.focus();
      }
    }
  }

  resetSearch(): void {
    this.isSearchExpanded = false;
    this.searchQuery = '';
    this.resultadoBusqueda = [];
    this.isResVisible = false;
    this.icono = 'search';
  }

  performSearch() {
    if(this.searchQuery === '') {
      this.resultadoBusqueda = [];
      return;
    }
    
    
    
    this.resultadoBusqueda = this.buscarElemento(this.menuUsuario, this.searchQuery);
    this.secciones = this.getSecciones(this.resultadoBusqueda);
  }

   buscarElemento(objeto: MenuItem[], textoBusqueda: string): MenuItemModel[] {
    let resultados: MenuItemModel[] = [];

    function buscarRecursivo(item: MenuItem, label: string) {
        if (item.label && item.label.toLowerCase().includes(textoBusqueda.toLowerCase()) && !existeEtiqueta(item.label) ) {
          resultados.push({
            parentLabel: label,
            menuItem: item
          });
        }
        
        if (item.items && item.items.length > 0) {
            item.items.forEach((subItem: MenuItem) => {
                buscarRecursivo(subItem, item.label!);
            });
        }
    }

    function existeEtiqueta(etiqueta: string): boolean {
      return objeto.some(item => item.label?.trim() === etiqueta.trim());
    }

    objeto.forEach((item: MenuItem) => {
        buscarRecursivo(item, item.label!);
    });

    return resultados;
}

  selectText(event: Event): void {
    (event.target as HTMLInputElement).select();
  }

 

  getSecciones(resultados: MenuItemModel[]): string[] {
    let secciones: string[] = Array.from(new Set(resultados.map(s => s.parentLabel.trim())));
    return secciones;
  }

  resultadosMapping: {[k: string]: string} = {
    '=0': 'No hay resultados',
    '=1': 'Un resultado',
    'other': '# resultados'
  }

  @HostListener('window:keydown.esc', ['$event'])
  handleEsc(event: KeyboardEvent) {
    this.searchQuery = '';
    this.resultadoBusqueda = [];
    // this.isResVisible = false;
  }
}
