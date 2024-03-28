import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Modal } from '../models/modal.interface';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() visible: boolean = false;
  @Input() mod!: Modal;

  @Output() cambioVisibilidad = new EventEmitter<boolean>();

  cambiarVisibilidad(visibilidad: boolean): void {
    this.visible = visibilidad;
    this.cambioVisibilidad.emit(this.visible);
  }

}
