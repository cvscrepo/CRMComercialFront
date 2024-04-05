import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAndEditButtonComponent } from './create-and-edit-button.component';

describe('CreateAndEditButtonComponent', () => {
  let component: CreateAndEditButtonComponent;
  let fixture: ComponentFixture<CreateAndEditButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAndEditButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateAndEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
