import { Component, OnDestroy } from '@angular/core';
import { CotizacionService } from '../../services/cotizacion.service';

@Component({
  selector: 'app-new-cotizacion-page',
  templateUrl: './new-cotizacion-page.component.html',
  styleUrl: './new-cotizacion-page.component.css'
})
export class NewCotizacionPageComponent implements OnDestroy {

  constructor(private _cotizacionService: CotizacionService){

  }

  ngOnDestroy(): void {
    this._cotizacionService.nuevaCotizacion = false;
  }

}
