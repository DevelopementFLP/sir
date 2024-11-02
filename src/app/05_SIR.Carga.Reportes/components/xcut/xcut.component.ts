import { Component, Input, OnInit } from '@angular/core';
import { RegistroConPrecio } from '../../interfaces/RegistroConPrecio.interface';
import { PLPallet } from '../../interfaces/PLPallet.interface';
import { CargaService } from '../../services/carga-service.service';
import { PrecioData } from '../../interfaces/PrecioData.interface';
import { TotalData } from '../../interfaces/TotalData.interface';

@Component({
  selector: 'x-cut',
  templateUrl: './xcut.component.html',
  styleUrls: ['./xcut.component.css']
})
export class XCUTComponent implements OnInit{
  @Input() datos: RegistroConPrecio [] = [];

  registrosPallet: PLPallet[] = [];
  idsPallets: number[] = [];
  dataXCUT: PrecioData[] = [];
  totalGeneral!: TotalData;

  constructor(private cargaService: CargaService) {}

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.idsPallets = this.cargaService.getIdsPallets(this.datos);
    this.registrosPallet = this.cargaService.setDataRegistrosPallet(this.idsPallets, this.datos).sort((a, b) => a.codigoKosher.localeCompare(b.codigoKosher));
    this.dataXCUT = this.cargaService.setDataXCUT(this.registrosPallet);
    this.totalGeneral = this.cargaService.getTotalData(this.datos);
  }
}
