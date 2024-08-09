export interface PedidoRecibido {
    idPedido: number;
    id_Pedido_Padre: number;
    idCaja: number;
    diseno: string;
    tamano: string;
    fecha_Pedido: Date;
    tipo: string;
    cantidadArmar: number;
    cantidadArmado: number;
    estado: boolean;
    prioridad: number;
    prioridad_Pedido_Padre: number;
}
