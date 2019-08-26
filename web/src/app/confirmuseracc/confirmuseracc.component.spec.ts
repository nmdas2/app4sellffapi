import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmuseraccComponent } from './confirmuseracc.component';

describe('ConfirmuseraccComponent', () => {
  let component: ConfirmuseraccComponent;
  let fixture: ComponentFixture<ConfirmuseraccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmuseraccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmuseraccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
