import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CotizacionService } from '../../services/cotizacion.service';
import { responseApi } from '../../../shared/interfaces/response.interface';
import { Cotizacion } from '../../interfaces/cotizacion.interface';

@Component({
  selector: 'app-lista-cotizacion-page',
  templateUrl: './lista-cotizacion-page.component.html',
  styleUrl: './lista-cotizacion-page.component.css'
})
export class ListaCotizacionPageComponent implements OnInit {

  public total:number = 0;
  public datosCargados: boolean = false;
  public cotizacionList: Cotizacion[] = [];

  public termBusqueda:string = "";

  constructor(
    private _cotizacionSerivice : CotizacionService
  ){
    console.log("Lista cotizacion page");

  }

  ngOnInit(): void {

  }

  emitValue(value: string){
    this.termBusqueda = value;
  }

  openCreateCotizacionDialog(){
    this._cotizacionSerivice.openCreateCotizacionDetail();
  }

}
