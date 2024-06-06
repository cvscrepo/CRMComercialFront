import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { envirnoments } from '../../../environments/environments';
import { responseApi } from '../../shared/interfaces/response.interface';
import { DetalleCotizacion } from '../interfaces/detalleCotizacion.interface';
import { UtilidadService } from '../../shared/services/utilidad.service';
import { CotizacionService } from './cotizacion.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class DetalleCotizacionService {
  //HttpUrl
  public urlBase: string = envirnoments.baseUrl;

  //States
  public detalleCotizacion: DetalleCotizacion[] = [];
  public detalleEditado?: DetalleCotizacion;
  public loading: boolean = false;

  constructor(
    private http: HttpClient,
    private _cotizacionService: CotizacionService,
    private fb: FormBuilder
  ) { }

  getDetalleCotizacionByIdCotizacion(id: number) {
    return this.http.get<responseApi<DetalleCotizacion[]>>(`${this.urlBase}/api/DetalleCotizacion/id?id=${id}`)
      .pipe(
        tap(detalleCotizacion => {
          console.log(detalleCotizacion.value, "Detalle Cotizacion");

          let detalleCotizacionArray = this._cotizacionService.form?.get('detalleCotizacions') as FormArray;

          // Limpiar el FormArray antes de agregar nuevos elementos
          while (detalleCotizacionArray.length) {
            detalleCotizacionArray.removeAt(0);
          }

          for (const detalleCotizacio of detalleCotizacion.value) {
            console.log("detalleCotizacionnn", detalleCotizacion);

            const detalleCotizacionFormGroup = this.fb.group({
              idDetalleCotizacion: [detalleCotizacio.idDetalleCotizacion, Validators.required],
              idServicio: [detalleCotizacio.idServicio , Validators.required],
              idSucursal: [detalleCotizacio.idSucursal , Validators.required],
              idCotizacion: [detalleCotizacio.idCotizacion , Validators.required],
              cantidadServicios: [detalleCotizacio.cantidadServicios , Validators.required],
              detalleServicio: [detalleCotizacio.detalleServicio],
              total: [detalleCotizacio.total],
              detalleCotizacionVariables: [detalleCotizacio.detalleCotizacionVariables, Validators.required],
              idServicioNavigation: [detalleCotizacio.idServicioNavigation, Validators.required],
              idSucursalNavigation: [detalleCotizacio.idSucursalNavigation, Validators.required],
            });

            detalleCotizacionArray.push(detalleCotizacionFormGroup);
          }

          return this.detalleCotizacion = detalleCotizacion.value;
        }),
        catchError((e: any) => { console.error(e); return throwError(e); })
      );
  }

  createDetalleCotizacion(detalleCotizacion: DetalleCotizacion) {
    return this.http.post<responseApi<DetalleCotizacion[]>>(`${this.urlBase}/api/DetalleCotizacion`, detalleCotizacion)
      .pipe(
        tap(detalleCotizacion => { console.log(detalleCotizacion.value, "Detalle Cotizacion"); return this.detalleCotizacion = detalleCotizacion.value }),
        catchError((e: any) => { console.error(e); return throwError(e) })
      );
  }

  editDetalleCotizacion(detalle: DetalleCotizacion): Observable<responseApi<DetalleCotizacion[]>> {
    return this.http.put<responseApi<DetalleCotizacion[]>>(`${this.urlBase}/api/DetalleCotizacion`, detalle)
      .pipe(
        tap(detalleEditado => { console.log(detalleEditado) }),
        catchError((e) => { console.error(e); return throwError(e) })
      )
  }

  deleteDetalleCotizacion(idDetllaeCotizacion: number): Observable<responseApi<boolean>> {
    return this.http.delete<responseApi<boolean>>(`${this.urlBase}/api/DetalleCotizacion?id=${idDetllaeCotizacion}`)
      .pipe(
        tap(data => {
          console.log(data);
        }),

      )
  }

  get detalleCotizacionList(): DetalleCotizacion[] {
    return this.detalleCotizacion;
  }

  public esFormatoHora(cadena: string): boolean {
    // Expresión regular para validar el formato HH:mm
    const formatoHoraRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    // Verificar si la cadena coincide con el formato de hora
    return formatoHoraRegex.test(cadena);
  }

  minutosAHora(minutos: number) {
    // Obtener las horas y los minutos
    var horas = Math.floor(minutos / 60);
    var minutosRestantes = minutos % 60;

    // Formatear las horas y los minutos
    var horasFormateadas = horas < 10 ? '0' + horas : horas;
    var minutosFormateados = minutosRestantes < 10 ? '0' + minutosRestantes : minutosRestantes;

    // Retornar el resultado
    return horasFormateadas + ':' + minutosFormateados;
  }

  horaAMinutos(hora: string): number {
    // Dividir la hora y los minutos
    const partes = hora.split(":");

    // Obtener las horas y los minutos como enteros
    const horas = parseInt(partes[0]);
    const minutos = parseInt(partes[1]);

    // Calcular el total de minutos
    const totalMinutos = horas * 60 + minutos;

    return totalMinutos;
  }

  listarHoras() {
    let listaHoras: string[] = [];
    if (listaHoras.length === 0) {
      for (let index = 0; index < 24; index++) {
        if (index.toString().length === 1) {
          listaHoras.push(`0${index}:00`);
          listaHoras.push(`0${index}:30`);
        } else {
          listaHoras.push(`${index}:00`);
          listaHoras.push(`${index}:30`);
        }
      }
    }
    return listaHoras;
  }


}
