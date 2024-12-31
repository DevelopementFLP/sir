export interface Producto{
    idProducto: number;
    codigoDeProducto: string;
    codigoDeProductoAlternativo: string;
    codigoDeProductoAlternativo2: string;
    fechaDeRegistro: Date;
    fechaDeActualizacion: Date;
    nombre: string;
    idUnidad: number;
    descripcion: string;
    activo: boolean;
}