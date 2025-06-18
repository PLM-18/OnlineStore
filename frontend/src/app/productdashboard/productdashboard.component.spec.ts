import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductdashboardComponent } from './productdashboard.component';

describe('ProductdashboardComponent', () => {
  let component: ProductdashboardComponent;
  let fixture: ComponentFixture<ProductdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
