import { ClienteService } from './../../services/cliente.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CotizacionService } from '../../services/cotizacion.service';
import { Cotizacion } from '../../interfaces/cotizacion.interface';
import { DetalleCotizacion } from '../../interfaces/detalleCotizacion.interface';
import { DetalleCotizacionService } from '../../services/detalleCotizacion.service';
import { responseApi } from '../../../shared/interfaces/response.interface';
import { Usuario } from '../../interfaces/usuario.interface';
import { Cliente } from '../../interfaces/cliente.interface';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-detalle-cotizacion-page',
  templateUrl: './detalle-cotizacion-page.component.html',
  styleUrl: './detalle-cotizacion-page.component.css'
})
export class DetalleCotizacionPageComponent  {

  public idCotizacionDetail: string | null = null;
  public cotizacionID?: Cotizacion;
  public idCotizacion: number = 0;
  public detalleCotizacionList: DetalleCotizacion[] = [];
  public clienteList: Cliente[] = [];
  public usuarioList: Usuario[] = [];
  public typeToolbar: number = 2;
  public loadingComponent: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private _cotizacionService: CotizacionService,
    private detalleService: DetalleCotizacionService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private _cotizacionSerivice: CotizacionService
  ) {
    this._cotizacionSerivice.isDisabled = false;
  }

  openCreateCotizacionDialog(){
    this._cotizacionSerivice.openCreateCotizacionDetail();
  }

}
