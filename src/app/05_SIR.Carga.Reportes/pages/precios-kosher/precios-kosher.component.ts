import { Component, OnInit } from '@angular/core';
import { GecosService } from 'src/app/shared/services/gecos.service';

interface Cliente {
  name: string
}

interface Contenedor {
  name: string
}

@Component({
  selector: 'app-precios-kosher',
  templateUrl: './precios-kosher.component.html',
  styleUrls: ['./precios-kosher.component.css']
})
export class PreciosKosherComponent implements OnInit {

  fechaDesde: Date | undefined;
  fechaHasta: Date | undefined;
  clientes!: Cliente[];
  clientesSeleccionados: Cliente[] = []
  contenedores!: Contenedor[];
  contenedoresSeleccionados: Contenedor[] = [];

  constructor(
    private gecosService: GecosService
  ) {}

  ngOnInit(): void {
    this.clientes = [
      {
        name: 'Seleccione clientes'
      }
    ];

    this.contenedores = [
      {
        name: 'Seleccione contenedores'
      }
    ];

    this.gecosService.getDatosCarga("2023-08-21 00:00:00", "2023-08-21 00:00:00").subscribe(
      data => console.log(data)
    )
  }

  private cargarContenedores() {
    
  }
}
