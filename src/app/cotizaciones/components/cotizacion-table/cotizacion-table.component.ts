import { Router } from '@angular/router';
import { responseApi } from '../../../shared/interfaces/response.interface';
import { Cotizacion } from '../../interfaces/cotizacion.interface';
import { CotizacionService } from './../../services/cotizacion.service';
import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild, viewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DomSanitizer } from '@angular/platform-browser';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/cliente.interface';
import { MatDialog } from '@angular/material/dialog';
import { ClientDetailComponent } from '../client/client-detail/client-detail.component';

@Component({
  selector: 'crm-cotizacion-table',
  templateUrl: './cotizacion-table.component.html',
  styleUrl: './cotizacion-table.component.css'
})
export class CotizacionTableComponent implements OnInit, AfterViewInit, OnChanges {
  public total: number = 0;
  @Input()
  public termBusqueda: string = "";
  @Input()
  public typeTable:number = 1;
  @Input()
  public displayColumns?: string[];

  public datosCargados: boolean = false;
  public dataSource = new MatTableDataSource<Cotizacion>([]);
  public dataSourceClients = new MatTableDataSource<Cliente>([]);
  public displayedColumns: string[] = ['checkbox', 'Cotización', 'Cliente', 'Correo', 'Telefono', 'Vendedor', 'Estado', 'Ingreso', 'svg'];
  public displayedColumns2: string[] = ['Cotización', 'Cliente', 'Vendedor', 'Estado', 'Ingreso'];
  public displayedColumns3: string[] = ['Nombre Cliente', 'Contacto', 'Correo Electrónico', 'Telefono', 'Prospecto', 'Fecha creación'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  //checkbox
  public theHtmlString:string='';

  constructor(
    private _cotizacionSerivice: CotizacionService,
    private router: Router,
    private _liveAnnouncer: LiveAnnouncer,
    private elementRef: ElementRef,
    private dialog: MatDialog,
    private clientService: ClienteService
  )
  {

  }

  ngOnInit(): void {
    if(this.typeTable !== 3){
      this.getAllCotizaciones();
    }else{
      this.subscribeToClientUpdates();
      this.getAllClientes();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.typeTable !== 3){
      this.dataSource.filter = changes['termBusqueda'].currentValue.trim().toLowerCase();
      this.getAllCotizaciones();
    }else{
      console.log("entra aqui");
      this.dataSourceClients.filter = changes['termBusqueda'].currentValue.trim().toLowerCase();
      this.getAllClientes();
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    this.dataSource.paginator = this.paginator;
    const containerWidth = this.elementRef.nativeElement.offsetWith;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public emitValue(id:number){
    this.router.navigate(['cotizacion/detallecotizacion', id]);
    console.log(id);
  }

  public openClienDetail(id:number){
    this.clientService.openClienDetail(id);
  }


  public getAllCotizaciones()
  {
    if (this._cotizacionSerivice.cotizacionList.length === 0) {
      this._cotizacionSerivice.getAllCotizacion().subscribe({
        next: (data: responseApi<Cotizacion[]>) => {
          if (data.success) {
            data.value.forEach(c => {
              if (c.estado === 1) {
                this.total += c.total;
              }
            });
            this.dataSource.data = this._cotizacionSerivice.cotizacionList;

          }
        },
        complete: () => {
          this.datosCargados = true;
        },
        error: (e) => {
          console.error(e);
        }
      });
    } else {
      this.dataSource.data = this._cotizacionSerivice.cotizacionList;
      this.datosCargados = true;
    }
  }

  public getAllClientes(){
    if(this.clientService.clienteSubject.value.length === 0){
      this.clientService.getClientes().subscribe({
        next: (data: responseApi<Cliente[]>) => {
          if(data.success){
            this.dataSourceClients.data = data.value;
          }
        },
        complete: () => {
          this.datosCargados = true;
        },
        error: (e) => {
          console.error(e);
        }
      });
    }
  }

  private subscribeToClientUpdates(): void {
    this.clientService.clientes$.subscribe(clientes => {
      this.dataSourceClients.data = clientes;
    });
  }
}
