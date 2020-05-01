import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobaldataComponent } from './globaldata.component';

describe('GlobaldataComponent', () => {
  let component: GlobaldataComponent;
  let fixture: ComponentFixture<GlobaldataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobaldataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobaldataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
