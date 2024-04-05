import { Router } from '@angular/router';
import { responseApi } from '../../../shared/interfaces/response.interface';
import { Cotizacion } from '../../interfaces/cotizacion.interface';
import { CotizacionService } from './../../services/cotizacion.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'crm-cotizacion-table',
  templateUrl: './cotizacion-table.component.html',
  styleUrl: './cotizacion-table.component.css'
})
export class CotizacionTableComponent implements OnInit{
  public cotizacionList: Cotizacion[] = [];
  public mostrarLoading: boolean =  false;
  public displayedColumns: string[] = ['Cotización', 'Nombre del cliente', 'Correo electrónico', 'Teléfono', 'Vendedor', 'Estado', 'Ingreso estimado'];

  constructor(
    private _cotizacionSerivice: CotizacionService,
    private router: Router
  )
  {

  }
  ngOnInit(): void {
    console.log("Table component");
    this.getAllCotizaciones();
  }

  public getAllCotizaciones() {
    this.mostrarLoading = true;
    this._cotizacionSerivice.getAllCotizacion().subscribe({
      next: (data: responseApi<Cotizacion[]>) => {
        if (data.success) {
          this.cotizacionList = data.value;
        }
      },
      complete: () => {

      },
      error: (e) => {
        console.error(e);
      }
    });
  }

}
