
import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'crm-cotizacion-detail',
  templateUrl: './cotizacion-detail.component.html',
  styleUrl: './cotizacion-detail.component.css'
})
export class CotizacionDetailComponent implements OnInit {

  public idCotizacion: number = 0;
  @Input()
  public idCotizacionDetail: string | null = null;

  //DetalleCotizacion
  public detalleCotizacionList: DetalleCotizacion[] = [];
  private dataSubscription!: Subscription;
  private subscriptionDetail!:Subscription;
  public columnsOfDetalleCotizacion:string[] = ['Servicio', 'Descripción', 'SUcursal', 'Cantidad', 'Subtotal', 'Eliminar'];

  public clienteList: Cliente[] = [];
  public usuarioList: Usuario[] = [];
  public titleOfNewCotizacion: string = '';
  //State by show select
  public mostrarList: number = 0;

  //Terms of search
  public busquedaCliente: string = "";
  public busquedaUsuario: string = "";

  //States by edit cotización
  public clienteSeleccionado: number = 0;
  public usuarioSeleccionado: number = 0;
  public expirationDate?: Date;

  //Nombre nueva cotizacion
  public nombreNewCotizacion: string = "";




  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    client: [0, [Validators.required]],
    user: [0, [Validators.required]],
    expirationDate: ['', [Validators.required]],
    termOfSearchClient: [''],
    termOfSearchUser: [''],
    userList: this.fb.array([]),
    clientList: this.fb.array([])
  })


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
        this.detalleCotizacionList = [];
        this._cotizacionService.nuevaCotizacion = false;
        this.getCotizacionById(this.idCotizacionDetail);
        this.getDetalleCotizacion(this.idCotizacion);
        this.listarVariablesEconomicas();
        this.listarServicios();

      } else {
        this._cotizacionService.setEditMode()
        this._cotizacionService.setNuevaCotizacion();
        this.listarVariablesEconomicas();
        this.listarServicios();

      }
    })
    this.getClienteList();
    this.getUserList();
  }

  @ViewChild('selectContainer') selectContainer!: ElementRef;

  @HostListener('document:click', ['$event'])
  cerrarSelect(event: Event) {
    if (!this.selectContainer.nativeElement.contains(event.target)) {
      this.mostrarList = 0;
    }
  }

  ngOnInit(): void {
    this.onTermsChanged();
    console.log(this.fieldOfForm.value)
    if (this._cotizacionService.nuevaCotizacion) {
      this.dataSubscription = this._cotizacionService.detalleCotizacionOfNewCotizacion.subscribe(
        newData => {
          console.log("OnInit", newData)
          this.detalleCotizacionList = newData
          // Mandar una lista de objetos que haga match con la lista de columnas
        }
      )
      // this.subscriptionDetail = this._cotizacionService.detalleCotizacionOfNewCotizacion.subscribe(
      //   data => {
      //     console.log('Detalle cotización de nueva cotización', data);
      //   }
      // )
    }
  }



  //Tareas pendientes
  // Crear una interface para las propiedades que cambian en una cotización
  // En el servicio almacenar un objeto cotización vácio y almacenar los valores cuando se vayan a listar, editar o cuando sea nuevo
  // Agregar validaciones al los forms, al crear una nueva cotización

  isTouchedField(field: string): boolean | null {
    return this.myForm.controls[field].touched;
  }

  markAsTouched(field: string) {
    return this.myForm.controls[field].markAsTouched();
  }

  get fieldOfForm() {
    return this.myForm.controls['clientList'].value! as FormArray;
  }
  onTermsChanged() {
    this.myForm.controls['termOfSearchClient'].valueChanges.pipe(

    )
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
    this.fieldOfForm.push(clientFormGroup);
  }



  getCotizacionById(id: string | null) {
    if (id && id !== undefined) {
      this.idCotizacion = Number(id);
      this._cotizacionService.setLoading();
      this._cotizacionService.getCotizacionById(this.idCotizacion).subscribe({
        next: (data: responseApi<Cotizacion>) => {
          this.busquedaCliente = data.value.idClienteNavigation.nombreCompleto;
          this.busquedaUsuario = data.value.idUsuarioNavigation.nombreCompleto;
          this.clienteSeleccionado = data.value.idCliente;
          this.usuarioSeleccionado = data.value.idUsuario;
          this.listarSucursal(data.value.idCliente);
          this._cotizacionService.setLoading();
          this.expirationDate = data.value.expiracion;
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
          this.detalleCotizacionList = data.value;
          console.log(this.detalleCotizacionList + "detalleCotizacionList");
        }
      },
      complete: () => {
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
          if (data.success) {
            console.log(data.value);

          }
          this.clienteList = this.clienteSercive.clientes;
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

  public listarVariablesEconomicas() {
    this._cotizacionService.listarVaraibles().subscribe({
      next: (data) => { }
    });
  }

  public listarSucursal(idCliente: number) {
    this._cotizacionService.listarSucursal(idCliente).subscribe({
      next: (data) => {

      },
      complete: () => {

      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }


  public listarServicios() {
    this._cotizacionService.listarServicios().subscribe({
      next: (data) => { },
      complete: () => { },
      error: (error: any) => { console.error(error.message) }
    })
  }

  public getVendedorList(): void {
    this.mostrarList = 2;

  }

  get cotizacionByIdValue() {
    return this._cotizacionService.cotizacionByIdValue;
  }

  public seleccionarCampo(choose: boolean): string | undefined {

    if (choose) {
      this._cotizacionService.clienteSeleccionado = this.clienteSeleccionado;
      console.log('Cliente seleccionado: ', this.clienteSeleccionado);
      const clienteEncontrado = this.clienteList.find(cliente => cliente.idCliente == this.clienteSeleccionado);
      console.log(this.clienteList);
      console.log(clienteEncontrado);
      this.listarSucursal(this.clienteSeleccionado);
      if (clienteEncontrado) {
        this.busquedaCliente = clienteEncontrado.nombreCompleto
        console.log(this.busquedaCliente);
      }
    } else {
      this._cotizacionService.vendedorSeleccionado = this.usuarioSeleccionado;
      console.log('Usuario seleccionado: ', this.usuarioSeleccionado);
      this.usuarioList.forEach(usuario => {
        if (usuario.idUsuario == this.usuarioSeleccionado) {
          this.busquedaUsuario = usuario.nombreCompleto
        }
      });
    }
    this.mostrarList = 0;
    return;
  }

  estadoChanged(state: number) {
    this._cotizacionService.estadoCotizacion = state;
    console.log(`Estado cambiado ${state}`);
  }

  onFechaSeleccionada() {
    this._cotizacionService.expirationDate = this.expirationDate;
    console.log("Se ha seleccionado la fecha:", this.expirationDate);
  }

  getLoading(): boolean {
    return this._cotizacionService.loading;
  }


}

