import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { STUDY_NOTES, StudyNote } from '../../data/study-notes';

@Component({
  selector: 'app-study-notes',
  templateUrl: './study-notes.component.html',
  styleUrls: ['./study-notes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgbAccordionModule
  ]
})
export class StudyNotesComponent {
  private route = inject(ActivatedRoute);

  // Reactively track selected state using signals
  activeTopic = signal<StudyNote>(STUDY_NOTES[0]);
  activeVersion = signal<string>('fundamentals');

  // Compute available versions for the currently active topic
  availableVersions = computed(() => {
    return this.activeTopic().versions;
  });

  // Compute sections to display based on topic and version selection
  activeSections = computed(() => {
    const topic = this.activeTopic();
    const version = this.activeVersion();
    const match = topic.versions.find(v => v.version === version);
    return match ? match.sections : [];
  });

  constructor() {
    // Synchronize route parameters with selected topic
    this.route.paramMap.subscribe(params => {
      const topicId = params.get('topicId');
      if (topicId) {
        const found = STUDY_NOTES.find(t => t.id === topicId);
        if (found) {
          this.activeTopic.set(found);

          // Reset version to first available if current doesn't exist in new topic
          const hasVersion = found.versions.some(v => v.version === this.activeVersion());
          if (!hasVersion && found.versions.length > 0) {
            this.activeVersion.set(found.versions[0].version);
          }
        }
      }
    });
  }

  selectVersion(versionCode: string) {
    this.activeVersion.set(versionCode);
  }
}
