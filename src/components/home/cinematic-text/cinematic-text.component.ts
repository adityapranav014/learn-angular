import { Component, OnInit, OnDestroy, ElementRef, signal, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IKVideoDirective } from '@imagekit/angular';

@Component({
  selector: 'app-cinematic-text',
  standalone: true,
  imports: [CommonModule, IKVideoDirective],
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
      this.scrollListener = () => this.checkScroll();
      
      // Attach to app-main for desktop, window for mobile
      if (this.scrollContainer) {
        this.scrollContainer.addEventListener('scroll', this.scrollListener, { passive: true });
      }
      window.addEventListener('scroll', this.scrollListener, { passive: true });
      
      // Initial trigger
      setTimeout(() => this.checkScroll(), 100);
    });
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      if (this.scrollContainer) {
        this.scrollContainer.removeEventListener('scroll', this.scrollListener);
      }
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private checkScroll() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    
    // Fallback to window.innerHeight if scrollContainer is missing or behaves like body
    const containerHeight = this.scrollContainer && window.innerWidth >= 992 
      ? this.scrollContainer.clientHeight 
      : window.innerHeight;
    
    // progress is 0 when the top of the element is at the bottom of the viewport,
    // and 1 when the bottom of the element is at the top of the viewport.
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
