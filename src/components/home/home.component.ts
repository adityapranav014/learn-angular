import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface HomeLinkItem {
  title: string;
  description: string;
  icon: string;
  path: string;
  accentClass: string;
}

interface HomeLinkSection {
  title: string;
  subtitle: string;
  items: HomeLinkItem[];
}

import { HeroComponent } from '../hero/hero.component';
import { CinematicTextComponent } from './cinematic-text/cinematic-text.component';
import { MetricsComponent } from './metrics/metrics.component';
import { TechnologyComponent } from './technology/technology.component';
import { ScrambleTextComponent } from '../scramble-text/scramble-text.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    RouterLink, 
    HeroComponent,
    CinematicTextComponent,
    MetricsComponent,
    TechnologyComponent,
    ScrambleTextComponent
  ]
})
export class HomeComponent {
  hoveredCard: string | null = null;
  selectedCategoryIndex: number = 0;

  selectCategory(index: number) {
    this.selectedCategoryIndex = index;
  }
  sections: HomeLinkSection[] = [
    {
      title: 'Core Concepts',
      subtitle: 'Directives, templates, and control flow fundamentals.',
      items: [
        {
          title: '*ngIf & @if',
          description: 'Conditional rendering with legacy and modern block syntax.',
          icon: 'bi-diagram-2',
          path: '/one',
          accentClass: 'accent-primary'
        },
        {
          title: '*ngFor & @for',
          description: 'List rendering, tracking strategies, and empty-state handling.',
          icon: 'bi-list-ul',
          path: '/two',
          accentClass: 'accent-success'
        },
        {
          title: '*ngClass & *ngStyle',
          description: 'Dynamic styling patterns using component state and expressions.',
          icon: 'bi-brush',
          path: '/three',
          accentClass: 'accent-warning'
        }
      ]
    },
    {
      title: 'Study Notes & Prep',
      subtitle: 'Version-wise concepts, scenarios, and interview-oriented revisions.',
      items: [
        {
          title: 'Study Notes Home',
          description: 'Browse all tracks and versions in one guided learning view.',
          icon: 'bi-book',
          path: '/study-notes',
          accentClass: 'accent-brand'
        },
        {
          title: 'Components & Core Notes',
          description: 'Focused notes for component architecture and fundamentals.',
          icon: 'bi-boxes',
          path: '/study-notes/components-core',
          accentClass: 'accent-brand'
        },
        {
          title: 'Reactivity & RxJS Notes',
          description: 'Signals, observable streams, and reactive state patterns.',
          icon: 'bi-lightning-charge',
          path: '/study-notes/reactivity-rxjs',
          accentClass: 'accent-brand'
        },
        {
          title: 'Routing & Forms Notes',
          description: 'Navigation flow, route patterns, and advanced form handling.',
          icon: 'bi-signpost-split',
          path: '/study-notes/routing-forms',
          accentClass: 'accent-brand'
        },
        {
          title: 'Services & DI Notes',
          description: 'Dependency injection, service boundaries, and shared state.',
          icon: 'bi-diagram-3',
          path: '/study-notes/services-di',
          accentClass: 'accent-brand'
        },
        {
          title: 'Performance & Advanced Notes',
          description: 'Optimization, defer blocks, and architecture-level decisions.',
          icon: 'bi-speedometer2',
          path: '/study-notes/performance-advanced',
          accentClass: 'accent-brand'
        }
      ]
    },
    {
      title: 'Logical Application Labs',
      subtitle: 'Hands-on scenarios for forms, state, and dynamic UI workflows.',
      items: [
        {
          title: 'Subscriptions',
          description: 'Package selection and toggle-driven conditional UI states.',
          icon: 'bi-patch-check',
          path: '/subscription',
          accentClass: 'accent-indigo'
        },
        {
          title: 'Train Booking Form',
          description: 'Rail transit booking flow with dynamic validations.',
          icon: 'bi-train-freight-front',
          path: '/rail-transit',
          accentClass: 'accent-indigo'
        },
        {
          title: 'Movie Ticket',
          description: 'Movie and seat booking workflow with carousel tasks.',
          icon: 'bi-ticket-perforated',
          path: '/box-office',
          accentClass: 'accent-indigo'
        },
        {
          title: 'Zoom Car Rental System',
          description: 'Vehicle selection and booking calculations.',
          icon: 'bi-car-front',
          path: '/zoom-car-rental',
          accentClass: 'accent-indigo'
        },
        {
          title: 'Hotel Order System',
          description: 'Hospitality order management with interactive selections.',
          icon: 'bi-bell',
          path: '/hotel-order',
          accentClass: 'accent-indigo'
        },
        {
          title: 'Grocery List Cart',
          description: 'Collection management and list-state operations.',
          icon: 'bi-cart',
          path: '/grocery-cart',
          accentClass: 'accent-indigo'
        },
        {
          title: 'Student Registration Form',
          description: 'Form models, validation, and submission patterns.',
          icon: 'bi-mortarboard',
          path: '/student-registration',
          accentClass: 'accent-indigo'
        },
        {
          title: 'Calculator',
          description: 'Data binding and arithmetic state transitions.',
          icon: 'bi-calculator',
          path: '/calculator',
          accentClass: 'accent-indigo'
        },
        {
          title: 'To Do List App',
          description: 'CRUD interactions with local storage persistence.',
          icon: 'bi-check-square',
          path: '/todo-list',
          accentClass: 'accent-indigo'
        },
        {
          title: 'KYC & Biometric Vault',
          description: 'Identity flow with stateful security interactions.',
          icon: 'bi-shield-lock',
          path: '/kyc',
          accentClass: 'accent-indigo'
        },
        {
          title: 'Dynamic Tab Selection',
          description: 'Tab-driven content routing in a single view.',
          icon: 'bi-segmented-nav',
          path: '/tabs',
          accentClass: 'accent-indigo'
        },
        {
          title: 'Polymorphic Interfaces',
          description: 'Flexible component contracts and dynamic composition.',
          icon: 'bi-layout-split',
          path: '/polymorphic',
          accentClass: 'accent-indigo'
        }
      ]
    }
  ];

}
