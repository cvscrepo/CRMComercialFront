import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'crm-lateral-list',
  templateUrl: './lateral-list.component.html',
  styleUrl: './lateral-list.component.css'
})
export class LateralListComponent {
  public typeTable:number = 2;
  @Input()
  public termBusqueda: string = "";

  constructor(){
    console.log("Hello desde list")
  }

  recibirValores(valor:string):void{
    this.termBusqueda= valor;
  }
}
