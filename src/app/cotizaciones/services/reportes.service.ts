import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { envirnoments } from '../../../environments/environments';
import { Cotizacion } from '../interfaces/cotizacion.interface';
import { Observable, catchError, tap, throwError } from 'rxjs';


@Injectable({providedIn: 'root'})
export class ReportesService {

  //URL base
  public urlBase = envirnoments.baseUrl;
  constructor(private http: HttpClient) { }

  // Función para descargar reporte de cotización
  public getReporteCotizacion(cotizacion : Cotizacion): Observable<any>{
    return this.http.post(`${this.urlBase}/api/FormatoCotizacionPDF`, cotizacion, { responseType: 'blob'}).pipe(
      tap((data) => {
        // Handle successful response
        if (data.type === 'cotizacion/pdf') {
          const fileBlob = new Blob([data], { type: data.type });
          const fileUrl = URL.createObjectURL(fileBlob);
          saveAs(fileBlob, 'cotizacion.pdf');
        } else {
          console.error('Invalid response type:', data.type);
        }

      }),
      catchError((e) => { console.error(e);
        return throwError(e) })
    );
    ;
  }
}
