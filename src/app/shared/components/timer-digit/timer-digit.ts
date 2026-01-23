import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-timer-digit',
  imports: [],
  templateUrl: './timer-digit.html',
  styleUrl: './timer-digit.css',
})
export class TimerDigit {
  digit = input<number>(0);
}
