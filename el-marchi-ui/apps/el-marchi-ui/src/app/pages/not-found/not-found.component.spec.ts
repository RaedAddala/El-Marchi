import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { FaIconLibrary, FaConfig } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let faIconLibrary: FaIconLibrary;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [FaIconLibrary, FaConfig],
    }).compileComponents();

    faIconLibrary = TestBed.inject(FaIconLibrary);
    const faConfig = TestBed.inject(FaConfig);
    faConfig.defaultPrefix = 'fas';
    faIconLibrary.addIconPacks(fas);

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
