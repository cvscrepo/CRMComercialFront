import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CotizacionService } from '../../services/cotizacion.service';
import { responseApi } from '../../../shared/interfaces/response.interface';
import { Cotizacion } from '../../interfaces/cotizacion.interface';

@Component({
  selector: 'app-lista-cotizacion-page',
  templateUrl: './lista-cotizacion-page.component.html',
  styleUrl: './lista-cotizacion-page.component.css'
})
export class ListaCotizacionPageComponent {

  public total:number = 0;
  public datosCargados: boolean = false;
  public cotizacionList: Cotizacion[] = [];
  @Input()
  public termBusqueda:string = "";

  constructor(
    private _cotizacionSerivice : CotizacionService
  ){}

  emitValue(value: string){
    this.termBusqueda = value;
    console.log(this.termBusqueda + " Lista page");
  }

}
