import { Component, EventEmitter, Input, Output, output } from '@angular/core';

@Component({
  selector: 'crm-cotizacion-state',
  templateUrl: './cotizacion-state.component.html',
  styleUrl: './cotizacion-state.component.css'
})
export class CotizacionStateComponent {

  @Input()
  public estado:number = 2;
  @Input()
  public numeroCotizacion?: number = 1;
  @Input()
  public isDisabled?: boolean = true;

  constructor(){

    console.log("estado",this.estado)
  }
  @Output()
  public estadoChanged : EventEmitter<number> = new EventEmitter<number>();
  onClick(id:number){
    this.estado = id;
    this.estadoChanged.emit(this.estado);
  }

}
