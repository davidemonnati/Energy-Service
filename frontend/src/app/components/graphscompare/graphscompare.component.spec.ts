import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphscompareComponent } from './graphscompare.component';

describe('GraphscompareComponent', () => {
  let component: GraphscompareComponent;
  let fixture: ComponentFixture<GraphscompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphscompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphscompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
