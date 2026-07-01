import { Component, computed, inject, OnDestroy, PLATFORM_ID, signal, TemplateRef, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import { marked } from 'marked';
import { AiCodeFile, AiSearchService } from '../../services/ai-search.service';
import { NgbOffcanvas, NgbTooltip, NgbDropdownModule, NgbPopover, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { ScrollActiveDirective } from '../../app/directives/appScrollActive.directive';
import { ThemeService, Theme } from '../../services/theme.service';
import { FullscreenService } from '../../services/fullscreen.service';
import { AiSearchBarComponent } from '../ai-search-bar/ai-search-bar.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    HighlightModule,
    ScrollActiveDirective,
    AiSearchBarComponent,
    NgbTooltip,
    NgbDropdownModule,
    NgbPopoverModule
  ]
})
export class NavbarComponent {
  private offcanvasService = inject(NgbOffcanvas);
  private sanitizer = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly fullPlaceholder = 'Ask anything... e.g. Angular Signals, RxJS switchMap, lazy loading';
  private readonly mediumPlaceholder = 'Ask anything... e.g. Angular Signals, RxJS switchMap';
  private readonly compactPlaceholder = 'Ask anything... e.g. Angular Signals';
  private readonly tinyPlaceholder = 'Ask anything...';
  private readonly resizeHandler = () => this.updatePlaceholderText();
  public router = inject(Router);
  public themeService = inject(ThemeService);
  public fullscreenService = inject(FullscreenService);
  protected readonly ai = inject(AiSearchService);

  isCodeFullscreen = signal(false);

  searchQuery = signal('');
  placeholderText = signal(this.fullPlaceholder);
  activeFileIndex = signal(0);
  copiedIndex = signal<number | null>(null);
  private copyTimer: ReturnType<typeof setTimeout> | null = null;
  private rafId: number | null = null;

  readonly suggestions = [
    'Angular Signals',
    'RxJS switchMap vs mergeMap',
    'Angular lazy loading routes',
    'Angular standalone components'
  ];

  theoryHtml = computed((): SafeHtml => {
    const theory = this.ai.result()?.theory;
    if (!theory) return '';
    const html = marked.parse(theory) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  activeFile = computed((): AiCodeFile | null => {
    const files = this.ai.result()?.files;
    if (!files?.length) return null;
    const idx = this.activeFileIndex();
    return files[idx < files.length ? idx : 0];
  });

  constructor() {
    if (this.isBrowser) {
      this.updatePlaceholderText();
      window.addEventListener('resize', this.resizeHandler, { passive: true });
    }
  }

  isHome(): boolean {
    return this.router.url === '/';
  }

  // --- Modern State Management (Signals) ---
  activeMenuView = signal<'main' | 'core-concepts' | 'logical-scenarios' | 'study-notes'>('main');
  activeSubMenu = signal<'core-concepts' | 'logical-scenarios' | 'study-notes' | null>(null);
  isOffcanvasReady = signal<boolean>(false);

  // --- Sidebar Controls ---
  openSidebar(content: TemplateRef<any>) {
    // 1. Determine which sub-menu to open based on the current URL
    this.determineActiveMenu();

    // 2. Reset animation state before opening
    this.isOffcanvasReady.set(false);

    // 3. Open the sidebar
    const offcanvasRef = this.offcanvasService.open(content, { position: 'start' });

    // 4. Wait for the open animation to finish, then trigger the scroll directive
    // take(1) guarantees the subscription dies instantly, preventing memory leaks
    offcanvasRef.shown.pipe(take(1)).subscribe(() => {
      this.resetMenuScroll();
      this.isOffcanvasReady.set(true);
    });
  }

  // --- Navigation Controls ---
  navigateToMenu(menuName: 'main' | 'core-concepts' | 'logical-scenarios' | 'study-notes', event: Event) {
    event.preventDefault();
    this.activeMenuView.set(menuName);
    if (menuName !== 'main') {
      this.activeSubMenu.set(menuName);
    }
    this.resetMenuScroll();
  }

  goBack() {
    this.activeMenuView.set('main');
    this.resetMenuScroll();
  }

  private resetMenuScroll() {
    if (typeof document !== 'undefined') {
      const parent = document.querySelector('.offcanvas-body');
      if (parent) {
        parent.scrollTop = 0;
      }
    }
  }

  getSubMenuTitle(): string {
    switch (this.activeMenuView()) {
      case 'study-notes':
        return 'Study Notes & Prep';
      case 'core-concepts':
        return 'Core Directives & Syntax';
      case 'logical-scenarios':
        return 'Logical Scenarios';
      default:
        return '';
    }
  }

  // --- Active Route Tracking ---
  private determineActiveMenu() {
    if (this.isCoreConceptActive()) {
      this.activeMenuView.set('core-concepts');
      this.activeSubMenu.set('core-concepts');
    } else if (this.isLogicalScenariosActive()) {
      this.activeMenuView.set('logical-scenarios');
      this.activeSubMenu.set('logical-scenarios');
    } else if (this.isStudyNotesActive()) {
      this.activeMenuView.set('study-notes');
      this.activeSubMenu.set('study-notes');
    } else {
      this.activeMenuView.set('main');
    }
  }

  isLogicalScenariosActive(): boolean {
    const paths = [
      '/subscription', '/rail-transit', '/box-office', '/calculator',
      '/zoom-car-rental', '/hotel-order', '/grocery-cart', '/todo-list', '/student-registration',
      '/kyc', '/tabs', '/polymorphic'
    ];

    // Clean the URL of query params and fragments to ensure accurate matching
    const currentPath = this.router.url.split('?')[0].split('#')[0];
    return paths.some(path => currentPath.startsWith(path));
  }

  isCoreConceptActive(): boolean {
    const currentPath = this.router.url.split('?')[0].split('#')[0];
    return currentPath.startsWith('/one') ||
      currentPath.startsWith('/two') ||
      currentPath.startsWith('/three');
  }

  isStudyNotesActive(): boolean {
    const currentPath = this.router.url.split('?')[0].split('#')[0];
    return currentPath.startsWith('/study-notes');
  }

  toggleCodeFullscreen(): void {
    const nextVal = !this.isCodeFullscreen();
    this.isCodeFullscreen.set(nextVal);
    this.fullscreenService.setFullscreen(nextVal);
  }

  resetCodeFullscreen(): void {
    if (this.isCodeFullscreen()) {
      this.isCodeFullscreen.set(false);
      this.fullscreenService.setFullscreen(false);
    }
  }

  openSearchPopover(popover: NgbPopover): void {
    this.queuePlaceholderSync();
    if (!popover.isOpen()) {
      popover.open();
    }
  }

  closeSearchPopover(popover: NgbPopover): void {
    this.resetCodeFullscreen();
    if (popover.isOpen()) {
      popover.close();
    }
  }

  onSearchKeydown(event: KeyboardEvent, popover: NgbPopover): void {
    this.queuePlaceholderSync();
    if (event.key === 'Enter') {
      event.preventDefault();
      void this.runSearch(popover);
      return;
    }

    if (event.key === 'Escape') {
      this.closeSearchPopover(popover);
    }
  }

  async runSearch(popover: NgbPopover): Promise<void> {
    this.resetCodeFullscreen();
    const query = this.searchQuery().trim();
    this.openSearchPopover(popover);

    if (!query) {
      this.ai.reset();
      return;
    }

    this.activeFileIndex.set(0);
    await this.ai.searchTopic(query);
  }

  clearSearch(popover: NgbPopover): void {
    this.resetCodeFullscreen();
    this.searchQuery.set('');
    this.ai.reset();
    this.activeFileIndex.set(0);
    this.openSearchPopover(popover);
  }

  applySuggestion(topic: string, popover: NgbPopover): void {
    this.resetCodeFullscreen();
    this.searchQuery.set(topic);
    void this.runSearch(popover);
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
      // clipboard can be unavailable in insecure contexts
    }
  }

  focusGlobalSearch(offcanvas?: { dismiss: () => void }): void {
    if (offcanvas) {
      offcanvas.dismiss();
    }

    if (typeof document !== 'undefined') {
      setTimeout(() => {
        const input = document.getElementById('global-nav-search-input') as HTMLInputElement | null;
        input?.focus();
        this.queuePlaceholderSync();
      }, 120);
    }
  }

  syncPlaceholder(): void {
    this.queuePlaceholderSync();
  }

  onSearchShellTransitionEnd(event: TransitionEvent): void {
    if (event.propertyName === 'width') {
      this.updatePlaceholderText();
    }
  }

  private queuePlaceholderSync(): void {
    if (!this.isBrowser) {
      return;
    }

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }

    let remainingFrames = 10;
    const tick = () => {
      this.updatePlaceholderText();
      remainingFrames -= 1;
      if (remainingFrames > 0) {
        this.rafId = requestAnimationFrame(tick);
      } else {
        this.rafId = null;
      }
    };

    this.rafId = requestAnimationFrame(tick);
  }

  private updatePlaceholderText(): void {
    if (!this.isBrowser) {
      return;
    }

    const input = document.getElementById('global-nav-search-input') as HTMLInputElement | null;
    const inputWidth = input?.clientWidth ?? 240;

    if (inputWidth >= 350) {
      this.placeholderText.set(this.fullPlaceholder);
      return;
    }

    if (inputWidth >= 295) {
      this.placeholderText.set(this.mediumPlaceholder);
      return;
    }

    if (inputWidth >= 235) {
      this.placeholderText.set(this.compactPlaceholder);
      return;
    }

    this.placeholderText.set(this.tinyPlaceholder);
  }

  ngOnDestroy(): void {
    this.resetCodeFullscreen();
    if (this.copyTimer) {
      clearTimeout(this.copyTimer);
    }

    if (this.isBrowser) {
      window.removeEventListener('resize', this.resizeHandler);
    }

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }
}