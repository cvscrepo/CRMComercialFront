import { InvokeFunctionExpr } from '@angular/compiler';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'crm-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrl: './tool-bar.component.css'
})
export class ToolBarComponent {

  //if the number type is 0, its the desault type, 1 detail type
  @Input()
  public type: number = 0;
  @Input()
  public title: string = "Cotizaciones";

  constructor(){

  }
}
