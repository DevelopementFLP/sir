import { Component, Input, OnInit } from '@angular/core';
import { TotalEmpaque } from '../../interfaces/TotalEmpaque.interface';
import { Data } from '@angular/router';
import { DataEmpaque } from '../../interfaces/DataEmpaque.interface';

@Component({
  selector: 'data-empaque',
  templateUrl: './data-empaque.component.html',
  styleUrls: ['./data-empaque.component.css']
})
export class DataEmpaqueComponent implements OnInit {

  @Input() dataEmpaque: DataEmpaque | undefined;
  @Input() lado: number = 1;
  @Input() idPuesto: number = 0;

  ngOnInit(): void {

  }

  getPuesto(linea: string): string {
    let puesto: string = '';
    if(linea != '') {
      puesto = "E" + linea.split(' ')[3];
    }
    return puesto;
  }

  getPuestoVacio(id: number): string {
    const pre: string = id < 10 ? '0' : '';
    return "E" + pre + (id + 1).toString();
  }
}
