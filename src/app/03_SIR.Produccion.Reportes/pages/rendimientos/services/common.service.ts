import { Injectable } from '@angular/core';
import { LoteEntradaDTO } from '../../cuota/interfaces/LoteEntradaDTO.interface';
import { DWSalidaDTO } from '../../cuota/interfaces/DWSalidaDTO.interface';
import { ComparativoRendData } from '../interfaces/ComparativoRendData.interface';
import { ComparativoRend } from '../interfaces/ComparativoRend.interface';
import { QamarkDTO } from '../../cuota/interfaces/QamarkDTO.interface';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}

  sonFechasIguales(date1: Date, date2: Date): boolean {
    const fecha1 = new Date(date1);
    const fecha2 = new Date(date2);

    fecha1.setHours(0, 0, 0, 0);
    fecha2.setHours(0, 0, 0, 0);

    return (
      fecha1.getFullYear() == fecha2.getFullYear() &&
      fecha1.getMonth() == fecha2.getMonth() &&
      fecha1.getDate() == fecha2.getDate()
    );
  }

  agruparCortes(cortes: DWSalidaDTO[]): DWSalidaDTO[] {
    const codigos = Array.from(new Set(cortes.map((c) => c.codigo)));
    let cts: DWSalidaDTO[] = [];

    codigos.forEach((cod) => {
      let c: DWSalidaDTO = {
        codigo: '',
        condition: '',
        fecha: new Date(),
        lote: 0,
        marca: 0,
        material: 0,
        peso: 0,
        piezas: 0,
        producto: '',
        customer: undefined,
      };

      const codArr = cortes.find((c) => c.codigo == cod);

      c.codigo = cod;
      c.condition = codArr?.condition!;
      c.fecha = codArr?.fecha!;
      c.customer = codArr?.customer;
      c.lote = codArr?.lote!;
      c.marca = codArr?.marca!;
      c.material = codArr?.material!;
      c.producto = codArr?.producto!;
      c.piezas = cortes
        .filter((i) => i.codigo == cod)
        .reduce((acc, item) => acc + item.piezas, 0);
      c.peso = cortes
        .filter((i) => i.codigo == cod)
        .reduce((acc, item) => acc + item.peso, 0);
      cts.push(c);
    });

    cts = cts.sort((a, b) => {
      if (a.codigo <= b.codigo) return -1;
      return 1;
    });
    return cts;
  }

  agruparEntrada(entrada: LoteEntradaDTO[]): LoteEntradaDTO[] {
    const codigos = Array.from(new Set(entrada.map((e) => e.code)));
    let ent: LoteEntradaDTO[] = [];

    codigos.forEach((cod) => {
      let e: LoteEntradaDTO = {
        code: '',
        cuartos: 0,
        fecha: new Date(),
        lote: 0,
        peso: 0,
        tipoCuarto: '',
      };

      const codArr = entrada.find((e) => e.code == cod);
      e.code = cod;
      e.fecha = codArr?.fecha!;
      e.lote = codArr?.lote!;
      e.tipoCuarto = codArr?.tipoCuarto!;
      e.cuartos = entrada
        .filter((i) => i.code == cod)
        .reduce((acc, item) => acc + item.cuartos, 0);
      e.peso = entrada
        .filter((i) => i.code == cod)
        .reduce((acc, item) => acc + item.peso, 0);

      ent.push(e);
    });

    return ent;
  }

  cantidadTotalCuartos(entrada: LoteEntradaDTO[]): number {
    let cuartos: number = 0;
    cuartos = entrada.reduce((acc, item) => acc + item.cuartos, 0);
    return cuartos;
  }

  pesoTotalCuartos(entrada: LoteEntradaDTO[]): number {
    let peso: number = 0;
    peso = entrada.reduce((acc, item) => acc + item.peso, 0);
    return parseFloat(peso.toFixed(2));
  }

  cantidadTotalCortes(cortes: DWSalidaDTO[]): number {
    let cts: number = 0;
    cts = cortes.reduce((acc, item) => acc + item.piezas, 0);
    return cts;
  }

  pesoTotalCortes(cortes: DWSalidaDTO[]): number {
    let peso: number = 0;
    peso = cortes.reduce((acc, item) => acc + item.peso, 0);
    return parseFloat(peso.toFixed(2));
  }

  setDataComparativoRendimiento(
    data: ComparativoRendData[],
    qamarks: QamarkDTO[]
  ): ComparativoRend[] {
    let comp: ComparativoRend[] = [];

    for (let i = 0; i < data.length; i++) {
      const tipo = data[i].tipo;
      
      data[i].cortes.forEach((ct) => {
        const pesoPromedio = ct.peso / ct.piezas;
        const rendimiento = ct.peso / data[i].pesoCuartos;
        const qamarkName = qamarks.find((qm) => qm.qamark == ct.marca)?.name;        
        
        const n: ComparativoRend = {
          tipo: tipo,
          qamark: qamarkName!,
          pesoPromedio: pesoPromedio,
          rendimiento: rendimiento,
        };
        comp.push(n);
      });
    }
    
    comp = this.agruparPorQamark(comp);
    return comp;
  }

  private agruparPorQamark(data: ComparativoRend[]): ComparativoRend[] {
    let comp: ComparativoRend[] = [];
    const tipos = Array.from(new Set(data.map((d) => d.tipo)));
    const marks = Array.from(new Set(data.map((d) => d.qamark)));

    tipos.forEach((t) => {
      const v = data.filter((c) => c.tipo == t);
      marks.forEach((m) => {
        if (!m.includes('MANTA') && !m.includes('TRIMM')) {
          let e = v.filter((x) => x.qamark == m);
          if (e.length > 0) {
            let pesoProm = e.reduce((acc, item) => acc + item.pesoPromedio, 0);
            let rendProm = e.reduce((acc, item) => acc + item.rendimiento, 0);
            let c = e.length;
            let n: ComparativoRend = {
              pesoPromedio: pesoProm / c,
              rendimiento: rendProm / c,
              qamark: m,
              tipo: t,
            };
            comp.push(n);
          }
        }
      });
    });
    
    comp = this.setDataToDisplay(tipos, marks, comp);
    return comp;
  }

  private setDataToDisplay(tipos: string[], qmarks: string[], data: ComparativoRend[]): ComparativoRend[] {
    let comp: ComparativoRend[] = [];
    tipos.forEach(t => {
      qmarks.forEach(q => {
        if(!q.includes('MANTA') && !q.includes('TRIMM')) {
          const d = data.filter(e => e.tipo == t);
          const x = d.filter(y => y.qamark == q);        
          let peso = 0;
          let rend = 0;

          if(x.length > 0) {
            peso = x[0].pesoPromedio;
            rend = x[0].rendimiento;
          }

          const n: ComparativoRend = {
            tipo: t,
            qamark: q,
            pesoPromedio: peso,
            rendimiento: rend
          };

          comp.push(n);
      }
      });
    });
        
    return comp;
  }
}
