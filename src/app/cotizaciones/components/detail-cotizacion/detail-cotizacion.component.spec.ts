import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCotizacionComponent } from './detail-cotizacion.component';

describe('DetailCotizacionComponent', () => {
  let component: DetailCotizacionComponent;
  let fixture: ComponentFixture<DetailCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailCotizacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
