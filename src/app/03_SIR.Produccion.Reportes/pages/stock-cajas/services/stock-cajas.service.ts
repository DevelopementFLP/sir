import { HttpClient } from '@angular/common/http';
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Tipo } from '../interfaces/Tipo.interface';
import { urlDeletePedido, urlGetCajas, urlGetDisenos, urlGetOrdenesArmado, urlGetPedidos, urlGetPedidosPadre, urlGetStockCajas, urlGetTamanoCajas, urlGetTiposCajas, urlInsertOrdenArmado, urlInsertOrdenEntrega, urlInsertPedido, urlInsertPedidoPadre, urlUpdateOrdenArmado, urlUpdateOrdenArmadoCajasArmadas, urlUpdateOrdenEntregaCajasEntregadas, urlUpdateOrdenEntrega, urlUpdatePedido, urlUpdatePedidoPadre, urlUpdatePrioridadPedido, urlUpdateStock, urlgetOrdenesEntrega } from 'src/settings';
import { Tamano } from '../interfaces/Tamano.interface';
import { Stock } from '../interfaces/Stock.interface';
import { Pedido } from '../interfaces/Pedido.interface';
import { OrdenEntrega } from '../interfaces/OrdenEntrega.inteface';
import { gecosProduccion } from '../../../../../settings';
import { OrdenArmado } from '../interfaces/OrdenArmado.interface';
import { Diseno } from '../interfaces/Diseno.interface';
import { Caja } from '../interfaces/Caja.interface';
import { CajaDisenioPedido } from '../interfaces/CajaDisenioPedido.interface';
import { DatePipe } from '@angular/common';
import { PedidoPadre } from '../interfaces/PedidoPadre.interface';


@Injectable({
  providedIn: 'root'  // Asegúrate de agregar DatePipe como proveedor
})
export class StockCajasService {


  constructor(private http: HttpClient) {}

  getTiposCajasAsync(): Observable<Tipo[]> {
    return this.http.get<Tipo[]>(urlGetTiposCajas);
  }

  getTamanoCajasAsync(): Observable<Tamano[]> {
    return this.http.get<Tamano[]>(urlGetTamanoCajas);
  }

  getStockCajasAsync(): Observable<Stock[]> {
    return this.http.get<Stock[]>(urlGetStockCajas);
  }

  GetPedidosAsync(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(urlGetPedidos);
  }
  GetPedidosPadreAsync(): Observable<PedidoPadre[]> {
    return this.http.get<PedidoPadre[]>(urlGetPedidosPadre);
  }

  getOrdenesEntregaAsync(): Observable<OrdenEntrega[]> {
    return this.http.get<OrdenEntrega[]>(urlgetOrdenesEntrega);
  }

  getOrdenesArmadoAsync(): Observable<OrdenArmado[]> {
    return this.http.get<OrdenArmado[]>(urlGetOrdenesArmado);
  }

  getDisenosAsync(): Observable<Diseno[]> {
    return this.http.get<Diseno[]>(urlGetDisenos);
  }

  getCajasAsync(): Observable<Caja[]> {
    return this.http.get<Caja[]>(urlGetCajas);
  }

// Insert

InsertPedidoAsync(pedidos: Pedido[]): Observable<number> {

  return this.http.post<number>(urlInsertPedido,pedidos);
}

InsertPedidoPadreAsync(pedidos: PedidoPadre[]): Observable<number> {

  return this.http.post<number>(urlInsertPedidoPadre,pedidos);
}

InsertOrdenArmadoAsync(order: OrdenArmado[]): Observable<void> {

  return this.http.post<void>(urlInsertOrdenArmado,order);
}

InsertOrdenEntregaAsync(order: OrdenEntrega[]): Observable<void> {

  return this.http.post<void>(urlInsertOrdenEntrega,order);
}

//  Update

UpdateStockAsync(stock: Stock[]): Observable<Stock[]> {

  return this.http.put<Stock[]>(urlUpdateStock,stock);
}

UpdateOrdenArmadoCajasArmadasAsync(orden: OrdenArmado[]): Observable<OrdenArmado[]> {

  return this.http.put<OrdenArmado[]>(urlUpdateOrdenArmadoCajasArmadas,orden);
}
UpdateOrdenArmadoAsync(orden: OrdenArmado[]): Observable<OrdenArmado[]> {

  return this.http.put<OrdenArmado[]>(urlUpdateOrdenArmado,orden);
}

UpdateOrdenEntregaCajasEntregadasAsync(orden: OrdenEntrega[]): Observable<OrdenEntrega[]> {

  return this.http.put<OrdenEntrega[]>(urlUpdateOrdenEntregaCajasEntregadas,orden);
}
UpdateOrdenEntregaAsync(orden: OrdenEntrega[]): Observable<OrdenEntrega[]> {

  return this.http.put<OrdenEntrega[]>(urlUpdateOrdenEntrega,orden);
}

UpdatePedidoAsync(pedido: Pedido[]): Observable<Pedido[]> {

  return this.http.put<Pedido[]>(urlUpdatePedido,pedido);
}

UpdatePedidoPadreAsync(pedido: PedidoPadre[]): Observable<PedidoPadre[]> {
  
  return this.http.put<PedidoPadre[]>(urlUpdatePedidoPadre,pedido);
}

UpdatePrioridadPedidoAsync(idPedido: number): Observable<void> {

  return this.http.put<void>(urlUpdatePrioridadPedido,idPedido);
}

// Delete

DeletePedido(idPedido: number): Observable<void> {
  return this.http.delete<void>(`${urlDeletePedido}?idPedido=${idPedido}`);
} 

}

