import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteHomeComponent } from './delete-home.component';

describe('DeleteHomeComponent', () => {
  let component: DeleteHomeComponent;
  let fixture: ComponentFixture<DeleteHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
