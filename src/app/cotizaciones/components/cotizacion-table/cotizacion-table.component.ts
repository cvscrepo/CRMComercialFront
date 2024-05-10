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
  public typeTable:boolean = true;
  public datosCargados: boolean = false;
  public dataSource = new MatTableDataSource<Cotizacion>([]);
  public displayedColumns: string[] = ['checkbox', 'Cotización', 'Cliente', 'Correo', 'Telefono', 'Vendedor', 'Estado', 'Ingreso', 'svg'];
  public displayedColumns2: string[] = ['Cotización', 'Cliente', 'Vendedor', 'Estado', 'Ingreso'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  //checkbox
  public theHtmlString:string='';

  constructor(
    private _cotizacionSerivice: CotizacionService,
    private router: Router,
    private _liveAnnouncer: LiveAnnouncer,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer
  )
  {
  }

  ngOnInit(): void {
    console.log("Table component");
    this.getAllCotizaciones();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource.filter = changes['termBusqueda'].currentValue.trim().toLowerCase();
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
}
