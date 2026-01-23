import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chronometer } from './chronometer';

describe('Chronometer', () => {
  let component: Chronometer;
  let fixture: ComponentFixture<Chronometer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chronometer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chronometer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
