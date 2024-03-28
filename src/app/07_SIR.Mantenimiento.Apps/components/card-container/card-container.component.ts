import { Component, Input } from '@angular/core';
import { RatioErrorResponse } from '../../interfaces/RatioErrorResponse.interface';

@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.css']
})
export class CardContainerComponent {

  @Input() dayData?: RatioErrorResponse;
  @Input() weekData?: RatioErrorResponse;

  @Input() dispositivo: string = "";


}
