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

@Component({
  selector: 'crm-cotizacion-detail',
  templateUrl: './cotizacion-detail.component.html',
  styleUrl: './cotizacion-detail.component.css'
})
export class CotizacionDetailComponent implements OnChanges {

  //Propiedades
  public cotizacion!: Cotizacion;
  public idCotizacion: number = 0;
  @Input()
  public idCotizacionDetail: string | null = null;
  public detalleCotizacionList: DetalleCotizacion[] = [];
  public clienteList: Cliente[] = [];
  public usuarioList: Usuario[] = [];

  //State by show select
  public mostrarList: number = 0;

  //Terms of search
  public busquedaCliente: string = "";
  public busquedaUsuario: string = "";

  //States by edit cotización
  public clienteSeleccionado: number = 0;
  public usuarioSeleccionado: number = 0;
  public expirationDate?: Date;

  constructor(
    private _cotizacionService: CotizacionService,
    private detalleService: DetalleCotizacionService,
    private clienteSercive: ClienteService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute
  ) {

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.idCotizacionDetail = params.get('id');
      console.log('Id recibido desde la URL' + `${this.idCotizacionDetail}`)
      this.detalleCotizacionList = [];
      this.getCotizacionById(this.idCotizacionDetail);
      this.getDetalleCotizacion(this.idCotizacion);
      this.listarVariablesEconomicas();
      this.listarServicios();

    })

  }

  @ViewChild('selectContainer') selectContainer!: ElementRef;

  @HostListener('document:click', ['$event'])
  cerrarSelect(event: Event) {
    if (!this.selectContainer.nativeElement.contains(event.target)) {
      this.mostrarList = 0;
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.idCotizacionDetail = params.get('id');
      console.log('Id recibido desde la URL' + `${this.idCotizacionDetail}`)
      this.detalleCotizacionList = [];
      this.getCotizacionById(this.idCotizacionDetail);
      this.getDetalleCotizacion(this.idCotizacion);
    })

  }

  getCotizacionById(id: string | null) {
    if (id && id !== undefined) {
      this.idCotizacion = Number(id);
      this._cotizacionService.setLoading();
      this._cotizacionService.getCotizacionById(this.idCotizacion).subscribe({
        next: (data: responseApi<Cotizacion>) => {
          this.cotizacion = data.value;
          this.busquedaCliente = this.cotizacion.idClienteNavigation.nombreCompleto;
          this.busquedaUsuario = this.cotizacion.idUsuarioNavigation.nombreCompleto;
          this.clienteSeleccionado = this.cotizacion.idCliente;
          this.usuarioSeleccionado = this.cotizacion.idUsuario;
          this.listarSucursal(this.cotizacion.idCliente);
          this._cotizacionService.setLoading();
        },
        complete: () => {
          this.expirationDate = this.cotizacion?.expiracion;
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

  public getClienteList() {
    this.mostrarList = 1;
    if (this.clienteList.length === 0) {
      this.clienteSercive.getClientes().subscribe({
        next: (data: responseApi<Cliente[]>) => {
          if (data.success) {
            console.log(data.value);
          }
          return this.clienteList = this.clienteSercive.clientes;
        }
      })
    }
  }

  public getUserList() {
    this.mostrarList = 2;
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
      next: (data) => {  },
      complete: () => { },
      error: (error: any) => { console.error(error.message) }
    })
  }

  public getVendedorList(): void {
    this.mostrarList = 2;

  }

  public seleccionarCampo(choose: boolean): string | undefined {

    if (choose) {
      this._cotizacionService.clienteSeleccionado = this.clienteSeleccionado;
      console.log('Cliente seleccionado: ', this.clienteSeleccionado);
      const clienteEncontrado = this.clienteList.find(cliente => cliente.idCliente === this.clienteSeleccionado);
      if (clienteEncontrado) {
        this.busquedaCliente = clienteEncontrado.nombreCompleto
      }
    } else {
      this.usuarioService.usuarioSeleccionado = this.usuarioSeleccionado;
      console.log('Usuario seleccionado: ', this.usuarioSeleccionado);
      const usuarioEncontrado = this.usuarioList.find(usuario => usuario.idUsuario === this.usuarioSeleccionado);
      if (usuarioEncontrado) {
        this.busquedaCliente = usuarioEncontrado.nombreCompleto
      }
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

