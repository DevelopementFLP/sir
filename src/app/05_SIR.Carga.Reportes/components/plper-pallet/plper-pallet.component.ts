import { Component, Input, OnInit } from '@angular/core';
import { RegistroConPrecio } from '../../interfaces/RegistroConPrecio.interface';
import { PLPallet } from '../../interfaces/PLPallet.interface';
import { CargaService } from '../../services/carga-service.service';

@Component({
  selector: 'pl-per-pallet',
  templateUrl: './plper-pallet.component.html',
  styleUrls: ['./plper-pallet.component.css']
})
export class PLPerPalletComponent implements OnInit {
  @Input() datos: RegistroConPrecio[] = [];

  registrosPallet: PLPallet[] = [];
  idsPallets: number[] = [];

  constructor(private cargaService: CargaService) {}

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.idsPallets = this.cargaService.getIdsPallets(this.datos);
    this.registrosPallet = this.cargaService.setDataRegistrosPallet(this.idsPallets, this.datos);
  }
}
