import { Servicio } from './../../interfaces/servicio.interface';
import { AfterContentChecked, AfterViewChecked, Component, Inject, Input, OnInit, input, EventEmitter, Optional } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoServicio } from '../../interfaces/tipoServicio.interface';
import { DetalleCotizacionService } from '../../services/detalleCotizacion.service';
import { DetalleCotizacion, DetalleCotizacionVariable, DiasDeLaSemana, VariablesEconomicasNavigation } from '../../interfaces/detalleCotizacion.interface';
import { CotizacionService } from '../../services/cotizacion.service';
import { Sucursal } from '../../interfaces/sucursal.interface';
import { first } from 'rxjs';
import { UtilidadService } from '../../../shared/services/utilidad.service';
import { responseApi } from '../../../shared/interfaces/response.interface';

@Component({
  selector: 'crm-detail-cotizacion',
  templateUrl: './detail-cotizacion.component.html',
  styleUrl: './detail-cotizacion.component.css'
})
export class DetailCotizacionComponent implements OnInit {

  //Dias seleccionados de la semana
  @Input()
  public defaultDetalle: boolean = true;
  @Input()
  public dataDetalle: any;

  public diasSeleccionados = new FormControl<string[]>([]);
  public valorDiasSelect!: FormGroup;
  public diasDeLaSemana: DiasDeLaSemana[] = [DiasDeLaSemana.Lunes, DiasDeLaSemana.Martes, DiasDeLaSemana.Miercoles, DiasDeLaSemana.Jueves, DiasDeLaSemana.Viernes, DiasDeLaSemana.Sabado, DiasDeLaSemana.Domingo, DiasDeLaSemana.Festivo];


  //Formgroup
  public detalleCotizacionForm!: FormGroup;
  public listaDeHoras: FormGroup = this.formBiulder.group({
    minutosInicioServicio: ['', Validators.required],
    minutosFinServicio: ['', Validators.required]
  });
  public listaHoras: string[] = [];
  public listaServicios: Servicio[] = [];
  public listaSucursales: Sucursal[] = [];
  public detalleCotizacionVariables: DetalleCotizacionVariable[] = [];

  //States
  public newDetail: boolean = false;
  public armado: boolean = false;
  public loading: boolean = false;
  public editMode: boolean = false;



  constructor(
    @Optional() public dialogRef: MatDialogRef<DetailCotizacionComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { detalle: DetalleCotizacion, editMode: boolean, newDetail: boolean, index: number },
    private formBiulder: FormBuilder,
    private cotizacionService: CotizacionService,
    private detalleCotizacionService: DetalleCotizacionService,
    private utilidadService: UtilidadService
  ) {
    this.editMode = this.stateOfDetail
    this.listaSucursales = this.cotizacionService.listaSucursal;
    this.listarServicios();
    this.listarVariablesEconomicas();
    if (this.data) {
      this.dataDetalle = this.data;
    }
    this.detalleCotizacionForm = this.formBiulder.group({
      idDetalleCotizacion: [0],
      idCotizacion: [0, [Validators.required]],
      idServicio: [0, Validators.required],
      idSucursal: [0, [Validators.required]],
      cantidadServicios: [1, this.detalleCotizacionService.validatePositiveNumber()],
      detalleServicio: [""],
      total: 0,
      createdAt: "",
      updatedAt: "",
      detalleCotizacionInventarios: [],
      detalleCotizacionVariables: this.formBiulder.array([]),
      idServicioNavigation: {},
      idSucursalNavigation: []
    }, { validators: this.detalleCotizacionService.validateFormArrayLength("detalleCotizacionVariables", 1) });

    this.valorDiasSelect = this.formBiulder.group({});

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.editMode ? this.detalleCotizacionForm.enable() : this.detalleCotizacionForm.disable();
    this.listaHoras = this.detalleCotizacionService.listarHoras();
    // On this method we initialize the form with the detail if it exists or its a popup
    if (this.data) {
      if (this.data.detalle !== undefined) {
        // this.detalleCotizacion = this.data.detalle;
        this.initializelFormWithDetail();
        console.log(1);
      } else {
        // If it enter here it means is a new detail
        this.newDetail = true;
      }
    }else{
     // If it's not a popup, it's a new detail
     this.editMode = true;
      this.detalleCotizacionForm.enable();
    }
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get stateOfDetail(): boolean {
    return this.cotizacionService.isDisabled;
  }

  isValidField(field: string): boolean | null {
    return this.valorDiasSelect.controls[field].errors ? true : false;
  }

  isRequiredField(field: string): boolean | null {
    return this.valorDiasSelect.controls[field].valid ? true : false;
  }

  isOutOfRange(field: string): boolean | null {
    return this.valorDiasSelect.controls[field].errors ? true : false;
  }

  onDiaChange(event: any) {
    // Cambia el valor del dia seleccionado y su variableNavigation en caso de que haya un detalle, en caso de que no, ingresa a lista
    let listaDetalleVar = this.detalleCotizacionForm.value.detalleCotizacionVariables;
    if (event.value) {
      event.value.forEach((dia: string) => {
        if (this.valorDiasSelect.controls['dia'] === undefined) {

          let detalleCotizacionVariable;
          if(this.data){
            if (this.data.detalle) detalleCotizacionVariable = this.data.detalle.detalleCotizacionVariables.find(v => v.idVariablesEconomicasNavigation.nombre === dia);
          }
          if (detalleCotizacionVariable) {
            const control = new FormControl(detalleCotizacionVariable.valor, [Validators.required])
            this.valorDiasSelect.addControl(dia, control);
          };
          if (detalleCotizacionVariable === undefined) {
            let valorVariable = dia === "Festivo" ? "2" : "4";
            const control = new FormControl(valorVariable, [Validators.required, Validators.pattern('[1-4]')])
            this.valorDiasSelect.addControl(dia, control);
            const variableEconomica = this.cotizacionService.listaVariablesEconomicas.find(v => v.nombre === dia);
            let variableDiasDetalle: DetalleCotizacionVariable = {
              idDetalleCotizacionVariables: 0,
              idDetalleCotizacion: 0,
              idVariablesEconomicas: variableEconomica!.idVariablesEconomicas,
              valor: valorVariable,
              createdAt: '',
              updatedAt: null,
              idVariablesEconomicasNavigation: variableEconomica!
            }
            let variableEncontrada = listaDetalleVar.find((v: any) => v.idVariablesEconomicasNavigation.nombre === dia);
            if (!variableEncontrada) {
              listaDetalleVar.push(variableDiasDetalle);
            }
          }
        }
      });

      //Eliminr los elementos que no están seleccionados
      for (const key in this.valorDiasSelect.value) {
        var exist = event.value.some((i: string) => i === key);
        if (!exist) {
          this.valorDiasSelect.removeControl(key);
          for (let i = 0; i < listaDetalleVar.length; i++) {
            if (listaDetalleVar[i].idVariablesEconomicasNavigation.nombre === key) {
              listaDetalleVar.splice(i, 1);
              console.log(listaDetalleVar);
            }
          }
        }
      }
      console.log(this.detalleCotizacionForm.value.detalleCotizacionVariables);
    }
  }

  valueDayChange(event: any) {
    //Solo ejecutar si el valor estpa en el rango 0-5
    if (event.target.value && event.target.value < 5 && event.target.value > 0) {
      this.detalleCotizacionForm.value.detalleCotizacionVariables.forEach((detalle: any) => {
        if (detalle.idVariablesEconomicasNavigation.nombre === event.target.name) {
          detalle.valor = event.target.value;
        }
      });
      console.log(this.detalleCotizacionForm.value.detalleCotizacionVariables);
    }
  }

  initializelFormWithDetail() {
    this.detalleCotizacionForm.patchValue(this.data.detalle);
    const detalleVariables = this.detalleCotizacionForm.controls['detalleCotizacionVariables'] as FormArray;
    this.data.detalle.detalleCotizacionVariables.forEach(v => {
      const control = new FormControl(v);
      detalleVariables.push(control);
    });

    console.log(this.data.detalle);
    this.listaDeHoras = this.formBiulder.group({
      minutosInicioServicio: '',
      minutosFinServicio: ''
    });
    // this.listaServicios.unshift(this.data.detalle.idServicioNavigation);
    // this.listaSucursales?.unshift(this.data.detalle.idSucursalNavigation);
    console.log(this.data.detalle.detalleCotizacionVariables)
    this.data.detalle.detalleCotizacionVariables.forEach(v => {
      var formatoHora = "";
      const esFormato = this.detalleCotizacionService.esFormatoHora(v.valor)
      if (v.idVariablesEconomicasNavigation.nombre === "minutosInicioServicio") {
        if (esFormato) {
          var hora = this.listaDeHoras.get("minutosInicioServicio");
          hora?.setValue(v.valor);
        } else {
          formatoHora = this.detalleCotizacionService.minutosAHora(parseInt(v.valor));
          var hora = this.listaDeHoras.get("minutosInicioServicio");
          hora?.setValue(formatoHora);
        }
      } else if (v.idVariablesEconomicasNavigation.nombre === "minutosFinServicio") {
        if (esFormato) {
          var hora = this.listaDeHoras.get("minutosFinServicio");
          hora?.setValue(v.valor);
        } else {
          formatoHora = this.detalleCotizacionService.minutosAHora(parseInt(v.valor));
          var hora = this.listaDeHoras.get("minutosFinServicio");
          hora?.setValue(formatoHora);
        }
      }
      if (v.idVariablesEconomicasNavigation.nombre === "Lunes" || v.idVariablesEconomicasNavigation.nombre === "Martes" ||
        v.idVariablesEconomicasNavigation.nombre === "Miercoles" || v.idVariablesEconomicasNavigation.nombre === "Jueves" || v.idVariablesEconomicasNavigation.nombre === "Viernes" ||
        v.idVariablesEconomicasNavigation.nombre === "Sabado" || v.idVariablesEconomicasNavigation.nombre === "Domingo" || v.idVariablesEconomicasNavigation.nombre === "Festivo") {

        // this.diasSemanaList.push(v.idVariablesEconomicasNavigation.nombre);
        // this.diasSeleccionados.value!.push(v.idVariablesEconomicasNavigation.nombre);
        console.log("entra if 2 method");
        const control = new FormControl(v.valor, [Validators.required]);
        this.diasSeleccionados.value!.push(v.idVariablesEconomicasNavigation.nombre);
        this.valorDiasSelect.addControl(v.idVariablesEconomicasNavigation.nombre, control);
      }
      if (v.idVariablesEconomicasNavigation.nombre === "armado" && v.valor === "1") {
        this.armado = true;
      }
    });
  }

  onHourChange(event: any) {
    if (event.value) {
      var id = event.source._id;
      let horaToCahnge = this.detalleCotizacionForm.value.detalleCotizacionVariables.find((detalle: any) => detalle.idVariablesEconomicasNavigation.nombre === (id == 1 ? "minutosInicioServicio" : "minutosFinServicio"));
      let horaMinutos = this.detalleCotizacionService.horaAMinutos(event.value);
      //Si encuentra la hora le cambia el valor del detalle, si no le agrega una nueva
      if (horaToCahnge) {
        horaToCahnge.valor = horaMinutos.toString();
      } else {
        const variableEconomica = this.cotizacionService.listaVariablesEconomicas.find(v => v.nombre === (id == 1 ? "minutosInicioServicio" : "minutosFinServicio"));
        let variableDiasDetalle: DetalleCotizacionVariable = {
          idDetalleCotizacionVariables: 0,
          idDetalleCotizacion: 0,
          idVariablesEconomicas: variableEconomica!.idVariablesEconomicas,
          valor: horaMinutos.toString(),
          createdAt: '',
          updatedAt: null,
          idVariablesEconomicasNavigation: variableEconomica!
        }
        if (variableEconomica) {
          this.detalleCotizacionForm.value.detalleCotizacionVariables.push(
            variableDiasDetalle
          );
        }
      }
    }
  }

  daysRequiredServiceVariableDetail(): void {
    let counter: number = 0;

    const diasRequeridos = this.detalleCotizacionForm.value.detalleCotizacionVariables.find((detalle: any) => detalle.idVariablesEconomicasNavigation.nombre === "diasRequeridoServicio");
    if (!diasRequeridos) {
      this.detalleCotizacionForm.value.detalleCotizacionVariables.forEach((element: any) => {
        if (this.diasDeLaSemana.includes(element.idVariablesEconomicasNavigation.nombre)) {
          counter += parseInt(element.valor);
        }
      });
      let variableEconomicaD = this.cotizacionService.listaVariablesEconomicas.find(v => v.nombre === "diasRequeridoServicio");
      const detalleVariableD: DetalleCotizacionVariable = {
        idDetalleCotizacionVariables: 0,
        idDetalleCotizacion: 0,
        idVariablesEconomicas: variableEconomicaD!.idVariablesEconomicas,
        valor: counter.toString(),
        createdAt: '',
        updatedAt: null,
        idVariablesEconomicasNavigation: variableEconomicaD!
      };
      this.detalleCotizacionForm.value.detalleCotizacionVariables.push(detalleVariableD);
    }
  }

  changeArmado() {
    this.armado = !this.armado;

  }

  armadoAndSMLVCheck() {
    console.log(1);
    let variableEconomicaA = this.cotizacionService.listaVariablesEconomicas.find(v => v.nombre === "armado");
    let variableEconomicaS = this.cotizacionService.listaVariablesEconomicas.find(v => v.nombre === "SMLV");
    let econtradoA = this.detalleCotizacionForm.value.detalleCotizacionVariables.some((v: any) => v.idVariablesEconomicasNavigation.nombre === "armado");
    let econtradoS = this.detalleCotizacionForm.value.detalleCotizacionVariables.some((v: any) => v.idVariablesEconomicasNavigation.nombre === "SMLV");
    if (econtradoA) {
      this.detalleCotizacionForm.value.detalleCotizacionVariables.forEach((detalle: any) => {
        if (detalle.idVariablesEconomicasNavigation.nombre === "armado") {
          detalle.valor = this.armado ? "1" : "0";
        }
      })
    } else {
      const detalleVariable: DetalleCotizacionVariable = {
        idDetalleCotizacionVariables: 0,
        idDetalleCotizacion: 0,
        idVariablesEconomicas: variableEconomicaA!.idVariablesEconomicas,
        valor: this.armado ? "1" : "0",
        createdAt: '',
        updatedAt: null,
        idVariablesEconomicasNavigation: variableEconomicaA!
      };
      this.detalleCotizacionForm.value.detalleCotizacionVariables.push(detalleVariable);
    }
    if (!econtradoS) {
      const detalleVariableS: DetalleCotizacionVariable = {
        idDetalleCotizacionVariables: 0,
        idDetalleCotizacion: 0,
        idVariablesEconomicas: variableEconomicaS!.idVariablesEconomicas,
        valor: variableEconomicaS!.valor,
        createdAt: '',
        updatedAt: null,
        idVariablesEconomicasNavigation: variableEconomicaS!
      };
      this.detalleCotizacionForm.value.detalleCotizacionVariables.push(detalleVariableS);
    }
  }

  validateInfoBeforeSave(): boolean {
    console.log(this.detalleCotizacionForm);
    let formValid: boolean = this.detalleCotizacionForm.valid;
    let selectedDays = this.diasSeleccionados.valid;
    let selectedHours = this.listaDeHoras.valid;
    return selectedDays && selectedHours && formValid;
  }

  validateSecondButton():boolean{
    let validCount = this.detalleCotizacionForm.get('cantidadServicios')!.valid;
    let selectedDays = this.diasSeleccionados.valid;
    let selectedHours = this.listaDeHoras.valid;
    return selectedDays && selectedHours && validCount;
  }

  guardarDetalleCotizacion() {
    this.loading = true;
    this.detalleCotizacionForm;
    this.daysRequiredServiceVariableDetail();
    this.armadoAndSMLVCheck();
    //Include amount of services variabledetail in the form
    // this.detalleCotizacionForm.value.detalleCotizacionVariables = listaEditada;
    if (this.cotizacionService.stateNuevaCotizacion) {

      this.detalleCotizacionService.getValueOfDetalleCotizacion(this.detalleCotizacionForm.value).subscribe({
        next: (data) => {
          console.log(data.value);
          console.log(this.detalleCotizacionForm.value);
          const totalPrev = this.detalleCotizacionForm.get('total')?.value;
          this.detalleCotizacionForm.get('total')?.setValue(data.value);
          let idServicio = this.detalleCotizacionForm.get('idServicio');
          let idSucursal = this.detalleCotizacionForm.get('idSucursal');
          let sucursal = this.cotizacionService.listaSucursal.find(s => s.idSucursal === idSucursal?.value);
          let servicio = this.cotizacionService.listaServicios.find(s => s.idServicio === idServicio?.value);
          this.detalleCotizacionForm.get('idSucursalNavigation')?.setValue(sucursal);
          this.detalleCotizacionForm.get('idServicioNavigation')?.setValue(servicio);
          let detalleCotizaciones = this.cotizacionService.form?.get('detalleCotizacions') as FormArray;
          if (totalPrev === 0) {
            detalleCotizaciones.push(this.formBiulder.control(this.detalleCotizacionForm.value));
          } else {
            this.detalleCotizacionForm.get('total')?.setValue(data.value);
            this.cotizacionService.editDetalleCotizacion(this.detalleCotizacionForm.value, this.data.index);
          }
        },
        error: (e) => {
          console.error(e);
        }
      });
    } else if (this.newDetail) {
      const sucursalFound = this.listaSucursales.find(s => s.idSucursal === this.detalleCotizacionForm.value.idSucursal);
      const servicioFuond = this.listaServicios.find(s => s.idServicio === this.detalleCotizacionForm.value.idServicio);
      this.detalleCotizacionForm.get('idSucursalNavigation')?.setValue(sucursalFound);
      this.detalleCotizacionForm.get('idServicioNavigation')?.setValue(servicioFuond);
      this.detalleCotizacionForm.get('detalleCotizacionInventarios')?.setValue([]);
      let idCotizacion = this.detalleCotizacionForm.get('idCotizacion')?.setValue(this.cotizacionService.cotizacionById?.idCotizacion);
      //Create detail cotizacion and add it to the formArray
      this.detalleCotizacionService.createDetalleCotizacion(this.detalleCotizacionForm.value).subscribe({
        next: (data) => {
          console.log(this.detalleCotizacionForm.value);
          this.detalleCotizacionForm.get("total")?.setValue(data.value);
          let detalleCotizaciones = this.cotizacionService.form?.get('detalleCotizacions') as FormArray;
          this.detalleCotizacionForm.get('total')?.setValue(data.value.total);
          detalleCotizaciones.push(this.formBiulder.control(this.detalleCotizacionForm.value));
        },
        error: (e) => {
          console.error(e);
          this.utilidadService.mostrarAlerta("No se pudo crear el detalle de la cotización", "Error!", "bottom", "center");
        }
      });
    } else {
      this.detalleCotizacionService.editDetalleCotizacion(this.detalleCotizacionForm.value).subscribe({
        next: (data) => {
          this.loading = false;
          console.log(data);
          const detallesArray = this.cotizacionService.form?.get('detalleCotizacions') as FormArray;
          if (detallesArray) {
            detallesArray.controls.forEach((control, index) => {
              if (control.value.idDetalleCotizacion === this.detalleCotizacionForm.value.idDetalleCotizacion) {
                // Actualizar el detalle cotización en el FormArray
                detallesArray.controls.at(index)?.patchValue(data.value);
                window.location.reload();
                console.log(detallesArray);
              }
            });
          };
          this.utilidadService.mostrarAlerta("Detalle de la cotización editado", "Bien hecho!", "bottom", "center");
          this.onNoClick();
        },
        error: (e) => {
          console.error(e);
          this.utilidadService.mostrarAlerta("No se pudo editar el detalle de la cotización", "Error!", "bottom", "center");
          console.log(this.detalleCotizacionForm.value);
        }
      });
      console.log(this.detalleCotizacionForm.value);
    }
    this.onNoClick();
    this.loading = false;
    return;
  }

  getValueOfQuote(){
    this.detalleCotizacionService.getValueOfDetalleCotizacion(this.detalleCotizacionForm.value).subscribe({
      next: (data) => {
        this.detalleCotizacionForm.get('total')?.setValue(data.value);
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  public listarServicios() {
    this.cotizacionService.listarServicios().subscribe({
      next: (data) => {
        this.listaServicios = data.value;
      },
      complete: () => { },
      error: (error: any) => { console.error(error.message) }
    })
  }

  public listarVariablesEconomicas() {
    this.cotizacionService.listarVaraibles().subscribe({
      next: (data) => { }
    });
  }
}
