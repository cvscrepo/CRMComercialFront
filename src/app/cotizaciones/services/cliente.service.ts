import { Injectable } from '@angular/core';
import { envirnoments } from '../../../environments/environments';
import { Cliente } from '../interfaces/cliente.interface';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { responseApi } from '../../shared/interfaces/response.interface';

@Injectable({providedIn: 'root'})
export class ClienteService {

  //Url base
  public urlBase = envirnoments.baseUrl;

  //States
  public clientes: Cliente[]=[];
  public cliente?: Cliente;

  constructor(private http : HttpClient) {
    console.log("Servicio de clientes");
  }

  getClientes(){
    return this.http.get<responseApi<Cliente[]>>(`${this.urlBase}/api/Cliente`)
      .pipe(
        tap(data => this.clientes = data.value),
        catchError((e:any)=>{console.error(e); return throwError(e)})
      );
  };

  getClienteById(id:number){
    return this.http.get<responseApi<Cliente>>(`${this.urlBase}/api/Cliente/id?id=${id}`)
      .pipe(
        tap(data => this.cliente = data.value),
        catchError((e : any)=> {console.error(e); return throwError(e)})
      );
  };

}
