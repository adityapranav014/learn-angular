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
}`,
            language: `typescript`,
          },
          {
            heading: `Content Projection (ng-content)`,
            content: `<p>Content projection allows you to insert (project) external HTML content into a designated spot in your component template.</p><ul><li><strong>Single-slot projection:</strong> Projects all content into a single <code>&lt;ng-content&gt;&lt;/ng-content&gt;</code> block.</li><li><strong>Multi-slot projection:</strong> Uses the <code>select</code> attribute (CSS selectors) to project specific content into designated slots.</li><li><strong>Accessing Projected Content:</strong> Use <code>&#64;ContentChild</code> or <code>&#64;ContentChildren</code> in the component class to query projected elements.</li></ul>`,
            codeExample: `<!-- card.component.html — Multi-slot Content Projection -->
<div class="card shadow-sm">
  <div class="card-header bg-primary text-white">
    <ng-content select="[card-header]"></ng-content>
  </div>
  <div class="card-body">
    <ng-content></ng-content>  <!-- Default slot -->
  </div>
  <div class="card-footer text-muted small">
    <ng-content select="[card-footer]"></ng-content>
  </div>
</div>

<!-- ─── Usage in parent template ─── -->
<app-card>
  <h5 card-header>User Profile</h5>

  <!-- This lands in the default ng-content slot -->
  <p>Name: Aditya Pranav</p>
  <p>Role: Frontend Engineer</p>

  <span card-footer>Last updated: June 2025</span>
</app-card>`,
            language: `html`,
          },
          {
            heading: `Pipes & Data Transformation`,
            content: `<p>Pipes are simple functions used in template expressions to accept an input value, transform it, and return a formatted output.</p><ul><li><strong>Pure Pipes:</strong> Called only when Angular detects a <strong>pure change</strong> in the input value (primitive change or reference change for objects). High performance, result is cached.</li><li><strong>Impure Pipes:</strong> Called on every change detection cycle, regardless of input changes. Can degrade performance; used for stateful transformations (e.g., <code>AsyncPipe</code>).</li></ul>`,
            codeExample: `import { Pipe, PipeTransform } from '@angular/core';

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
}

// ── Usage in template ─────────────────────────────────────
// {{ 2 | exponentialStrength:10 }}  →  1024

// ── Built-in pipe examples ────────────────────────────────
// {{ 'hello world' | titlecase }}        →  Hello World
// {{ 1234567.89  | currency:'INR':'symbol':'1.0-0' }}  →  ₹12,34,568
// {{ today | date:'dd MMM yyyy' }}       →  22 Jun 2025
// {{ largeObj    | json }}               →  pretty JSON
// {{ obs$        | async }}              →  auto-subscribes`,
            language: `typescript`,
          },
          {
            heading: `ViewChild vs ViewChildren`,
            content: `<p>These decorators provide access to child components, directives, or DOM elements within a component template:</p><ul><li><strong>&#64;ViewChild:</strong> Configures a view query that returns the first matching element or child component. Access it in or after <code>ngAfterViewInit</code>.</li><li><strong>&#64;ViewChildren:</strong> Configures a view query that returns a <code>QueryList</code> of all matching elements or child components. It updates automatically when the DOM changes.</li></ul>`,
            codeExample: `import {
  Component, ViewChild, ViewChildren,
  ElementRef, QueryList, AfterViewInit
} from '@angular/core';

@Component({
  selector: 'app-list',
  standalone: true,
  template: \`
    <!-- Template reference variable #itemInput -->
    <input #itemInput type="text" placeholder="Search..." />

    <!-- Multiple elements share the same ref label -->
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
}`,
            language: `typescript`,
          },
          {
            heading: `Templates, Data Binding & Directives`,
            content: `<p>Angular templates blend standard HTML with custom syntax to support data flow:</p><ul><li><strong>Interpolation:</strong> Displays dynamic values from class properties: <code>{{ value }}</code>.</li><li><strong>Property Binding:</strong> Sets child element properties: <code>[disabled]="isDisabled"</code>.</li><li><strong>Attribute Binding:</strong> Sets HTML attributes directly: <code>[attr.aria-label]="label"</code>.</li><li><strong>Class & Style Binding:</strong> Conditionally toggles styling: <code>[class.active]="isActive"</code>.</li><li><strong>Event Binding:</strong> Listens for browser events: <code>(click)="onClick()"</code>.</li><li><strong>Directives:</strong> Structural directives (like <code>*ngIf</code>, <code>*ngFor</code>) shape template structure, while Attribute directives (like <code>ngClass</code>, <code>ngStyle</code>) modify appearance.</li></ul>`,
            codeExample: `<!-- ── 1. Interpolation ──────────────────────────────── -->
<h2>Welcome, {{ userName }}!</h2>
<p>Total items: {{ cart.length }}</p>

<!-- ── 2. Property Binding ─────────────────────────────── -->
<button [disabled]="isLoading">Submit</button>
<img [src]="avatarUrl" [alt]="userName + ' avatar'" />

<!-- ── 3. Attribute Binding (for non-DOM properties) ────── -->
<td [attr.colspan]="colSpan">Merged Cell</td>
<button [attr.aria-label]="'Close ' + dialogTitle">✕</button>

<!-- ── 4. Class & Style Binding ─────────────────────────── -->
<div [class.active]="isSelected" [class.error]="hasError">
  Status Badge
</div>
<p [style.color]="isError ? 'red' : 'green'">Status text</p>

<!-- ── 5. Event Binding ─────────────────────────────────── -->
<button (click)="addToCart(item)">Add to Cart</button>
<input (keyup.enter)="search()" (blur)="onBlur($event)" />

<!-- ── 6. Two-Way Binding (banana-in-a-box) ─────────────── -->
<input [(ngModel)]="searchQuery" placeholder="Search..." />

<!-- ── 7. Structural Directives ─────────────────────────── -->
<p *ngIf="isLoggedIn; else guestTpl">Hello, {{ userName }}</p>
<ng-template #guestTpl><p>Please log in.</p></ng-template>

<li *ngFor="let item of items; let i = index; trackBy: trackById">
  {{ i + 1 }}. {{ item.name }}
</li>`,
            language: `html`,
          },
          {
            heading: `Component Communication Patterns`,
            content: `<p>Components communicate via direct parent-child or service channels:</p><ul><li><strong>Parent to Child:</strong> The parent binds properties to inputs (traditional <code>&#64;Input()</code> or modern Signal inputs).</li><li><strong>Child to Parent:</strong> The child emits events via outputs (traditional <code>&#64;Output() EventEmitter</code> or modern Signal outputs).</li><li><strong>Sibling / Non-related:</strong> Use a shared state service containing a BehaviorSubject or a shared Signal, injected in both components.</li></ul>`,
            codeExample: `// ── PARENT → CHILD via @Input ─────────────────────────────
// child.component.ts
@Component({ selector: 'app-badge', standalone: true,
  template: \`<span class="badge">{{ label }} ({{ count }})</span>\`
})
export class BadgeComponent {
  @Input() label = 'Items';
  @Input() count = 0;
}
// parent template: <app-badge [label]="'Cart'" [count]="cartItems.length" />

// ── CHILD → PARENT via @Output ────────────────────────────
// child.component.ts
@Component({ selector: 'app-counter', standalone: true,
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
// parent template:
// <app-counter (valueChange)="onCount($event)" />

// ── SIBLING / GLOBAL via Shared Service ───────────────────
@Injectable({ providedIn: 'root' })
export class CartService {
  private itemCount = signal(0);
  count = this.itemCount.asReadonly(); // public read-only

  addItem() { this.itemCount.update(n => n + 1); }
}
// Both Sibling A and Sibling B inject CartService and react to count()`,
            language: `typescript`,
          },
          {
            heading: `Angular Material Integration`,
            content: `<p>Popular components for UI rendering in Angular apps:</p><ul><li><strong>mat-tab-group:</strong> Render tabular view segments lazily to improve startup speed.</li><li><strong>mat-dialog:</strong> Spawn modals/overlay components, utilizing injection contexts to pass data between components.</li></ul>`,
            codeExample: `// ── 1. mat-tab-group (lazy content rendering) ─────────────
// template:
// <mat-tab-group>
//   <mat-tab label="Overview">
//     <ng-template matTabContent>
//       <app-overview />  <!-- loaded only when tab is active -->
//     </ng-template>
//   </mat-tab>
//   <mat-tab label="Settings">
//     <ng-template matTabContent>
//       <app-settings />
//     </ng-template>
//   </mat-tab>
// </mat-tab-group>

// ── 2. mat-dialog (modal with data passing) ───────────────
import { MatDialog } from '@angular/material/dialog';
import { inject } from '@angular/core';

// Opening the dialog and passing data:
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
// constructor(@Inject(MAT_DIALOG_DATA) public data: {userId:string, message:string}) {}`,
            language: `typescript`,
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
export class DashboardComponent {}

// ── main.ts — bootstrapping without AppModule ─────────────
// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter } from '@angular/router';
// import { routes } from './app.routes';
//
// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient()
//   ]
// });`,
            language: `typescript`,
          },
          {
            heading: `New Built-in Control Flow (&#64;if, &#64;for, &#64;switch)`,
            content: `<p>Angular 17 introduced a new built-in block syntax for control flow. It replaces the structural directives <code>*ngIf</code>, <code>*ngFor</code>, and <code>*ngSwitch</code>.</p><ul><li><strong>Performance:</strong> Built directly into the compiler, reducing execution overhead and boosting rendering speed by up to 90% in complex loops.</li><li><strong>Zero Imports:</strong> No need to import <code>CommonModule</code> or <code>NgIf</code>/<code>NgFor</code> into standalone components.</li><li><strong>&#64;empty support:</strong> Built-in block in <code>&#64;for</code> loops that renders placeholder content when the array is empty.</li><li><strong>Strict Tracking:</strong> The <code>track</code> expression is now required in <code>&#64;for</code> loops, preventing performance bugs from omitting <code>trackBy</code>.</li></ul>`,
            codeExample: `<!-- ── @if / @else if / @else ───────────────────────────── -->
@if (isLoggedIn) {
  <p>Welcome back, {{ user.name }}!</p>
} @else if (isPending) {
  <p>Account verification pending...</p>
} @else {
  <button (click)="login()">Log In</button>
}

<!-- ── @for with track (mandatory) + @empty fallback ─────── -->
@for (item of cartItems; track item.id) {
  <div class="cart-item">
    <span>{{ item.name }}</span>
    <strong>₹{{ item.price }}</strong>
  </div>
} @empty {
  <p class="text-muted">Your cart is empty. Add some items!</p>
}

<!-- ── @switch / @case / @default ───────────────────────── -->
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
}`,
            language: `html`,
          },
          {
            heading: `Lifecycle Optimization: afterRender and afterNextRender`,
            content: `<p>Angular 17 introduced two new lifecycle hooks for executing operations safely in browser environments, particularly helpful when using Server-Side Rendering (SSR):</p><ul><li><strong>afterRender:</strong> Runs after every change detection cycle has finished rendering the page. Useful for DOM manipulation or measuring elements.</li><li><strong>afterNextRender:</strong> Runs exactly once after the next rendering cycle completes. Best for initializing third-party libraries that need access to the browser DOM.</li></ul>`,
            codeExample: `import { Component, ElementRef, viewChild, afterNextRender, afterRender } from '@angular/core';

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
    // Use for continuous DOM measurement (e.g. resize)
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
}`,
            language: `typescript`,
          },
          {
            heading: `Signal-based Inputs and Outputs`,
            content: `<p>Angular 17 introduced signal-based component communication, making inputs and outputs fully reactive primitives.</p><ul><li><strong>Signal Inputs:</strong> Declared via <code>input()</code> or <code>input.required()</code>. They return a read-only Signal.</li><li><strong>Signal Outputs:</strong> Declared via <code>output()</code> or <code>outputFromObservable()</code>. Serves as a streamlined replacement for <code>&#64;Output() EventEmitter</code>.</li></ul>`,
            codeExample: `import { Component, input, output, computed } from '@angular/core';

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
  title  = input.required<string>();      // required — no default
  price  = input<number>(0);              // optional with default
  category = input<string>('General');

  // Derived computed value from multiple inputs
  subtitle = computed(() => \`\${this.category()} · ₹\${this.price()}\`);

  // Signal output — replaces @Output() EventEmitter<string>
  purchased = output<string>();

  buy() {
    this.purchased.emit(this.title()); // emit product name
  }
}

// ── Parent Template ───────────────────────────────────────
// <app-product-card
//   title="Laptop Pro"
//   [price]="79999"
//   category="Electronics"
//   (purchased)="onPurchase($event)" />`,
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
            codeExample: `<!-- ── Without @let — async pipe repeated 3 times ───────── -->
<!-- BAD: userProfile$ | async called multiple times -->
<div *ngIf="(userProfile$ | async) as user">
  <h3>{{ (userProfile$ | async)?.firstName }}</h3>
  <p>{{ (userProfile$ | async)?.email }}</p>
</div>

<!-- ── With @let — clean and efficient (Angular 18+) ─────── -->
@let user = userProfile$ | async;
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
</div>`,
            language: `html`,
          },
          {
            heading: `Fallback Content for Content Projection`,
            content: `<p>Angular 18 added built-in support for fallback content in <code>&lt;ng-content&gt;</code>. If no content is projected into the slot, the fallback content defined inside the tags will render.</p>`,
            codeExample: `<!-- ── dialog.component.html ─────────────────────────────── -->
<div class="modal-dialog">
  <div class="modal-header">
    <!-- Fallback: shows "Dialog" if parent doesn't project a title -->
    <ng-content select="[dialog-title]">
      <h5 class="modal-title">Dialog</h5>
    </ng-content>
  </div>

  <div class="modal-body">
    <!-- No fallback — body MUST be projected by parent -->
    <ng-content></ng-content>
  </div>

  <div class="modal-footer">
    <!-- Fallback: default "Close" button if no actions projected -->
    <ng-content select="[dialog-actions]">
      <button class="btn btn-secondary" (click)="close()">Close</button>
    </ng-content>
  </div>
</div>

<!-- ── Usage 1: Custom title + actions ───────────────────── -->
<app-dialog>
  <h5 dialog-title>Confirm Deletion</h5>
  <p>Are you sure you want to delete this record?</p>
  <div dialog-actions>
    <button class="btn btn-danger">Delete</button>
    <button class="btn btn-secondary">Cancel</button>
  </div>
</app-dialog>

<!-- ── Usage 2: Only body — fallback title & buttons appear ─ -->
<app-dialog>
  <p>Loading your profile...</p>
</app-dialog>`,
            language: `html`,
          },
          {
            heading: `View Transitions API Integration`,
            content: `<p>Angular 19 introduced built-in support for the browser's native View Transitions API, enabling smooth page-to-page animated transitions during route navigation.</p><p>Enable it in <code>app.config.ts</code> by declaring <code>withViewTransitions()</code> inside <code>provideRouter</code>. In CSS, customize transitions using the <code>::view-transition-old</code> and <code>::view-transition-new</code> selectors.</p>`,
            codeExample: `// ── app.config.ts — Enable View Transitions ───────────────
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
};

/* ── styles.scss — Customize the animation ────────────────── */
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
            heading: `Sorting Flicker in Lists`,
            content: `<h5>Scenario Question:</h5><p><em>"Your &#64;for loop renders a table, but sorting or rearranging elements causes flickering in the UI. How do you optimize it?"</em></p><h5>Answer:</h5><p>Flickering happens when Angular cannot match DOM elements with array items, causing it to destroy and recreate DOM nodes instead of moving them. To fix this:</p><ol><li>Ensure the <code>track</code> expression points to a unique identifier (like <code>item.id</code>) rather than the loop index or the entire object.</li><li>Avoid using index <code>$index</code> as a track key if the list items can be re-ordered, filtered, or sorted, as the indices will map to different data objects, forcing DOM recreation.</li></ol>`,
            codeExample: `<!-- ── BAD: tracking by $index causes full re-render on sort ─ -->
@for (row of tableData; track $index) {
  <tr><td>{{ row.name }}</td><td>{{ row.score }}</td></tr>
}

<!-- ── GOOD: track by unique stable ID — DOM nodes are moved ─ -->
@for (row of tableData; track row.id) {
  <tr><td>{{ row.name }}</td><td>{{ row.score }}</td></tr>
}

<!-- ── Component class ──────────────────────────────────────── -->
<!--
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
}
-->`,
            language: `html`,
          },
          {
            heading: `Template updates miss role changes`,
            content: `<h5>Scenario Question:</h5><p><em>"An &#64;if condition checks user.isAdmin, but the template doesn't update when the user role changes. How do you fix this?"</em></p><h5>Answer:</h5><p>If <code>user</code> is a standard mutable object, modifying its properties (e.g., <code>user.isAdmin = true</code>) does not trigger change detection in <code>OnPush</code> components since the object reference remains the same. Fixes:</p><ol><li>Use a <strong>Signal</strong> for the user state (e.g., <code>user = signal&lt;User&gt;(initialUser)</code>) and trigger updates via <code>user.set(...)</code> or <code>user.update(...)</code>.</li><li>If using standard fields, assign a new object reference to trigger change detection: <code>this.user = { ...this.user, isAdmin: true }</code>.</li></ol>`,
            codeExample: `import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

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
}`,
            language: `typescript`,
          },
          {
            heading: `Refactoring legacy *ngSwitch to &#64;switch`,
            content: `<h5>Scenario Question:</h5><p><em>"How would you refactor a legacy *ngSwitch to Angular 19's &#64;switch while preserving accessibility (ARIA labels)?"</em></p><h5>Answer:</h5><p>Modern control flow syntax (<code>&#64;switch</code>) is a direct structural replacement. Simply remove the outer <code>[ngSwitch]</code> binding and rewrite using the block format. ARIA attributes or roles remain untouched on container divs:</p>`,
            codeExample: `<!-- ── BEFORE: Legacy *ngSwitch (Angular < 17) ────────────── -->
<div [ngSwitch]="status" role="status" aria-live="polite">
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
</div>

<!-- ── AFTER: Modern @switch (Angular 17+) ────────────────── -->
<!-- ARIA attributes stay on the wrapper — nothing changes -->
<div role="status" aria-live="polite">
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
</div>`,
            language: `html`,
          },
          {
            heading: `Dynamic Edit/View Modes without DOM duplication`,
            content: `<h5>Scenario Question:</h5><p><em>"Design a template that toggles between edit and view modes using Signals without duplicating DOM elements or inputs."</em></p><h5>Answer:</h5><p>Avoid duplicating form elements inside separate <code>&#64;if</code> blocks. Instead, use a single input, bind its read-only status dynamically to a signal, and style it conditionally using active classes:</p>`,
            codeExample: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inline-edit',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <div class="form-group">
      <label class="fw-bold">Username</label>

      <!-- Single input element — behavior changes via signal -->
      <input
        [readonly]="isViewMode()"
        [class.form-control-plaintext]="isViewMode()"
        [class.form-control]="!isViewMode()"
        [(ngModel)]="username"
        class="mb-2" />

      <!-- Button label and icon change based on mode -->
      <button class="btn btn-sm btn-outline-primary" (click)="toggleMode()">
        <i [class]="isViewMode() ? 'bi bi-pencil' : 'bi bi-check-lg'"></i>
        {{ isViewMode() ? 'Edit' : 'Save' }}
      </button>
    </div>
  \`
})
export class InlineEditComponent {
  isViewMode = signal(true);   // start in view mode
  username = 'aditya_pranav';  // current value

  toggleMode() {
    this.isViewMode.update(v => !v);
    if (this.isViewMode()) {
      console.log('Saved username:', this.username);
    }
  }
}`,
            language: `typescript`,
          },
          {
            heading: `Refactoring Bloated Components`,
            content: `<h5>Scenario Question:</h5><p><em>"What is your strategy for refactoring a bloated Angular component?"</em></p><h5>Answer:</h5><p>Bloated components degrade performance and maintainability. Apply the following steps:</p><ol><li><strong>Single Responsibility:</strong> Split business logic into dedicated services (e.g., form validation, state management, HTTP requests).</li><li><strong>Component Decomposability:</strong> Break down the template into smaller child components (e.g., header, sidebar, item list). Use parent-child communication patterns.</li><li><strong>Pure Utilities:</strong> Move helper functions that don't depend on component state into static TypeScript helper files.</li><li><strong>Change Strategy:</strong> Switch to <code>OnPush</code> change detection to isolate re-render cycles.</li></ol>`,
            codeExample: `// ── BEFORE: Bloated component (anti-pattern) ──────────────
@Component({ template: \`... 500 lines of HTML ...\` })
export class DashboardComponent {
  users: User[] = [];
  orders: Order[] = [];
  // HTTP, validation, sorting, filtering all in one class...
  loadUsers() { /* http call */ }
  validateForm() { /* 100 lines */ }
  sortOrders() { /* 50 lines */ }
  formatCurrency(v: number) { return '₹' + v; } // util?!
}

// ── AFTER: Decomposed and maintainable ────────────────────

// 1. Extract service (business logic)
@Injectable({ providedIn: 'root' })
export class UserService {
  private users = signal<User[]>([]);
  getUsers = this.users.asReadonly();
  load() { this.http.get<User[]>('/api/users')
    .subscribe(u => this.users.set(u)); }
  constructor(private http: HttpClient) {}
}

// 2. Split template into focused child components
// <app-user-list [users]="users()" />
// <app-order-summary [orders]="orders()" />
// <app-dashboard-header [title]="'Dashboard'" />

// 3. Move pure utility to helpers/currency.util.ts
// export const formatINR = (v: number) => '₹' + v.toLocaleString('en-IN');

// 4. Shell component is now thin with OnPush
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<app-user-list /><app-order-summary />\`
})
export class DashboardComponent {
  userService = inject(UserService);
  ngOnInit() { this.userService.load(); }
}`,
            language: `typescript`,
          },
          {
            heading: `Enterprise Component Architecture & Scalability`,
            content: `<h5>Scenario Question:</h5><p><em>"How would you structure a large-scale Angular application to maintain modularity and scalability as features grow?"</em></p><h5>Answer:</h5><p>Adopt a <strong>Feature-Based Modular Architecture</strong> or <strong>Monorepo structure</strong> (Nx):</p><ul><li>Organize code by feature domains (e.g. <code>features/billing</code>, <code>features/auth</code>), where each domain contains its own components, routes, and services.</li><li>Separate reusable presentation UI components (dumb components) from state-managing containers (smart components).</li><li>Use path mappings (aliases) inside <code>tsconfig.json</code> to prevent deeply nested relative paths (e.g. <code>import { Auth } from '@core/auth'</code>).</li><li>Enforce strict unidirectional dependency rules (features cannot import from other features, only from shared core libraries).</li></ul>`,
            codeExample: `// ── Recommended folder structure ──────────────────────────
// src/
// ├── app/
// │   ├── core/               ← singleton services, interceptors
// │   │   ├── auth/
// │   │   └── http/
// │   ├── shared/             ← reusable dumb components, pipes, directives
// │   │   ├── components/
// │   │   └── pipes/
// │   └── features/           ← feature domains (lazy-loaded)
// │       ├── billing/
// │       │   ├── billing.routes.ts
// │       │   ├── billing.service.ts
// │       │   └── components/
// │       └── dashboard/
// │           ├── dashboard.routes.ts
// │           └── components/

// ── tsconfig.json — path aliases ──────────────────────────
// {
//   "compilerOptions": {
//     "paths": {
//       "@core/*":    ["src/app/core/*"],
//       "@shared/*":  ["src/app/shared/*"],
//       "@features/*":["src/app/features/*"]
//     }
//   }
// }

// ── app.routes.ts — lazy loading feature routes ───────────
export const routes: Routes = [
  {
    path: 'billing',
    loadChildren: () =>
      import('./features/billing/billing.routes')
        .then(m => m.BILLING_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes')
        .then(m => m.DASHBOARD_ROUTES)
  }
];`,
            language: `typescript`,
          },
          {
            heading: `Custom Web Component Bindings`,
            content: `<h5>Scenario Question:</h5><p><em>"How can you integrate third-party non-Angular web components into your templates?"</em></p><h5>Answer:</h5><p>Declare <code>CUSTOM_ELEMENTS_SCHEMA</code> in your component's or module's <code>schemas</code> array. This tells the Angular compiler to ignore unrecognized HTML tags (which represent custom web components) and permits standard data binding and event binding directly on them.</p>`,
            codeExample: `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { signal } from '@angular/core';

@Component({
  selector: 'app-web-comp-wrapper',
  standalone: true,
  // CUSTOM_ELEMENTS_SCHEMA: tells Angular to ignore unknown tags
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <!-- <my-custom-slider> is a third-party Web Component -->
    <my-custom-slider
      [value]="opacity()"
      [min]="0"
      [max]="100"
      (slidechange)="onSlide($event)">
    </my-custom-slider>

    <p>Current opacity: {{ opacity() }}%</p>

    <!-- Another example: Google Maps Web Component -->
    <gmp-map center="28.6139,77.2090" zoom="12">
      <gmp-advanced-marker position="28.6139,77.2090" />
    </gmp-map>
  \`
})
export class WebCompWrapperComponent {
  opacity = signal(50);

  onSlide(event: Event) {
    const detail = (event as CustomEvent).detail;
    this.opacity.set(detail.value);
  }
}`,
            language: `typescript`,
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
            codeExample: `import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';

// ── Observable (lazy, cold) ───────────────────────────────
import { Observable } from 'rxjs';
const data$ = new Observable<number>(observer => {
  observer.next(1);
  observer.next(2);
  observer.complete();
});
data$.subscribe(v => console.log('Received:', v)); // 1, 2

// ── Subject (hot, multicast) ──────────────────────────────
const clicks$ = new Subject<string>();
clicks$.subscribe(v => console.log('Sub A:', v));
clicks$.subscribe(v => console.log('Sub B:', v));
clicks$.next('click'); // Both A and B receive "click"

// ── BehaviorSubject (stores latest value) ─────────────────
const userState = new BehaviorSubject<{ name: string }>({ name: 'Guest' });

// Late subscriber immediately gets the CURRENT value
userState.subscribe(state => console.log('Current user:', state.name));
// Output: "Current user: Guest"

userState.next({ name: 'Aditya' });
// Output: "Current user: Aditya"

// ── ReplaySubject (replays last N values) ─────────────────
const replay$ = new ReplaySubject<number>(2); // buffer last 2
replay$.next(10);
replay$.next(20);
replay$.next(30);
replay$.subscribe(v => console.log('Replay:', v)); // 20, 30`,
            language: `typescript`,
          },
          {
            heading: `Creating Custom RxJS Operators`,
            content: `<p>You can create custom RxJS operators by writing a function that returns an RxJS operator function (which takes an Observable and returns a new Observable).</p>`,
            codeExample: `import { Observable, pipe } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

// ── Custom operator 1: Filter out null/undefined and map ──
export function filterNilAndMap<T, R>(mapFn: (val: T) => R) {
  return (source$: Observable<T | null | undefined>): Observable<R> => {
    return source$.pipe(
      filter((val): val is T => val !== null && val !== undefined),
      map(mapFn)
    );
  };
}

// ── Custom operator 2: Log each emission (debug helper) ───
export function debug<T>(label: string) {
  return tap<T>({
    next:     val => console.log(\`[\${label}] next:\`, val),
    error:    err => console.error(\`[\${label}] error:\`, err),
    complete: ()  => console.log(\`[\${label}] complete\`)
  });
}

// ── Usage ─────────────────────────────────────────────────
import { of } from 'rxjs';

of(null, 1, undefined, 2, null, 3).pipe(
  filterNilAndMap(v => v * 10),
  debug('result')
).subscribe(); // logs: 10, 20, 30`,
            language: `typescript`,
          },
          {
            heading: `Observables vs Promises`,
            content: `<p>Key differences between Observables and Promises:</p><table class="table table-bordered mt-2 small"><thead><tr><th>Feature</th><th>Promise</th><th>Observable</th></tr></thead><tbody><tr><td><strong>Emission</strong></td><td>Single value (resolve or reject)</td><td>Multiple values over time (0 to many)</td></tr><tr><td><strong>Execution</strong></td><td>Eager (runs immediately on creation)</td><td>Lazy (runs only when subscribed)</td></tr><tr><td><strong>Cancellation</strong></td><td>Non-cancellable</td><td>Cancellable (via unsubscribe)</td></tr><tr><td><strong>Operators</strong></td><td>No built-in operators</td><td>Rich set of operators (map, filter, merge, etc.)</td></tr></tbody></table>`,
            codeExample: `import { Observable, from, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

// ── Promise (eager, resolves once) ────────────────────────
const promise = new Promise<string>((resolve) => {
  console.log('Promise executes immediately!');  // runs now
  setTimeout(() => resolve('Done!'), 1000);
});
promise.then(val => console.log(val)); // waits 1s → "Done!"

// ── Observable (lazy, runs on subscribe) ──────────────────
const observable = new Observable<string>(observer => {
  console.log('Observable executes only when subscribed!');
  observer.next('First value');
  observer.next('Second value');
  setTimeout(() => {
    observer.next('Third (async)');
    observer.complete();
  }, 1000);
});
// Nothing runs yet — no console.log until we subscribe:
const sub = observable.subscribe({
  next:     v => console.log('Received:', v),
  complete: () => console.log('Stream ended')
});

// ── Cancellation — only Observables support this ──────────
setTimeout(() => sub.unsubscribe(), 500); // cancels before 3rd value

// ── Convert Promise ↔ Observable ──────────────────────────
const fromPromise$ = from(fetch('/api/user').then(r => r.json()));
const toPromise    = of(42).pipe(take(1)).toPromise();`,
            language: `typescript`,
          },
          {
            heading: `Memory Leaks & Unsubscription`,
            content: `<p>Subscribing to Observables creates a subscription that remains in memory even after the component is destroyed. Failing to unsubscribe causes memory leaks. Mitigate this by:</p><ol><li>Calling <code>.unsubscribe()</code> inside <code>ngOnDestroy</code>.</li><li>Using the <code>async</code> pipe in templates (handles subscriptions and unsubscriptions automatically).</li><li>Using operators like <code>take(1)</code>, <code>takeUntil()</code>, or the modern <code>takeUntilDestroyed()</code> helper.</li></ol>`,
            codeExample: `import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// ── Method 1: takeUntil with destroy$ Subject ──────────────
@Component({ selector: 'app-a', standalone: true,
  template: \`<p>Timer: {{ tick }}</p>\`
})
export class MethodOneComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  tick = 0;

  ngOnInit() {
    interval(1000).pipe(
      takeUntil(this.destroy$) // auto-completes when destroy$ emits
    ).subscribe(n => this.tick = n);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ── Method 2: takeUntilDestroyed (Angular 16+) ────────────
// Cleaner — no ngOnDestroy needed!
@Component({ selector: 'app-b', standalone: true,
  template: \`<p>Timer: {{ tick }}</p>\`
})
export class MethodTwoComponent implements OnInit {
  tick = 0;

  ngOnInit() {
    interval(1000).pipe(
      takeUntilDestroyed() // must be called in injection context
    ).subscribe(n => this.tick = n);
  }
}

// ── Method 3: async pipe in template (zero boilerplate) ───
// timer$ = interval(1000); // in component class
// Template: <p>Timer: {{ timer$ | async }}</p>
// Angular automatically subscribes and unsubscribes!`,
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
  standalone: true,
  template: \`
    <div class="card p-4 text-center">
      <h3>Count: {{ count() }}</h3>
      <p class="text-muted">Double: {{ doubleCount() }}</p>
      <p class="text-muted">Is Even: {{ isEven() }}</p>

      <button class="btn btn-primary me-2" (click)="increment()">+1</button>
      <button class="btn btn-danger" (click)="reset()">Reset</button>
    </div>
  \`
})
export class CounterComponent {
  // ── Writable Signal ────────────────────────────────────
  count = signal(0);

  // ── Computed (Derived) Signals — auto-update on dependency change
  doubleCount = computed(() => this.count() * 2);
  isEven      = computed(() => this.count() % 2 === 0 ? 'Yes' : 'No');

  constructor() {
    // ── Effect — runs whenever count() changes ─────────────
    effect(() => {
      console.log('Count updated to:', this.count());
      // Use effects for side-effects: logging, localStorage, analytics
      localStorage.setItem('lastCount', String(this.count()));
    });
  }

  increment() {
    this.count.update(c => c + 1);   // derive next value from current
  }

  reset() {
    this.count.set(0);               // set an explicit value
  }
}`,
            language: `typescript`,
          },
          {
            heading: `DestroyRef & Subscription Cleanup`,
            content: `<p>Angular 16 introduced <code>DestroyRef</code>, which allows registering cleanup callbacks that run when the current lifecycle context (component, service, directive, etc.) is destroyed. This can replace <code>ngOnDestroy</code>.</p>`,
            codeExample: `import { Component, inject, DestroyRef, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  standalone: true,
  template: \`<p>Tick: {{ tick }}</p>\`
})
export class TimerComponent implements OnInit {
  tick = 0;
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const sub: Subscription = interval(1000)
      .subscribe(val => {
        this.tick = val;
        console.log('Tick:', val);
      });

    // ── Register cleanup with DestroyRef ──────────────────
    // No need for ngOnDestroy — runs automatically on destroy
    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
      console.log('Timer cleaned up via DestroyRef.');
    });
  }
}

// ── Using takeUntilDestroyed (preferred shorthand) ─────────
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({ selector: 'app-timer-v2', standalone: true,
  template: \`<p>Tick: {{ tick }}</p>\`
})
export class TimerV2Component implements OnInit {
  tick = 0;

  ngOnInit() {
    interval(1000).pipe(
      takeUntilDestroyed()  // internally uses DestroyRef
    ).subscribe(val => this.tick = val);
  }
}`,
            language: `typescript`,
          },
          {
            heading: `Router Signals`,
            content: `<p>In Angular 16, routing parameters can be bound to component input properties as Signals. This replaces manually subscribing to <code>route.params</code> observables.</p>`,
            codeExample: `import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  template: \`
    <div class="container py-4">
      @if (productId()) {
        <h2>Product ID: {{ productId() }}</h2>
        <p class="text-muted">Route query: {{ searchQuery() }}</p>
      } @else {
        <p>No product selected</p>
      }
    </div>
  \`
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);

  // ── Convert route params Observable → Signal ───────────
  productId = toSignal(
    this.route.paramMap.pipe(map(p => p.get('id')))
  );

  // ── Convert query params Observable → Signal ───────────
  searchQuery = toSignal(
    this.route.queryParamMap.pipe(map(q => q.get('q') ?? ''))
  );

  // ── Computed signal derived from route signal ──────────
  apiUrl = computed(() =>
    productId
      ? \`/api/products/\${this.productId()}\`
      : null
  );
}

// ── Route definition:
// { path: 'product/:id', component: ProductDetailComponent }
// URL: /product/42?q=laptop → productId() = '42', searchQuery() = 'laptop'`,
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
            codeExample: `// ── child: toggle.component.ts ────────────────────────────
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-toggle',
  standalone: true,
  template: \`
    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        [checked]="checked()"
        (change)="toggle()" />
      <label class="form-check-label">
        State: <strong>{{ checked() ? 'ON' : 'OFF' }}</strong>
      </label>
    </div>
  \`
})
export class ToggleComponent {
  // model() = writable signal + auto-emits (checkedChange) event
  checked = model(false);

  toggle() {
    this.checked.update(v => !v);  // updates value AND emits to parent
  }
}

// ── parent template ────────────────────────────────────────
// Two-way banana-in-a-box binding via signal model
// <app-toggle [(checked)]="notificationsEnabled" />
// <p>Notifications: {{ notificationsEnabled() ? 'On' : 'Off' }}</p>

// ── parent component class ─────────────────────────────────
// notificationsEnabled = signal(false);`,
            language: `typescript`,
          },
          {
            heading: `linkedSignal API`,
            content: `<p>Angular 19 introduced <code>linkedSignal</code>, a primitive that represents a writable signal whose value is automatically reset or derived based on a source signal.</p><ul><li>Solves the synchronization problem between component state and input signals.</li><li>Avoids having to write manual <code>effect()</code> calls to reset local states when inputs change.</li></ul>`,
            codeExample: `import { Component, input, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-editor',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <div class="card p-4">
      <h5>Editing User: <span class="text-primary">{{ userId() }}</span></h5>

      <input class="form-control mb-2"
        [(ngModel)]="username" placeholder="Username" />

      <button class="btn btn-outline-secondary btn-sm" (click)="reset()">
        Reset to Default
      </button>

      <p class="text-muted mt-2 small">
        Current username: <strong>{{ username() }}</strong>
      </p>
    </div>
  \`
})
export class ProfileEditorComponent {
  // Required signal input from parent
  userId = input.required<string>();

  // ── linkedSignal: writable signal that RESETS when userId changes
  // This replaces: effect(() => { this.username.set('User_' + this.userId()); })
  username = linkedSignal({
    source:      this.userId,
    computation: (id) => \`User_\${id}\`   // default when userId changes
  });

  reset() {
    // Can still be manually overridden
    this.username.set(\`User_\${this.userId()}\`);
  }
}

// Usage: <app-profile-editor userId="42" />
// When userId changes to "99", username auto-resets to "User_99"`,
            language: `typescript`,
          },
          {
            heading: `resource API for Async Operations`,
            content: `<p>Angular 19 introduced the <code>resource()</code> API to manage asynchronous operations (like HTTP requests) reactively. It takes a source signal and executes loader functions, exposing states like <code>value</code>, <code>status</code>, and <code>isLoading</code>.</p>`,
            codeExample: `import { Component, signal, resource } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Product { id: number; name: string; price: number; }

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <div class="container py-3">
      <label>Product ID:</label>
      <input type="number" [(ngModel)]="productId" class="form-control w-auto d-inline ms-2" />

      @if (product.isLoading()) {
        <div class="d-flex align-items-center gap-2 mt-3">
          <div class="spinner-border spinner-border-sm text-primary"></div>
          <span>Loading product...</span>
        </div>
      } @else if (product.error()) {
        <div class="alert alert-danger mt-3">
          Failed to load product. Please try again.
        </div>
      } @else if (product.value()) {
        <div class="card mt-3 p-3">
          <h4>{{ product.value()?.name }}</h4>
          <p class="text-success fw-bold">₹{{ product.value()?.price }}</p>
        </div>
      }
    </div>
  \`
})
export class ProductDetailsComponent {
  productId = signal(1);

  // ── resource() — auto-refetches whenever productId changes ──
  product = resource<Product, { id: number }>({
    request: () => ({ id: this.productId() }),
    loader: async ({ request, abortSignal }) => {
      const res = await fetch(
        \`https://fakestoreapi.com/products/\${request.id}\`,
        { signal: abortSignal }  // cancels in-flight requests on change
      );
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json() as Product;
    }
  });
}`,
            language: `typescript`,
          },
          {
            heading: `Signals vs RxJS Observables`,
            content: `<p>It's important to know when to use Signals and when to use RxJS Observables in Angular 19:</p><ul><li><strong>Signals:</strong> Perfect for local synchronous state management, UI bindings, and values that exist at a single point in time (e.g. form values, toggles, loading state). Avoids subscription overhead.</li><li><strong>Observables:</strong> Essential for asynchronous streams of events (e.g., HTTP streams, WebSockets, keystroke debouncing) and operations requiring complex temporal coordination (e.g., <code>switchMap</code>, <code>combineLatest</code>).</li><li><strong>Interoperability:</strong> Use <code>toSignal(obs$)</code> from <code>@angular/core/rxjs-interop</code> to read Observables inside Signal contexts, and <code>toObservable(sig)</code> to stream Signal value changes.</li></ul>`,
            codeExample: `import { signal, computed } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { debounceTime, switchMap } from 'rxjs/operators';
import { inject } from '@angular/core';

// ── USE SIGNALS FOR: Local / Sync State ───────────────────
const isMenuOpen  = signal(false);
const username    = signal('');
const isFormValid = computed(() => username().length > 3);

// ── USE OBSERVABLES FOR: Async Streams / Events ───────────
const http = inject(HttpClient);

// Search with debounce — Observable shines here
const searchQuery$ = /* fromEvent(input, 'input') ... */;
const results$ = searchQuery$.pipe(
  debounceTime(300),
  switchMap(q => http.get(\`/api/search?q=\${q}\`))
);

// ── BRIDGE: Observable → Signal ───────────────────────────
// When you want the result of an async stream in the template
const results = toSignal(results$, { initialValue: [] });
// Template: {{ results() | json }}

// ── BRIDGE: Signal → Observable ───────────────────────────
// When you need to apply RxJS operators to a signal's changes
const querySignal = signal('angular');
const query$ = toObservable(querySignal);
query$.pipe(debounceTime(400)).subscribe(q => console.log(q));`,
            language: `typescript`,
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
            codeExample: `import { Component, signal, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

interface Stock { symbol: string; price: number; change: number; }

@Component({
  selector: 'app-live-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // only re-render changed signals
  template: \`
    <div class="dashboard-grid">
      @for (stock of stocks(); track stock.symbol) {
        <div class="stock-card"
          [class.text-success]="stock.change >= 0"
          [class.text-danger]="stock.change < 0">
          <h5>{{ stock.symbol }}</h5>
          <p class="price">₹{{ stock.price.toFixed(2) }}</p>
          <small>{{ stock.change >= 0 ? '▲' : '▼' }} {{ stock.change.toFixed(2) }}%</small>
        </div>
      }
    </div>
  \`
})
export class LiveDashboardComponent implements OnDestroy {
  stocks = signal<Stock[]>([
    { symbol: 'RELIANCE', price: 2850.5, change: 0.0 },
    { symbol: 'TCS',      price: 3920.0, change: 0.0 },
    { symbol: 'INFY',     price: 1740.0, change: 0.0 },
  ]);

  private ws = new WebSocket('wss://api.example.com/stocks');

  constructor() {
    this.ws.onmessage = ({ data }) => {
      const update: Stock = JSON.parse(data);
      // Update only the changed stock — fine-grained reactivity
      this.stocks.update(list =>
        list.map(s => s.symbol === update.symbol ? update : s)
      );
      // OnPush + Signal: Angular re-renders only the changed stock card
    };
  }

  ngOnDestroy() { this.ws.close(); }
}`,
            language: `typescript`,
          },
          {
            heading: `Form validation state with Signals`,
            content: `<h5>Scenario Question:</h5><p><em>"A form has 50 fields, but only 2 need validation. How would Signals optimize validation performance compared to traditional reactive forms?"</em></p><h5>Answer:</h5><p>Traditional Reactive Forms run structural validation across the entire form tree whenever any input changes, which can lag in large forms. By using Signals: initialize inputs as individual signals, and compute the validation status using <code>computed()</code>. The computed signals evaluate lazily and only recalculate when their specific dependencies (the 2 validated input signals) emit changes. No validation cycles run when the other 48 fields update.</p>`,
            codeExample: `import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-large-form',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <form (ngSubmit)="submit()">
      <!-- Only these 2 trigger validation recomputation -->
      <input [(ngModel)]="username" name="u" placeholder="Username (min 4 chars)" class="form-control mb-2" />
      <input [(ngModel)]="password" name="p" type="password" placeholder="Password (min 7 chars)" class="form-control mb-2" />

      <!-- 48 other "dumb" fields — no validation cost -->
      <input [(ngModel)]="address"  name="a"  placeholder="Address" class="form-control mb-2" />
      <!-- ... 47 more ... -->

      <!-- isValid recomputes ONLY when username or password changes -->
      <div class="mb-2">
        <span [class]="isValid() ? 'text-success' : 'text-danger'">
          {{ isValid() ? '✓ Form is valid' : '✗ Please fix errors' }}
        </span>
      </div>

      <button [disabled]="!isValid()" class="btn btn-primary">Submit</button>
    </form>
  \`
})
export class LargeFormComponent {
  // Signals — only these 2 participate in validation graph
  username = signal('');
  password = signal('');

  // Other fields — plain properties (no reactive overhead)
  address = '';

  // Computed: lazy, cached — only recalcs if username or password changes
  isValid = computed(() =>
    this.username().length >= 4 &&
    this.password().length >= 7
  );

  submit() {
    if (this.isValid()) console.log('Form submitted!');
  }
}`,
            language: `typescript`,
          },
          {
            heading: `Computed signal error handling`,
            content: `<h5>Scenario Question:</h5><p><em>"Your computed signal depends on 3 API responses. How do you handle errors without breaking the dependency chain?"</em></p><h5>Answer:</h5><p>Computed signals must compute values synchronously and cannot recover internally if an error is thrown during their execution (it breaks the reactive graph). To handle errors safely, wrap the dependency reads in try-catch blocks and return a fallback state object or cache representation instead of throwing:</p>`,
            codeExample: `import { signal, computed } from '@angular/core';

// ── Signals representing three API response states ─────────
interface ApiState<T> { data: T | null; error: string | null; }

const authSignal    = signal<ApiState<{ token: string }>>({ data: null, error: null });
const profileSignal = signal<ApiState<{ name: string }>>({ data: null, error: null });
const permSignal    = signal<ApiState<string[]>>({ data: null, error: null });

// ── WRONG: Throws on error — breaks reactive graph ─────────
// const combined = computed(() => {
//   return { auth: authSignal().data!, profile: profileSignal().data! }; // ❌
// });

// ── CORRECT: Wrap in try-catch — return fallback state ─────
const userContext = computed(() => {
  try {
    const auth    = authSignal();
    const profile = profileSignal();
    const perm    = permSignal();

    if (auth.error || profile.error || perm.error) {
      return {
        success: false,
        error: auth.error ?? profile.error ?? perm.error,
        data: null
      };
    }

    return {
      success: true,
      error: null,
      data: {
        token:       auth.data!.token,
        displayName: profile.data!.name,
        permissions: perm.data ?? []
      }
    };
  } catch (err) {
    // Fallback — reactive graph stays intact
    return { success: false, error: String(err), data: null };
  }
});

// Template usage:
// @if (userContext().success) { <p>Hello {{ userContext().data?.displayName }}</p> }
// @else { <p class="text-danger">{{ userContext().error }}</p> }`,
            language: `typescript`,
          },
          {
            heading: `Search-as-you-type with Debounce & Signals`,
            content: `<h5>Scenario Question:</h5><p><em>"Design a search-as-you-type component that combines Signals, debounce, and API calls."</em></p><h5>Answer:</h5><p>Use <code>toObservable</code> to bridge the search query signal into an RxJS stream, apply debounce operators, trigger async HTTP calls, and convert the result back to a signal using <code>toSignal</code>:</p>`,
            codeExample: `import { Component, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface SearchResult { id: number; title: string; }

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <div class="search-wrapper">
      <input
        [(ngModel)]="query"
        placeholder="Search products..."
        class="form-control mb-3" />

      @if (!results()) {
        <p class="text-muted small">Start typing to search...</p>
      } @else if (results()!.length === 0) {
        <p class="text-muted small">No results found for "{{ query() }}"</p>
      } @else {
        <ul class="list-group">
          @for (item of results(); track item.id) {
            <li class="list-group-item">{{ item.title }}</li>
          }
        </ul>
      }
    </div>
  \`
})
export class SearchComponent {
  private http = inject(HttpClient);

  query = signal('');  // writable signal bound to input

  // ── Signal → Observable → debounce → HTTP → back to Signal ─
  results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),              // wait 300ms after user stops typing
      distinctUntilChanged(),         // skip if same as previous
      switchMap(q =>
        q.trim().length < 2          // ignore very short queries
          ? of(null)
          : this.http.get<SearchResult[]>(\`/api/search?q=\${q}\`).pipe(
              catchError(() => of([]))  // graceful error fallback
            )
      )
    )
  );
}`,
            language: `typescript`,
          },
          {
            heading: `Undo/Redo with Command Pattern and Signals`,
            content: `<h5>Scenario Question:</h5><p><em>"How would you implement undo/redo functionality using Signals and the Command pattern?"</em></p><h5>Answer:</h5><p>Track history in a stack array of states inside a service, and use a writable signal to hold the active state. Standard undo/redo actions pop states from stacks and invoke <code>state.set()</code> to update the UI reactively:</p>`,
            codeExample: `import { Injectable, signal, computed } from '@angular/core';

// ── Generic State Manager with Undo/Redo ──────────────────
@Injectable({ providedIn: 'root' })
export class StateManager<T> {
  private history: T[] = [];
  private index = signal(-1);

  activeState = computed<T | null>(() =>
    this.index() >= 0 ? this.history[this.index()] : null
  );

  canUndo = computed(() => this.index() > 0);
  canRedo = computed(() => this.index() < this.history.length - 1);

  update(newState: T) {
    // Discard any "future" states after current index
    this.history = this.history.slice(0, this.index() + 1);
    this.history.push(newState);
    this.index.update(i => i + 1);
  }

  undo() {
    if (this.canUndo()) {
      this.index.update(i => i - 1);
    }
  }

  redo() {
    if (this.canRedo()) {
      this.index.update(i => i + 1);
    }
  }
}

// ── Usage in a Text Editor Component ─────────────────────
// const editorState = inject(StateManager<string>);
//
// Template:
// <textarea [(ngModel)]="text" (input)="editorState.update(text)"></textarea>
// <button [disabled]="!editorState.canUndo()" (click)="editorState.undo()">↩ Undo</button>
// <button [disabled]="!editorState.canRedo()" (click)="editorState.redo()">↪ Redo</button>
// <p>Current: {{ editorState.activeState() }}</p>`,
            language: `typescript`,
          },
          {
            heading: `Signals vs Redux State Architecture`,
            content: `<h5>Scenario Question:</h5><p><em>"Your team uses Redux. Convince them to migrate to Signal-based state management with a code comparison."</em></p><h5>Answer:</h5><p>Redux introduces high boilerplate (actions, selectors, reducers, effects). Signals achieve the same unidirectional, predictable data flow with up to 70% less code using the <strong>Service + Signals pattern</strong>. No selectors or dispatchers are needed, and reactivity is tracked automatically:</p>`,
            codeExample: `// ── REDUX APPROACH (high boilerplate) ─────────────────────
// actions/user.actions.ts
// export const loadUser = createAction('[User] Load', props<{id:string}>());
// export const loadUserSuccess = createAction('[User] Success', props<{user:User}>());

// reducers/user.reducer.ts
// export const userReducer = createReducer(initialState,
//   on(loadUserSuccess, (state, {user}) => ({...state, user}))
// );

// selectors/user.selectors.ts
// export const selectUser = (state: AppState) => state.user.current;

// effects/user.effects.ts
// loadUser$ = createEffect(() => this.actions$.pipe(
//   ofType(loadUser),
//   switchMap(({id}) => this.api.getUser(id)),
//   map(user => loadUserSuccess({user}))
// ));

// In Component:
// this.store.dispatch(loadUser({ id: '42' }));
// this.user$ = this.store.select(selectUser);

// ── SIGNAL SERVICE APPROACH (minimal boilerplate) ──────────
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private http = inject(HttpClient);

  // All state in one place — public read-only signals
  private _user    = signal<User | null>(null);
  private _loading = signal(false);
  private _error   = signal<string | null>(null);

  user    = this._user.asReadonly();
  loading = this._loading.asReadonly();
  error   = this._error.asReadonly();

  loadUser(id: string) {
    this._loading.set(true);
    this.http.get<User>(\`/api/users/\${id}\`).subscribe({
      next:  u   => { this._user.set(u); this._loading.set(false); },
      error: err => { this._error.set(err.message); this._loading.set(false); }
    });
  }
}

// In Component:
// store = inject(UserStore);
// ngOnInit() { this.store.loadUser('42'); }
// Template: {{ store.user()?.name }}  |  @if(store.loading()) { <spinner /> }`,
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
            codeExample: `// ── app.routes.ts ─────────────────────────────────────────
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'product/:id',          // path param
    loadComponent: () =>
      import('./features/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'chat',
    component: ChatComponent,
    outlet: 'sidebar'             // named outlet
  },
  { path: '**', redirectTo: 'home' }
];

// ── In a component — programmatic navigation ───────────────
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export class NavComponent {
  private router = inject(Router);

  goToProduct(id: number) {
    // Method 1: navigate() with array — supports relative paths
    this.router.navigate(['/product', id]);

    // Method 2: navigateByUrl() with full URL string
    this.router.navigateByUrl(\`/product/\${id}\`);
  }

  openChat() {
    // Activate named outlet 'sidebar'
    this.router.navigate([{ outlets: { sidebar: ['chat'] } }]);
  }
}

// ── app.component.html ─────────────────────────────────────
// <router-outlet></router-outlet>                    <!-- primary -->
// <router-outlet name="sidebar"></router-outlet>     <!-- sidebar -->`,
            language: `typescript`,
          },
          {
            heading: `Forms: Template-driven vs Reactive`,
            content: `<p>Angular provides two different techniques to handle user input through forms:</p><ul><li><strong>Template-driven Forms:</strong> Easier to use for simple forms. Driven by the template using directives like <code>ngModel</code>. Validation is declared via HTML attributes.</li><li><strong>Reactive Forms:</strong> More robust, scalable, and testable. Managed directly in the component class using form objects: <code>FormControl</code>, <code>FormGroup</code>, and <code>FormArray</code>.</li></ul>`,
            codeExample: `// ── TEMPLATE-DRIVEN FORM ─────────────────────────────────
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-template',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <form #f="ngForm" (ngSubmit)="onSubmit(f.value)">
      <input name="email" ngModel required email class="form-control mb-2" />
      <input name="password" ngModel required minlength="6" type="password" class="form-control mb-2" />
      <button [disabled]="f.invalid" class="btn btn-primary">Login</button>
      @if (f.invalid && f.submitted) {
        <p class="text-danger small">Please fill all fields correctly.</p>
      }
    </form>
  \`
})
export class LoginTemplateComponent {
  onSubmit(values: any) { console.log(values); }
}

// ── REACTIVE FORM ─────────────────────────────────────────
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-reactive',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email"    class="form-control mb-2" placeholder="Email" />
      <input formControlName="password" class="form-control mb-2" type="password" placeholder="Password" />

      @if (form.get('email')?.invalid && form.get('email')?.touched) {
        <p class="text-danger small">Valid email is required.</p>
      }

      <button [disabled]="form.invalid" class="btn btn-primary">Login</button>
    </form>
  \`
})
export class LoginReactiveComponent {
  form = new FormGroup({
    email:    new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit() {
    if (this.form.valid) console.log(this.form.value);
  }
}`,
            language: `typescript`,
          },
          {
            heading: `Complex Form Validation`,
            content: `<p>Complex validation involves writing custom validators, cross-field validation, and async validators:</p><ul><li><strong>Custom Validators:</strong> Plain functions that return a validation error object or null.</li><li><strong>Cross-Field Validation:</strong> Applied at the FormGroup level to compare multiple controls.</li><li><strong>Async Validators:</strong> Return Observables or Promises. Used for server-side checks (e.g. checking if a username is taken).</li></ul>`,
            codeExample: `import { AbstractControl, FormControl, FormGroup,
  ValidationErrors, ValidatorFn, AsyncValidatorFn, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

// ── 1. Custom Sync Validator ──────────────────────────────
export function noSpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasSpaces = /\\s/.test(control.value ?? '');
    return hasSpaces ? { noSpaces: true } : null;
  };
}

// ── 2. Async Validator (server check) ─────────────────────
export function usernameAvailable(http: HttpClient): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return http.get<{ available: boolean }>(
      \`/api/check-username?u=\${control.value}\`
    ).pipe(
      delay(300), // debounce effect
      map(res => res.available ? null : { usernameTaken: true })
    );
  };
}

// ── 3. Cross-Field Validator (password match) ─────────────
export function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm  = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}

// ── Usage in a FormGroup ──────────────────────────────────
// form = new FormGroup({
//   username:        new FormControl('', [Validators.required, noSpacesValidator()],
//                      [usernameAvailable(this.http)]),
//   password:        new FormControl('', Validators.required),
//   confirmPassword: new FormControl('', Validators.required),
// }, { validators: passwordMatchValidator });`,
            language: `typescript`,
          },
          {
            heading: `Route Guards & Resolvers`,
            content: `<p>Guards protect navigation and Resolvers pre-fetch data before a route activates:</p><ul><li><strong>CanActivate:</strong> Blocks navigation if user is not authenticated or authorized.</li><li><strong>CanDeactivate:</strong> Prompts user when navigating away from unsaved forms.</li><li><strong>Resolve:</strong> Pre-fetches data before the route component loads, eliminating loading state flickering.</li></ul>`,
            codeExample: `import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, ResolveFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';

// ── CanActivateFn guard ────────────────────────────────────
export const authGuard: CanActivateFn = (route, state) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;

  // Redirect to login and preserve return URL
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

// ── CanDeactivateFn guard (unsaved form protection) ────────
export interface CanDeactivateComponent {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanDeactivateComponent> =
  (component) => {
    if (component.hasUnsavedChanges()) {
      return confirm('You have unsaved changes. Leave anyway?');
    }
    return true;
  };

// ── ResolveFn (pre-fetch data before route renders) ────────
export const productResolver: ResolveFn<Product> = (route) => {
  const id = route.paramMap.get('id')!;
  return inject(ProductService).getProduct(id); // returns Observable<Product>
};

// ── Route config ──────────────────────────────────────────
// {
//   path: 'product/:id',
//   component: ProductDetailComponent,
//   canActivate: [authGuard],
//   resolve: { product: productResolver }
// }`,
            language: `typescript`,
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
import { map } from 'rxjs/operators';

// ── Simple functional guard (synchronous) ─────────────────
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Preserve the attempted URL as returnUrl query param
  return router.parseUrl(\`/login?returnUrl=\${state.url}\`);
};

// ── Async functional guard (Observable/Promise) ───────────
export const subscriptionGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  return auth.checkSubscription().pipe(
    map(hasAccess => hasAccess ? true : router.parseUrl('/upgrade'))
  );
};

// ── Guard composition (reusable combination) ──────────────
// Route config:
// {
//   path: 'admin',
//   canActivate: [authGuard, subscriptionGuard],
//   loadComponent: () => import('./admin.component').then(m => m.AdminComponent)
// }`,
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
            codeExample: `// ── app.config.ts — Enable input binding from route ──────
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding())
    // Now route params, query params, and data auto-bind to @Input / input()
  ]
};

// ── product-view.component.ts ─────────────────────────────
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-product-view',
  standalone: true,
  template: \`
    <div class="container py-4">
      <h2>Product: {{ id() }}</h2>
      <p class="text-muted">Category: {{ category() }}</p>
      <p>Viewing: <strong>{{ title() }}</strong></p>
    </div>
  \`
})
export class ProductViewComponent {
  // Automatically bound from route path param /product/:id
  id = input.required<string>();

  // Bound from query param ?category=electronics
  category = input<string>('All');

  // Bound from route data: { data: { title: 'Product Catalog' } }
  title = input<string>('Product');
}

// ── Route definition ──────────────────────────────────────
// {
//   path: 'product/:id',
//   component: ProductViewComponent,
//   data: { title: 'Product Catalog' }
// }
// URL: /product/42?category=electronics
// → id() = '42', category() = 'electronics', title() = 'Product Catalog'`,
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
            codeExample: `import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';

@Component({
  selector: 'app-multi-step-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: \`
    <!-- Step indicator -->
    <div class="steps d-flex gap-2 mb-4">
      @for (s of [1,2,3]; track s) {
        <span class="step-dot" [class.active]="currentStep() === s">{{ s }}</span>
      }
    </div>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <!-- Step 1: Personal Info -->
      @if (currentStep() === 1) {
        <div formGroupName="personal">
          <input formControlName="firstName" class="form-control mb-2" placeholder="First Name" />
          <input formControlName="lastName"  class="form-control mb-2" placeholder="Last Name" />
        </div>
      }

      <!-- Step 2: Dynamic address list -->
      @if (currentStep() === 2) {
        <div formArrayName="addresses">
          @for (addr of addresses.controls; track $index; let i = $index) {
            <div [formGroupName]="i" class="border p-2 mb-2 rounded">
              <input formControlName="street" class="form-control mb-1" placeholder="Street" />
              <input formControlName="city"   class="form-control" placeholder="City" />
            </div>
          }
          <button type="button" class="btn btn-sm btn-outline-primary" (click)="addAddress()">
            + Add Address
          </button>
        </div>
      }

      <!-- Step 3: Confirm -->
      @if (currentStep() === 3) {
        <p>Review and submit your information.</p>
      }

      <div class="d-flex gap-2 mt-3">
        <button type="button" class="btn btn-light" [disabled]="currentStep() === 1" (click)="prev()">Back</button>
        @if (currentStep() < 3) {
          <button type="button" class="btn btn-primary" (click)="next()">Next</button>
        } @else {
          <button type="submit" class="btn btn-success" [disabled]="form.invalid">Submit</button>
        }
      </div>
    </form>
  \`
})
export class MultiStepFormComponent {
  private fb = inject(FormBuilder);
  currentStep = signal(1);

  form: FormGroup = this.fb.group({
    personal: this.fb.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
    }),
    addresses: this.fb.array([this.createAddress()])
  });

  get addresses(): FormArray { return this.form.get('addresses') as FormArray; }

  createAddress() {
    return this.fb.group({
      street: ['', Validators.required],
      city:   ['', Validators.required]
    });
  }

  addAddress() { this.addresses.push(this.createAddress()); }
  next() { this.currentStep.update(s => Math.min(s + 1, 3)); }
  prev() { this.currentStep.update(s => Math.max(s - 1, 1)); }
  submit() { if (this.form.valid) console.log(this.form.value); }
}`,
            language: `typescript`,
          },
          {
            heading: `Signal binding to template-driven ngModel`,
            content: `<h5>Scenario Question:</h5><p><em>"How would you bind a Signal to a template-driven form's ngModel?"</em></p><h5>Answer:</h5><p>In template-driven forms, you cannot use a direct two-way binding on a signal getter <code>[(ngModel)]="searchQuery()"</code> because getters are read-only. Instead, split the binding: read the value using the getter signal call, and capture changes via <code>ngModelChange</code> to write back to the signal:</p>`,
            codeExample: `import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signal-form',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <div class="mb-3">
      <label class="fw-bold">Search Query</label>

      <!-- ── WRONG: signal getter is read-only ──────────── -->
      <!-- <input [(ngModel)]="searchQuery()" /> ❌ -->

      <!-- ── CORRECT: split into property binding + event ── -->
      <input
        [ngModel]="searchQuery()"
        (ngModelChange)="searchQuery.set($event)"
        class="form-control mt-1"
        placeholder="Type to search..." />

      <p class="text-muted small mt-1">
        You typed: <strong>"{{ searchQuery() }}"</strong>
        ({{ charCount() }} characters)
      </p>
    </div>

    <!-- Select dropdown with signal ──────────────────────── -->
    <div class="mb-3">
      <label class="fw-bold">Category</label>
      <select
        [ngModel]="selectedCategory()"
        (ngModelChange)="selectedCategory.set($event)"
        class="form-select mt-1">
        <option value="all">All</option>
        <option value="tech">Technology</option>
        <option value="design">Design</option>
      </select>
      <p class="small text-muted mt-1">Selected: {{ selectedCategory() }}</p>
    </div>
  \`
})
export class SignalFormComponent {
  searchQuery      = signal('');
  selectedCategory = signal('all');

  // Derived signals — auto-update when source signals change
  charCount = computed(() => this.searchQuery().length);
}`,
            language: `typescript`,
          },
          {
            heading: `Preloading strategies in complex routes`,
            content: `<h5>Scenario Question:</h5><p><em>"How do you implement custom preloading strategies in Angular routing?"</em></p><h5>Answer:</h5><p>By default, Angular loads modules eagerly or lazily when routes are clicked. To pre-fetch lazy modules in the background, implement a custom <code>PreloadingStrategy</code> class or functional provider that checks route data flags (e.g. <code>preload: true</code>) to trigger preloading selectively:</p>`,
            codeExample: `import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// ── Custom Preloading Strategy ─────────────────────────────
@Injectable({ providedIn: 'root' })
export class SelectivePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    const shouldPreload = route.data?.['preload'] === true;
    const delay         = route.data?.['preloadDelay'] as number ?? 0;

    if (shouldPreload) {
      // Optional delay before preloading (e.g. after app is idle)
      return timer(delay).pipe(switchMap(() => load()));
    }
    return of(null); // skip preloading for this route
  }
}

// ── app.config.ts — register strategy ─────────────────────
// provideRouter(routes, withPreloading(SelectivePreloadStrategy))

// ── app.routes.ts — mark routes for preloading ────────────
export const routes: Routes = [
  {
    path: 'dashboard',
    data: { preload: true, preloadDelay: 2000 }, // preload after 2s
    loadComponent: () =>
      import('./features/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'reports',
    data: { preload: false }, // do NOT preload — load on demand
    loadComponent: () =>
      import('./features/reports.component').then(m => m.ReportsComponent)
  },
  {
    path: 'admin',
    data: { preload: true },  // preload immediately when idle
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  }
];`,
            language: `typescript`,
          },
          {
            heading: `Routing Guards with Role-Based Access Control`,
            content: `<h5>Scenario Question:</h5><p><em>"Design a guard that allows navigation only to users carrying a specific role matching metadata parameters."</em></p><h5>Answer:</h5><p>Inject your AuthService and Router inside a functional guard, inspect the route's <code>data</code> parameters to check required roles, and resolve to boolean or redirect routes:</p>`,
            codeExample: `import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// ── Role-based functional guard ────────────────────────────
export const roleGuard: CanActivateFn = (route) => {
  const auth           = inject(AuthService);
  const router         = inject(Router);
  const requiredRole   = route.data['role'] as string;
  const requiredRoles  = route.data['roles'] as string[] ?? [requiredRole];

  // Check if user has ANY of the required roles
  const hasAccess = requiredRoles.some(role => auth.hasRole(role));

  if (hasAccess) return true;

  // Redirect unauthorized users to /unauthorized page
  console.warn(\`Access denied. Required: \${requiredRoles.join(', ')}\`);
  return router.parseUrl('/unauthorized');
};

// ── Route configuration ────────────────────────────────────
// const routes: Routes = [
//   {
//     path: 'admin',
//     canActivate: [authGuard, roleGuard],
//     data: { role: 'admin' },      // single role
//     loadComponent: () => import('./admin.component').then(m => m.AdminComponent)
//   },
//   {
//     path: 'reports',
//     canActivate: [authGuard, roleGuard],
//     data: { roles: ['admin', 'manager'] },  // multiple allowed roles
//     loadComponent: () => import('./reports.component').then(m => m.ReportsComponent)
//   }
// ];

// ── AuthService example (simplified) ─────────────────────
// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private userRoles = signal<string[]>([]);
//   hasRole(role: string) { return this.userRoles().includes(role); }
//   isAuthenticated() { return this.userRoles().length > 0; }
// }`,
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
            codeExample: `import { Injectable, InjectionToken } from '@angular/core';

// ── Basic Injectable Service (Singleton) ──────────────────
@Injectable({
  providedIn: 'root'  // One shared instance across the whole app
})
export class LoggerService {
  log(msg: string)   { console.log(\`[LOG] \${msg}\`); }
  error(msg: string) { console.error(\`[ERROR] \${msg}\`); }
}

// ── InjectionToken for non-class values ───────────────────
export const API_URL = new InjectionToken<string>('API_URL');

// ── Custom Provider Types ─────────────────────────────────
// In app.config.ts providers array:
//
// { provide: API_URL, useValue: 'https://api.example.com' },
//
// { provide: LoggerService, useClass: VerboseLoggerService },
//
// {
//   provide: LoggerService,
//   useFactory: (env: Environment) =>
//     env.production ? new SilentLogger() : new VerboseLogger(),
//   deps: [Environment]
// }

// ── Component-level Provider (isolated instance) ──────────
@Component({
  selector: 'app-form',
  standalone: true,
  providers: [FormStateService]  // new instance per component
})
export class FormComponent {
  // FormStateService is isolated to this component's subtree
  private state = inject(FormStateService);
}`,
            language: `typescript`,
          },
          {
            heading: `HTTP Client & Global Error Interceptors`,
            content: `<p>The <code>HttpClient</code> service enables API communication. Global request and response manipulations are handled by interceptors.</p>`,
            codeExample: `import { HttpInterceptorFn, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// ── Global Error Interceptor ──────────────────────────────
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          // Unauthorized — redirect to login
          router.navigateByUrl('/login');
          break;
        case 403:
          // Forbidden — redirect to unauthorized page
          router.navigateByUrl('/unauthorized');
          break;
        case 500:
          console.error('Server error:', error.message);
          // Show global toast/snackbar notification here
          break;
      }
      return throwError(() => error);
    })
  );
};

// ── Auth Token Interceptor ────────────────────────────────
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  // Clone request and append Authorization header
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } })
    : req;

  return next(authReq);
};

// ── Register in app.config.ts ─────────────────────────────
// provideHttpClient(
//   withInterceptors([authInterceptor, errorInterceptor])
// )`,
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
            codeExample: `import { Component, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// ── inject() replaces constructor injection ────────────────
@Component({
  selector: 'app-user',
  standalone: true,
  template: \`<p>User component</p>\`
})
export class UserComponent {
  // Old way (constructor injection):
  // constructor(private http: HttpClient, private router: Router) {}

  // New way — inject() inline, no constructor needed
  private http   = inject(HttpClient);
  private router = inject(Router);

  navigate() { this.router.navigateByUrl('/profile'); }
}

// ── Reusable composable with inject() ─────────────────────
// Create a composable "feature" outside a class
function createPaginatedList<T>(endpoint: string) {
  const http    = inject(HttpClient);
  const page    = signal(1);
  const items   = signal<T[]>([]);
  const loading = signal(false);

  function load() {
    loading.set(true);
    http.get<T[]>(\`\${endpoint}?page=\${page()}\`).subscribe(data => {
      items.set(data);
      loading.set(false);
    });
  }

  return { page, items, loading, load, nextPage: () => page.update(p => p + 1) };
}

// ── Usage in component ─────────────────────────────────────
@Component({ selector: 'app-products', standalone: true, template: \`...\` })
export class ProductsComponent {
  // inject() works in field initializer context (inside class body)
  list = createPaginatedList<Product>('/api/products');
  ngOnInit() { this.list.load(); }
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
            codeExample: `import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

// ── app.config.ts — enable zoneless mode ──────────────────
export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(), // no zone.js needed
    provideRouter([])
  ]
};

// ── Component using injected refs for manual CD ────────────
import { Component, inject, ChangeDetectorRef, ApplicationRef, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-third-party-widget',
  standalone: true,
  template: \`<div id="widget-host"></div>\`
})
export class ThirdPartyWidgetComponent {
  private cdr    = inject(ChangeDetectorRef);
  private appRef = inject(ApplicationRef);

  constructor() {
    afterNextRender(() => {
      // Mount a third-party (non-Angular) widget
      ThirdPartyLib.mount('#widget-host', {
        onDataChange: (newData: any) => {
          console.log('External data changed:', newData);
          // ── Notify Angular to check for changes ──────────
          // Option 1: Mark this component and ancestors
          this.cdr.markForCheck();

          // Option 2: Trigger global app-level change detection
          // this.appRef.tick();
        }
      });
    });
  }
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
            heading: `Component vs Root-level Providers`,
            content: `<h5>Scenario Question:</h5><p><em>"How does dependency injection differ between component-level and root-level providers, and when should you use each?"</em></p><h5>Answer:</h5><ul><li><strong>Root level:</strong> Declared via <code>&#64;Injectable({ providedIn: 'root' })</code>. Creates a single singleton instance shared across the entire application. Best for stateless utilities, global state stores, or HTTP wrappers.</li><li><strong>Component level:</strong> Declared inside component metadata <code>providers: [...]</code>. Creates a new sandbox instance scoped specifically to that component instance and its subtree. When the component is destroyed, the service instance is garbage-collected. Best for keeping component state isolated (e.g. multi-step stepper state services).</li></ul>`,
            codeExample: `import { Injectable, Component, inject } from '@angular/core';
import { signal } from '@angular/core';

// ── Root-level: Singleton shared app-wide ─────────────────
@Injectable({ providedIn: 'root' })
export class AuthService {
  private token = signal<string | null>(null);
  isLoggedIn = () => !!this.token();
  setToken(t: string) { this.token.set(t); }
}

// ── Component-level: Scoped, sandboxed instance ───────────
@Injectable()  // No providedIn — must be listed in component providers
export class WizardStateService {
  currentStep = signal(1);
  formData    = signal<Record<string, any>>({});

  nextStep()  { this.currentStep.update(s => s + 1); }
  saveData(d: Record<string, any>) { this.formData.update(prev => ({...prev, ...d})); }
}

// ── Component using component-level provider ───────────────
@Component({
  selector: 'app-wizard',
  standalone: true,
  // New WizardStateService instance is created FOR THIS component
  // Destroyed automatically when WizardComponent is destroyed
  providers: [WizardStateService],
  template: \`<p>Step {{ wizard.currentStep() }}</p>\`
})
export class WizardComponent {
  wizard = inject(WizardStateService); // gets the scoped instance
}

// Another WizardComponent instance gets its OWN WizardStateService
// → No shared state pollution between two wizard instances on screen`,
            language: `typescript`,
          },
          {
            heading: `useValue and useFactory in Service DI`,
            content: `<h5>Scenario Question:</h5><p><em>"How would you inject dynamic configuration values into a service at runtime?"</em></p><h5>Answer:</h5><p>Use custom providers with <code>useValue</code> for static values, and <code>useFactory</code> for dynamic computation of dependencies based on other services injected at launch:</p>`,
            codeExample: `import { InjectionToken, inject } from '@angular/core';

// ── 1. Define Injection Tokens for configuration ──────────
export const API_URL     = new InjectionToken<string>('API_URL');
export const APP_CONFIG  = new InjectionToken<AppConfig>('APP_CONFIG');

export interface AppConfig {
  apiUrl:   string;
  debug:    boolean;
  pageSize: number;
}

// ── 2. useValue — static known value ─────────────────────
export const appProviders = [
  {
    provide: API_URL,
    useValue: 'https://api.myapp.com/v2'
  },
  {
    provide: APP_CONFIG,
    useValue: { apiUrl: 'https://api.myapp.com', debug: false, pageSize: 20 }
  }
];

// ── 3. useFactory — dynamic value, can use other deps ─────
export const loggingProviders = [
  {
    provide: LoggerService,
    useFactory: (config: AppConfig) => {
      // At runtime: choose implementation based on config
      return config.debug
        ? new VerboseLoggerService()
        : new SilentLoggerService();
    },
    deps: [APP_CONFIG]   // inject APP_CONFIG into factory
  }
];

// ── 4. Consuming the token in a service ───────────────────
@Injectable({ providedIn: 'root' })
export class DataService {
  private apiUrl = inject(API_URL);
  private config = inject(APP_CONFIG);

  getUsers() {
    return fetch(\`\${this.apiUrl}/users\`);
  }
}

// ── 5. app.config.ts ──────────────────────────────────────
// export const appConfig: ApplicationConfig = {
//   providers: [...appProviders, ...loggingProviders, provideHttpClient()]
// };`,
            language: `typescript`,
          },
          {
            heading: `Circular Dependencies in DI`,
            content: `<h5>Scenario Question:</h5><p><em>"Your build fails due to a circular dependency between ServiceA and ServiceB. How do you resolve this?"</em></p><h5>Answer:</h5><ol><li><strong>Refactor Common Logic:</strong> Extract the shared methods causing the circular loop into a third independent service (ServiceC) and inject ServiceC into both ServiceA and ServiceB.</li><li><strong>Lazy Injection:</strong> Resolve one service lazily using Angular's <code>injector.get()</code> or the modern <code>inject()</code> inside a function call rather than the constructor, delaying instantiation until it is actually invoked.</li></ol>`,
            codeExample: `// ── PROBLEM: Circular dependency (A → B → A) ─────────────
// @Injectable() class UserService { constructor(private auth: AuthService) {} }
// @Injectable() class AuthService { constructor(private user: UserService) {} }
// ❌ Error: Circular dependency detected

// ── FIX 1: Extract shared logic into a 3rd service ────────
@Injectable({ providedIn: 'root' })
export class TokenService {  // ← new shared service (C)
  private token = signal<string | null>(null);
  getToken()  { return this.token(); }
  setToken(t: string) { this.token.set(t); }
  clearToken() { this.token.set(null); }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenService = inject(TokenService); // inject C, not UserService
  login(credentials: any) { /* ... */ }
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private tokenService = inject(TokenService); // inject C, not AuthService
  getProfile() { /* use tokenService.getToken() */ }
}

// ── FIX 2: Lazy inject — break circular at runtime ────────
import { Injector } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ServiceA {
  private injector = inject(Injector);
  private _serviceB: ServiceB | null = null;

  // Lazy getter — ServiceB is resolved only when first called
  private get serviceB(): ServiceB {
    if (!this._serviceB) {
      this._serviceB = this.injector.get(ServiceB);
    }
    return this._serviceB;
  }

  doSomething() { this.serviceB.helpMethod(); }
}`,
            language: `typescript`,
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
            codeExample: `import { Component, ChangeDetectionStrategy, Input,
  ChangeDetectorRef, inject, signal } from '@angular/core';

// ── DEFAULT Strategy (checks every cycle — can be slow) ───
@Component({
  selector: 'app-card-default',
  template: \`<div>Score: {{ data.score }} | Time: {{ now }}</div>\`,
})
export class DefaultCardComponent {
  @Input() data!: { score: number };
  now = Date.now(); // re-evaluated on EVERY change detection cycle
}

// ── OnPush Strategy (only checks when inputs change) ──────
@Component({
  selector: 'app-card-onpush',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<div>Score: {{ data.score }}</div>\`
})
export class OnPushCardComponent {
  @Input() data!: { score: number };
  // Only re-renders when this.data REFERENCE changes (not mutation)
}

// ── Manual trigger when using async callbacks with OnPush ──
@Component({
  selector: 'app-live-score',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<div>Live: {{ score() }}</div>\`
})
export class LiveScoreComponent {
  score = signal(0);  // Signals work perfectly with OnPush — auto-trigger

  // If NOT using signals, manually trigger:
  // private cdr = inject(ChangeDetectorRef);
  // onWebSocketMessage(data: any) {
  //   this.score = data.score;
  //   this.cdr.markForCheck(); // tell Angular to re-check this component
  // }
}`,
            language: `typescript`,
          },
          {
            heading: `SCSS Reusability & Deprecated Deep`,
            content: `<p>Keep SCSS organized and scalable inside enterprise Angular applications:</p><ul><li><strong>SCSS Variables and Mixins:</strong> Store color maps, grid breakpoints, and flex mixins inside central config files (e.g., <code>_variables.scss</code>) and import them.</li><li><strong>::ng-deep Deprecation:</strong> Historically used to override styles of child components. It is deprecated. Instead, use global override style files, CSS Custom Properties (variables), or pass styling config properties to components.</li></ul>`,
            codeExample: `/* ── _variables.scss — Central token file ────────────────── */
$brand-primary:   #6200ea;
$brand-secondary: #03dac6;
$text-muted:      #757575;
$border-radius:   8px;

$breakpoints: (
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
);

/* ── _mixins.scss — Reusable layout helpers ──────────────── */
@mixin flex-center($direction: row) {
  display: flex;
  flex-direction: $direction;
  align-items: center;
  justify-content: center;
}

@mixin respond-to($bp) {
  @media (min-width: map-get($breakpoints, $bp)) { @content; }
}

/* ── component.scss — Usage ──────────────────────────────── */
@use 'variables' as *;
@use 'mixins' as *;

.btn-brand {
  background: $brand-primary;
  border-radius: $border-radius;
  @include flex-center;

  @include respond-to('md') {
    padding: 12px 24px;
  }
}

/* ── ng-deep (DEPRECATED — avoid) ───────────────────────── */
/* OLD (broken encapsulation): */
/* :host ::ng-deep .mat-button { color: red; } */

/* MODERN alternative 1: CSS Custom Properties ─────────────── */
/* In component SCSS: */
.my-wrapper { --mat-button-color: #{$brand-primary}; }
/* The child Material component reads --mat-button-color */

/* MODERN alternative 2: Global styles.scss override ──────── */
/* .mat-mdc-button.brand { color: $brand-primary !important; } */`,
            language: `css`,
          },
          {
            heading: `TypeScript Config & CLI Tools`,
            content: `<p>Key configurations and commands to manage compilation and dependency lock consistency in Angular projects:</p><ul><li><strong>tsconfig.json:</strong> Configures compiler options (e.g. <code>strict</code> type checks, path mappings, compilation targets).</li><li><strong>package.json vs package-lock.json:</strong> <code>package.json</code> holds requested semantic versions, while <code>package-lock.json</code> pins exact dependency versions for reproducible builds.</li><li><strong>Angular CLI Commands:</strong><ul><li><code>ng build:</code> Compiles to dist, supports production flags.</li><li><code>ng serve:</code> Starts local hot-reload server.</li><li><code>ng generate (ng g):</code> Scaffolds files (components, services).</li></ul></li></ul>`,
            codeExample: `// ── tsconfig.json — essential compiler options ────────────
{
  "compilerOptions": {
    "target":            "ES2022",
    "lib":               ["ES2022", "dom"],
    "module":            "ESNext",
    "moduleResolution":  "Bundler",
    "strict":            true,      // enables all strict checks
    "noImplicitAny":     true,
    "strictNullChecks":  true,
    "paths": {
      "@core/*":    ["src/app/core/*"],
      "@shared/*":  ["src/app/shared/*"],
      "@features/*":["src/app/features/*"]
    }
  }
}

// ── Angular CLI essential commands ────────────────────────
// ng new my-app --standalone --routing --style=scss
// ng serve --open                   (dev server with HMR)
// ng build --configuration=production
// ng generate component features/dashboard --standalone
// ng generate service core/auth
// ng generate pipe shared/currency
// ng generate guard core/auth --functional
// ng lint                           (run eslint checks)
// ng test                           (run Jasmine/Karma tests)
// ng e2e                            (run Cypress/Playwright)
// ng update @angular/core @angular/cli   (update Angular version)
// ng add @angular/material                (add Angular Material)
// ng add @angular/pwa                     (add PWA support)`,
            language: `typescript`,
          },
          {
            heading: `SCSS mixins & BEM methodology`,
            content: `<p>Ensure SCSS reusability in large projects using variables, mixins, and BEM (Block-Element-Modifier) naming conventions: <code>.card</code>, <code>.card__title</code>, <code>.card__button--disabled</code>. This improves style scope isolation and prevents global scope leaks.</p>`,
            codeExample: `/* ── BEM Naming Convention ────────────────────────────────
   Block:    .card            (standalone component)
   Element:  .card__title     (child of block, use __)
   Modifier: .card--featured  (variant of block, use --)
   Combined: .card__btn--disabled (element variant)
   ──────────────────────────────────────────────────────── */

.card {
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  /* ── Element ─────────────────────────────────────────── */
  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a2e;
  }

  &__body {
    color: #555;
    line-height: 1.6;
  }

  &__button {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;

    /* ── Modifier on element ──────────────────────────── */
    &--primary  { background: #6200ea; color: white; }
    &--disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
  }

  /* ── Block modifier ──────────────────────────────────── */
  &--featured {
    border-left: 4px solid #6200ea;
    background: #f3e8ff;
  }

  &--dark {
    background: #1a1a2e;
    .card__title { color: white; }
    .card__body  { color: #ccc; }
  }
}`,
            language: `css`,
          },
          {
            heading: `Core dependencies & Debugging`,
            content: `<p>Recommended tooling and core libraries for Angular development:</p><ul><li><strong>Dependencies:</strong> RxJS (async), NgRx (state management), Angular Material (UI components), Lodash (utilities), ngx-translate (localization).</li><li><strong>Debugging tools:</strong> Console logging, Augury (inspecting component states), Chrome DevTools Breakpoints, Change Detection checking, and Jasmine/Karma unit tests.</li></ul>`,
            codeExample: `// ── Common dependencies in Angular projects ───────────────
// package.json dependencies:
//
// "@angular/core": "^19.0.0",
// "@angular/material": "^19.0.0",
// "@angular/cdk": "^19.0.0",
// "rxjs": "^7.8.0",
// "@ngrx/store": "^19.0.0",         (state management)
// "@ngrx/effects": "^19.0.0",
// "ngx-translate/core": "^15.0.0",  (i18n localization)
// "lodash-es": "^4.17.21",           (utilities, tree-shakeable)
// "date-fns": "^3.0.0",             (date manipulation)

// ── Debugging techniques ───────────────────────────────────
// 1. Chrome DevTools — inspect component tree:
declare const ng: any; // Angular DevTools global
// ng.getComponent(element)    — inspect component from console
// ng.applyChanges(component)  — manually trigger CD

// 2. Debug change detection in component ────────────────────
import { Component, DoCheck, OnChanges } from '@angular/core';

@Component({ selector: 'app-debug', standalone: true, template: \`...\` })
export class DebugComponent implements DoCheck {
  ngDoCheck() {
    // Called on EVERY change detection run — use to spot excessive checks
    console.count('CD cycle ran');
  }
}

// 3. Unit test with Jasmine (ng test) ─────────────────────
// describe('MyService', () => {
//   it('should return formatted data', () => {
//     const service = new MyService();
//     expect(service.format(1234)).toBe('₹1,234');
//   });
// });

// 4. Useful browser console commands ──────────────────────
// localStorage.clear()         — clear cached auth tokens
// performance.mark('start')    — measure render timings
// window.performance.memory    — check JS heap size (Chrome)`,
            language: `typescript`,
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
            codeExample: `<!-- ── 1. @defer on viewport — lazy chart when visible ────── -->
@defer (on viewport) {
  <!-- HeavyChartsComponent loads only when user scrolls here -->
  <app-analytics-chart [data]="reportData" />
} @placeholder {
  <!-- Shown immediately before trigger fires -->
  <div class="skeleton-chart" style="height:200px; background:#eee; border-radius:8px;">
    <p class="text-center pt-5 text-muted">Chart loads when scrolled into view...</p>
  </div>
} @loading (minimum 500ms) {
  <!-- Shown while the bundle is downloading -->
  <div class="d-flex justify-content-center p-4">
    <div class="spinner-border text-primary"></div>
  </div>
} @error {
  <div class="alert alert-danger">Failed to load chart component.</div>
}

<!-- ── 2. @defer on hover — tooltip on demand ─────────────── -->
@defer (on hover) {
  <app-rich-tooltip [content]="tooltipText" />
} @placeholder {
  <span class="text-decoration-underline text-primary" style="cursor:help">
    Hover for details
  </span>
}

<!-- ── 3. @defer when expression (signal) ────────────────── -->
<!-- Loads when user opens the settings panel -->
@defer (when settingsOpen()) {
  <app-settings-panel />
} @placeholder {
  <button (click)="settingsOpen.set(true)">Open Settings</button>
}

<!-- ── 4. @defer on timer — load non-critical content late ─ -->
@defer (on timer(3s)) {
  <app-recommendation-sidebar />
} @placeholder {
  <div class="placeholder-glow"><span class="placeholder col-12"></span></div>
}`,
            language: `html`,
          },
          {
            heading: `SSR Hydration improvements`,
            content: `<p>Angular 17 introduced non-destructive client-side hydration for Server-Side Rendering (SSR). Instead of destroying server-rendered DOM and rebuilding it on the client, Angular matches existing DOM nodes with application components, attaching event listeners without flickering or performance drops.</p>`,
            codeExample: `// ── Enable SSR + Hydration in app.config.ts ───────────────
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    provideHttpClient(withFetch()),    // use fetch API in SSR
    provideClientHydration(
      withEventReplay()  // Angular 19: capture events before hydration completes
    )
  ]
};

// ── How hydration works (conceptual) ──────────────────────
// SERVER renders full HTML → sends to browser
// BROWSER receives pre-rendered HTML — user sees content instantly
// ANGULAR bootstraps in background, matches DOM nodes to components
// EVENT LISTENERS attached to existing DOM (no destroy/recreate)
// RESULT: No layout flicker, faster Time-to-Interactive (TTI)

// ── Tip: Mark components that can't be hydrated ───────────
import { Component } from '@angular/core';

@Component({
  selector: 'app-canvas-widget',
  standalone: true,
  // Skip hydration for this component (e.g. Canvas, WebGL)
  // host: { ngSkipHydration: 'true' },
  template: \`<canvas id="myCanvas"></canvas>\`
})
export class CanvasWidgetComponent {}`,
            language: `typescript`,
          },
          {
            heading: `Accessibility (a11y) improvements`,
            content: `<p>Angular 17+ introduced several built-in features to make web products accessible out of the box:</p><ul><li>Improved ARIA attributes support for screen readers.</li><li>Accessibility improvements in form fields and dropdown keyboards navigation focus states.</li><li>A11y lint checks built into the Angular CLI to capture semantic structure issues at compile time.</li></ul>`,
            codeExample: `<!-- ── a11y Best Practices in Angular Templates ──────────── -->

<!-- 1. Use semantic HTML elements -->
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a routerLink="/home" routerLinkActive="active"
          [attr.aria-current]="isHome ? 'page' : null">Home</a></li>
  </ul>
</nav>

<!-- 2. Associate labels with form controls -->
<div class="mb-3">
  <label for="emailInput" class="form-label">Email address</label>
  <input id="emailInput" type="email" formControlName="email"
    class="form-control"
    [attr.aria-describedby]="emailError ? 'emailError' : null"
    [attr.aria-invalid]="emailError ? 'true' : null" />
  @if (emailError) {
    <p id="emailError" class="text-danger small" role="alert">
      {{ emailError }}
    </p>
  }
</div>

<!-- 3. Live regions for dynamic updates -->
<div aria-live="polite" aria-atomic="true" class="visually-hidden">
  {{ statusMessage() }}
</div>

<!-- 4. Focus management after navigation -->
<!-- In component (skip-link pattern) -->
<!-- <a class="visually-hidden-focusable" href="#main-content">
       Skip to main content
     </a>
     <main id="main-content" tabindex="-1">...</main> -->

<!-- 5. Icon buttons need aria-label -->
<button (click)="closeModal()" aria-label="Close dialog">
  <i class="bi bi-x-lg" aria-hidden="true"></i>
</button>`,
            language: `html`,
          },
        ],
      },
      {
        version: `v18_v19`,
        label: `Angular 18 & 19`,
        sections: [
          {
            heading: `Zoneless Change Detection`,
            content: `<p>Angular 18 introduced experimental support for <strong>Zoneless change detection</strong>, removing the requirement of <code>zone.js</code>. This improves runtime speed, makes execution debugging simpler, and yields smaller bundle sizes.</p><ul><li>Configured in <code>app.config.ts</code> by declaring <code>provideExperimentalZonelessChangeDetection()</code>.</li><li>Reuses Signals or component event bindings to trigger target updates safely.</li></ul>`,
            codeExample: `// ── app.config.ts — Enable Zoneless ───────────────────────
import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(), // removes zone.js overhead
    provideRouter([])
  ]
};

// ── angular.json — remove zone.js polyfill ────────────────
// Remove from polyfills array:
// "polyfills": ["zone.js"]  ← DELETE this line

// ── Component with zoneless-compatible patterns ───────────
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div>
      <p>Count: {{ count() }}</p>
      <button (click)="increment()">+1</button>
    </div>
  \`
})
export class CounterComponent {
  count = signal(0);

  increment() {
    // Signal update → Angular detects change without zone.js
    this.count.update(c => c + 1);
  }
}

// ── Benefits of Zoneless ──────────────────────────────────
// ✓ No zone.js patching of native APIs (setTimeout, fetch, etc.)
// ✓ Simpler async stack traces in DevTools
// ✓ Smaller bundle (~98KB saved)
// ✓ Better interoperability with non-Angular code
// ✓ Required for Signal-based rendering (future Angular direction)`,
            language: `typescript`,
          },
          {
            heading: `Incremental SSR & Event Replay`,
            content: `<p>Angular 19 introduces major updates to SSR, including event replay (powered by Google's jsaction). If a user clicks a button on the server-rendered page before hydration completes, Angular captures the user event and replays it once hydration is finished, preventing lost clicks and enhancing perceived performance.</p>`,
            codeExample: `// ── Enable Event Replay in app.config.ts ─────────────────
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    provideClientHydration(
      withEventReplay()   // captures events before hydration, replays after
    )
  ]
};

// ── How Event Replay works (conceptual timeline) ──────────
//
// t=0ms: Server sends pre-rendered HTML to browser
// t=0ms: User sees content immediately (no blank screen)
// t=50ms: User clicks "Add to Cart" button
//          → Angular not hydrated yet
//          → jsaction CAPTURES this click event in a queue
// t=300ms: Angular finishes hydration
//          → Event replay fires the queued "Add to Cart" click
//          → User's action is processed — nothing is lost!
//
// Before event replay:
//   User click before hydration → LOST ❌
// After event replay (Angular 19):
//   User click before hydration → QUEUED → REPLAYED ✓

// ── server.ts — standard Angular SSR setup ────────────────
// import { CommonEngine } from '@angular/ssr';
// const engine = new CommonEngine();
// engine.render({ bootstrap: AppServerModule, ... })`,
            language: `typescript`,
          },
          {
            heading: `Microfrontends & Module Federation`,
            content: `<p>Enterprise apps can load self-contained micro-applications dynamically using Module Federation at runtime. Standalone components, shared injection contexts, and external configurations make these setups modular and highly scalable.</p>`,
            codeExample: `// ── Shell app: webpack.config.js (using @nx/webpack or custom) ──
// const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
//
// plugins: [
//   new ModuleFederationPlugin({
//     name: 'shell',
//     remotes: {
//       'orders': 'orders@http://localhost:4201/remoteEntry.js',
//       'billing': 'billing@http://localhost:4202/remoteEntry.js',
//     },
//     shared: {
//       '@angular/core':   { singleton: true, strictVersion: true },
//       '@angular/router': { singleton: true },
//     }
//   })
// ]

// ── Shell app.routes.ts — lazy load remote microfrontend ──
export const routes: Routes = [
  {
    path: 'orders',
    loadChildren: () =>
      // Dynamically import from remote app
      import('orders/OrdersModule').then(m => m.OrdersModule)
  },
  {
    path: 'billing',
    loadComponent: () =>
      import('billing/BillingDashboard').then(m => m.BillingDashboardComponent)
  }
];

// ── Shared singleton service (must be in 'shared' config) ─
// Both shell and remotes share the SAME instance via
// the singleton: true webpack config key

@Injectable({ providedIn: 'root' })
export class SharedCartService {
  items = signal<CartItem[]>([]);
  addItem(item: CartItem) { this.items.update(list => [...list, item]); }
}`,
            language: `typescript`,
          },
          {
            heading: `Security (XSS & CSRF Mitigation)`,
            content: `<p>Angular implements solid mechanisms to secure applications from web vulnerabilities:</p><ul><li><strong>Cross-Site Scripting (XSS):</strong> Angular treats values as untrusted by default. Sanitizes inputs before binding to DOM. Use <code>DomSanitizer</code> to bypass validation only when verified.</li><li><strong>Cross-Site Request Forgery (CSRF):</strong> Injects unique cookie tokens to match incoming headers using <code>HttpClientXsrfModule</code>.</li></ul>`,
            codeExample: `// ── XSS Protection: Angular auto-sanitizes ───────────────
// Angular automatically escapes {{ interpolation }} values
// <div>{{ userInput }}</div>  → "<script>" is escaped to &lt;script&gt;

// ── [innerHTML] binding: Angular sanitizes HTML ───────────
// Safe: removes script tags and event handlers automatically
// <div [innerHTML]="trustedHtml"></div>

// ── Bypass sanitization ONLY for verified safe content ────
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-rich-text',
  standalone: true,
  template: \`<div [innerHTML]="safeContent"></div>\`
})
export class RichTextComponent {
  private sanitizer = inject(DomSanitizer);

  // ONLY bypass if content is from a TRUSTED source (e.g. your own CMS)
  safeContent: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(
    '<b>Verified</b> <em>safe</em> HTML content from our CMS'
  );
  // NEVER bypass for user-generated content!
}

// ── CSRF Protection: HttpClient + XSRF module ─────────────
import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';

// In app.config.ts:
// provideHttpClient(
//   withXsrfConfiguration({
//     cookieName: 'XSRF-TOKEN',    // cookie name set by server
//     headerName: 'X-XSRF-TOKEN'  // header Angular attaches to requests
//   })
// )
// Angular auto-reads the cookie and sends it as a header
// Server validates header matches cookie → blocks CSRF

// ── Content Security Policy (CSP) ────────────────────────
// In index.html <head> (strongest XSS protection):
// <meta http-equiv="Content-Security-Policy"
//   content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'">`,
            language: `typescript`,
          },
          {
            heading: `PWA & Service Workers`,
            content: `<p>Install <code>&#64;angular/pwa</code> to enable offline capability and local cache support. Service workers intercept requests to serve cached assets, yielding instant loads and native app shell behaviors.</p>`,
            codeExample: `// ── Step 1: Add PWA support ────────────────────────────────
// ng add @angular/pwa
// This automatically:
// → Creates ngsw-config.json (service worker config)
// → Adds manifest.webmanifest (app metadata for install prompt)
// → Registers service worker in app.config.ts

// ── ngsw-config.json — caching strategy ───────────────────
// {
//   "index": "/index.html",
//   "assetGroups": [
//     {
//       "name": "app-shell",
//       "installMode": "prefetch",    // cache immediately on install
//       "resources": {
//         "files": ["/favicon.ico", "/index.html", "/*.css", "/*.js"]
//       }
//     },
//     {
//       "name": "assets",
//       "installMode": "lazy",        // cache on first use
//       "resources": { "files": ["/assets/**"] }
//     }
//   ],
//   "dataGroups": [
//     {
//       "name": "api-freshness",
//       "urls": ["/api/**"],
//       "cacheConfig": {
//         "strategy": "freshness",    // network first, fallback to cache
//         "maxSize": 100,
//         "maxAge": "5m",
//         "timeout": "3s"
//       }
//     }
//   ]
// }

// ── Step 2: Use SwUpdate for update notifications ──────────
import { Component, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({ selector: 'app-root', standalone: true, template: \`...\` })
export class AppComponent {
  private swUpdate = inject(SwUpdate);

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          if (confirm('New version available! Reload to update?')) {
            window.location.reload();
          }
        }
      });
    }
  }
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
            heading: `10,000 Items @for Loop Optimization`,
            content: `<h5>Scenario Question:</h5><p><em>"An &#64;for loop renders 10,000 items in a tabular list, causing major lags on scrolls and inputs. How do you optimize it?"</em></p><h5>Answer:</h5><ol><li>Ensure the loop utilizes a unique key identifier inside the <code>track</code> statement to prevent unnecessary re-rendering.</li><li>Use <strong>Virtual Scrolling</strong> (via Angular CDK <code>ScrollingModule</code>) to render only the DOM elements that are currently visible within the viewport, dropping the active DOM nodes from 10,000 to around 20–30.</li><li>Configure the component to use <code>ChangeDetectionStrategy.OnPush</code>.</li></ol>`,
            codeExample: `// ── Without optimization: 10,000 DOM nodes (SLOW) ─────────
// @for (item of tenThousandItems; track item.id) {
//   <div class="row">{{ item.name }} — {{ item.value }}</div>
// }

// ── With CDK Virtual Scroll (renders ~20-30 nodes) ─────────
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-virtual-list',
  standalone: true,
  imports: [ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <cdk-virtual-scroll-viewport
      itemSize="48"
      class="list-viewport"
      style="height: 500px; overflow-y: auto;">

      <!-- *cdkVirtualFor replaces *ngFor for virtual scrolling -->
      <div *cdkVirtualFor="let item of items; trackBy: trackById"
           class="list-row d-flex align-items-center p-2 border-bottom"
           style="height: 48px;">
        <span class="me-3 text-muted small">{{ item.id }}</span>
        <span class="flex-grow-1">{{ item.name }}</span>
        <span class="badge bg-primary">{{ item.score }}</span>
      </div>
    </cdk-virtual-scroll-viewport>
  \`,
  styles: [\`.list-viewport { border: 1px solid #dee2e6; border-radius: 8px; }\`]
})
export class VirtualListComponent {
  items = Array.from({ length: 10_000 }, (_, i) => ({
    id: i + 1,
    name: \`Item \${i + 1}\`,
    score: Math.floor(Math.random() * 100)
  }));

  // Stable identity function for CDK virtual scroll
  trackById = (_: number, item: { id: number }) => item.id;
}`,
            language: `typescript`,
          },
          {
            heading: `Zoneless mode debugging with 3rd-party callbacks`,
            content: `<h5>Scenario Question:</h5><p><em>"After enabling zoneless mode in Angular 19, parts of your application containing async third-party chart libraries stop updating. How would you debug and fix this?"</em></p><h5>Answer:</h5><ol><li>In zoneless mode, Angular relies on framework primitives (like Signals or events) to detect changes. Third-party library async callbacks bypass these mechanisms, meaning changes aren't tracked.</li><li>To fix this, inject <code>ChangeDetectorRef</code> or <code>ApplicationRef</code> in the component wrapper.</li><li>Inside the third-party library callbacks, invoke <code>changeDetectorRef.markForCheck()</code> or <code>applicationRef.tick()</code> to explicitly notify Angular that changes occurred and rendering updates are required.</li></ol>`,
            codeExample: `import { Component, ElementRef, inject, afterNextRender, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-legacy-chart',
  standalone: true,
  template: \`
    <div id="chart-container"></div>
    <p class="text-muted small mt-2">Data points: {{ dataCount }}</p>
  \`
})
export class LegacyChartComponent {
  private cdr       = inject(ChangeDetectorRef);
  dataCount = 0;

  constructor() {
    afterNextRender(() => {
      // Third-party non-Angular chart library initialization
      LegacyChart.init('chart-container', {
        // ── Problem: This async callback runs outside Angular ─
        // In zoneless mode, Angular won't detect state changes
        onDataUpdate: (newData: any[]) => {
          this.dataCount = newData.length;
          // Without this line, the template won't re-render:
          this.cdr.markForCheck(); // ✓ FIX: notify Angular
        },

        onRender: () => {
          console.log('Chart rendered by external lib');
          // If chart updates Angular-bound state, mark for check
          this.cdr.markForCheck();
        }
      });
    });
  }
}

// ── Alternative: wrap callback in a Signal ─────────────────
// import { signal } from '@angular/core';
//
// dataCount = signal(0);
//
// onDataUpdate: (newData: any[]) => {
//   this.dataCount.set(newData.length); // Signal auto-triggers CD
// }`,
            language: `typescript`,
          },
          {
            heading: `Memory Leak Diagnosis & Fix`,
            content: `<h5>Scenario Question:</h5><p><em>"Your application slows down after repeated navigations due to memory leaks. How do you trace and fix them?"</em></p><h5>Answer:</h5><ol><li>Use <strong>Chrome DevTools Memory tab</strong> to take heap snapshots before and after navigation. Filter by component names to see if destroyed component instances are still held in memory.</li><li>Look for active subscriptions that weren't cleaned up, event listeners attached directly to the global window/document (via renderer or raw methods) without removal, or global state objects retaining component references.</li><li>Fix leaks by unsubscribing in <code>ngOnDestroy</code> or <code>DestroyRef.onDestroy</code>, detaching global listeners, and avoiding local state mutations in shared services.</li></ol>`,
            codeExample: `import { Component, OnInit, inject, ElementRef, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { DestroyRef } from '@angular/core';

// ── LEAKY Component (anti-pattern) ────────────────────────
// @Component({ ... })
// export class LeakyComponent implements OnInit {
//   ngOnInit() {
//     interval(1000).subscribe(n => this.data = n); // ❌ never unsubscribed
//     window.addEventListener('resize', () => this.onResize()); // ❌ never removed
//   }
// }

// ── FIXED Component (best practices) ──────────────────────
@Component({
  selector: 'app-no-leak',
  standalone: true,
  template: \`<p>Data: {{ data }}</p>\`
})
export class NoLeakComponent implements OnInit {
  data = 0;
  private destroyRef = inject(DestroyRef);
  private renderer   = inject(Renderer2);
  private el         = inject(ElementRef);

  // Store cleanup ref for native listener
  private removeResizeListener!: () => void;

  ngOnInit() {
    // ── Fix 1: Auto-unsubscribe with takeUntilDestroyed ────
    interval(1000).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(n => this.data = n);

    // ── Fix 2: Renderer2 for safe DOM event listeners ──────
    // Renderer2 auto-cleans up via destroyRef when Angular removes component
    this.removeResizeListener = this.renderer.listen(
      'window', 'resize', () => console.log('Resize handled safely')
    );

    // ── Fix 3: Manual cleanup via DestroyRef ───────────────
    this.destroyRef.onDestroy(() => {
      this.removeResizeListener(); // remove native listener
      console.log('All resources cleaned up!');
    });
  }
}`,
            language: `typescript`,
          },
          {
            heading: `Microfrontends (Module Federation) shared state`,
            content: `<h5>Scenario Question:</h5><p><em>"How would you share Signal state between standalone components in a micro-frontend setup?"</em></p><h5>Answer:</h5><p>Compile a lightweight shared package (e.g. <code>&#64;shared/state</code>) containing a Service or subject. Since Module Federation loads shared modules dynamically, declare the service as a singleton provider in the shell configuration, ensuring both host and remote micro-frontends share the same instance of the state store rather than creating separate local ones.</p>`,
            codeExample: `// ── shared-state library (published as NPM or NX lib) ─────
// packages/shared-state/src/index.ts

import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })  // singleton
export class GlobalCartStore {
  private _items = signal<CartItem[]>([]);

  // Public read-only signals for consumers
  items     = this._items.asReadonly();
  itemCount = computed(() => this._items().length);
  total     = computed(() =>
    this._items().reduce((sum, item) => sum + item.price, 0)
  );

  addItem(item: CartItem)    { this._items.update(list => [...list, item]); }
  removeItem(id: string)     { this._items.update(list => list.filter(i => i.id !== id)); }
  clearCart()                { this._items.set([]); }
}

// ── webpack.config.js — shell app (host) ──────────────────
// shared: {
//   '@shared/state': { singleton: true, requiredVersion: '^1.0.0' }
// }

// ── In Shell Component (Host) ─────────────────────────────
// cart = inject(GlobalCartStore);
// Template: Items: {{ cart.itemCount() }}  Total: ₹{{ cart.total() }}

// ── In Remote 'orders' micro-frontend ─────────────────────
// webpack.config.js of remote:
// shared: {
//   '@shared/state': { singleton: true } // SAME singleton instance!
// }

// orders.component.ts:
// cart = inject(GlobalCartStore); // gets SAME instance as shell
// addToCart(product: Product) {
//   this.cart.addItem({ id: product.id, name: product.name, price: product.price });
//   // Shell's cart badge updates automatically — Signal reactivity!
// }`,
            language: `typescript`,
          },
          {
            heading: `Web Workers for heavy background tasks`,
            content: `<h5>Scenario Question:</h5><p><em>"How do you run CPU-intensive mathematical tasks without blocking user input on the UI thread?"</em></p><h5>Answer:</h5><p>Run heavy calculations inside a <strong>Web Worker</strong>. Scaffolding is done via Angular CLI: <code>ng g web-worker worker-name</code>. The component triggers computation by sending data to the worker: <code>worker.postMessage(...)</code>. The worker computes in a separate background thread, and sends back the result via <code>postMessage(...)</code>, leaving the main UI thread free and responsive.</p>`,
            codeExample: `// ── Step 1: Generate web worker ───────────────────────────
// ng generate web-worker app (creates src/app/app.worker.ts)

// ── src/app/app.worker.ts ─────────────────────────────────
/// <reference lib="webworker" />

// This runs in a separate background thread (not the UI thread)
addEventListener('message', ({ data }) => {
  console.log('Worker received:', data);

  // Simulate CPU-intensive work: prime number sieve
  const { limit } = data;
  const sieve = new Array(limit + 1).fill(true);
  sieve[0] = sieve[1] = false;

  for (let i = 2; i * i <= limit; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= limit; j += i) {
        sieve[j] = false;
      }
    }
  }

  const primes = sieve
    .map((isPrime, n) => (isPrime ? n : null))
    .filter(Boolean);

  // Send result back to main thread
  postMessage({ primes, count: primes.length });
});

// ── Component using Web Worker ─────────────────────────────
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-prime-calculator',
  standalone: true,
  template: \`
    <div class="card p-4">
      <h4>Prime Number Calculator</h4>
      <button class="btn btn-primary" (click)="calculate()" [disabled]="isRunning()">
        {{ isRunning() ? 'Calculating...' : 'Find Primes up to 1,000,000' }}
      </button>

      @if (result()) {
        <div class="alert alert-success mt-3">
          Found <strong>{{ result()!.count }}</strong> prime numbers!
          (UI stayed responsive throughout)
        </div>
      }
    </div>
  \`
})
export class PrimeCalculatorComponent {
  isRunning = signal(false);
  result    = signal<{ count: number } | null>(null);

  calculate() {
    if (typeof Worker === 'undefined') return;

    this.isRunning.set(true);
    this.result.set(null);

    const worker = new Worker(new URL('./app.worker', import.meta.url));

    worker.onmessage = ({ data }) => {
      this.result.set(data);
      this.isRunning.set(false);
      worker.terminate(); // clean up
    };

    // Send work to background thread — UI remains responsive
    worker.postMessage({ limit: 1_000_000 });
  }
}`,
            language: `typescript`,
          },
          {
            heading: `Legacy app migration scenario`,
            content: `<h5>Scenario Question:</h5><p><em>"How would you migrate a legacy AngularJS app containing dynamic views to modern Angular Standalone architectures?"</em></p><h5>Answer:</h5><p>Use a <strong>hybrid application pattern</strong> (using <code>&#64;angular/upgrade</code>) or a <strong>clean phase-by-phase rewrite</strong>:</p><ol><li>Configure route redirects to load new Angular components side-by-side with AngularJS views.</li><li>Downgrade new Standalone components using <code>downgradeComponent</code> to let AngularJS render them in old layouts.</li><li>Upgrade legacy shared services so Angular services can resolve legacy API states.</li><li>Bootstrap the hybrid application dynamically using <code>UpgradeModule</code>, and systematically retire AngularJS modules page-by-page.</li></ol>`,
            codeExample: `// ── Phase 1: Hybrid setup (AngularJS + Angular side-by-side)
import { downgradeComponent, UpgradeModule } from '@angular/upgrade/static';

// ── Downgrade a new Angular component for AngularJS usage ─
import { NewDashboardComponent } from './new-dashboard.component';

// Register the downgraded component as an AngularJS directive
angular.module('legacyApp')
  .directive('newDashboard',
    downgradeComponent({ component: NewDashboardComponent })
  );

// In AngularJS template: <new-dashboard [user]="ctrl.user"></new-dashboard>

// ── Upgrade an AngularJS service for Angular usage ─────────
import { UpgradeModule } from '@angular/upgrade/static';

@NgModule({
  imports: [UpgradeModule, BrowserModule]
})
export class AppModule {
  constructor(private upgrade: UpgradeModule) {}

  ngDoBootstrap() {
    // Bootstrap the AngularJS app from Angular
    this.upgrade.bootstrap(document.body, ['legacyApp']);
  }
}

// ── Phase 2: Route-by-route migration ─────────────────────
// Gradually move each AngularJS route to modern Angular route
// 1. Create standalone Angular component for the feature
// 2. Add route in Angular router (lazy-loaded)
// 3. Redirect legacy AngularJS route: $location.path('/legacy') → '/new'
// 4. Once all users on new route, delete old AngularJS module

// ── Phase 3: Remove UpgradeModule entirely ─────────────────
// When all pages are migrated:
// → Switch to bootstrapApplication() (standalone)
// → Remove AngularJS scripts from index.html
// → Delete angular.module() code`,
            language: `typescript`,
          },
        ],
      },
    ],
  },
];
