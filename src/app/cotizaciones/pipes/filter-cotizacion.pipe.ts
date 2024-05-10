import { Pipe, PipeTransform } from '@angular/core';
import { Cliente } from '../interfaces/cliente.interface';

@Pipe({
  name: 'filterCotizacion'
})

export class FilterCotizacionPipe implements PipeTransform {
  transform(lista: any[], searchText: string): any[] {
    if(!lista){
      return []
    }
    if(!searchText){
      return lista;
    }
    searchText = searchText.toLowerCase();
    return lista.filter((c)=>{
      return c.nombreCompleto.toLowerCase().includes(searchText);
    })
  }
}
