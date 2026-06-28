import { StudyNote } from './study-notes.types';
import { reactivityRxjsNote } from './reactivity-rxjs';
import { componentsCoreNote } from './components-core';
import { routingFormsNote } from './routing-forms';
import { servicesDiNote } from './services-di';
import { performanceAdvancedNote } from './performance-advanced';

export * from './study-notes.types';

export const STUDY_NOTES: StudyNote[] = [
  reactivityRxjsNote,
  componentsCoreNote,
  routingFormsNote,
  servicesDiNote,
  performanceAdvancedNote
];
