import { Component } from '@angular/core';

@Component({
  selector: 'crm-horizontal-menu',
  templateUrl: './horizontal-menu.component.html',
  styleUrl: './horizontal-menu.component.css'
})
export class HorizontalMenuComponent {
  activeLink:number=1;

  setActiveLink(link: number): void {
    this.activeLink = link;
  }

}
