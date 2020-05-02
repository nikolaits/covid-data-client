import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrieshistoryComponent } from './countrieshistory.component';

describe('CountrieshistoryComponent', () => {
  let component: CountrieshistoryComponent;
  let fixture: ComponentFixture<CountrieshistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountrieshistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountrieshistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
