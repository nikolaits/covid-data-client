import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryhistoryComponent } from './countryhistory.component';

describe('CountryhistoryComponent', () => {
  let component: CountryhistoryComponent;
  let fixture: ComponentFixture<CountryhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
