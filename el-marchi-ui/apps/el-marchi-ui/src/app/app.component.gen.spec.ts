import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('title has default value', () => {
    expect(component.title).toEqual('el-marchi-ui');
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const initFontAwesomeSpy = jest.spyOn(component, 'initFontAwesome');
      component.ngOnInit();
      expect(initFontAwesomeSpy).toHaveBeenCalled();
    });
  });
});
