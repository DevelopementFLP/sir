// export const urlAPI: string = "http://192.168.0.107:82/api/";
export const urlAPI: string = "http://localhost:5205/api/";
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
export var urlAccesoPorIdUsuario: string = urlPerfiles + "/id/Reportes";
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

//Gecos
export const gecosAPI: string = "http://192.168.0.249:4477/";
var fechas = "?fechadesde=fd&fechahasta=fh"
export var gecosProduccion: string = gecosAPI + "produccion/salidas" + fechas;
export var gecosCarga: string = gecosAPI + "carga/productos" + fechas;
export var gecosFaena: string = gecosAPI + "faena/tipificacionchile" + fechas;
const gecosHacienda: string = gecosAPI + "hacienda/";
export var gecosHaciendaAnimales: string = gecosHacienda + "animales" + fechas;
export var gecosHaciendaLotes: string = gecosHacienda + "lotes" + fechas;
export var gecosHaciendaTipificacion: string = gecosHacienda + "tipificacion" + fechas;

//Gecos Integration Broker
export const urlGecosBroker = urlAPI + "GecosIntegrationBroker";