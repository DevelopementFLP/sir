import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'editar-precio',
  templateUrl: './editar-precio.component.html',
  styleUrls: ['./editar-precio.component.css']
})
export class EditarPrecioComponent implements OnInit {
  @Input() producto: string | null = null;
  @Input() precios: number[] = [];
  @Input() fechas: Date[] = [];
  @Output() preciosActualizados = new EventEmitter<{ producto: string; preciosViejos: number[], preciosNuevos: number[] }>();
  @Output() cerrarEdicion = new EventEmitter<void>();
  preciosForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.preciosForm = this.fb.group({
      precios: this.fb.array(this.precios.map(precio => this.fb.control(precio)))
    });
  }

  get preciosArray(): FormArray {
    return this.preciosForm.get('precios') as FormArray;
  }

  guardar(): void {
    const nuevosPrecios = this.preciosArray.value;
    this.preciosActualizados.emit({ producto: this.producto!, preciosViejos: this.precios, preciosNuevos: nuevosPrecios });
  }

  cerrar(): void {
    this.cerrarEdicion.emit();
  }
}
