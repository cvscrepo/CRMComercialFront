import { Component, Input } from '@angular/core';
import { CotizacionService } from '../../../services/cotizacion.service';
import { responseApi } from '../../../../shared/interfaces/response.interface';
import { Cotizacion } from '../../../interfaces/cotizacion.interface';

@Component({
  selector: 'crm-create-and-edit-button',
  templateUrl: './create-and-edit-button.component.html',
  styleUrl: './create-and-edit-button.component.css'
})
export class CreateAndEditButtonComponent {
  @Input()
  public typeButtons: number = 1;

  constructor(private cotizacionService:CotizacionService){

  }

  getLoading(){
    return this.cotizacionService.loading;
  }

  guardar(){
    this.cotizacionService.setLoading();
    this.cotizacionService.editarCotizacion()?.subscribe({
      next: (data: responseApi<Cotizacion>) => {
        if(data.success){
          console.log(data.value);
          setTimeout(() => {
            this.cotizacionService.setLoading();
            this.typeButtons = 2;
            this.cotizacionService.isDisabled = false
          }, 2000);
        }
      }
    })
  }

  public editCotizacion(){
    this.cotizacionService.setEditMode();
    this.typeButtons = 3;
  }

  public discartChanges(){
    this.cotizacionService.isDisabled = false;
    this.typeButtons = 2;
    window.location.reload();
  }
}
