import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { ConfTipoRendimiento } from '../pages/rendimientos/interfaces/ConfTipoRendimiento.interface';
import { CuotaService } from '../pages/cuota/services/cuota.service';
import { DWSalidaDTO } from '../pages/cuota/interfaces/DWSalidaDTO.interface';
import { LoteEntradaDTO } from '../pages/cuota/interfaces/LoteEntradaDTO.interface';
import { ProductoData } from '../interfaces/ProductoData.interface';
import { QamarkDTO } from '../pages/cuota/interfaces/QamarkDTO.interface';
import { TipoLote } from '../pages/rendimientos/interfaces/TipoLote.interface';
import { TipoRendimientoData } from '../interfaces/TipoRendimientoData.interface';
import { ConfTipoCuotaDTO } from '../pages/cuota/interfaces/ConfTipoCuotaDTO.interface';
import { GrupoComparativo } from '../interfaces/GrupoComparativo.interface';
import { GrupoAgrupadoQamark } from '../interfaces/GrupoAgrupadoQamark.interface';

@Injectable({
  providedIn: 'root'
})
export class ComparativoCodigosService {

  protected qamarksComparativoCodigos: string[] = [];
  protected gruposComparativoCodigos: GrupoComparativo[] = [];

  constructor(private rendimientoService: CuotaService) { }

  async setProductoData(
    fechasReporte: string[], 
    lotesActivos: TipoLote[], 
    tiposRendimiento: ConfTipoRendimiento[] | ConfTipoCuotaDTO[],
    qamarks: QamarkDTO[]
  ): Promise<ProductoData[]> {
    let productosData: ProductoData[] = [];
    const dataComparativo = await this.setDataComparativo(fechasReporte, lotesActivos, tiposRendimiento);

    dataComparativo.forEach(data => {
      data.cortes.forEach(corte => {
        productosData.push({
          codigo: corte.codigo,
          nombre: corte.producto,
          pesoPromedio: corte.peso / corte.piezas,
          rendimiento: corte.peso / data.totalPesoEntrada,
          qamark: qamarks.find(qm => qm.qamark === corte.marca)?.name
        });
      });
    });

    return await productosData;
  }
  

  private async setDataComparativo(
    fechasReporte: string[], 
    lotesActivos: TipoLote[], 
    tiposRendimiento: ConfTipoRendimiento[] | ConfTipoCuotaDTO[]
  ): Promise<TipoRendimientoData[]> {
    const comparativoData: TipoRendimientoData[] = [];

    const [entrada, cortes] = await Promise.all([
        this.setLotesEntrada(fechasReporte, lotesActivos),
        this.setCortes(fechasReporte, lotesActivos)
    ]);

    const cortesAgrupados = this.agruparPorCodigo(cortes);

    tiposRendimiento.forEach(tipoRend => {
        const lotesDelTipo = lotesActivos.filter(lt => lt.idTipo === tipoRend.id);
        const lotesUnicos = Array.from(new Set(lotesDelTipo.map(l => l.lote)));

        const entradaRend = entrada.filter(e => lotesUnicos.includes(e.lote));
        const cortesRend = cortesAgrupados.filter(c => lotesUnicos.includes(c.lote));

        if (entradaRend.length && cortesRend.length) {
            comparativoData.push({
                id: tipoRend.id,
                cortes: cortesRend.sort((a, b) => a.codigo.localeCompare(b.codigo)),
                entrada: entradaRend,
                totalPesoEntrada: entradaRend.reduce((suma, ent) => suma + ent.peso, 0)
            });
        }
    });

    return comparativoData;
  }

  private async setLotesEntrada(fechasReporte: string[], lotesActivos: TipoLote[]): Promise<LoteEntradaDTO[]> {
    let fechaD = fechasReporte[0];
    let fechaH = fechasReporte[fechasReporte.length - 1];
    const lotesArr: number[] = Array.from(new Set(lotesActivos.map(l => l.lote)));
    return await lastValueFrom(this.rendimientoService.getLotesEntrada(fechaD, fechaH, this.lotesToSting(lotesArr)));
  }

  private async setCortes(fechasReporte: string[], lotesActivos: TipoLote[]): Promise<DWSalidaDTO[]> {
    let fechaD = fechasReporte[0];
    let fechaH = fechasReporte[fechasReporte.length - 1];
    const lotesArr: number[] = Array.from(new Set(lotesActivos.map(l => l.lote)));
    return await lastValueFrom(this.rendimientoService.getDWCortes(fechaD, fechaH, this.lotesToSting(lotesArr)));    
  }

  private agruparPorCodigo(data: DWSalidaDTO[]): DWSalidaDTO[] {
    const groupedData = new Map<string, DWSalidaDTO>();

    data.forEach(item => {
        if (groupedData.has(item.codigo)) {
            const existingItem = groupedData.get(item.codigo)!;
            existingItem.piezas += item.piezas;
            existingItem.peso += item.peso;
        } else {
            groupedData.set(item.codigo, { ...item });
        }
    });
    return Array.from(groupedData.values());
}

  private lotesToSting(lotes: number[]): string {
    return lotes.join(',');
  }

  qamarksEnGrupos(grupos: GrupoComparativo[]): string[] {
    return Array.from(new Set(grupos.flatMap(grupo => grupo.productos.map(producto => producto.qamark!)).filter(qamark => qamark !== undefined))).sort((a, b) => a.localeCompare(b));
  }

  productosAgrupadosPorQamark(qamarks: string[], grupos: GrupoComparativo[]): GrupoAgrupadoQamark[] {
    return qamarks.map(qamark => ({
      qamark: qamark,
      productos: grupos.flatMap(grupo => 
        grupo.productos.filter(producto => producto.qamark === qamark)
      )
    }));
  }

  actualizarQamarksComparativoCodigos(qamarks: string[]): void {
    this.qamarksComparativoCodigos = [...qamarks];
  }

  actualizarGruposComparativoCodigos(grupos: GrupoComparativo[]): void {
    this.gruposComparativoCodigos = [...grupos];
  }

  getQamarksEnGrupos(): string[] {
    return this.qamarksComparativoCodigos;
  }

  getGruposComparativo(): GrupoComparativo[] {
    return this.gruposComparativoCodigos;
  }
}
