import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionStateComponent } from './cotizacion-state.component';

describe('CotizacionStateComponent', () => {
  let component: CotizacionStateComponent;
  let fixture: ComponentFixture<CotizacionStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CotizacionStateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CotizacionStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
