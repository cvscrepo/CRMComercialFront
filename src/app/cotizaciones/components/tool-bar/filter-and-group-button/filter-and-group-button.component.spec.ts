import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAndGroupButtonComponent } from './filter-and-group-button.component';

describe('FilterAndGroupButtonComponent', () => {
  let component: FilterAndGroupButtonComponent;
  let fixture: ComponentFixture<FilterAndGroupButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterAndGroupButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterAndGroupButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
