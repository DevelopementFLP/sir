import { SalidaDTO } from "./SalidaDTO.interface";

export interface CortesReporte {
    cuota:              SalidaDTO[];
    nocuota:            SalidaDTO[];
    delanteroNoCuota:   SalidaDTO[];
    traseroNoCuota:     SalidaDTO[];
    manta:              SalidaDTO[];
    delanteroCuota:     SalidaDTO[];
    traseroCuota:       SalidaDTO[];
}