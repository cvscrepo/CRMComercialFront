import { CotizacionService } from './../../../services/cotizacion.service';
import { Component, ElementRef, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { Menu } from '../../../interfaces/menu.interface';
import { Cotizacion } from '../../../interfaces/cotizacion.interface';

@Component({
  selector: 'crm-filter-and-group-button',
  templateUrl: './filter-and-group-button.component.html',
  styleUrl: './filter-and-group-button.component.css'
})
export class FilterAndGroupButtonComponent implements OnChanges {
  public filterclick:boolean = false;
  public gruopClick:boolean = false;
  public mostrarSVG : number | null = null;
  public cotizacionSort : Cotizacion[] =[];

  constructor(
    private cotizacionService : CotizacionService,
    private elementRef : ElementRef
  ){}

  ngOnChanges(changes: SimpleChanges): void {
    this.cotizacionService.cotizacionList = this.cotizacionSort;
  }
  public menuItemsFilter: Menu[]= [
    {
      item: "Nombre",
      svg: "done",
      link: ""
    },
    {
      item: "Cliente",
      svg: "done",
      link: ""
    },
    {
      item: "Total",
      svg: "done",
      link: ""
    },
    {
      item: "Estado",
      svg: "done",
      link: ""
    },
    {
      item: "fechaCreacion",
      svg: "done",
      link: ""
    }
  ]

  public menuGroupItems: Menu[] = [
    {
      item: "Vendedor",
      svg: "done",
      link: ""
    },
    {
      item: "Cliente",
      svg: "done",
      link: ""
    },
    {
      item: "Fecha cotización",
      svg: "done",
      link: ""
    }
  ];



  showFilterMenu(){
    this.filterclick = !this.filterclick;
    if(this.gruopClick) this.gruopClick = !this.filterclick;
  }
  showGroupMenu(){
    this.gruopClick = !this.gruopClick;
    if(this.filterclick) this.filterclick = !this.filterclick;
  }

  public onTermSelect(term : string, index : number){
    try{
      if (this.mostrarSVG === index) {
        this.mostrarSVG = null;
        this.cotizacionService.sortOriginalCotizacion();
      } else {
        this.mostrarSVG = index;
        this.cotizacionService.sortCotizacion(term.toLocaleLowerCase());
        console.log(this.cotizacionSort);
      }
    }catch(e){
      console.error(e);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.filterclick = false;
      this.gruopClick = false;
    }
  }

}
