import { Component, Input, OnInit } from '@angular/core';
import { RRHHService } from '../../services/rrhh.service';
import { HorarioEmpleado } from '../../interfaces/HorarioEmpleado.interface';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TiempoLogueado } from '../../interfaces/TiempoLogueado.interface';
import { FuncionariosService } from '../../services/funcionarios.service';
import { Empleado } from '../../interfaces/Empleado.interface';

@Component({
  selector: 'app-horario-funcionario',
  templateUrl: './horario-funcionario.component.html',
  styleUrls: ['./horario-funcionario.component.css']
})
export class HorarioFuncionarioComponent implements OnInit {
  
  @Input() numeroFunc:  string = '';
  @Input() nombreFunc:  string = '';
  @Input() esVisor:     boolean = false;

  logueadas:        HorarioEmpleado[] = [];
  tiempoLogueado!:  TiempoLogueado;
  tiempoTotal: string = '';

  constructor(
    private rrhhService:  RRHHService,
    public config:        DynamicDialogConfig,
    private funcService: FuncionariosService
  ) {}

  ngOnInit(): void {
    if(this.config.data != null && this.config.data != undefined)
    {
      this.numeroFunc = this.config.data.numeroFunc;
      this.nombreFunc = this.config.data.nombreFunc;
      this.esVisor    = this.config.data.visor;
    }

    this.rrhhService.getHorarioFuncionario(this.numeroFunc)
      .subscribe(logs => {
        this.logueadas = logs;
        this.tiempoTotal = this.funcService.getTiempoTotal(this.logueadas);
      });

      this.sendFuncData();
      
    }

    sendFuncData() {
      const data: Empleado = {
        code: this.config.data.numeroFunc,
        name: this.config.data.nombreFunc
      };

      this.funcService.setData(data);
    }
}
