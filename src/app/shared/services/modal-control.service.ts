import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalControlService {

  visible: boolean = false;

  constructor() { }
}
