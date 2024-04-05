import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../interfaces/login.interface';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { responseApi } from '../../shared/interfaces/response.interface';
import { environments } from '../../../environments/environments.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public urlBase = environments.baseUrl;
  constructor(private http: HttpClient ) {
    console.log("Servicio de auth");
   }

   private token : string = "";

   iniciarSesion(usuario : Login): Observable<responseApi<string>> {
    return this.http.post<responseApi<string>>(`${this.urlBase}/api/Login/authenticate`, usuario)
      .pipe(
        tap((token:responseApi<string> )=> this.token = token.value),
        catchError((e:any)=> {console.error('Error de la solicitud', e); return throwError(e)})
      )
   }

   guardarSesión(token:string){
    localStorage.setItem("usuario", JSON.stringify(token));
   };

}
