import { Injectable } from '@angular/core';
import { Email } from '../models/email.interface';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  enviarEmail(email: Email): void {
    
  }
}
