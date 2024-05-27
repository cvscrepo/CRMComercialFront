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
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  private formSubject = new BehaviorSubject<FormGroup | undefined>(undefined);
  private formStatesSubject = new BehaviorSubject<FormGroup | undefined>(undefined);

  constructor(
    private http: HttpClient,
    private route : Router,
    private fb: FormBuilder
  ) {
    this.initForm();
  }


  // Se necesita el get all de cotización
  // Se necesita el get id de cotización
  //


  private initForm() {
    const form = this.fb.group({
      idCotizacion: [0, [Validators.required]],
      nombre: ['', [Validators.required]],
      idCliente: [0, [Validators.required]],
      idUsuario: [0, [Validators.required]],
      expiracion: ['', [Validators.required]],
      descripcion: [''],
      comentarios: [''],
      estado: [0, [Validators.required]],
      detalleCotizacions: this.fb.array([])

    });
    this.formSubject.next(form);
    const myStates = this.fb.group({
      termOfSearchClient: [''],
      termOfSearchUser: ['']
    });
    this.formStatesSubject.next(myStates);
  }

  get form() {
    return this.formSubject.value;
  }

  get myFormStates() {
    return this.formStatesSubject.value;
  }

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
          this.form?.patchValue(cotizacion.value);

          //DetalleCotizacion to form group
          const detalleCotizacionArray = this.form?.get('detalleCotizacions') as FormArray;
          const termOfSearchClient = this.myFormStates!.controls['termOfSearchClient'];
          const termOfSearchUser = this.myFormStates!.get('termOfSearchUser');
          termOfSearchClient.setValue(cotizacion.value.idClienteNavigation.nombreCompleto);
          termOfSearchUser!.setValue(cotizacion.value.idUsuarioNavigation.nombreCompleto);
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

  get disabledState(){
    return this.isDisabled;
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
      console.log(this.form!.value);
      if (!this.cotizacionById) return;
      return this.http.put<responseApi<Cotizacion>>(`${this.urlBase}/api/Cotizacion`, this.form!.value)
        .pipe(
          tap(cotizacionEditada => { console.log(cotizacionEditada); return this.cotizacionById = cotizacionEditada.value }),
          catchError((e: any) => { console.error(e); return throwError(e) })
        )

  }

  updateForm(values: any) {
    this.form?.patchValue(values);
  }

  setForm(form: FormGroup) {
    this.formSubject.next(form);
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




