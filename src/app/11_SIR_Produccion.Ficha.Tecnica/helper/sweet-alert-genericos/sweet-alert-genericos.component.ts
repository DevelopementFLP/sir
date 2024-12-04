import { Component } from '@angular/core';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-sweet-alert-genericos',
  templateUrl: './sweet-alert-genericos.component.html',
  styleUrls: ['./sweet-alert-genericos.component.css']
})
export class SweetAlertGenericosComponent {


  public AlertaSuccessgenerica(titulo: string, texto: string){
    Swal.fire({
      title: titulo,
      text: texto,
      icon: "success"
    });     
  }

  public AlertaErrorgenerica(titulo: string, texto: string){
    Swal.fire({
      title: titulo,
      text: texto,
      icon: "error"
    });     
  }

}
