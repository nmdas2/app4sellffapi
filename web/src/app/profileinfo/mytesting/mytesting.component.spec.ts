import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytestingComponent } from './mytesting.component';

describe('MytestingComponent', () => {
  let component: MytestingComponent;
  let fixture: ComponentFixture<MytestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytestingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
