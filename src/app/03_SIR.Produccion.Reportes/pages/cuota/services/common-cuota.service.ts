import { Injectable } from '@angular/core';
import { LoteEntradaDTO } from '../interfaces/LoteEntradaDTO.interface';
import { ReporteCuota } from '../interfaces/ReporteCuota.interface';
import { EntradaReporte } from '../interfaces/EntradaReporte.interface';
import { EntradaDisplay } from '../interfaces/EntradaDisplay.interface';
import { EntradaDisplayReporte } from '../interfaces/EntradaDisplayReporte.interface';
import { CortesReporte } from '../interfaces/CortesReporte.interface';
import { SalidaDTO } from '../interfaces/SalidaDTO.interface';
import { Comparativo } from '../interfaces/Comparativo.inteface';
import { TipoCuotaDict } from '../interfaces/TipoCuotaDict.interface';
import { QamarkDTO } from '../interfaces/QamarkDTO.interface';
import { ComparativoTotal } from '../interfaces/ComparativoTotal.interface';
import { filter } from 'rxjs';
import { ComparativoReporte } from '../interfaces/ComparativoReporte.interface';

@Injectable({
  providedIn: 'root',
})
export class CommonCuotaService {
  public delanteros: string[] = ['DEL', 'HERR'];
  public traseros: string[] = ['PIS', 'TRA'];

  constructor() {}

  separarEntradaPorTipo(reporte: ReporteCuota | undefined): EntradaReporte {
    let entradaDelantero: LoteEntradaDTO[] = [];
    let entradaTrasero: LoteEntradaDTO[] = [];
    let entradaDesconocida: LoteEntradaDTO[] = [];
    let entradaReporte: EntradaReporte = {
      entradaDelantero: entradaDelantero,
      entradaTrasero: entradaTrasero,
      entradaDesconocida: entradaDesconocida,
    };
    reporte?.entrada.forEach((e) => {
      const nombre = e.tipoCuarto;
      const esDelantero = this.delanteros.some((prefix) =>
        nombre.includes(prefix)
      );
      const esTrasero = this.traseros.some((prefix) => nombre.includes(prefix));

      if (esDelantero) entradaDelantero.push(e);
      else if (esTrasero) entradaTrasero.push(e);
      else entradaDesconocida.push(e);
    });

    entradaReporte.entradaDelantero = entradaDelantero;
    entradaReporte.entradaTrasero = entradaTrasero;
    entradaReporte.entradaDesconocida = entradaDesconocida;
    return entradaReporte;
  }

  agruparEntrada(
    entradaDelantero: LoteEntradaDTO[],
    entradaTrasero: LoteEntradaDTO[]
  ): EntradaDisplayReporte {
    let totalDelanteros: EntradaDisplay[] = [];
    let totalTraseros: EntradaDisplay[] = [];
    let totalCuartos: number = 0;
    let totalPeso: number = 0;
    let totalEntrada: EntradaDisplayReporte = {
      delantero: totalDelanteros,
      trasero: totalTraseros,
      cuartos: 0,
      peso: 0,
      pesoAnimal: 0,
      animales: 0,
    };

    let cuartos: number = 0;
    let peso: number = 0;

    entradaDelantero.forEach((ed) => {
      cuartos += ed.cuartos;
      peso += ed.peso;
      totalCuartos += ed.cuartos;
      totalPeso += ed.peso;
    });

    totalDelanteros.push({
      nombre: 'DELANTEROS',
      cuartos: cuartos,
      peso: this.formatearFloat(peso),
    });

    cuartos = 0;
    peso = 0;

    entradaTrasero.forEach((et) => {
      cuartos += et.cuartos;
      peso += et.peso;
      totalCuartos += et.cuartos;
      totalPeso += et.peso;
    });

    totalTraseros.push({
      nombre: 'TRASEROS',
      cuartos: cuartos,
      peso: this.formatearFloat(peso),
    });

    totalEntrada.delantero = totalDelanteros;
    totalEntrada.trasero = totalTraseros;
    totalEntrada.cuartos = totalCuartos;
    totalEntrada.peso = this.formatearFloat(totalPeso);
    if (totalTraseros[0].cuartos > 0) {
      totalEntrada.animales = totalTraseros[0].cuartos / 2;
      totalEntrada.pesoAnimal = totalPeso / totalEntrada.animales;
      totalEntrada.pesoAnimal = this.formatearFloat(totalEntrada.pesoAnimal);
    } else {
      totalEntrada.animales = totalDelanteros[0].cuartos / 2;
      totalEntrada.pesoAnimal = totalPeso / totalEntrada.animales;
      totalEntrada.pesoAnimal = this.formatearFloat(totalEntrada.pesoAnimal);
    }

    return totalEntrada;
  }

  separarCortesPorTipo(reporte: ReporteCuota | undefined): CortesReporte {
    let cortesCuota: SalidaDTO[] = [];
    let cortesNoCuota: SalidaDTO[] = [];
    let cortesDelanterosNoCuota: SalidaDTO[] = [];
    let cortesTraserosNoCuota: SalidaDTO[] = [];
    let cortesManta: SalidaDTO[] = [];
    let cortesDelanteroCuota: SalidaDTO[] = [];
    let cortesTraseroCuota: SalidaDTO[] = [];
    let trimming: SalidaDTO[] = [];
    let cortesReporte: CortesReporte;

    cortesReporte = {
      cuota: cortesCuota,
      nocuota: cortesNoCuota,
      delanteroNoCuota: cortesDelanterosNoCuota,
      traseroNoCuota: cortesTraserosNoCuota,
      manta: cortesManta,
      delanteroCuota: cortesDelanteroCuota,
      traseroCuota: cortesTraseroCuota,
      trimming: trimming
    };

    cortesCuota = reporte?.cortes.filter((c) => c.tipo === 'CUOTA')!;
    cortesNoCuota = reporte?.cortes.filter((c) => c.tipo === 'NO CUOTA' && !c.name.includes('MANTA'))!;

    cortesDelanterosNoCuota = cortesNoCuota.filter(
      (cnc) => cnc.condition != null && cnc.condition.startsWith('D')
    );
    cortesTraserosNoCuota = cortesNoCuota.filter(
      (cnc) => cnc.condition != null && cnc.condition.startsWith('T')
    );

    
    const totalManta: SalidaDTO[] = [
      {
        cajas: 0,
        code: '',
        condition: '',
        name: 'MANTA',
        peso: 0,
        pesoPorPieza: 0,
        piezas: 0,
        qamark: 1,
        tipo: 'NO CUOTA'
      }
    ];
    
    const totalTrimming: SalidaDTO[] = [
      {
        cajas: 0,
        code: '',
        condition: '',
        name: 'TRIMMING',
        peso: 0,
        pesoPorPieza: 0,
        piezas: 0,
        qamark: 1,
        tipo: 'NO CUOTA'
      }
    ];
    
    cortesManta = reporte?.cortes.filter((c) => c.name.includes('MANTA'))!;
    trimming = cortesNoCuota.filter(c => c.name.includes('TRIMM'));

    cortesManta.forEach(it => {
      totalManta[0].peso += it.peso;
    });
    cortesManta = totalManta;

    trimming.forEach(it => {
      totalTrimming[0].peso += it.peso;
    });
    trimming = totalTrimming;
    
    cortesReporte.cuota = cortesCuota;
    cortesReporte.nocuota = cortesNoCuota;
    cortesReporte.delanteroNoCuota = cortesDelanterosNoCuota;
    cortesReporte.traseroNoCuota = cortesTraserosNoCuota;
    cortesReporte.manta = cortesManta;
    cortesReporte.trimming = trimming;

    return cortesReporte;
  }

  totalPesoPorCortes(cortes: SalidaDTO[]): number {
    let peso: number = 0;
    cortes.forEach((ct) => {
      peso += ct.peso;
    });
    return peso;
  }

  totalPesoCajas(cajas: SalidaDTO[]): number {
    let peso: number = 0;
    cajas.forEach((cj) => {
      peso += cj.peso;
    });
    return peso;
  }

  totalCajas(cajas: SalidaDTO[]): number {
    let c: number = 0;
    cajas.forEach((cj) => {
      c += cj.cajas;
    });
    return c;
  }

  private formatearFloat(numero: number): number {
    return parseFloat(numero.toFixed(2));
  }

  // COMPARATIVO
  getComparativoData(
    idsReportes: number[],
    reportes: TipoCuotaDict
  ): Comparativo[] {
    let comparativo: Comparativo[] = [];

    idsReportes.forEach((id) => {
      const repos: ReporteCuota[] = reportes[id];
      repos.forEach((repo) => {
        const cortes: SalidaDTO[] = repo.cortes;
        const entradaReporte = this.separarEntradaPorTipo(repo);
        const entradaDelantero = entradaReporte.entradaDelantero;
        const entradaTrasero = entradaReporte.entradaTrasero;

        cortes.forEach((ct) => {
          let pesoEntrada = 0;
          if (ct.condition != null) {
            if (ct.condition.startsWith('D'))
              pesoEntrada = entradaDelantero[0]?.peso || 0;
            else pesoEntrada = entradaTrasero[0]?.peso || 0;
          } else {
            if (entradaDelantero.length > 0)
              pesoEntrada += entradaDelantero[0].peso;
            if (entradaTrasero.length > 0)
              pesoEntrada += entradaTrasero[0].peso;
          }
          let comp: Comparativo = {
            conditon: ct.condition,
            idCuota: id,
            kgProm: ct.pesoPorPieza,
            qamark: ct.qamark,
            rendProm: ct.peso / pesoEntrada,
            tipo: ct.tipo,
          };
          comparativo.push(comp);
        });
      });
    });
    return comparativo;
  }

  getQamarksUnicos(comp: Comparativo[], qmrks: QamarkDTO[]): QamarkDTO[] {
    let qas: QamarkDTO[] = [];
    const qamarks = Array.from(new Set(comp.map((c) => c.qamark))).sort(
      (a, b) => {
        if (a <= b) return -1;
        return 1;
      }
    );

    qamarks.forEach((q) => {
      const qm: QamarkDTO = {
        qamark: q,
        name: qmrks.find((qa) => qa.qamark == q)?.name!,
      };

      qas.push(qm);
    });

    return qas;
  }

  agruparDataComparativo(
    cd: Comparativo[],
    idsReporte: number[]
  ): Comparativo[] {
    let compData: Comparativo[] = [];

    for (let i = 0; i < idsReporte.length; i++) {
      const idR = idsReporte[i];
      compData = compData
        .concat(this.agruparDataPorTipo(idR, 'CUOTA', cd))
        .concat(this.agruparDataPorTipo(idR, 'NO CUOTA', cd));
    }
    return compData;
  }

  agruparDataPorTipo(
    idR: number,
    tipo: string,
    cd: Comparativo[]
  ): Comparativo[] {
    let compData: Comparativo[] = [];
    const datosCuotaPorId = cd.filter(
      (c) => c.idCuota == idR && c.tipo == tipo
    );
    const cuotaQmId = Array.from(
      new Set(datosCuotaPorId.map((d) => d.qamark))
    ).sort((a, b) => (a <= b ? -1 : 1));
    for (let j = 0; j < cuotaQmId.length; j++) {
      const datosPorQm = datosCuotaPorId.filter(
        (d) => d.qamark == cuotaQmId[j]
      );
      if (datosPorQm.length == 1) compData.push(datosPorQm[0]);
      else {
        if (
          compData.find(
            (c) =>
              c.idCuota == idR && c.qamark == cuotaQmId[j] && c.tipo == tipo
          ) == undefined
        ) {
          let cmp: Comparativo;
          let pProm: number = 0;
          let rendProm: number = 0;

          for (let k = 0; k < datosPorQm.length; k++) {
            pProm += datosPorQm[k].kgProm;
            rendProm += datosPorQm[k].rendProm;
          }

          cmp = {
            conditon: datosPorQm[0].conditon,
            idCuota: datosPorQm[0].idCuota,
            qamark: datosPorQm[0].qamark,
            tipo: datosPorQm[0].tipo,
            kgProm: pProm / datosPorQm.length,
            rendProm: rendProm / datosPorQm.length,
          };
          compData.push(cmp);
        }
      }
    }
    return compData;
  }

  formatearDatosComparativo(dc: Comparativo[], qmarks: QamarkDTO[], idsReporte: number[]): ComparativoReporte[] {
    let dataRes: ComparativoReporte[] = [];
    let compXId: {[id: number]: Comparativo[]} = [];

    idsReporte.forEach(id => {
        compXId[id] = dc.filter(d => d.idCuota == id);
        qmarks.forEach(qm => {
            let cr: ComparativoReporte = {
                idCuota: id,
                qamark: qm.qamark,
                datos: []
            };
            const dataPorQm = compXId[id].filter(c => c.qamark == qm.qamark);
            if(dataPorQm.length > 0) {
                cr.datos.push(dataPorQm[0].kgProm, dataPorQm[0].rendProm);
            } else {
                cr.datos.push(0, 0);
            }
            dataRes.push(cr);
        });
    });

    return this.filtrarDatosComparativo(dataRes, qmarks);
  }

  private filtrarDatosComparativo(dc: ComparativoReporte[], qmarks: QamarkDTO[]): ComparativoReporte[] {
    let filtro: ComparativoReporte[] = [];
    qmarks.forEach(qm => {
      const dxqm = dc.filter(d => d.qamark == qm.qamark);

      let s = 0;
      
      dxqm.forEach(d => {
        d.datos.forEach(x => {
          s += x;
        });
      });

      if(s > 0) filtro = filtro.concat(dxqm); 
    });
    return filtro;
  }

  getComparativoPorTipo(tipo: string, cmp: Comparativo[]): Comparativo[] {
    return cmp.filter((c) => c.tipo === tipo);
  }

  getComparativoPorIdCuoat(id: number, cmp: Comparativo[]): Comparativo[] {
    return cmp.filter((c) => c.idCuota === id);
  }
}
