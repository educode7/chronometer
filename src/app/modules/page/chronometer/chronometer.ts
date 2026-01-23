import { Component, OnDestroy, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { TimerDigit } from '../../../shared/components/timer-digit/timer-digit';
import { CommonModule } from '@angular/common';
import { SECTIONS } from './sections';

@Component({
  selector: 'app-chronometer',
  imports: [TimerDigit, CommonModule],
  templateUrl: './chronometer.html',
  styleUrl: './chronometer.css',
  encapsulation: ViewEncapsulation.None,
})
export class Chronometer implements OnInit, OnDestroy {
  private sections = SECTIONS;

  private currentSectionIndex = 0;
  public currentSectionText = signal('');

  private time: number = 0;
  private timer: any;
  public running: boolean = false;

  minutesDigit1 = signal(0);
  minutesDigit2 = signal(0);
  secondsDigit1 = signal(0);
  secondsDigit2 = signal(0);

  ngOnInit(): void {
    this.setupSection(this.currentSectionIndex);
  }

  ngOnDestroy(): void {
    this.stop();
  }

  reset(): void {
    this.stop();
    this.running = false;
    this.currentSectionIndex = 0;
    this.setupSection(this.currentSectionIndex);
  }

  start(): void {
    if (!this.running) {
      this.running = true;
      this.timer = setInterval(() => {
        if (this.time > 0) {
          this.time--;
          this.updateDigits();
        } else {
          this.nextSection();
        }
      }, 1000);
    }
  }

  stop(): void {
    this.running = false;
    clearInterval(this.timer);
  }

  private nextSection(): void {
    this.currentSectionIndex++;
    if (this.currentSectionIndex >= this.sections.length) {
      this.currentSectionIndex = 0; // Loop
    }
    this.setupSection(this.currentSectionIndex);
  }

  private setupSection(sectionIndex: number): void {
    this.currentSectionIndex = sectionIndex;
    const currentSection = this.sections[sectionIndex];
    this.time = this.parseTimeToSeconds(currentSection.time);
    this.currentSectionText.set(currentSection.text);
    this.updateDigits();
  }

  private parseTimeToSeconds(timeString: string): number {
    const parts = timeString.split(':').map(Number);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  private updateDigits(): void {
    const totalSeconds = this.time;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    this.minutesDigit1.set(Math.floor(minutes / 10));
    this.minutesDigit2.set(minutes % 10);
    this.secondsDigit1.set(Math.floor(seconds / 10));
    this.secondsDigit2.set(seconds % 10);
  }
}
