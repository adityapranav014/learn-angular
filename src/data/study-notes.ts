export interface Section {
  heading: string;
  content: string;
  codeExample?: string;
  language?: string;
}

export interface VersionedContent {
  version: string;
  label: string;
  sections: Section[];
}

export interface StudyNote {
  id: string;
  title: string;
  icon: string;
  category: string;
  versions: VersionedContent[];
}

export const STUDY_NOTES: StudyNote[] = [
  {
    id: `components-core`,
    title: `Components & Core`,
    icon: `bi-boxes`,
    category: `Core Concepts`,
    versions: [
      {
        version: `fundamentals`,
        label: `Fundamentals`,
        sections: [
          {
            heading: `Component Lifecycle Hooks`,
            content: `<p>Angular components go through a lifecycle from creation to destruction. Implementing lifecycle interfaces hooks into these key moments:</p><ul><li><strong>ngOnChanges:</strong> Called before <code>ngOnInit</code> and when one or more data-bound input properties change. Receives a <code>SimpleChanges</code> object.</li><li><strong>ngOnInit:</strong> Initialize the component after Angular first displays the data-bound properties. Best place for initial data fetching.</li><li><strong>ngDoCheck:</strong> Detect and act upon changes that Angular can't or won't detect on its own.</li><li><strong>ngAfterContentInit / ngAfterContentChecked:</strong> Respond after Angular projects external content into the component's view.</li><li><strong>ngAfterViewInit / ngAfterViewChecked:</strong> Respond after Angular initializes the component's views and child views.</li><li><strong>ngOnDestroy:</strong> Cleanup just before Angular destroys the component. Unsubscribe from Observables, detach event handlers to prevent memory leaks.</li></ul><table class="table table-bordered mt-2 small"><thead><tr><th>Hook</th><th>Timing</th><th>Use Case / Comparison</th></tr></thead><tbody><tr><td><code>ngOnInit</code></td><td>After inputs are bound</td><td>Data fetching / Initial setup</td></tr><tr><td><code>ngAfterViewInit</code></td><td>After template renders</td><td>Accessing child DOM elements / jQuery / Charts</td></tr></tbody></table>`,
            codeExample: `import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  template: \`<p>User: {{ name }}</p>\`,
  standalone: true
})
export class UserProfileComponent implements OnInit, OnChanges, OnDestroy {
  @Input() name = '';
  private subscription!: Subscription;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['name']) {
      console.log('Name changed from', changes['name'].previousValue, 'to', changes['name'].currentValue);
    }
  }

  ngOnInit() {
    console.log('UserProfile initialized');
  }

  ngOnDestroy() {
    console.log('Cleaning up resources...');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}`,
            language: `typescript`,
          },
          {
            heading: `Content Projection (ng-content)`,
            content: `<p>Content projection allows you to insert (project) external HTML content into a designated spot in your component template.</p><ul><li><strong>Single-slot projection:</strong> Projects all content into a single <code>&lt;ng-content&gt;&lt;/ng-content&gt;</code> block.</li><li><strong>Multi-slot projection:</strong> Uses the <code>select</code> attribute (CSS selectors) to project specific content into designated slots.</li><li><strong>Accessing Projected Content:</strong> Use <code>&#64;ContentChild</code> or <code>&#64;ContentChildren</code> in the component class to query projected elements.</li></ul>`,
            codeExample: `<!-- Card Component Template -->
<div class="card shadow-sm">
  <div class="card-header">
    <ng-content select="[card-header]"></ng-content>
  </div>
  <div class="card-body">
    <ng-content></ng-content>
  </div>
</div>

<!-- Usage -->
<app-card>
  <h5 card-header>Profile Title</h5>
  <p>This is the main body content projected into the card.</p>
</app-card>`,
            language: `html`,
          },
          {
            heading: `Pipes & Data Transformation`,
            content: `<p>Pipes are simple functions used in template expressions to accept an input value, transform it, and return a formatted output.</p><ul><li><strong>Pure Pipes:</strong> Called only when Angular detects a <strong>pure change</strong> in the input value (primitive change or reference change for objects). High performance, result is cached.</li><li><strong>Impure Pipes:</strong> Called on every change detection cycle, regardless of input changes. Can degrade performance; used for stateful transformations (e.g., <code>AsyncPipe</code>).</li></ul>`,
            codeExample: `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exponentialStrength',
  pure: true // Default is true
})
export class ExponentialStrengthPipe implements PipeTransform {
  transform(value: number, exponent: number): number {
    return Math.pow(value, exponent);
  }
}`,
            language: `typescript`,
          },
          {
            heading: `ViewChild vs ViewChildren`,
            content: `<p>These decorators provide access to child components, directives, or DOM elements within a component template:</p><ul><li><strong>&#64;ViewChild:</strong> Configures a view query that returns the first matching element or child component. Access it in or after <code>ngAfterViewInit</code>.</li><li><strong>&#64;ViewChildren:</strong> Configures a view query that returns a <code>QueryList</code> of all matching elements or child components. It updates automatically when the DOM changes.</li></ul>`,
            codeExample: `import { Component, ViewChild, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-list',
  template: \`
    <input #itemInput type="text" />
    <div #itemDiv *ngFor="let x of [1,2,3]">{{ x }}</div>
  \`,
  standalone: true
})
export class ListComponent implements AfterViewInit {
  @ViewChild('itemInput') inputEl!: ElementRef<HTMLInputElement>;
  @ViewChildren('itemDiv') divEls!: QueryList<ElementRef<HTMLDivElement>>;

  ngAfterViewInit() {
    this.inputEl.nativeElement.focus();
    console.log('Total divs:', this.divEls.length);
  }
}`,
            language: `typescript`,
          },
          {
            heading: `Templates, Data Binding & Directives`,
            content: `<p>Angular templates blend standard HTML with custom syntax to support data flow:</p><ul><li><strong>Interpolation:</strong> Displays dynamic values from class properties: <code>{{ value }}</code>.</li><li><strong>Property Binding:</strong> Sets child element properties: <code>[disabled]="isDisabled"</code>.</li><li><strong>Attribute Binding:</strong> Sets HTML attributes directly: <code>[attr.aria-label]="label"</code>.</li><li><strong>Class & Style Binding:</strong> Conditionally toggles styling: <code>[class.active]="isActive"</code>.</li><li><strong>Event Binding:</strong> Listens for browser events: <code>(click)="onClick()"</code>.</li><li><strong>Directives:</strong> Structural directives (like <code>*ngIf</code>, <code>*ngFor</code>) shape template structure, while Attribute directives (like <code>ngClass</code>, <code>ngStyle</code>) modify appearance.</li></ul>`,
          },
          {
            heading: `Component Communication Patterns`,
            content: `<p>Components communicate via direct parent-child or service channels:</p><ul><li><strong>Parent to Child:</strong> The parent binds properties to inputs (traditional <code>&#64;Input()</code> or modern Signal inputs).</li><li><strong>Child to Parent:</strong> The child emits events via outputs (traditional <code>&#64;Output() EventEmitter</code> or modern Signal outputs).</li><li><strong>Sibling / Non-related:</strong> Use a shared state service containing a BehaviorSubject or a shared Signal, injected in both components.</li></ul>`,
          },
          {
            heading: `Angular Material Integration`,
            content: `<p>Popular components for UI rendering in Angular apps:</p><ul><li><strong>mat-tab-group:</strong> Render tabular view segments lazily to improve startup speed.</li><li><strong>mat-dialog:</strong> Spawn modals/overlay components, utilizing injection contexts to pass data between components.</li></ul>`,
          },
        ],
      },
      {
        version: `16_v17`,
        label: `Angular 16 & 17`,
        sections: [
          {
            heading: `Standalone Components Integration`,
            content: `<p>In Angular 16, Standalone Components became the default and recommended way to build applications, removing the necessity of <code>NgModules</code>.</p><ul><li>Standalone components, directives, and pipes specify their dependencies directly using the <code>imports</code> array.</li><li>Simplifies the mental model, scaffolds lighter builds, and makes components directly reusable.</li><li>Applications are bootstrapped using <code>bootstrapApplication(RootComponent, config)</code> instead of module bootstrapping.</li></ul>`,
            codeExample: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: \`
    <div class="container">
      <app-card title="Analytics">
        <p>Dynamic Content</p>
      </app-card>
    </div>
  \`
})
export class DashboardComponent {}`,
            language: `typescript`,
          },
          {
            heading: `New Built-in Control Flow (&#64;if, &#64;for, &#64;switch)`,
            content: `<p>Angular 17 introduced a new built-in block syntax for control flow. It replaces the structural directives <code>*ngIf</code>, <code>*ngFor</code>, and <code>*ngSwitch</code>.</p><ul><li><strong>Performance:</strong> Built directly into the compiler, reducing execution overhead and boosting rendering speed by up to 90% in complex loops.</li><li><strong>Zero Imports:</strong> No need to import <code>CommonModule</code> or <code>NgIf</code>/<code>NgFor</code> into standalone components.</li><li><strong>&#64;empty support:</strong> Built-in block in <code>&#64;for</code> loops that renders placeholder content when the array is empty.</li><li><strong>Strict Tracking:</strong> The <code>track</code> expression is now required in <code>&#64;for</code> loops, preventing performance bugs from omitting <code>trackBy</code>.</li></ul>`,
            codeExample: `<!-- Modern Control Flow Syntax -->
&#64;if (isLoggedIn) {
  <p>Welcome back, user!</p>
} &#64;else if (isPending) {
  <p>Account verification pending...</p>
} &#64;else {
  <button (click)="login()">Log In</button>
}

&#64;for (item of items; track item.id) {
  <div class="item">{{ item.name }}</div>
} &#64;empty {
  <p class="text-muted">No items available.</p>
}

&#64;switch (role) {
  &#64;case ('admin') { <admin-panel /> }
  &#64;case ('editor') { <editor-panel /> }
  &#64;default { <viewer-panel /> }
}`,
            language: `html`,
          },
          {
            heading: `Lifecycle Optimization: afterRender and afterNextRender`,
            content: `<p>Angular 17 introduced two new lifecycle hooks for executing operations safely in browser environments, particularly helpful when using Server-Side Rendering (SSR):</p><ul><li><strong>afterRender:</strong> Runs after every change detection cycle has finished rendering the page. Useful for DOM manipulation or measuring elements.</li><li><strong>afterNextRender:</strong> Runs exactly once after the next rendering cycle completes. Best for initializing third-party libraries that need access to the browser DOM.</li></ul>`,
            codeExample: `import { Component, ElementRef, viewChild, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-chart',
  standalone: true,
  template: \`<canvas #chartCanvas></canvas>\`
})
export class ChartComponent {
  canvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  constructor() {
    // Only executes in the browser, safely avoiding SSR issues
    afterNextRender(() => {
      const ctx = this.canvas()?.nativeElement.getContext('2d');
      if (ctx) {
        this.initializeChart(ctx);
      }
    });
  }

  private initializeChart(ctx: CanvasRenderingContext2D) {
    // Chart initialization logic
  }
}`,
            language: `typescript`,
          },
          {
            heading: `Signal-based Inputs and Outputs`,
            content: `<p>Angular 17 introduced signal-based component communication, making inputs and outputs fully reactive primitives.</p><ul><li><strong>Signal Inputs:</strong> Declared via <code>input()</code> or <code>input.required()</code>. They return a read-only Signal.</li><li><strong>Signal Outputs:</strong> Declared via <code>output()</code> or <code>outputFromObservable()</code>. Serves as a streamlined replacement for <code>&#64;Output() EventEmitter</code>.</li></ul>`,
            codeExample: `import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-child',
  standalone: true,
  template: \`
    <div class="border p-2">
      <h6>Child component: {{ title() }}</h6>
      <button (click)="notifyParent()">Notify</button>
    </div>
  \`
})
export class ChildComponent {
  title = input<string>('Default Title'); // Signal Input
  action = output<string>();              // Signal Output

  notifyParent() {
    this.action.emit('Child action triggered!');
  }
}`,
            language: `typescript`,
          },
        ],
      },
      {
        version: `v18_v19`,
        label: `Angular 18 & 19`,
        sections: [
          {
            heading: `Local Template Variables (&#64;let)`,
            content: `<p>Angular 18 introduced the <code>&#64;let</code> declaration syntax in templates, allowing developers to declare variables locally inside component views.</p><ul><li><strong>Local Scope:</strong> Avoids repeating complex computations or async pipe bindings.</li><li><strong>Reactive binding:</strong> Safely stores intermediate results of expressions.</li><li><strong>Improved Type Safety:</strong> Type checking is fully supported by the Angular language service.</li></ul>`,
            codeExample: `<!-- Declaring local variables in Template -->
&#64;let user = userProfile\$ | async;
&#64;let fullName = user ? user.firstName + ' ' + user.lastName : 'Guest';

<div class="profile-card">
  <h3>{{ fullName }}</h3>
  &#64;if (user && user.isAdmin) {
    <span class="badge bg-danger">Administrator</span>
  }
</div>`,
            language: `html`,
          },
          {
            heading: `Fallback Content for Content Projection`,
            content: `<p>Angular 18 added built-in support for fallback content in <code>&lt;ng-content&gt;</code>. If no content is projected into the slot, the fallback content defined inside the tags will render.</p>`,
            codeExample: `<!-- Card template with fallback content -->
<div class="card-footer">
  <ng-content select="[actions]">
    <!-- Fallback Content -->
    <button class="btn btn-secondary">Close</button>
  </ng-content>
</div>`,
            language: `html`,
          },
          {
            heading: `View Transitions API Integration`,
            content: `<p>Angular 19 introduced built-in support for the browser's native View Transitions API, enabling smooth page-to-page animated transitions during route navigation.</p><p>Enable it in <code>app.config.ts</code> by declaring <code>withViewTransitions()</code> inside <code>provideRouter</code>. In CSS, customize transitions using the <code>::view-transition-old</code> and <code>::view-transition-new</code> selectors.</p>`,
          },
        ],
      },
      {
        version: `scenarios`,
        label: `Scenario Prep`,
        sections: [
          {
            heading: `Sorting Flicker in Lists`,
            content: `<h5>Scenario Question:</h5><p><em>"Your &#64;for loop renders a table, but sorting or rearranging elements causes flickering in the UI. How do you optimize it?"</em></p><h5>Answer:</h5><p>Flickering happens when Angular cannot match DOM elements with array items, causing it to destroy and recreate DOM nodes instead of moving them. To fix this:</p><ol><li>Ensure the <code>track</code> expression points to a unique identifier (like <code>item.id</code>) rather than the loop index or the entire object.</li><li>Avoid using index <code>\$index</code> as a track key if the list items can be re-ordered, filtered, or sorted, as the indices will map to different data objects, forcing DOM recreation.</li></ol>`,
          },
          {
            heading: `Template updates miss role changes`,
            content: `<h5>Scenario Question:</h5><p><em>"An &#64;if condition checks user.isAdmin, but the template doesn't update when the user role changes. How do you fix this?"</em></p><h5>Answer:</h5><p>If <code>user</code> is a standard mutable object, modifying its properties (e.g., <code>user.isAdmin = true</code>) does not trigger change detection in <code>OnPush</code> components since the object reference remains the same. Fixes:</p><ol><li>Use a <strong>Signal</strong> for the user state (e.g., <code>user = signal<User>(initialUser)</code>) and trigger updates via <code>user.set(...)</code> or <code>user.update(...)</code>.</li><li>If using standard fields, assign a new object reference to trigger change detection: <code>this.user = { ...this.user, isAdmin: true }</code>.</li></ol>`,
          },
          {
            heading: `Refactoring legacy *ngSwitch to &#64;switch`,
            content: `<h5>Scenario Question:</h5><p><em>"How would you refactor a legacy *ngSwitch to Angular 19's &#64;switch while preserving accessibility (ARIA labels)?"</em></p><h5>Answer:</h5><p>Modern control flow syntax (<code>&#64;switch</code>) is a direct structural replacement. Simply remove the outer <code>[ngSwitch]</code> binding and rewrite using the block format. ARIA attributes or roles remain untouched on container divs:</p>`,
            codeExample: `<!-- Legacy -->
<div [ngSwitch]="status" role="region" aria-live="polite">
  <p *ngSwitchCase="'loading'">Loading...</p>
  <p *ngSwitchDefault>Ready</p>
</div>

<!-- Modern Refactored -->
<div role="region" aria-live="polite">
  &#64;switch (status) {
    &#64;case ('loading') {
      <p>Loading...</p>
    }
    &#64;default {
      <p>Ready</p>
    }
  }
}`,
            language: `html`,
          },
          {
            heading: `Dynamic Edit/View Modes without DOM duplication`,
            content: `<h5>Scenario Question:</h5><p><em>"Design a template that toggles between edit and view modes using Signals without duplicating DOM elements or inputs."</em></p><h5>Answer:</h5><p>Avoid duplicating form elements inside separate <code>&#64;if</code> blocks. Instead, use a single input, bind its read-only status dynamically to a signal, and style it conditionally using active classes:</p>`,
            codeExample: `<!-- View/Edit toggle template -->
<div class="form-group">
  <label>Username</label>
  <input 
    [readonly]="isViewMode()"
    [class.form-control-plaintext]="isViewMode()"
    [class.form-control]="!isViewMode()"
    [(ngModel)]="username" />
  
  <button (click)="toggleMode()">
    {{ isViewMode() ? 'Edit' : 'Save' }}
  </button>
}`,
            language: `html`,
          },
          {
            heading: `Refactoring Bloated Components`,
            content: `<h5>Scenario Question:</h5><p><em>"What is your strategy for refactoring a bloated Angular component?"</em></p><h5>Answer:</h5><p>Bloated components degrade performance and maintainability. Apply the following steps:</p><ol><li><strong>Single Responsibility:</strong> Split business logic into dedicated services (e.g., form validation, state management, HTTP requests).</li><li><strong>Component Decomposability:</strong> Break down the template into smaller child components (e.g., header, sidebar, item list). Use parent-child communication patterns.</li><li><strong>Pure Utilities:</strong> Move helper functions that don't depend on component state into static TypeScript helper files.</li><li><strong>Change Strategy:</strong> Switch to <code>OnPush</code> change detection to isolate re-render cycles.</li></ol>`,
          },
          {
            heading: `Enterprise Component Architecture & Scalability`,
            content: `<h5>Scenario Question:</h5><p><em>"How would you structure a large-scale Angular application to maintain modularity and scalability as features grow?"</em></p><h5>Answer:</h5><p>Adopt a **Feature-Based Modular Architecture** or **Monorepo structure** (Nx):</p><ul><li>Organize code by feature domains (e.g. <code>features/billing</code>, <code>features/auth</code>), where each domain contains its own components, routes, and services.</li><li>Separate reusable presentation UI components (dumb components) from state-managing containers (smart components).</li><li>Use path mappings (aliases) inside <code>tsconfig.json</code> to prevent deeply nested relative paths (e.g. <code>import { Auth } from '@core/auth'</code>).</li><li>Enforce strict unidirectional dependency rules (features cannot import from other features, only from shared core libraries).</li></ul>`,
          },
          {
            heading: `Custom Web Component Bindings`,
            content: `<h5>Scenario Question:</h5><p><em>"How can you integrate third-party non-Angular web components into your templates?"</em></p><h5>Answer:</h5><p>Declare <code>CUSTOM_ELEMENTS_SCHEMA</code> in your component's or module's <code>schemas</code> array. This tells the Angular compiler to ignore unrecognized HTML tags (which represent custom web components) and permits standard data binding and event binding directly on them.</p>`,
            codeExample: `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-web-comp-wrapper',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`<my-custom-slider [value]="opacity()" (slidechange)="onSlide(\$event)"></my-custom-slider>\`
})
export class WebCompWrapperComponent {}`,
          },
        ],
      },
    ],
  },
  {
    id: `reactivity-rxjs`,
    title: `Reactivity & RxJS`,
    icon: `bi-lightning-charge`,
    category: `Reactivity & Data`,
    versions: [
      {
        version: `fundamentals`,
        label: `Fundamentals`,
        sections: [
          {
            heading: `RxJS Core Concepts: Observables & Subjects`,
            content: `<p>RxJS is a library for composing asynchronous and event-based programs using observable sequences. Key concepts include:</p><ul><li><strong>Observable:</strong> A lazy push collection of multiple values over time. Represents streams of data (e.g. HTTP responses, router parameters).</li><li><strong>Subject:</strong> A special type of Observable that allows values to be multicasted to many Observers. It is both an Observable and an Observer.</li><li><strong>BehaviorSubject:</strong> A variant of Subject that requires an initial value and emits the current value to new subscribers.</li></ul>`,
            codeExample: `import { BehaviorSubject } from 'rxjs';

// Create a BehaviorSubject with initial state
const userState = new BehaviorSubject<{ name: string }>({ name: 'Guest' });

// Subscribe to state changes
userState.subscribe(state => console.log('Current user:', state.name));

// Push new state
userState.next({ name: 'Aditya' });`,
            language: `typescript`,
          },
          {
            heading: `Creating Custom RxJS Operators`,
            content: `<p>You can create custom RxJS operators by writing a function that returns an RxJS operator function (which takes an Observable and returns a new Observable).</p>`,
            codeExample: `import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

// Custom operator that filters null/undefined and maps values
export function filterNilAndMap<T, R>(mapFn: (val: T) => R) {
  return (source\$: Observable<T | null | undefined>): Observable<R> => {
    return source\$.pipe(
      filter((val): val is T => val !== null && val !== undefined),
      map(mapFn)
    );
  };
}`,
            language: `typescript`,
          },
          {
            heading: `Observables vs Promises`,
            content: `<p>Key differences between Observables and Promises:</p><table class="table table-bordered mt-2 small"><thead><tr><th>Feature</th><th>Promise</th><th>Observable</th></tr></thead><tbody><tr><td><strong>Emission</strong></td><td>Single value (resolve or reject)</td><td>Multiple values over time (0 to many)</td></tr><tr><td><strong>Execution</strong></td><td>Eager (runs immediately on creation)</td><td>Lazy (runs only when subscribed)</td></tr><tr><td><strong>Cancellation</strong></td><td>Non-cancellable</td><td>Cancellable (via unsubscribe)</td></tr><tr><td><strong>Operators</strong></td><td>No built-in operators</td><td>Rich set of operators (map, filter, merge, etc.)</td></tr></tbody></table>`,
          },
          {
            heading: `Memory Leaks & Unsubscription`,
            content: `<p>Subscribing to Observables creates a subscription that remains in memory even after the component is destroyed. Failing to unsubscribe causes memory leaks. Mitigate this by:</p><ol><li>Calling <code>.unsubscribe()</code> inside <code>ngOnDestroy</code>.</li><li>Using the <code>async</code> pipe in templates (handles subscriptions and unsubscriptions automatically).</li><li>Using operators like <code>take(1)</code>, <code>takeUntil()</code>, or the modern <code>takeUntilDestroyed()</code> helper.</li></ol>`,
            codeExample: `import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-timer-leak-fix',
  template: \`<p>Timer subscription active</p>\`,
  standalone: true
})
export class TimerFixComponent implements OnInit, OnDestroy {
  private destroy\$ = new Subject<void>();

  ngOnInit() {
    interval(1000).pipe(
      takeUntil(this.destroy\$) // Cleans up automatically when destroy\$ emits
    ).subscribe(val => console.log(val));
  }

  ngOnDestroy() {
    this.destroy\$.next();
    this.destroy\$.complete();
  }
}`,
            language: `typescript`,
          },
        ],
      },
      {
        version: `16_v17`,
        label: `Angular 16 & 17`,
        sections: [
          {
            heading: `Reactivity Primitives: Angular Signals Intro`,
            content: `<p>Angular 16 introduced <strong>Signals</strong>, a new reactive primitive providing fine-grained reactivity. Signals track where they are read and trigger targeted UI updates when their values change.</p><ul><li><strong>Writable Signals:</strong> Initialize with <code>signal(value)</code>. Update via <code>.set(val)</code> or <code>.update(fn)</code>.</li><li><strong>Derived Signals (computed):</strong> Create read-only signals with <code>computed(fn)</code>. Caches values and updates dynamically only when dependency signals change.</li><li><strong>Side Effects (effect):</strong> Runs operations in response to signal changes using <code>effect(fn)</code>.</li></ul><p><em>Eggshell Analogy:</em> A signal behaves like an eggshell that wraps the actual value. To read the yolk (value), you must invoke a getter function: <code>mySignal()</code>. The getter registers the reading context as a reactive dependency.</p>`,
            codeExample: `import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <button (click)="increment()">Clicks: {{ count() }}</button>
    <p>Double: {{ doubleCount() }}</p>
  \`,
  standalone: true
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  constructor() {
    effect(() => {
      console.log('Count updated to:', this.count());
    });
  }

  increment() {
    this.count.update(c => c + 1);
  }
}`,
            language: `typescript`,
          },
          {
            heading: `DestroyRef & Subscription Cleanup`,
            content: `<p>Angular 16 introduced <code>DestroyRef</code>, which allows registering cleanup callbacks that run when the current lifecycle context (component, service, directive, etc.) is destroyed. This can replace <code>ngOnDestroy</code>.</p>`,
            codeExample: `import { Component, inject, DestroyRef } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-timer',
  standalone: true,
  template: \`<p>Timer running in console...</p>\`
})
export class TimerComponent {
  constructor() {
    const sub = interval(1000).subscribe(val => console.log(val));
    
    // Register cleanup callback
    inject(DestroyRef).onDestroy(() => {
      sub.unsubscribe();
      console.log('Cleaned up subscription.');
    });
  }
}`,
            language: `typescript`,
          },
          {
            heading: `Router Signals`,
            content: `<p>In Angular 16, routing parameters can be bound to component input properties as Signals. This replaces manually subscribing to <code>route.params</code> observables.</p>`,
            codeExample: `import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-detail-view',
  template: \`<p>Detail ID: {{ id() }}</p>\`,
  standalone: true
})
export class DetailViewComponent {
  private route = inject(ActivatedRoute);
  
  // Convert route params observable into a read-only signal
  id = toSignal(this.route.params.pipe(map(p => p['id'])));
}`,
            language: `typescript`,
          },
        ],
      },
      {
        version: `v18_v19`,
        label: `Angular 18 & 19`,
        sections: [
          {
            heading: `Signal Model Inputs (Two-Way Binding)`,
            content: `<p>Angular 18 introduced the <code>model()</code> input, enabling clean, signal-based two-way data binding. It exposes both an input signal and an output event under the hood.</p>`,
            codeExample: `// Component Definition
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-toggle',
  standalone: true,
  template: \`
    <button (click)="toggle()">State: {{ checked() ? 'ON' : 'OFF' }}</button>
  \`
})
export class ToggleComponent {
  checked = model(false); // Two-way binding signal

  toggle() {
    this.checked.update(val => !val);
  }
}

// Usage in parent template
// <app-toggle [(checked)]="parentState" />`,
            language: `typescript`,
          },
          {
            heading: `linkedSignal API`,
            content: `<p>Angular 19 introduced <code>linkedSignal</code>, a primitive that represents a writable signal whose value is automatically reset or derived based on a source signal.</p><ul><li>Solves the synchronization problem between component state and input signals.</li><li>Avoids having to write manual <code>effect()</code> calls to reset local states when inputs change.</li></ul>`,
            codeExample: `import { Component, input, linkedSignal } from '@angular/core';

@Component({
  selector: 'app-profile-editor',
  standalone: true,
  template: \`
    <p>Editing User ID: {{ userId() }}</p>
    <input [(ngModel)]="username" class="form-control" />
    <button (click)="resetName()">Reset to Default</button>
  \`
})
export class ProfileEditorComponent {
  userId = input.required<string>();
  
  // Writable signal linked to the input. Resets whenever 'userId' changes.
  username = linkedSignal({
    source: this.userId,
    computation: (id) => \`User_\${id}\`
  });

  resetName() {
    this.username.set(\`User_\${this.userId()}\`);
  }
}`,
            language: `typescript`,
          },
          {
            heading: `resource API for Async Operations`,
            content: `<p>Angular 19 introduced the <code>resource()</code> API to manage asynchronous operations (like HTTP requests) reactively. It takes a source signal and executes loader functions, exposing states like <code>value</code>, <code>status</code>, and <code>isLoading</code>.</p>`,
            codeExample: `import { Component, signal, resource } from '@angular/core';

@Component({
  selector: 'app-product-details',
  standalone: true,
  template: \`
    <input type="number" [(ngModel)]="productId" />
    
    &#64;if (product.isLoading()) {
      <div class="spinner-border">Loading...</div>
    } &#64;else if (product.value()) {
      <div>
        <h3>{{ product.value()?.name }}</h3>
        <p>Price: \${{ product.value()?.price }}</p>
      </div>
    }
  \`
})
export class ProductDetailsComponent {
  productId = signal(1);

  // Automatically fetches data when productId changes
  product = resource({
    request: () => ({ id: this.productId() }),
    loader: async ({ request }) => {
      const res = await fetch(\`https://api.example.com/products/\${request.id}\`);
      return await res.json();
    }
  });
}`,
            language: `typescript`,
          },
          {
            heading: `Signals vs RxJS Observables`,
            content: `<p>It's important to know when to use Signals and when to use RxJS Observables in Angular 19:</p><ul><li><strong>Signals:</strong> Perfect for local synchronous state management, UI bindings, and values that exist at a single point in time (e.g. form values, toggles, loading state). Avoids subscription overhead.</li><li><strong>Observables:</strong> Essential for asynchronous streams of events (e.g., HTTP streams, WebSockets, keystroke debouncing) and operations requiring complex temporal coordination (e.g., <code>switchMap</code>, <code>combineLatest</code>).</li><li><strong>Interoperability:</strong> Use <code>toSignal(obs\$)</code> from <code>@angular/core/rxjs-interop</code> to read Observables inside Signal contexts, and <code>toObservable(sig)</code> to stream Signal value changes.</li></ul>`,
          },
        ],
      },
      {
        version: `scenarios`,
        label: `Scenario Prep`,
        sections: [
          {
            heading: `WebSocket updates + Signals`,
            content: `<h5>Scenario Question:</h5><p><em>"In a live dashboard, stock prices update frequently via WebSocket. How would you use Signals to ensure real-time UI updates without triggering full-page change detection or unnecessary re-renders?"</em></p><h5>Answer:</h5><ol><li>Initialize stock prices inside a writable Signal (or a list of Signals per stock).</li><li>Bind the stock prices in the template using standard Signal invocation <code>stockPrice()</code>.</li><li>Configure change detection to <code>ChangeDetectionStrategy.OnPush</code> (or run Zoneless). Because Signals are fine-grained, Angular targets updates specifically to the template text nodes binding the changed signal, leaving the rest of the page DOM untouched.</li></ol>`,
          },
          {
            heading: `Form validation state with Signals`,
            content: `<h5>Scenario Question:</h5><p><em>"A form has 50 fields, but only 2 need validation. How would Signals optimize validation performance compared to traditional reactive forms?"</em></p><h5>Answer:</h5><p>Traditional Reactive Forms run structural validation across the entire form tree whenever any input changes, which can lag in large forms. By using Signals: initialize inputs as individual signals, and compute the validation status using <code>computed()</code>. The computed signals evaluate lazily and only recalculate when their specific dependencies (the 2 validated input signals) emit changes. No validation cycles run when the other 48 fields update.</p>`,
            codeExample: `username = signal('');
password = signal('');
// Only re-runs if username or password changes
isValid = computed(() => this.username().length > 3 && this.password().length > 6);`,
            language: `typescript`,
          },
          {
            heading: `Computed signal error handling`,
            content: `<h5>Scenario Question:</h5><p><em>"Your computed signal depends on 3 API responses. How do you handle errors without breaking the dependency chain?"</em></p><h5>Answer:</h5><p>Computed signals must compute values synchronously and cannot recover internally if an error is thrown during their execution (it breaks the reactive graph). To handle errors safely, wrap the dependency reads in try-catch blocks and return a fallback state object or cache representation instead of throwing:</p>`,
            codeExample: `userData = computed(() => {
  try {
    const auth = this.authSignal();
    const profile = this.profileSignal();
    return { success: true, auth, profile, error: null };
  } catch (err) {
    return { success: false, auth: null, profile: null, error: err };
  }
});`,
            language: `typescript`,
          },
          {
            heading: `Search-as-you-type with Debounce & Signals`,
            content: `<h5>Scenario Question:</h5><p><em>"Design a search-as-you-type component that combines Signals, debounce, and API calls."</em></p><h5>Answer:</h5><p>Use <code>toObservable</code> to bridge the search query signal into an RxJS stream, apply debounce operators, trigger async HTTP calls, and convert the result back to a signal using <code>toSignal</code>:</p>`,
            codeExample: `import { Component, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({ ... })
export class SearchComponent {
  query = signal('');
  
  // Convert query signal to RxJS stream to apply debounce
  results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => this.http.get<string[]>(\`/api/search?q=\${q}\`))
    ),
    { initialValue: [] }
  );

  constructor(private http: HttpClient) {}
}`,
            language: `typescript`,
          },
          {
            heading: `Undo/Redo with Command Pattern and Signals`,
            content: `<h5>Scenario Question:</h5><p><em>"How would you implement undo/redo functionality using Signals and the Command pattern?"</em></p><h5>Answer:</h5><p>Track history in a stack array of states inside a service, and use a writable signal to hold the active state. Standard undo/redo actions pop states from stacks and invoke <code>state.set()</code> to update the UI reactively:</p>`,
            codeExample: `import { signal } from '@angular/core';

export class StateManager<T> {
  activeState = signal<T | null>(null);
  private history: T[] = [];
  private index = -1;

  update(newState: T) {
    this.history = this.history.slice(0, this.index + 1);
    this.history.push(newState);
    this.index++;
    this.activeState.set(newState);
  }

  undo() {
    if (this.index > 0) {
      this.index--;
      this.activeState.set(this.history[this.index]);
    }
  }
}`,
            language: `typescript`,
          },
          {
            heading: `Signals vs Redux State Architecture`,
            content: `<h5>Scenario Question:</h5><p><em>"Your team uses Redux. Convince them to migrate to Signal-based state management with a code comparison."</em></p><h5>Answer:</h5><p>Redux introduces high boilerplate (actions, selectors, reducers, effects). Signals achieve the same unidirectional, predictable data flow with up to 70% less code using the **Service + Signals pattern**. No selectors or dispatchers are needed, and reactivity is tracked automatically: </p>`,
            codeExample: `// Redux (Boilerplate-heavy)
// dispatch(new LoadUserAction(id));
// user\$ = store.select(selectUser);

// Signals (Service Pattern)
@Injectable({ providedIn: 'root' })
export class UserService {
  private userState = signal<User | null>(null);
  user = this.userState.asReadonly(); // Public read-only signal

  loadUser(id: string) {
    this.http.get<User>(\`/api/users/\${id}\`).subscribe(u => this.userState.set(u));
  }
}`,
            language: `typescript`,
          },
        ],
      },
    ],
  },
  {
    id: `routing-forms`,
    title: `Routing & Forms`,
    icon: `bi-signpost-split`,
    category: `Routing & Forms`,
    versions: [
      {
        version: `fundamentals`,
        label: `Fundamentals`,
        sections: [
          {
            heading: `Routing Basics & Named Outlets`,
            content: `<p>Angular Routing enables navigation from one view to the next. The <code>&lt;router-outlet&gt;</code> is a placeholder where Angular dynamically loads components based on routing configurations.</p><ul><li><strong>Named Router Outlets:</strong> Allow displaying multiple active routes simultaneously (e.g. side sheets, popups).</li><li><strong>Lazy Loading:</strong> Load modules or components only when accessed, reducing the initial bundle size. Use <code>loadChildren</code> for feature modules, or <code>loadComponent</code> for standalone components.</li><li><strong>Navigate Methods:</strong><ul><li><code>navigate():</code> Takes an array of route segments (relative or absolute).</li><li><code>navigateByUrl():</code> Takes a complete URL string. Faster as it bypasses segment assembly.</li></ul></li></ul><table class="table table-bordered mt-2 small"><thead><tr><th>Method</th><th>Argument</th><th>Description</th></tr></thead><tbody><tr><td><code>navigate</code></td><td>Array: <code>['/detail', id]</code></td><td>Dynamic segments, supports relative navigation</td></tr><tr><td><code>navigateByUrl</code></td><td>String: <code>'/detail/123'</code></td><td>Absolute path navigation, faster parse time</td></tr></tbody></table>`,
            codeExample: `// Route Configuration
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'chat',
    component: ChatComponent,
    outlet: 'sidebar' // Named outlet
  }
];

// Template Binding
// <router-outlet></router-outlet>
// <router-outlet name="sidebar"></router-outlet>`,
            language: `typescript`,
          },
          {
            heading: `Forms: Template-driven vs Reactive`,
            content: `<p>Angular provides two different techniques to handle user input through forms:</p><ul><li><strong>Template-driven Forms:</strong> Easier to use for simple forms. Driven by the template using directives like <code>ngModel</code>. Validation is declared via HTML attributes.</li><li><strong>Reactive Forms:</strong> More robust, scalable, and testable. Managed directly in the component class using form objects: <code>FormControl</code>, <code>FormGroup</code>, and <code>FormArray</code>.</li></ul>`,
            codeExample: `import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
      <input formControlName="email" type="email" class="form-control" />
      <button [disabled]="contactForm.invalid" class="btn btn-primary">Submit</button>
    </form>
  \`
})
export class ContactFormComponent {
  contactForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  onSubmit() {
    console.log(this.contactForm.value);
  }
}`,
            language: `typescript`,
          },
          {
            heading: `Complex Form Validation`,
            content: `<p>Complex validation involves writing custom validators, cross-field validation, and async validators:</p><ul><li><strong>Custom Validators:</strong> Plain functions that return a validation error object or null.</li><li><strong>Cross-Field Validation:</strong> Assigned to the <code>FormGroup</code> container to compare multiple values (e.g. matching password and confirmPassword fields).</li><li><strong>Async Validators:</strong> Return an Observable or Promise resolving to validation errors (useful for database checks, like checking username availability).</li></ul>`,
            codeExample: `import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Cross-field validator example
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value === confirmPassword.value
    ? null
    : { passwordMismatch: true };
};`,
            language: `typescript`,
          },
          {
            heading: `Date Formatting & Time Zones`,
            content: `<p>Dates in forms require proper presentation and structure during submissions:</p><ul><li><strong>JSON Submission:</strong> Always format Date objects to ISO-8601 strings (UTC) using <code>date.toISOString()</code> or <code>JSON.stringify()</code> before API calls to prevent local machine offset corruption.</li><li><strong>DatePipe:</strong> Formats dates in UI views: <code>{{ today | date:'dd/MM/yyyy' }}</code>.</li><li><strong>Timezone offset management:</strong> Use libraries like <code>date-fns-tz</code> or <code>moment-timezone</code> to parse dates under explicit target zones.</li></ul>`,
          },
        ],
      },
      {
        version: `16_v17`,
        label: `Angular 16 & 17`,
        sections: [
          {
            heading: `Functional Route Guards`,
            content: `<p>Angular 17 deprecated class-based guards in favor of <strong>Functional Guards</strong>. They are simple, readable functions that can inject dependencies directly using the <code>inject()</code> function.</p>`,
            codeExample: `import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login if unauthenticated
  return router.parseUrl('/login');
};`,
            language: `typescript`,
          },
        ],
      },
      {
        version: `v18_v19`,
        label: `Angular 18 & 19`,
        sections: [
          {
            heading: `Modern Routing & Inputs`,
            content: `<p>Modern Angular versions support binding route parameters (path parameters, query parameters, data objects) directly to component inputs. Simply add <code>withComponentInputBinding()</code> to router configuration providers, and define matching inputs in components.</p>`,
            codeExample: `import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-view',
  template: \`<p>Viewing Product: {{ id() }}</p>\`,
  standalone: true
})
export class ProductViewComponent {
  // Bound directly from path param /product/:id
  id = input.required<string>();
}`,
            language: `typescript`,
          },
        ],
      },
      {
        version: `scenarios`,
        label: `Scenario Prep`,
        sections: [
          {
            heading: `Dynamic Multi-Step Form`,
            content: `<h5>Scenario Question:</h5><p><em>"How would you approach managing a complex multi-step form with dynamic nested fields, cross-field validation, and conditional steps?"</em></p><h5>Answer:</h5><ol><li>Use <strong>Reactive Forms</strong> because they allow programmatically adding, removing, and changing validators at runtime.</li><li>Use <code>FormArray</code> to handle lists of nested controls that can grow or shrink dynamically.</li><li>Write a custom validator function and assign it at the root <code>FormGroup</code> level to perform cross-field validation (e.g. validating that 'confirmPassword' matches 'password').</li><li>Track step indices in component state, and render only active form groups using control flow: <code>&#64;if (currentStep === 1) { ... }</code>.</li></ol>`,
          },
          {
            heading: `Signal binding to template-driven ngModel`,
            content: `<h5>Scenario Question:</h5><p><em>"How would you bind a Signal to a template-driven form's ngModel?"</em></p><h5>Answer:</h5><p>In template-driven forms, you cannot use a direct two-way binding on a signal getter <code>[(ngModel)]="searchQuery()"</code> because getters are read-only. Instead, split the binding: read the value using the getter signal call, and capture changes via <code>ngModelChange</code> to write back to the signal:</p>`,
            codeExample: `<input 
  [ngModel]="searchQuery()" 
  (ngModelChange)="searchQuery.set(\$event)" 
  class="form-control" />`,
            language: `html`,
          },
          {
            heading: `Preloading strategies in complex routes`,
            content: `<h5>Scenario Question:</h5><p><em>"How do you implement custom preloading strategies in Angular routing?"</em></p><h5>Answer:</h5><p>By default, Angular loads modules eagerly or lazily when routes are clicked. To pre-fetch lazy modules in the background, implement a custom <code>PreloadingStrategy</code> class or functional provider that checks route data flags (e.g. <code>preload: true</code>) to trigger preloading selectively:</p>`,
            codeExample: `import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomPreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Only preload if 'preload' flag is true in route definition data
    return route.data && route.data['preload'] ? load() : of(null);
  }
}`,
            language: `typescript`,
          },
          {
            heading: `Routing Guards with Role-Based Access Control`,
            content: `<h5>Scenario Question:</h5><p><em>"Design a guard that allows navigation only to users carrying a specific role matching metadata parameters."</em></p><h5>Answer:</h5><p>Inject your AuthService and Router inside a functional guard, inspect the route's <code>data</code> parameters to check required roles, and resolve to boolean or redirect routes: </p>`,
            codeExample: `import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'] as string;

  if (auth.hasRole(requiredRole)) {
    return true;
  }
  return router.parseUrl('/unauthorized');
};`,
            language: `typescript`,
          },
        ],
      },
    ],
  },
  {
    id: `services-di`,
    title: `Services & DI`,
    icon: `bi-diagram-3`,
    category: `Services & DI`,
    versions: [
      {
        version: `fundamentals`,
        label: `Fundamentals`,
        sections: [
          {
            heading: `Dependency Injection System`,
            content: `<p>Dependency Injection (DI) is a design pattern in which a class requests dependencies from external sources rather than creating them itself.</p><ul><li><strong>Hierarchical Injectors:</strong> Angular manages injectors at different levels: Platform, Root, Component, and Directive.</li><li><strong>Resolution Rules:</strong> Angular crawls up the component tree to find a provider, falling back to the module injector, then the root injector.</li><li><strong>Provider Types:</strong><ul><li><code>useClass:</code> Instantiates a class dependency.</li><li><code>useValue:</code> Uses a pre-defined static value (e.g., config constants).</li><li><code>useFactory:</code> Runs a factory function to dynamically generate a value at runtime.</li></ul></li></ul>`,
            codeExample: `import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Singleton provider across the entire application
})
export class LoggerService {
  log(msg: string) { console.log(\`[LOG]: \${msg}\`); }
}`,
            language: `typescript`,
          },
          {
            heading: `HTTP Client & Global Error Interceptors`,
            content: `<p>The <code>HttpClient</code> service enables API communication. Global request and response manipulations are handled by interceptors.</p>`,
            codeExample: `import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Global Error caught:', error.message);
      // Implement notification alerts or redirect logic here
      return throwError(() => new Error(error.message));
    })
  );
};`,
            language: `typescript`,
          },
        ],
      },
      {
        version: `16_v17`,
        label: `Angular 16 & 17`,
        sections: [
          {
            heading: `The inject() Function`,
            content: `<p>Angular 16 introduced the <code>inject()</code> function to resolve dependencies inside injection contexts (like constructors, factory functions, or initializer blocks) without constructor parameter syntax.</p><ul><li>Simplifies inheritance: Base classes with dependencies no longer require child classes to declare <code>super()</code> constructors with matching DI.</li><li>Can be used in helper functions to create reusable compositions of state or behaviors.</li></ul>`,
            codeExample: `// Constructor Injection vs inject()
import { Component, inject } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-user',
  template: \`<p>User: {{ data().name }}</p>\`,
  standalone: true
})
export class UserComponent {
  // Simple dependency injection without constructor
  private dataService = inject(DataService);
  
  data = this.dataService.getUserData();
}`,
            language: `typescript`,
          },
        ],
      },
      {
        version: `v18_v19`,
        label: `Angular 18 & 19`,
        sections: [
          {
            heading: `Injectors in Zoneless`,
            content: `<p>In Angular 18/19 zoneless environments, dependencies can be injected safely. You can also inject <code>ChangeDetectorRef</code> or <code>ApplicationRef</code> into libraries to manually notify Angular of asynchronous data changes, keeping layouts up to date.</p>`,
          },
        ],
      },
      {
        version: `scenarios`,
        label: `Scenario Prep`,
        sections: [
          {
            heading: `Component vs Root-level Providers`,
            content: `<h5>Scenario Question:</h5><p><em>"How does dependency injection differ between component-level and root-level providers, and when should you use each?"</em></p><h5>Answer:</h5><ul><li><strong>Root level:</strong> Declared via <code>&#64;Injectable({ providedIn: 'root' })</code>. Creates a single singleton instance shared across the entire application. Best for stateless utilities, global state stores, or HTTP wrappers.</li><li><strong>Component level:</strong> Declared inside component metadata <code>providers: [...]</code>. Creates a new sandbox instance scoped specifically to that component instance and its subtree. When the component is destroyed, the service instance is garbage-collected. Best for keeping component state isolated (e.g. multi-step stepper state services).</li></ul>`,
          },
          {
            heading: `useValue and useFactory in Service DI`,
            content: `<h5>Scenario Question:</h5><p><em>"How would you inject dynamic configuration values into a service at runtime?"</em></p><h5>Answer:</h5><p>Use custom providers with <code>useValue</code> for static values, and <code>useFactory</code> for dynamic computation of dependencies based on other services injected at launch:</p>`,
            codeExample: `import { InjectionToken } from '@angular/core';

export const API_CONFIG = new InjectionToken<string>('api_url');

// Provider configuration
export const appProviders = [
  { provide: API_CONFIG, useValue: 'https://api.myapp.com' },
  {
    provide: LoggerService,
    useFactory: (config: string) => {
      return new LoggerService(config);
    },
    deps: [API_CONFIG]
  }
];`,
            language: `typescript`,
          },
          {
            heading: `Circular Dependencies in DI`,
            content: `<h5>Scenario Question:</h5><p><em>"Your build fails due to a circular dependency between ServiceA and ServiceB. How do you resolve this?"</em></p><h5>Answer:</h5><ol><li><strong>Refactor Common Logic:</strong> Extract the shared methods causing the circular loop into a third independent service (ServiceC) and inject ServiceC into both ServiceA and ServiceB.</li><li><strong>Lazy Injection:</strong> Resolve one service lazily using Angular's <code>injector.get()</code> or the modern <code>inject()</code> inside a function call rather than the constructor, delaying instantiation until it is actually invoked.</li></ol>`,
          },
        ],
      },
    ],
  },
  {
    id: `performance-advanced`,
    title: `Performance & Advanced`,
    icon: `bi-speedometer2`,
    category: `Advanced Topics`,
    versions: [
      {
        version: `fundamentals`,
        label: `Fundamentals`,
        sections: [
          {
            heading: `Change Detection: Default vs OnPush`,
            content: `<p>Angular checks the component tree for changes when browser events happen (e.g. click, keyup, timer, API callbacks).</p><ul><li><strong>Default Strategy:</strong> Checks every component on the tree from root to leaf on every event. Can cause lag in large applications.</li><li><strong>OnPush Strategy:</strong> Checks a component ONLY if:<ol><li>An input reference changes.</li><li>An event bound in the component template fires.</li><li>A bound signal updates.</li><li>We call change detector reference methods (e.g. <code>markForCheck()</code>).</li></ol></li></ul>`,
            codeExample: `import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  template: \`<div>Score: {{ data.score }}</div>\`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush // Optimize performance
})
export class StatsCardComponent {
  @Input() data!: { score: number };
}`,
            language: `typescript`,
          },
          {
            heading: `SCSS Reusability & Deprecated Deep`,
            content: `<p>Keep SCSS organized and scalable inside enterprise Angular applications:</p><ul><li><strong>SCSS Variables and Mixins:</strong> Store color maps, grid breakpoints, and flex mixins inside central config files (e.g., <code>_variables.scss</code>) and import them.</li><li><strong>::ng-deep Deprecation:</strong> Historically used to override styles of child components. It is deprecated. Instead, use global override style files, CSS Custom Properties (variables), or pass styling config properties to components.</li></ul>`,
            codeExample: `/* central variables */
\$brand-magenta: #f637e3;

/* mixin for center alignment */
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* using mixin in component styles */
.btn-brand {
  background-color: \$brand-magenta;
  @include flex-center;
}`,
            language: `css`,
          },
          {
            heading: `TypeScript Config & CLI Tools`,
            content: `<p>Key configurations and commands to manage compilation and dependency lock consistency in Angular projects:</p><ul><li><strong>tsconfig.json:</strong> Configures compiler options (e.g. <code>strict</code> type checks, path mappings, compilation targets).</li><li><strong>package.json vs package-lock.json:</strong> <code>package.json</code> holds requested semantic versions, while <code>package-lock.json</code> pins exact dependency versions for reproducible builds.</li><li><strong>Angular CLI Commands:</strong><ul><li><code>ng build:</code> Compiles to dist, supports production flags.</li><li><code>ng serve:</code> Starts local hot-reload server.</li><li><code>ng generate (ng g):</code> Scaffolds files (components, services).</li></ul></li></ul>`,
          },
          {
            heading: `SCSS mixins & BEM methodology`,
            content: `<p>Ensure SCSS reusability in large projects using variables, mixins, and BEM (Block-Element-Modifier) naming conventions: <code>.card</code>, <code>.card__title</code>, <code>.card__button--disabled</code>. This improves style scope isolation and prevents global scope leaks.</p>`,
          },
          {
            heading: `Core dependencies & Debugging`,
            content: `<p>Recommended tooling and core libraries for Angular development:</p><ul><li><strong>Dependencies:</strong> RxJS (async), NgRx (state management), Angular Material (UI components), Lodash (utilities), ngx-translate (localization).</li><li><strong>Debugging tools:</strong> Console logging, Augury (inspecting component states), Chrome DevTools Breakpoints, Change Detection checking, and Jasmine/Karma unit tests.</li></ul>`,
          },
        ],
      },
      {
        version: `16_v17`,
        label: `Angular 16 & 17`,
        sections: [
          {
            heading: `Deferrable Views (&#64;defer)`,
            content: `<p>Deferrable views allow lazy loading template dependencies (components, directives, pipes) when specific triggers are met. This drastically reduces initial load times.</p><ul><li><strong>Triggers:</strong><ul><li><code>on idle:</code> Default trigger. Loads when browser is idle.</li><li><code>on viewport:</code> Loads when the placeholder element enters the viewport.</li><li><code>on hover:</code> Loads when mouse hovers over placeholder.</li><li><code>on timer(duration):</code> Loads after a delay.</li><li><code>when expression:</code> Loads when a boolean expression returns true.</li></ul></li><li><strong>Blocks:</strong> <code>&#64;defer</code>, <code>&#64;placeholder</code>, <code>&#64;loading</code>, and <code>&#64;error</code>.</li></ul>`,
            codeExample: `<!-- Deferring a heavy component -->
&#64;defer (on viewport) {
  <heavy-charts-component />
} &#64;placeholder {
  <!-- Rendered initially before deferred content triggers -->
  <div class="skeleton-chart">Chart will load when visible...</div>
} &#64;loading {
  <p>Loading chart data...</p>
} &#64;error {
  <p class="text-danger">Failed to load chart.</p>
}`,
            language: `html`,
          },
          {
            heading: `SSR Hydration improvements`,
            content: `<p>Angular 17 introduced non-destructive client-side hydration for Server-Side Rendering (SSR). Instead of destroying server-rendered DOM and rebuilding it on the client, Angular matches existing DOM nodes with application components, attaching event listeners without flickering or performance drops.</p>`,
          },
          {
            heading: `Accessibility (a11y) improvements`,
            content: `<p>Angular 17+ introduced several built-in features to make web products accessible out of the box:</p><ul><li>Improved ARIA attributes support for screen readers.</li><li>Accessibility improvements in form fields and dropdown keyboards navigation focus states.</li><li>A11y lint checks built into the Angular CLI to capture semantic structure issues at compile time.</li></ul>`,
          },
        ],
      },
      {
        version: `v18_v19`,
        label: `Angular 18 & 19`,
        sections: [
          {
            heading: `Zoneless Change Detection`,
            content: `<p>Angular 18 introduced experimental support for **Zoneless change detection**, removing the requirement of <code>zone.js</code>. This improves runtime speed, makes execution debugging simpler, and yields smaller bundle sizes.</p><ul><li>Configured in <code>app.config.ts</code> by declaring <code>provideExperimentalZonelessChangeDetection()</code>.</li><li>Reuses Signals or component event bindings to trigger target updates safely.</li></ul>`,
            codeExample: `import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = { 
  providers: [
    provideExperimentalZonelessChangeDetection() // Removes zone.js overhead
  ]
};`,
            language: `typescript`,
          },
          {
            heading: `Incremental SSR & Event Replay`,
            content: `<p>Angular 19 introduces major updates to SSR, including event replay (powered by Google's jsaction). If a user clicks a button on the server-rendered page before hydration completes, Angular captures the user event and replays it once hydration is finished, preventing lost clicks and enhancing perceived performance.</p>`,
          },
          {
            heading: `Microfrontends & Module Federation`,
            content: `<p>Enterprise apps can load self-contained micro-applications dynamically using Module Federation at runtime. Standalone components, shared injection contexts, and external configurations make these setups modular and highly scalable.</p>`,
          },
          {
            heading: `Security (XSS & CSRF Mitigation)`,
            content: `<p>Angular implements solid mechanisms to secure applications from web vulnerabilities:</p><ul><li><strong>Cross-Site Scripting (XSS):</strong> Angular treats values as untrusted by default. Sanitizes inputs before binding to DOM. Use <code>DomSanitizer</code> to bypass validation only when verified.</li><li><strong>Cross-Site Request Forgery (CSRF):</strong> Injects unique cookie tokens to match incoming headers using <code>HttpClientXsrfModule</code>.</li></ul>`,
          },
          {
            heading: `PWA & Service Workers`,
            content: `<p>Install <code>&#64;angular/pwa</code> to enable offline capability and local cache support. Service workers intercept requests to serve cached assets, yielding instant loads and native app shell behaviors.</p>`,
          },
        ],
      },
      {
        version: `scenarios`,
        label: `Scenario Prep`,
        sections: [
          {
            heading: `10,000 Items @for Loop Optimization`,
            content: `<h5>Scenario Question:</h5><p><em>"An &#64;for loop renders 10,000 items in a tabular list, causing major lags on scrolls and inputs. How do you optimize it?"</em></p><h5>Answer:</h5><ol><li>Ensure the loop utilizes a unique key identifier inside the <code>track</code> statement to prevent unnecessary re-rendering.</li><li>Use <strong>Virtual Scrolling</strong> (via Angular CDK <code>ScrollingModule</code>) to render only the DOM elements that are currently visible within the viewport, dropping the active DOM nodes from 10,000 to around 20–30.</li><li>Configure the component to use <code>ChangeDetectionStrategy.OnPush</code>.</li></ol>`,
          },
          {
            heading: `Zoneless mode debugging with 3rd-party callbacks`,
            content: `<h5>Scenario Question:</h5><p><em>"After enabling zoneless mode in Angular 19, parts of your application containing async third-party chart libraries stop updating. How would you debug and fix this?"</em></p><h5>Answer:</h5><ol><li>In zoneless mode, Angular relies on framework primitives (like Signals or events) to detect changes. Third-party library async callbacks bypass these mechanisms, meaning changes aren't tracked.</li><li>To fix this, inject <code>ChangeDetectorRef</code> or <code>ApplicationRef</code> in the component wrapper.</li><li>Inside the third-party library callbacks, invoke <code>changeDetectorRef.markForCheck()</code> or <code>applicationRef.tick()</code> to explicitly notify Angular that changes occurred and rendering updates are required.</li></ol>`,
            codeExample: `import { Component, ElementRef, inject, afterNextRender, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-legacy-chart',
  standalone: true,
  template: \`<div id="chart"></div>\`
})
export class LegacyChartComponent {
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    afterNextRender(() => {
      // Third-party non-Angular chart library
      LegacyChart.init('chart', {
        onUpdate: () => {
          // Trigger change detection manually since Zone.js is gone
          this.cdr.markForCheck();
        }
      });
    });
  }
}`,
            language: `typescript`,
          },
          {
            heading: `Memory Leak Diagnosis & Fix`,
            content: `<h5>Scenario Question:</h5><p><em>"Your application slows down after repeated navigations due to memory leaks. How do you trace and fix them?"</em></p><h5>Answer:</h5><ol><li>Use <strong>Chrome DevTools Memory tab</strong> to take heap snapshots before and after navigation. Filter by component names to see if destroyed component instances are still held in memory.</li><li>Look for active subscriptions that weren't cleaned up, event listeners attached directly to the global window/document (via renderer or raw methods) without removal, or global state objects retaining component references.</li><li>Fix leaks by unsubscribing in <code>ngOnDestroy</code> or <code>DestroyRef.onDestroy</code>, detaching global listeners, and avoiding local state mutations in shared services.</li></ol>`,
          },
          {
            heading: `Microfrontends (Module Federation) shared state`,
            content: `<h5>Scenario Question:</h5><p><em>"How would you share Signal state between standalone components in a micro-frontend setup?"</em></p><h5>Answer:</h5><p>Compile a lightweight shared package (e.g. <code>&#64;shared/state</code>) containing a Service or subject. Since Module Federation loads shared modules dynamically, declare the service as a singleton provider in the shell configuration, ensuring both host and remote micro-frontends share the same instance of the state store rather than creating separate local ones.</p>`,
          },
          {
            heading: `Web Workers for heavy background tasks`,
            content: `<h5>Scenario Question:</h5><p><em>"How do you run CPU-intensive mathematical tasks without blocking user input on the UI thread?"</em></p><h5>Answer:</h5><p>Run heavy calculations inside a <strong>Web Worker</strong>. Scaffolding is done via Angular CLI: <code>ng g web-worker worker-name</code>. The component triggers computation by sending data to the worker: <code>worker.postMessage(...)</code>. The worker computes in a separate background thread, and sends back the result via <code>postMessage(...)</code>, leaving the main UI thread free and responsive.</p>`,
            codeExample: `// Scaffolding inside Component
if (typeof Worker !== 'undefined') {
  const worker = new Worker(new URL('./app.worker', import.meta.url));
  worker.onmessage = ({ data }) => {
    console.log(\`Computed page result: \${data}\`);
  };
  worker.postMessage(heavyInputData);
}`,
            language: `typescript`,
          },
          {
            heading: `Legacy app migration scenario`,
            content: `<h5>Scenario Question:</h5><p><em>"How would you migrate a legacy AngularJS app containing dynamic views to modern Angular Standalone architectures?"</em></p><h5>Answer:</h5><p>Use a **hybrid application pattern** (using <code>&#64;angular/upgrade</code>) or a **clean phase-by-phase rewrite**:</p><ol><li>Configure route redirects to load new Angular components side-by-side with AngularJS views.</li><li>Downgrade new Standalone components using <code>downgradeComponent</code> to let AngularJS render them in old layouts.</li><li>Upgrade legacy shared services so Angular services can resolve legacy API states.</li><li>Bootstrap the hybrid application dynamically using <code>UpgradeModule</code>, and systematically retire AngularJS modules page-by-page.</li></ol>`,
          },
        ],
      },
    ],
  },
];
