import { Component, Input } from '@angular/core';
import { CardConfigurationDisplay } from '../../interfaces/CardConfigurationDisplay.interface';

@Component({
  selector: 'card-configuration',
  templateUrl: './card-configuration.component.html',
  styleUrls: ['./card-configuration.component.css']
})
export class CardConfigurationComponent {
  @Input() cardData?: CardConfigurationDisplay;


}
