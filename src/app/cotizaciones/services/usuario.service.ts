import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments.prod';
import { Usuario } from '../interfaces/usuario.interface';
import { HttpClient } from '@angular/common/http';
import { responseApi } from '../../shared/interfaces/response.interface';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UsuarioService {
  //URL base
  public urlBase = environments.baseUrl;


  //States
  public usuarios:Usuario[] = [];
  public usuarioById?:Usuario;
  public usuarioSeleccionado?: number;

  constructor(private http : HttpClient){
    console.log("Servicio de usuarios");
  }

  getAllUsuarios(){
    return this.http.get<responseApi<Usuario[]>>(`${this.urlBase}/api/Usuario`)
      .pipe(
        tap(data => this.usuarios = data.value),
        catchError((e:any) => {console.error(e); return throwError(e) })
      );
  };

  getUsuarioById(id:number){
    return this.http.get<responseApi<Usuario>>(`${this.urlBase}/api/Usuario/id?id=${id}`)
      .pipe(
        tap(data => this.usuarioById = data.value),
        catchError((e:any)=> {console.error(e);return throwError(e)})
      )
  };


}
