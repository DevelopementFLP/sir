import { DataKosher } from "../Interfaces/DataKosher.interface";

export type GroupedDataKosher = Record<
string, // mercaderia
{
    totalPesoNeto: number; // Suma de pesoNeto para mercaderia
    totalPesoBruto: number; // Suma de pesoBruto para mercaderia
    containers: Record<
        string, // container
        {
            totalPesoNeto: number; // Suma de pesoNeto para container
            totalPesoBruto: number; // Suma de pesoBruto para container
            especies: Record<
                string, // especie
                {
                    totalPesoNeto: number; // Suma de pesoNeto para especie
                    totalPesoBruto: number; // Suma de pesoBruto para especie
                    tipoProductos: Record<
                        string, // tipoProducto
                        {
                            totalPesoNeto: number; // Suma de pesoNeto para tipoProducto
                            totalPesoBruto: number; // Suma de pesoBruto para tipoProducto
                            precios: Record<
                                number, // precioTonelada
                                {
                                    totalPesoNeto: number; // Suma de pesoNeto para precioTonelada
                                    totalPesoBruto: number; // Suma de pesoBruto para precioTonelada
                                    items: DataKosher[]; // Items para el precioTonelada
                                }
                            >
                        }
                    >
                }
            >
        }
    >
}
>;
