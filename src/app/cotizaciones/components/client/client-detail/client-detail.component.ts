import { Component, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../interfaces/cliente.interface';
import { responseApi } from '../../../../shared/interfaces/response.interface';
import { UtilidadService } from '../../../../shared/services/utilidad.service';
import { Sucursal } from '../../../interfaces/sucursal.interface';
import { SucursalService } from '../../../services/sucursal.service';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.css'
})
export class ClientDetailComponent implements OnInit, OnDestroy {

  public clientForm!: FormGroup;
  public sucursalForm!: FormGroup;
  public createdDate: string = "";
  public clienteCreated: boolean = false;
  public enabled: boolean = false;
  public addSucursal: boolean = false;
  public valuesTable: any = [];

  public columns = [
    { key: 'Nombre', value: 'nombre' },
    { key: 'Dirección', value: 'direccion' },
    { key: 'Fecha de creación', value: 'createdAt' }
  ];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { idCliente: number },
    private dialogRef: MatDialogRef<ClientDetailComponent>,
    private fb: FormBuilder,
    private clientService: ClienteService,
    private utilidadService: UtilidadService,
    private sucursalService: SucursalService
  ) {
    console.log("Client detail", data.idCliente);
    this.clientForm = this.clientService.clientForm;
    this.sucursalForm = this.clientService.sucursalForm;
  }


  ngOnDestroy(): void {
    //this.sucursalValues.clear();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

    if (this.data.idCliente !== null) {
      let clientFound: Cliente | undefined = this.clientService.clienteSubject.value.find(c => c.idCliente === this.data.idCliente);
      if (clientFound) {
        this.initializeCLient(clientFound);
      } else {
        this.clientService.getClienteById(this.data.idCliente).subscribe({
          next: (data: responseApi<Cliente>) => {
            this.initializeCLient(data.value);
          },
          error: (e) => {
            console.error(e);
          }
        });
      }
      this.clientCreated();
    } else {
    }
    this.clientService.clientForm.valueChanges.subscribe((c: Cliente) => {
      if (c) {
        let newClientes = this.clientService.clienteSubject.value.map((cliente: Cliente, index: number) => {
          if (cliente.idCliente === c.idCliente) {
            cliente = c;
          }
        });

      }
    });
    this.sucursalValues.valueChanges.subscribe((sucursales) => {
      this.valuesTable = sucursales.value;
      this.clientService.clientForm
      // let sucursalesLocal = this.clientForm.get('sucursals') as FormArray;
      // let sucursalesService = this.clientService.clientForm.get('sucursals') as FormArray;
      // sucursalesLocal.setValue(sucursales);
      // sucursalesService.setValue(sucursales);
    });
  }

  initializeCLient(cliente:  Cliente) {
    this.clientForm.patchValue(cliente);
    let sucursales = this.clientForm.get('sucursals') as FormArray;
    this.sucursalValues.clear();
    cliente.sucursals.forEach(s => {
      sucursales.push(this.fb.control(s));
    })
  }

  clientCreated(): void {
    this.createdDate = this.clientForm.get('createdAt')?.value;
    this.clientForm.disable();
    this.clienteCreated = this.clientForm.get('idCliente')?.value === this.data.idCliente;
  }

  uptadeClient(): void {
    this.clientService.updateCliente(this.clientForm.value).subscribe({
      next: (data) => {
        this.clientService.getClienteById(this.data.idCliente).subscribe({
          next: (data: responseApi<Cliente>) => {
            this.clientForm.patchValue(data.value);
            this.utilidadService.mostrarAlerta("Cliente actualizado con éxito", "Bien hecho!", "bottom", "center");
            this.clientForm.disable();
            this.enabled = false;
          },
          error: (e) => {
            console.error(e);
          }
        });
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  enableClientForm(): void {
    this.enabled = true;
    this.clientForm.enable();
  }

  createClient(): void {
    this.clientService.createCliente(this.clientForm.value).subscribe({
      next: (data) => {
        this.clientForm.reset(data.value);
        this.clientForm.disable();
        this.clienteCreated = true;
        this.utilidadService.mostrarAlerta("Cliente creado con éxito", "Bien hecho!", "bottom", "center");
      },
      error: (e) => {
        this.utilidadService.mostrarAlerta("Error al crear el cliente", "Error!", "bottom", "center");
        console.error(e);
      }
    });
  }

  handleDeleteSucursal(sucursalA: any) {
    this.sucursalService.deleteSucursal(sucursalA).subscribe({
      next: (data) => {

        const values = this.clientForm.get('sucursals') as FormArray;
        values.value.forEach((sucursal: Sucursal, index: number) => {
          if (sucursal.idSucursal === sucursalA.idSucursal) {
            values.value.splice(index, 1);
            let sucursalesService = this.clientService.clientForm.get('sucursals') as FormArray;
            sucursalesService.value.splice(index,1);
          }
        });
      },
      error: (error) => {
        this.utilidadService.mostrarAlerta("Error al eliminar la sucursal", "Error!");
      }
    })
  }

  addSucursalFunction() {
    let sucursalToAdd: Sucursal = {
      idSucursal: 0,
      idCliente: this.clientForm.get('idCliente')?.value ?? 0,
      nombre: '',
      direccion: '',
      createdAt: '',
      updatedAt: ''
    }
  }

  newSucursalButton() {
    this.sucursalService.openSucursalDetail();
  }

  openSucursal(id: number) {
    this.sucursalService.openSucursalDetail(id);
  }

  get stateForm(): boolean {
    return this.clientForm.status === 'INVALID';
  }

  get sucursalValues() {
    return this.clientForm.get('sucursals') as FormArray;
  }
}
