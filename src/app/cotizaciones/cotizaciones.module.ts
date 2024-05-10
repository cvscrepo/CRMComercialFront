import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CotizacionesRoutingModule } from './cotizaciones-routing.module';
import { ListaCotizacionPageComponent } from './pages/lista-cotizacion-page/lista-cotizacion-page.component';
import { DetalleCotizacionPageComponent } from './pages/detalle-cotizacion-page/detalle-cotizacion-page.component';
import { NewCotizacionPageComponent } from './pages/new-cotizacion-page/new-cotizacion-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MaterialModule } from '../material/material.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ToolBarComponent } from './components/tool-bar/tool-bar/tool-bar.component';
import { SearchBarComponent } from './components/tool-bar/search-bar/search-bar.component';
import { FilterAndGroupButtonComponent } from './components/tool-bar/filter-and-group-button/filter-and-group-button.component';
import { PrintAndActionButtonComponent } from './components/tool-bar/print-and-action-button/print-and-action-button.component';
import { CreateAndEditButtonComponent } from './components/tool-bar/create-and-edit-button/create-and-edit-button.component';
import { CotizacionTableComponent } from './components/cotizacion-table/cotizacion-table.component';
import { CotizacionDetailComponent } from './components/cotizacion-detail/cotizacion-detail.component';
import { CotizacionStateComponent } from './components/cotizacion-state/cotizacion-state.component';
import { HorizontalMenuComponent } from './components/horizontal-menu/horizontal-menu.component';
import { ListaDetalleCotizacionComponent } from './components/cotizacion-detail/lista-detalle-cotizacion/lista-detalle-cotizacion.component';
import { LateralListComponent } from './components/cotizacion-detail/lateral-list/lateral-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterCotizacionPipe } from './pipes/filter-cotizacion.pipe';
import { LoadingComponent } from './components/loading/loading.component';
import { DetailCotizacionComponent } from './components/detail-cotizacion/detail-cotizacion.component';


@NgModule({
  declarations: [
    LayoutPageComponent,
    ListaCotizacionPageComponent,
    DetalleCotizacionPageComponent,
    NewCotizacionPageComponent,
    NavigationComponent,
    ToolBarComponent,
    SearchBarComponent,
    FilterAndGroupButtonComponent,
    PrintAndActionButtonComponent,
    CreateAndEditButtonComponent,
    CotizacionTableComponent,
    CotizacionDetailComponent,
    CotizacionStateComponent,
    HorizontalMenuComponent,
    ListaDetalleCotizacionComponent,
    LateralListComponent,
    FilterCotizacionPipe,
    LoadingComponent,
    DetailCotizacionComponent
  ],
  imports: [
    CommonModule,
    CotizacionesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    MaterialModule,
    NavigationComponent,
  ]
})
export class CotizacionesModule { }
