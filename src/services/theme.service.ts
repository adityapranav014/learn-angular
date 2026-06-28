import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'learn_angular_theme_preference';
  
  // The user's selected preference
  theme = signal<Theme>('system');
  
  // The actual resolved theme (light or dark)
  resolvedTheme = signal<'light' | 'dark'>('light');

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    if (typeof window === 'undefined') return;

    // Load from local storage
    const storedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      this.theme.set(storedTheme);
    }

    // Set up listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => this.updateResolvedTheme());

    // Effect to persist preference and update DOM when theme or system pref changes
    effect(() => {
      const currentTheme = this.theme();
      localStorage.setItem(this.THEME_KEY, currentTheme);
      this.updateResolvedTheme();
    });
  }

  private updateResolvedTheme() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    let resolved: 'light' | 'dark' = 'light';
    const currentTheme = this.theme();

    if (currentTheme === 'system') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolved = isSystemDark ? 'dark' : 'light';
    } else {
      resolved = currentTheme as 'light' | 'dark';
    }

    this.resolvedTheme.set(resolved);
    document.documentElement.setAttribute('data-bs-theme', resolved);
  }

  setTheme(newTheme: Theme) {
    this.theme.set(newTheme);
  }
}
