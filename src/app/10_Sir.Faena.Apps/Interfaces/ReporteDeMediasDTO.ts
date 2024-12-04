export interface ReporteDeMediasProductosDTO{
    producto: string,
    grade: string,
    cuartos: number,
    pesoCuartos: number
}

export interface ReporteDeMediasProveedorDTO{
    proveedor: string,
    tropa: string,
    grade: string,
    medias: number,
    pesoMedias: number
}

export interface ReporteDeMediasGradeDTO{
    grade: string,
    medias: number,
    pesoMedias: number
}