import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface HomeLinkItem {
  title: string;
  description: string;
  icon: string;
  path: string;
  accentClass: string;
  tasks?: string[];
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    RouterLink, 
    HeroComponent,
    CinematicTextComponent,
    MetricsComponent,
    TechnologyComponent
  ]
})
export class HomeComponent {
  hoveredCard: string | null = null;
  activeAccordionIndex: number = 0;

  toggleAccordion(index: number, headerEl?: HTMLElement) {
    this.activeAccordionIndex = this.activeAccordionIndex === index ? -1 : index;
    if (this.activeAccordionIndex === index && headerEl) {
      setTimeout(() => {
        const scrollContainer = document.querySelector('.app-main');
        const isDesktop = window.innerWidth >= 992;
        const navbarHeight = 90; // offset to clear sticky navbar

        if (isDesktop && scrollContainer) {
          const containerRect = scrollContainer.getBoundingClientRect();
          const headerRect = headerEl.getBoundingClientRect();
          const targetScrollTop = scrollContainer.scrollTop + (headerRect.top - containerRect.top) - navbarHeight;
          
          scrollContainer.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          });
        } else {
          const headerRect = headerEl.getBoundingClientRect();
          const targetScrollTop = window.scrollY + headerRect.top - navbarHeight;
          
          window.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          });
        }
      }, 150);
    }
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
          accentClass: 'accent-primary',
          tasks: [
            'Theory: *ngIf vs @if comparison',
            'Task 1: Gender Selection UI',
            'Task 2: Category Filter Switch',
            'Task 3: Element Visibility Toggles',
            'Task 4: Conditional Form Blocks',
            'Task 5: Student Roster Grid'
          ]
        },
        {
          title: '*ngFor & @for',
          description: 'List rendering, tracking strategies, and empty-state handling.',
          icon: 'bi-list-ul',
          path: '/two',
          accentClass: 'accent-success',
          tasks: [
            'Theory: *ngFor vs @for tracking',
            'Task 1: Dynamic City Selector',
            'Task 2: Language Button Highlights',
            'Task 3: Multiplication Table Grid',
            'Task 4: Shared Station Dropdowns',
            'Task 5: Student Row Highlights',
            'Task 6: Key-Value Dropdown Bindings'
          ]
        },
        {
          title: '*ngClass & *ngStyle',
          description: 'Dynamic styling patterns using component state and expressions.',
          icon: 'bi-brush',
          path: '/three',
          accentClass: 'accent-warning',
          tasks: [
            'Theory: NgClass vs NgStyle rules',
            'Task 1: Static Class Binding',
            'Task 2: Dynamic Class Toggle',
            'Task 3: Class Highlight Loops',
            'Task 4: Dynamic Grid Pane Toggle',
            'Task 5: Exclusive Row Highlights',
            'Task 6: Shape Canvas Style Editor',
            'Task 7: Progress Bar Width Binding',
            'Task 8: Two-Way Model Binding Form'
          ]
        }
      ]
    },
    {
      title: 'Study Notes & Prep',
      subtitle: 'Version-wise concepts, scenarios, and interview-oriented revisions.',
      items: [
        {
          title: 'Components & Core Notes',
          description: 'Focused notes for component architecture and fundamentals.',
          icon: 'bi-boxes',
          path: '/study-notes/components-core',
          accentClass: 'accent-brand',
          tasks: [
            'Component Lifecycle Hooks',
            'Content Projection (ng-content)',
            'ViewChild vs ViewChildren',
            'Component Communication Patterns',
            'Standalone Components Integration',
            'New Built-in Control Flow (@let, afterRender)'
          ]
        },
        {
          title: 'Reactivity & RxJS Notes',
          description: 'Signals, observable streams, and reactive state patterns.',
          icon: 'bi-lightning-charge',
          path: '/study-notes/reactivity-rxjs',
          accentClass: 'accent-brand',
          tasks: [
            'Observables, Subjects & Operators',
            'Subscription Management & Memory Leaks',
            'combineLatest, forkJoin & zip',
            'Signals, computed() & effect()',
            'toSignal() & toObservable()',
            'Duplicate HTTP request & Typeahead race conditions'
          ]
        },
        {
          title: 'Routing & Forms Notes',
          description: 'Navigation flow, route patterns, and advanced form handling.',
          icon: 'bi-signpost-split',
          path: '/study-notes/routing-forms',
          accentClass: 'accent-brand',
          tasks: [
            'Router Setup & Route Definition',
            'Reading Route Params & Query Strings',
            'Route Guards (canActivate, canDeactivate)',
            'Template-Driven vs Reactive Forms',
            'Lazy Loading & Code Splitting',
            'Dynamic Forms with FormArray',
            'Custom Validators'
          ]
        },
        {
          title: 'Services & DI Notes',
          description: 'Dependency injection, service boundaries, and shared state.',
          icon: 'bi-diagram-3',
          path: '/study-notes/services-di',
          accentClass: 'accent-brand',
          tasks: [
            'Dependency Injection & Providers',
            'HttpClient & Interceptors',
            'Injection Tokens & InjectionToken',
            'Service with Signal-based State',
            'Multi-level DI: forwardRef & optional injection'
          ]
        },
        {
          title: 'Performance & Advanced Notes',
          description: 'Optimization, defer blocks, and architecture-level decisions.',
          icon: 'bi-speedometer2',
          path: '/study-notes/performance-advanced',
          accentClass: 'accent-brand',
          tasks: [
            'Change Detection: Default vs OnPush',
            '@defer Blocks — Lazy UI Loading',
            'trackBy in @for Loops',
            'Zoneless Change Detection (Angular 18+)',
            'Virtual Scrolling with CDK',
            'Memoization with Pure Pipes'
          ]
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
          accentClass: 'accent-indigo',
          tasks: [
            'Task 1: Package Details Switcher',
            'Task 2: Radio Plan Selector'
          ]
        },
        {
          title: 'Train Booking Form',
          description: 'Rail transit booking flow with dynamic validations.',
          icon: 'bi-train-freight-front',
          path: '/rail-transit',
          accentClass: 'accent-indigo',
          tasks: [
            'Task 1: Train Booking Form Validation',
            'Task 2: Station Swap Logic & Form Submissions'
          ]
        },
        {
          title: 'Movie Ticket',
          description: 'Movie and seat booking workflow with carousel tasks.',
          icon: 'bi-ticket-perforated',
          path: '/box-office',
          accentClass: 'accent-indigo',
          tasks: [
            'Task 1: Ticket Selection & Shows',
            'Task 2: Movie Seat Booking'
          ]
        },
        {
          title: 'Zoom Car Rental System',
          description: 'Vehicle selection and booking calculations.',
          icon: 'bi-car-front',
          path: '/zoom-car-rental',
          accentClass: 'accent-indigo',
          tasks: [
            'Task 1: Fleet Management & Price Calculations'
          ]
        },
        {
          title: 'Hotel Order System',
          description: 'Hospitality order management with interactive selections.',
          icon: 'bi-bell',
          path: '/hotel-order',
          accentClass: 'accent-indigo',
          tasks: [
            'Task 1: Hospitality Room Service Orders & Amenities'
          ]
        },
        {
          title: 'Grocery List Cart',
          description: 'Collection management and list-state operations.',
          icon: 'bi-cart',
          path: '/grocery-cart',
          accentClass: 'accent-indigo',
          tasks: [
            'Task 1: Collection Management & Shopping Cart Quantities'
          ]
        },
        {
          title: 'Student Registration Form',
          description: 'Form models, validation, and submission patterns.',
          icon: 'bi-mortarboard',
          path: '/student-registration',
          accentClass: 'accent-indigo',
          tasks: [
            'Task 1: Multi-field Validations & Binding Submissions'
          ]
        },
        {
          title: 'Calculator',
          description: 'Data binding and arithmetic state transitions.',
          icon: 'bi-calculator',
          path: '/calculator',
          accentClass: 'accent-indigo',
          tasks: [
            'Task 1: Data Binding & Arithmetic Transitions'
          ]
        },
        {
          title: 'To Do List App',
          description: 'CRUD interactions with local storage persistence.',
          icon: 'bi-check-square',
          path: '/todo-list',
          accentClass: 'accent-indigo',
          tasks: [
            'Task 1: Task Planner CRUD Actions & LocalStorage Sync'
          ]
        },
        {
          title: 'KYC & Biometric Vault',
          description: 'Identity flow with stateful security interactions.',
          icon: 'bi-shield-lock',
          path: '/kyc',
          accentClass: 'accent-indigo',
          tasks: [
            'Task 1: Secure Identity Flow & Stateful Security Verification'
          ]
        },
        {
          title: 'Dynamic Tab Selection',
          description: 'Tab-driven content routing in a single view.',
          icon: 'bi-segmented-nav',
          path: '/tabs',
          accentClass: 'accent-indigo',
          tasks: [
            'Task 1: Dynamic Tabbed Component Switching'
          ]
        },
        {
          title: 'Polymorphic Interfaces',
          description: 'Flexible component contracts and dynamic composition.',
          icon: 'bi-layout-split',
          path: '/polymorphic',
          accentClass: 'accent-indigo',
          tasks: [
            'Task 1: Component Contracts & Dynamic Interfaces'
          ]
        }
      ]
    }
  ];

}
