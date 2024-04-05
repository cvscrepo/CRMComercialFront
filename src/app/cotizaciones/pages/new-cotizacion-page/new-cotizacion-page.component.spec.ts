import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCotizacionPageComponent } from './new-cotizacion-page.component';

describe('NewCotizacionPageComponent', () => {
  let component: NewCotizacionPageComponent;
  let fixture: ComponentFixture<NewCotizacionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewCotizacionPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewCotizacionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
