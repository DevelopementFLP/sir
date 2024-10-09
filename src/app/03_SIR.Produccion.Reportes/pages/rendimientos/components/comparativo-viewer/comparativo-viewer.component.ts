import { Component, Input, OnInit } from '@angular/core';
import { CorteLote } from '../../interfaces/CorteLote.interface';
import { QamarkDTO } from '../../../cuota/interfaces/QamarkDTO.interface';
import { ComparativoRend } from '../../interfaces/ComparativoRend.interface';
import { LoteEntradaDTO } from '../../../cuota/interfaces/LoteEntradaDTO.interface';
import { DWSalidaDTO } from '../../../cuota/interfaces/DWSalidaDTO.interface';
import { CommonService } from '../../services/common.service';
import { DataRendimiento } from '../../interfaces/DataRendimiento.interface';
import { ComparativoRendData } from '../../interfaces/ComparativoRendData.interface';

@Component({
  selector: 'comparativo-viewer',
  templateUrl: './comparativo-viewer.component.html',
  styleUrls: ['./comparativo-viewer.component.css']
})
export class ComparativoViewerComponent implements OnInit {

  @Input() data:        CorteLote[] = [];
  @Input() qamarksDto:  QamarkDTO[] = [];
  @Input() fechas:      Date[]      = [];


  tiposRendmientos: string[] = [];
  qamarks:          number[] = [];
  qamarksFiltrados: string[] = []
  comparativoData:  ComparativoRend[] = [];
  rendimientos:     ComparativoRendData[] = [];
  dataAgrupada:     ComparativoRend[][] =[];

  constructor(private cmnSrvc: CommonService) {}

  ngOnInit(): void {
    this.setTiposRendimientos();
    this.setQamarks();
    this.setQamarksFiltrados();
    this.setComparativoData();
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

    this.rendimientos = [];
    for(let i = 0; i < len; i++) {
      const data: CorteLote        = this.data[i];
      const ent:  LoteEntradaDTO[] = data.entrada;
      const cts:  DWSalidaDTO[]    = data.cortes;
 
      if(ent.length > 0) {          
        let entr = this.cmnSrvc.agruparEntrada(ent);
        let ct   = this.cmnSrvc.agruparCortes(cts);
        this.rendimientos.push({
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
    this.tiposRendmientos.forEach(tipo => {
      let d = comp.filter(c => c.tipo == tipo).sort((a, b) => {
        if(a.qamark <= b.qamark) return -1;
        return 1;
      });
      this.dataAgrupada.push(d);      
    });  
  }
}
