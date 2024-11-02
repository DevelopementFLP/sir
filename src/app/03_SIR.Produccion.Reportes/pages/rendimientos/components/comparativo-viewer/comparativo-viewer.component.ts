import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CorteLote } from '../../interfaces/CorteLote.interface';
import { QamarkDTO } from '../../../cuota/interfaces/QamarkDTO.interface';
import { ComparativoRend } from '../../interfaces/ComparativoRend.interface';
import { LoteEntradaDTO } from '../../../cuota/interfaces/LoteEntradaDTO.interface';
import { DWSalidaDTO } from '../../../cuota/interfaces/DWSalidaDTO.interface';
import { CommonService } from '../../services/common.service';
import { ComparativoRendData } from '../../interfaces/ComparativoRendData.interface';
import { ComparativoRendFecha } from '../../interfaces/ComparativoRendFecha.interface';
import { TipoFechaData } from '../../interfaces/TipoFechaData.interface';
import { TipoFechaDataAgrupado } from '../../interfaces/TipoFechaDataAgrupado.interface';

@Component({
  selector: 'comparativo-viewer',
  templateUrl: './comparativo-viewer.component.html',
  styleUrls: ['./comparativo-viewer.component.css']
})
export class ComparativoViewerComponent implements OnInit {

  @Input() data:        CorteLote[] = [];
  @Input() qamarksDto:  QamarkDTO[] = [];
  @Input() fechas:      Date[]      = [];

  tiposRendimientosSeleccionados: boolean[] = [];
  tiposRendmientos:  string[] = [];
  qamarks:           number[] = [];
  qamarksFiltrados:  string[] = []
  comparativoData:   ComparativoRend[] = [];
  rendimientos:      ComparativoRendData[] = [];
  dataAgrupada:      ComparativoRend[][] =[];
  
  dataPorFechaYTipo:      ComparativoRend[][] = [];
  comparativoDataFecha:   ComparativoRend[] = [];
  rendimientosFechaYTipo: ComparativoRendData[] = [];
  dataComparativoFecha:   ComparativoRendFecha[] = [];
  rendimientoPorFecha:    TipoFechaData[] = [];
  rendimientoAgrupado:    TipoFechaDataAgrupado[] = [];

  verAcumulado:           boolean = true;

  @Output() emitirTiposRendimientos = new EventEmitter<boolean[]>();
  @Output() emitirRendimientosAgrupados = new EventEmitter<TipoFechaDataAgrupado[]>();
  @Output() emitirNombreTipos = new EventEmitter<string[]>();

  trackByIndex(index: number, item: any): any {
    return index;
  }

  emitirSeleccion() {
    this.emitirTiposRendimientos.emit(this.tiposRendimientosSeleccionados);
  }

  emitirRendimientoAgrupado() {
    
    this.emitirRendimientosAgrupados.emit(this.rendimientoAgrupado);
  }
  
  emitirNombresRendimientos() {
    this.emitirNombreTipos.emit(this.tiposRendmientos);
  }
  
  constructor(private cmnSrvc: CommonService) {}
  
  ngOnInit(): void {
    this.editarFechas();
    this.setTiposRendimientos();
    this.setTiposRendimientosSeleccionados();
    this.emitirSeleccion();
    this.setQamarks();
    this.setQamarksFiltrados();
    this.setComparativoData();
    this.setDataPorFechaYTipo();
    this.rendimientoAgrupado = this.agruparRendimientoPorTipo(this.rendimientoPorFecha);
    this.emitirRendimientoAgrupado();
    this.emitirNombresRendimientos();
  }
  
  private editarFechas(): void {
    this.fechas.forEach(f => {
      f.setHours(f.getHours() + 3);
    });
  }

  private agruparRendimientoPorTipo(data: TipoFechaData[]): TipoFechaDataAgrupado[] {
    let rend: TipoFechaDataAgrupado[] = []; 
    this.tiposRendmientos.forEach(tipo => {
      const tp = data.filter(x => x.tipo == tipo);
      let y: ComparativoRendFecha[] = [];

      tp.forEach(t => {
       if(t.data.data.length > 0) {
        const x: ComparativoRendFecha = {
          fecha: t.data.fecha, 
          data: t.data.data
        };
        y.push(x);
      }
    });

    rend.push({
      tipo: tipo,
      data: y
    })
    });
    
    return rend;
  }

  private setDataPorFechaYTipo(): void {
    let qm: number[] = [];
    this.tiposRendmientos.forEach(t => {
      const dataTipo: CorteLote[] = this.data.filter(d => d.nombre == t);     
      if(dataTipo.length > 0) {
        this.fechas.forEach(f => {
          const ent = dataTipo[0].entrada.filter(e => this.cmnSrvc.sonFechasIguales(e.fecha, f));
          if(ent.length > 0) {
            const cts = dataTipo[0].cortes.filter(e => this.cmnSrvc.sonFechasIguales(e.fecha, f));
            if(cts.length > 0) {
              let entr = this.cmnSrvc.agruparEntrada(ent);
              let q = cts.map(c => c.marca);
              qm = qm.concat(q);
              
              this.rendimientosFechaYTipo.push({
                fecha: f,
                tipo:   t,
                cortes:  cts,
                pesoCuartos:  this.cmnSrvc.pesoTotalCuartos(entr)
              });
            }
          }
        });
      }
    });
    
    this.dataComparativoFecha = this.setDataComparativoPorFecha(this.rendimientosFechaYTipo, this.fechas, this.qamarksDto);    
    this.rendimientoPorFecha = this.agruparDataPorRendimientoYFecha(this.dataComparativoFecha);
    this.agruparDataComparativoFecha(this.rendimientoPorFecha, this.qamarksFiltrados);    
  }

  private agruparDataComparativoFecha(data: TipoFechaData[], qamarks: string[]): void {
    for(let i = 0; i < data.length; i++) {
      let d = data[i].data.data;
      if(d.length > 0 && d.length < qamarks.length) {
        const qmTipo = Array.from(new Set(d.map(x => x.qamark)));
        const diff = qamarks.filter(q => !qmTipo.includes(q));
        
        diff.forEach(df => {
          let n: ComparativoRend = {
            pesoPromedio: 0,
            qamark: df,
            rendimiento: 0,
            tipo: d[0].tipo,
            peso: 0,
            piezas: 0,
            pesoCuartos: 0
          };
          d.push(n);
        });
        d = d.sort((a, b) => {if(a.qamark <= b.qamark) return -1; return 1});
      }
    }
  }

  private setDataComparativoPorFecha(rend: ComparativoRendData[], fechas: Date[], qamarks: QamarkDTO[]): ComparativoRendFecha[] {
    let comp: ComparativoRendFecha[] = [];
    let compRend: ComparativoRend[]  = [];
    
    fechas.forEach(f => {
      compRend = [];
      const data = rend.filter(r => this.cmnSrvc.sonFechasIguales(r.fecha!, f));      
      compRend = this.cmnSrvc.setDataComparativoRendimiento(data, qamarks);
      comp.push({
        fecha: f,
        data: compRend.sort((a, b) => { if(a.qamark <= b.qamark) return -1; return 1})
      })
    });
    return comp;
  }

  private agruparDataPorRendimientoYFecha(data: ComparativoRendFecha[]): TipoFechaData[] {
    let nuevo: TipoFechaData[] = [];    
    for(let i = 0; i < data.length; i++) {
      const d = data[i];
      const fecha = d.fecha;
      this.tiposRendmientos.forEach(tipo => {  
        const t = d.data.filter(x => x.tipo == tipo);
        
        
        let y: ComparativoRendFecha = {
          data: t,
          fecha: fecha
        }
        nuevo.push({
          tipo: tipo,
          data: y 
        })
      });
    }
    return nuevo;
  }

  private setTiposRendimientosSeleccionados(): void {
    for(let i = 0; i < this.tiposRendmientos.length; i++) {
      this.tiposRendimientosSeleccionados.push(true);
    }
  }

  private setTiposRendimientos(): void {
    const len = this.data.length;
    this.tiposRendmientos = [];
    for(let i = 0; i < len; i++) {
      this.tiposRendmientos.push(this.data[i].nombre);
    }
  }

  private setQamarks(): void {
    const len = this.data.length;
    this.qamarks = [];
    for(let i = 0; i < len; i++) {
      const cortes = this.data[i].cortes;
      const arrQamark = Array.from(new Set(cortes.map(c => c.marca)));
      this.qamarks = this.qamarks.concat(this.qamarks, arrQamark);
    }

    this.qamarks = Array.from(new Set(this.qamarks.map(m => m))).
                   sort((a, b) => {
                    if(a <= b) return -1;
                    return 1;
                   });
  }

  private setQamarksFiltrados(): void {
    this.qamarksFiltrados = [];

    this.qamarks.forEach(qm => {
      let q = this.qamarksDto.find(qma => qma.qamark == qm)?.name;
      if(q && !q.includes('MANTA') && !q.includes('TRIMM')) this.qamarksFiltrados.push(q)
    });

    this.qamarksFiltrados = this.qamarksFiltrados.sort((a, b) => {
      if(a <= b) return -1;
      return 1;
    });
  }

  private setComparativoData(): void {
    let comp: ComparativoRend[] = [];
    const len = this.data.length;
    this.comparativoData = [];
    this.rendimientos = [];
    for(let i = 0; i < len; i++) {
      const data: CorteLote        = this.data[i];
      const ent:  LoteEntradaDTO[] = data.entrada;
      const cts:  DWSalidaDTO[]    = data.cortes;
 
      if(ent.length > 0) {          
        let entr = this.cmnSrvc.agruparEntrada(ent);
        let ct   = this.cmnSrvc.agruparCortes(cts);
        
        this.rendimientos.push({
          fecha: new Date(),
          tipo:   data.nombre,
          cortes:  ct,
          pesoCuartos:  this.cmnSrvc.pesoTotalCuartos(entr)
        });
      }
    }
    
    comp = this.cmnSrvc.setDataComparativoRendimiento(this.rendimientos, this.qamarksDto);    
    this.comparativoData = comp;
    this.agruparDataComprativo(this.comparativoData);    
  }

  private agruparDataComprativo(comp: ComparativoRend[]): void {
    this.dataAgrupada = [];
    this.tiposRendmientos.forEach(tipo => {
      let d = comp.filter(c => c.tipo == tipo).sort((a, b) => {
        if(a.qamark <= b.qamark) return -1;
        return 1;
      });
      this.dataAgrupada.push(d);      
    });  
  }
}
