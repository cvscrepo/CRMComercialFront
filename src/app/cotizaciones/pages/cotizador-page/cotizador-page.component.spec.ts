import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizadorPageComponent } from './cotizador-page.component';

describe('CotizadorPageComponent', () => {
  let component: CotizadorPageComponent;
  let fixture: ComponentFixture<CotizadorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CotizadorPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CotizadorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
