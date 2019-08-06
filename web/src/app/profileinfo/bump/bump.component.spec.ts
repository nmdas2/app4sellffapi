import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BumpComponent } from './bump.component';

describe('BumpComponent', () => {
  let component: BumpComponent;
  let fixture: ComponentFixture<BumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
