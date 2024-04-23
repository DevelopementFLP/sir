import { InjectionToken } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

export const CONFIRMATION_SERVICE_TOKEN = new InjectionToken<ConfirmationService>('ConfirmationService');
export const MESSAGE_SERVICE_TOKEN = new InjectionToken<MessageService>('MessageService');
