import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  Input,
  EmbeddedViewRef,
  OnDestroy,
} from '@angular/core';
import { StockCajasService } from '../../services/stock-cajas.service';
import { Tipo } from '../../interfaces/Tipo.interface';
import { Tamano } from '../../interfaces/Tamano.interface';
import { Stock } from '../../interfaces/Stock.interface';
import { Pedido } from '../../interfaces/Pedido.interface';
import { OrdenEntrega } from '../../interfaces/OrdenEntrega.inteface';
import { OrdenArmado } from '../../interfaces/OrdenArmado.interface';
import { Diseno } from '../../interfaces/Diseno.interface';
import { Caja } from '../../interfaces/Caja.interface';
import { CajaDisenioPedido } from '../../interfaces/CajaDisenioPedido.interface';
import { endWith, lastValueFrom } from 'rxjs';
import { PedidoPadre } from '../../interfaces/PedidoPadre.interface';
import { formatDate } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css'],
})
export class CajaComponent implements OnInit {
  hayQueBorrar: boolean = false;

  disenos: Diseno[] | undefined = [];
  cajas: Caja[] | undefined;
  ordenEntrega: OrdenEntrega[] | undefined = [];
  ordenEntregaNuevo: OrdenEntrega[] | undefined = [];
  cajasFiltro: Caja[] | undefined;
  // cantidades: CajaDisenioPedido[] = [];
  cantidadAPedir: CajaDisenioPedido[] = [];
  pedido: Pedido[] = [];
  pedidoBorrar: Pedido[] = [];
  pedidoPadre: PedidoPadre[] = [];

  odBorrar: CajaDisenioPedido[] = [];

  pedidoPadreVer: PedidoPadre[] = [];
  fechaHoy = new Date();
  fechaFiltrada: string = '';
  fechaActiva: boolean = true;
  prioridadActiva: boolean = false;
  stock: Stock[] | undefined = [];
  stockNuevo: Stock[] = [];
  ordenArmado: OrdenArmado[] | undefined = [];

  ordenArmadoPedido: OrdenArmado[] = [];
  pedidosActivos: Pedido[] | undefined = [];
  pedidosActivosEditar: Pedido[] | undefined = [];

  idDiseno: number | undefined;
  nombreDiseno: string | undefined;

  cantidad: number = 0;
  sumaResta: string = 'Sumar';
  popUpVisible: boolean | undefined;
  popUpTamanoTipoVisible: boolean | undefined;
  popUpOrdenGrande: boolean = false;

  estaEditandoPedido: boolean = false;
  desplegarPoUpVisible: boolean = false;
  stockOProduccion: string = '0';

  //  Variable para cuando abro el popup saber si abro para seleccionar tipo o para seleccionar Tamaño
  tamanoTipo: string = 'Tipo';

  habilitarTipo: boolean = true;
  deshabilitado: boolean = false;

  //
  @ViewChild('seleccionTiposCajas', { static: false })
  seleccionTiposCaja!: ElementRef;
  tipoSeleccionado: string | null = '';
  tamanioSeleccionado: string | null = '';

  tipos: Tipo[] | undefined = [];
  tamanos_cajas: Tamano[] | undefined = [];

  esTamanioSeleccionado: boolean = false;
  esTipoSeleccionado: boolean = false;

  minFecha: string = '';

  prioridad: number = 0;
  prioridadPedidoPadre: number = 0;

  @Input() idPedidoPadreInput: number = 0;

  async ngOnInit(): Promise<void> {
    await this.iniciar();

    console.log(this.idPedidoPadreInput);

    this.estaEditandoPedido = false;
    //  Si ya tiene prioridad es porque va a editar un pedido, por lo tanto deshabilito las opciones para que no las cambie
    if (this.idPedidoPadreInput != 0) {
      // this.fechaActiva = true;
      // this.prioridadActiva = true;
      this.estaEditandoPedido = true;
      this.setearFechaPrioridad();

      this.mostrarPedidosActivosEditar();
    }
  }

  constructor(
    private stockService: StockCajasService,
    private router: Router
  ) {}

  async iniciar(): Promise<void> {
    this.fechaFiltrada = this.formatoFecha(this.fechaHoy);
    await this.GetDisenosAsync();
    await this.GetCajasAsync();
    await this.GetTiposCajasAsync();
    await this.GetTamanoCajasAsync();
    await this.getOrdenesArmadoAsync();
    await this.getStockCajasAsync();
    await this.GetPedidosAsync();
    await this.getOrdenesEntregaAsync();
    await this.GetPedidosPadreAsync();
    this.setMinFecha();

    this.validarExistePedidoPadrePrioridad();

    // this.cajasFiltro = this.cajas;
    this.llenarArrayCajas();
    this.deshabilitado = true;

    // if(this.disenos) {
    //   this.disenos.forEach(d => {
    //     this.cantidades.push({
    //       cantidad: 0,
    //       idDisenio: d.id_Diseno,
    //       nombreDisenio: d.nombre,
    //       tamano: this.tamanioSeleccionado!,
    //       tipo: this.tipoSeleccionado!,
    //       StockOProduccion: this.stockOProduccion!,
    //       prioridad:0
    //     })
    //   });
    // }

    // for(let i = 0; i < this.disenos!?.length; i++) {
    //   var contenido = this.disenos![i]
    // }
  }

  setMinFecha() {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = ('0' + (hoy.getMonth() + 1)).slice(-2); // Meses de 01 a 12
    const dia = ('0' + hoy.getDate()).slice(-2); // Días de 01 a 31

    // Construir la fecha mínima en formato YYYY-MM-DD
    this.minFecha = `${anio}-${mes}-${dia}`;
  }

  nuevaBorrarSeleccion(borrar: boolean): void {
    this.hayQueBorrar = borrar;
    if (this.hayQueBorrar) {
      this.borrarSeleccion();
      this.filtrarPedidos();
    }
  }

  habilitarTipos(nombre: string): void {
    var seleccionTipos = this.seleccionTiposCaja
      .nativeElement as HTMLFieldSetElement;

    if (seleccionTipos) {
      seleccionTipos.disabled = false;
    }

    this.filtrarPorTamano(nombre, '');
  }
  habilitarCajas(nombre: string, tipo: string): void {
    this.deshabilitado = false;

    this.filtrarPorTamano(nombre, tipo);
  }

  async GetTiposCajasAsync(): Promise<void> {
    this.tipos = await this.stockService.getTiposCajasAsync().toPromise();
  }

  async GetTamanoCajasAsync(): Promise<void> {
    this.tamanos_cajas = await this.stockService
      .getTamanoCajasAsync()
      .toPromise();
  }

  async GetDisenosAsync(): Promise<void> {
    this.disenos = await this.stockService.getDisenosAsync().toPromise();
  }

  async GetCajasAsync(): Promise<void> {
    this.cajas = await this.stockService.getCajasAsync().toPromise();
  }

  async getStockCajasAsync(): Promise<void> {
    this.stock = await this.stockService.getStockCajasAsync().toPromise();
  }

  async getOrdenesArmadoAsync(): Promise<void> {
    this.ordenArmado = await this.stockService
      .getOrdenesArmadoAsync()
      .toPromise();
  }

  async DeletePedido(idPedido: number): Promise<void> {
    try {
      await lastValueFrom(this.stockService.DeletePedido(idPedido));
    } catch (error) {
      console.error(error);
    }
  }

  async GetPedidosAsync(): Promise<void> {
    this.pedidosActivos = await this.stockService.GetPedidosAsync().toPromise();
  }

  async GetPedidosPadreAsync(): Promise<void> {
    try {
      this.pedidoPadreVer = await lastValueFrom(
        this.stockService.GetPedidosPadreAsync()
      );
    } catch (error) {
      console.error(error);
    }
  }

  async getOrdenesEntregaAsync(): Promise<void> {
    try {
      this.ordenEntrega = await lastValueFrom(
        this.stockService.getOrdenesEntregaAsync()
      );
    } catch (error) {
      console.error(error);
    }
  }

  valorInput: number = 0; // Variable que almacena el valor del input

  filtrarPedidos(): void {
    // this.cantidadAPedir = this.deepCopy(this.cantidades.filter( p => p.cantidad > 0));
    this.cantidadAPedir!.sort((a, b) => a.prioridad - b.prioridad);
  }

  private deepCopy<T>(obj: T): T {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepCopy(item)) as any;
    }

    const newObj: Partial<T> = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = this.deepCopy(obj[key]);
      }
    }

    return newObj as T;
  }

  borrarSeleccion(): void {
    this.tipoSeleccionado = '';
    this.tamanioSeleccionado = '';
    this.habilitarTipo = true;
    this.deshabilitado = true;
    // this.habilitado=true;
    this.llenarArrayCajas();
  }

  validarNumero(event: Event) {
    const input = event.target as HTMLInputElement;
    var valor: number = parseInt(input.value);

    let valorstr = valor.toString();
    if (valor < 0) {
      input.value = '0';
    }
  }

  //  Obtener id para luego buscar el nombre
  getidTamano(nombre: string): number {
    const idTamano = this.tamanos_cajas?.find((t) => t.nombre == nombre);

    return idTamano ? idTamano.id_Tamano : -1;
  }

  getidTamanoIdCaja(idCaja: number): number {
    const idTamano = this.cajas?.find((t) => t.id_Caja == idCaja);

    return idTamano ? idTamano.id_Tamano : -1;
  }

  getNombreTamanoIdTamano(idTamano: number): string {
    const nombre = this.tamanos_cajas?.find((t) => t.id_Tamano == idTamano);

    return nombre ? nombre.nombre : 'null';
  }

  getidDiseno(nombre: string): number {
    const idDiseno = this.disenos?.find((t) => t.nombre == nombre);

    return idDiseno ? idDiseno.id_Diseno : -1;
  }

  getidDisenoIdCaja(idCaja: number): number {
    const idDiseno = this.cajas?.find((t) => t.id_Caja == idCaja);

    return idDiseno ? idDiseno.id_Diseno : -1;
  }

  getNombreDisenoIdDiseno(idDiseno: number): string {
    const nombre = this.disenos?.find((t) => t.id_Diseno == idDiseno);

    return nombre ? nombre.nombre : 'null';
  }

  //  Obtener id caja
  getidCaja(tamano: number, diseno: number, tipo: number): number {
    const idCaja = this.cajas?.find(
      (t) => t.id_Tamano == tamano && t.id_Diseno == diseno && t.id_Tipo == tipo
    );
    return idCaja ? idCaja.id_Caja : -1;
  }

  mostrarPopUp(idDiseno: number, nombreDiseno: string) {
    if (this.validarPedido() == false) return;

    this.popUpVisible = true;
    this.idDiseno = idDiseno;
    this.nombreDiseno = nombreDiseno;
  }

  guardar() {
    //  Agrega el pedido

    if (this.cantidad != 0) {
      // Si no está esa caja en el pedido lo agrego, sino modifico la cantidad
      let existe = false;
      this.cantidadAPedir.forEach((c) => {
        if (
          c.nombreDisenio == this.nombreDiseno &&
          c.idDisenio == this.idDiseno &&
          c.tamano == this.tamanioSeleccionado &&
          c.tipo == this.tipoSeleccionado
        ) {
          c.cantidad = this.cantidad;
          existe = true;
        }
        // else{
        // }
      });

      // Si no existe esa caja la agrega, si existe le cambió la cantidad más arriba
      if (existe == false) {
        this.cantidadAPedir.push({
          idDisenio: this.idDiseno!,
          cantidad: this.cantidad,
          nombreDisenio: this.nombreDiseno!,
          tamano: this.tamanioSeleccionado!,
          tipo: this.tipoSeleccionado!,
          StockOProduccion: this.stockOProduccion!,
          prioridad: 0,
          idPedido: 0,
        });
      }

      // this.filtrarPedidos();
    }
    this.cerrarPopup(); // Cierra el popup después de guardar
  }

  cerrarPopup() {
    this.popUpVisible = false;
    this.cantidad = 0; // Reinicia la cantidad al cerrar el popup
  }

  guardarCantidad($event: number) {
    //  Esto pasa cuando se confirma la cantidad en el popup
    this.cantidad = 0;
    this.cantidad = $event;

    this.guardar();

    this.tamanioSeleccionado = '';
    this.tipoSeleccionado = '';
    this.habilitarTipo = true;
    this.deshabilitado = true;
    this.prioridad = -1;
  }

  async InsertPedidoAsync(pedido: Pedido[]): Promise<number> {
    try {
      return await lastValueFrom(this.stockService.InsertPedidoAsync(pedido));
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  async InsertPedidoPadreAsync(pedido: PedidoPadre[]): Promise<number> {
    try {
      return await lastValueFrom(
        this.stockService.InsertPedidoPadreAsync(pedido)
      );
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  async InsertOrdenArmadoAsync(orden: OrdenArmado[]): Promise<void> {
    try {
      await lastValueFrom(this.stockService.InsertOrdenArmadoAsync(orden));
    } catch (error) {
      console.error(error);
    }
  }

  async InsertOrdenEntregaAsync(orden: OrdenEntrega[]): Promise<void> {
    try {
      await lastValueFrom(this.stockService.InsertOrdenEntregaAsync(orden));
    } catch (error) {
      console.error(error);
    }
  }

  async UpdateStockAsync(stock: Stock[]): Promise<void> {
    try {
      await lastValueFrom(this.stockService.UpdateStockAsync(stock));
    } catch (error) {
      console.error(error);
    }
  }
  async UpdatePedido(pedido: Pedido[]): Promise<void> {
    try {
      await lastValueFrom(this.stockService.UpdatePedidoAsync(pedido));
    } catch (error) {
      console.error(error);
    }
  }
  async UpdateOrdenArmado(ordenArmado: OrdenArmado[]): Promise<void> {
    try {
      await lastValueFrom(
        this.stockService.UpdateOrdenArmadoAsync(ordenArmado)
      );
    } catch (error) {
      console.error(error);
    }
  }
  async UpdateOrdenEntrega(ordenEntrega: OrdenEntrega[]): Promise<void> {
    try {
      await lastValueFrom(
        this.stockService.UpdateOrdenEntregaAsync(ordenEntrega)
      );
    } catch (error) {
      console.error(error);
    }
  }

  getIdTipo(nombre: string): number {
    const idTipo = this.tipos?.find((t) => t.nombre == nombre);
    return idTipo ? idTipo.id_Tipo : -1;
  }
  getNombreTipoIdTipo(idTipo: number): string {
    const nombre = this.tipos?.find((t) => t.id_Tipo == idTipo);
    return nombre ? nombre.nombre : 'null';
  }

  getidTipoidCaja(idCaja: number): number {
    const id = this.cajas?.find((t) => t.id_Caja == idCaja);
    return id ? id.id_Tipo : -1;
  }

  getUrlDiseno(idDiseno: number): string {
    const url = this.disenos?.find((t) => t.id_Diseno == idDiseno);
    return url ? url.url : '';
  }

  getNombreDiseno(idDiseno: number): string {
    const nombre = this.disenos?.find((t) => t.id_Diseno == idDiseno);
    return nombre ? nombre.nombre : '';
  }

  // Valido si ya existe un pedido padre para ese dia con esa prioridad, si existe devulve true, sino false
  validarExistePedidoPadrePrioridad(): {
    resultado: boolean;
    idPedidoPadre: number;
  } {
    let resultado: boolean = false;
    let pedidos = this.pedidosActivos;
    let idPedidoPadre: number = -1;
    pedidos = pedidos!.filter(
      (p) =>
        formatDate(p.fecha_Pedido, 'dd-MM-yyyy', 'es-UY') ==
        formatDate(this.fechaFiltrada, 'dd-MM-yyyy', 'es-UY')
    );
    pedidos.forEach((p) => {
      const prioridad = this.pedidoPadreVer.find(
        (pp) =>
          pp.prioridad_Pedido_Padre == this.prioridadPedidoPadre &&
          pp.id_Pedido_Padre == p.id_Pedido_Padre
      );

      if (prioridad) {
        resultado = true;
        idPedidoPadre = prioridad.id_Pedido_Padre;
        endWith;
      }
    });
    return { resultado, idPedidoPadre };
  }

  async crearPedido() {
    //  Si idPedidoPadreInput == 0 significa que no está editando pedido sino que está creando uno, por lo tanto necesito insertarlo y saber el id
    // Si edita el pedido no necesito insertarlo, ya sé su id
    let idPedidoPadre: number = 0;
    console.log(this.idPedidoPadreInput);
    // if(this.idPedidoPadreInput==0){

    const validarExistePrioridad = this.validarExistePedidoPadrePrioridad();

    if (
      validarExistePrioridad.resultado == true &&
      validarExistePrioridad.idPedidoPadre != this.idPedidoPadreInput
    ) {
      alert(
        'Ya existe un pedido con la prioridad actual, elija una nueva prioridad para ingresar el pedido'
      );
      return;
    }

    //  Me fijo los pedidos que hay con ese idpadre para saber si borró alguno, si hay algun pedido que no esté en (cantidadapedir) es porque lo borró
    //  Por lo tanto debo borrarlo
    if (this.idPedidoPadreInput != 0) {
      let pedidoscreados = this.pedidosActivos?.filter(
        (pc) => pc.id_Pedido_Padre == this.idPedidoPadreInput
      );
      console.log(pedidoscreados);

      pedidoscreados!.forEach((pc) => {
        let borrarpedido = true;
        this.cantidadAPedir.forEach((ca) => {
          if (pc.id_Pedido == ca.idPedido) {
            borrarpedido = false;
            return;
          }
        });
        // Borra el pedido si es que no está en el nuevo pedido que hizo(si no lo está editando es porque lo borró)
        if (borrarpedido == true) {
          this.DeletePedido(pc.id_Pedido);
        }
      });
    }

    // Primero inserto el pedido padre y luego inserto pedidos porque uso la id del pedido padre en pedidos

    this.pedidoPadre.push({
      id_Pedido_Padre: 0,
      prioridad_Pedido_Padre: this.prioridadPedidoPadre,
    });

    if (this.idPedidoPadreInput == 0)
      idPedidoPadre = await this.InsertPedidoPadreAsync(this.pedidoPadre);

    // }else{
    if (this.idPedidoPadreInput != 0) {
      idPedidoPadre = this.idPedidoPadreInput;
      // this.borrarPedidoEditar();
    }
    // }

    this.cantidadAPedir.forEach(async (p, index) => {
      this.ordenArmadoPedido = [];
      this.pedido = [];
      this.ordenEntregaNuevo = [];
      this.pedidoPadre = [];

      let idpedido = p.idPedido;

      console.log();
      let stock = false;
      if (this.stockOProduccion == '1') {
        stock = true;
      } else if (this.stockOProduccion == '0') {
        stock = false;
      }
      // Si no está la caja la agrega al pedido, si está modifica la cantidad
      this.pedido.push({
        id_Pedido: idpedido,
        id_Caja: this.getidCaja(
          this.getidTamano(p.tamano),
          p.idDisenio,
          this.getIdTipo(p.tipo)
        ),
        fecha_Pedido: new Date(this.fechaFiltrada),
        prioridad: p.prioridad,
        stock_Pedido: p.cantidad,
        para_Stock: stock,
        estado: true,
        id_Pedido_Padre: idPedidoPadre,
      });

      // Este id pedido es de mientras, luego lo tiene que poner solo
      // let idPedido: number = await this.getIdUltimoPedido() +1 ;
      let idPedido: number = 0;

      let estaeditando: boolean = false;
      if (p.idPedido != 0) estaeditando = true;
      let stockD: number = this.getStockDisponible(
        this.getidCaja(
          this.getidTamano(p.tamano),
          p.idDisenio,
          this.getIdTipo(p.tipo)
        ),
        estaeditando,
        p.idPedido
      );

      let cajasAArmar: number;
      let restarStock: boolean = false;
      let cantidadNuevaStock: number;

      if (stockD > 0) {
        //  Si la cantidad que pide es igual o menor a la que hay disponible, no hay que armar cajas, simplemente se resta al stock esa cantidad
        if (p.cantidad <= stockD) {
          cajasAArmar = 0;
          restarStock = true;
          cantidadNuevaStock = stockD - p.cantidad;
        } else {
          cantidadNuevaStock = 0;
          cajasAArmar = p.cantidad - stockD;
          restarStock = true;
        }
      } else {
        cajasAArmar = p.cantidad;
        cantidadNuevaStock = 0;
      }

      // cajasAArmar = stockD - p.cantidad;

      if (this.pedido.length > 0) {
        try {
          //  Fijarme la orden de entrega cantidad entregada para setear y actualizarla
          const ordenEntregaEditar = this.ordenEntrega?.find(
            (oe) => oe.id_Pedido == p.idPedido
          );
          let cajasEntregadasExistentes: number = 0;
          if (ordenEntregaEditar) {
            cajasEntregadasExistentes = ordenEntregaEditar.cajas_Entregadas;
          }

          // Si lo que pide ya está entregado, borrar pedido
          if (p.cantidad <= cajasEntregadasExistentes) {
            console.log('pedido ');
            console.log(p.idPedido);
            await this.DeletePedido(p.idPedido);
            return;
          }
          if (p.idPedido == 0) {
            console.log('pedido==0');

            idPedido = await this.InsertPedidoAsync(this.pedido);
            this.ordenArmadoPedido = [];
            this.ordenArmadoPedido.push({
              id_Pedido: idPedido,
              cajas_A_Armar: cajasAArmar,
              cajas_Armadas: 0,
              id_Destino: 1,
            });

            this.ordenEntregaNuevo = [];
            this.ordenEntregaNuevo.push({
              id_Pedido: idPedido,
              cajas_A_Entregar: p.cantidad,
              cajas_Entregadas: 0,
            });
            try {
              this.InsertOrdenEntregaAsync(this.ordenEntregaNuevo);
            } catch (error) {}
            console.log(cajasAArmar);
            if (cajasAArmar > 0) {
              try {
                this.InsertOrdenArmadoAsync(this.ordenArmadoPedido);
              } catch (error) {
                console.log(error);
              }
            }
          } else {
            //  Chequeo si existe la orden de armado para ese pedido y si existe guardo el valor de cajas armadas
            const ordenArmadoEditar = this.ordenArmado?.find(
              (od) => od.id_Pedido == p.idPedido
            );
            let cajasArmadasExistente: number = 0;

            // Actualizo pedido
            this.UpdatePedido(this.pedido);

            // Calcula la cantidad de cajas a armar restsando las entregadas para que guarde el historial. Y se base solo en las que faltan
            // Sino no cuenta las que entregó y va a armar más de las que necesita
            if (ordenArmadoEditar) {
              cajasArmadasExistente = ordenArmadoEditar.cajas_Armadas;
              cajasAArmar = cajasAArmar - cajasEntregadasExistentes;
            }

            // Si no hay orden de armado con ese pedido la creo
            idPedido = p.idPedido;
            this.ordenEntregaNuevo = [];
            this.ordenEntregaNuevo.push({
              id_Pedido: idPedido,
              cajas_A_Entregar: p.cantidad,
              cajas_Entregadas: cajasEntregadasExistentes,
            });

            this.ordenArmadoPedido = [];
            this.ordenArmadoPedido.push({
              id_Pedido: idPedido,
              cajas_A_Armar: cajasAArmar,
              cajas_Armadas: 0,
              id_Destino: 1,
            });

            if (cajasAArmar > 0) {
              try {
                if (ordenArmadoEditar) {
                  // Update orden armado porque ya existe
                  this.UpdateOrdenArmado(this.ordenArmadoPedido);
                } else {
                  //  Inserto orden de armado
                  this.InsertOrdenArmadoAsync(this.ordenArmadoPedido);
                }
              } catch (error) {
                console.log(error);
              }
            }
            try {
              if (ordenEntregaEditar) {
               
                this.UpdateOrdenEntrega(this.ordenEntregaNuevo);
              } else {
                this.InsertOrdenEntregaAsync(this.ordenEntregaNuevo);
              }
            } catch (error) {}
          }
        } catch (error) {
          // Captura de errores en caso de que ocurran en cualquiera de las llamadas
          console.error('Error al crear pedido:', error);
        }
      } else {
        alert('No se agregó ningun pedido');
      }
    });

    this.borrarPedido();
    this.borrarSeleccion();

    await this.iniciar();

    if (this.estaEditandoPedido == true) {
      this.router.navigate(['principal/produccion/stockCajas/pedidosActivos']);
    }
  }

  validarPedido(): boolean {
    let valor = true;

    if (this.tamanioSeleccionado == '' || this.tamanioSeleccionado == null) {
      alert('Debe seleccionar el tamaño de la caja');
      valor = false;
    } else if (this.tipoSeleccionado == '' || this.tipoSeleccionado == null) {
      alert('Debe seleccionar el Tipo de la Caja');
      valor = false;
    } else if (
      this.stockOProduccion == undefined ||
      this.stockOProduccion == null
    ) {
      alert('Debe seleccionar si es para Stock o para Producción');
      valor = false;
    }
    return valor;
  }

  borrarPedido() {
    this.cantidadAPedir = [];
    this.tamanioSeleccionado = '';
    this.tipoSeleccionado = '';
    this.popUpOrdenGrande = false;
    this.borrarSeleccion();
  }

  eliminarOdPedido(pedido: CajaDisenioPedido) {
    var indice = this.cantidadAPedir.indexOf(pedido);
    this.cantidadAPedir.splice(indice, 1);
  }

  filtrarPorTamano(tamanio: string, tipo: string) {
    //  Si tipo es vacio y tamanio está con valor solo buscar por tamano
    if (tipo == '' && tamanio != '') {
      this.llenarArrayCajas();
      this.cajasFiltro = this.cajasFiltro!.filter(
        (p) => p.id_Tamano == this.getidTamano(tamanio)
      );

      // Tamanio vacio y tipo con valor
    } else if (tamanio == '' && tipo != '') {
      this.llenarArrayCajas();
      this.cajasFiltro = this.cajasFiltro!.filter(
        (p) => p.id_Tipo == this.getIdTipo(tipo)
      );

      //  filtrar tamanio tipo
    } else if (tamanio != '' && tipo != '') {
      this.llenarArrayCajas();
      this.cajasFiltro = this.cajasFiltro!.filter(
        (p) =>
          p.id_Tamano == this.getidTamano(tamanio) &&
          p.id_Tipo == this.getIdTipo(tipo)
      );
    }

    // this.getStockDisponible(1);
  }

  getStockDisponible(
    idCaja: number,
    estaeditando: boolean,
    idPedido: number
  ): number {
    let stockDisponible: number = 0;
    let stockStock = 0;
    let stockPedido: number = 0;
    let stockOrdenArmado = 0;

    // Ver Stock desde tabla stock

    const stocks = this.stock?.find((t) => t.id_Caja == idCaja);
    stockStock = stocks!.stock;
    let pedidosActivos: Pedido[] | undefined = this.pedidosActivos;
    let ordenArmado: OrdenArmado[] | undefined = this.ordenArmado;

    //  Si está editando pedido excluye de los datos el id de pedido que está editando para no contarlo en el cálculo y hacerlo de nuevo
    if (estaeditando == true) {
      pedidosActivos = pedidosActivos?.filter((p) => p.id_Pedido != idPedido);
      ordenArmado = ordenArmado?.filter((od) => od.id_Pedido != idPedido);
    }
    pedidosActivos!.forEach((p) => {
      if (p.id_Caja == idCaja) {
        stockPedido = stockPedido + p.stock_Pedido;
      }
    });

    // for de todos los pedidos y de cada uno buscar la id de la caja y si es igual a esta idcaja ir sumando la cantidad de esa orden

    ordenArmado!.forEach((orden) => {
      pedidosActivos!.forEach((p) => {
        if (orden.id_Pedido == p.id_Pedido)
          if (p.id_Caja == idCaja) {
            stockOrdenArmado = stockOrdenArmado + orden.cajas_A_Armar;
          }
      });
    });

    // stockDisponible = stockStock - stockPedido - stockOrdenArmado;
    stockDisponible = stockStock - stockPedido;
    // stockDisponible = stockStock;

    return stockDisponible;
  }

  llenarArrayCajas() {
    //  Llenar array con cada valor que voy a mostrar para que sea más fácil de utilizar
    this.cajasFiltro = [];
    this.cajasFiltro = this.deepCopy(this.cajas);
  }

  //  Obtener id para luego buscar el nombre
  getCajasEntregadas(idPedido: number): number {
    const cajasEntregadas = this.ordenEntrega?.find(
      (t) => t.id_Pedido === idPedido
    );

    return cajasEntregadas ? cajasEntregadas.cajas_Entregadas : -1;
  }

  formatoFecha(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0'); // Obtener día y agregar cero a la izquierda si es necesario
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Obtener mes (se suma 1 porque los meses son base 0)
    const anio = fecha.getFullYear().toString(); // Obtener año

    return `${anio}-${mes}-${dia}`; // Formato dd/mm/yyyy
  }

  SetParaHoy() {
    this.fechaFiltrada = this.formatoFecha(this.fechaHoy);
    this.fechaActiva = true;
    this.stockOProduccion = '0';
  }

  activarFecha() {
    this.fechaActiva = false;
    this.stockOProduccion = '1';
  }

  guardarTamanoTipo($event: string) {
    if (this.tamanoTipo == 'Tamano') {
      if ($event != '') {
        this.tamanioSeleccionado = $event;
        this.habilitarTipo = false;
      }
    } else if (this.tamanoTipo == 'Tipo') {
      if ($event != '') {
        this.tipoSeleccionado = $event;

        this.deshabilitado = false;
      }
    }

    this.filtrarPorTamano(this.tamanioSeleccionado!, this.tipoSeleccionado!);
    this.popUpTamanoTipoVisible = false;
    this.tamanoTipo = '';
  }

  abrirPopUpTamanoTipo(tamanoTipo: string) {
    this.tamanoTipo = tamanoTipo;
    this.popUpTamanoTipoVisible = true;
  }

  async getIdUltimoPedido(): Promise<number> {
    let idPedido: number = -1;

    await this.GetPedidosAsync();

    this.pedidosActivos!.forEach((p) => {
      idPedido = p.id_Pedido;
      if (idPedido < p.id_Pedido) idPedido = p.id_Pedido;
    });

    return idPedido;
  }

  setPrioridad(prioridad: number) {
    this.prioridadPedidoPadre = prioridad;
    this.validarExistePedidoPadrePrioridad();
  }

  totalCajas(): number {
    let total_Cajas: number = 0;

    this.cantidadAPedir!.forEach((c) => {
      total_Cajas = total_Cajas + c.cantidad;
    });

    return total_Cajas;
  }

  getUrlCaja(idDisenio: number): string {
    const url = this.disenos?.find((t) => t.id_Diseno === idDisenio);
    return url ? url.url : '';
  }

  abrirPopUpGrande() {
    this.popUpOrdenGrande = true;
  }

  cerrarPopUpGrande() {
    this.popUpOrdenGrande = false;
  }

  desplegarPopUp() {
    this.desplegarPoUpVisible = !this.desplegarPoUpVisible; // Alterna el estado de visibilidad
  }

  cambiarPrioridad(numeroPrioridad: number, cantidad: CajaDisenioPedido) {
    //numeroPrioridad:number, nombreDiseno:string,idDisenio:number,tamano:string,tipo:string){
    this.cantidadAPedir.forEach((c) => {
      if (
        c.nombreDisenio == cantidad.nombreDisenio &&
        c.idDisenio == cantidad.idDisenio &&
        c.tamano == cantidad.tamano &&
        c.tipo == cantidad.tipo
      ) {
        let prioridadResultado = c.prioridad + numeroPrioridad;
        if (prioridadResultado >= 0) {
          c.prioridad = prioridadResultado;
        } else {
          alert('no se permite prioridad menor a cero');
        }
      }
    });

    this.filtrarPedidos();
  }
  cambiarPrioridadPadre(numeroPrioridad: number) {
    const resultado = this.prioridadPedidoPadre + numeroPrioridad;
    if (resultado >= 0) {
      this.prioridadPedidoPadre = resultado;
    } else {
      alert('No se permite ingresar una prioridad menor a 0');
    }
  }
  validarPrioridadPedidoPadre() {
    if (this.prioridadPedidoPadre < 0) {
      alert('No se permite ingresar una prioridad menor a cero');
      this.prioridadPedidoPadre = 0;
    }
  }

  setearFechaPrioridad() {
    const pedidos = this.pedidosActivos?.find(
      (t) => t.id_Pedido_Padre === this.idPedidoPadreInput
    );
    const fechaPedido = pedidos ? pedidos.fecha_Pedido : new Date();
    this.fechaFiltrada = this.formatoFecha2(fechaPedido);

    const pedidoPadre = this.pedidoPadreVer?.find(
      (t) => t.id_Pedido_Padre === this.idPedidoPadreInput
    );
    const prioridad = pedidoPadre ? pedidoPadre.prioridad_Pedido_Padre : -1;
    this.prioridadPedidoPadre = prioridad;

    const stockoproduccion = pedidos ? pedidos.para_Stock : -1;

    if (stockoproduccion == true) {
      this.stockOProduccion = '1';
      this.fechaActiva = false;
    } else {
      this.stockOProduccion = '0';
      this.fechaActiva = true;
    }
  }

  formatoFecha2(fecha: string | Date): string {
    // Convertir a objeto Date si es un string
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;

    const dia = fechaObj.getDate().toString().padStart(2, '0'); // Día con 0 a la izquierda
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0'); // Mes con 0 a la izquierda
    const anio = fechaObj.getFullYear().toString(); // Año

    return `${anio}-${mes}-${dia}`; // Formato yyyy-mm-dd
  }

  mostrarPedidosActivosEditar() {
    this.pedidosActivosEditar = [];
    this.pedidosActivosEditar = this.pedidosActivos?.filter(
      (e) => e.id_Pedido_Padre === this.idPedidoPadreInput
    );

    this.pedidosActivosEditar!.forEach((p) => {
      let stock: string = '';
      if (p.para_Stock == true) {
        stock = '1';
      } else {
        stock = '0';
      }

      this.cantidadAPedir.push({
        idDisenio: this.getidDisenoIdCaja(p.id_Caja),
        cantidad: p.stock_Pedido,
        nombreDisenio: this.getNombreDisenoIdDiseno(
          this.getidDisenoIdCaja(p.id_Caja)
        ),
        tamano: this.getNombreTamanoIdTamano(this.getidTamanoIdCaja(p.id_Caja)),
        tipo: this.getNombreTipoIdTipo(this.getidTipoidCaja(p.id_Caja)),
        StockOProduccion: stock,
        prioridad: p.prioridad,
        idPedido: p.id_Pedido,
      });
    });
    console.log(this.cantidadAPedir);
  }

  borrarPedidoEditar() {
    this.pedidoBorrar = [];
    this.pedidoBorrar = this.pedidosActivos!.filter(
      (p) => p.id_Pedido_Padre == this.idPedidoPadreInput
    );

    if (this.pedidoBorrar) {
      this.pedidoBorrar.forEach(async (p) => {
        try {
          await this.DeletePedido(p.id_Pedido);
          await this.getOrdenesArmadoAsync();
          await this.GetPedidosAsync();
          await this.getOrdenesEntregaAsync();
        } catch (error) {
          console.error(error);
        }
      });
    }
  }
}
