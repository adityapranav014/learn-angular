import { Component, inject, signal, computed, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbCarousel, NgbSlide, NgbSlideEvent, NgbTooltip, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { STUDY_NOTES, StudyNote } from '../../data/study-notes';
import { CodeViewerComponent } from '../code-viewer/code-viewer.component';
import { MermaidViewerComponent } from '../mermaid-viewer/mermaid-viewer.component';

@Component({
  selector: 'app-study-notes',
  templateUrl: './study-notes.component.html',
  styleUrls: ['./study-notes.component.scss'],
  imports: [CommonModule, NgbCarousel, NgbSlide, NgbTooltip, NgbDropdownModule, CodeViewerComponent, MermaidViewerComponent]
})
export class StudyNotesComponent {
  private route = inject(ActivatedRoute);

  activeTopic = signal<StudyNote>(STUDY_NOTES[0]);
  activeVersion = signal<string>('fundamentals');
  activeIndex = 0;
  isFocusedMode = signal(true);
  splitPercent = signal(50);
  isResizing = false;
  isTopicFullscreen = signal(false);

  private resizeStartX = 0;
  private resizeStartPercent = 50;

  @ViewChild('carousel') carousel?: NgbCarousel;
  @ViewChild('focusPanels') focusPanelsRef?: ElementRef<HTMLElement>;

  toggleTopicFullscreen() {
    this.isTopicFullscreen.update(f => !f);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isTopicFullscreen()) {
      this.isTopicFullscreen.set(false);
    }
  }

  availableVersions = computed(() => this.activeTopic().versions);

  activeVersionLabel = computed(() => {
    const match = this.activeTopic().versions.find(v => v.version === this.activeVersion());
    return match ? match.label : '';
  });

  activeVersionIndex = computed(() => {
    const idx = this.activeTopic().versions.findIndex(v => v.version === this.activeVersion());
    return idx + 1;
  });

  activeTopicIconFill = computed(() => {
    const icon = this.activeTopic().icon;
    if (icon === 'bi-speedometer2') return 'bi-speedometer2';
    return icon.endsWith('-fill') ? icon : `${icon}-fill`;
  });

  activeSections = computed(() => {
    const match = this.activeTopic().versions.find(v => v.version === this.activeVersion());
    return match ? match.sections : [];
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      const topicId = params.get('topicId');
      if (topicId) {
        const found = STUDY_NOTES.find(t => t.id === topicId);
        if (found) {
          this.activeTopic.set(found);
          if (found.versions.length > 0) {
            this.activeVersion.set(found.versions[0].version);
          }
          this.activeIndex = 0;
          this.isFocusedMode.set(true);
          setTimeout(() => this.carousel?.select('slide-0'));
        }
      }
    });
  }

  selectVersion(versionCode: string) {
    this.activeVersion.set(versionCode);
    this.activeIndex = 0;
    setTimeout(() => this.carousel?.select('slide-0'));
  }

  onSlide(event: NgbSlideEvent) {
    this.activeIndex = parseInt(event.current.replace('slide-', ''));
  }

  goToSlide(idx: number) {
    this.carousel?.select('slide-' + idx);
  }

  prevSlide() { this.carousel?.prev(); }
  nextSlide() { this.carousel?.next(); }

  triggerMainMenu() {
    if (typeof document !== 'undefined') {
      const menuBtn = document.querySelector('app-navbar .custom-icon-btn') as HTMLButtonElement;
      if (menuBtn) {
        menuBtn.click();
      }
    }
  }

  startResize(event: MouseEvent) {
    this.isResizing = true;
    this.resizeStartX = event.clientX;
    this.resizeStartPercent = this.splitPercent();
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;
    const container = this.focusPanelsRef?.nativeElement;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const delta = event.clientX - this.resizeStartX;
    const deltaPercent = (delta / rect.width) * 100;
    this.splitPercent.set(
      Math.min(75, Math.max(25, Math.round((this.resizeStartPercent + deltaPercent) * 10) / 10))
    );
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isResizing = false;
  }
}