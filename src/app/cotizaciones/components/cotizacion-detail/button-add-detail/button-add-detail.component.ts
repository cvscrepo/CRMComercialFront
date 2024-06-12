import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetailCotizacionComponent } from '../../detail-cotizacion/detail-cotizacion.component';
import { CotizacionService } from '../../../services/cotizacion.service';

@Component({
  selector: 'crm-button-add-detail',
  templateUrl: './button-add-detail.component.html',
  styleUrl: './button-add-detail.component.css'
})
export class ButtonAddDetailComponent {
  @Input()
  public incompleteInfo: boolean = false;
  constructor(
    private dialog : MatDialog,
    private cotizacionService: CotizacionService
  ){
  }

  get disabledState(){
    return this.cotizacionService.isDisabled;
  }

  openNewDetail(){
    const dialogRef = this.dialog.open(DetailCotizacionComponent, {
      data : { editMode: this.disabledState, newDetail : true}
    });
  }
}
