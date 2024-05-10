import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'crm-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  @Output()
  public termBusqueda: EventEmitter<string> = new EventEmitter<string>();

  submitValue(value : string){
    this.termBusqueda.emit(value);
  }
}
