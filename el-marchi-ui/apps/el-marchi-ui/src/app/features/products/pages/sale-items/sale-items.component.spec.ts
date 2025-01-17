import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaleItemsComponent } from './sale-items.component';

describe('SaleItemsComponent', () => {
  let component: SaleItemsComponent;
  let fixture: ComponentFixture<SaleItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SaleItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
