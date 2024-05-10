import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LateralListComponent } from './lateral-list.component';

describe('LateralListComponent', () => {
  let component: LateralListComponent;
  let fixture: ComponentFixture<LateralListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LateralListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LateralListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
