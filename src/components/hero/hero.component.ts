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
import { IKVideoDirective } from '@imagekit/angular';
import { ScrambleInComponent } from '../scramble-in/scramble-in.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ScrambleInComponent, IKVideoDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroVideo') heroVideoRef!: ElementRef<HTMLVideoElement>;

  entranceComplete = signal(false);

  // Scramble trigger
  triggered = signal(false);

  private targetTime = 0;
  private currentTime = 0;
  private rafId = 0;
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  private entranceTimerId: any;
  private isRunning = false;

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

    // --- Desktop / Mouse Behavior ---
    video.pause();
    // Default to center frame so it looks perfect before the user moves their mouse
    const setCenterFrame = () => {
      if (video.duration) {
        this.targetTime = video.duration / 2;
        this.currentTime = video.duration / 2;
        video.currentTime = video.duration / 2;
      }
    };

    if (video.readyState >= 1) {
      setCenterFrame();
    } else {
      video.onloadedmetadata = setCenterFrame;
    }

    // Run outside Angular to avoid triggering Change Detection on every frame
    this.ngZone.runOutsideAngular(() => {
      
      // Lightweight mouse listener — just stores the target value, no DOM work
      this.mouseMoveHandler = (e: MouseEvent) => {
        if (video.duration) {
          const raw = (e.clientX / window.innerWidth) * video.duration;
          // Clamp to avoid seeking to the very start/end — browsers
          // enter an "ended" state at the boundary and stop responding.
          this.targetTime = Math.max(0.05, Math.min(raw, video.duration - 0.05));
        }
      };
      window.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });

      // Single rAF loop for smooth interpolation
      this.isRunning = true;
      const scrubLoop = () => {
        if (!this.isRunning) return;

        if (video.duration) {
          const diff = this.targetTime - this.currentTime;

          // 1. Update the animated currentTime smoothly at 60 FPS in memory
          if (Math.abs(diff) > 0.005) {
            this.currentTime += diff * 0.12;
          } else {
            this.currentTime = this.targetTime;
          }

          // 2. Only seek if the video decoder is not busy and there is a meaningful change
          if (!video.seeking && Math.abs(video.currentTime - this.currentTime) > 0.01) {
            video.currentTime = this.currentTime;
          }
        }

        this.rafId = requestAnimationFrame(scrubLoop);
      };

      this.rafId = requestAnimationFrame(scrubLoop);
    });
  }

  ngOnDestroy() {
    if (this.entranceTimerId) clearTimeout(this.entranceTimerId);

    this.isRunning = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);

    if (this.mouseMoveHandler) {
      window.removeEventListener('mousemove', this.mouseMoveHandler);
      this.mouseMoveHandler = null;
    }
  }

  scrollDown() {
    const nextSection = document.querySelector('.home-shell');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
