export interface MensajeAlerta {
    header: string;
    mensaje: string;
    accion?: (param?: number) => void
}