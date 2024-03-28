import { Component, OnInit } from '@angular/core';
import { CcalidadService } from 'src/app/shared/services/ccalidad.service';

@Component({
  selector: 'app-pcc',
  templateUrl: './pcc.component.html',
  styleUrls: ['./pcc.component.css']
})
export class PccComponent implements OnInit {

  constructor( private ccService: CcalidadService ) {}

  ngOnInit(): void {
    // this.ccService.getPCCData(5, 'VACUNO').subscribe( data => 
    //   console.log(data))
  }


}
