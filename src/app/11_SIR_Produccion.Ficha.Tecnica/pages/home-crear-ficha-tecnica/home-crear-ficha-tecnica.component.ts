import { Component } from '@angular/core';

@Component({
  selector: 'app-home-crear-producto-ficha-tecnica',
  templateUrl: './home-crear-ficha-tecnica.component.html',
  styleUrls: ['./home-crear-ficha-tecnica.component.css']
})
export class HomeCrearProductoFichaTecnicaComponent {

  public esUsuarioAdmin: boolean = false; 
  
  ngOnInit(): void {

  const usuario = JSON.parse(localStorage.getItem('actualUser') || '{}');
  
  if (usuario && usuario.id_usuario == 27 || usuario.id_perfil == 1) {
      this.esUsuarioAdmin = true; 
    }
  }

}
