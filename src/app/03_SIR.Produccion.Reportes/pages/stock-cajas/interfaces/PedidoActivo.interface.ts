export interface PedidoActivo {

    idPedido: number;
    id_Pedido_Padre: number;
    idCaja: number;
    diseno: string;
    tamano: string;
    fecha_Pedido: Date;
    tipo: string;
    cantidadPedida: number;
    cantidadEntregados: number;
    estado: boolean;
    prioridad: number;
    prioridad_Pedido_Padre: number;
    paraStock: boolean;
}
