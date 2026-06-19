import { Directive, ElementRef, Input, PLATFORM_ID, inject, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollActive]',
  standalone: true
})
export class ScrollActiveDirective implements OnChanges {
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  // We bind both the active state and the timing trigger into a single boolean
  @Input() appScrollActive = false;

  ngOnChanges(changes: SimpleChanges): void {
    // 1. SSR Check: Only execute DOM manipulation in the browser
    if (isPlatformBrowser(this.platformId)) {

      // 2. If this specific element becomes the active target, scroll it
      if (changes['appScrollActive']?.currentValue === true) {
        this.scrollToElement();
      }
    }
  }

  private scrollToElement(): void {
    // Encapsulated DOM access using ElementRef. No global document queries.
    this.el.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });
  }
}