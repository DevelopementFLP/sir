import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { filter, switchMap, toArray } from 'rxjs';

import { GecosService } from 'src/app/shared/services/gecos.service';

import { AnimalesPorTropa } from 'src/app/shared/models/animal-por-tropa.interface';
import { HaciendaAnimal } from 'src/app/shared/models/gecos/haciendaAnimales.interface';
import { PH } from 'src/app/shared/models/ph.interface';
import { Modal } from 'src/app/shared/models/modal.interface';

interface EspecieCombo {
  name: string
}

@Component({
  selector: 'app-rechazo-ph',
  templateUrl: './rechazo-ph.component.html',
  styleUrls: ['./rechazo-ph.component.css']
})
export class RechazoPHComponent implements OnInit {

  animales: HaciendaAnimal[] = [];
  animalesRechazo: PH[] = [];
  especie: string | undefined = "";
  especies!: EspecieCombo[];
  especieSeleccionada: EspecieCombo | undefined;
  fechaControl: Date | undefined;
  fechaFaena: Date | undefined;
  fechasControl: Date[] = [];
  hayDatos: boolean = false;
  isLoading: boolean = false;
  totalRechazados: number = 0;

  @ViewChild('listaOpciones', { static: false })
  listaOpciones!: ElementRef<HTMLSelectElement>;

  @Input() visible: boolean = false;
  @Input() mod!: Modal;

  @Output() cambioVisibilidad = new EventEmitter<boolean>();

  modal: Modal = {
    titulo: '',
    mensaje: '',
    estado: false
  }
  

  cambiarVisibilidad(visibilidad: boolean): void {
    this.visible = visibilidad;
    this.cambioVisibilidad.emit(this.visible);
  }

  constructor(private gecosService: GecosService) { }

  ngOnInit(): void {
    this.inicializarEspecies();

    /*this.gecosService.getDatosHaciendaLotes('2023-08-21 00:00:00.000').subscribe(data => {
      console.log(data);
    });*/
  }

  public getData() {

    if(!this.validarDatos()) return;

    this.hayDatos = false;
    this.animalesRechazo = [];
    this.totalRechazados = 0;
    this.isLoading = true;
    if (this.especieSeleccionada?.name == 'Seleccione especie' || this.fechaFaena == undefined) return;
    this.especie = this.especieSeleccionada?.name;

    this.obtenerDatosHacienda(this.fechaFaena.toDateString(), this.convertirEspecie(this.especieSeleccionada!));
  }

  onDropDownChange(event: any): void {
    this.especieSeleccionada = event.value;
  }

  onFechaSelected(fecha: Date): void {
    this.fechaFaena = fecha;
  }

  onFechaControlSelected(fecha: Date): void {
    this.fechaControl = fecha;
  }

  private obtenerDatosHacienda(fechaFaena: string, especie: string) {
    this.gecosService.getDatosHaciendaAnimales(fechaFaena)
      .pipe(
        switchMap((animales: HaciendaAnimal[]) => { return animales }),
        filter((animal: HaciendaAnimal) => animal.especie === especie),
        toArray()
      )
      .subscribe(animales => {
        this.animales = this.refactorizarTropas(animales, especie);
        this.agruparAnimalesPorTropa(this.animales);
        this.hayDatos = this.animales.length > 0;
        this.isLoading = false;
      })
  }

  private refactorizarTropas(animales: HaciendaAnimal[], especie: string): HaciendaAnimal[] {
    if (especie === "B") {
      animales = animales.filter((_, index) => index % 2 == 0);
    }

    return animales;
  }

  private inicializarEspecies(): void {
    this.especies = [
      {
        name: 'Seleccione especie'
      },
      {
        name: 'Vacuno'
      },
      {
        name: 'Ovino'
      }
    ];
  }


  private convertirEspecie(especie: EspecieCombo): string {
    return especie.name === "Vacuno" ? "B" : "O";
  }

  agruparAnimalesPorTropa(animales: HaciendaAnimal[]) {
    let animal: number = 1;
    let cantidadAnimales: number = animales.length;

    while (animal <= cantidadAnimales) {
      let final: number = 0;
      let inicio: number = 0;
      let nroTropa: number = animales[animal - 1].tropa;
      let rechazos: number[] = [];
      let rechazosYSegregados: number[];
      let segregrados: number[] = [];

      inicio = animal;

      while (animal <= cantidadAnimales && nroTropa === animales[animal - 1].tropa) {
        if (animales[animal - 1].rechazada) rechazos.push(animal);
        if (animales[animal - 1].segregada) segregrados.push(animal);
        animal++;
      }

      rechazosYSegregados = this.unirSegregadosYRechazados(rechazos, segregrados);
      this.totalRechazados += rechazosYSegregados.length;
      final = animal - 1;

      this.animalesRechazo.push(
        {
          al: final,
          del: inicio,
          rechazados: rechazosYSegregados.length,
          reses: final - inicio + 1,
          segregados: segregrados,
          resesConPHYSegregados: rechazosYSegregados,
          tropa: nroTropa
        }
      )

    }

    this.animalesRechazo.sort((a, b) => a.del - b.del)
  }

  private unirSegregadosYRechazados( rechazos: number[], segregados: number[]) : number[] {
    const conjunto = new Set([...rechazos, ...segregados]);
    const unidos: number[] = Array.from(conjunto);
    return unidos;
  }

  agregarFechaControl(): void {
    if(!(this.fechaControl === undefined))
      if(this.fechasControl.indexOf(this.fechaControl!) == - 1)
        this.fechasControl.push(this.fechaControl!);
      else{
        this.modal =  {
          titulo: "Fecha de control",
          mensaje: "La fecha de control ya fue agregada.",
          estado: false
        };
  
        this.cambiarVisibilidad(true);
      }
      
  }

  eliminarFecha( fecha: Date ) : void {
    this.fechasControl.splice(this.fechasControl.indexOf(fecha), 1);
  }

  validarDatos(): boolean {

    if(this.fechaFaena == null || this.fechaFaena == undefined){
      this.modal =  {
        titulo: "Fecha de faena",
        mensaje: "Seleccione la fecha de faena.",
        estado: false
      };

      this.cambiarVisibilidad(true);
      return false;
    }

    if(this.fechasControl.length == 0) {
      this.modal =  {
        titulo: "Fecha de control",
        mensaje: "No se agregaron fechas de control.",
        estado: false
    };
    this.cambiarVisibilidad(true);

      return false;

    }

    if(this.especieSeleccionada!.name == "Seleccione especie") {
      this.modal =  {
        titulo: "Selecciona especie",
        mensaje: "No se seleccionó especie.",
        estado: false
    };
    this.cambiarVisibilidad(true);

      return false;

    }


    return true;
  }
} 
