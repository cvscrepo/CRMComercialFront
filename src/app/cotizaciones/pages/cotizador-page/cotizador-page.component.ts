import { CotizacionService } from './../../services/cotizacion.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetailCotizacionComponent } from '../../components/detail-cotizacion/detail-cotizacion.component';

@Component({
  selector: 'app-cotizador-page',
  templateUrl: './cotizador-page.component.html',
  styleUrl: './cotizador-page.component.css'
})
export class CotizadorPageComponent implements OnInit {
  constructor(
    private cotizacionService: CotizacionService
  ){
    this.cotizacionService.isDisabled
  }
  ngOnInit(): void {
    this.cotizacionService.isDisabled = true;
  }
  public dataDetalle:any;
}
