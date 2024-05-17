import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectsOfCotizacionComponent } from './selects-of-cotizacion.component';

describe('SelectsOfCotizacionComponent', () => {
  let component: SelectsOfCotizacionComponent;
  let fixture: ComponentFixture<SelectsOfCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectsOfCotizacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectsOfCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
