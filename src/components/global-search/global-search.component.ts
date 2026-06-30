import {
  Component,
  inject,
  signal,
  computed,
  PLATFORM_ID,
  OnDestroy
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Highlight } from 'ngx-highlightjs';
import { AiSearchService, AiCodeFile } from '../../services/ai-search.service';
import { marked } from 'marked';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
  imports: [CommonModule, FormsModule, Highlight, NgbTooltipModule]
})
export class GlobalSearchComponent implements OnDestroy {
  private sanitizer = inject(DomSanitizer);
  protected readonly ai = inject(AiSearchService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly fullPlaceholder = 'Ask anything... e.g. Angular Signals, RxJS switchMap, lazy loading';
  private readonly mobileBreakpoint = 767;
  private readonly resizeHandler = () => this.updatePlaceholderText();

  query = signal('');
  placeholderText = signal(this.fullPlaceholder);
  activeFileIndex = signal(0);
  copiedIndex = signal<number | null>(null);
  private copyTimer: ReturnType<typeof setTimeout> | null = null;

  readonly suggestions = [
    'Angular Signals',
    'RxJS switchMap vs mergeMap',
    'Angular lazy loading routes',
    'Angular standalone components',
    'NgRx state management',
    'Angular dependency injection',
  ];

  theoryHtml = computed((): SafeHtml => {
    const result = this.ai.result();
    if (!result?.theory) return '';
    const html = marked.parse(result.theory) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  activeFile = computed((): AiCodeFile | null => {
    const files = this.ai.result()?.files;
    if (!files?.length) return null;
    const idx = this.activeFileIndex();
    return files[idx < files.length ? idx : 0];
  });

  // Track FullScreen status of code hint
  readonly isFullscreen = signal<boolean>(false);

  constructor() {
    if (this.isBrowser) {
      this.updatePlaceholderText();
      window.addEventListener('resize', this.resizeHandler, { passive: true });
    }
  }

  private updatePlaceholderText(): void {
    if (!this.isBrowser) {
      return;
    }

    const width = window.innerWidth;
    if (width > this.mobileBreakpoint) {
      this.placeholderText.set(this.fullPlaceholder);
      return;
    }

    // Reserve space for the icon, action button, and input paddings on compact screens.
    const reservedWidth = 150;
    const usableWidth = Math.max(140, width - reservedWidth);
    const approxCharWidth = 7;
    const maxChars = Math.max(22, Math.floor(usableWidth / approxCharWidth));

    if (this.fullPlaceholder.length <= maxChars) {
      this.placeholderText.set(this.fullPlaceholder);
      return;
    }

    const truncated = `${this.fullPlaceholder.slice(0, Math.max(0, maxChars - 1)).trimEnd()}...`;
    this.placeholderText.set(truncated);
  }

  toggleFullscreen() {
    this.isFullscreen.update(v => !v);
  }

  async onSearch(): Promise<void> {
    const q = this.query().trim();
    if (!q) return;
    this.activeFileIndex.set(0);
    await this.ai.searchTopic(q);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.onSearch();
  }

  selectFile(index: number): void {
    this.activeFileIndex.set(index);
  }

  async copyCode(code: string, index: number): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      this.copiedIndex.set(index);
      if (this.copyTimer) clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => this.copiedIndex.set(null), 2000);
    } catch {
      // clipboard API may be unavailable in non-secure context
    }
  }

  reset(): void {
    this.query.set('');
    this.ai.reset();
    this.activeFileIndex.set(0);
  }

  ngOnDestroy(): void {
    if (this.copyTimer) clearTimeout(this.copyTimer);
    if (this.isBrowser) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }
}
