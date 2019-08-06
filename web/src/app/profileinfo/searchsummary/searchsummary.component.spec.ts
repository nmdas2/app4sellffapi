import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchsummaryComponent } from './searchsummary.component';

describe('SearchsummaryComponent', () => {
  let component: SearchsummaryComponent;
  let fixture: ComponentFixture<SearchsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
