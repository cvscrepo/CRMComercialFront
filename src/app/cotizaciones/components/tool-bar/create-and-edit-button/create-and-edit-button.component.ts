import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { CotizacionService } from '../../../services/cotizacion.service';
import { responseApi } from '../../../../shared/interfaces/response.interface';
import { Cotizacion } from '../../../interfaces/cotizacion.interface';
import { FormArray } from '@angular/forms';
import { DetalleCotizacion } from '../../../interfaces/detalleCotizacion.interface';
import { ClienteService } from '../../../services/cliente.service';

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
  @Output() createdClicked = new EventEmitter<void>();

  public isValid:boolean = false;

  constructor(
    private cotizacionService:CotizacionService,
    private clientService : ClienteService
  ){
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

  validateInformationBeforeSave(): boolean {
    // Obtenemos la validez del formulario
    let validForm: boolean = this.cotizacionService.form?.valid || false;

    // Obtenemos la lista de detalles de cotización
    let detallesList: FormArray<any> = this.cotizacionService.form?.get('detalleCotizacions') as FormArray || new FormArray([]);
    let validDetalle: boolean = detallesList.length > 0;

    // Imprimimos los valores para depuración
    console.log('Detalle Válido:', validDetalle, 'Formulario Válido:', validForm);

    // Validamos que ambas condiciones sean verdaderas
    this.isValid = validForm && validDetalle;
    console.log(this.isValid)
    return this.isValid;
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

  openCreateDialog(){
    this.createdClicked.emit();
  }

}
