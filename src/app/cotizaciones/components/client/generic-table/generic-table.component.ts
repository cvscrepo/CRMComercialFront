import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'crm-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.css'
})
export class GenericTableComponent {
  @Input()
  public columns: {key:string, value: string}[]=[];
  @Input()
  public values!: FormArray;
  @Input()
  public stateOf:boolean = false;
  @Output()
  public delete = new EventEmitter<any>();
  @Output()
  public detail = new EventEmitter<any>();

  public displayedColumns: string[] = [];

  constructor(){
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if(changes['columns'] && changes['values']){
  //     this.columns = changes['columns'].currentValue;
  //     this.displayedColumns = changes['columns'].currentValue.map((column: any) => column.key);
  //     console.log(this.values)
  //   }
  // }

  onDelete(value:any){
    this.delete.emit(value);
  }

  openDetail(value:any){
    console.log(value, "id Sucursal");
    const primeraKey = Object.keys(value)[0];
    const primerValor = value[primeraKey];
    console.log(primerValor);
    this.detail.emit(primerValor);
  }
}
