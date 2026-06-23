export interface CodeFile {
  fileName: string;
  language: 'typescript' | 'xml' | 'css';
  code: string;
}

export interface Section {
  heading: string;
  content: string;
  codeFiles?: CodeFile[];
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


  // Core Concepts  
  {
    id: 'components-core',
    title: 'Components & Core',
    icon: 'bi-cpu',
    category: 'Core Concepts',
    versions: [
      {
        version: 'fundamentals',
        label: 'Fundamentals',
        sections: [
          {
            heading: 'Component Lifecycle Hooks',
            content: `<p>Angular components go through a lifecycle from creation to destruction. Implementing lifecycle interfaces hooks into these key moments:</p><ul><li><strong>ngOnChanges:</strong> Called before <code>ngOnInit</code> and when one or more data-bound input properties change. Receives a <code>SimpleChanges</code> object.</li><li><strong>ngOnInit:</strong> Initialize the component after Angular first displays the data-bound properties. Best place for initial data fetching.</li><li><strong>ngDoCheck:</strong> Detect and act upon changes that Angular can't or won't detect on its own.</li><li><strong>ngAfterContentInit / ngAfterContentChecked:</strong> Respond after Angular projects external content into the component's view.</li><li><strong>ngAfterViewInit / ngAfterViewChecked:</strong> Respond after Angular initializes the component's views and child views.</li><li><strong>ngOnDestroy:</strong> Cleanup just before Angular destroys the component. Unsubscribe from Observables, detach event handlers to prevent memory leaks.</li></ul><table class="table table-bordered mt-2 small"><thead><tr><th>Hook</th><th>Timing</th><th>Use Case / Comparison</th></tr></thead><tbody><tr><td><code>ngOnInit</code></td><td>After inputs are bound</td><td>Data fetching / Initial setup</td></tr><tr><td><code>ngAfterViewInit</code></td><td>After template renders</td><td>Accessing child DOM elements / jQuery / Charts</td></tr></tbody></table>`,
            codeFiles: [
              {
                fileName: 'user-profile.component.ts',
                language: 'typescript',
                code: `import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input } from '@angular/core';
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
      console.log('Name changed from',
        changes['name'].previousValue,
        'to',
        changes['name'].currentValue
      );
    }
  }

  ngOnInit() {
    // Best place for HTTP calls and initial setup
    console.log('UserProfile initialized with name:', this.name);
    // e.g. this.subscription = this.userService.getUser().subscribe(...)
  }

  ngOnDestroy() {
    // ALWAYS clean up to avoid memory leaks
    console.log('Cleaning up resources...');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}`
              }
            ]
          },
          {
            heading: 'Content Projection (ng-content)',
            content: `<p>Content projection allows you to insert (project) external HTML content into a designated spot in your component template.</p><ul><li><strong>Single-slot projection:</strong> Projects all content into a single <code>&lt;ng-content&gt;&lt;/ng-content&gt;</code> block.</li><li><strong>Multi-slot projection:</strong> Uses the <code>select</code> attribute (CSS selectors) to project specific content into designated slots.</li><li><strong>Accessing Projected Content:</strong> Use <code>&#64;ContentChild</code> or <code>&#64;ContentChildren</code> in the component class to query projected elements.</li></ul>`,
            codeFiles: [
              {
                fileName: 'card.component.html',
                language: 'xml',
                code: `<div class="card shadow-sm">
  <div class="card-header bg-primary text-white">
    <ng-content select="[card-header]"></ng-content>
  </div>
  <div class="card-body">
    <ng-content></ng-content>  </div>
  <div class="card-footer text-muted small">
    <ng-content select="[card-footer]"></ng-content>
  </div>
</div>`
              },
              {
                fileName: 'parent-usage.component.html',
                language: 'xml',
                code: `<app-card>
  <h5 card-header>User Profile</h5>

  <p>Name: Aditya Pranav</p>
  <p>Role: Frontend Engineer</p>

  <span card-footer>Last updated: June 2025</span>
</app-card>`
              }
            ]
          },
          {
            heading: 'Pipes & Data Transformation',
            content: `<p>Pipes are simple functions used in template expressions to accept an input value, transform it, and return a formatted output.</p><ul><li><strong>Pure Pipes:</strong> Called only when Angular detects a <strong>pure change</strong> in the input value (primitive change or reference change for objects). High performance, result is cached.</li><li><strong>Impure Pipes:</strong> Called on every change detection cycle, regardless of input changes. Can degrade performance; used for stateful transformations (e.g., <code>AsyncPipe</code>).</li></ul>`,
            codeFiles: [
              {
                fileName: 'exponential-strength.pipe.ts',
                language: 'typescript',
                code: `import { Pipe, PipeTransform } from '@angular/core';

// ── Custom Pure Pipe ──────────────────────────────────────
@Pipe({
  name: 'exponentialStrength',
  standalone: true,
  pure: true  // Default is true — cached, high-performance
})
export class ExponentialStrengthPipe implements PipeTransform {
  transform(value: number, exponent = 1): number {
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
<p>{{ obs$ | async }}</p>`
              }
            ]
          },
          {
            heading: 'ViewChild vs ViewChildren',
            content: `<p>These decorators provide access to child components, directives, or DOM elements within a component template:</p><ul><li><strong>&#64;ViewChild:</strong> Configures a view query that returns the first matching element or child component. Access it in or after <code>ngAfterViewInit</code>.</li><li><strong>&#64;ViewChildren:</strong> Configures a view query that returns a <code>QueryList</code> of all matching elements or child components. It updates automatically when the DOM changes.</li></ul>`,
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
    <input #itemInput type="text" placeholder="Search..." />

    <div #itemDiv *ngFor="let x of items">{{ x }}</div>
  \`
})
export class ListComponent implements AfterViewInit {
  items = ['Apple', 'Banana', 'Cherry'];

  // Grab the FIRST matching element
  @ViewChild('itemInput') inputEl!: ElementRef<HTMLInputElement>;

  // Grab ALL matching elements as a live QueryList
  @ViewChildren('itemDiv') divEls!: QueryList<ElementRef<HTMLDivElement>>;

  ngAfterViewInit() {
    // Safe to access DOM references here (after view is rendered)
    this.inputEl.nativeElement.focus();
    console.log('Total item divs:', this.divEls.length); // 3

    // React to DOM list changes (add/remove items)
    this.divEls.changes.subscribe(() => {
      console.log('DOM list changed, new length:', this.divEls.length);
    });
  }
}`
              }
            ]
          },
          {
            heading: 'Templates, Data Binding & Directives',
            content: `<p>Angular templates blend standard HTML with custom syntax to support data flow:</p><ul><li><strong>Interpolation:</strong> Displays dynamic values from class properties: <code>{{ value }}</code>.</li><li><strong>Property Binding:</strong> Sets child element properties: <code>[disabled]="isDisabled"</code>.</li><li><strong>Attribute Binding:</strong> Sets HTML attributes directly: <code>[attr.aria-label]="label"</code>.</li><li><strong>Class & Style Binding:</strong> Conditionally toggles styling: <code>[class.active]="isActive"</code>.</li><li><strong>Event Binding:</strong> Listens for browser events: <code>(click)="onClick()"</code>.</li><li><strong>Directives:</strong> Structural directives (like <code>*ngIf</code>, <code>*ngFor</code>) shape template structure, while Attribute directives (like <code>ngClass</code>, <code>ngStyle</code>) modify appearance.</li></ul>`,
            codeFiles: [
              {
                fileName: 'bindings.component.html',
                language: 'xml',
                code: `<h2>Welcome, {{ userName }}!</h2>
<p>Total items: {{ cart.length }}</p>

<button [disabled]="isLoading">Submit</button>
<img [src]="avatarUrl" [alt]="userName + ' avatar'" />

<td [attr.colspan]="colSpan">Merged Cell</td>
<button [attr.aria-label]="'Close ' + dialogTitle">✕</button>

<div [class.active]="isSelected" [class.error]="hasError">
  Status Badge
</div>
<p [style.color]="isError ? 'red' : 'green'">Status text</p>

<button (click)="addToCart(item)">Add to Cart</button>
<input (keyup.enter)="search()" (blur)="onBlur($event)" />

<input [(ngModel)]="searchQuery" placeholder="Search..." />

<p *ngIf="isLoggedIn; else guestTpl">Hello, {{ userName }}</p>
<ng-template #guestTpl><p>Please log in.</p></ng-template>

<li *ngFor="let item of items; let i = index; trackBy: trackById">
  {{ i + 1 }}. {{ item.name }}
</li>`
              }
            ]
          },
          {
            heading: 'Component Communication Patterns',
            content: `<p>Components communicate via direct parent-child or service channels:</p><ul><li><strong>Parent to Child:</strong> The parent binds properties to inputs (traditional <code>&#64;Input()</code> or modern Signal inputs).</li><li><strong>Child to Parent:</strong> The child emits events via outputs (traditional <code>&#64;Output() EventEmitter</code> or modern Signal outputs).</li><li><strong>Sibling / Non-related:</strong> Use a shared state service containing a BehaviorSubject or a shared Signal, injected in both components.</li></ul>`,
            codeFiles: [
              {
                fileName: 'component-communication.ts',
                language: 'typescript',
                code: `// ── PARENT → CHILD via @Input ─────────────────────────────
// child.component.ts
import { Component, Input, Output, EventEmitter, Injectable, signal } from '@angular/core';

@Component({ 
  selector: 'app-badge', 
  standalone: true,
  template: \`<span class="badge">{{ label }} ({{ count }})</span>\`
})
export class BadgeComponent {
  @Input() label = 'Items';
  @Input() count = 0;
}
// parent template: <app-badge [label]="'Cart'" [count]="cartItems.length" />

// ── CHILD → PARENT via @Output ────────────────────────────
// child.component.ts
@Component({ 
  selector: 'app-counter', 
  standalone: true,
  template: \`<button (click)="increment()">+1</button>\`
})
export class CounterComponent {
  @Output() valueChange = new EventEmitter<number>();
  private value = 0;

  increment() {
    this.value++;
    this.valueChange.emit(this.value); // notify parent
  }
}
// parent template: <app-counter (valueChange)="onCount($event)" />

// ── SIBLING / GLOBAL via Shared Service ───────────────────
@Injectable({ providedIn: 'root' })
export class CartService {
  private itemCount = signal(0);
  count = this.itemCount.asReadonly(); // public read-only

  addItem() { this.itemCount.update(n => n + 1); }
}
// Both Sibling A and Sibling B inject CartService and react to count()`
              }
            ]
          },
          {
            heading: 'Angular Material Integration',
            content: `<p>Popular components for UI rendering in Angular apps:</p><ul><li><strong>mat-tab-group:</strong> Render tabular view segments lazily to improve startup speed.</li><li><strong>mat-dialog:</strong> Spawn modals/overlay components, utilizing injection contexts to pass data between components.</li></ul>`,
            codeFiles: [
              {
                fileName: 'material-tabs.component.html',
                language: 'xml',
                code: `<mat-tab-group>
  <mat-tab label="Overview">
    <ng-template matTabContent>
      <app-overview />  </ng-template>
  </mat-tab>
  <mat-tab label="Settings">
    <ng-template matTabContent>
      <app-settings />
    </ng-template>
  </mat-tab>
</mat-tab-group>`
              },
              {
                fileName: 'material-dialog.component.ts',
                language: 'typescript',
                code: `// ── 2. mat-dialog (modal with data passing) ───────────────
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'app-parent-root',
  standalone: true,
  template: ''
})
export class ParentComponent {
  dialog = inject(MatDialog);

  openConfirm(userId: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { userId, message: 'Delete this user?' },
      width: '400px'
    });

    ref.afterClosed().subscribe(result => {
      if (result === 'confirm') this.deleteUser(userId);
    });
  }
  deleteUser(id: string) { /* ... */ }
}

// Inside ConfirmDialogComponent:
// constructor(@Inject(MAT_DIALOG_DATA) public data: {userId:string, message:string}) {}`
              }
            ]
          }
        ]
      },
      {
        version: '16_v17',
        label: 'Angular 16 & 17',
        sections: [
          {
            heading: 'Standalone Components Integration',
            content: `<p>In Angular 16, Standalone Components became the default and recommended way to build applications, removing the necessity of <code>NgModules</code>.</p><ul><li>Standalone components, directives, and pipes specify their dependencies directly using the <code>imports</code> array.</li><li>Simplifies the mental model, scaffolds lighter builds, and makes components directly reusable.</li><li>Applications are bootstrapped using <code>bootstrapApplication(RootComponent, config)</code> instead of module bootstrapping.</li></ul>`,
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
                code: `// ── main.ts — bootstrapping without AppModule ─────────────
// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter } from '@angular/router';
// import { routes } from './app.routes';
//
// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient()
//   ]
// });`
              }
            ]
          },
          {
            heading: 'New Built-in Control Flow (&#64;if, &#64;for, &#64;switch)',
            content: `<p>Angular 17 introduced a new built-in block syntax for control flow. It replaces the structural directives <code>*ngIf</code>, <code>*ngFor</code>, and <code>*ngSwitch</code>.</p><ul><li><strong>Performance:</strong> Built directly into the compiler, reducing execution overhead and boosting rendering speed by up to 90% in complex loops.</li><li><strong>Zero Imports:</strong> No need to import <code>CommonModule</code> or <code>NgIf</code>/<code>NgFor</code> into standalone components.</li><li><strong>&#64;empty support:</strong> Built-in block in <code>&#64;for</code> loops that renders placeholder content when the array is empty.</li><li><strong>Strict Tracking:</strong> The <code>track</code> expression is now required in <code>&#64;for</code> loops, preventing performance bugs from omitting <code>trackBy</code>.</li></ul>`,
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
          {
            heading: 'Lifecycle Optimization: afterRender and afterNextRender',
            content: `<p>Angular 17 introduced two new lifecycle hooks for executing operations safely in browser environments, particularly helpful when using Server-Side Rendering (SSR):</p><ul><li><strong>afterRender:</strong> Runs after every change detection cycle has finished rendering the page. Useful for DOM manipulation or measuring elements.</li><li><strong>afterNextRender:</strong> Runs exactly once after the next rendering cycle completes. Best for initializing third-party libraries that need access to the browser DOM.</li></ul>`,
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
    // Wire up Chart.js or similar library here
  }
}`
              }
            ]
          },
          {
            heading: 'Signal-based Inputs and Outputs',
            content: `<p>Angular 17 introduced signal-based component communication, making inputs and outputs fully reactive primitives.</p><ul><li><strong>Signal Inputs:</strong> Declared via <code>input()</code> or <code>input.required()</code>. They return a read-only Signal.</li><li><strong>Signal Outputs:</strong> Declared via <code>output()</code> or <code>outputFromObservable()</code>. Serves as a streamlined replacement for <code>&#64;Output() EventEmitter</code>.</li></ul>`,
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
      {
        version: 'v18_v19',
        label: 'Angular 18 & 19',
        sections: [
          {
            heading: 'Local Template Variables (&#64;let)',
            content: `<p>Angular 18 introduced the <code>&#64;let</code> declaration syntax in templates, allowing developers to declare variables locally inside component views.</p><ul><li><strong>Local Scope:</strong> Avoids repeating complex computations or async pipe bindings.</li><li><strong>Reactive binding:</strong> Safely stores intermediate results of expressions.</li><li><strong>Improved Type Safety:</strong> Type checking is fully supported by the Angular language service.</li></ul>`,
            codeFiles: [
              {
                fileName: 'legacy-approach.component.html',
                language: 'xml',
                code: `<div *ngIf="(userProfile$ | async) as user">
  <h3>{{ (userProfile$ | async)?.firstName }}</h3>
  <p>{{ (userProfile$ | async)?.email }}</p>
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
          {
            heading: 'Fallback Content for Content Projection',
            content: `<p>Angular 18 added built-in support for fallback content in <code>&lt;ng-content&gt;</code>. If no content is projected into the slot, the fallback content defined inside the tags will render.</p>`,
            codeFiles: [
              {
                fileName: 'dialog.component.html',
                language: 'xml',
                code: `<div class="modal-dialog">
  <div class="modal-header">
    <ng-content select="[dialog-title]">
      <h5 class="modal-title">Dialog</h5>
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
  <p>Loading your profile...</p>
</app-dialog>`
              }
            ]
          },
          {
            heading: 'View Transitions API Integration',
            content: `<p>Angular 19 introduced built-in support for the browser's native View Transitions API, enabling smooth page-to-page animated transitions during route navigation.</p><p>Enable it in <code>app.config.ts</code> by declaring <code>withViewTransitions()</code> inside <code>provideRouter</code>. In CSS, customize transitions using the <code>::view-transition-old</code> and <code>::view-transition-new</code> selectors.</p>`,
            codeFiles: [
              {
                fileName: 'app.config.ts',
                language: 'typescript',
                code: `// ── app.config.ts — Enable View Transitions ───────────────
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withViewTransitions({
        // Optional: skip transition on first navigation
        skipInitialTransition: true
      })
    )
  ]
};`
              },
              {
                fileName: 'styles.scss',
                language: 'css',
                code: `/* ── styles.scss — Customize the animation ────────────────── */
/* Fade-out old page view */
::view-transition-old(root) {
  animation: 200ms ease-in fade-out;
}
/* Slide-in new page view */
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
          }
        ]
      },
      {
        version: 'scenarios',
        label: 'Scenario Prep',
        sections: [
          {
            heading: 'Sorting Flicker in Lists',
            content: `<h5>Scenario Question:</h5><p><em>"Your &#64;for loop renders a table, but sorting or rearranging elements causes flickering in the UI. How do you optimize it?"</em></p><h5>Answer:</h5><p>Flickering happens when Angular cannot match DOM elements with array items, causing it to destroy and recreate DOM nodes instead of moving them. To fix this:</p><ol><li>Ensure the <code>track</code> expression points to a unique identifier (like <code>item.id</code>) rather than the loop index or the entire object.</li><li>Avoid using index <code>$index</code> as a track key if the list items can be re-ordered, filtered, or sorted, as the indices will map to different data objects, forcing DOM recreation.</li></ol>`,
            codeFiles: [
              {
                fileName: 'table.component.html',
                language: 'xml',
                code: `@for (row of tableData; track $index) {
  <tr><td>{{ row.name }}</td><td>{{ row.score }}</td></tr>
}

@for (row of tableData; track row.id) {
  <tr><td>{{ row.name }}</td><td>{{ row.score }}</td></tr>
}`
              },
              {
                fileName: 'table.component.ts',
                language: 'typescript',
                code: `// ── Component class ────────────────────────────────────────
import { Component, signal } from '@angular/core';

export class TableComponent {
  tableData = signal([
    { id: 'u1', name: 'Alice', score: 95 },
    { id: 'u2', name: 'Bob',   score: 72 },
    { id: 'u3', name: 'Carol', score: 88 },
  ]);

  sortByScore() {
    // Assign new array reference — Angular reconciles by id
    this.tableData.set([...this.tableData()].sort((a, b) => b.score - a.score));
    // With track row.id → Angular MOVES DOM nodes (no flicker)
    // With track $index → Angular DESTROYS + RECREATES (flicker!)
  }
}`
              }
            ]
          },
          {
            heading: 'Template updates miss role changes',
            content: `<h5>Scenario Question:</h5><p><em>"An &#64;if condition checks user.isAdmin, but the template doesn't update when the user role changes. How do you fix this?"</em></p><h5>Answer:</h5><p>If <code>user</code> is a standard mutable object, modifying its properties (e.g., <code>user.isAdmin = true</code>) does not trigger change detection in <code>OnPush</code> components since the object reference remains the same. Fixes:</p><ol><li>Use a <strong>Signal</strong> for the user state (e.g., <code>user = signal&lt;User&gt;(initialUser)</code>) and trigger updates via <code>user.set(...)</code> or <code>user.update(...)</code>.</li><li>If using standard fields, assign a new object reference to trigger change detection: <code>this.user = { ...this.user, isAdmin: true }</code>.</li></ol>`,
            codeFiles: [
              {
                fileName: 'role-demo.component.ts',
                language: 'typescript',
                code: `import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

interface User { name: string; isAdmin: boolean; }

@Component({
  selector: 'app-role-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // strict mode
  template: \`
    @if (user().isAdmin) {
      <span class="badge bg-danger">Admin Panel</span>
    } @else {
      <span class="badge bg-secondary">Viewer</span>
    }
    <button (click)="promoteToAdmin()">Promote</button>
  \`
})
export class RoleDemoComponent {
  user = signal<User>({ name: 'Alice', isAdmin: false });

  promoteToAdmin() {
    // ── Fix 1: Use signal.update() — triggers OnPush ──────
    this.user.update(u => ({ ...u, isAdmin: true }));

    // ── Fix 2 (plain object): New reference — triggers OnPush
    // this.user = { ...this.user, isAdmin: true };

    // ── WRONG: Mutation — OnPush won't detect this ─────────
    // this.user().isAdmin = true;  // ❌ reference unchanged!
  }
}`
              }
            ]
          },
          {
            heading: 'Refactoring legacy *ngSwitch to &#64;switch',
            content: `<h5>Scenario Question:</h5><p><em>"How would you refactor a legacy *ngSwitch to Angular 19's &#64;switch while preserving accessibility (ARIA labels)?"</em></p><h5>Answer:</h5><p>Modern control flow syntax (<code>&#64;switch</code>) is a direct structural replacement. Simply remove the outer <code>[ngSwitch]</code> binding and rewrite using the block format. ARIA attributes or roles remain untouched on container divs:</p>`,
            codeFiles: [
              {
                fileName: 'legacy-switch.component.html',
                language: 'xml',
                code: `<div [ngSwitch]="status" role="status" aria-live="polite">
  <p *ngSwitchCase="'loading'" aria-busy="true">
    <span class="spinner"></span> Loading...
  </p>
  <p *ngSwitchCase="'error'" class="text-danger">
    Something went wrong.
  </p>
  <p *ngSwitchCase="'empty'" class="text-muted">
    No data found.
  </p>
  <p *ngSwitchDefault class="text-success">
    Data loaded successfully!
  </p>
</div>`
              },
              {
                fileName: 'modern-switch.component.html',
                language: 'xml',
                code: `<div role="status" aria-live="polite">
  @switch (status) {
    @case ('loading') {
      <p aria-busy="true"><span class="spinner"></span> Loading...</p>
    }
    @case ('error') {
      <p class="text-danger">Something went wrong.</p>
    }
    @case ('empty') {
      <p class="text-muted">No data found.</p>
    }
    @default {
      <p class="text-success">Data loaded successfully!</p>
    }
  }
</div>`
              }
            ]
          },
          {
            heading: 'Dynamic Edit/View Modes without DOM duplication',
            content: `<h5>Scenario Question:</h5><p><em>"Design a template that toggles between edit and view modes using Signals without duplicating DOM elements or inputs."</em></p><h5>Answer:</h5><p>Avoid duplicating form elements inside separate <code>&#64;if</code> blocks. Instead, use a single input, bind its read-only status dynamically to a signal, and style it conditionally using active classes:</p>`,
            codeFiles: [
              {
                fileName: 'inline-edit.component.ts',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inline-edit',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <div class="form-group">
      <label class="fw-bold">Username</label>

      <input
        [readonly]="isViewMode()"
        [class.form-control-plaintext]="isViewMode()"
        [class.form-control]="!isViewMode()"
        [(ngModel)]="username"
        class="mb-2" />

      <button class="btn btn-sm btn-outline-primary" (click)="toggleMode()">
        <i [class]="isViewMode() ? 'bi bi-pencil' : 'bi bi-check-lg'"></i>
        {{ isViewMode() ? 'Edit' : 'Save' }}
      </button>
    </div>
  \`
})
export class InlineEditComponent {
  isViewMode = signal(true);
  username = 'AdityaPranav';

  toggleMode() {
    this.isViewMode.update(mode => !mode);
  }
}`
              }
            ]
          }
        ]
      }
    ]
  },


  // Routing & Forms
  {
    id: 'routing-forms',
    title: 'Routing & Forms',
    icon: 'bi-signpost-split',
    category: 'Navigation & Input',
    versions: [
      {
        version: 'fundamentals',
        label: 'Fundamentals',
        sections: [
          {
            heading: 'Router Setup & Route Definition',
            content: `
<p class="mb-4">Angular's router maps URL paths to components. Routes are defined as an array and provided to the app via <code>provideRouter(routes)</code>.</p>

<div class="row g-3 mb-2">
  <div class="col-12 col-md-6">
    <div class="p-3 border rounded-3 bg-light h-100 shadow-sm border-start border-4 border-primary">
      <div class="d-flex align-items-center mb-2">
        <i class="bi bi-signpost-split fs-4 text-primary me-2"></i>
        <h6 class="mb-0 fw-bold">Static Routes</h6>
      </div>
      <p class="small text-muted mb-0">Direct path-to-component mapping (e.g., <code>/about</code>).</p>
    </div>
  </div>

  <div class="col-12 col-md-6">
    <div class="p-3 border rounded-3 bg-light h-100 shadow-sm border-start border-4 border-success">
      <div class="d-flex align-items-center mb-2">
        <i class="bi bi-link-45deg fs-4 text-success me-2"></i>
        <h6 class="mb-0 fw-bold">Parameterized Routes</h6>
      </div>
      <p class="small text-muted mb-0">Use <code>:param</code> syntax to capture URL segments (e.g., <code>/products/:id</code>).</p>
    </div>
  </div>

  <div class="col-12 col-md-6">
    <div class="p-3 border rounded-3 bg-light h-100 shadow-sm border-start border-4 border-warning">
      <div class="d-flex align-items-center mb-2">
        <i class="bi bi-box-seam fs-4 text-warning me-2"></i>
        <h6 class="mb-0 fw-bold">Lazy Loading</h6>
      </div>
      <p class="small text-muted mb-0">Load a component subtree only when navigated to, reducing initial bundle size.</p>
    </div>
  </div>

  <div class="col-12 col-md-6">
    <div class="p-3 border rounded-3 bg-light h-100 shadow-sm border-start border-4 border-danger">
      <div class="d-flex align-items-center mb-2">
        <i class="bi bi-asterisk fs-4 text-danger me-2"></i>
        <h6 class="mb-0 fw-bold">Wildcard Route</h6>
      </div>
      <p class="small text-muted mb-0"><code>**</code> catches all unmatched paths (e.g., 404 pages) — <strong>always place it last</strong>.</p>
    </div>
  </div>
</div>
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
          {
            heading: 'Reading Route Params & Query Strings',
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
          {
            heading: 'Route Guards (canActivate, canDeactivate)',
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
          {
            heading: 'Template-Driven vs Reactive Forms',
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
    phone: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
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
      {
        version: 'advanced',
        label: 'Advanced',
        sections: [
          {
            heading: 'Lazy Loading & Code Splitting',
            content: `<p>Lazy loading defers the download of a component or route's JavaScript bundle until the user navigates to that route. This dramatically reduces initial load time.</p><ul><li><strong>loadComponent:</strong> Lazily loads a standalone component (Angular 15+).</li><li><strong>loadChildren:</strong> Lazily loads a child route configuration file.</li><li><strong>withPreloading:</strong> After the initial load, Angular quietly preloads lazy routes in the background so they feel instant when navigated to.</li></ul>`,
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
          {
            heading: 'Dynamic Forms with FormArray',
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
          {
            heading: 'Custom Validators',
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
  return /\s/.test(control.value) ? { noSpaces: true } : null;
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
      {
        version: 'scenarios',
        label: 'Scenario Prep',
        sections: [
          {
            heading: 'Preserving Form State on Back Navigation',
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