import { InvokeFunctionExpr } from '@angular/compiler';
import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, input } from '@angular/core';
import { CotizacionService } from '../../../services/cotizacion.service';
import { Router, UrlHandlingStrategy } from '@angular/router';

@Component({
  selector: 'crm-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrl: './tool-bar.component.css'
})
export class ToolBarComponent implements AfterViewChecked, OnInit {

  //if the number type is 0, its the desault type, 1 detail type
  @Input()
  public type: number = 1;
  @Output()
  public createdCliked = new EventEmitter<void>();

  public title: string = "";

  @Output()
  public termBusqueda : EventEmitter<string>= new EventEmitter<string>();

  constructor(
    private servicioCotizaciones : CotizacionService,
    private route : Router
  ){}

  ngOnInit(): void {
    if(!this.servicioCotizaciones.disabledState){
      this.servicioCotizaciones.form?.disable();
    }
  }

  ngAfterViewChecked(): void {
    if(this.route.url === "/cotizacion/list"){
      this.title = "Lista de cotizaciones";
    }
    if(this.route.url === '/cotizacion/clients'){
      this.title = "Lista de clientes";
    }
    if(this.servicioCotizaciones.cotizacionById?.nombre){
      this.title = this.servicioCotizaciones.form!.get('nombre')?.value;
    }
  }

  setearNombre(){
    const titleOfCotizacion = this.servicioCotizaciones.form?.get('nombre');
    titleOfCotizacion?.setValue(this.title);
  }

  recibirValores(valor:string):void{
    this.termBusqueda.emit(valor);
  }

  getDisabledState(){
    return this.servicioCotizaciones.isDisabled;
  }

  onCreatedClicked(){
    console.log("Hello");
    this.createdCliked.emit();
  }
}
