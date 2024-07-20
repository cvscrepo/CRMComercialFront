import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListaCotizacionPageComponent } from './pages/lista-cotizacion-page/lista-cotizacion-page.component';
import { NewCotizacionPageComponent } from './pages/new-cotizacion-page/new-cotizacion-page.component';
import { DetalleCotizacionPageComponent } from './pages/detalle-cotizacion-page/detalle-cotizacion-page.component';
import { ClientsPageComponent } from './pages/clients-page/clients-page.component';
import { CotizadorPageComponent } from './pages/cotizador-page/cotizador-page.component';

const routes: Routes = [{
  path: '',
  component: LayoutPageComponent,
  children: [
    {path: 'list', component: ListaCotizacionPageComponent},
    {path: 'newcotizacion', component: NewCotizacionPageComponent},
    {path: 'clients', component: ClientsPageComponent},
    {path: 'cotizador', component: CotizadorPageComponent},
    {path: 'detallecotizacion/:id', component: DetalleCotizacionPageComponent},
    {path: '**', redirectTo: 'list'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizacionesRoutingModule { }
