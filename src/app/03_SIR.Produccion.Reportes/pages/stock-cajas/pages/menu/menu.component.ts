import { Component, OnInit } from '@angular/core';
import { Tipo } from '../../interfaces/Tipo.interface';
import { StockCajasService } from '../../services/stock-cajas.service';
import { Tamano } from '../../interfaces/Tamano.interface';
import { Stock } from '../../interfaces/Stock.interface';
import { Pedido } from '../../interfaces/Pedido.interface';
import { OrdenEntrega } from '../../interfaces/OrdenEntrega.inteface';
import { OrdenArmado } from '../../interfaces/OrdenArmado.interface';
import { Diseno } from '../../interfaces/Diseno.interface';
import { Caja } from '../../interfaces/Caja.interface';
import { lastValueFrom } from 'rxjs';
import { SessionManagerService } from 'src/app/shared/services/session-manager.service';
import { Usuario } from 'src/app/52_SIR.ControlUsuarios/models/usuario.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{

  tiposCajas: Tipo[] | undefined = [];
  tamanosCajas: Tamano[] | undefined = [];
  stockCajas: Stock[] | undefined = [];
  pedidos: Pedido[] | undefined = [];
  ordenes: OrdenEntrega[] | undefined = [];
  ordenesArmado: OrdenArmado[] | undefined = [];
  disenos: Diseno[] | undefined = [];
  cajas: Caja[] | undefined = [];

  opcion_Menu: string ="Todos";
  constructor (
    private sessionManagerService: SessionManagerService,
    private stockService: StockCajasService
  ) {}

  async ngOnInit(): Promise<void> {
    // await this.getTiposCajasAsync();
    // await this.getTamanoCajasAsync();
    // await this.getStockCajasAsync();
    // await this.getPedidosAsync();
    // await this.getOrdenesEntregaAsync();
    // await this.getOrdenesArmadoAsync();
    // await this.getDisenosAsync();
    // await this.getCajasAsync();

    this.opcion_Menu = this.getIdUsuario();


  }

  private getIdUsuario(): string {
    var id: string = '';
    var usuarioStr: string | null = this.sessionManagerService.getCurrentUser();

    if(usuarioStr) {
      const usuario: Usuario = this.sessionManagerService.parseUsuario(usuarioStr);
      if(usuario.id_perfil == 1) return '1';
      
      id = usuario.id_usuario.toString();      
    }
      
    return id;
  }

  async getTiposCajasAsync(): Promise<void> {
    try {
      this.tiposCajas = await lastValueFrom(this.stockService.getTiposCajasAsync());
    } catch(error) {
      console.error(error)
    }
  }

  async getTamanoCajasAsync(): Promise<void> {
    this.tamanosCajas = await this.stockService.getTamanoCajasAsync().toPromise();
  }

  async getStockCajasAsync(): Promise<void> {
    this.stockCajas = await this.stockService.getStockCajasAsync().toPromise();
  }

  async getPedidosAsync(): Promise<void> {
    this.pedidos = await this.stockService.GetPedidosAsync().toPromise();
  }

  async getOrdenesEntregaAsync(): Promise<void> {
    this.ordenes = await this.stockService.getOrdenesEntregaAsync().toPromise();
  }

  async getOrdenesArmadoAsync(): Promise<void> {
    this.ordenesArmado = await this.stockService.getOrdenesArmadoAsync().toPromise();
  }

  async getDisenosAsync(): Promise<void> {
    this.disenos = await this.stockService.getDisenosAsync().toPromise();
  }

  async getCajasAsync(): Promise<void> {
    this.cajas = await this.stockService.getCajasAsync().toPromise();
  }

}
