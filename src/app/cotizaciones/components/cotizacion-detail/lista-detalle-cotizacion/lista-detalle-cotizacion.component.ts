import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DetalleCotizacion } from '../../../interfaces/detalleCotizacion.interface';
import { CotizacionService } from '../../../services/cotizacion.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailCotizacionComponent } from '../../detail-cotizacion/detail-cotizacion.component';

@Component({
  selector: 'crm-lista-detalle-cotizacion',
  templateUrl: './lista-detalle-cotizacion.component.html',
  styleUrl: './lista-detalle-cotizacion.component.css'
})
export class ListaDetalleCotizacionComponent implements OnChanges{
  @Input()
  public detalleCotizacionList:DetalleCotizacion[]=[];

  displayedColumns: string[] = ['servicio', 'descripcion', 'sucursal', 'cantidad', 'total'];
  dataSource:DetalleCotizacion[] = [];
  constructor(
    private cotizacionService: CotizacionService,
    public dialog: MatDialog
  ){

  }

  ngOnChanges(changes: SimpleChanges): void {
      for(const change in changes){
        this.dataSource = changes['detalleCotizacionList'].currentValue;
        console.log( changes[change].currentValue, "hola")
      }
  }


  public getDisabledState(){
    return this.cotizacionService.isDisabled;
  }

  onSelectDetail(detalle :DetalleCotizacion):void{
    const dialogRef = this.dialog.open(DetailCotizacionComponent, {
      data : {detalle, editMode: this.getDisabledState() }
    });
  }

  openNewDetail(){
    const dialogRef = this.dialog.open(DetailCotizacionComponent, {
      data : { editMode: this.getDisabledState(), newDetail : true}
    });
  }
}
