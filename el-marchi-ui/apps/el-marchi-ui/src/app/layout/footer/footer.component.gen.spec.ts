import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { FaIconLibrary, FaConfig, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from '../../../shared/font-awesome-icons';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let faIconLibrary: FaIconLibrary;
  let faConfig: FaConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        FontAwesomeModule
      ],
      providers: [FaIconLibrary, FaConfig],
    }).compileComponents();

    faIconLibrary = TestBed.inject(FaIconLibrary);
    faConfig = TestBed.inject(FaConfig);

    faConfig.defaultPrefix = 'far';

    faIconLibrary.addIcons(...fontAwesomeIcons);

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('currentYear has the correct value', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear).toEqual(currentYear);
  });
});
