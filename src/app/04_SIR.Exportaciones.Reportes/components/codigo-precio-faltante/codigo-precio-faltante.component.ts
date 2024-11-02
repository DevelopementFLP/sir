import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrecioFaltante } from 'src/app/05_SIR.Carga.Reportes/interfaces/PrecioFaltante.interface';

@Component({
  selector: 'app-codigo-precio-faltante',
  templateUrl: './codigo-precio-faltante.component.html',
  styleUrls: ['./codigo-precio-faltante.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CodigoPrecioFaltanteComponent implements OnInit {

  noCodigos: string[] = [];
  noCodigosPrecios: PrecioFaltante[] = [];
  txtBotonCopia: string = "Copiar al portapapeles";

  constructor (
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    if(this.config && this.config.data) {
      if(this.config.data.noCodigos) this.noCodigos = this.config.data.noCodigos;
      if(this.config.data.noPrecios) this.noCodigosPrecios = this.config.data.noPrecios;

    }
  }

  close(): void {
    this.ref.close('closed');
    this.ref.destroy();
  }

  copy(): void {
    const datos = [...this.noCodigos, ...this.noCodigosPrecios];
    const texto = JSON.stringify(datos);

    if(navigator.clipboard) {
      navigator.clipboard.writeText(texto)
      .then(() => this.txtBotonCopia = "Copiado!")
      .catch( error => { console.log(`Error al copiar los datos al portapapeles: ${error}`)});
    }

  }
}
