import { Servicio } from './../../interfaces/servicio.interface';
import { AfterContentChecked, AfterViewChecked, Component, Inject, Input, OnInit, input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoServicio } from '../../interfaces/tipoServicio.interface';
import { DetalleCotizacionService } from '../../services/detalleCotizacion.service';
import { DetalleCotizacion, DetalleCotizacionVariable, VariablesEconomicasNavigation } from '../../interfaces/detalleCotizacion.interface';
import { CotizacionService } from '../../services/cotizacion.service';
import { Sucursal } from '../../interfaces/sucursal.interface';
import { first } from 'rxjs';
import { UtilidadService } from '../../../shared/services/utilidad.service';

@Component({
  selector: 'crm-detail-cotizacion',
  templateUrl: './detail-cotizacion.component.html',
  styleUrl: './detail-cotizacion.component.css'
})
export class DetailCotizacionComponent implements OnInit {

  // DataSource
  public detalleCotizacion!: DetalleCotizacion;
  public detalleCotizacionForm!: FormGroup;

  //Formgroup
  public listaDeHoras!: FormGroup;
  public listaHoras: string[] = [];
  public diasSemanaList: string[] = [];
  public diasSeleccionados = new FormControl<string[]>([]);
  public listaServicios: Servicio[] = [];
  public listaSucursales: Sucursal[] = [];
  public detalleCotizacionVariables: DetalleCotizacionVariable[] = [];

  //States
  public armado: boolean = false;
  public loading: boolean = false;
  public editMode: boolean = false;


  //Lista de dias de la semana
  public diasDeLaSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Festivo'];


  constructor(
    public dialogRef: MatDialogRef<DetailCotizacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { detalle: DetalleCotizacion, editMode: boolean, newDetail: boolean },
    private formBiulder: FormBuilder,
    private cotizacionService: CotizacionService,
    private detalleCotizacionService: DetalleCotizacionService,
    private utilidadService : UtilidadService
  ) {
    this.editMode = this.data.editMode;
    this.listaSucursales = this.cotizacionService.listaSucursal;
    this.listaServicios = this.cotizacionService.listaServicios;
  }


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    if (this.data.detalle !== undefined) {
      this.detalleCotizacion = this.data.detalle;
      this.initializelFormWithDetail();
      console.log(1)
    }
    if (this.data.newDetail) {
      this.initializelEmptyForm();
      console.log(2)
    }
    this.listaHoras = this.detalleCotizacionService.listarHoras();
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  initializelFormWithDetail() {
    this.detalleCotizacionForm = this.formBiulder.group({
      idDetalleCotizacion: this.detalleCotizacion.idDetalleCotizacion,
      idCotizacion: this.detalleCotizacion.idCotizacion,
      idServicio: this.detalleCotizacion.idServicio,
      idSucursal: this.detalleCotizacion.idSucursal,
      cantidadServicios: this.detalleCotizacion.cantidadServicios,
      detalleServicio: this.detalleCotizacion.detalleServicio === undefined ? " " : this.detalleCotizacion.detalleServicio,
      total: this.detalleCotizacion.total,
      createdAt: this.detalleCotizacion.createdAt,
      updatedAt: this.detalleCotizacion.updatedAt,
      detalleCotizacionInventarios: this.detalleCotizacion.detalleCotizacionInventarios,
      detalleCotizacionVariables: [this.detalleCotizacion.detalleCotizacionVariables],
      idServicioNavigation: this.detalleCotizacion.idServicioNavigation,
      idSucursalNavigation: this.detalleCotizacion.idSucursalNavigation
    });

    this.listaDeHoras = this.formBiulder.group({
      minutosInicioServicio: '',
      minutosFinServicio: ''
    });
    //this.listaServicios.unshift(this.detalleCotizacion.idServicioNavigation);
    //this.listaSucursales?.unshift(this.detalleCotizacion.idSucursalNavigation);
    this.detalleCotizacion.detalleCotizacionVariables.forEach(v => {
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
        v.idVariablesEconomicasNavigation.nombre === "Miercoles" || v.idVariablesEconomicasNavigation.nombre === "Jueves" || v.idVariablesEconomicasNavigation.nombre === "Viernes" || v.idVariablesEconomicasNavigation.nombre === "Sabado") {
        this.diasSemanaList.push(v.idVariablesEconomicasNavigation.nombre);
        this.diasSeleccionados.setValue(this.diasSemanaList);
      }
      if (v.idVariablesEconomicasNavigation.nombre === "armado" && v.valor === "1") {
        this.armado = true;
      }
    });
    this.detalleCotizacionVariables = this.detalleCotizacion.detalleCotizacionVariables;
    this.diasSemanaList = this.diasDeLaSemana;
  }

  initializelEmptyForm() {
    this.detalleCotizacionForm = this.formBiulder.group({
      idDetalleCotizacion: 0,
      idCotizacion: this.cotizacionService.cotizacionById?.idCotizacion,
      idServicio: 0,
      idSucursal: 0,
      cantidadServicios: 1,
      detalleServicio: "",
      total: 0,
      createdAt: "",
      updatedAt: "",
      detalleCotizacionInventarios: [],
      detalleCotizacionVariables: [],
      idServicioNavigation: {},
      idSucursalNavigation: []
    })
    this.listaDeHoras = this.formBiulder.group({
      minutosInicioServicio: '',
      minutosFinServicio: ''
    });
    this.diasSemanaList = this.diasDeLaSemana;
  }

  obtenerVariablesDetalleDias(): DetalleCotizacionVariable[] {

    var detalleVariablesFiltrados: DetalleCotizacionVariable[] = [];
    if (!this.data.newDetail) {
      const detalleVariables: DetalleCotizacionVariable[] = [...this.detalleCotizacionForm.value.detalleCotizacionVariables];
      console.log(detalleVariables);
      console.log("entra if 1 method")
      // 1. Eliminar elementos no coincidentes
      if (detalleVariables.length > 0) {
        detalleVariablesFiltrados = detalleVariables.filter(detalle => {
          return this.diasSeleccionados.value!.includes(detalle.idVariablesEconomicasNavigation.nombre);
        });
      }
    }

    // 2. Agregar elementos faltantes
    this.diasSeleccionados.value!.forEach(diaSeleccionado => {
      const existe = detalleVariablesFiltrados.some(detalle => detalle.idVariablesEconomicasNavigation.nombre === diaSeleccionado);
      if (!existe) {

        const variableEconomica = this.cotizacionService.listaVariablesEconomicas.find(v => v.nombre === diaSeleccionado);
        if (variableEconomica) {
          const valor = diaSeleccionado === "Festivo" ? "2" : "4";
          const detalleVariable: DetalleCotizacionVariable = {
            idDetalleCotizacionVariables: 0,
            idDetalleCotizacion: 0,
            idVariablesEconomicas: variableEconomica.idVariablesEconomicas,
            valor: valor,
            createdAt: '',
            updatedAt: null,
            idVariablesEconomicasNavigation: variableEconomica
          };

          detalleVariablesFiltrados.push(detalleVariable);
        }
      }
    });
    return detalleVariablesFiltrados;
  }


  filterAndInsertDaysAndHoursDetalleVariables(horasServicio: string[]) {
    // Dias
    var detalleVariableDias: DetalleCotizacionVariable[] = this.obtenerVariablesDetalleDias();
    // Filtramos el detalle cotización variable dejando los detalles no coincidan con los que están en día de la semana
    let listaDetalleVariablesFiltrado: DetalleCotizacionVariable[] = []
    if (!this.data.newDetail) {
      listaDetalleVariablesFiltrado = this.detalleCotizacionForm.value.detalleCotizacionVariables.filter((d: DetalleCotizacionVariable) => {
        const existe = this.diasDeLaSemana.some(dia => d.idVariablesEconomicasNavigation.nombre === dia);
        if (!existe) {
          return d.idVariablesEconomicasNavigation.nombre
        }
        return;
      });

    }
    listaDetalleVariablesFiltrado.push(...detalleVariableDias);


    // Horas
    const horasFilterDetalleVariable = listaDetalleVariablesFiltrado.filter((d: DetalleCotizacionVariable) => {
      return d.idVariablesEconomicasNavigation.nombre !== "minutosInicioServicio" && d.idVariablesEconomicasNavigation.nombre !== "minutosFinServicio";
    });
    for (let hora in horasServicio) {
      const variableEconomica = this.cotizacionService.listaVariablesEconomicas.find(v => v.nombre === hora.toString());
      if (variableEconomica) {
        const valor = this.detalleCotizacionService.horaAMinutos(horasServicio[hora]);
        const detalleVariable: DetalleCotizacionVariable = {
          idDetalleCotizacionVariables: 0,
          idDetalleCotizacion: 0,
          idVariablesEconomicas: variableEconomica.idVariablesEconomicas,
          valor: valor.toString(),
          createdAt: '',
          updatedAt: null,
          idVariablesEconomicasNavigation: variableEconomica
        };
        horasFilterDetalleVariable.push(detalleVariable);
      }
    }

    return horasFilterDetalleVariable;
  }

  daysRequiredServiceVariableDetail(detailVariableList: DetalleCotizacionVariable[]): DetalleCotizacionVariable[] {
    let counter: number = 0;
    this.diasSeleccionados.value?.forEach(days => {
      if (days !== "Festivo") {
        counter += 4;
      } else {
        counter += 2;
      }
    });

    const diasRequeridos = detailVariableList.find(detalle => detalle.idVariablesEconomicasNavigation.nombre === "diasRequeridoServicio");
    if (diasRequeridos) {
      diasRequeridos.valor = counter.toString();
    } else {
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
      detailVariableList.push(detalleVariableD);
    }
    return detailVariableList;
  }

  changeArmado() {
    this.armado = !this.armado;
  }

  armadoAndSMLVCheck(detailVariableList: DetalleCotizacionVariable[]): DetalleCotizacionVariable[] {
    console.log(1);
    let variableEconomicaA = this.cotizacionService.listaVariablesEconomicas.find(v => v.nombre === "armado");
    let variableEconomicaS = this.cotizacionService.listaVariablesEconomicas.find(v => v.nombre === "SMLV");
    let econtradoA = detailVariableList.some(v => v.idVariablesEconomicasNavigation.nombre === "armado");
    let econtradoS = detailVariableList.some(v => v.idVariablesEconomicasNavigation.nombre === "SMLV");
    if (econtradoA) {
      detailVariableList.forEach(detalle => {
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
      detailVariableList.push(detalleVariable);
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
      detailVariableList.push(detalleVariableS);
    }
    return detailVariableList;
  }


  guardarDetalleCotizacion() {
    this.loading = true;
    const listaConHorasDias = this.filterAndInsertDaysAndHoursDetalleVariables(this.listaDeHoras.value);
    const listaConSumaDiasRequeridos = this.daysRequiredServiceVariableDetail(listaConHorasDias);
    const listaEditada = this.armadoAndSMLVCheck(listaConSumaDiasRequeridos);
    this.detalleCotizacionForm.value.detalleCotizacionVariables = listaEditada;
    if (this.data.newDetail) {
      this.detalleCotizacionService.createDetalleCotizacion(this.detalleCotizacionForm.value).subscribe({
        next: (data) => {
          this.loading = false;
          this.utilidadService.mostrarAlerta("Detalle de la cotización creado", "Urra!", "bottom", "center")
          this.onNoClick();
        },
        error: (error)=> {this.utilidadService.mostrarAlerta("No se pudo crear el detalle de la cotización", "Error!", "bottom", "center"); console.error(error)}
      });
      console.log(this.detalleCotizacionForm.value);
    } else {
      this.detalleCotizacionService.editDetalleCotizacion(this.detalleCotizacionForm.value).subscribe({
        next: () => {
          this.loading = false
          this.utilidadService.mostrarAlerta("Detalle de la cotización editado", "Bien hecho!", "bottom", "center");
          this.onNoClick();
        },
        error: (e)=> {console.error(e); this.utilidadService.mostrarAlerta("No se pudo editar el detalle de la cotización", "Error!", "bottom", "center")}
      });
      console.log(this.detalleCotizacionForm.value);
    }
  }


}
