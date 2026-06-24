import { Component, Input, OnChanges, SimpleChanges, OnDestroy, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-scramble-text',
  standalone: true,
  template: `{{ displayText() }}`,
  styles: [`
    :host {
      display: inline;
    }
  `]
})
export class ScrambleTextComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) text: string = '';
  @Input() isHovered: boolean = false; // Allow manual override if needed

  displayText = signal<string>('');
  private internalHovered = false;

  private intervalId: any;
  private readonly CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><';

  ngOnInit() {
    this.displayText.set(this.text);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['text'] && !this.isCurrentlyHovered()) {
      this.displayText.set(this.text);
    }
    if (changes['isHovered']) {
      this.handleHoverChange();
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.internalHovered = true;
    this.handleHoverChange();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.internalHovered = false;
    this.handleHoverChange();
  }

  private isCurrentlyHovered(): boolean {
    return this.isHovered || this.internalHovered;
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private cleanup() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private handleHoverChange() {
    this.cleanup();
    if (this.isCurrentlyHovered()) {
      this.startHoverScramble();
    } else {
      this.displayText.set(this.text);
    }
  }

  private startHoverScramble() {
    let frame = 0;
    const framesPerChar = 4; // reveals left-to-right at 4 frames/char
    const intervalTime = 25; // 25ms interval
    
    this.intervalId = setInterval(() => {
      frame++;
      const cursor = Math.floor(frame / framesPerChar);
      
      if (cursor >= this.text.length) {
        this.displayText.set(this.text);
        clearInterval(this.intervalId);
        return;
      }
      
      let result = '';
      const Math_floor = Math.floor;
      const Math_random = Math.random;
      
      for (let i = 0; i < this.text.length; i++) {
        if (this.text[i] === ' ') {
          result += ' ';
        } else if (i < cursor) {
          result += this.text[i];
        } else {
          const randIdx = Math_floor(Math_random() * this.CHARS.length);
          result += this.CHARS[randIdx];
        }
      }
      this.displayText.set(result);
    }, intervalTime);
  }
}
