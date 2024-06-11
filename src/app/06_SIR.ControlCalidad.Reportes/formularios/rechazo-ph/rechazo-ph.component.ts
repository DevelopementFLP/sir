import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chip } from 'primeng/chip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PHConfirmDialogComponent } from '../../components/phconfirm-dialog/phconfirm-dialog.component';
import { formatDate } from '@angular/common';
import { OrdinalPH } from '../../interfaces/OrdinalPH.interface';
import { CcalidadService } from 'src/app/shared/services/ccalidad.service';

@Component({
  selector: 'app-rechazo-ph',
  templateUrl: './rechazo-ph.component.html',
  styleUrls: ['./rechazo-ph.component.css'],
  providers: [DialogService]
})
export class RechazoCCPHComponent implements OnInit, OnDestroy {
  rechazosForm: FormGroup;
  currentOrdinal: string = '';
  chips: Chip[] = [];
  @ViewChild('rechazosInput') rechazosInput!: ElementRef;
  confirmRef: DynamicDialogRef | undefined;

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private ccService: CcalidadService
  ) {
    this.rechazosForm = this.fb.group({
      fecha: [null, Validators.required],
      rechazos: [this.currentOrdinal]
    });
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    if(this.confirmRef) {
        this.confirmRef.close();
        this.confirmRef.destroy();
    } 
  }

  onSubmit(): void {
    if(this.rechazosForm.valid) {
      this.showConfirmDialog();
    }
  }

  private showConfirmDialog(): void {
    this.confirmRef = this.dialogService.open(PHConfirmDialogComponent, {
      data: {
        fechaFaena: this.rechazosForm.controls['fecha'].value,
        rechazados: this.getOrdinales()
      },
      header: "Rechazos de PH",
      width: '100vw',
      contentStyle: { overflow: 'auto' },
      closeOnEscape: true,
      dismissableMask: true   
    });

    this.confirmRef.onClose.subscribe(async (result: any) => {
      try {
        if(result !== undefined) {
          await this.savePH();
          this.resetData();
        }
      } catch (error: any) {
        throw new Error(error);
      }
    })
  }


  resetData(): void {
    this.rechazosForm.reset();
    this.chips = [];
  }


  addOrdinalChip(): void {
    const texto: string = this.rechazosForm.controls['rechazos'].value.trim();
    if(texto != '') {
        const ordList: string[] = texto.split('-');
        const inf: number = parseInt(ordList[0]);
        const sup: number = ordList.length > 1 ? parseInt(ordList[1]) : inf;
      
        for(let i = inf; i <= sup; i++) {
          if (!this.chips.some(chip => chip.label === i.toString())) {
              const chip = this.crearChip(i.toString());
          if (chip)
            this.chips.push(chip);
        }
      }
    }

    this.ordenarChipsPorNumero();
    this.rechazosForm.controls['rechazos'].reset();
  }

  private crearChip(texto: string): Chip | null {
    if (!texto) return null;
    const chip: Chip = new Chip();
    chip.label = texto;
    chip.removable = true;

    return chip;
  }

  removeOrdinal(chip: Chip): void {
    this.chips = this.chips.filter(c => c.label !== chip.label);
    this.ordenarChipsPorNumero();
    this.rechazosInput.nativeElement.focus();
  }

  ordenarChipsPorNumero(): void {
    this.chips.sort((a, b) => {
      const numA = parseInt(a.label);
      const numB = parseInt(b.label);
      return numA - numB;
    });
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addOrdinalChip();
    }
  }

  validateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/[^0-9-]/g, '');

    const dashIndex = value.indexOf('-');
    if (dashIndex === 0) {
      value = value.replace('-', ''); 
    }

    if (dashIndex !== -1) {
      const parts = value.split('-');
      value = parts[0] + '-' + parts.slice(1).join('').replace(/-/g, '');
    }

    input.value = value;
    this.rechazosForm.controls['rechazos'].setValue(value);
  }

  private getOrdinales(): string[] {
    return this.chips.map(ord => ord.label);
  }

  private async savePH(): Promise<void> {
    const fecha: string = formatDate(this.rechazosForm.controls['fecha'].value, "yyyy-MM-dd", "es-UY");
    let ordinales: OrdinalPH[] = [];

    this.chips.forEach(el => {
      ordinales.push({
        id: 0,
        ordinalNro: parseInt(el.label),
        fechaFaena: fecha
      });
    });

    if(ordinales.length > 0) {
      await this.ccService.postRechazosPH(ordinales).toPromise();
    }

    ordinales = [];
  }
}
