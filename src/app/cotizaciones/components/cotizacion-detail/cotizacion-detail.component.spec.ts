import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionDetailComponent } from './cotizacion-detail.component';

describe('CotizacionDetailComponent', () => {
  let component: CotizacionDetailComponent;
  let fixture: ComponentFixture<CotizacionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CotizacionDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CotizacionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
