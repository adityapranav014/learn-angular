import {
  Component,
  inject,
  signal,
  computed,
  OnDestroy
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Highlight } from 'ngx-highlightjs';
import { AiSearchService, AiCodeFile } from '../../services/ai-search.service';
import { marked } from 'marked';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
  imports: [CommonModule, FormsModule, Highlight]
})
export class GlobalSearchComponent implements OnDestroy {
  private sanitizer = inject(DomSanitizer);
  protected readonly ai = inject(AiSearchService);

  query = signal('');
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
  }
}
