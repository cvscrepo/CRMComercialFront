import { Servicio } from "./servicio.interface";
import { Sucursal } from "./sucursal.interface";

export interface DetalleCotizacion {
  idDetalleCotizacion:          number;
  idCotizacion:                 number;
  idServicio:                   number;
  idSucursal:                   number;
  cantidadServicios:            number;
  detalleServicio:              string;
  total:                        number;
  createdAt:                    string;
  updatedAt:                    string;
  detalleCotizacionInventarios: any[];
  detalleCotizacionVariables:   DetalleCotizacionVariable[];
  idServicioNavigation:         Servicio;
  idSucursalNavigation:         Sucursal;
}

export interface DetalleCotizacionVariable {
  idDetalleCotizacionVariables:    number;
  idDetalleCotizacion:             number;
  idVariablesEconomicas:           number;
  valor:                           string;
  createdAt:                       string;
  updatedAt:                       null;
  idVariablesEconomicasNavigation: VariablesEconomicasNavigation;
}

export interface VariablesEconomicasNavigation {
  idVariablesEconomicas: number;
  createdBy:             number;
  updatedBy:             null;
  nombre:                string;
  descripcion:           string;
  valor:                 string;
  createdAt:             string;
  updatedAt:             null;
}

export enum DiasDeLaSemana{
  Lunes = "Lunes",
  Martes = "Martes",
  Miercoles = "Miercoles",
  Jueves = "Jueves",
  Viernes = "Viernes",
  Sabado = "Sabado",
  Domingo = "Domingo",
  Festivo = "Festivo"
}
