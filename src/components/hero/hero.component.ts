import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  signal,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrambleInComponent } from '../scramble-in/scramble-in.component';
import { fromEvent, Subscription, interval, animationFrameScheduler } from 'rxjs';
import { throttleTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ScrambleInComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroVideo') heroVideoRef!: ElementRef<HTMLVideoElement>;

  entranceComplete = signal(false);

  // Scramble trigger
  triggered = signal(false);

  private targetTime = 0;
  private mouseSub!: Subscription;
  private scrubSub!: Subscription;
  private entranceTimerId: any;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    // Entrance complete after 800ms
    this.entranceTimerId = setTimeout(() => {
      this.entranceComplete.set(true);
      this.triggered.set(true);
    }, 800);
  }

  ngAfterViewInit() {
    const video = this.heroVideoRef.nativeElement;
    video.pause();
    video.currentTime = 0;

    // Run outside Angular to avoid triggering Change Detection continuously
    this.ngZone.runOutsideAngular(() => {
      
      // 1. Reactive Mouse Movement Stream
      this.mouseSub = fromEvent<MouseEvent>(window, 'mousemove')
        .pipe(
          throttleTime(0, animationFrameScheduler),
          map(e => e.clientX / window.innerWidth)
        )
        .subscribe(fraction => {
          if (video.duration) {
            this.targetTime = fraction * video.duration;
          }
        });

      // 2. Throttled Scrubbing Loop
      // Setting video.currentTime at 60fps can cause decoding lag in browsers.
      // We throttle the assignments to ~30fps (33ms) to let the decoder breathe,
      // while using a strong lerp factor (0.4) so it stays extremely snappy.
      this.scrubSub = interval(33).subscribe(() => {
        if (!video.duration) return;
        
        const diff = this.targetTime - video.currentTime;
        
        // Threshold prevents micro-stutters when it's extremely close to target
        if (Math.abs(diff) > 0.05) {
          video.currentTime += diff * 0.4;
        }
      });

    });
  }

  ngOnDestroy() {
    if (this.entranceTimerId) clearTimeout(this.entranceTimerId);
    if (this.mouseSub) this.mouseSub.unsubscribe();
    if (this.scrubSub) this.scrubSub.unsubscribe();
  }

  scrollDown() {
    const nextSection = document.querySelector('.home-shell');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
