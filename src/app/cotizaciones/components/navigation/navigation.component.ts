import { Component, Input, OnInit } from '@angular/core';
import { Menu } from '../../interfaces/menu.interface';

@Component({
  selector: 'crm-navigation-component',
  templateUrl: 'navigation.component.html',
  styleUrl: 'navigation.component.css'
})

export class NavigationComponent implements OnInit {

  @Input()
  public nombreUsuario:string = 'Juan David Diaz Orozco';
  public menuProfile:boolean = false;
  public menuItems:Menu[] = [
  {
    item: "Mi perfil",
    svg: "account_circle"
  },
  {
    item: "Cerrar sesión",
    svg: "logout"
  }
];

  constructor() { }

  ngOnInit() { }

  toogle()
  {
    this.menuProfile = !this.menuProfile;
  }
}
