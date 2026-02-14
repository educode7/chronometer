import { Component, OnDestroy, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { TimerDigit } from '../../../shared/components/timer-digit/timer-digit';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { sectionsSignal, Section } from './sections';

@Component({
  selector: 'app-chronometer',
  imports: [TimerDigit, CommonModule],
  templateUrl: './chronometer.html',
  styleUrl: './chronometer.css',
  encapsulation: ViewEncapsulation.None,
})
export class Chronometer implements OnInit, OnDestroy {
  private sections = sectionsSignal.asReadonly();
  private currentSectionIndex = 0;
  public currentSectionText = signal('');

  private time: number = 0;
  private timer: any;
  public running: boolean = false;

  minutesDigit1 = signal(0);
  minutesDigit2 = signal(0);
  secondsDigit1 = signal(0);
  secondsDigit2 = signal(0);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Check if we have custom time from the timer setup form
    const initialHours = Number(this.route.snapshot.queryParams['hours']) || 0;
    const initialMinutes = Number(this.route.snapshot.queryParams['minutes']) || 0;
    const initialSeconds = Number(this.route.snapshot.queryParams['seconds']) || 0;
    
    if (initialHours > 0 || initialMinutes > 0 || initialSeconds > 0) {
      // Use custom time from timer setup
      this.time = initialHours * 3600 + initialMinutes * 60 + initialSeconds;
      this.currentSectionText.set('Cronómetro Personalizado');
    } else {
      // Use the first section from the sections list
      this.setupSection(this.currentSectionIndex);
    }
    this.updateDigits();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  reset(): void {
    this.stop();
    this.running = false;
    
    // Check if we had custom time from timer setup
    const initialHours = Number(this.route.snapshot.queryParams['hours']) || 0;
    const initialMinutes = Number(this.route.snapshot.queryParams['minutes']) || 0;
    const initialSeconds = Number(this.route.snapshot.queryParams['seconds']) || 0;
    
    if (initialHours > 0 || initialMinutes > 0 || initialSeconds > 0) {
      // Reset to custom time
      this.time = initialHours * 3600 + initialMinutes * 60 + initialSeconds;
      this.currentSectionText.set('Cronómetro Personalizado');
    } else {
      // Reset to the first section
      this.currentSectionIndex = 0;
      this.setupSection(this.currentSectionIndex);
    }
    this.updateDigits();
  }

  start(): void {
    if (!this.running) {
      this.running = true;
      this.timer = setInterval(() => {
        if (this.time > 0) {
          this.time--;
          this.updateDigits();
        } else {
          // Stop the current timer before the delay
          clearInterval(this.timer);
          this.nextSection();
        }
      }, 1000);
    }
  }

  private sectionTransitionTimeout: any = null;

  stop(): void {
    this.running = false;
    clearInterval(this.timer);
    if (this.sectionTransitionTimeout) {
      clearTimeout(this.sectionTransitionTimeout);
      this.sectionTransitionTimeout = null;
    }
  }

  private nextSection(): void {
    // Play notification sound
    this.playNotificationSound();
    
    // Wait 5 seconds before moving to the next section
    this.sectionTransitionTimeout = setTimeout(() => {
      this.currentSectionIndex++;
      if (this.currentSectionIndex >= this.sections().length) {
        this.currentSectionIndex = 0; // Loop back to the first section
      }
      this.setupSection(this.currentSectionIndex);
      
      // Restart the timer if the chronometer is still running
      if (this.running) {
        this.timer = setInterval(() => {
          if (this.time > 0) {
            this.time--;
            this.updateDigits();
          } else {
            // Stop the current timer before the delay
            clearInterval(this.timer);
            this.nextSection();
          }
        }, 1000);
      }
    }, 5000); // 5 seconds delay
  }

  private setupSection(sectionIndex: number): void {
    this.currentSectionIndex = sectionIndex;
    const currentSection = this.sections()[sectionIndex];
    this.time = this.parseTimeToSeconds(currentSection.time);
    this.currentSectionText.set(currentSection.text);
    this.updateDigits();
  }

  private playNotificationSound(): void {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create oscillator for the beep sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'triangle'; // Type of waveform
      oscillator.frequency.value = 800; // Frequency in hertz
      
      // Initially set gain to 0 (silent)
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Play the oscillator
      oscillator.start();
      
      // Create a pulsing effect for 5 seconds
      // Pulse every 1 second (like a heartbeat)
      const pulseInterval = 1.0; // seconds
      const pulseDuration = 0.3; // Duration of each pulse
      const startTime = audioContext.currentTime + 0.1; // Start after a small delay
      const endTime = startTime + 5.0; // Total duration
      
      // Schedule the pulses
      let pulseTime = startTime;
      while (pulseTime < endTime) {
        // Each pulse: ramp up, hold, ramp down
        gainNode.gain.setValueAtTime(0, pulseTime);
        gainNode.gain.linearRampToValueAtTime(0.3, pulseTime + 0.05); // Quick ramp up
        gainNode.gain.setValueAtTime(0.3, pulseTime + pulseDuration/2); // Hold
        gainNode.gain.linearRampToValueAtTime(0, pulseTime + pulseDuration); // Ramp down
        
        pulseTime += pulseInterval;
      }
      
      // Stop the oscillator after 5 seconds
      oscillator.stop(endTime);
      
      // Close the audio context after the sound finishes
      setTimeout(() => {
        if (audioContext.state !== 'closed') {
          audioContext.close();
        }
      }, 5100); // Slightly longer than the sound duration (5 seconds = 5000 ms)
    } catch (e) {
      console.warn('Could not play notification sound:', e);
    }
  }

  private parseTimeToSeconds(timeString: string): number {
    const parts = timeString.split(':').map(Number);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  private updateDigits(): void {
    const totalSeconds = this.time;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // For display purposes, we'll show minutes and seconds in the current format
    // If hours > 0, we'll add them to the minutes display
    const totalMinutes = hours * 60 + minutes;

    this.minutesDigit1.set(Math.floor(totalMinutes / 10));
    this.minutesDigit2.set(minutes % 10);
    this.secondsDigit1.set(Math.floor(seconds / 10));
    this.secondsDigit2.set(seconds % 10);
  }

  goToTimerSetup(): void {
    this.router.navigate(['/timer-setup']);
  }
}
