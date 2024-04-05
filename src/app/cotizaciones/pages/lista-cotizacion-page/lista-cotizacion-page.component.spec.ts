import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCotizacionPageComponent } from './lista-cotizacion-page.component';

describe('ListaCotizacionPageComponent', () => {
  let component: ListaCotizacionPageComponent;
  let fixture: ComponentFixture<ListaCotizacionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaCotizacionPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaCotizacionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
