import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dash-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.css']
})
export class NoDataComponent implements OnInit {
  @Input() mensaje: string = '';

  ngOnInit(): void {
    
  }
}
