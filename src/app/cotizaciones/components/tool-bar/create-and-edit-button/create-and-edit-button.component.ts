import { Component, Input } from '@angular/core';

@Component({
  selector: 'crm-create-and-edit-button',
  templateUrl: './create-and-edit-button.component.html',
  styleUrl: './create-and-edit-button.component.css'
})
export class CreateAndEditButtonComponent {
  @Input()
  public onlyCreate: boolean = false;
}
