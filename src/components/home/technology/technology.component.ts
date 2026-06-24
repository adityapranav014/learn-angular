import { Component, OnInit, OnDestroy, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-technology',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technology.component.html',
  styleUrl: './technology.component.scss'
})
export class TechnologyComponent implements OnInit, OnDestroy {
  inView = signal(false);
  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.inView.set(true);
          this.observer?.disconnect();
        }
      }, { threshold: 0.15 });

      this.observer.observe(this.el.nativeElement);
    } else {
      this.inView.set(true);
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
