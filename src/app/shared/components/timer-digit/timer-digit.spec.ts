import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerDigit } from './timer-digit';

describe('TimerDigit', () => {
  let component: TimerDigit;
  let fixture: ComponentFixture<TimerDigit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerDigit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimerDigit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
