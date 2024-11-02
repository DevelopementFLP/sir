import { Component, Input, OnInit } from '@angular/core';
import { RegistroConPrecio } from '../../interfaces/RegistroConPrecio.interface';
import { CargaService } from '../../services/carga-service.service';
import { XFCL } from '../../interfaces/XFCL.interface';
import { TotalData } from '../../interfaces/TotalData.interface';

@Component({
  selector: 'x-fcl',
  templateUrl: './xfcl.component.html',
  styleUrls: ['./xfcl.component.css']
})
export class XFCLComponent implements OnInit {
  @Input() datos: RegistroConPrecio [] = [];

  datosXFCL: XFCL[] = [];
  totalGeneral!: TotalData;

  constructor(private cargaService: CargaService) {}

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.datosXFCL = this.cargaService.setDataXFCL(this.datos);
    this.totalGeneral = this.cargaService.getTotalData(this.datos);
  }
}
