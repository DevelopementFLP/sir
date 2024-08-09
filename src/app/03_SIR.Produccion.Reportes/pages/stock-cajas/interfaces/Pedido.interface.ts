export interface Pedido {
    id_Pedido: number;
    id_Pedido_Padre: number;
    id_Caja: number;
    fecha_Pedido: Date;
    prioridad: number;
    stock_Pedido: number;
    para_Stock: boolean;
    estado: boolean;
}