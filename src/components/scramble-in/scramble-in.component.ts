import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-scramble-in',
  standalone: true,
  template: `<span>{{ displayText() }}</span>`,
  styles: [`
    :host {
      display: inline;
    }
  `]
})
export class ScrambleInComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) text: string = '';
  @Input() delay: number = 0;
  @Input() triggered: boolean = false;

  displayText = signal<string>('\u00A0'); // Default to &nbsp; character

  private intervalId: any;
  private timeoutId: any;
  private hasStarted = false;
  private readonly CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><';

  ngOnInit() {
    this.checkTrigger();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['triggered']) {
      this.checkTrigger();
    }
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private cleanup() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private checkTrigger() {
    if (this.triggered && !this.hasStarted) {
      this.hasStarted = true;
      this.cleanup();
      
      this.timeoutId = setTimeout(() => {
        this.startScramble();
      }, this.delay);
    }
  }

  private startScramble() {
    let frame = 0;
    const speed = 0.5; // 0.5 chars per frame (releasing 1 char every 2 frames)
    const intervalTime = 25; // 25ms interval
    
    this.intervalId = setInterval(() => {
      frame++;
      const cursor = frame * speed;
      
      if (cursor >= this.text.length) {
        this.displayText.set(this.text);
        clearInterval(this.intervalId);
        return;
      }
      
      let result = '';
      const Math_floor = Math.floor;
      const Math_random = Math.random;
      const cursorInt = Math_floor(cursor);
      
      for (let i = 0; i < this.text.length; i++) {
        if (this.text[i] === ' ') {
          result += ' ';
        } else if (i < cursorInt) {
          result += this.text[i];
        } else if (i < cursorInt + 3) {
          // up to 3 characters ahead of reveal cursor show random chars
          const randIdx = Math_floor(Math_random() * this.CHARS.length);
          result += this.CHARS[randIdx];
        } else {
          // characters beyond that are empty
          break;
        }
      }
      this.displayText.set(result || '\u00A0');
    }, intervalTime);
  }
}
