import { Component, Input } from '@angular/core';
import { CotizacionService } from '../../../services/cotizacion.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-selects-of-cotizacion',
  templateUrl: './selects-of-cotizacion.component.html',
  styleUrl: './selects-of-cotizacion.component.css'
})
export class SelectsOfCotizacionComponent {

  //Inputs
  @Input()
  public itemOfForm:string = '';

  //States
  public userState: boolean = false;
  public clientState: boolean = false;

  //List of items
  public optionsList: any[] = [];


  constructor(
    private _cotizacionService: CotizacionService
  ){

  }
  get disabledState(){
    return this._cotizacionService.isDisabled;
  }
}
