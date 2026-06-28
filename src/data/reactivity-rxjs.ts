import { StudyNote } from './study-notes.types';

export const reactivityRxjsNote: StudyNote = {
    id: 'reactivity-rxjs',
    title: 'Reactivity & RxJS',
    icon: 'bi-lightning-charge',
    category: 'Reactivity',
    versions: [

      // Fundamentals
      {
        version: 'fundamentals',
        label: 'Fundamentals',
        sections: [

          // Observables, Subjects & Operators
          {
            heading: 'Observables, Subjects & Operators',
            mermaidDefinitions: [`
  graph TD
    %% Data Source Entry
    Source(["Async Data Stream"]) --> Engine{"Reactivity Paradigm"}
    
    %% Core Paradigms
    Engine -->|1-to-1 Lazy Push| Obs["Observable <br/> (Executes on Subscribe)"]
    Engine -->|1-to-Many Multicast| Subj["Subject <br/> (Event Bus / Emitter)"]
    Engine -->|Stateful Multicast| BSubj["BehaviorSubject <br/> (Caches Last Value)"]
    
    %% Behaviors
    Obs -.-> O_Note["Cold: Each subscriber gets a fresh execution"]
    Subj -.-> S_Note["Hot: Late subscribers miss previous emissions"]
    BSubj -.-> B_Note["Hot + State: New subscribers immediately get current state"]

    %% UX Designer's Brand Color & Hierarchy Classes
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef primaryNode fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    classDef contextNote fill:#f8fafc,stroke:#e2e8f0,stroke-dasharray: 4 4,color:#475569,font-size:12px;

    %% Class Assignments
    class Engine coreEngine;
    class Obs,Subj,BSubj primaryNode;
    class O_Note,S_Note,B_Note contextNote;
`],
            content: `<div class="mb-3">
  <p>RxJS is Angular's reactive programming library. It models async data as streams you can compose, transform, and combine.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Observable:</strong> Lazy push-based data producer. Nothing happens until you <code>subscribe()</code>.</li>
    <li><strong>Subject:</strong> Both an Observable and an Observer — useful for multicasting or acting as an event bus.</li>
    <li><strong>BehaviorSubject:</strong> Holds the last emitted value; new subscribers get it immediately. Ideal for shared state.</li>
    <li><strong>Common operators:</strong> <code>map</code>, <code>filter</code>, <code>switchMap</code>, <code>mergeMap</code>, <code>debounceTime</code>, <code>distinctUntilChanged</code>, <code>takeUntilDestroyed</code>.</li>
  </ul>

  <h5>Reference Table</h5>
  <table class="table table-bordered mt-2 small"><thead><tr><th>Operator</th><th>Effect</th><th>Use Case</th></tr></thead><tbody><tr><td><code>switchMap</code></td><td>Cancels previous inner Observable</td><td>Typeahead search</td></tr><tr><td><code>mergeMap</code></td><td>Runs all inner Observables concurrently</td><td>Parallel API calls</td></tr><tr><td><code>exhaustMap</code></td><td>Ignores new emissions while inner is active</td><td>Prevent duplicate form submits</td></tr></tbody></table>
</div>`,
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

          // Subscription Management & Memory Leaks
          {
            heading: 'Subscription Management & Memory Leaks',
            mermaidDefinitions: [`
  graph TD
    Legacy ~~~ Modern

    subgraph Legacy ["Legacy Risk (Unmanaged Streams)"]
      direction LR
      L1["interval().subscribe(...)"] --> L2["Component Unmounted"]
      L2 -->|No manual unsubscribe| L3["Memory Leak ⚠️ <br/> Background Execution Continues"]
    end

    subgraph Modern ["Modern Mitigation (Angular 16+)"]
      direction LR
      M1["interval().pipe(...)"] --> M2["takeUntilDestroyed()"]
      M2 --> M3["Component Unmounted"]
      M3 -->|Framework auto-cleans| M4["Stream Terminated ✅ <br/> Zero Resource Bleed"]
    end

    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef legacy fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#64748b,stroke-dasharray:4;
    classDef modern fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    classDef danger fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337;
    classDef success fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534;

    class L1,L2 legacy;
    class L3 danger;
    class M1,M3 default;
    class M2 modern;
    class M4 success;
    style Legacy fill:#f1f5f9,stroke:#e2e8f0,stroke-dasharray:4;
    style Modern fill:#faf5ff,stroke:#e879f9,stroke-width:2px;
`],
            content: `<div class="mb-3">
  <p>Forgetting to unsubscribe from long-lived Observables is the most common source of memory leaks in Angular.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>AsyncPipe:</strong> The safest option — it auto-subscribes and auto-unsubscribes when the component is destroyed.</li>
    <li><strong>takeUntilDestroyed:</strong> Angular 16+ operator that automatically completes a stream when the component's destroy context fires. Must be called inside an injection context.</li>
    <li><strong>Manual unsubscribe:</strong> Store the <code>Subscription</code> and call <code>.unsubscribe()</code> in <code>ngOnDestroy</code> — verbose but always works.</li>
  </ul>
</div>`,
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

          // combineLatest, forkJoin & zip
          {
            heading: 'combineLatest, forkJoin & zip',
            mermaidDefinitions: [`
  graph TD
    %% Input Streams
    StreamA([Stream A]) --> FJ{"forkJoin"}
    StreamB([Stream B]) --> FJ
    
    StreamC([UI Filter 1]) --> CL{"combineLatest"}
    StreamD([UI Filter 2]) --> CL
    
    %% Operation Outcomes
    FJ -->|"Waits for A & B to COMPLETE"| FJ_Out["Emits ONE final combined object"]
    CL -->|"Reacts when C or D EMITS"| CL_Out["Re-emits latest live state constantly"]

    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef engine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef network fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;
    classDef reactive fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;

    class FJ,CL engine;
    class FJ_Out network;
    class CL_Out reactive;
`],
            content: `<div class="mb-3">
  <p>These operators combine multiple Observables into one. Choose based on timing and emission rules:</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>forkJoin:</strong> Waits for all Observables to <em>complete</em> and emits the last value from each. Perfect for parallel HTTP calls.</li>
    <li><strong>combineLatest:</strong> Emits whenever <em>any</em> source emits (after all have emitted at least once). Perfect for reactive form state or dashboard filters.</li>
    <li><strong>zip:</strong> Pairs emissions by index — emits only when <em>all</em> sources have a new value at the same index. Rarely used but precise.</li>
  </ul>
</div>`,
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

      // Signals (v17+)
      {
        version: 'signals',
        label: 'Signals (v17+)',
        sections: [

          // Signals, computed() & effect()
          {
            heading: 'Signals, computed() & effect()',
            mermaidDefinitions: [`
  graph TD
    %% Signal Primitives
    S["signal(value) <br/> Writable UI State"] -->|Auto-Tracked Dependencies| C["computed(...) <br/> Derived Read-Only State"]
    
    %% Side Effect Triggers
    S -->|Value Changes| E["effect(...) <br/> Execution Block"]
    C -->|Value Changes| E
    
    %% Output Context
    E -.-> E_Note["Triggers DOM operations, <br/> LocalStorage Sync, or logging"]

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef derived fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    classDef effect fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534;
    classDef contextNote fill:#f8fafc,stroke:#e2e8f0,stroke-dasharray: 4 4,color:#475569,font-size:12px;

    class S coreEngine;
    class C derived;
    class E effect;
    class E_Note contextNote;
`],
            content: `<div class="mb-3">
  <p>Signals are Angular's synchronous reactive primitives that replace the need for most RxJS patterns within components.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>signal():</strong> Writable reactive value. Read with <code>value()</code>, write with <code>.set()</code> or <code>.update()</code>.</li>
    <li><strong>computed():</strong> Derives a read-only signal from other signals. Result is cached and only recalculates when dependencies change.</li>
    <li><strong>effect():</strong> Side-effect runner — re-executes when any consumed signal changes. Useful for logging, syncing to localStorage, etc.</li>
  </ul>
</div>`,
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

          // toSignal() & toObservable()
          {
            heading: 'toSignal() & toObservable()',
            mermaidDefinitions: [`
  graph LR
    %% Node Definitions
    Rx["RxJS Observable <br/> (Async / Time-based Stream)"]
    Sig["Angular Signal <br/> (Synchronous UI State)"]

    %% Links (Quoted to prevent parenthesis syntax errors in v11+)
    Rx -- "toSignal()" --> Sig
    Sig -- "toObservable()" --> Rx

    %% Styling Architecture
    classDef rx fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a,font-weight:bold;
    classDef sig fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    class Rx rx;
    class Sig sig;
`],
            content: `<div class="mb-3">
  <p>The <code>@angular/core/rxjs-interop</code> package bridges Signals and RxJS, letting you mix both in the same component:</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>toSignal(obs$):</strong> Subscribes to an Observable inside a component and exposes its latest value as a read-only Signal. Auto-unsubscribes on destroy.</li>
    <li><strong>toObservable(signal):</strong> Converts a Signal into a cold Observable stream, useful when you need to pipe it through RxJS operators.</li>
  </ul>
</div>`,
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

          // Scenario: Signal vs RxJS — When to use which
          {
            heading: 'Scenario: Signal vs RxJS — When to use which',
            mermaidDefinitions: [`
  graph TD
    %% Decision Tree
    Decider{"State Architecture Decider"}
    
    %% Branches
    Decider -->|Template Logic & UI Sync State| Sig["Use Signals <br/> (signal, computed)"]
    Decider -->|Time-based, Events, Server HTTP| Rx["Use RxJS <br/> (Observables)"]
    Decider -->|Cross-Component State| Hyb["Hybrid: Service BehaviorSubject <br/> Component toSignal()"]

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef sig fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    classDef rx fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a,font-weight:bold;

    class Decider coreEngine;
    class Sig sig;
    class Rx rx;
    class Hyb default;
`],
            content: `<div class="mb-3">
  <h5>Scenario Question</h5>
  <p><em>"When would you use a Signal instead of a BehaviorSubject for shared component state?"</em></p>

  <h5>Solution</h5>
  <ul><li><strong>Use Signals</strong> for synchronous UI state (toggles, counts, form values, selected tab) — simpler API, no subscription management.</li><li><strong>Use RxJS (BehaviorSubject)</strong> when you need time-based operators (<code>debounceTime</code>, <code>delay</code>), multicasting to external subscribers, or complex async coordination across services.</li><li><strong>Hybrid:</strong> Keep HTTP streams as Observables in services; use <code>toSignal()</code> to consume them in components.</li></ul>
</div>`,
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

      // Scenario Prep
      {
        version: 'scenarios',
        label: 'Scenario Prep',
        sections: [

          // Preventing Duplicate HTTP Requests on Form Submit
          {
            heading: 'Preventing Duplicate HTTP Requests on Form Submit',
            mermaidDefinitions: [`
  graph TD
    %% Input Events
    C1["Click 1 (Valid)"] --> EM{"exhaustMap Broker"}
    
    %% First Execution
    EM -->|1. Executes Immediately| HTTP["HTTP POST Pending..."]
    
    %% Spam Click Protection
    C2["Click 2 (Spam Click)"] --> EM
    EM -->|2. Active Request Exists| Block["Ignores Click Completely 🛡️"]
    
    %% Resolution
    HTTP -->|3. Request Completes| Ready["Broker ready for new clicks"]

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef api fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;
    classDef block fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337;
    classDef ready fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534;

    class EM coreEngine;
    class HTTP api;
    class Block block;
    class Ready ready;
`],
            content: `<div class="mb-3">
  <h5>Scenario Question</h5>
  <p><em>"A user double-clicks the submit button and fires two identical HTTP requests. How do you prevent this?"</em></p>

  <h5>Solution</h5>
  <p>Use <code>exhaustMap</code> in an RxJS pipeline. Unlike <code>switchMap</code> (which cancels the first) or <code>mergeMap</code> (which runs both), <code>exhaustMap</code> ignores all new emissions while an inner Observable is still active:</p>
</div>`,
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

          // Race Condition in Typeahead Search
          {
            heading: 'Race Condition in Typeahead Search',
            mermaidDefinitions: [`
  graph TD
    %% Keypresses
    Q1["Keystroke: 'A'"] --> SM{"switchMap Broker"}
    SM -->|1. Fires Initial Request| H1["HTTP GET 'A' (Slow Response)"]
    
    %% Next Keypress
    Q2["Keystroke: 'AB'"] --> SM
    SM -->|2. Auto-Cancels Stale Query| Cancel["Cancels Request 'A' ⚡"]
    SM -->|3. Fires Fresh Request| H2["HTTP GET 'AB' (Fast Response)"]

    %% Output
    Cancel -.-> UI_Note["Prevents Stale 'A' data from overwriting 'AB' UI"]

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef api fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;
    classDef warn fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337;
    classDef contextNote fill:#f8fafc,stroke:#e2e8f0,stroke-dasharray: 4 4,color:#475569,font-size:12px;

    class SM coreEngine;
    class H1,H2 api;
    class Cancel warn;
    class UI_Note contextNote;
`],
            content: `<div class="mb-3">
  <h5>Scenario Question</h5>
  <p><em>"Your search API sometimes returns results out of order — older requests arrive after newer ones. How do you fix this?"</em></p>

  <h5>Solution</h5>
  <p>Use <code>switchMap</code>. It automatically cancels the previous in-flight HTTP request when a new search term arrives, ensuring you always get the result for the <em>latest</em> term. The key insight: <code>switchMap</code> unsubscribes from (and cancels) the previous inner Observable before creating a new one.</p>
</div>`,
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
  };
