export interface CodeFile {
  fileName: string;
  language: 'typescript' | 'xml' | 'css';
  code: string;
}

export interface Section {
  heading: string;
  content?: string;
  codeFiles?: CodeFile[];
  mermaidDefinition?: string;
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

  // Reactivity & RxJS
  {
    id: 'reactivity-rxjs',
    title: 'Reactivity & RxJS',
    icon: 'bi-lightning-charge',
    category: 'Reactivity',
    versions: [
      {
        version: 'fundamentals',
        label: 'Fundamentals',
        sections: [
          {
            heading: 'Observables, Subjects & Operators',
            content: `<p>RxJS is Angular's reactive programming library. It models async data as streams you can compose, transform, and combine.</p><ul><li><strong>Observable:</strong> Lazy push-based data producer. Nothing happens until you <code>subscribe()</code>.</li><li><strong>Subject:</strong> Both an Observable and an Observer — useful for multicasting or acting as an event bus.</li><li><strong>BehaviorSubject:</strong> Holds the last emitted value; new subscribers get it immediately. Ideal for shared state.</li><li><strong>Common operators:</strong> <code>map</code>, <code>filter</code>, <code>switchMap</code>, <code>mergeMap</code>, <code>debounceTime</code>, <code>distinctUntilChanged</code>, <code>takeUntilDestroyed</code>.</li></ul><table class="table table-bordered mt-2 small"><thead><tr><th>Operator</th><th>Effect</th><th>Use Case</th></tr></thead><tbody><tr><td><code>switchMap</code></td><td>Cancels previous inner Observable</td><td>Typeahead search</td></tr><tr><td><code>mergeMap</code></td><td>Runs all inner Observables concurrently</td><td>Parallel API calls</td></tr><tr><td><code>exhaustMap</code></td><td>Ignores new emissions while inner is active</td><td>Prevent duplicate form submits</td></tr></tbody></table>`,
            codeFiles: [
              {
                fileName: 'search.service.ts',
                language: 'typescript',
                code: `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);

  // BehaviorSubject — holds current search term; emits to new subscribers immediately
  private query$ = new BehaviorSubject<string>('');

  // Derived stream: debounce input → skip duplicates → cancel stale requests
  results$ = this.query$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term =>
      term.length > 1
        ? this.http.get<string[]>(\`/api/search?q=\${term}\`)
        : []  // short-circuit — no request needed
    )
  );

  search(term: string) {
    this.query$.next(term);
  }
}`
              },
              {
                fileName: 'search-bar.component.ts',
                language: 'typescript',
                code: `import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  template: \`
    <input [(ngModel)]="term" (ngModelChange)="svc.search($event)" placeholder="Search..." />
    <ul>
      @for (r of svc.results$ | async; track r) {
        <li>{{ r }}</li>
      }
    </ul>
  \`
})
export class SearchBarComponent {
  svc = inject(SearchService);
  term = '';
}`
              }
            ]
          },
          {
            heading: 'Subscription Management & Memory Leaks',
            content: `<p>Forgetting to unsubscribe from long-lived Observables is the most common source of memory leaks in Angular.</p><ul><li><strong>AsyncPipe:</strong> The safest option — it auto-subscribes and auto-unsubscribes when the component is destroyed.</li><li><strong>takeUntilDestroyed:</strong> Angular 16+ operator that automatically completes a stream when the component's destroy context fires. Must be called inside an injection context.</li><li><strong>Manual unsubscribe:</strong> Store the <code>Subscription</code> and call <code>.unsubscribe()</code> in <code>ngOnDestroy</code> — verbose but always works.</li></ul>`,
            codeFiles: [
              {
                fileName: 'live-feed.component.ts',
                language: 'typescript',
                code: `import { Component, inject, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-live-feed',
  standalone: true,
  template: \`<p>Tick: {{ tick }}</p>\`
})
export class LiveFeedComponent implements OnDestroy {
  tick = 0;

  // ── Approach 1: takeUntilDestroyed (Angular 16+, recommended) ──
  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed())   // auto-cleans up on destroy
      .subscribe(n => this.tick = n);
  }
}

// ── Approach 2: Manual unsubscribe (classic) ───────────────────
export class OldFeedComponent implements OnDestroy {
  tick = 0;
  private sub!: Subscription;

  constructor() {
    this.sub = interval(1000).subscribe(n => this.tick = n);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();  // must NOT forget this
  }
}`
              }
            ]
          },
          {
            heading: 'combineLatest, forkJoin & zip',
            content: `<p>These operators combine multiple Observables into one. Choose based on timing and emission rules:</p><ul><li><strong>forkJoin:</strong> Waits for all Observables to <em>complete</em> and emits the last value from each. Perfect for parallel HTTP calls.</li><li><strong>combineLatest:</strong> Emits whenever <em>any</em> source emits (after all have emitted at least once). Perfect for reactive form state or dashboard filters.</li><li><strong>zip:</strong> Pairs emissions by index — emits only when <em>all</em> sources have a new value at the same index. Rarely used but precise.</li></ul>`,
            codeFiles: [
              {
                fileName: 'dashboard.service.ts',
                language: 'typescript',
                code: `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, forkJoin, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  // ── forkJoin — parallel HTTP; emits once all complete ─────
  loadPageData() {
    return forkJoin({
      user:    this.http.get('/api/user'),
      orders:  this.http.get('/api/orders'),
      stats:   this.http.get('/api/stats')
    });
    // Emits: { user: {...}, orders: [...], stats: {...} } — once
  }

  // ── combineLatest — reactive filters ──────────────────────
  region$ = new BehaviorSubject<string>('IN');
  period$ = new BehaviorSubject<string>('monthly');

  filteredStats$ = combineLatest([this.region$, this.period$]).pipe(
    map(([region, period]) => ({ region, period }))
    // Re-emits whenever region OR period changes
  );
}`
              }
            ]
          }
        ]
      },
      {
        version: 'signals',
        label: 'Signals (v17+)',
        sections: [
          {
            heading: 'Signals, computed() & effect()',
            content: `<p>Signals are Angular's synchronous reactive primitives that replace the need for most RxJS patterns within components.</p><ul><li><strong>signal():</strong> Writable reactive value. Read with <code>value()</code>, write with <code>.set()</code> or <code>.update()</code>.</li><li><strong>computed():</strong> Derives a read-only signal from other signals. Result is cached and only recalculates when dependencies change.</li><li><strong>effect():</strong> Side-effect runner — re-executes when any consumed signal changes. Useful for logging, syncing to localStorage, etc.</li></ul>`,
            codeFiles: [
              {
                fileName: 'cart.component.ts',
                language: 'typescript',
                code: `import { Component, signal, computed, effect } from '@angular/core';

interface CartItem { id: number; name: string; price: number; qty: number; }

@Component({
  selector: 'app-cart',
  standalone: true,
  template: \`
    <p>Items: {{ items().length }}</p>
    <p>Total: ₹{{ total() }}</p>
    <button (click)="addItem()">Add Laptop</button>
  \`
})
export class CartComponent {
  // Writable signal
  items = signal<CartItem[]>([]);

  // Computed — recalculates only when items() changes
  total = computed(() =>
    this.items().reduce((sum, i) => sum + i.price * i.qty, 0)
  );

  constructor() {
    // Effect — runs whenever items() changes (side effect)
    effect(() => {
      console.log('Cart updated. Total:', this.total());
      localStorage.setItem('cart', JSON.stringify(this.items()));
    });
  }

  addItem() {
    this.items.update(cart => [
      ...cart,
      { id: Date.now(), name: 'Laptop Pro', price: 79999, qty: 1 }
    ]);
  }
}`
              }
            ]
          },
          {
            heading: 'toSignal() & toObservable()',
            content: `<p>The <code>@angular/core/rxjs-interop</code> package bridges Signals and RxJS, letting you mix both in the same component:</p><ul><li><strong>toSignal(obs$):</strong> Subscribes to an Observable inside a component and exposes its latest value as a read-only Signal. Auto-unsubscribes on destroy.</li><li><strong>toObservable(signal):</strong> Converts a Signal into a cold Observable stream, useful when you need to pipe it through RxJS operators.</li></ul>`,
            codeFiles: [
              {
                fileName: 'weather.component.ts',
                language: 'typescript',
                code: `import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-weather',
  standalone: true,
  template: \`
    <select (change)="city.set($any($event.target).value)">
      <option value="Mumbai">Mumbai</option>
      <option value="Delhi">Delhi</option>
    </select>

    @if (weather()) {
      <p>{{ weather()!.city }}: {{ weather()!.temp }}°C</p>
    }
  \`
})
export class WeatherComponent {
  private http = inject(HttpClient);

  // Writable signal for selected city
  city = signal('Mumbai');

  // Convert signal → Observable → pipe switchMap → back to Signal
  weather = toSignal(
    toObservable(this.city).pipe(
      switchMap(c => this.http.get<{ city: string; temp: number }>(\`/api/weather/\${c}\`))
    ),
    { initialValue: null }
  );
}`
              }
            ]
          },
          {
            heading: 'Scenario: Signal vs RxJS — When to use which',
            content: `<h5>Scenario Question:</h5><p><em>"When would you use a Signal instead of a BehaviorSubject for shared component state?"</em></p><h5>Answer:</h5><ul><li><strong>Use Signals</strong> for synchronous UI state (toggles, counts, form values, selected tab) — simpler API, no subscription management.</li><li><strong>Use RxJS (BehaviorSubject)</strong> when you need time-based operators (<code>debounceTime</code>, <code>delay</code>), multicasting to external subscribers, or complex async coordination across services.</li><li><strong>Hybrid:</strong> Keep HTTP streams as Observables in services; use <code>toSignal()</code> to consume them in components.</li></ul>`,
            codeFiles: [
              {
                fileName: 'state-comparison.ts',
                language: 'typescript',
                code: `import { signal, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

// ── Signals — best for synchronous component-local state ──
const count = signal(0);
const doubled = computed(() => count() * 2);
count.set(5);       // doubled() → 10 (automatic, no subscribe)

// ── BehaviorSubject — best for service-level async state ──
const count$ = new BehaviorSubject(0);
const doubled$ = count$.pipe(map(n => n * 2));
count$.next(5);
doubled$.subscribe(v => console.log(v)); // 10 (explicit subscribe)

// ── Rule of thumb ──────────────────────────────────────────
// Template state, derived UI state   → Signals
// HTTP responses, event streams      → RxJS Observables
// Cross-component reactive state     → Service with Signal or BehaviorSubject`
              }
            ]
          }
        ]
      },
      {
        version: 'scenarios',
        label: 'Scenario Prep',
        sections: [
          {
            heading: 'Preventing Duplicate HTTP Requests on Form Submit',
            content: `<h5>Scenario Question:</h5><p><em>"A user double-clicks the submit button and fires two identical HTTP requests. How do you prevent this?"</em></p><h5>Answer:</h5><p>Use <code>exhaustMap</code> in an RxJS pipeline. Unlike <code>switchMap</code> (which cancels the first) or <code>mergeMap</code> (which runs both), <code>exhaustMap</code> ignores all new emissions while an inner Observable is still active:</p>`,
            codeFiles: [
              {
                fileName: 'order-form.component.ts',
                language: 'typescript',
                code: `import { Component, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-form',
  standalone: true,
  template: \`<button (click)="submit$.next()">Place Order</button>\`
})
export class OrderFormComponent {
  private http = inject(HttpClient);

  // A Subject acts as a button-click event bus
  submit$ = new Subject<void>();

  constructor() {
    this.submit$.pipe(
      // Ignores button clicks while the current HTTP call is in-flight
      exhaustMap(() => this.http.post('/api/orders', { items: [] })),
      takeUntilDestroyed()
    ).subscribe(res => console.log('Order placed:', res));
  }
}`
              }
            ]
          },
          {
            heading: 'Race Condition in Typeahead Search',
            content: `<h5>Scenario Question:</h5><p><em>"Your search API sometimes returns results out of order — older requests arrive after newer ones. How do you fix this?"</em></p><h5>Answer:</h5><p>Use <code>switchMap</code>. It automatically cancels the previous in-flight HTTP request when a new search term arrives, ensuring you always get the result for the <em>latest</em> term. The key insight: <code>switchMap</code> unsubscribes from (and cancels) the previous inner Observable before creating a new one.</p>`,
            codeFiles: [
              {
                fileName: 'typeahead.component.ts',
                language: 'typescript',
                code: `import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-typeahead',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  template: \`
    <input [formControl]="queryCtrl" placeholder="Search products..." />
    <ul>
      @for (item of results(); track item) {
        <li>{{ item }}</li>
      }
    </ul>
  \`
})
export class TypeaheadComponent {
  private http = inject(HttpClient);
  queryCtrl = new FormControl('');

  results = toSignal(
    this.queryCtrl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      // switchMap CANCELS previous request — solves race condition
      switchMap(term => this.http.get<string[]>(\`/api/products?q=\${term}\`)),
      startWith([])
    ),
    { initialValue: [] as string[] }
  );
}`
              }
            ]
          }
        ]
      }
    ]
  },


  // Components & Core  
  {
    id: 'components-core',
    title: 'Components & Core',
    icon: 'bi-cpu',
    category: 'Core Concepts',
    versions: [

      // Fundamentals
      {
        version: 'fundamentals',
        label: 'Fundamentals',
        sections: [

          // Component Lifecycle Hooks
          {
            heading: 'Component Lifecycle Hooks',
            content: `
<p class="mb-3">Angular components undergo a strict lifecycle from creation to destruction. Implementing lifecycle interfaces allows you to execute code at specific chronological milestones.</p>
<ul>
  <li><strong>ngOnChanges:</strong> Executes every time an input property changes. Receives a <code>SimpleChanges</code> object containing previous and current values.</li>
  <li><strong>ngOnInit:</strong> Runs exactly once after the first <code>ngOnChanges</code>. This is the industry-standard location for fetching initial data or setting up state.</li>
  <li><strong>ngDoCheck:</strong> Hook for custom change detection. Runs on <em>every</em> change detection cycle—use with extreme caution to avoid performance bottlenecks.</li>
  <li><strong>ngAfterViewInit:</strong> Runs once the component's HTML template (and child views) are fully painted. Crucial for DOM manipulations or querying via <code>&#64;ViewChild</code>.</li>
  <li><strong>ngOnDestroy:</strong> The final cleanup phase before the component is wiped from memory. Always unsubscribe from Observables and detach event listeners here to prevent memory leaks.</li>
</ul>
            `,
            mermaidDefinition: `
  graph TD
    %% Chronological Lifecycle Flow
    Start(["Component Initialized"]) --> OnChanges["ngOnChanges"]
    OnChanges -->|"1. Inputs Bound"| OnInit["ngOnInit"]
    
    %% The Runtime Change Detection Loop Canvas
    OnInit --> DoCheck["ngDoCheck"]
    
    subgraph ContentPhase ["External Content Projection Layer"]
      ContentInit["ngAfterContentInit"] --> ContentChecked["ngAfterContentChecked"]
    end
    DoCheck -->|"2. Processes External Content"| ContentInit
    
    subgraph ViewPhase ["Internal View Rendering Layer"]
      ViewInit["ngAfterViewInit"] --> ViewChecked["ngAfterViewChecked"]
    end
    ContentChecked -->|"3. Processes Template DOM"| ViewInit
    
    %% Lifecycle State Decider Loop
    ViewChecked --> StateCheck{"Active State?"}
    StateCheck -->|"Component Mutated"| DoCheck
    StateCheck -->|"Component Unmounted"| Destroy["ngOnDestroy"]
    Destroy --> End(["Memory Cleaned & Freed"])

    %% Crucial Student Learning Context Pointers (Safely Quoted)
    OnInit -.-> O_Note["Use Case: Initial HTTP Data Fetching"]
    ViewInit -.-> V_Note["Use Case: Access Child DOM elements & Charts"]
    Destroy -.-> D_Note["Use Case: Unsubscribe Observables to prevent Memory Leaks"]

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    
    %% Core Strategic Milestones (Deep Contrast Layer)
    classDef coreMilestone fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    
    %% Elevated First-Time Setup Phase (Light Magenta Layer)
    classDef setupHook fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    %% Continuous Background Check System (De-emphasized Base Layer)
    classDef loopCheck fill:#f3f4f6,stroke:#cbd5e1,stroke-width:1px,color:#5f6368;
    
    %% Semantic Information Notes
    classDef contextNote fill:#f8fafc,stroke:#e2e8f0,stroke-dasharray: 4 4,color:#475569,font-size:12px;

    %% Class Attachments
    class OnInit,Destroy coreMilestone;
    class OnChanges,ContentInit,ViewInit setupHook;
    class DoCheck,ContentChecked,ViewChecked loopCheck;
    class O_Note,V_Note,D_Note contextNote;
`,
            codeFiles: [
              {
                fileName: 'user-profile.component.ts',
                language: 'typescript',
                code: `import { 
  Component, OnInit, OnDestroy, OnChanges, AfterViewInit,
  SimpleChanges, Input, ElementRef, ViewChild 
} from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  template: \`
    <div class="profile-card">
      <h3 #cardTitle>User: {{ name }}</h3>
      <p>Status: Active Monitoring</p>
    </div>
  \`,
  standalone: true
})
export class UserProfileComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  @Input() name = '';
  @ViewChild('cardTitle') titleRef!: ElementRef<HTMLHeadingElement>;
  
  private metricsSub!: Subscription;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['name']) {
      console.log('Input modified:', 
        changes['name'].previousValue, '→', changes['name'].currentValue
      );
    }
  }

  ngOnInit() {
    // 1. Safe place to initiate remote data loads or streams
    console.log('Component context active. Fetching initial data for:', this.name);
    this.metricsSub = interval(5000).subscribe(tick => {
      console.log('Background stream diagnostic check:', tick);
    });
  }

  ngAfterViewInit() {
    // 2. Safe place to interact with template DOM or child nodes
    console.log('Template rendering complete.');
    this.titleRef.nativeElement.style.color = '#c026d3';
  }

  ngOnDestroy() {
    // 3. Absolute teardown to completely destroy memory leaks
    console.log('Cleaning up system lifelines...');
    if (this.metricsSub) {
      this.metricsSub.unsubscribe();
    }
  }
}`
              }
            ]
          },

          // Content Projection (ng-content)
          {
            heading: 'Content Projection (ng-content)',
            content: `
<p class="mb-3">Content projection allows a component to act as a structural wrapper, accepting external HTML from a parent and rendering it into designated layout slots.</p>
<ul>
  <li><strong>Single-Slot Projection:</strong> Captures all provided unassigned markup and funnels it into a single default <code>&lt;ng-content&gt;&lt;/ng-content&gt;</code> tag.</li>
  <li><strong>Multi-Slot Projection:</strong> Uses the <code>select</code> attribute (e.g., <code>select="[card-header]"</code>) to route specific HTML elements into targeted placeholders.</li>
  <li><strong>Component TS Access:</strong> Because projected content originates externally, you must use <code>&#64;ContentChild</code> or <code>&#64;ContentChildren</code> (instead of ViewChild) if your TypeScript class needs to query or manipulate it.</li>
</ul>
            `,
            mermaidDefinition: `
  graph TD
    %% Main Incoming Stream
    Source(["External HTML Content"]) --> Engine{"Slot Selector"}
    
    %% Target Placeholders (Safely Quoted)
    Engine -->|"Default Catch-All"| Single["Single-Slot ng-content"]
    Engine -->|"CSS Selector Match"| Multi["Multi-Slot ng-content select='...'"]
    
    %% Programmatic Query Sink (Safely Quoted)
    Single --> Query["@ContentChild / @ContentChildren"]
    Multi --> Query

    %% Contextual Side Notes (Safely Quoted)
    Single -.-> S_Note["Projects all unselected tags into one zone"]
    Multi -.-> M_Note["Targets specific elements e.g., select='header'"]
    Query -.-> Q_Note["Allows Component TS Class to access and inspect the projected DOM"]

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    
    %% Core Strategy Layer (Deep Contrast)
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    
    %% Active Target Elements (Elevated Lightness)
    classDef primaryNode fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    %% Backstage Query Elements (Bottom Canvas)
    classDef backgroundTask fill:#f3f4f6,stroke:#cbd5e1,stroke-width:1px,color:#5f6368;
    
    %% Subdued Text Flags
    classDef contextNote fill:#f8fafc,stroke:#e2e8f0,stroke-dasharray: 4 4,color:#475569,font-size:12px;

    %% Class Matrix Links
    class Engine coreEngine;
    class Single,Multi primaryNode;
    class Query backgroundTask;
    class S_Note,M_Note,Q_Note contextNote;
`,
            codeFiles: [
              {
                fileName: 'card.component.ts',
                language: 'typescript',
                code: `import { Component, ContentChild, ElementRef, AfterContentInit } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: \`
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <ng-content select="[card-header]"></ng-content>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <div class="card-footer text-muted small">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  \`
})
export class CardComponent implements AfterContentInit {
  // Query custom projected nodes injected from the outer execution layer
  @ContentChild('projectedHeader') headerRef!: ElementRef<HTMLHeadingElement>;

  ngAfterContentInit() {
    if (this.headerRef) {
      console.log('Projected markup initialized successfully:', this.headerRef.nativeElement.innerText);
    }
  }
}`
              },
              {
                fileName: 'parent-usage.component.html',
                language: 'xml',
                code: `<app-card>
  <h5 card-header #projectedHeader>User Profile</h5>

  <p>Name: Aditya Pranav</p>
  <p>Role: Frontend Engineer</p>

  <span card-footer>Last updated: June 2026</span>
</app-card>`
              }
            ]
          },

          // Pipes & Data Transformation
          {
            heading: 'Pipes & Data Transformation',
            content: `
<p class="mb-3">Pipes are declarative data transformers used directly inside your template HTML. They accept an input, modify it, and return a formatted output, all without altering the original property in your component class.</p>
<ul>
  <li><strong>Pure Pipes (Default):</strong> Angular only re-runs a pure pipe when it detects a change to a primitive value (String, Number, Boolean) or a brand-new object reference. Output results are memoized (cached) for optimal performance.</li>
  <li><strong>Impure Pipes:</strong> These run during <em>every single change detection cycle</em>, regardless of whether inputs shifted. While necessary for real-time stateful operations (like the <code>AsyncPipe</code>), unoptimized computations here can trigger severe layout lags.</li>
</ul>
`,
            mermaidDefinition: `
  graph TD
    %% Input stream evaluating behavior
    RawData(["Template Expression Input"]) --> Engine{"Evaluation Engine"}
    
    %% Execution Paths
    Engine -->|"Input Value or Reference Shift"| Pure["Pure Pipe (Default)"]
    Engine -->|"Every Change Detection Tick"| Impure["Impure Pipe (pure: false)"]

    %% Core Deep-Dive Explanations
    Pure -.-> P_Detail["Memoized Execution: Returns cached result if inputs match"]
    Impure -.-> I_Detail["Continuous Execution: Evaluates constantly for real-time updates"]

    %% Visual Code Examples
    P_Ex["Built-ins: date · uppercase · json"] -.-> Pure
    I_Ex["Built-ins: async"] -.-> Impure

    %% UX Designer's Style Architecture Matching Brand Constraints
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    
    %% Core Decision Tier (Deep Contrast Layer)
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    
    %% Highly Efficient Branch (Elevated High Lightness Layer)
    classDef pureBranch fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    %% Continuous Background Evaluation (De-emphasized Base Layer)
    classDef impureBranch fill:#f3f4f6,stroke:#cbd5e1,stroke-width:1px,color:#5f6368;
    
    %% Context Flag Styling
    classDef contextNote fill:#f8fafc,stroke:#e2e8f0,stroke-dasharray: 4 4,color:#475569,font-size:12px;

    %% Class Matrix Links
    class Engine coreEngine;
    class Pure pureBranch;
    class Impure impureBranch;
    class P_Detail,I_Detail,P_Ex,I_Ex contextNote;
`,
            codeFiles: [
              {
                fileName: 'exponential-strength.pipe.ts',
                language: 'typescript',
                code: `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exponentialStrength',
  standalone: true,
  pure: true  // Default execution configuration (highly optimized memoization caching)
})
export class ExponentialStrengthPipe implements PipeTransform {
  transform(value: number, exponent = 1): number {
    console.log('Pure transformation executed (caches results if parameters remain identical)');
    return Math.pow(value, exponent);
  }
}`
              },
              {
                fileName: 'pipe-examples.component.html',
                language: 'xml',
                code: `<p>{{ 'hello world' | titlecase }}</p>         
<p>{{ 1234567.89 | currency:'INR':'symbol':'1.0-0' }}</p> 
<p>{{ today | date:'dd MMM yyyy' }}</p>       
<pre>{{ largeObj | json }}</pre>              

<p>Scale Factor: {{ 2 | exponentialStrength:10 }}</p>

<p>Live Broker Feed: {{ realTimeStockObs$ | async }}</p>`
              }
            ]
          },

          // ViewChild vs ViewChildren
          {
            heading: 'ViewChild vs ViewChildren',
            content: `
<p class="mb-3">View queries allow a component's TypeScript class to directly look inside its own rendered template to fetch references to HTML elements, child components, or directives.</p>
<ul>
  <li><strong>&#64;ViewChild:</strong> Looks for the <strong>first instance</strong> matching a selector. The reference is instantiated during rendering and becomes safely accessible during or after the <code>ngAfterViewInit</code> lifecycle hook.</li>
  <li><strong>&#64;ViewChildren:</strong> Gathers <strong>all matching instances</strong> across the template into a specialized <code>QueryList</code>. This is a real-time tracking wrapper that automatically updates if child structures are modified by <code>&#64;if</code> or <code>&#64;for</code> loops.</li>
</ul>
`,
            mermaidDefinition: `
  graph TD
    %% Target View Canvas Initialization
    DOM(["Component HTML View DOM"]) --> Engine{"View Query Engine"}
    
    %% View Query Selection Branches (Safely Quoted Symbols)
    Engine -->|"Finds FIRST Match Only"| VC["@ViewChild"]
    Engine -->|"Finds ALL Matches"| VCs["@ViewChildren"]

    %% Return Signature Tier
    VC --> Single["Returns Single Reference: ElementRef, Component, or Directive"]
    VCs --> Multi["Returns a Live 'QueryList' Collection"]

    %% Timing and State Context Flags (Dotted Connections)
    Single -.-> Lifecycle["CRITICAL TIMING: Reference becomes active during 'ngAfterViewInit'"]
    Multi -.-> Lifecycle
    Multi -.-> Dynamic["Live Sync: Automatically recalculates if elements toggle via @if or @for"]

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    
    %% Core Framework Engine (Deep Contrast Layer)
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    
    %% Active Target Queries (Elevated High Lightness Layer)
    classDef primaryNode fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    %% Result Objects (De-emphasized Base Layer)
    classDef targetResult fill:#f3f4f6,stroke:#cbd5e1,stroke-width:1px,color:#5f6368;
    
    %% Semantic Detail Flags
    classDef contextNote fill:#f8fafc,stroke:#e2e8f0,stroke-dasharray: 4 4,color:#475569,font-size:12px;

    %% Class Parameter Assignment Matrix
    class Engine coreEngine;
    class VC,VCs primaryNode;
    class Single,Multi targetResult;
    class Lifecycle,Dynamic contextNote;
`,
            codeFiles: [
              {
                fileName: 'list.component.ts',
                language: 'typescript',
                code: `import {
  Component, ViewChild, ViewChildren,
  ElementRef, QueryList, AfterViewInit
} from '@angular/core';

@Component({
  selector: 'app-list',
  standalone: true,
  template: \`
    <div class="search-box">
      <input #itemInput type="text" placeholder="Search product line..." />
    </div>

    <ul class="list-group">
      @for (x of items; track x) {
        <li #itemRow class="list-item">{{ x }}</li>
      }
    </ul>
  \`
})
export class ListComponent implements AfterViewInit {
  items = ['Apple', 'Banana', 'Cherry'];

  // Query the FIRST element matching the token string
  @ViewChild('itemInput') inputEl!: ElementRef<HTMLInputElement>;

  // Query ALL instances tracking the token sequence into a live QueryList
  @ViewChildren('itemRow') rowCollection!: QueryList<ElementRef<HTMLLIElement>>;

  ngAfterViewInit() {
    // Core timing guarantee: elements are fully drawn and accessible here
    this.inputEl.nativeElement.focus();
    console.log('Total dynamic tracking item rows found:', this.rowCollection.length); // 3

    // Hook reactive event streams to handle future runtime array adjustments
    this.rowCollection.changes.subscribe((updatedRows: QueryList<ElementRef>) => {
      console.log('DOM updated dynamically. Modernized structural tracking row count:', updatedRows.length);
    });
  }
}`
              }
            ]
          },

          // Templates, Data Binding & Directives
          {
            heading: 'Templates, Data Binding & Directives',
            content: `
<p class="mb-3">Angular templates merge standard HTML with specialized template markup to manage data flow between your TypeScript component class and the browser's view DOM.</p>
<ul>
  <li><strong>Interpolation:</strong> Renders dynamic string calculations directly onto the screen using double curly braces: <code>{{ expression }}</code>.</li>
  <li><strong>Property Binding:</strong> One-way data flow from your class to a DOM element property (e.g., <code>[disabled]="isDisabled"</code>). Always targets DOM properties rather than HTML attributes.</li>
  <li><strong>Attribute Binding:</strong> Used specifically when no matching DOM property exists, targeting the HTML attribute directly (e.g., <code>[attr.aria-label]="label"</code>).</li>
  <li><strong>Class & Style Binding:</strong> Programmatically updates element styles or custom design tokens on the fly (e.g., <code>[class.active]="isActive"</code>).</li>
  <li><strong>Event Binding:</strong> One-way reverse data flow that listens to user actions or custom triggers from the UI back into your logic handler (e.g., <code>(click)="onSave()"</code>).</li>
  <li><strong>Structural Control Flow:</strong> Modern directives (like <code>&#64;if</code> and <code>&#64;for</code>) conditionally generate or repeat layout nodes, reshaping the layout based on current state arrays.</li>
</ul>
`,
            mermaidDefinition: `
  graph TD
    %% Core Controller Gateway
    Class["TypeScript Component Class"] <==> Template{"Template Binding Engine"}
    
    %% Downward Data Flow Branches
    Template -->|"Class to DOM View"| Push["One-Way State Push"]
    Push --> Inter["Interpolation: {{ value }}"]
    Push --> Prop["Property / Style: [property]='state'"]
    Push --> Attr["Attribute Layer: [attr.name]='state'"]

    %% Upward Action Flow Branch (Fixed Syntax Here)
    Template -->|"DOM View to Class"| Pull["One-Way Action Pull"]
    Pull --> Event["Event Binding: (event)='handler()'"]

    %% Conditional Structural Flow Wrapper
    Template -->|"DOM Element Manipulation"| Structure["Structural Control Flow"]
    Structure --> Flow["Modern Directives: @if / @for Loops"]

    %% Contextual Detail Pointers (Attached via dotted lines)
    Inter -.-> D_String["Renders primitive string values into markup"]
    Prop -.-> D_Target["Targets the underlying DOM property object directly"]
    Event -.-> D_Action["Triggers logic methods based on browser or user events"]
    Flow -.-> D_DOM["Dynamically modifies structural DOM layout nodes"]

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    
    %% Core Flow Junction (Deep Contrast Layer)
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    
    %% Core Architectural Pathways (Elevated High Lightness Layer)
    classDef mainBranch fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    %% Specific Coding Syntax Blocks (De-emphasized Base Layer)
    classDef syntaxNode fill:#f3f4f6,stroke:#cbd5e1,stroke-width:1px,color:#5f6368;
    
    %% Semantic Summary Cards (Fixed stroke-dasharray space separation)
    classDef contextNote fill:#f8fafc,stroke:#e2e8f0,stroke-dasharray:4,color:#475569,font-size:12px;

    %% Class Parameter Assignment Matrix
    class Template coreEngine;
    class Push,Pull,Structure mainBranch;
    class Inter,Prop,Attr,Event,Flow syntaxNode;
    class D_String,D_Target,D_Action,D_DOM contextNote;
`,
            codeFiles: [
              {
                fileName: 'bindings.component.ts',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bindings-showcase',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './bindings.component.html'
})
export class BindingsShowcaseComponent {
  userName = 'Aditya Pranav';
  isLoading = false;
  avatarUrl = 'assets/avatar.png';
  colSpan = 2;
  dialogTitle = 'System Preferences';
  isSelected = true;
  hasError = false;
  isErrorState = true;
  searchQuery = '';
  isLoggedIn = true;
  items = [{ id: 1, name: 'Core Engine Pack' }, { id: 2, name: 'UI Canvas Shell' }];

  addToCart(item: any) { console.log('Item pushed to store matrix:', item); }
  search() { console.log('Executing workspace query lookup for:', this.searchQuery); }
  onBlur(event: FocusEvent) { console.log('Input focus context released.', event); }
}`
              },
              {
                fileName: 'bindings.component.html',
                language: 'xml',
                code: `<h2>Welcome back, {{ userName }}!</h2>

<button [disabled]="isLoading">Execute Commit</button>
<img [src]="avatarUrl" [alt]="userName + ' verification panel'" />

<td [attr.colspan]="colSpan">Horizontal Grid Merge</td>
<button [attr.aria-label]="'Close window panel: ' + dialogTitle">✕</button>

<div [class.active]="isSelected" [class.error-alert]="hasError">Status Badge Panel</div>
<p [style.color]="isErrorState ? '#dc2626' : '#16a34a'">Real-time warning text diagnostics</p>

<button (click)="addToCart(items[0])">Add Core Package</button>
<input (keyup.enter)="search()" (blur)="onBlur($event)" placeholder="Keypress handler..." />

<input [(ngModel)]="searchQuery" placeholder="Bi-directional model syncer..." />

@if (isLoggedIn) {
  <p>Secure identity token context confirmed: {{ userName }}</p>
} @else {
  <p>Public structural node block. Please establish verification protocol.</p>
}

<ul>
  @for (item of items; track item.id) {
    <li>Index ID: {{ item.id }} — Module Label: {{ item.name }}</li>
  }
</ul>`
              }
            ]
          },

          // Component Communication Patterns
          {
            heading: 'Component Communication Patterns',
            content: `
<p class="mb-3">Angular components share data and react to state changes using direct structural relationships or decoupled reactive dependency injection channels.</p>
<ul>
  <li><strong>Parent-to-Child (Downward):</strong> The parent element pushes data down by binding properties to the child. Supported via traditional <code>&#64;Input()</code> property decorators or modern read-only <code>input()</code> Signals.</li>
  <li><strong>Child-to-Parent (Upward):</strong> The child component signals actions upward by emitting events that the parent listens to. Triggered via traditional <code>&#64;Output() EventEmitter</code> streams or modern <code>output()</code> macro initializers.</li>
  <li><strong>Cross-Cutting / Sibling (Global):</strong> Unrelated or distant components communicate by injecting a shared singleton <code>&#64;Injectable()</code> data service. This service encapsulates a reactive broker—typically an RxJS <code>BehaviorSubject</code> or a shared <code>writable()</code> Signal.</li>
</ul>
`,
            mermaidDefinition: `
  graph TD
    %% Core Strategy Hub
    Hub{"Communication Topology"}
    
    %% Direct Relationship Layer (Elevated Lightness)
    Hub -->|"Direct Hierarchy"| Direct["Parent-Child Line"]
    Direct -->|"Downward Data Push"| In["@Input() / input() Signal"]
    Direct -->|"Upward Event Stream"| Out["@Output() / output() Emits"]
    
    %% Decoupled Service Layer (Bottom Canvas)
    Hub -->|"Decoupled Architecture"| Service["Shared Service Layer"]
    Service -->|"Shared Observable Stream"| BS["BehaviorSubject State"]
    Service -->|"Shared Reactive Variable"| Sig["Shared Writable Signal"]

    %% Informational Side-Flags (Dotted Connections)
    In -.-> In_Note["Parent binds property directly onto child markup"]
    Out -.-> Out_Note["Child broadcasts native or custom event payloads"]
    BS -.-> S_Note["Decouples components: Ideal for sibling or distant tree nodes"]
    Sig -.-> S_Note

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    
    %% Core Gateway Node (Deep Contrast Layer)
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    
    %% Primary Tree Communication (Elevated High Lightness Layer)
    classDef primaryNode fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    %% Background State Management (De-emphasized Base Canvas Layer)
    classDef backgroundTask fill:#f3f4f6,stroke:#cbd5e1,stroke-width:1px,color:#5f6368;
    
    %% Semantic Context Notes
    classDef contextNote fill:#f8fafc,stroke:#e2e8f0,stroke-dasharray: 4 4,color:#475569,font-size:12px;

    %% Class Parameter Assignment Matrix
    class Hub coreEngine;
    class Direct,In,Out primaryNode;
    class Service,BS,Sig backgroundTask;
    class In_Note,Out_Note,S_Note contextNote;
`,
            codeFiles: [
              {
                fileName: 'component-communication.ts',
                language: 'typescript',
                code: `import { Component, Input, Output, EventEmitter, Injectable, signal } from '@angular/core';

// ── 1. GLOBAL / DECOUPLED STATE LINK (Shared Service Channel) ──────────
@Injectable({ providedIn: 'root' })
export class SystemCartService {
  // Encapsulates reactive state management out of components
  private internalCount = signal<number>(0);
  public publicCount = this.internalCount.asReadonly();

  incrementCounter() {
    this.internalCount.update(current => current + 1);
  }
}

// ── 2. DOWNWARD STRATEGY PIPELINE (Parent-to-Child View Node) ─────────
@Component({ 
  selector: 'app-badge-display', 
  standalone: true,
  template: \`
    <div class="badge-shell">
      <span class="label">{{ labelText }}</span>
      <span class="counter-bubble">Active Stack: {{ itemQuantity }}</span>
    </div>
  \`
})
export class BadgeDisplayComponent {
  @Input() labelText = 'Default Inventory';
  @Input() itemQuantity = 0;
}
// Parent Usage: <app-badge-display [labelText]="'Active Orders'" [itemQuantity]="totalOrders" />

// ── 3. UPWARD ACTION STREAMING PIPELINE (Child-to-Parent Emitter) ──────
@Component({ 
  selector: 'app-action-trigger', 
  standalone: true,
  template: \`<button class="btn-action" (click)="notifyParent()">Submit Node Update</button>\`
})
export class ActionTriggerComponent {
  @Output() orderCommitted = new EventEmitter<string>();

  notifyParent() {
    const trackingToken = 'TX_TOKEN_' + Math.floor(Math.random() * 100000);
    this.orderCommitted.emit(trackingToken); // Stream data packet directly to parent listener
  }
}
// Parent Usage: <app-action-trigger (orderCommitted)="onOrderProcessing($event)" />`
              }
            ]
          },
        ]
      },


      // Angular 16 & 17
      {
        version: '16_v17',
        label: 'Angular 16 & 17',
        sections: [

          // Standalone Components Integration
          {
            heading: 'Standalone Components Integration',
            content: `<p>In Angular 16, Standalone Components became the default and recommended way to build applications, removing the necessity of <code>NgModules</code>.</p><ul><li>Standalone components, directives, and pipes specify their dependencies directly using the <code>imports</code> array.</li><li>Simplifies the mental model, scaffolds lighter builds, and makes components directly reusable.</li><li>Applications are bootstrapped using <code>bootstrapApplication(RootComponent, config)</code> instead of module bootstrapping.</li></ul>`,
            mermaidDefinition: `
  graph TD
    %% Invisible link forces subgraphs to stack vertically for readability
    Legacy ~~~ Modern

    subgraph Legacy ["Traditional Architecture (Legacy)"]
      direction LR
      L1["main.ts"] --> L2["bootstrapModule()"]
      L2 --> L3["AppModule"]
      L3 --> L4["Declarations <br/>& Imports"]
    end

    subgraph Modern ["Standalone Architecture (Angular 16+)"]
      direction LR
      M1["main.ts"] --> M2["bootstrapApplication()"]
      M2 --> M3["AppComponent <br/>(Standalone)"]
      M3 --> M4["Direct Imports <br/>Array"]
    end

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    
    %% Legacy Pathway (Faded / De-emphasized)
    classDef legacy fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#64748b,stroke-dasharray:4;
    
    %% Modern Core Architectural Pathways (Elevated High Lightness Layer)
    classDef modern fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    %% Core Component Node (Deep Contrast Layer)
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;

    %% Class Assignments
    class L1,L2,L3,L4 legacy;
    class M1,M2,M4 modern;
    class M3 coreEngine;

    %% Subgraph specific styling
    style Legacy fill:#f1f5f9,stroke:#e2e8f0,stroke-dasharray:4;
    style Modern fill:#faf5ff,stroke:#e879f9,stroke-width:2px;
`,
            codeFiles: [
              {
                fileName: 'dashboard.component.ts',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';

// ── Standalone component — no NgModule needed ─────────────
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent],  // declare deps here
  template: \`
    <div class="container">
      <app-card title="Analytics">
        <p>Dynamic Content</p>
      </app-card>
    </div>
  \`
})
export class DashboardComponent {}`
              },
              {
                fileName: 'main.ts',
                language: 'typescript',
                code: `import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// ── main.ts — bootstrapping without AppModule ─────────────
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
}).catch(err => console.error(err));`
              }
            ]
          },

          // New Built-in Control Flow (@if, @for, @switch)
          {
            heading: 'New Built-in Control Flow (@if, @for, @switch)',
            content: `<p>Angular 17 introduced a new built-in block syntax for control flow. It replaces the structural directives <code>*ngIf</code>, <code>*ngFor</code>, and <code>*ngSwitch</code>.</p><ul><li><strong>Performance:</strong> Built directly into the compiler, reducing execution overhead and boosting rendering speed by up to 90% in complex loops.</li><li><strong>Zero Imports:</strong> No need to import <code>CommonModule</code> or <code>NgIf</code>/<code>NgFor</code> into standalone components.</li><li><strong>@empty support:</strong> Built-in block in <code>@for</code> loops that renders placeholder content when the array is empty.</li><li><strong>Strict Tracking:</strong> The <code>track</code> expression is now required in <code>@for</code> loops, preventing performance bugs from omitting <code>trackBy</code>.</li></ul>`,
            mermaidDefinition: `
  graph TD
    %% Main Entry
    Engine["Angular 17+ Control Flow Engine"] --> Comparison{Syntax Comparison}

    %% Logic Branches
    Comparison --> Legacy["Legacy Structural Directives"]
    Comparison --> Modern["Built-in @Block Syntax"]

    %% Legacy Details
    Legacy --> L1["*ngIf / *ngFor"]
    L1 --> L2["Requires CommonModule Import"]
    L2 --> L3["Slower: Directive Execution"]

    %% Modern Details
    Modern --> M1["@if / @for / @switch"]
    M1 --> M2["Zero Imports Required"]
    M2 --> M3["Faster: Compiler Integrated"]
    
    %% Specific Features
    Modern --> Feat["@for Features"]
    Feat --> Track["Required: track expression"]
    Feat --> Empty["@empty block support"]

    %% Styling
    classDef legacy fill:#fef2f2,stroke:#ef4444,stroke-width:1px,color:#991b1b;
    classDef modern fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534;
    classDef engine fill:#f5f3ff,stroke:#7c3aed,stroke-width:2px;

    class Legacy,L1,L2,L3 legacy;
    class Modern,M1,M2,M3,Feat,Track,Empty modern;
    class Engine engine;
`,
            codeFiles: [
              {
                fileName: 'control-flow.component.html',
                language: 'xml',
                code: `@if (isLoggedIn) {
  <p>Welcome back, {{ user.name }}!</p>
} @else if (isPending) {
  <p>Account verification pending...</p>
} @else {
  <button (click)="login()">Log In</button>
}

@for (item of cartItems; track item.id) {
  <div class="cart-item">
    <span>{{ item.name }}</span>
    <strong>₹{{ item.price }}</strong>
  </div>
} @empty {
  <p class="text-muted">Your cart is empty. Add some items!</p>
}

@switch (userRole) {
  @case ('admin') {
    <admin-panel />
  }
  @case ('editor') {
    <editor-panel />
  }
  @default {
    <viewer-panel />
  }
}`
              }
            ]
          },

          // Lifecycle Optimization: afterRender and afterNextRender
          {
            heading: 'Lifecycle Optimization: afterRender and afterNextRender',
            content: `<p>Angular 17 introduced two new lifecycle hooks for executing operations safely in browser environments, particularly helpful when using Server-Side Rendering (SSR):</p><ul><li><strong>afterRender:</strong> Runs after every change detection cycle has finished rendering the page. Useful for DOM manipulation or measuring elements.</li><li><strong>afterNextRender:</strong> Runs exactly once after the next rendering cycle completes. Best for initializing third-party libraries that need access to the browser DOM.</li></ul>`,
            mermaidDefinition: `
  graph TD
    CD["Change Detection Cycle Finishes"] --> Env{"Is Environment Browser?"}
    
    %% SSR Route
    Env -->|No: Node.js / SSR Server| SSR["Skip Hooks Safely <br/> (Prevents DOM 'undefined' errors)"]
    
    %% Browser Route
    Env -->|Yes: Client Browser| DOM["Render Layout & Paint DOM"]
    
    %% Split Hooks
    DOM --> HookNext["afterNextRender()"]
    DOM --> HookEvery["afterRender()"]
    
    %% Hook Descriptions
    HookNext --> NextDesc["Fires ONCE after next cycle <br/> <b>Best for:</b> 3rd-party library setup <br/> (e.g., Chart.js initialization)"]
    HookEvery --> EveryDesc["Fires EVERY change cycle <br/> <b>Best for:</b> Active DOM tracking <br/> (e.g., measuring canvas resize)"]

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef core fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    classDef ssr fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#64748b,stroke-dasharray:4;
    classDef hook fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef detail fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;

    %% Class Assignments
    class CD,Env,DOM core;
    class SSR ssr;
    class HookNext,HookEvery hook;
    class NextDesc,EveryDesc detail;
`,
            codeFiles: [
              {
                fileName: 'chart.component.ts',
                language: 'typescript',
                code: `import { Component, ElementRef, viewChild, afterNextRender, afterRender } from '@angular/core';

@Component({
  selector: 'app-chart',
  standalone: true,
  template: \`<canvas #chartCanvas width="400" height="200"></canvas>\`
})
export class ChartComponent {
  // Signal-based ViewChild (Angular 17+)
  canvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  constructor() {
    // ── afterNextRender: fires ONCE after first render ─────
    // Perfect for initializing 3rd-party libs (Chart.js, etc.)
    // Safe in SSR — only runs in the browser
    afterNextRender(() => {
      const ctx = this.canvas()?.nativeElement.getContext('2d');
      if (ctx) {
        this.initChart(ctx);
        console.log('Chart initialized (runs once).');
      }
    });

    // ── afterRender: fires after EVERY render cycle ────────
    // Use for continuous DOM manipulation (e.g. resize)
    afterRender(() => {
      const width = this.canvas()?.nativeElement.offsetWidth;
      console.log('Canvas width after render:', width);
    });
  }

  private initChart(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#6200ea';
    ctx.fillRect(0, 0, 100, 100);
  }
}`
              }
            ]
          },

          // Signal-based Inputs and Outputs
          {
            heading: 'Signal-based Inputs and Outputs',
            content: `<p>Angular 17 introduced signal-based component communication, making inputs and outputs fully reactive primitives.</p><ul><li><strong>Signal Inputs:</strong> Declared via <code>input()</code> or <code>input.required()</code>. They return a read-only Signal.</li><li><strong>Signal Outputs:</strong> Declared via <code>output()</code> or <code>outputFromObservable()</code>. Serves as a streamlined replacement for <code>@Output() EventEmitter</code>.</li></ul>`,
            mermaidDefinition: `
  graph TD
    %% Invisible link forces vertical stacking to prevent width squishing
    Legacy ~~~ Modern

    subgraph Legacy ["Legacy API (Decorators)"]
      direction LR
      P_Leg["Parent Component"] -->|"[property]"| In_Leg["@Input()"]
      Out_Leg["@Output() <br/> EventEmitter"] -->|"(event)"| P_Leg
    end

    subgraph Modern ["Signal-based API (Angular 17+)"]
      direction LR
      P_Mod["Parent Component"] -->|"[property]"| In_Mod["input() / input.required() <br/> (Read-only Signal)"]
      
      %% Reactive chain based on the computed() example
      In_Mod -.->|"Reactive <br/> Dependency"| Comp_Mod["computed() <br/> (Derived State)"]
      
      Out_Mod["output() <br/> (Streamlined Emit)"] -->|"(event)"| P_Mod
    end

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    
    %% Legacy Pathway (Faded / De-emphasized)
    classDef legacy fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#64748b,stroke-dasharray:4;
    
    %% Modern Container/Parent
    classDef modern fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    %% Core Signal Primitives (Deep Contrast Layer)
    classDef signalCore fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    
    %% Computed/Derived (Reactive styling)
    classDef reactive fill:#faf5ff,stroke:#8b5cf6,stroke-width:2px,color:#202124,stroke-dasharray:4;

    %% Class Assignments
    class P_Leg,In_Leg,Out_Leg legacy;
    class P_Mod modern;
    class In_Mod,Out_Mod signalCore;
    class Comp_Mod reactive;

    %% Subgraph specific styling
    style Legacy fill:#f1f5f9,stroke:#e2e8f0,stroke-dasharray:4;
    style Modern fill:#faf5ff,stroke:#e879f9,stroke-width:2px;
`,
            codeFiles: [
              {
                fileName: 'product-card.component.ts',
                language: 'typescript',
                code: `import { Component, input, output, computed } from '@angular/core';

// ── Child Component ───────────────────────────────────────
@Component({
  selector: 'app-product-card',
  standalone: true,
  template: \`
    <div class="card p-3">
      <h5>{{ title() }}</h5>
      <p class="text-muted">{{ subtitle() }}</p>
      <button (click)="buy()">Buy Now</button>
    </div>
  \`
})
export class ProductCardComponent {
  // Signal inputs — read as getter functions: title()
  title   = input.required<string>();      // required — no default
  price   = input<number>(0);              // optional with default
  category = input<string>('General');

  // Derived computed value from multiple inputs
  subtitle = computed(() => \`\${this.category()} · ₹\${this.price()}\`);

  // Signal output — replaces @Output() EventEmitter<string>
  purchased = output<string>();

  buy() {
    this.purchased.emit(this.title()); // emit product name
  }
}`
              },
              {
                fileName: 'parent-usage.component.html',
                language: 'xml',
                code: `<app-product-card
  title="Laptop Pro"
  [price]="79999"
  category="Electronics"
  (purchased)="onPurchase($event)" />`
              }
            ]
          }
        ]
      },


      // Angular 18 & 19
      {
        version: 'v18_v19',
        label: 'Angular 18 & 19',
        sections: [

          // Local Template Variables (@let)
          {
            heading: 'Local Template Variables (@let)',
            content: `<p>Angular 18 introduced the <code>@let</code> declaration syntax directly inside component templates, revolutionizing how local view state is managed.</p><ul><li><strong>Eliminates Stream Duplication:</strong> Solves the classic limitation where developers had to use heavy structural directives (like <code>*ngIf="..." as user</code>) just to capture an async value.</li><li><strong>Local Scope Block:</strong> Variables are scoped to the current template block and its children, preventing state bleeding.</li><li><strong>Strict Type Inference:</strong> Fully compatible with the Angular Language Service, giving students real-time IDE type checking and auto-completion.</li></ul>`,
            mermaidDefinition: `
  graph TD
    %% Invisible link forces vertical stacking to prevent width squishing
    Legacy ~~~ Modern

    subgraph Legacy ["Legacy State Capture (Pre-v18)"]
      direction LR
      L1["Observable Stream"] --> L2["Forced Nesting: <br/> *ngIf='stream$ | async as user'"]
      L2 --> L3["Deep HTML Indentation <br/> to maintain variable scope"]
      L3 --> L4["Duplicate async pipes <br/> if used outside structural block"]
    end

    subgraph Modern ["Modern Template Variables (Angular 18+)"]
      direction LR
      M1["Observable Stream"] --> M2["@let user = userProfile$ | async;"]
      M2 --> M3["Derived States: <br/> @let fullName = ... <br/> @let isAdmin = ..."]
      M3 --> M4["Flat template layout <br/> with active type-inference"]
    end

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    
    %% Legacy Pathway (Faded / De-emphasized)
    classDef legacy fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#64748b,stroke-dasharray:4;
    
    %% Modern Container/Parent
    classDef modern fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    %% Core Feature Primitives (Deep Contrast Layer)
    classDef featureCore fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    
    %% Success/Automated routing
    classDef auto fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534;

    %% Class Assignments
    class L1,L2,L3,L4 legacy;
    class M1 modern;
    class M2 featureCore;
    class M3,M4 auto;

    %% Subgraph specific styling
    style Legacy fill:#f1f5f9,stroke:#e2e8f0,stroke-dasharray:4;
    style Modern fill:#faf5ff,stroke:#e879f9,stroke-width:2px;
`,

            codeFiles: [
              {
                fileName: 'legacy-approach.component.html',
                language: 'xml',
                code: `<div *ngIf="(userProfile$ | async) as user">
  <h3>{{ user.firstName }}</h3>
  <p>{{ user.email }}</p>
</div>`
              },
              {
                fileName: 'modern-let.component.html',
                language: 'xml',
                code: `@let user = userProfile$ | async;
@let fullName = user ? user.firstName + ' ' + user.lastName : 'Guest';
@let isAdmin = user?.role === 'admin';

<div class="profile-card">
  <h3>{{ fullName }}</h3>
  <p class="text-muted">{{ user?.email }}</p>

  @if (isAdmin) {
    <span class="badge bg-danger">Administrator</span>
  }

  @if (user) {
    <button (click)="logout()">Logout, {{ user.firstName }}</button>
  } @else {
    <button (click)="login()">Login</button>
  }
</div>`
              }
            ]
          },

          // Fallback Content for Content Projection
          {
            heading: 'Fallback Content for Content Projection',
            content: `<p>Angular 18 added native fallback capabilities directly to the <code>&lt;ng-content&gt;</code> tag, removing complex workaround logic for empty states.</p><ul><li><strong>Zero Component Logic:</strong> No need to write component-level conditional checks (like <code>@if</code> with ElementRef queries) to verify if a parent provided projection data.</li><li><strong>Native Slots:</strong> Standard HTML and child components placed inside <code>&lt;ng-content&gt;</code> act automatically as default placeholders.</li><li><strong>Multi-Slot Support:</strong> Operates perfectly across both default slots and targeted attribute selectors (e.g., <code>select="[dialog-title]"</code>).</li></ul>`,
            mermaidDefinition: `
  graph TD
    %% Invisible link forces vertical stacking to prevent width squishing
    Legacy ~~~ Modern

    subgraph Legacy ["Legacy Workaround (Pre-v18)"]
      direction LR
      L1["Parent Component"] --> L2["@ContentChild() <br/> or ElementRef queries"]
      L2 --> L3["Manual TS Logic: <br/> check if content exists"]
      L3 --> L4["@if (hasContent) { &lt;ng-content&gt; } <br/> @else { Fallback UI }"]
    end

    subgraph Modern ["Native Fallback API (Angular 18+)"]
      direction LR
      M1["Parent Component"] --> M2["&lt;ng-content select='[dialog-title]'&gt; <br/> &lt;h5&gt;Default Header&lt;/h5&gt; <br/> &lt;/ng-content&gt;"]
      
      M2 -->|Slot is Empty| M3["Auto-render Fallback <br/> (Zero TS Logic required)"]
      M2 -->|Content Provided| M4["Render Parent Content <br/> (Overrides inner HTML)"]
    end

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    
    %% Legacy Pathway (Faded / De-emphasized)
    classDef legacy fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#64748b,stroke-dasharray:4;
    
    %% Modern Container/Parent
    classDef modern fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    %% Core Feature Primitives (Deep Contrast Layer)
    classDef featureCore fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    
    %% Success/Automated routing
    classDef auto fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534;

    %% Class Assignments
    class L1,L2,L3,L4 legacy;
    class M1 modern;
    class M2 featureCore;
    class M3,M4 auto;

    %% Subgraph specific styling
    style Legacy fill:#f1f5f9,stroke:#e2e8f0,stroke-dasharray:4;
    style Modern fill:#faf5ff,stroke:#e879f9,stroke-width:2px;
`,
            codeFiles: [
              {
                fileName: 'dialog.component.html',
                language: 'xml',
                code: `<div class="modal-dialog">
  <div class="modal-header">
    <ng-content select="[dialog-title]">
      <h5 class="modal-title">Default Dialog Header</h5>
    </ng-content>
  </div>

  <div class="modal-body">
    <ng-content></ng-content>
  </div>

  <div class="modal-footer">
    <ng-content select="[dialog-actions]">
      <button class="btn btn-secondary" (click)="close()">Close</button>
    </ng-content>
  </div>
</div>`
              },
              {
                fileName: 'dialog-usages.component.html',
                language: 'xml',
                code: `<app-dialog>
  <h5 dialog-title>Confirm Deletion</h5>
  <p>Are you sure you want to delete this record?</p>
  <div dialog-actions>
    <button class="btn btn-danger">Delete</button>
    <button class="btn btn-secondary">Cancel</button>
  </div>
</app-dialog>

<app-dialog>
  <p>Loading your profile... (Header and Footer fallbacks will render here)</p>
</app-dialog>`
              }
            ]
          },

          // View Transitions API Integration
          {
            heading: 'View Transitions API Integration',
            content: `<p>Angular natively integrates with the browser's native <strong>View Transitions API</strong>, offering smooth, hardware-accelerated animated transitions during router navigation.</p><ul><li><strong>Native Hooking:</strong> Enabled globally in your routing setup via the <code>withViewTransitions()</code> feature provider.</li><li><strong>Automatic State Capturing:</strong> The framework automatically orchestrates taking DOM screenshots before and after navigation transitions occur.</li><li><strong>CSS Pseudo-Element Customization:</strong> Allows students to hook straight into CSS standard animations via the pseudo-elements <code>::view-transition-old()</code> and <code>::view-transition-new()</code>.</li></ul>`,
            mermaidDefinition: `
  graph TD
    %% Invisible link forces vertical stacking to prevent width squishing
    Legacy ~~~ Modern

    subgraph Legacy ["Standard Routing (Pre-v17 / Default)"]
      direction LR
      L1["Router Navigation"] --> L2["Destroy Old Component"]
      L2 --> L3["Render New Component"]
      L3 --> L4["Abrupt visual flash <br/> (Requires manual @angular/animations)"]
    end

    subgraph Modern ["Native View Transitions API (Angular 18+)"]
      direction LR
      M1["Router Navigation"] --> M2["withViewTransitions() <br/> intercepts routing"]
      
      M2 --> M3["1. Snapshot Old DOM <br/> (::view-transition-old)"]
      M3 --> M4["2. Render New DOM <br/> (::view-transition-new)"]
      M4 --> M5["3. Hardware-Accelerated <br/> CSS Animation"]
    end

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    
    %% Legacy Pathway (Faded / De-emphasized)
    classDef legacy fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#64748b,stroke-dasharray:4;
    
    %% Modern Container/Parent
    classDef modern fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    %% Core Feature Primitives (Deep Contrast Layer)
    classDef featureCore fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    
    %% Browser native / CSS layer
    classDef cssLayer fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;
    
    %% Success/Automated routing
    classDef auto fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534;

    %% Class Assignments
    class L1,L2,L3,L4 legacy;
    class M1 modern;
    class M2 featureCore;
    class M3,M4 cssLayer;
    class M5 auto;

    %% Subgraph specific styling
    style Legacy fill:#f1f5f9,stroke:#e2e8f0,stroke-dasharray:4;
    style Modern fill:#faf5ff,stroke:#e879f9,stroke-width:2px;
`,

            codeFiles: [
              {
                fileName: 'app.config.ts',
                language: 'typescript',
                code: `import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
// ── app.config.ts — Native View Transitions Setup ───────────────
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withViewTransitions({
        // Optional configuration: avoids rendering flashes during full layout paint
        skipInitialTransition: true
      })
    )
  ]
};`
              },

              {
                fileName: 'styles.scss',
                language: 'css',
                code: `/* ── styles.scss — Custom CSS Transition Targets ────────────────── */

/* Target the outgoing screen snapshot */
::view-transition-old(root) {
  animation: 200ms ease-in fade-out;
}

/* Target the incoming screen layout */
::view-transition-new(root) {
  animation: 300ms ease-out slide-in-from-right;
}

@keyframes fade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}

@keyframes slide-in-from-right {
  from { transform: translateX(40px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}`
              }
            ]
          },
        ]
      },


      // Scenario Prep
      {
        version: 'scenario_prep',
        label: 'Scenario Prep',
        sections: [

          // Race Condition Mitigation (Typeahead Search)
          {
            heading: 'Race Condition Mitigation (Typeahead Search)',
            content: `<p class="mb-3">A classic production bug occurs when asynchronous network responses arrive out of order, overriding the UI with stale data. Resolving this requires understanding RxJS flattening operators within user-driven streams.</p><ul><li><strong>The Vulnerability:</strong> Using <code>mergeMap</code> or <code>switchMap</code> incorrectly can result in a slow network request from a previous keystroke resolving *after* a faster, newer request, corrupting the results.</li><li><strong>The Remedy (switchMap):</strong> <code>switchMap</code> acts as an execution broker—the moment a new emission arrives from the source stream, it immediately cancels (unsubscribes from) the previous active inner observable search request.</li><li><strong>Stream Resiliency:</strong> Always catch errors *inside* the inner observable stream. Catching errors on the outer stream will cause the entire user search input listener to break permanently upon the first API failure.</li></ul>`,
            mermaidDefinition: `
  graph TD
    %% Main Pipeline Flow
    Input["User Input Stream <br/> (valueChanges)"] --> Pipe1["debounceTime(300) <br/> (Pauses for keystroke bursts)"]
    Pipe1 --> Pipe2["distinctUntilChanged() <br/> (Ignores identical queries)"]
    
    %% The core switchMap broker
    Pipe2 --> Broker["switchMap( ... ) Broker <br/> ⚡ Auto-cancels previous pending requests"]
    
    %% Inner Observable execution
    subgraph Inner ["Inner Network Request (Isolated Scope)"]
      direction TB
      HTTP["http.get( ... )"] -.->|If API Fails| Catch["catchError() <br/> Traps error & returns of([ ])"]
      Catch --> Safe["🛡️ Prevents Outer Stream Death"]
    end

    Broker --> HTTP
    HTTP -->|If API Succeeds| UI["Update results$ in UI"]
    Safe --> UI

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    
    %% Standard stream pathway
    classDef stream fill:#f8fafc,stroke:#cbd5e1,stroke-width:2px,color:#0f172a;
    
    %% Core Operator (Deep Contrast Layer)
    classDef broker fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    
    %% Network operations
    classDef network fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;
    
    %% Resiliency / Safety mechanisms
    classDef shield fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534,font-weight:bold;

    %% Assign classes
    class Input,Pipe1,Pipe2 stream;
    class Broker broker;
    class HTTP network;
    class Catch,Safe shield;
    class UI default;
    
    %% Subgraph specific styling
    style Inner fill:#faf5ff,stroke:#e879f9,stroke-width:2px,stroke-dasharray:4;
`,
            codeFiles: [
              {
                fileName: 'search-broker.component.ts',
                language: 'typescript',
                code: `import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AsyncModule } from '@angular/common';

@Component({
  selector: 'app-search-broker',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncModule],
  template: \`
    <div class="search-container">
      <input [formControl]="searchQuery" type="text" placeholder="Search secure engine ledger..." />
      
      @if (results$ | async; as productList) {
        <ul class="results-grid">
          @for (item of productList; track item.id) {
            <li>{{ item.name }} — ₹{{ item.price }}</li>
          } @empty {
            <li class="no-results">No active matching nodes found.</li>
          }
        </ul>
      }
    </div>
  \`
})
export class SearchBrokerComponent implements OnInit {
  searchQuery = new FormControl('');
  results$!: Observable<any[]>;
  isLoading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.results$ = this.searchQuery.valueChanges.pipe(
      debounceTime(300),          // 1. Wait out keypress bursts to minimize server pressure
      distinctUntilChanged(),     // 2. Suppress duplicate values if navigation modifiers were hit
      tap(() => this.isLoading = true),
      switchMap(query => {
        if (!query?.trim()) {
          this.isLoading = false;
          return of([]);          // Short-circuit empty strings cleanly
        }
        
        // 3. switchMap cancels this request automatically if the user types a new letter
        return this.http.get<any[]>(\`https://api.ledger.internal/search?q=\${query}\`).pipe(
          tap(() => this.isLoading = false),
          catchError(error => {
            console.error('Inner network frame caught exception cleanly:', error);
            this.isLoading = false;
            return of([]);        // ✅ CRITICAL: Returning an empty array keeps the parent stream alive!
          })
        );
      })
    );
  }
}`
              }
            ]
          },

          // Performance Optimization with OnPush & Signals
          {
            heading: 'Performance Optimization with OnPush & Signals',
            content: `<p class="mb-3">By default, Angular runs change detection across the entire component tree whenever an event fires. For heavy enterprise dashboards, this causes significant UI lag.</p><ul><li><strong>ChangeDetectionStrategy.OnPush:</strong> Instructs the rendering engine to completely skip checking this component unless its <code>@Input()</code> reference alters, an event directly originates inside it, or an observable stream explicitly fires via the <code>AsyncPipe</code>.</li><li><strong>Signals as Fine-Grained Trackers:</strong> Modern Angular Signals provide explicit micro-updates. They inform the framework precisely *where* a value is used in the DOM, allowing parts of the template to re-render without executing macro-level zone evaluations.</li></ul>`,
            mermaidDefinition: `
  graph TD
    %% Invisible link forces vertical stacking to prevent width squishing
    Legacy ~~~ Modern

    subgraph Legacy ["Default Change Detection (Zone.js)"]
      direction LR
      L1["Any Event Fires <br/> (Click, HTTP, Timer)"] --> L2["Framework traverses & dirty-checks <br/> ENTIRE Component Tree"]
      L2 --> L3["Macro-level DOM re-renders <br/> ⚠️ Causes UI Lag at scale"]
    end

    subgraph Modern ["Optimized: OnPush + Signals"]
      direction LR
      M1["signal.set(value)"] --> M2["🛡️ OnPush Strategy blocks <br/> top-down tree traversal"]
      M2 --> M3["Fine-Grained Tracking: <br/> Framework knows exact UI target"]
      M3 --> M4["Surgical Micro-Update <br/> ⚡ Zero wasted rendering"]
    end

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    
    %% Legacy Pathway (Faded / De-emphasized / Warning)
    classDef legacy fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#64748b,stroke-dasharray:4;
    classDef lag fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337;
    
    %% Modern Container/Parent
    classDef modern fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    %% Core Feature Primitives (Deep Contrast Layer)
    classDef featureCore fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    
    %% Shields / Protections
    classDef shield fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534,font-weight:bold;
    
    %% Success/Automated routing
    classDef auto fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a,font-weight:bold;

    %% Class Assignments
    class L1,L2 legacy;
    class L3 lag;
    class M1 featureCore;
    class M2 shield;
    class M3 default;
    class M4 auto;

    %% Subgraph specific styling
    style Legacy fill:#f1f5f9,stroke:#e2e8f0,stroke-dasharray:4;
    style Modern fill:#faf5ff,stroke:#e879f9,stroke-width:2px;
`,
            codeFiles: [
              {
                fileName: 'high-frequency-dashboard.component.ts',
                language: 'typescript',
                code: `import { Component, ChangeDetectionStrategy, signal, computed, Input } from '@angular/core';

@Component({
  selector: 'app-high-freq-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // 1. Deactivates aggressive continuous checking
  template: \`
    <div class="metrics-panel">
      <h3>Data Frame Cluster: {{ nodeClusterId }}</h3>
      
      <div class="stat-row">
        <span>Raw Feed Input:</span>
        <strong>{{ activeMetric() }} data/sec</strong>
      </div>

      <div class="stat-row highlight">
        <span>Computed Processing Load Factor:</span>
        <strong>{{ processedLoadFactor() }}%</strong>
      </div>

      <button (click)="simulateDataSpike()">Trigger Simulated Telemetry Spike</button>
    </div>
  \`
})
export class HighFrequencyDashboardComponent {
  @Input() nodeClusterId = 'CLUSTER_X_90';

  // 2. Signals serve as localized fine-grained data tracks
  activeMetric = signal<number>(120);

  // 3. Memoized calculation updates dynamically only when activeMetric changes
  processedLoadFactor = computed(() => {
    return Math.min(100, Math.floor(this.activeMetric() * 0.385));
  });

  simulateDataSpike() {
    // Component view repaints smoothly and precisely without disturbing surrounding template trees
    this.activeMetric.set(Math.floor(Math.random() * 150) + 100);
  }
}`
              }
            ]
          },

          // Memory Leak Prevention in Async Tasks
          {
            heading: 'Memory Leak Prevention in Async Tasks',
            content: `<p class="mb-3">Dangling continuous stream subscriptions are the leading cause of memory leaks in SPA architectures, eventually causing the browser tab to slow down or crash.</p><ul><li><strong>The Danger Mode:</strong> Standard component-level <code>.subscribe()</code> calls without an unsubscribe handler will remain active in the browser heap long after the component has been unmounted from the DOM tree.</li><li><strong>takeUntilDestroyed Operator:</strong> A modern Angular operator that ties the pipeline lifetime straight to the framework lifecycle provider, cleaning up the link automatically during the component unmounting sequence.</li></ul>`,
            mermaidDefinition: `
  graph TD
    %% Invisible link forces vertical stacking to prevent width squishing
    Legacy ~~~ Modern

    subgraph Legacy ["Legacy Danger (Unmanaged Subscriptions)"]
      direction LR
      L1["interval().subscribe(...) <br/> (Continuous RxJS Stream)"] --> L2["Component Unmounted <br/> (e.g., User navigates away)"]
      L2 -->|No manual unsubscribe| L3["Orphaned Stream <br/> keeps firing in background"]
      L3 --> L4["Browser Memory Leak ⚠️ <br/> Performance Degradation"]
    end

    subgraph Modern ["Modern Prevention (Angular 16+)"]
      direction LR
      M1["interval().pipe(...)"] --> M2["takeUntilDestroyed(destroyRef) <br/> 🔗 Links to Component Lifecycle"]
      M2 --> M3["Component Unmounted"]
      M3 -->|Framework auto-triggers cleanup| M4["Stream Safely Terminated 🛡️ <br/> Zero Memory Bleed"]
    end

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    
    %% Legacy Pathway (Faded / De-emphasized)
    classDef legacy fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#64748b,stroke-dasharray:4;
    
    %% Danger / Memory Leak layer
    classDef danger fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337,font-weight:bold;
    
    %% Modern Container/Parent
    classDef modern fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    %% Core Feature Primitives (Deep Contrast Layer)
    classDef featureCore fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    
    %% Shields / Protections / Success
    classDef shield fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534,font-weight:bold;

    %% Class Assignments
    class L1,L2,L3 legacy;
    class L4 danger;
    class M1,M3 default;
    class M2 featureCore;
    class M4 shield;

    %% Subgraph specific styling
    style Legacy fill:#f1f5f9,stroke:#e2e8f0,stroke-dasharray:4;
    style Modern fill:#faf5ff,stroke:#e879f9,stroke-width:2px;
`,
            codeFiles: [
              {
                fileName: 'telemetry-monitor.component.ts',
                language: 'typescript',
                code: `import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-telemetry-monitor',
  standalone: true,
  template: \`
    <div class="monitor-card">
      <h4>System Telemetry Status Panel</h4>
      <p class="status-active">Pulse stream connection linked directly to component lifetime matrix.</p>
    </div>
  \`
})
export class TelemetryMonitorComponent implements OnInit {
  // 1. Inject modern global cleanup hook token reference
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    // 2. High-frequency continuous generation ticker simulation
    interval(1000).pipe(
      tap(tick => console.log('Continuous telemetry pulse ping:', tick)),
      
      // 3. ✅ CRITICAL: Ties this stream down directly to this instance's DOM life span
      takeUntilDestroyed(this.destroyRef) 
    ).subscribe({
      next: (val) => this.processSystemTelemetryFrame(val),
      error: (err) => console.error('Pulse collection encountered system exception:', err)
    });
  }

  private processSystemTelemetryFrame(frameId: number) {
    // Executing internal background calculations smoothly
  }
}`
              }
            ]
          }
        ]
      },
    ]
  },


  // Routing & Forms
  {
    id: 'routing-forms',
    title: 'Routing & Forms',
    icon: 'bi-signpost-split',
    category: 'Navigation & Input',
    versions: [

      // fundamentals
      {
        version: 'fundamentals',
        label: 'Fundamentals',
        sections: [

          // Router Setup & Route Definition
          {
            heading: 'Router Setup & Route Definition',
            content: `<p>The Angular Router is a powerful service that maps browser URLs to specific components, enabling SPA navigation. It supports static, dynamic, and lazy-loaded routes.</p><ul><li><strong>Route Config:</strong> An array of objects defining the path, component, and optional guards or lazy-loading logic.</li><li><strong>Order Matters:</strong> Angular matches routes top-down. The wildcard (<code>**</code>) must always be the last entry to catch undefined paths.</li><li><strong>Preloading:</strong> Use <code>withPreloading(PreloadAllModules)</code> to optimize performance by fetching lazy chunks in the background after the initial app load.</li></ul>`,
            mermaidDefinition: `
  graph TD
    %% Entry Point & Core Engine
    Request([Browser URL]) --> Router{Angular Router}
    
    %% Route Processing Flow
    Router -->|1. Exact Match| Static[Static Route]
    Router -->|2. Dynamic Segment| Param[Parameterized Route]
    Router -->|3. On Demand| Lazy[Lazy Loaded Route]
    Router -->|4. No Match Found| Wild[Wildcard Route]

    %% Examples & Context (Attached via dotted lines)
    Static -.-> S_Ex>Example: /about]
    Param -.-> P_Ex>Example: /products/:id]
    Lazy -.-> L_Ex>Benefit: Reduces initial bundle size]
    Wild -.-> W_Ex>Always placed LAST: **]

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    
    %% Core Engine (Highest Contrast)
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    
    %% Primary High-Value Elements (Elevated Lightness)
    classDef primaryNode fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    %% De-emphasized Base Elements (Bottom Canvas)
    classDef fallbackNode fill:#f3f4f6,stroke:#cbd5e1,stroke-width:1px,color:#5f6368;
    
    %% Contextual Notes (Subtle)
    classDef contextNote fill:#f8fafc,stroke:#e2e8f0,stroke-dasharray: 4 4,color:#475569,font-size:12px;

    %% Apply Classes
    class Router coreEngine;
    class Static,Param,Lazy primaryNode;
    class Wild fallbackNode;
    class S_Ex,P_Ex,L_Ex,W_Ex contextNote;
`,
            codeFiles: [
              {
                fileName: 'app.routes.ts',
                language: 'typescript',
                code: `import { Routes } from '@angular/router';

export const routes: Routes = [
  // Static route
  { path: '', component: HomeComponent, title: 'Home' },

  // Parameterized route — id is captured via ActivatedRoute
  { path: 'products/:id', component: ProductDetailComponent },

  // Lazy-loaded route — loads ProductsModule only on demand
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard]
  },

  // Named outlet (secondary router outlet)
  { path: 'modal', component: QuickViewComponent, outlet: 'popup' },

  // Wildcard — MUST be last
  { path: '**', component: NotFoundComponent }
];`
              },
              {
                fileName: 'app.config.ts',
                language: 'typescript',
                code: `import { ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)  // preloads lazy modules after initial load
    )
  ]
};`
              }
            ]
          },

          // Reading Route Params & Query Strings
          {
            heading: 'Reading Route Params & Query Strings',
            mermaidDefinition: `
  graph TD
    URL(https://www.quora.com/When-does-a-CPG-have-to-change-the-UPC-for-a-product) --> Strat{Reading Strategy}
    
    Strat -->|Snapshot| Snap[route.snapshot.paramMap]
    Strat -->|Observable| Obs[route.paramMap.pipe...]
    
    Snap --> Fail[⚠️ Component doesn't reload <br/> UI shows stale data]
    Obs --> Success[✅ Stream emits new value <br/> UI updates reactively]

    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef engine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef danger fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337;
    classDef success fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534;
    
    class Strat engine;
    class Fail danger;
    class Success success;
    class URL,Snap,Obs default;
`,
            content: `<p>Use <code>ActivatedRoute</code> to read URL parameters and query strings in a component. Angular 16+ provides a signal-based alternative via <code>inject(ActivatedRoute)</code>:</p><ul><li><strong>Snapshot:</strong> Read a single value at component creation. Fast but misses changes if the route updates without destroying the component (e.g., <code>/products/1</code> → <code>/products/2</code>).</li><li><strong>Observable <code>paramMap</code>:</strong> Reactively re-reads whenever the URL changes — correct approach for re-usable detail pages.</li><li><strong>Query params:</strong> Key-value pairs after <code>?</code> in the URL, e.g., <code>/products?sort=price&amp;page=2</code>.</li></ul>`,
            codeFiles: [
              {
                fileName: 'product-detail.component.ts',
                language: 'typescript',
                code: `import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  template: \`
    <h3>Product: {{ productId() }}</h3>
    <p>Sort by: {{ sortBy() }}</p>
    <button (click)="goBack()">← Back to List</button>
  \`
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Signal-based — auto-updates when URL changes
  productId = toSignal(
    this.route.paramMap.pipe(map(p => p.get('id') ?? ''))
  );

  sortBy = toSignal(
    this.route.queryParamMap.pipe(map(q => q.get('sort') ?? 'default'))
  );

  goBack() {
    this.router.navigate(['/products'], { queryParams: { page: 1 } });
  }
}`
              }
            ]
          },

          // Route Guards (canActivate, canDeactivate)
          {
            heading: 'Route Guards (canActivate, canDeactivate)',
            mermaidDefinition: `
  graph TD
    Nav([Router Navigation Started]) --> CA{canActivate}
    
    CA -->|Returns false / UrlTree| Reject[Redirect to Login / Cancel]
    CA -->|Returns true| Load[Render Component]
    
    Leave([User attempts to leave page]) --> CD{canDeactivate}
    CD -->|Returns false| Stay[Block Navigation <br/> e.g. Unsaved Changes]
    CD -->|Returns true| Exit[Unmount & Navigate]

    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef engine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef danger fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337;
    classDef success fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534;
    
    class CA,CD engine;
    class Reject,Stay danger;
    class Load,Exit success;
`,
            content: `<p>Guards are functions that control whether a route can be activated or exited.</p><ul><li><strong>canActivate:</strong> Runs before a route loads. Return <code>true</code>/<code>false</code> or a <code>UrlTree</code> to redirect. Used to protect authenticated routes.</li><li><strong>canDeactivate:</strong> Runs before leaving a route. Useful for prompting "Unsaved changes — leave anyway?" when a form is dirty.</li><li>Modern guards are plain functions (Angular 15+), not classes.</li></ul>`,
            codeFiles: [
              {
                fileName: 'auth.guard.ts',
                language: 'typescript',
                code: `import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Functional guard — no class needed (Angular 15+)
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }
  // Redirect to login, preserve original URL as a query param
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};`
              },
              {
                fileName: 'unsaved-changes.guard.ts',
                language: 'typescript',
                code: `import { CanDeactivateFn } from '@angular/router';
import { signal } from '@angular/core';

// Any component with a isDirty signal can use this guard
export interface HasUnsavedChanges {
  isDirty: () => boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> =
  (component) => {
    if (!component.isDirty()) return true;
    return confirm('You have unsaved changes. Leave anyway?');
  };`
              }
            ]
          },

          // Template-Driven vs Reactive Forms
          {
            heading: 'Template-Driven vs Reactive Forms',
            mermaidDefinition: `
  graph TD
    Forms([Angular Forms Core]) --> TD[Template-Driven Forms]
    Forms --> RF[Reactive Forms]
    
    TD --> T1[Defined in HTML <br/> ngModel Directives]
    TD --> T2[Two-Way Data Binding <br/> Mutable State]
    TD --> T3[Harder to Unit Test]
    
    RF --> R1[Defined in TypeScript <br/> FormGroup/FormBuilder]
    RF --> R2[Unidirectional Data Flow <br/> Observable Streams]
    RF --> R3[Highly Testable & Scalable]

    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef header fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef legacy fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#64748b,stroke-dasharray:4;
    classDef modern fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    class Forms header;
    class TD,T1,T2,T3 legacy;
    class RF,R1,R2,R3 modern;
`,
            content: `<p>Angular provides two approaches for handling user input through forms:</p><ul><li><strong>Template-Driven:</strong> Defined in the HTML template using directives (<code>ngModel</code>, <code>ngForm</code>). Simple and quick for small forms. Two-way binding, less testable.</li><li><strong>Reactive (Model-Driven):</strong> Defined programmatically in the component class using <code>FormBuilder</code>, <code>FormGroup</code>, and <code>FormControl</code>. Explicit, fully testable, supports complex validation logic and dynamic forms.</li></ul><table class="table table-bordered mt-2 small"><thead><tr><th>Feature</th><th>Template-Driven</th><th>Reactive</th></tr></thead><tbody><tr><td>Setup</td><td>HTML directives</td><td>FormBuilder in class</td></tr><tr><td>Validation</td><td>HTML attributes</td><td>Validator functions</td></tr><tr><td>Testing</td><td>Harder (DOM-coupled)</td><td>Easy (plain objects)</td></tr><tr><td>Dynamic fields</td><td>Limited</td><td>Full support</td></tr></tbody></table>`,
            codeFiles: [
              {
                fileName: 'checkout-form.component.ts',
                language: 'typescript',
                code: `import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email" placeholder="Email" />
      @if (form.get('email')?.invalid && form.get('email')?.touched) {
        <p class="text-danger small">Valid email is required.</p>
      }

      <input formControlName="phone" placeholder="Phone" />

      <div formGroupName="address">
        <input formControlName="city" placeholder="City" />
        <input formControlName="pin" placeholder="PIN Code" />
      </div>

      <button [disabled]="form.invalid" type="submit">Place Order</button>
    </form>
  \`
})
export class CheckoutFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^[6-9]\\d{9}$/)]],
    address: this.fb.group({
      city: ['', Validators.required],
      pin:  ['', [Validators.required, Validators.minLength(6)]]
    })
  });

  onSubmit() {
    if (this.form.valid) {
      console.log('Order data:', this.form.value);
    }
  }
}`
              }
            ]
          }
        ]
      },

      // advanced
      {
        version: 'advanced',
        label: 'Advanced',
        sections: [

          // Lazy Loading & Code Splitting
          {
            heading: 'Lazy Loading & Code Splitting',
            content: `<p>Lazy loading is a design pattern that defers the initialization of resources until they are actually needed, significantly reducing the initial bundle size and improving "Time to Interactive" (TTI).</p><ul><li><strong>loadComponent:</strong> Ideal for loading a single standalone component only when the user navigates to a specific route.</li><li><strong>loadChildren:</strong> Used to load a bundle containing multiple routes and their associated sub-components, common for large features like an <code>/admin</code> dashboard.</li><li><strong>Preloading:</strong> A strategy where Angular fetches non-essential route chunks in the background while the user is idle, ensuring subsequent navigation feels instantaneous.</li></ul>`,
            mermaidDefinition: `
  graph TD
    %% Entry Trigger & Core Decider
    Nav([User Navigates to Lazy Route]) --> Engine{Lazy Load Engine}
    
    %% Async Strategy Execution Branches
    Engine -->|Loads Single View| Comp[loadComponent]
    Engine -->|Loads Subtree Module| Child[loadChildren]
    Engine -->|Background Sync| Preload[withPreloading]

    %% Context Details & Student Reminders (Attached via dotted links)
    Comp -.-> C_Details>Angular 15+ · Loads Standalone Views]
    Child -.-> M_Details>Loads Entire Sub-Route Configuration Files]
    Preload -.-> P_Details>Quietly fetches remaining chunks after initial page boots]

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    
    %% Core Engine (Highest Contrast Layer)
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    
    %% Primary Active Code Nodes (Elevated Lightness Layer)
    classDef primaryNode fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    %% De-emphasized Background Operations (Bottom Canvas Layer)
    classDef backgroundTask fill:#f3f4f6,stroke:#cbd5e1,stroke-width:1px,color:#5f6368;
    
    %% Semantic Context Notes
    classDef contextNote fill:#f8fafc,stroke:#e2e8f0,stroke-dasharray: 4 4,color:#475569,font-size:12px;

    %% Assigning Classes to Nodes
    class Engine coreEngine;
    class Comp,Child primaryNode;
    class Preload backgroundTask;
    class C_Details,M_Details,P_Details contextNote;
`,
            codeFiles: [
              {
                fileName: 'app.routes.ts',
                language: 'typescript',
                code: `import { Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },

  // Lazy load a single standalone component
  {
    path: 'analytics',
    loadComponent: () => import('./analytics/analytics.component').then(m => m.AnalyticsComponent)
  },

  // Lazy load a set of child routes
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
  }
];

// In app.config.ts — preload all lazy routes after bootstrap
// provideRouter(routes, withPreloading(PreloadAllModules))`
              }
            ]
          },

          // Dynamic Forms with FormArray
          {
            heading: 'Dynamic Forms with FormArray',
            mermaidDefinition: `graph LR
    FG[FormGroup - Entire Form] --> FA[FormArray - Dynamic Array Tracker]
    FA -->|push| C1[FormControl 0 - Angular]
    FA -->|push| C2[FormControl 1 - TypeScript]
    FA -.->|removeAt| C2

    classDef parent fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    classDef child fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;

    class FG,FA parent;
    class C1,C2 child;`,
            content: `<p><code>FormArray</code> manages a dynamic list of form controls or groups. It's useful when the user can add or remove items, such as a list of phone numbers, skills, or line items.</p>`,
            codeFiles: [
              {
                fileName: 'skills-form.component.ts',
                language: 'typescript',
                code: `import { Component, inject } from '@angular/core';
import { FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-skills-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <div formArrayName="skills">
        @for (ctrl of skills.controls; track $index; let i = $index) {
          <div class="d-flex gap-2 mb-2">
            <input [formControlName]="i" placeholder="Skill #{{ i + 1 }}" class="form-control" />
            <button type="button" class="btn btn-sm btn-outline-danger" (click)="remove(i)">✕</button>
          </div>
        }
      </div>
      <button type="button" class="btn btn-sm btn-outline-primary" (click)="add()">+ Add Skill</button>
    </form>
  \`
})
export class SkillsFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    skills: this.fb.array([
      this.fb.control('Angular', Validators.required),
      this.fb.control('TypeScript', Validators.required)
    ])
  });

  get skills() { return this.form.get('skills') as FormArray; }

  add()            { this.skills.push(this.fb.control('', Validators.required)); }
  remove(i: number){ this.skills.removeAt(i); }
}`
              }
            ]
          },

          // Custom Validators
          {
            heading: 'Custom Validators',
            mermaidDefinition: `
  graph TD
    Input([User Types Value]) --> FC[FormControl Update Event]
    
    FC --> Sync[Sync Validator <br/> Executes Immediately]
    FC --> Async[Async Validator <br/> Debounced API Call]
    
    Sync -->|Checks Regex| Res1{Is Valid?}
    Async -->|Sends HTTP GET| API[(Backend Server)]
    API -->|JSON Response| Res2{Is Valid?}

    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef engine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef network fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;
    
    class Sync,Async engine;
    class API network;
`,
            content: `<p>Custom validators are plain functions that accept a <code>FormControl</code> and return a <code>ValidationErrors</code> object if invalid, or <code>null</code> if valid.</p><ul><li><strong>Sync validators:</strong> Return errors immediately.</li><li><strong>Async validators:</strong> Return a <code>Promise</code> or <code>Observable</code> of errors. Useful for checking if a username is taken via an API call.</li><li><strong>Cross-field validators:</strong> Applied to a <code>FormGroup</code> to compare multiple controls (e.g., password confirmation).</li></ul>`,
            codeFiles: [
              {
                fileName: 'validators.ts',
                language: 'typescript',
                code: `import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, debounceTime, switchMap, catchError, of } from 'rxjs';

// ── Sync validator — no spaces allowed ───────────────────
export function noSpaces(control: AbstractControl): ValidationErrors | null {
  return /\\s/.test(control.value) ? { noSpaces: true } : null;
}

// ── Async validator — check username availability ─────────
export function uniqueUsernameValidator(): AsyncValidatorFn {
  const http = inject(HttpClient);
  return (control) =>
    control.valueChanges.pipe(
      debounceTime(400),
      switchMap(name => http.get<{ taken: boolean }>(\`/api/check-username/\${name}\`)),
      map(res => res.taken ? { usernameTaken: true } : null),
      catchError(() => of(null))  // on network error, pass validation
    );
}

// ── Cross-field validator — passwords must match ──────────
export function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pass    = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass !== confirm ? { passwordsMismatch: true } : null;
}`
              }
            ]
          }
        ]
      },

      // Scenario Prep
      {
        version: 'scenarios',
        label: 'Scenario Prep',
        sections: [
          {
            heading: 'Preserving Form State on Back Navigation',
            mermaidDefinition: `
  graph TD
    Form[User fills Form] --> Nav([Navigates to new Route])
    
    Nav --> Destroy[ngOnDestroy lifecycle hook]
    Destroy --> Store[Save form.value to Singleton Service]
    
    Back([User clicks Browser Back]) --> Init[ngOnInit triggers]
    Init --> Read[Read state from Service cache]
    Read --> Patch[form.patchValue restores UI data]

    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef event fill:#f8fafc,stroke:#64748b,stroke-width:1px,color:#0f172a,stroke-dasharray:4;
    classDef service fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    classDef success fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534;
    
    class Nav,Back event;
    class Store,Read service;
    class Patch success;
`,
            content: `<h5>Scenario Question:</h5><p><em>"A user fills in a multi-step form, navigates away to check something, and returns. The form is blank. How do you fix this?"</em></p><h5>Answer:</h5><p>Persist the form value in a service (not the component). Since services are singletons, they survive navigation. Restore the form value in <code>ngOnInit</code>.</p>`,
            codeFiles: [
              {
                fileName: 'form-state.service.ts',
                language: 'typescript',
                code: `import { Injectable, signal } from '@angular/core';

interface CheckoutDraft {
  email: string;
  city: string;
  pin: string;
}

@Injectable({ providedIn: 'root' })
export class FormStateService {
  // Signal preserves value across component destroy/recreate
  draft = signal<Partial<CheckoutDraft>>({});

  save(value: Partial<CheckoutDraft>) { this.draft.set(value); }
  clear()                              { this.draft.set({}); }
}`
              },
              {
                fileName: 'checkout.component.ts',
                language: 'typescript',
                code: `import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormStateService } from './form-state.service';

@Component({ selector: 'app-checkout', standalone: true, imports: [ReactiveFormsModule], template: \`...\` })
export class CheckoutComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private state = inject(FormStateService);

  form = this.fb.group({ email: [''], city: [''], pin: [''] });

  ngOnInit() {
    // Restore draft if it exists
    const saved = this.state.draft();
    if (Object.keys(saved).length) {
      this.form.patchValue(saved);
    }
  }

  ngOnDestroy() {
    // Persist before leaving (unless submitted)
    this.state.save(this.form.value as any);
  }

  onSubmit() {
    this.state.clear();  // clear draft after successful submit
  }
}`
              }
            ]
          },
          {
            heading: 'Route-based Code Splitting for Performance',
            mermaidDefinition: `
  graph TD
    Boot[Initial Load] --> Main[main.js <br/> Minimal Core + Home]
    Main --> View[Home Page Loads instantly ⚡]
    
    View --> Idle[Browser detected Idle State]
    Idle -->|withPreloading| Fetch[Background Fetch: <br/> settings-chunk.js]
    
    View --> Nav([User clicks 'Settings'])
    Nav --> Cache{Chunk already <br/> preloaded?}
    Cache -->|Yes| Instant[Instant Route Transition]
    Cache -->|No| Wait[UI block waiting <br/> for Network]

    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef fast fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534,font-weight:bold;
    classDef slow fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337;
    classDef engine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    
    class Main,View,Instant fast;
    class Wait slow;
    class Fetch,Cache engine;
`,
            content: `<h5>Scenario Question:</h5><p><em>"Your app bundle is 3 MB and initial load is slow. How would you reduce it using the router?"</em></p><h5>Answer:</h5><p>Audit bundle with <code>ng build --stats-json</code> and webpack-bundle-analyzer. Then lazy-load every route that isn't needed on first paint using <code>loadComponent</code>. Combine with <code>withPreloading</code> to background-load the rest after bootstrap:</p>`,
            codeFiles: [
              {
                fileName: 'app.routes.ts',
                language: 'typescript',
                code: `// ── Before: Eager (everything bundled into main.js) ─────────
// { path: 'analytics', component: AnalyticsComponent }
// { path: 'settings',  component: SettingsComponent  }

// ── After: Lazy (separate chunks, loaded on demand) ──────────
export const routes: Routes = [
  // Only home loads eagerly — needed on first paint
  { path: '', component: HomeComponent },

  // Each lazy chunk is a separate JS file (e.g. analytics-abc123.js)
  {
    path: 'analytics',
    loadComponent: () => import('./analytics/analytics.component')
      .then(m => m.AnalyticsComponent)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.routes')
      .then(m => m.settingsRoutes)
  }
];

// app.config.ts — background preload after bootstrap
// provideRouter(routes, withPreloading(PreloadAllModules))`
              }
            ]
          }
        ]
      }
    ]
  },


  // Services & DI
  {
    id: 'services-di',
    title: 'Services & DI',
    icon: 'bi-diagram-3',
    category: 'Architecture',
    versions: [
      {
        version: 'fundamentals',
        label: 'Fundamentals',
        sections: [
          {
            heading: 'Dependency Injection & Providers',
            content: `<p>Angular's DI system creates and delivers dependencies (services, values, factories) to components and other services. You declare what a class needs; Angular injects it.</p><ul><li><strong>providedIn: 'root':</strong> Service is a singleton shared across the entire app. Lazily tree-shaken if unused.</li><li><strong>providedIn: 'any':</strong> A new instance is created per lazy-loaded module. Useful for isolating service state per route.</li><li><strong>Component-level providers:</strong> Each component instance gets its own service instance — useful for isolated state (e.g., a component-scoped form service).</li></ul>`,
            codeFiles: [
              {
                fileName: 'logger.service.ts',
                language: 'typescript',
                code: `import { Injectable } from '@angular/core';

// ── Singleton — one instance for the entire app ───────────
@Injectable({ providedIn: 'root' })
export class LoggerService {
  private logs: string[] = [];

  log(message: string, level: 'info' | 'warn' | 'error' = 'info') {
    const entry = \`[\${level.toUpperCase()}] \${new Date().toISOString()} — \${message}\`;
    this.logs.push(entry);
    console.log(entry);
  }

  getLogs() { return [...this.logs]; }
}`
              },
              {
                fileName: 'product.component.ts',
                language: 'typescript',
                code: `import { Component, inject } from '@angular/core';
import { LoggerService } from './logger.service';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  // Component-level provider: each instance of this component
  // gets its OWN ProductService (isolated state)
  providers: [ProductService],
  template: \`<p>{{ product()?.name }}</p>\`
})
export class ProductComponent {
  private logger = inject(LoggerService);   // singleton (from root)
  private products = inject(ProductService); // isolated (per component)

  product = this.products.selected;

  constructor() {
    this.logger.log('ProductComponent initialized');
  }
}`
              }
            ]
          },
          {
            heading: 'HttpClient & Interceptors',
            content: `<p><code>HttpClient</code> is Angular's built-in HTTP library. It returns Observables and supports typed responses, error handling, and interceptors.</p><ul><li><strong>Interceptors:</strong> Middleware for HTTP requests/responses. Use them for auth token injection, loading spinners, error normalization, and request logging — without modifying each service call.</li><li>Modern interceptors are functions (Angular 15+), not classes.</li></ul>`,
            codeFiles: [
              {
                fileName: 'auth.interceptor.ts',
                language: 'typescript',
                code: `import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

// Functional interceptor — no class, no implements (Angular 15+)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // Clone request and attach Bearer token
  const authedReq = auth.token()
    ? req.clone({ setHeaders: { Authorization: \`Bearer \${auth.token()}\` } })
    : req;

  return next(authedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};`
              },
              {
                fileName: 'app.config.ts',
                language: 'typescript',
                code: `import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};`
              }
            ]
          },
          {
            heading: 'Injection Tokens & InjectionToken',
            content: `<p>Use <code>InjectionToken</code> to inject non-class values (configuration objects, feature flags, API URLs) into services and components without relying on a class type.</p><ul><li>Avoids ambiguity when injecting the same type from multiple sources.</li><li>Supports <code>factory</code> functions for computing initial values.</li><li>Commonly used for environment-specific config, theming, and feature flags.</li></ul>`,
            codeFiles: [
              {
                fileName: 'tokens.ts',
                language: 'typescript',
                code: `import { InjectionToken } from '@angular/core';

// ── Define the token ──────────────────────────────────────
export interface AppConfig {
  apiUrl: string;
  featureFlags: { darkMode: boolean; betaDashboard: boolean };
  maxRetries: number;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  factory: () => ({
    apiUrl: 'https://api.myapp.com/v1',
    featureFlags: { darkMode: false, betaDashboard: true },
    maxRetries: 3
  })
});`
              },
              {
                fileName: 'api.service.ts',
                language: 'typescript',
                code: `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from './tokens';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http   = inject(HttpClient);
  private config = inject(APP_CONFIG);

  getOrders() {
    // Uses injected config — no hardcoded URL
    return this.http.get(\`\${this.config.apiUrl}/orders\`);
  }
}`
              }
            ]
          }
        ]
      },
      {
        version: 'advanced',
        label: 'Advanced Patterns',
        sections: [
          {
            heading: 'Service with Signal-based State',
            content: `<p>Replacing <code>BehaviorSubject</code> with Signals in services gives a simpler, synchronous state API that integrates directly into Angular's change detection without needing <code>async</code> pipe or subscriptions.</p>`,
            codeFiles: [
              {
                fileName: 'auth.service.ts',
                language: 'typescript',
                code: `import { Injectable, signal, computed } from '@angular/core';

export interface User { id: string; name: string; role: 'admin' | 'viewer'; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Private writable state
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  // Public read-only signals
  user  = this._user.asReadonly();
  token = this._token.asReadonly();

  // Derived computed signal
  isLoggedIn = computed(() => !!this._user());
  isAdmin    = computed(() => this._user()?.role === 'admin');

  login(user: User, token: string) {
    this._user.set(user);
    this._token.set(token);
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
  }
}`
              }
            ]
          },
          {
            heading: 'Multi-level DI: forwardRef & optional injection',
            content: `<p>Advanced DI techniques for handling edge cases:</p><ul><li><strong>forwardRef:</strong> Resolves a circular reference — when Class A needs Class B and Class B needs Class A.</li><li><strong>@Optional():</strong> The dependency is injected as <code>null</code> if not provided, instead of throwing an error. Useful for optional feature modules.</li><li><strong>@Self() / @SkipSelf():</strong> Controls where in the injector hierarchy Angular looks for the dependency.</li></ul>`,
            codeFiles: [
              {
                fileName: 'di-patterns.ts',
                language: 'typescript',
                code: `import { inject, Optional, SkipSelf, Self, forwardRef, Injectable } from '@angular/core';

@Injectable()
export class ParentService { name = 'Parent'; }

@Injectable()
export class ChildService {
  // @SkipSelf() — look ABOVE this component's own injector
  // @Self()     — look ONLY in this component's own injector
  // @Optional() — return null instead of throwing if not found
  private parent = inject(ParentService, { skipSelf: true, optional: true });

  getParentName() {
    return this.parent?.name ?? 'No parent service available';
  }
}

// ── forwardRef — needed when A references B before B is declared ──
// import { forwardRef } from '@angular/core';
//
// @Component({
//   providers: [{ provide: SOME_TOKEN, useExisting: forwardRef(() => MyComponent) }]
// })`
              }
            ]
          }
        ]
      },
      {
        version: 'scenarios',
        label: 'Scenario Prep',
        sections: [
          {
            heading: 'Avoiding Shared Mutable State in Services',
            content: `<h5>Scenario Question:</h5><p><em>"Two unrelated components inject the same service and one's changes affect the other unexpectedly. How do you prevent this?"</em></p><h5>Answer:</h5><p>This happens when both components share the same singleton instance and one mutates shared state directly. Fixes:</p><ol><li>Use <strong>component-level providers</strong> (<code>providers: [MyService]</code> in <code>@Component</code>) to give each component its own isolated service instance.</li><li>Design the service with <strong>immutable Signal updates</strong> — always use <code>.set()</code> or <code>.update()</code> rather than mutating nested objects directly.</li></ol>`,
            codeFiles: [
              {
                fileName: 'isolation-demo.ts',
                language: 'typescript',
                code: `import { Component, Injectable, signal } from '@angular/core';

@Injectable()
export class FilterService {
  active = signal<string[]>([]);

  toggle(tag: string) {
    this.active.update(tags =>
      tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    );
  }
}

// ── Component A: its own FilterService instance ───────────
@Component({
  selector: 'app-product-filters',
  providers: [FilterService],  // new instance per component
  standalone: true,
  template: \`<button (click)="fs.toggle('sale')">Sale</button>\`
})
export class ProductFiltersComponent {
  fs = new FilterService();  // isolated — changes don't bleed out
}`
              }
            ]
          },
          {
            heading: 'Injecting Config without Environment Files',
            content: `<h5>Scenario Question:</h5><p><em>"How would you make your Angular service configurable at runtime (e.g., per-client API URL) without rebuilding the app?"</em></p><h5>Answer:</h5><p>Load a <code>config.json</code> file at bootstrap time using <code>APP_INITIALIZER</code>, store the config in a service, and inject it anywhere via an <code>InjectionToken</code>. This avoids baking config into the compiled bundle.</p>`,
            codeFiles: [
              {
                fileName: 'config-loader.ts',
                language: 'typescript',
                code: `import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from './tokens';
import { tap } from 'rxjs';

// Loaded once at startup — before any component renders
function loadConfig(http: HttpClient, config: AppConfig) {
  return () => http.get<AppConfig>('/assets/config.json').pipe(
    tap(cfg => Object.assign(config, cfg))
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const http   = inject(HttpClient);
        const config = inject(APP_CONFIG);
        return loadConfig(http, config);
      },
      multi: true
    }
  ]
};`
              }
            ]
          }
        ]
      }
    ]
  },


  // Performance & Advanced
  {
    id: 'performance-advanced',
    title: 'Performance & Advanced',
    icon: 'bi-speedometer2',
    category: 'Optimization',
    versions: [
      {
        version: 'fundamentals',
        label: 'Change Detection',
        sections: [
          {
            heading: 'Change Detection: Default vs OnPush',
            content: `<p>Change detection is how Angular decides which parts of the DOM to update after state changes.</p><ul><li><strong>Default:</strong> Angular checks every component top-down on every event (click, HTTP, timer). Safe but can be slow in large trees.</li><li><strong>OnPush:</strong> Angular only checks a component when its <code>@Input()</code> reference changes, an event fires inside it, or an Observable in the template emits. Significantly reduces checks.</li></ul><table class="table table-bordered mt-2 small"><thead><tr><th>Strategy</th><th>When it checks</th><th>Use when</th></tr></thead><tbody><tr><td>Default</td><td>Every event / timer</td><td>Prototyping, simple apps</td></tr><tr><td>OnPush</td><td>Input ref change / event / async emit</td><td>Performance-critical components</td></tr></tbody></table>`,
            codeFiles: [
              {
                fileName: 'order-row.component.ts',
                language: 'typescript',
                code: `import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

interface Order { id: string; product: string; status: string; total: number; }

// ── OnPush — only re-renders when order reference changes ──
@Component({
  selector: 'app-order-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <tr>
      <td>{{ order.id }}</td>
      <td>{{ order.product }}</td>
      <td>{{ order.status }}</td>
      <td>₹{{ order.total }}</td>
    </tr>
  \`
})
export class OrderRowComponent {
  @Input() order!: Order;
  // Angular will only re-check this if the ORDER REFERENCE changes
  // e.g.  this.orders[0] = { ...this.orders[0], status: 'Shipped' }  ← new ref ✓
  // NOT:  this.orders[0].status = 'Shipped'                          ← same ref ✗
}`
              }
            ]
          },
          {
            heading: '@defer Blocks — Lazy UI Loading',
            content: `<p>Angular 17 introduced <code>&#64;defer</code> blocks: a declarative way to lazy-load components and their dependencies only when needed. This reduces the initial bundle size without any manual dynamic imports.</p><ul><li><strong>&#64;defer (on viewport):</strong> Load when the placeholder enters the viewport.</li><li><strong>&#64;defer (on idle):</strong> Load during browser idle time.</li><li><strong>&#64;defer (on interaction):</strong> Load when the user hovers or clicks the trigger.</li><li><strong>&#64;loading / &#64;placeholder / &#64;error:</strong> Built-in blocks for loading states and error handling.</li></ul>`,
            codeFiles: [
              {
                fileName: 'product-page.component.html',
                language: 'xml',
                code: `<!-- Heavy analytics chart — load only when scrolled into view -->
@defer (on viewport) {
  <app-analytics-chart [productId]="id()" />
} @loading (minimum 300ms) {
  <div class="skeleton-chart rounded-3 bg-light" style="height: 200px;"></div>
} @placeholder {
  <div class="text-muted small text-center py-4">Scroll to load chart</div>
} @error {
  <p class="text-danger">Failed to load chart. <button (click)="reload()">Retry</button></p>
}

<!-- Reviews section — load only on user interaction (hover/click) -->
@defer (on interaction(reviewsTrigger)) {
  <app-reviews [productId]="id()" />
} @placeholder {
  <div #reviewsTrigger class="btn btn-outline-secondary">Load Reviews</div>
}`
              }
            ]
          },
          {
            heading: 'trackBy in @for Loops',
            content: `<p>The <code>track</code> expression in <code>&#64;for</code> tells Angular how to identify each item. Using a stable unique key (like <code>item.id</code>) lets Angular move existing DOM nodes instead of destroying and recreating them when the array changes.</p><ul><li>Without track or tracking by <code>$index</code>: Angular destroys all DOM nodes and rebuilds — causes visual flicker, lost focus, and animation resets.</li><li>With <code>track item.id</code>: Angular reconciles by identity — only inserts/removes/moves the changed item.</li></ul>`,
            codeFiles: [
              {
                fileName: 'order-list.component.ts',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';

interface Order { id: string; product: string; total: number; }

@Component({
  selector: 'app-order-list',
  standalone: true,
  template: \`
    <button (click)="sort()">Sort by Total ↑</button>

    @for (order of orders(); track order.id) {
      <div class="order-card">{{ order.product }} — ₹{{ order.total }}</div>
    }
    <!-- track order.id → Angular moves DOM nodes (smooth, no flicker) -->
    <!-- track $index  → Angular recreates all nodes (flicker!)        -->
  \`
})
export class OrderListComponent {
  orders = signal<Order[]>([
    { id: 'ORD-1', product: 'Laptop',     total: 79999 },
    { id: 'ORD-2', product: 'Headphones', total: 4999  },
    { id: 'ORD-3', product: 'Keyboard',   total: 2499  },
  ]);

  sort() {
    // New array reference → triggers OnPush; track id → no DOM recreation
    this.orders.set([...this.orders()].sort((a, b) => a.total - b.total));
  }
}`
              }
            ]
          }
        ]
      },
      {
        version: 'advanced',
        label: 'Advanced Patterns',
        sections: [
          {
            heading: 'Zoneless Change Detection (Angular 18+)',
            content: `<p>Angular 18 introduced experimental zoneless change detection. Instead of relying on Zone.js to patch browser APIs and trigger checks, the framework reacts only to Signal mutations and explicit <code>markForCheck()</code> calls.</p><ul><li><strong>Smaller bundle:</strong> Removes Zone.js (~40 KB gzipped).</li><li><strong>Faster startup:</strong> No monkey-patching of <code>setTimeout</code>, <code>Promise</code>, etc.</li><li><strong>Requirement:</strong> All state must be in Signals or explicitly marked — no "magic" change detection from class property mutations.</li></ul>`,
            codeFiles: [
              {
                fileName: 'app.config.ts',
                language: 'typescript',
                code: `import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Opt-in to zoneless — remove zone.js from polyfills too
    provideExperimentalZonelessChangeDetection()
  ]
};`
              },
              {
                fileName: 'counter.component.ts',
                language: 'typescript',
                code: `import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

// ── Fully zoneless-compatible component ──────────────────
@Component({
  selector: 'app-counter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <p>Count: {{ count() }}</p>
    <button (click)="increment()">+1</button>
  \`
})
export class CounterComponent {
  count = signal(0);

  increment() {
    // Signal mutation tells Angular exactly what changed
    this.count.update(n => n + 1);
    // No Zone.js needed — Angular schedules a check via the Signal graph
  }
}`
              }
            ]
          },
          {
            heading: 'Virtual Scrolling with CDK',
            content: `<p>Rendering thousands of DOM nodes at once degrades performance. Angular CDK's <code>cdk-virtual-scroll-viewport</code> renders only the items visible in the viewport, keeping the DOM small regardless of list size.</p>`,
            codeFiles: [
              {
                fileName: 'inventory.component.ts',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

interface Product { id: number; name: string; stock: number; }

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [ScrollingModule],
  template: \`
    <!-- Only ~10 rows rendered at a time, even with 10,000 items -->
    <cdk-virtual-scroll-viewport itemSize="48" style="height: 400px; overflow-y: auto;">
      @for (item of products(); track item.id) {
        <div class="d-flex justify-content-between px-3 py-2 border-bottom" style="height: 48px;">
          <span>{{ item.name }}</span>
          <span class="badge bg-secondary">{{ item.stock }} in stock</span>
        </div>
      }
    </cdk-virtual-scroll-viewport>
  \`
})
export class InventoryComponent {
  products = signal<Product[]>(
    Array.from({ length: 10_000 }, (_, i) => ({
      id: i + 1,
      name: \`Product #\${i + 1}\`,
      stock: Math.floor(Math.random() * 500)
    }))
  );
}`
              }
            ]
          },
          {
            heading: 'Memoization with Pure Pipes',
            content: `<p>Avoid calling expensive functions inside templates — they run on every change detection cycle. Wrapping them in a <strong>pure pipe</strong> caches the result and only recalculates when the input reference changes.</p>`,
            codeFiles: [
              {
                fileName: 'format-price.pipe.ts',
                language: 'typescript',
                code: `import { Pipe, PipeTransform } from '@angular/core';

// ── Pure pipe — result cached per unique input ────────────
@Pipe({ name: 'formatPrice', standalone: true, pure: true })
export class FormatPricePipe implements PipeTransform {
  transform(value: number, currency = 'INR', locale = 'en-IN'): string {
    // This runs only when 'value' changes, not on every CD cycle
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(value);
  }
}
// Usage in template: {{ product.price | formatPrice }}
// vs bad pattern:   {{ formatPrice(product.price) }}  ← runs every CD cycle`
              }
            ]
          }
        ]
      },
      {
        version: 'scenarios',
        label: 'Scenario Prep',
        sections: [
          {
            heading: 'Slow List Rendering with 1000+ Items',
            content: `<h5>Scenario Question:</h5><p><em>"A product catalog with 1000+ items scrolls slowly and freezes the browser. What are your optimization strategies?"</em></p><h5>Answer:</h5><ol><li><strong>Virtual scrolling:</strong> Use <code>cdk-virtual-scroll-viewport</code> so only visible rows exist in the DOM.</li><li><strong>track by id:</strong> Ensure <code>&#64;for</code> uses a stable unique key to avoid full DOM recreation on sort/filter.</li><li><strong>OnPush:</strong> Apply <code>ChangeDetectionStrategy.OnPush</code> to list-item components so Angular skips them during unrelated events.</li><li><strong>&#64;defer:</strong> Defer offscreen sections (filters, pagination) until idle or in-viewport.</li></ol>`,
            codeFiles: [
              {
                fileName: 'catalog.component.ts',
                language: 'typescript',
                code: `import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

interface Product { id: number; name: string; price: number; }

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <!-- 1. Virtual scroll — only renders visible rows ─────── -->
    <cdk-virtual-scroll-viewport itemSize="64" style="height: 600px; overflow-y: auto;">
      <!-- 2. track item.id — no DOM recreation on filter/sort  -->
      @for (p of filtered(); track p.id) {
        <app-product-row [product]="p" />
      }
    </cdk-virtual-scroll-viewport>

    <!-- 3. @defer — load filters only when browser is idle -->
    @defer (on idle) {
      <app-filter-panel (change)="applyFilter($event)" />
    }
  \`
})
export class CatalogComponent {
  private all = signal<Product[]>([]);     // full dataset
  filtered    = signal<Product[]>([]);     // displayed subset

  applyFilter(query: string) {
    this.filtered.set(
      this.all().filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    );
  }
}`
              }
            ]
          },
          {
            heading: 'Avoiding Memory Leaks with Subscriptions',
            content: `<h5>Scenario Question:</h5><p><em>"After navigating away from a page, the app gets slower over time. How do you diagnose and fix subscription memory leaks?"</em></p><h5>Answer:</h5><p>Long-lived subscriptions (intervals, WebSockets, global event streams) keep a reference to the component, preventing garbage collection. The component is "destroyed" but still processing events.</p><p><strong>Detection:</strong> Open Chrome DevTools Memory tab → take heap snapshot → filter by component name → if instances grow over navigation cycles, there's a leak.</p><p><strong>Fix hierarchy:</strong> <code>AsyncPipe</code> → <code>takeUntilDestroyed()</code> → manual <code>ngOnDestroy</code>.</p>`,
            codeFiles: [
              {
                fileName: 'realtime-feed.component.ts',
                language: 'typescript',
                code: `import { Component, inject } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { signal } from '@angular/core';

@Component({
  selector: 'app-realtime-feed',
  standalone: true,
  imports: [AsyncPipe],
  template: \`
    @for (event of events(); track event.id) {
      <div>{{ event.message }}</div>
    }
  \`
})
export class RealtimeFeedComponent {
  private ws = inject(WebSocketService);
  events = signal<{ id: number; message: string }[]>([]);

  constructor() {
    // ✓ takeUntilDestroyed — auto-unsubscribes when component destroys
    this.ws.messages$.pipe(
      takeUntilDestroyed()
    ).subscribe(msg =>
      this.events.update(list => [...list.slice(-99), msg]) // keep last 100
    );
    // ✗ Without takeUntilDestroyed: WebSocket subscription lives forever
    //   even after the user navigates away — classic memory leak
  }
}`
              }
            ]
          }
        ]
      }
    ]
  }
];