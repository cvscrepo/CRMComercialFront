import { Component } from '@angular/core';
import { CotizacionService } from '../../../services/cotizacion.service';
import { DetalleCotizacionService } from '../../../services/detalleCotizacion.service';
import { Cotizacion } from '../../../interfaces/cotizacion.interface';
import { DetalleCotizacion } from '../../../interfaces/detalleCotizacion.interface';
import { ReportesService } from '../../../services/reportes.service';

@Component({
  selector: 'crm-print-and-action-button',
  templateUrl: './print-and-action-button.component.html',
  styleUrl: './print-and-action-button.component.css'
})
export class PrintAndActionButtonComponent {

  private cotizacion?: Cotizacion;
  private detalleCotizacionList: DetalleCotizacion[] = [];

  constructor(
    private _cotizacionService: CotizacionService,
    private _detalleCotizacionService: DetalleCotizacionService,
    private _reportesService: ReportesService
  ) { }

  public printButton() {
    this.cotizacion = this._cotizacionService.cotizacionByIdValue;
    this.detalleCotizacionList = this._detalleCotizacionService.detalleCotizacionList;
    if(this.cotizacion !== undefined && this.detalleCotizacionList !== undefined){
      this.cotizacion.detalleCotizacions = this.detalleCotizacionList;
      console.log(this.cotizacion);
      this._reportesService.getReporteCotizacion(this.cotizacion).subscribe({

      });
    }
  }

}
