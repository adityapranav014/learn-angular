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

    // Check if the device is a touch device (mobile/tablet)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (isTouchDevice) {
      // On mobile, the user wants the video paused at the very end frame.
      video.pause();
      
      const setEndFrame = () => {
        if (video.duration) {
          // Set to just before the absolute end to ensure a frame is rendered
          video.currentTime = Math.max(0, video.duration - 0.1);
        }
      };

      if (video.readyState >= 1) {
        setEndFrame();
      } else {
        video.onloadedmetadata = setEndFrame;
      }
      return; // Exit early so we don't attach mouse listeners
    }

    // --- Desktop / Mouse Behavior ---
    video.pause();
    // Default to center frame so it looks perfect before the user moves their mouse
    const setCenterFrame = () => {
      if (video.duration) {
        this.targetTime = video.duration / 2;
        video.currentTime = video.duration / 2;
      }
    };

    if (video.readyState >= 1) {
      setCenterFrame();
    } else {
      video.onloadedmetadata = setCenterFrame;
    }

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
      this.scrubSub = interval(33).subscribe(() => {
        if (!video.duration) return;
        
        const diff = this.targetTime - video.currentTime;
        
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
