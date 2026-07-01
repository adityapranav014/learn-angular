import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FullscreenService {
  readonly isFullscreen = signal<boolean>(false);

  setFullscreen(value: boolean): void {
    this.isFullscreen.set(value);
  }
}
