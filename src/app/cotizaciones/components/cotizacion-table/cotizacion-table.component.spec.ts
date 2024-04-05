import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionTableComponent } from './cotizacion-table.component';

describe('CotizacionTableComponent', () => {
  let component: CotizacionTableComponent;
  let fixture: ComponentFixture<CotizacionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CotizacionTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CotizacionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
