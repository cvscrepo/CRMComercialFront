import { Usuario } from './../interfaces/usuario.interface';
import { Cliente } from './../interfaces/cliente.interface';
import { EventEmitter, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments.prod';
import { HttpClient } from '@angular/common/http';
import { Cotizacion, CotizacionDTO } from '../interfaces/cotizacion.interface';
import { BehaviorSubject, Observable, Subject, catchError, pipe, tap, throwError } from 'rxjs';
import { coerceArray } from '@angular/cdk/coercion';
import { responseApi } from '../../shared/interfaces/response.interface';
import { JsonPipe } from '@angular/common';
import { DetalleCotizacion, DetalleCotizacionVariable, VariablesEconomicasNavigation } from '../interfaces/detalleCotizacion.interface';
import { Servicio } from '../interfaces/servicio.interface';
import { Sucursal } from '../interfaces/sucursal.interface';
import { Route, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CotizacionService {

  //URL base
  public urlBase = environments.baseUrl;

  //States
  public cotizacionList: Cotizacion[] = [];
  public groupBy: Cotizacion[] = [];
  public cotizacionById?: Cotizacion;
  public cotizacionByIdSubject: Subject<Cotizacion> = new Subject<Cotizacion>();
  public detalleCotizacion: DetalleCotizacion[] = [];
  public listaServicios: Servicio[] = [];
  public listaSucursal: Sucursal[] = [];
  public listaVariablesEconomicas: VariablesEconomicasNavigation[] = [];

  // Editmode for all quatation
  public isDisabled: boolean = false;

  public busqueda: string = "";
  public clienteSeleccionado?: number;
  public vendedorSeleccionado?: number;
  public estadoCotizacion?: number;
  public expirationDate?: Date;
  public nombreCotizacion?: string;
  public loading: boolean = false;

  //Nueva cotizacion
  public nuevaCotizacion: boolean = false;
  public menuProfile: boolean = false;

  //DetalleCotizacion
  private detalleCotizacionToCreate = new BehaviorSubject<DetalleCotizacion[]>([]);
  data$ = this.detalleCotizacionToCreate.asObservable();

  constructor(
    private http: HttpClient,
    private route : Router
  ) {
    console.log("Servicio de countries");
  }


  // Se necesita el get all de cotización
  // Se necesita el get id de cotización
  //

  getAllCotizacion() {
    return this.http.get<responseApi<Cotizacion[]>>(`${this.urlBase}/api/Cotizacion`)
      .pipe(
        tap(cotizacion => this.cotizacionList = cotizacion.value),
        catchError((e: any) => { console.error(e); return throwError(e) })
      );
  }

  getCotizacionById(id: number) {
    return this.http.get<responseApi<Cotizacion>>(`${this.urlBase}/api/Cotizacion/id?id=${id}`)
      .pipe(
        tap(cotizacion => {
          this.cotizacionById = cotizacion.value;
          this.cotizacionByIdSubject.next(cotizacion.value);
        }),
        catchError((e: any) => { console.error(e); return throwError(e) })
      );
  }

  getValueOfDetalleCotizacion(detalleCotizacion:DetalleCotizacion){
    return this.http.post<responseApi<number>>(`${this.urlBase}/api/DetalleCotizacion/valor`, detalleCotizacion).pipe(
      tap((data) => {console.log(data)})
    );
  };

  saveEntireCotizacion(cotizacion:CotizacionDTO){
    return this.http.post<responseApi<Cotizacion>>(`${this.urlBase}/api/Cotizacion`, cotizacion)
    .pipe(
      tap((data)=> {
        console.log(data)
      })
    )
  }

  get detalleCotizacionOfNewCotizacion(){
    return this.detalleCotizacionToCreate;
  }

  get cotizacionByIdValue(){
    return this.cotizacionById;
  }

  getDetalleCotizacionToCreate(){
    return this.detalleCotizacionToCreate.getValue();
  }

  addData(newDetalle: DetalleCotizacion){
    const currentData = this.detalleCotizacionToCreate.getValue();
    currentData.push(newDetalle);
    this.detalleCotizacionToCreate.next(currentData);
  }

  setLoading(): void {
    this.loading = !this.loading;
  }

  setEditMode(): void {
    this.isDisabled = !this.isDisabled;
  }

  setNuevaCotizacion(): void {
    this.nuevaCotizacion = !this.nuevaCotizacion;
  }

  get stateNuevaCotizacion(): boolean {
    return this.nuevaCotizacion;
  }

  guardarCotizacion() {
      const fecha = new Date();
      //Propiedades
    console.log(this.clienteSeleccionado);
    console.log(this.vendedorSeleccionado);
    console.log(this.expirationDate);
    const cotizacionACrear: CotizacionDTO = {
      idCotizacion: 0,
      idCliente: this.clienteSeleccionado!,
      idUsuario: this.vendedorSeleccionado!,
      nombre: this.nombreCotizacion!,
      //Este editado por hay que colocar el usuario que está actualmente en la sesión
      descripcion: '',
      estado: 2,
      total: 0,
      detalleCotizacions: this.detalleCotizacionOfNewCotizacion.value
    }
    console.log(cotizacionACrear);
    this.saveEntireCotizacion(cotizacionACrear).subscribe({
      next: (data)=> {
        console.log(data.value);
        this.route.navigate(['./cotizacion/list']);
      },
      error: (e)=> {
        console.error(e);
      }
    });
  }

  editarCotizacion() {
    try {
      const cotizacionEditada: Cotizacion = {
        idCotizacion: this.cotizacionById!.idCotizacion,
        idCliente: this.clienteSeleccionado !== undefined ? this.clienteSeleccionado : this.cotizacionById!.idCliente,
        idUsuario: this.vendedorSeleccionado !== undefined ? this.vendedorSeleccionado : this.cotizacionById!.idUsuario,
        nombre: this.nombreCotizacion !== undefined ? this.nombreCotizacion : this.cotizacionById!.nombre,
        //Este editado por hay que colocar el usuario que está actualmente en la sesión
        editadoPor: this.cotizacionById!.editadoPor,
        descripcion: this.cotizacionById!.descripcion,
        estado: this.estadoCotizacion !== undefined ? this.estadoCotizacion : this.cotizacionById!.estado,
        expiracion: this.expirationDate !== undefined ? this.expirationDate : this.cotizacionById!.expiracion,
        nombreCliente: this.cotizacionById!.nombreCliente,
        emailCliente: this.cotizacionById!.emailCliente,
        vendedor: this.cotizacionById!.vendedor,
        valorIva: this.cotizacionById!.valorIva,
        total: this.cotizacionById!.total,
        createdAt: this.cotizacionById!.createdAt,
        updatedAt: this.cotizacionById!.updatedAt,
        numeroDocumento: this.cotizacionById!.numeroDocumento,
        detalleCotizacions: this.cotizacionById!.detalleCotizacions,
        idClienteNavigation: this.cotizacionById!.idClienteNavigation,
        idUsuarioNavigation: this.cotizacionById!.idUsuarioNavigation
      }
      console.log(cotizacionEditada);
      // if (!this.cotizacionById) return;
      // return this.http.put<responseApi<Cotizacion>>(`${this.urlBase}/api/Cotizacion`, cotizacionEditada)
      //   .pipe(
      //     tap(cotizacionEditada => { console.log(cotizacionEditada); return this.cotizacionById = cotizacionEditada.value }),
      //     catchError((e: any) => { console.error(e); return throwError(e) })
      //   )
    } catch (ex) {
      return console.log(ex);
    }
  }



  listarServicios(): Observable<responseApi<Servicio[]>> {
    return this.http.get<responseApi<Servicio[]>>(`${this.urlBase}/api/servicio`)
      .pipe(
        tap(
          data => {
            console.log(data);
            this.listaServicios = data.value;
          }),
        catchError((e: any) => { console.log(e.message); return throwError(e) })
      )
  }

  listarSucursal(idCliente: number): Observable<responseApi<Sucursal[]>> {
    return this.http.get<responseApi<Sucursal[]>>(`${this.urlBase}/api/Sucursal/id?id=${idCliente}`)
      .pipe(
        tap(data => { console.log(data.value); this.listaSucursal = data.value }),
        catchError((e: any) => { console.error(e.message); return throwError(e) })
      )
  }

  listarVaraibles(): Observable<responseApi<VariablesEconomicasNavigation[]>> {
    return this.http.get<responseApi<VariablesEconomicasNavigation[]>>(`${this.urlBase}/api/VariablesEconomicas`)
      .pipe(
        tap(data => { this.listaVariablesEconomicas = data.value }),
        catchError((e: any) => { console.error(e); return throwError(e) })
      )
  }
  // Filtrar lista cotizaciones por medio de terminos: nombre, cliente
  sortCotizacion(term: string): void {
    const cotizacionesOrdenadas: Cotizacion[] = [...this.cotizacionList]
    cotizacionesOrdenadas.sort((a, b) => {
      if (term === "nombre") {
        return a.nombre.localeCompare(b.nombre)
      } else if (term === "cliente") {
        return a.idClienteNavigation.nombreCompleto.localeCompare(b.idClienteNavigation.nombreCompleto)
      } else if (term === "total") {
        console.log("entró a total")
        return b.total - a.total;
      } else if (term === "estado") {
        return a.estado - b.estado;
      } else if (term === "fechaCreacion") {
        const fechaA = new Date(a.createdAt);
        const fechaB = new Date(b.createdAt);
        return fechaA.getDate() - fechaB.getDate()
      } else {
        throw new Error("Término de filtro no válido");
      }
    });

    localStorage.setItem("cotizaciones", JSON.stringify(cotizacionesOrdenadas));
  }

  sortOriginalCotizacion() {
    localStorage.setItem("cotizaciones", JSON.stringify(this.cotizacionList));
  }

}




