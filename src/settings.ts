export const urlAPI: string = "http://localhost:5205/api/";

//export const urlAPI: string = "http://192.168.0.107:82/api/";

export const urlUsuarios: string = urlAPI + "Usuarios";
export var urlUsuarioPorNombre: string = urlUsuarios + "/nombreUsuario";
export var urlUsuarioPorId: string = urlUsuarios + "/idUsuarionombreUsuario"
export const urlCambiarContrasenia: string = urlAPI + "User/CambiarContrasenia";
export const urlPCC: string = urlAPI + "Pcc";
export const urlPerfiles: string = urlAPI + "Perfiles";
export const urlReportes: string = urlAPI + "Reportes";
export const urlAccessos: string = urlAPI + "Accesos";
export const urlAccessosId: string = urlAccessos + "/";
export const urlModulos: string = urlAPI + "Modulos/";
export const urlAccesoPorIdUsuario: string = urlPerfiles + "/id/Reportes";
export const urlEnviarEmail: string = urlAPI + "Email/enviarEmail";
export const urlMarelEspecie: string = urlAPI + "MarelEspecie";
export const urlMarelDestino: string = urlAPI + "MarelDestino";
export const urlMarelDatosCaja: string = urlAPI + "MarelDatosCaja/getDatosCaja";
export const urlEntradaMarel: string = urlAPI + "MarelDatosCaja/GetEntradaMarel";
export const urlSalidasMarel: string = urlAPI + "MarelDatosCaja/GetSalidaMarel";
export const urlSalidaProduccion: string = urlAPI + "SalidaProduccion/salidasProduccionConFiltro";

// Accesos
export const urlAccesosReportes: string = urlAPI + "AccesosReportes/";
export const urlAccesosReportesPorUsuario: string = urlAccesosReportes + "GetAccesosReportesAsync";

// RRHH
export const urlRRHH: string = urlAPI + "RRHH/";
export const urlLogueoLineas: string = urlRRHH + "GetFuncionariosLogueados";
export const urlLoginHistorico: string = urlRRHH + "LoginHistoricoFuncionariosMarel";
export const urlHorarioFuncionario: string = urlRRHH + "GetHorarioFuncionario";
export const urlPadron: string = urlRRHH + "GetPadronFuncionarios";
export const urlUpdatePadron: string = urlRRHH + "ActualizarPadronFuncionarios";
export const urlEmpleados: string = urlRRHH + "GetEmpleados";
export const urlRegimen: string = urlRRHH + "GetRegimen";
export const urlConfHoras: string = urlRRHH + "GetConfHoras";
export const urlHorarioDesfasado: string = urlRRHH + "GetFuncionariosHorarioDesfasado";
export const urlUpdateHorariosDesfasados: string = urlRRHH + "ActualizarHorariosDesfasados";

// Dashboard Desosado Marel
export const urlDashboardDesosado: string = urlAPI + "DashboardDesosado/";
export const urlDashboardDesosadoEntrada: string = urlDashboardDesosado + "GetDetalleEntradaAsync";
export const urlDashboardDesosadoCharqueo: string = urlDashboardDesosado + "DetalleCharqueadoresAsync";
export const urlDashboardDesosadoHuesero: string = urlDashboardDesosado + "GetDetalleHueserosAsync";
export const urlDashboardDesosadoEmpaque: string = urlDashboardDesosado + "GetDetalleEmpaqueAsync";
export const urlDWDashboardDesosadoEntrada: string = urlDashboardDesosado + "SIRGetDetalleEntradaAsync";
export const urlDWDashboardDesosadoCharqueo: string = urlDashboardDesosado + "SIRDetalleCharqueadoresAsync";
export const urlDWDashboardDesosadoHuesero: string = urlDashboardDesosado + "SIRGetDetalleHueserosAsync";
export const urlDWDashboardDesosadoEmpaque: string = urlDashboardDesosado + "SIRGetDetalleEmpaqueAsync";
export const urlDWUpdateDashboardDesosadoEntrada: string = urlDashboardDesosado + "ActualizarDetalleEntradaAsync";
export const urlDWUpdateDashboardDesosadoCharqueo: string = urlDashboardDesosado + "ActualizarDetalleCharqueadoresAsync";
export const urlDWUpdateDashboardDesosadoHuesero: string = urlDashboardDesosado + "ActualizarDetalleHueserosAsync";
export const urlDWUpdateDashboardDesosadoEmpaque: string = urlDashboardDesosado + "ActualizarDetalleEmpaqueAsync";
export const urlDashboardDesosadoRefreshTime: string = urlDashboardDesosado + "GetRefreshTime";

// Configuración
export const urlConfigurationParameters: string = urlAPI + "Configuration/";
export const urlConfiguracionPorModulo: string = urlConfigurationParameters + "GetConfiguracionPorModuloAsync";
export const urlInactivarReporteConfiguracionParametro: string = urlConfigurationParameters + "InactivarReporteConfiguracionParametroAsync";
export const urlDeleteReporteConfiguracionParametro: string = urlConfigurationParameters + "DeleteReporteConfiguracionParametroAsync";
export const urlInsertReporteConfiguracionParametro: string = urlConfigurationParameters + "InsertReporteConfigurationParameterAsync";
export const urlActivarReporteConfiguracionParametro: string = urlConfigurationParameters + "ActivarReporteConfiguracionParametroAsync";
export const urlGetParametrosSeccionAbasto: string = urlAPI + "ParametrosDw_Abasto/GetParametrosSeccionAbasto";

// Control de Calidad
export const urlControlCalidad: string = urlAPI + "ControlCalidad/";
export const urlCCRechazoPH: string = urlControlCalidad + "InsertOrdinalesPhAsync";

// Dashboard Empaque Secundario
export const sirBaseUrl: string = urlAPI + 'DashboardEmpaqueSecundario/';
export const eagleBaseUrl: string = 'http://192.168.0.107:86/api';

// DWCajas
export const urlDwCajas: string = urlAPI + 'DwCajas/';
export const urlGetDwCajas: string = urlDwCajas + "GetCajasDW";

// Mantenimiento
export const urlMantenimiento: string = urlAPI + 'Mantenimiento/';
export const urlCabezasFaenadas: string = urlMantenimiento + "GetCabezasFaenadas";
export const urlTemperaturasC9C10: string = urlMantenimiento + 'GetTemperaturasCamaras910';

// Ingenieria
export const urlIngenieria: string = urlAPI + "Ingenieria/";
export const urlGetDatosScada: string = urlIngenieria + "GetDatosScadaAsync";
export const urlGetTiposDispositivo: string = urlIngenieria + "GetTiposDispositivosAsync";
export const urlGetUbicacionDispositivo: string = urlIngenieria + "GetUbicacionesAsync";
export const urlGetUnidadesMedida: string = urlIngenieria + "GetUnidadesMedidaAsync";
export const urlInsertTipoDispositivo: string = urlIngenieria + "InsertTipoDispositivoAsync";
export const urlInsertUbicaciones: string = urlIngenieria + "InsertUbicacionAsync";
export const urlInsertUnidadesMedidas: string = urlIngenieria + "InsertUnidadesMedidaAsync";
export const urlUpdateTipoDispositivo: string = urlIngenieria + "UpdateTipoDispositivoAsync";
export const urlUpdateUbicacion: string = urlIngenieria + "UpdateUbicacionAsync";
export const urlUpdateDatosScada: string = urlIngenieria + "UpdateDatosScadaAsync";
export const urlUpdateUnidadesMedida: string = urlIngenieria + "UpdateUnidadesMedidaAsync";
export const urlDeleteTipoDispositivo: string = urlIngenieria + "DeleteTipoDispositivoAsync";
export const urlDeleteUbicacion: string = urlIngenieria + "DeleteUbicacionAsync";
export const urlDeleteUnidadesMedida: string = urlIngenieria + "DeleteUnidadesMedidaAsync";

// Exportaciones
export const urlExportaciones: string = urlAPI + "Exportaciones/";
export const urlGetContainers: string = urlExportaciones + "GetIdCargaContainersAsync";
export const urlGetDataByContainer: string = urlExportaciones + "GetDataByContainersAsync";
export const urlGetTiposMoneda: string = urlExportaciones + "GetTipoMonedaAsync";
export const urlGetPreciosPorFechas: string = urlExportaciones + "GetPreciosPorFechaAsync";
export const urlGetPrecios: string = urlExportaciones + "GetPreciosAsync";
export const urlDeleteFechaPrecios: string = urlExportaciones + "DeleteListasPreciosAsync";
export const urlInsertarPrecios: string = urlExportaciones + "InsertListaPreciosAsync";
export const urlGetFechas: string = urlExportaciones + "GetFechasAsync";
export const urlGetCajasCarga: string = urlExportaciones + "GetCajasCargaAsync";
export const urlGetConfProductos: string = urlExportaciones + "GetConfProductosAsync";
export const urlInsertConfProductos: string = urlExportaciones + "InsertConfProductosAsync";
export const urlUpdateConfProductos: string = urlExportaciones + "UpdateConfProductosAsync";
export const urlDeleteConfProductos: string = urlExportaciones + "DeleteConfProductosAsync";
export const urlGetNombreProductoAsync: string = urlExportaciones + "GetNombreProductoAsync";
export const urlGetPrecioToneladaCodigoFechaAsync: string = urlExportaciones + "GetPrecioToneladaCodigoFechaAsync";
export const urlUpdateCodigoPreciosAsync: string = urlExportaciones + "UpdateCodigoPreciosAsync";

// Stock Cajas
export const urlStockCajas: string = urlAPI + "StockCajas/";
export const urlGetTiposCajas: string = urlStockCajas + "GetTiposCajasAsync";
export const urlGetTamanoCajas: string = urlStockCajas + "GetTamanoCajasAsync";
export const urlGetStockCajas: string = urlStockCajas + "GetStockCajasAsync";
export const urlGetPedidos: string = urlStockCajas + "GetPedidosAsync";
export const urlGetPedidosPadre: string = urlStockCajas + "GetPedidosPadreAsync";
export const urlgetOrdenesEntrega: string = urlStockCajas + "GetOrdenesEntregaAsync?estado=1"; 
export const urlGetOrdenesArmado: string = urlStockCajas + "GetOrdenesArmadoAsync?estado=1";
export const urlGetDisenos: string = urlStockCajas + "GetDisenosAsync";
export const urlGetCajas: string = urlStockCajas + "GetCajasAsync";
export const urlInsertPedido: string = urlStockCajas + "InsertPedidoAsync";
export const urlInsertPedidoPadre: string = urlStockCajas + "InsertPedidoPadreAsync";
export const urlInsertOrdenArmado: string = urlStockCajas + "InsertOrdenArmadoAsync";
export const urlInsertOrdenEntrega: string = urlStockCajas + "InsertOrdenEntregaAsync";
export const urlUpdatePrioridadPedido: string = urlStockCajas + "UpdatePrioridadPedidoAsync";
export const urlUpdatePedido: string = urlStockCajas + "UpdatePedidoAsync";
export const urlUpdatePedidoPadre: string = urlStockCajas + "UpdatePedidoPadreAsync";
export const urlUpdateOrdenArmadoCajasArmadas: string = urlStockCajas + "UpdateOrdenArmadoCajasArmadasAsync";
export const urlUpdateOrdenArmado: string = urlStockCajas + "UpdateOrdenArmadoAsync";
export const urlUpdateOrdenEntregaCajasEntregadas: string = urlStockCajas + "UpdateOrdenEntregaCajasEntregadasAsync";
export const urlUpdateOrdenentrega: string = urlStockCajas + "UpdateOrdenEntregaAsync";
export const urlUpdateStock: string = urlStockCajas + "UpdateStockAsync";
export const urlDeletePedido: string = urlStockCajas + "DeletePedidoAsync";

// Gecos
export const gecosAPI: string = "http://192.168.0.249:4477/";
var fechas = "?fechadesde=fd&fechahasta=fh"
export var gecosProduccion: string = gecosAPI + "produccion/salidas" + fechas;
export var gecosCarga: string = gecosAPI + "carga/productos" + fechas;
export var gecosFaena: string = gecosAPI + "faena/tipificacionchile" + fechas;
const gecosHacienda: string = gecosAPI + "hacienda/";
export var gecosHaciendaAnimales: string = gecosHacienda + "animales" + fechas;
export var gecosHaciendaLotes: string = gecosHacienda + "lotes" + fechas;
export var gecosHaciendaTipificacion: string = gecosHacienda + "tipificacion" + fechas;

// Productos Carga
export const urlProductosCargaGecos: string = urlAPI + "ProductosCarga/productosCarga";
export const urlProductosCarga: string = urlProductosCargaGecos + fechas;

// Gecos Integration Broker
export const urlGecosBroker = urlAPI + "GecosIntegrationBroker";

//Dispositivos
export const urlDispositivos: string = urlAPI + "Dispositivo/"
export const urlGetDispositivo: string = urlDispositivos + "ListaDispositivos/NA"
export const urlGetDispositivoPorId: string = urlDispositivos + "filtrarDispositivos"
export const urlCreateDispositivo: string = urlDispositivos + "crearDispositivos"
export const urlUpdateDispositivos: string = urlDispositivos + "actualizarDispositivos"
export const urlDeleteDispositivos: string = urlDispositivos + "eliminarDispositivo"

//Ubicaciones de Dispositivos
export const urlUbicacionesDispositivo: string = urlAPI + "UbicacionesDispositivos/"
export const urlGetUbicacionesDisp: string = urlUbicacionesDispositivo + "ListaUbicacionesDispositivos/NA"
export const urlCreateUbicacionDisp: string = urlUbicacionesDispositivo + "crearUbicacion"
export const urlUpdateUbicacionDisp: string = urlUbicacionesDispositivo + "actualizarUbicacionDispositivo"
export const urlDeleteUbicacionDisp: string = urlUbicacionesDispositivo + "eliminarUbicacionDispositivo"

//Formato de Dispositovo
export const urlFormatoDispositivo: string = urlAPI + "Formateos/"
export const urlGetFormatoDisp: string = urlFormatoDispositivo + "ListaFormatosDispositivos/NA"
export const urlCreateFormatoDisp: string = urlFormatoDispositivo + "crearFormato"
export const urlUpdateFormatoDisp: string = urlFormatoDispositivo + "actualizarFormato"
export const urlDeleteFormatoDisp: string = urlFormatoDispositivo + "eliminarFormato"

//Tipos de Dispositivos
export const urlTiposDispositivo: string = urlAPI + "TipoDispositivos/"
export const urlGetTipoDisp: string = urlTiposDispositivo + "ListaTiposDispositivos/NA"
export const urlCreateTipoDisp: string = urlTiposDispositivo + "crearTipoDispositivo"
export const urlUpdateTipoDisp: string = urlTiposDispositivo + "actualizarTipoDeDispositivo"
export const urlDeleteTipoDisp: string = urlTiposDispositivo + "eliminarTipoDispositivo"

//Lecturas de Dispositivos
export const urlLecturasDispositivo: string = urlAPI + "ListaDeCajas/"
export const urlGetLecturaDisp: string = urlLecturasDispositivo + "listaDeLecturas"
export const urlGetLecturaDispExpo: string = urlLecturasDispositivo + "listaDeExpoCarga"
export const urlGetListaDeCajasConError: string = urlLecturasDispositivo + "listaDeCajasConError"

//Merma por Peso
export const urlMermaPorPeso: string = urlAPI + "MermaPorPeso/"
export const urlGetMermaPorPeso: string = urlMermaPorPeso + "listaDeMermasPorPeso"

//Abasto
export const urlAbasto: string = urlAPI + "LecturasDeAbasto/"
export const urlGetListaDeLecturas: string = urlAbasto + "getListaDeLecturas"
export const urlGetLecturaFiltrada: string = urlAbasto + "getLecturaDeQr"
export const urlInsertarLecturaDeAbasto: string = urlAbasto + "insertarLecturaDeMedia"
export const urlGetVistaDeLecturasAbasto: string = urlAbasto + "listadoDeAbasto?fechaDelDia"
export const urlDeleteLecturaDeAbasto: string = urlAbasto + "eliminarLectura"


// Reporte Cuota
export const urlLoteEntrada: string = urlAPI + "LoteEntrada/";
export const urlCajaLote: string = urlAPI + "CajaLote/";
export const urlGetLotesEntrada: string = urlLoteEntrada + "GetLotesEntradaAsync";
export const urlGetCajasLote: string = urlCajaLote + "GetLotesEntradaAsync";
export const urlReporteCuota: string = urlAPI + "ReporteCuota/";
export const urlConfReporteCuota: string = urlReporteCuota + "GetConfReporteCuotaAsync";
export const urlTipoCuota: string = urlReporteCuota + "GetTipoCuotaAsync";
export const urlLotes: string = urlReporteCuota + "GetLotesAsync";
export const urlQamarks: string = urlReporteCuota + "GetQamarks";
export const urlDWCajaLote: string = urlCajaLote + "GetDWCajaLoteAsync";
export const urlDWCortesPorFecha: string = urlCajaLote + "GetDWCortesPorFechaYLoteAsync";
export const urlDWLoteEntrada: string = urlLoteEntrada + "GetDWEntradaAsync";
export const urlGetUltimaFechaEntrada: string = urlLoteEntrada + "GetUltimaFechaAsync";
export const urlExecInsertarDatosDW: string = urlReporteCuota + "InsertarDatosDWAsync";


//Reporte de medias Faena
export const urlFaena: string = urlAPI + "ReporteDeMedias/"
export const urlGetReporteDeMediasProducto: string = urlFaena + "reporteDeMediasPorProducto"
export const urlGetReporteDeMediasProveedor: string = urlFaena + "reporteDeMediasPorProveedor"
