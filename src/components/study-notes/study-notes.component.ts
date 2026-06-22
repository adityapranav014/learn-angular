import { Component, inject, signal, computed, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbCarousel, NgbSlide, NgbSlideEvent, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Highlight } from 'ngx-highlightjs'; // Fixes the [highlight] NG8002 error
import { STUDY_NOTES, StudyNote } from '../../data/study-notes';

@Component({
  selector: 'app-study-notes',
  templateUrl: './study-notes.component.html',
  styleUrls: ['./study-notes.component.scss'],
  imports: [CommonModule, NgbCarousel, NgbSlide, NgbTooltip, Highlight] // Highlight added here
})
export class StudyNotesComponent {
  private route = inject(ActivatedRoute);

  activeTopic = signal<StudyNote>(STUDY_NOTES[0]);
  activeVersion = signal<string>('fundamentals');
  activeIndex = 0;
  codeFullscreen = false;

  // NEW: State variables for the code viewer (Fixes TS2551 & TS2339)
  activeFileIndex = 0;
  isCopied = false;

  @ViewChild('carousel') carousel!: NgbCarousel;

  availableVersions = computed(() => this.activeTopic().versions);

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
          this.activeFileIndex = 0; // Reset file index
          setTimeout(() => this.carousel?.select('slide-0'));
        }
      }
    });
  }

  selectVersion(versionCode: string) {
    this.activeVersion.set(versionCode);
    this.activeIndex = 0;
    this.activeFileIndex = 0; // Reset file index on version change
    setTimeout(() => this.carousel?.select('slide-0'));
  }

  onSlide(event: NgbSlideEvent) {
    this.activeIndex = parseInt(event.current.replace('slide-', ''));
    this.activeFileIndex = 0; // Reset file index on slide change
    this.isCopied = false;    // Reset copy status
  }

  goToSlide(idx: number) {
    this.carousel?.select('slide-' + idx);
  }

  // NEW: Set the active code file tab (Fixes TS2339)
  setActiveFile(index: number) {
    this.activeFileIndex = index;
    this.isCopied = false;
  }

  // NEW: Native Clipboard API copy function (Fixes TS2339)
  async copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      this.isCopied = true;
      setTimeout(() => { this.isCopied = false; }, 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  }

  // Close full screen on Escape key press
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: Event) {
    if (this.codeFullscreen) {
      this.codeFullscreen = false;
    }
  }
}