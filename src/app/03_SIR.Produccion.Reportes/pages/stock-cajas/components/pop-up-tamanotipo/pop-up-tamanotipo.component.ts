import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tipo } from '../../interfaces/Tipo.interface';
import { Tamano } from '../../interfaces/Tamano.interface';
import { StockCajasService } from '../../services/stock-cajas.service';

@Component({
  selector: 'app-pop-up-tamanotipo',
  templateUrl: './pop-up-tamanotipo.component.html',
  styleUrls: ['./pop-up-tamanotipo.component.css']
})
export class PopUpTamanotipoComponent implements OnInit{
 

  constructor (private stockService: StockCajasService) {}

  tipos: Tipo[] | undefined = [];
  tamanos_cajas: Tamano[] | undefined = [];

  tamanoActivo: string="";
  tipoActivo: string="";

  async ngOnInit(): Promise<void> {
   
    await this.GetTiposCajasAsync();
    await this.GetTamanoCajasAsync();
  
  }


  async GetTiposCajasAsync(): Promise<void> {
    this.tipos = await this.stockService.getTiposCajasAsync().toPromise();
  }

  async GetTamanoCajasAsync(): Promise<void> {
    this.tamanos_cajas = await this.stockService.getTamanoCajasAsync().toPromise();
    
  }

  @Output() tamanoTipoSeleccionado = new EventEmitter<string>();
  @Input() tamanoTipo: string ="";

  tamano: string = "";
  tipo: string="";

  enviarTamanoTipo(){

   

    if(this.tamanoTipo=="Tamano"){
    
      if(this.tamano!=""){

        this.tamanoTipoSeleccionado.emit(this.tamano);
        this.tamano ="";
        this.tamanoActivo="";
      }else{
        alert("Debe seleccionar un Tamaño");
      }
    

    }

    else if(this.tamanoTipo=="Tipo"){

      if(this.tipo!=""){
        this.tamanoTipoSeleccionado.emit(this.tipo);
        this.tipo="";
        this.tipoActivo="";

      }else{
        alert("Debe seleccionar un Tipo antes de confirmar");
      }
   
    }  
  }
  
  activarBotonTamano(nombre: string){
    this.tamanoActivo = nombre;
    this.tamano = nombre;
    this.enviarTamanoTipo();
  }

  activarBotonTipo(nombre: string){
    this.tipoActivo = nombre;
    this.tipo = nombre;

    this.enviarTamanoTipo();
  }

  cerrarPopUp(){
    this.tamanoTipoSeleccionado.emit("");
    this.tamanoTipoSeleccionado.emit("");
  }


}
