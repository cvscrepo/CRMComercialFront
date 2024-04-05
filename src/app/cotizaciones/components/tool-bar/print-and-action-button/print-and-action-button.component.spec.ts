import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAndActionButtonComponent } from './print-and-action-button.component';

describe('PrintAndActionButtonComponent', () => {
  let component: PrintAndActionButtonComponent;
  let fixture: ComponentFixture<PrintAndActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintAndActionButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintAndActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
