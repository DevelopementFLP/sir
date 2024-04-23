import { Injectable, Inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

import { CONFIRMATION_SERVICE_TOKEN, MESSAGE_SERVICE_TOKEN } from './tokens/messages.tokens';

@Injectable({
  providedIn: 'root'
})
export class CustomMessageService {

  constructor(
    @Inject(CONFIRMATION_SERVICE_TOKEN) private confirmationService: ConfirmationService,
    @Inject(MESSAGE_SERVICE_TOKEN) private messageService: MessageService
  ) { }

  mostrarMensaje(): void {
    this.confirmationService.confirm({
      
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
         console.log('Aceptar')
      },
    });
  }
}
