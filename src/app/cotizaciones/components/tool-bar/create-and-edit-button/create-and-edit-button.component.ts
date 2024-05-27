import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Input()
  public newCotizacionObjetc?:Cotizacion;

  @Output() saveCotizacion = new EventEmitter<Cotizacion>();
  constructor(private cotizacionService:CotizacionService){

  }

  getLoading(){
    return this.cotizacionService.loading;
  }

  guardar(){
    this.cotizacionService.setLoading();
    if(this.cotizacionService.stateNuevaCotizacion){
      console.log("entró");
      this.cotizacionService.guardarCotizacion();
      this.cotizacionService.setLoading();
    }else{
      console.log("Estamos editando la cotización");
      console.log(this.cotizacionService.form);
      this.cotizacionService.editarCotizacion()?.subscribe({
        next: (data)=>{
          this.cotizacionService.setLoading();
          this.discartChanges();
        },
        error: (e)=>{
          console.error(e);
          this.cotizacionService.setLoading();

        }
      });
    }
  }

  public editCotizacion(){
    this.cotizacionService.setEditMode();
    this.cotizacionService.form!.enable();
    this.cotizacionService.myFormStates!.enable();
    this.typeButtons = 3;
  }

  public discartChanges(){
    this.cotizacionService.isDisabled = false;
    this.typeButtons = 2;
    window.location.reload();
  }
}
