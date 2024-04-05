import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments.prod';
import { HttpClient } from '@angular/common/http';
import { Cotizacion } from '../interfaces/cotizacion.interface';
import { catchError, pipe, tap, throwError } from 'rxjs';
import { coerceArray } from '@angular/cdk/coercion';
import { responseApi } from '../../shared/interfaces/response.interface';

@Injectable({providedIn: 'root'})
export class CotizacionService {

  public urlBase = environments.baseUrl;
  public cotizacionList:Cotizacion[] = [];
  public cotizacionById?: Cotizacion;
  public menuProfile: boolean = false;
  constructor(private http : HttpClient) {
    console.log("Servicio de countries");
  }

  // Se necesita el get all de cotización
  // Se necesita el get id de cotización
  //

  getAllCotizacion(){
    return this.http.get<responseApi<Cotizacion[]>>(`${this.urlBase}/api/Cotizacion`)
        .pipe(
          tap(cotizacion => this.cotizacionList = cotizacion.value),
          catchError((e:any) =>{ console.error(e); return throwError(e)})
        );
  }

  getCotizacionById(id:number){
    return this.http.get<Cotizacion>(`${this.urlBase}/api/Cotizacion/id?${id}`)
      .pipe(
        tap(cotizacion => {console.log(cotizacion); this.cotizacionById = cotizacion;}),
        catchError((e:any) => {console.error(e); return throwError(e)})
      );
  }

}
