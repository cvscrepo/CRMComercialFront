import { InvokeFunctionExpr } from '@angular/compiler';
import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, input } from '@angular/core';
import { CotizacionService } from '../../../services/cotizacion.service';
import { Router, UrlHandlingStrategy } from '@angular/router';

@Component({
  selector: 'crm-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrl: './tool-bar.component.css'
})
export class ToolBarComponent implements AfterViewInit, OnInit {

  //if the number type is 0, its the desault type, 1 detail type
  @Input()
  public type: number = 1;

  public title: string = "Cotizaciones";

  @Output()
  public termBusqueda:EventEmitter<string>= new EventEmitter<string>();

  constructor(
    private servicioCotizaciones : CotizacionService,
    private route : Router
  ){
  }

  ngOnInit(): void {
    this.servicioCotizaciones.cotizacionByIdSubject.subscribe(c => {
      if(c){
        this.title = c.nombre;
      }
    })
  }

  ngAfterViewInit(): void {
    if(this.route.url === "/cotizacion/list"){
      this.title = "Cotizaciones";
    }
    if(this.servicioCotizaciones.cotizacionById?.nombre){
      this.title = this.servicioCotizaciones.cotizacionById.nombre;
    }
  }

  setearNombre(){
    this.servicioCotizaciones.nombreCotizacion = this.title
  }

  recibirValores(valor:string):void{
    this.termBusqueda.emit(valor);
  }

  getDisabledState(){
    return this.servicioCotizaciones.isDisabled;
  }

}
