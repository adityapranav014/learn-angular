import { Component, OnInit, OnDestroy, ElementRef, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IKVideoDirective } from '@imagekit/angular';

@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [CommonModule, IKVideoDirective],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.scss'
})
export class MetricsComponent implements OnInit, OnDestroy {
  inView = signal(false);
  count1 = signal(0);
  count2 = signal(0);
  count3 = signal(0);
  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.inView.set(true);
          this.startAnimations();
          this.observer?.disconnect();
        }
      }, { threshold: 0.15 });

      this.observer.observe(this.el.nativeElement);
    } else {
      // Fallback
      this.inView.set(true);
      this.count1.set(3);
      this.count2.set(6);
      this.count3.set(12);
    }
  }

  private startAnimations() {
    // 2-second animation with staggering for effect
    setTimeout(() => this.animateCount(this.count1, 3, 2000), 150);
    setTimeout(() => this.animateCount(this.count2, 6, 2000), 300);
    setTimeout(() => this.animateCount(this.count3, 12, 2000), 450);
  }

  private animateCount(target: WritableSignal<number>, endValue: number, duration: number) {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart easing for a smooth slow-down effect at the end
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      target.set(Math.floor(easeProgress * endValue));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        target.set(endValue);
      }
    };
    window.requestAnimationFrame(step);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
