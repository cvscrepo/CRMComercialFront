import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Cotizacion } from '../../interfaces/cotizacion.interface';
import { CotizacionService } from '../../services/cotizacion.service';
import { responseApi } from '../../../shared/interfaces/response.interface';
import { DetalleCotizacion } from '../../interfaces/detalleCotizacion.interface';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DetalleCotizacionService } from '../../services/detalleCotizacion.service';
import { Cliente } from '../../interfaces/cliente.interface';
import { ClienteService } from '../../services/cliente.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatFormFieldControl } from '@angular/material/form-field';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { ListaDetalleCotizacion } from '../../interfaces/listaDetalleCotizacion';

@Component({
  selector: 'crm-cotizacion-detail',
  templateUrl: './cotizacion-detail.component.html',
  styleUrl: './cotizacion-detail.component.css'
})
export class CotizacionDetailComponent implements OnInit, OnChanges {

  public idCotizacion: number = 0;
  @Input()
  public idCotizacionDetail: string | null = null;

  //DetalleCotizacion
  public detalleCotizacionList: ListaDetalleCotizacion[] = [];
  private dataSubscription!: Subscription;
  private subscriptionDetail!:Subscription;
  public columnsOfDetalleCotizacion:string[] = ['Servicio', 'Descripción', 'Sucursal', 'Cantidad', 'Subtotal', 'Eliminar'];

  public clienteList: Cliente[] = [];
  public usuarioList: Usuario[] = [];

  //Nombre nueva cotizacion
  public nombreNewCotizacion: string = "";

  public cotizacionID?:Cotizacion

  public myForm!: FormGroup;
  public myFormStates!: FormGroup;


  constructor(
    private _cotizacionService: CotizacionService,
    private detalleService: DetalleCotizacionService,
    private clienteSercive: ClienteService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.idCotizacionDetail = params.get('id');
      console.log('Id recibido desde la URL' + `${this.idCotizacionDetail}`)
      if (this.idCotizacionDetail !== null) {
        this._cotizacionService.nuevaCotizacion = false;
        this.getCotizacionById(this.idCotizacionDetail);
        this.getDetalleCotizacion(this.idCotizacion);

      } else {

        this._cotizacionService.isDisabled = true;
        this._cotizacionService.resetForm();
        this._cotizacionService.setNuevaCotizacion();
      }
    })
    this.myForm = this._cotizacionService.form!;
    this.myFormStates = this._cotizacionService.myFormStates!;
    this.getClienteList();
    this.getUserList();

    if(!this._cotizacionService.nuevaCotizacion){
      this._cotizacionService.form!.disable();
      this._cotizacionService.myFormStates!.disable();
    }else{

      this._cotizacionService.form!.enable();
      this._cotizacionService.myFormStates!.enable();
    }

  }


  ngOnInit(): void {
    if (this._cotizacionService.nuevaCotizacion) {
      // this.dataSubscription = this._cotizacionService.detalleCotizacionOfNewCotizacion.subscribe(
      //   newData => {
      //     this.detalleCotizacionList = newData;
      //     // Mandar una lista de objetos que haga match con la lista de columnas
      //   }
      // )
    }
    this._cotizacionService.form?.get('detalleCotizacions')?.valueChanges.subscribe(data => {
      console.log(data);
      this.detalleCotizacionList = data;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.myForm.valueChanges.subscribe(value => {
      this._cotizacionService.updateForm(value);
    })


  }

  @ViewChild('selectContainer') selectContainer!: ElementRef;

  @HostListener('document:click', ['$event'])
  cerrarSelect(event: Event) {
    if (!this.selectContainer.nativeElement.contains(event.target)) {
      this.myFormStates.controls['termOfSearchClient'].markAsUntouched();
      this.myFormStates.controls['termOfSearchUser'].markAsUntouched();
    }
  }


  //Tareas pendientes
  // Crear una interface para las propiedades que cambian en una cotización
  // En el servicio almacenar un objeto cotización vácio y almacenar los valores cuando se vayan a listar, editar o cuando sea nuevo
  // Agregar validaciones al los forms, al crear una nueva cotización

  isTouchedField(field: string): boolean | null {
    return this.myFormStates.get(field)!.touched;
  }

  markAsTouched(field: string) {
    return this.myFormStates.get(field)!.markAsTouched();
  }

  get fieldClientOfForm() {
    return ;
  }

  detalleCotizacionsToList(detalleCotizacionList: DetalleCotizacion[]): ListaDetalleCotizacion[] {

    return detalleCotizacionList.map(detalle => {
      return {
        Servicio: detalle.idServicioNavigation.nombre,
        Descripcion: detalle.detalleServicio,
        Sucursal: detalle.idSucursalNavigation.nombre,
        Cantidad: detalle.cantidadServicios,
        Subtotal: detalle.total
      }
    })
  }

  statusMyFormState():boolean {
   return this.myFormStates.status === 'INVALID';
  }

  stateChanged(event: number){
    const estado = this._cotizacionService.form!.get('estado');
    estado?.setValue(event);
  }

  get listClients() {
    return this.myForm.get('clientList') as FormArray;
  }

  public changeNameCotizacion(){
    this._cotizacionService.nombreCotizacion = this.nombreNewCotizacion;
    console.log(this._cotizacionService.nombreCotizacion);
  }

  private addClientToFormArray(cliente: Cliente) {
    const clientFormGroup = this.fb.group({
      idCliente: [cliente.idCliente, Validators.required],
      nombreCompleto: [cliente.nombreCompleto, Validators.required],
      // Agrega aquí otros campos necesarios
    });

  }

  resetMyForm(cotizacion:Cotizacion){
    this.myForm.reset(cotizacion);

  }

  getCotizacionById(id: string | null) {
    if (id && id !== undefined) {
      this.idCotizacion = Number(id);
      this._cotizacionService.setLoading();
      this._cotizacionService.getCotizacionById(this.idCotizacion).subscribe({
        next: (data: responseApi<Cotizacion>) => {
          // this.busquedaCliente = data.value.idClienteNavigation.nombreCompleto;
          // this.busquedaUsuario = data.value.idUsuarioNavigation.nombreCompleto;

          this.cotizacionID = data.value;
          this.listarSucursal(data.value.idCliente);
          this._cotizacionService.setLoading();
        },
        complete: () => {
        },
        error: (e) => {
          console.error(e);
        }
      });
    }
  }

  public getDetalleCotizacion(id: number) {
    this.detalleService.getDetalleCotizacionByIdCotizacion(id).subscribe({
      next: (data: responseApi<DetalleCotizacion[]>) => {
        if (data.success) {

        }
      },
      error: (e) => {
        console.log(`Error ${e.message}`)
      }
    })
  }

  public getDisabledState() {
    return this._cotizacionService.isDisabled;
  }

  public getNewCotizacionState() {
    return this._cotizacionService.nuevaCotizacion;
  }

  public getClienteList() {
    if (this.clienteList.length === 0) {
      this.clienteSercive.getClientes().subscribe({
        next: (data: responseApi<Cliente[]>) => {
          console.log(data.value, "clienteList");
          this.clienteList = data.value;
        }
      })
    }
  }

  public getUserList() {
    if (this.usuarioList.length === 0)
      this.usuarioService.getAllUsuarios().subscribe({
        next: (data: responseApi<Usuario[]>) => {
          if (data.success) {
            console.log(data.value);
          }
          return this.usuarioList = this.usuarioService.usuarios;
        }
      })
  }

  public listarSucursal(idCliente: number) {
    this._cotizacionService.listarSucursal(idCliente).subscribe({
      next: (data) => { console.log(data.value); },
      error: (e) => { console.error(e); }
    })
  }





  get cotizacionByIdValue() {
    return this._cotizacionService.cotizacionByIdValue ;
  }

  public seleccionarCampo(choose: boolean): string | undefined {

    if (choose) {
      const clienteEncontrado = this.clienteList.find(cliente => cliente.idCliente == this.myForm.controls['idCliente'].value);
      this.listarSucursal(this.myForm.controls['idCliente'].value);
      if (clienteEncontrado) {
        console.log("hello")
        this.myFormStates.controls['termOfSearchClient'].setValue(clienteEncontrado.nombreCompleto);
        console.log(this.myForm);
        this.myFormStates.controls['termOfSearchClient'].markAsUntouched();
      }
    } else {
      this.usuarioList.forEach(usuario => {
        if (usuario.idUsuario == this.myForm.controls['idUsuario'].value) {
          // this.busquedaUsuario = usuario.nombreCompleto
          this.myFormStates.controls['termOfSearchUser'].setValue(usuario.nombreCompleto);
        }
        console.log('no entra')
      });
      this.myFormStates.controls['termOfSearchUser'].markAsUntouched();
    }

    return;
  };

  getLoading(): boolean {
    return this._cotizacionService.loading;
  }

  get estado(): number {
    return this._cotizacionService.form?.get('estado')?.value || 2;
  }

  get subtotal(): number {
    return this._cotizacionService.form?.value.detalleCotizacions?.reduce((acc: number, element:DetalleCotizacion) => acc + element.total, 0) || 0;
  }

  get valorIva(): number {
    return this._cotizacionService.form?.get('valorIva')?.value || 0;
  }

  get valorTotal(): number {
    return this._cotizacionService.form?.get('total')?.value || 0;
  }

  get valorNumeroDeCotizacion():number | undefined{
    return this._cotizacionService.form?.get('numeroDocumento')?.value;
  }
}

