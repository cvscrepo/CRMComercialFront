import { Subscription, catchError } from 'rxjs';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DetalleCotizacion } from '../../../interfaces/detalleCotizacion.interface';
import { CotizacionService } from '../../../services/cotizacion.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailCotizacionComponent } from '../../detail-cotizacion/detail-cotizacion.component';
import { DetalleCotizacionService } from '../../../services/detalleCotizacion.service';
import { UtilidadService } from '../../../../shared/services/utilidad.service';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'crm-lista-detalle-cotizacion',
  templateUrl: './lista-detalle-cotizacion.component.html',
  styleUrl: './lista-detalle-cotizacion.component.css'
})
export class ListaDetalleCotizacionComponent implements OnChanges, OnInit{
  @Input()
  public dataList:DetalleCotizacion[]=[];
  @Input()
  public displayedColumns: string[] = [];


  dataSource:DetalleCotizacion[] = [];

  constructor(
    private cotizacionService: CotizacionService,
    public dialog: MatDialog,
    private detalleCotizacionService: DetalleCotizacionService,
    private utilidadService: UtilidadService
  ){
  }

  ngOnInit(): void {
    if(this.cotizacionService.nuevaCotizacion){

      // this.subscription = this.cotizacionService.detalleCotizacionOfNewCotizacion.subscribe( data => {
      //   this.detalleCotizacionList = data
      //   this.dataSource = this.detalleCotizacionList;
      //   console.log("lista")
      //   console.log(this.dataSource);
      // })

    }

  }

  ngOnChanges(changes: SimpleChanges): void {

    this.dataSource = changes['dataList'].currentValue;
    console.log(this.dataSource);
    console.log("Change")

  }

  public getDisabledState(){
    return this.cotizacionService.isDisabled;
  }

  onSelectDetail(detalle :DetalleCotizacion, index : number):void{
    const dialogRef = this.dialog.open(DetailCotizacionComponent, {
      data : {detalle, editMode: this.getDisabledState(), index }
    });
  }

  onDeleteDetailCotizacion(detail : DetalleCotizacion, index: number){
    this.cotizacionService.setLoading();
    if(this.cotizacionService.nuevaCotizacion){
      const listaCotizacion = this.cotizacionService.getDetalleCotizacionToCreate();
      listaCotizacion.splice(index, 1);
      this.cotizacionService.setLoading();
      return;
    }
    this.detalleCotizacionService.deleteDetalleCotizacion(detail).subscribe({
      next: (data)=>{ this.utilidadService.mostrarAlerta("Detalle cotización eliminado con éxito", ":(", "bottom", "center");},
      complete: ()=> {this.cotizacionService.setLoading();},
      error: ()=> {this.utilidadService.mostrarAlerta("Detalle cotización no pudo ser eliminado", "Error!!!", "bottom", "center"); this.cotizacionService.setLoading()}
    });
  }

  getOrderedData(element: any):any[]{
    return this.displayedColumns.map((column)=> column !== 'Eliminar' ? element[column] : '');
  }
}
