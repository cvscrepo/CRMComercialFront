import { Component, Input, OnInit } from '@angular/core';
import { Menu } from '../../interfaces/menu.interface';

@Component({
  selector: 'crm-navigation-component',
  templateUrl: 'navigation.component.html',
  styleUrl: 'navigation.component.css'
})

export class NavigationComponent implements OnInit {

  @Input()
  public nombreUsuario: string = 'Juan David Diaz Orozco';
  public menuProfile: boolean = false;
  public menuSells: boolean = false;
  public menuItems: Menu[] = [
    {
      item: "Mi perfil",
      svg: "account_circle",
      link: "/perfil"
    },
    {
      item: "Cerrar sesión",
      svg: "logout",
      link: "login"
    }
  ];
  public menuVentasButtons : Menu[] = [
    {
      item: "Cotizaciones",
      svg: "request_quote",
      link: "/cotizacion/list"
    },
    {
      item: "Cotizador",
      svg: "people",
      link: "/cotizacion/cotizador"
    },
    // {
    //   item: "Sucursales",
    //   svg: "maps_home_work",
    //   link: "cotizacion/sucursales"
    // }
  ]



  constructor() { }

  ngOnInit() { }

  toogle() {
    this.menuProfile = !this.menuProfile;
  }

  toggle2(){
    this.menuSells = !this.menuSells;
  }

  close(){
    this.menuProfile = false;
  }

  close1(){
    this.menuSells = false;
  }

}
