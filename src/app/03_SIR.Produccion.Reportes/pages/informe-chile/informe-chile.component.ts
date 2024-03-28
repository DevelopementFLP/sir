import { Component, OnInit } from '@angular/core';

interface Categoria {
  name: string
}

@Component({
  selector: 'app-informe-chile',
  templateUrl: './informe-chile.component.html',
  styleUrls: ['./informe-chile.component.css']
})
export class InformeChileComponent implements OnInit {

  fechaProduccion: Date | undefined;
  categorias!: Categoria[];
  categoriaSeleccionada: string | undefined;

  ngOnInit(): void {
    this.categorias = [
      {
        name: 'Seleccione'
      },
      {
        name: 'V',
      },
      {
        name: 'C',
      },
      {
        name: 'U',
      }
    ]
  }
}
