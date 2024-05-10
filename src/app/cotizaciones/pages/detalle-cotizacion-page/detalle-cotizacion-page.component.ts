import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CotizacionService } from '../../services/cotizacion.service';
import { Cotizacion } from '../../interfaces/cotizacion.interface';
import { DetalleCotizacion } from '../../interfaces/detalleCotizacion.interface';

@Component({
  selector: 'app-detalle-cotizacion-page',
  templateUrl: './detalle-cotizacion-page.component.html',
  styleUrl: './detalle-cotizacion-page.component.css'
})
export class DetalleCotizacionPageComponent {


  public idCotizacionDetail: string | null = null;
  public Cotizacion!: Cotizacion;
  public idCotizacion: number |undefined;
  public detalleCotizacionList: DetalleCotizacion[] = [];

  // typeToolbar is 0 default create, 1 create and edit, 2 save and discard
  public typeToolbar: number = 2;
  public loadingComponent: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private _cotizacionService: CotizacionService
  ) { }

}
