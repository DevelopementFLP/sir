import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CardConfigurationDisplay } from '../../interfaces/CardConfigurationDisplay.interface';

@Component({
  selector: 'app-configuracion-main-page',
  templateUrl: './configuracion-main-page.component.html',
  styleUrls: ['./configuracion-main-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConfiguracionMainPageComponent implements OnInit{
  cardConfigList: CardConfigurationDisplay[] = [];

  ngOnInit(): void {
    
  }
}
