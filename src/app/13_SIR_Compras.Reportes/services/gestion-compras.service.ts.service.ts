import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/Producto.interface';
import { urlCrearAlmacen, urlCrearAreaDestino, urlCrearAtributo, urlCrearCentroDeCosto, urlCrearDepartamento, urlCrearEmpresa, urlCrearEstadoDeSolicitud, urlCrearLineaDeSolicitud, urlCrearOrdenDeSolicitud, urlCrearPrioridadDeOrden, urlCrearProducto, urlCrearRolDeUsuario, urlCrearUnidadProducto, urlCrearUsuario, urlEditarAlmacen, urlEditarAreaDestino, urlEditarAtributo, urlEditarCentroDeCosto, urlEditarDepartamento, urlEditarEmpresa, urlEditarEstadoDeSolicitud, urlEditarLineaDeSolicitud, urlEditarOrdenDeSolicitud, urlEditarPrioridadDeOrden, urlEditarProducto, urlEditarRolDeUsuario, urlEditarUnidadProducto, urlEditarUsuario, urlEliminarAlmacen, urlEliminarAreaDestino, urlEliminarAtributo, urlEliminarCentroDeCosto, urlEliminarEmpresa, urlEliminarEstadoDeSolicitud, urlEliminarLineaDeSolicitud, urlEliminarOrdenDeSolicitud, urlEliminarPrioridadDeOrden, urlEliminarProducto, urlEliminarUnidadProducto, urlInsertPedido, urlListaDeAlmacenes, urlListaDeAreaDestinos, urlListaDeAtributos, urlListaDeCentroDeCostos, urlListaDeDepartamentos, urlListaDeEmpresas, urlListaDeEstadoDeSolicitudes, urlListaDeLineasDeSolicitud, urlListaDeOrdenesDeSolicitud, urlListaDePrioridadesDeOrden, urlListaDeProductos, urlListaDeRolesDeUsuario, urlListaDeUnidadProducto, urlListaDeUsuarios, urlUsuarios } from 'src/settings';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Almacen } from '../interfaces/Almacen.interface';
import { Unidad } from '../interfaces/Unidad.interface';
import { Usuario } from '../interfaces/Usuario.interface';
import { Rol } from '../interfaces/Rol.interface';
import { Departamento } from '../interfaces/Departamento.interface';
import { Empresa } from '../interfaces/Empresa.interface';
import { Atributos } from '../interfaces/Atributos.interface';
import { CentroDeCosto } from '../interfaces/CentroDeCosto.interface';
import { AreaDestino } from '../interfaces/AreaDestinto.interface';
import { EstadoDeSolicitud } from '../interfaces/EstadoDeSolicitud.interface';
import { Prioridad } from '../interfaces/Prioridad.interface';
import { OrdenDeSolicitud } from '../interfaces/OrdenDeSolicitud.interface';
import { LineadeSolicitud } from '../interfaces/LineaDeSolicitud.interface';
import { ListaUsuariosSir } from '../interfaces/ListaUsuariosSir.interface';

@Injectable({
  providedIn: 'root'
})
export class GestionComprasServiceTsService {


  getNombreDesdeId(
    id: any,
    array: any[],
    idPropiedad: string,
    nombrePropiedad: string
  ): string {
    const elemento = array.find((item) => item[idPropiedad] === id);
    return elemento ? elemento[nombrePropiedad] || '' : '';
  }


  constructor(private http: HttpClient) {}


  // Usuario Sir

  getListaDeUsuariosSirAsync(): Observable<ListaUsuariosSir[]> {
    return this.http.get<ListaUsuariosSir[]>(urlUsuarios);
  }

// Almacén
  getListaDeAlmacenesAsync(): Observable<Almacen[]> {
    return this.http.get<Almacen[]>(urlListaDeAlmacenes);
  }

  crearAlmacen(almacen: Almacen): Observable<number> {
    return this.http.post<number>(urlCrearAlmacen,almacen);
  }

  editarAlmacen(almacen: Almacen[]): Observable<Almacen[]> {
    return this.http.put<Almacen[]>(urlEditarAlmacen,almacen);
  }

  eliminarAlmacen(idAlmacen: number): Observable<void> {
    return this.http.delete<void>(`${urlEliminarAlmacen}?IdAlmacen=${idAlmacen}`);
  }

// Unidad
getListaDeUnidadProductoAsync(): Observable<Unidad[]> {
  return this.http.get<Unidad[]>(urlListaDeUnidadProducto);
}

crearUnidadProducto(unidad: Unidad): Observable<number> {
  return this.http.post<number>(urlCrearUnidadProducto,unidad);
}

editarUnidadProducto(unidad: Unidad[]): Observable<Unidad[]> {
  return this.http.put<Unidad[]>(urlEditarUnidadProducto,unidad);
}

eliminarUnidadProducto(idUnidad: number): Observable<void> {
  return this.http.delete<void>(`${urlEliminarUnidadProducto}?IdUnidad=${idUnidad}`);
}

// Usuarios

getListaDeUsuariosAsync(): Observable<Usuario[]> {
  return this.http.get<Usuario[]>(urlListaDeUsuarios);
}

crearUsuario(usuario: Usuario): Observable<number> {
  return this.http.post<number>(urlCrearUsuario,usuario);
}

editarUsuario(usuario: Usuario[]): Observable<Usuario[]> {
  return this.http.put<Usuario[]>(urlEditarUsuario,usuario);
}

// Rol de Usuario

getListaDeRolesDeUsuarioAsync(): Observable<Rol[]> {
  return this.http.get<Rol[]>(urlListaDeRolesDeUsuario);
}

crearRolDeUsuario(rol: Rol): Observable<number> {
  return this.http.post<number>(urlCrearRolDeUsuario,rol);
}

editarRolDeUsuario(rol: Rol[]): Observable<Rol[]> {
  return this.http.put<Rol[]>(urlEditarRolDeUsuario,rol);
}

// Departamento de Usuario

getListaDeDepartamentosAsync(): Observable<Departamento[]> {
  return this.http.get<Departamento[]>(urlListaDeDepartamentos);
}

crearDepartamento(departamento: Departamento): Observable<number> {
  return this.http.post<number>(urlCrearDepartamento,departamento);
}

editarDepartamento(departamento: Departamento[]): Observable<Departamento[]> {
  return this.http.put<Departamento[]>(urlEditarDepartamento,departamento);
}

// Producto

getListaDeProductosAsync(): Observable<Producto[]> {
  return this.http.get<Producto[]>(urlListaDeProductos);
}

crearProducto(producto: Producto): Observable<number> {
  return this.http.post<number>(urlCrearProducto,producto);
}

editarProducto(producto: Producto[]): Observable<Producto[]> {
  return this.http.put<Producto[]>(urlEditarProducto,producto);
}

eliminarProducto(idProducto: number): Observable<void> {
  return this.http.delete<void>(`${urlEliminarProducto}?IdProducto=${idProducto}`);
}

// Empresa

getListaDeEmpresasAsync(): Observable<Empresa[]> {
  return this.http.get<Empresa[]>(urlListaDeEmpresas);
}

crearEmpresa(empresa: Empresa): Observable<void> {
  return this.http.post<void>(urlCrearEmpresa,empresa);
}

editarEmpresa(empresa: Empresa[]): Observable<Empresa[]> {
  return this.http.put<Empresa[]>(urlEditarEmpresa,empresa);
}

eliminarEmpresa(idEmpresa: number): Observable<void> {
  return this.http.delete<void>(`${urlEliminarEmpresa}?IdEmpresa=${idEmpresa}`);
}

// Atributos

getListaDeAtributossync(): Observable<Atributos[]> {
  return this.http.get<Atributos[]>(urlListaDeAtributos);
}

crearAtributo(atributo: Atributos): Observable<number> {
  return this.http.post<number>(urlCrearAtributo,atributo);
}

editarAtributo(atributo: Atributos[]): Observable<Atributos[]> {
  return this.http.put<Atributos[]>(urlEditarAtributo,atributo);
}

eliminarAtributo(idAtributo: number): Observable<void> {
  return this.http.delete<void>(`${urlEliminarAtributo}?IdAtributo=${idAtributo}`);
}

// Centro de Costo

getListaDeCentroDeCostosasync(): Observable<CentroDeCosto[]> {
  return this.http.get<CentroDeCosto[]>(urlListaDeCentroDeCostos);
}

crearCentroDeCosto(centro: CentroDeCosto): Observable<number> {
  return this.http.post<number>(urlCrearCentroDeCosto,centro);
}

editarCentroDeCosto(centro: CentroDeCosto[]): Observable<CentroDeCosto[]> {
  return this.http.put<CentroDeCosto[]>(urlEditarCentroDeCosto,centro);
}

eliminarCentroDeCosto(idCentro: number): Observable<void> {
  return this.http.delete<void>(`${urlEliminarCentroDeCosto}?IdCentroDeCosto=${idCentro}`);
}

// Area de Destino


getListaDeAreaDestinosasync(): Observable<AreaDestino[]> {
  return this.http.get<AreaDestino[]>(urlListaDeAreaDestinos);
}

crearAreaDestino(id: AreaDestino): Observable<number> {
  return this.http.post<number>(urlCrearAreaDestino,id);
}

editarAreaDestino(id: CentroDeCosto[]): Observable<CentroDeCosto[]> {
  return this.http.put<CentroDeCosto[]>(urlEditarAreaDestino,id);
}

eliminarAreaDestino(id: number): Observable<void> {
  return this.http.delete<void>(`${urlEliminarAreaDestino}?IdAreaDestino=${id}`);
}


// Estado de Solicitud

getListaDeEstadoDeSolicitudesasync(): Observable<EstadoDeSolicitud[]> {
  return this.http.get<EstadoDeSolicitud[]>(urlListaDeEstadoDeSolicitudes);
}

crearEstadoDeSolicitud(estado: EstadoDeSolicitud): Observable<number> {
  return this.http.post<number>(urlCrearEstadoDeSolicitud,estado);
}

editarEstadoDeSolicitud(estado: EstadoDeSolicitud): Observable<EstadoDeSolicitud> {
  return this.http.put<EstadoDeSolicitud>(urlEditarEstadoDeSolicitud,estado);
}

eliminarEstadoDeSolicitud(idEstado: number): Observable<void> {
  return this.http.delete<void>(`${urlEliminarEstadoDeSolicitud}?idEstadoDeSolicitud=${idEstado}`);
}




// Prioridad De Orden
getListaDePrioridadesDeOrdenesasync(): Observable<Prioridad[]> {
  return this.http.get<Prioridad[]>(urlListaDePrioridadesDeOrden);
}

crearPrioridadDeOrden(prioridad: Prioridad): Observable<number> {
  return this.http.post<number>(urlCrearPrioridadDeOrden,prioridad);
}

editarPrioridadDeOrden(prioridad: Prioridad): Observable<Prioridad> {
  return this.http.put<Prioridad>(urlEditarPrioridadDeOrden,prioridad);
}

eliminarPrioridadDeOrden(idPrioridad: number): Observable<void> {
  return this.http.delete<void>(`${urlEliminarPrioridadDeOrden}?idPrioridadDeOrden=${idPrioridad}`);
}


//  Orden de Solicitud
getListaDeOrdenesDeSolicitudasync(): Observable<OrdenDeSolicitud[]> {
  return this.http.get<OrdenDeSolicitud[]>(urlListaDeOrdenesDeSolicitud);
}

crearOrdenDeSolicitud(orden: OrdenDeSolicitud): Observable<OrdenDeSolicitud> {
  return this.http.post<OrdenDeSolicitud>(urlCrearOrdenDeSolicitud,orden);
}


editarOrdenDeSolicitud(orden: OrdenDeSolicitud): Observable<OrdenDeSolicitud> {
  return this.http.put<OrdenDeSolicitud>(urlEditarOrdenDeSolicitud,orden);
}

eliminarOrdenDeSolicutd(idOrden: number): Observable<void> {
  return this.http.delete<void>(`${urlEliminarOrdenDeSolicitud}?idOrdenDeSolicitud=${idOrden}`);
}


// Linea de Solicitud

getListaDeLineasSolicitudasync(): Observable<LineadeSolicitud[]> {
  return this.http.get<LineadeSolicitud[]>(urlListaDeLineasDeSolicitud);
}

CrearLineaDeSolicitud(linea: LineadeSolicitud[]): Observable<LineadeSolicitud> {
  return this.http.post<LineadeSolicitud>(urlCrearLineaDeSolicitud,linea);
}


EditarLineaDeSolicitud(linea: LineadeSolicitud): Observable<LineadeSolicitud> {
  return this.http.put<LineadeSolicitud>(urlEditarLineaDeSolicitud,linea);
}

EliminarLineaDeSolicitud(idLinea: number): Observable<void> {
  return this.http.delete<void>(`${urlEliminarLineaDeSolicitud}?idLineaDeSolicitud=${idLinea}`);
}

}
