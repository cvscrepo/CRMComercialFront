import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCotizacionPageComponent } from './detalle-cotizacion-page.component';

describe('DetalleCotizacionPageComponent', () => {
  let component: DetalleCotizacionPageComponent;
  let fixture: ComponentFixture<DetalleCotizacionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleCotizacionPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleCotizacionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
