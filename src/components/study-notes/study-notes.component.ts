import { Component, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbCarousel, NgbSlide, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { STUDY_NOTES, StudyNote } from '../../data/study-notes';

@Component({
  selector: 'app-study-notes',
  templateUrl: './study-notes.component.html',
  styleUrls: ['./study-notes.component.scss'],
  imports: [CommonModule, NgbCarousel, NgbSlide]
})
export class StudyNotesComponent {
  private route = inject(ActivatedRoute);

  activeTopic = signal<StudyNote>(STUDY_NOTES[0]);
  activeVersion = signal<string>('fundamentals');
  activeIndex = 0;

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
          const hasVersion = found.versions.some(v => v.version === this.activeVersion());
          if (!hasVersion && found.versions.length > 0) {
            this.activeVersion.set(found.versions[0].version);
          }
          this.activeIndex = 0;
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
}
