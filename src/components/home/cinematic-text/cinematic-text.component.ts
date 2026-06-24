import { Component, OnInit, OnDestroy, ElementRef, signal, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cinematic-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cinematic-text.component.html',
  styleUrl: './cinematic-text.component.scss'
})
export class CinematicTextComponent implements OnInit, OnDestroy {
  opacity = signal(0);
  translateY = signal(60);

  private scrollContainer: HTMLElement | null = null;
  private scrollListener!: () => void;

  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngOnInit() {
    // Run scroll listener outside Angular zone to prevent triggering change detection on every pixel scroll
    this.ngZone.runOutsideAngular(() => {
      this.scrollContainer = document.querySelector('.app-main');
      if (this.scrollContainer) {
        this.scrollListener = () => this.checkScroll();
        this.scrollContainer.addEventListener('scroll', this.scrollListener, { passive: true });
        
        // Initial trigger
        setTimeout(() => this.checkScroll(), 100);
      }
    });
  }

  ngOnDestroy() {
    if (this.scrollContainer && this.scrollListener) {
      this.scrollContainer.removeEventListener('scroll', this.scrollListener);
    }
  }

  private checkScroll() {
    if (!this.scrollContainer) return;

    const rect = this.el.nativeElement.getBoundingClientRect();
    const containerHeight = this.scrollContainer.clientHeight;
    
    // progress is 0 when the top of the element is at the bottom of the container,
    // and 1 when the bottom of the element is at the top of the container.
    const elementHeight = rect.height;
    const scrollStart = containerHeight;
    const scrollEnd = -elementHeight;

    const currentY = rect.top;
    const totalDist = scrollStart - scrollEnd;
    
    const progress = (scrollStart - currentY) / totalDist;
    const clampedProgress = Math.max(0, Math.min(1, progress));

    // Opacity fades in from 0 to 1 between scroll progress 0.3 and 0.5
    let op = 0;
    if (clampedProgress < 0.25) {
      op = 0;
    } else if (clampedProgress > 0.5) {
      op = 1;
    } else {
      op = (clampedProgress - 0.25) / 0.25;
    }

    // translateY transforms from 60 to -120 based on scroll progress
    const transY = 60 - (clampedProgress * 180);

    // Update signals back in Angular zone
    this.ngZone.run(() => {
      this.opacity.set(op);
      this.translateY.set(transY);
    });
  }
}
