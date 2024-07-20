import { Injectable, OnInit } from '@angular/core';
import { envirnoments } from '../../../environments/environments';
import { Cliente } from '../interfaces/cliente.interface';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { responseApi } from '../../shared/interfaces/response.interface';
import { ClientDetailComponent } from '../components/client/client-detail/client-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({providedIn: 'root'})
export class ClienteService{


  //Url base
  public urlBase = envirnoments.baseUrl;


  //Forms
  public clientForm!: FormGroup;
  public sucursalForm!: FormGroup;

  //States
  public clienteSubject: BehaviorSubject<Cliente[]>= new BehaviorSubject<Cliente[]>([]);
  public clientes$: Observable<Cliente[]> = this.clienteSubject.asObservable();
  public cliente?: Cliente;

  constructor(
    private http : HttpClient,
    private dialog: MatDialog,
    private fb : FormBuilder
  ){
    console.log("Servicio de clientes");
    this.InitialForms();
  }
  InitialForms(): void {
    this.clientForm = this.fb.group({
      idCliente: [0],
      nit: [0, [Validators.required]],
      nombreCompleto: ['', [Validators.required]],
      nombreContacto: ['', [Validators.required]],
      email: ['', [Validators.required]],
      prospecto: [false],
      telefono: ['', [Validators.required]],
      createdAt: [''],
      uptadedAt: [''],
      sucursals: this.fb.array([])
    });

  }

  getClientes(){
    return this.http.get<responseApi<Cliente[]>>(`${this.urlBase}/api/Cliente`)
      .pipe(
        tap(data => this.clienteSubject.next(data.value)),
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

  createCliente(cliente: Cliente): Observable<responseApi<Cliente>> {
    return this.http.post<responseApi<Cliente>>(`${this.urlBase}/api/Cliente`, cliente)
      .pipe(
        tap(data => {
          const clientes = this.clienteSubject.value;
          clientes.push(data.value);
          this.clienteSubject.next(clientes);
        }),
        catchError((e) => {
          console.error(e);
          return throwError(e);
        })
      );
  }

  updateCliente(cliente: Cliente): Observable<responseApi<Cliente>> {
    return this.http.put<responseApi<Cliente>>(`${this.urlBase}/api/Cliente`, cliente)
      .pipe(
        tap(data => {
          const clientes = this.clienteSubject.value.map(c =>
            c.idCliente === data.value.idCliente ? data.value : c
          );
          this.clienteSubject.next(clientes);
        }),
        catchError((e) => {
          console.error(e);
          return throwError(e);
        })
      );
  }

  public openClienDetail(id:number|null=null){
    const dialogRef = this.dialog.open(ClientDetailComponent, {
      data : { idCliente: id}
    });
  }


}
