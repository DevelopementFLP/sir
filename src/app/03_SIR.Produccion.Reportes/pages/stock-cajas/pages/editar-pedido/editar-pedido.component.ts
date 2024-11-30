import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-pedido',
  templateUrl: './editar-pedido.component.html',
  styleUrls: ['./editar-pedido.component.css']
})
export class EditarPedidoComponent implements OnInit{
  idPedidoPadre!: number;

  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    this.idPedidoPadre = Number(this.route.snapshot.paramMap.get('id')!);
  }

}
