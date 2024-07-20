import { Sucursal } from './../../../interfaces/sucursal.interface';
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClienteService } from '../../../services/cliente.service';
import { SucursalService } from '../../../services/sucursal.service';
import { UtilidadService } from '../../../../shared/services/utilidad.service';

@Component({
  selector: 'app-sucursal-modal',
  templateUrl: './sucursal-modal.component.html',
  styleUrl: './sucursal-modal.component.css'
})
export class SucursalModalComponent {

  public sucursalForm!:FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { idSucursal: number | null },
    private dialogRef: MatDialogRef<SucursalModalComponent>,
    private fb : FormBuilder,
    private clientService : ClienteService,
    private sucursalService: SucursalService,
    private utlidadService : UtilidadService
  ){
    this.InitSucursal();
    if(this.data.idSucursal){
      this.setValueSucursal();
    }
  }

  onClose(){
    this.dialogRef.close();
  }

  InitSucursal(){
    this.sucursalForm = this.fb.group({
      idSucursal : [0],
      idCliente  : [0],
      nombre     : ['', Validators.required],
      direccion  : ['', Validators.required],
      createdAt  : [''],
      updatedAt  : ['']
    });
  }

  setValueSucursal(){
    let sucursales:FormArray = this.clientService.clientForm.get('sucursals') as FormArray;
    sucursales.value.forEach((s : Sucursal) => {
      if(s.idSucursal === this.data.idSucursal){
        this.sucursalForm.patchValue(s);
        console.log(this.sucursalForm);
        return;
      }
    });
  };

  get stateOfSucursal(){
    return this.sucursalForm.status === 'INVALID';
  }

  saveSucursal(){
    if(this.data.idSucursal && this.data.idSucursal !== 0){
      this.sucursalService.editSucursal(this.sucursalForm.value).subscribe({
        next : (data)=>{
          this.utlidadService.mostrarAlerta("Sucursal editada con éxito", "Muy bien!")
        },
        error : (error)=> {
          this.utlidadService.mostrarAlerta(`Error al editar la sucursal ${this.sucursalForm.value.nombre}`, "Error")
          console.error(error);
        }
      })
    }else{
      this.sucursalService.saveSucursal(this.sucursalForm.value).subscribe({
        next : (data)=>{
          this.utlidadService.mostrarAlerta("Sucursal creada con éxito", "Muy bien!")
        },
        error : (e)=>{
          this.utlidadService.mostrarAlerta("Error al crear la sucursal", "Error!")
        }
      })
    }
    this.onClose();
  }

}
