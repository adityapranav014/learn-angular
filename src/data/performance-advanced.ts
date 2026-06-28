import { StudyNote } from './study-notes.types';

export const performanceAdvancedNote: StudyNote = {
    id: 'performance-advanced',
    title: 'Performance & Advanced',
    icon: 'bi-speedometer2',
    category: 'Optimization',
    versions: [

      // Fundamentals
      {
        version: 'fundamentals',
        label: 'Change Detection',
        sections: [

          // Change Detection: Default vs OnPush
          {
            heading: 'Change Detection: Default vs OnPush',
            mermaidDefinitions: [`
  graph TD
    %% Event Origin
    Event["Event Triggered <br/> (Click, HTTP, Timer)"] --> Engine{"Change Detection Engine"}
    
    %% Pathways
    Engine -- "Default Strategy" --> Def["Traverses entire <br/> Component Tree"]
    Engine -- "OnPush Strategy" --> OP_Check{"Trigger Validation"}
    
    %% OnPush Logic
    OP_Check -- "No specific trigger" --> OP_Skip["Skips Checks 🛡️ <br/> (Saves CPU)"]
    OP_Check -- "Input Ref Changed / <br/> Signal Emitted" --> OP_Run["Updates isolated <br/> View Node ⚡"]
    
    %% Outcomes
    Def --> Warn["Can cause UI lag <br/> at enterprise scale"]

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef danger fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337;
    classDef success fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534;
    classDef shield fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a,font-weight:bold;

    class Engine coreEngine;
    class Def,Warn danger;
    class OP_Check default;
    class OP_Skip shield;
    class OP_Run success;
`],
            content: `<div class="mb-3">
  <p>Change detection is how Angular decides which parts of the DOM to update after state changes.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Default:</strong> Angular checks every component top-down on every event (click, HTTP, timer). Safe but can be slow in large trees.</li>
    <li><strong>OnPush:</strong> Angular only checks a component when its <code>@Input()</code> reference changes, an event fires inside it, or an Observable in the template emits. Significantly reduces checks.</li>
  </ul>

  <h5>Reference Table</h5>
  <table class="table table-bordered mt-2 small"><thead><tr><th>Strategy</th><th>When it checks</th><th>Use when</th></tr></thead><tbody><tr><td>Default</td><td>Every event / timer</td><td>Prototyping, simple apps</td></tr><tr><td>OnPush</td><td>Input ref change / event / async emit</td><td>Performance-critical components</td></tr></tbody></table>
</div>`,
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

          // @defer Blocks — Lazy UI Loading
          {
            heading: '@defer Blocks — Lazy UI Loading',
            mermaidDefinitions: [`
  graph TD
    %% Trigger Phase
    Trigger["Browser Trigger <br/> (idle, viewport, hover)"] --> Defer{"@defer Engine"}
    
    %% Lifecycle phases
    Defer -- "1. Pre-Load State" --> Place["@placeholder <br/> (Initial Static UI)"]
    Defer -- "2. Network Active" --> Load["@loading <br/> (Skeleton / Spinner)"]
    
    %% Network Resolution
    Load -- "3. Network Success" --> Main["Main Chunk Loaded ✅ <br/> (Heavy Component)"]
    Load -- "3. Network Failure" --> Err["@error <br/> (Fallback UI)"]

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef pending fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#64748b;
    classDef success fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534,font-weight:bold;
    classDef danger fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337;

    class Defer coreEngine;
    class Place,Load pending;
    class Main success;
    class Err danger;
`],
            content: `<div class="mb-3">
  <p>Angular 17 introduced <code>&#64;defer</code> blocks: a declarative way to lazy-load components and their dependencies only when needed. This reduces the initial bundle size without any manual dynamic imports.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>&#64;defer (on viewport):</strong> Load when the placeholder enters the viewport.</li>
    <li><strong>&#64;defer (on idle):</strong> Load during browser idle time.</li>
    <li><strong>&#64;defer (on interaction):</strong> Load when the user hovers or clicks the trigger.</li>
    <li><strong>&#64;loading / &#64;placeholder / &#64;error:</strong> Built-in blocks for loading states and error handling.</li>
  </ul>
</div>`,
            codeFiles: [
              {
                fileName: 'product-page.component.html',
                language: 'xml',
                code: `@defer (on viewport) {
  <app-analytics-chart [productId]="id()" />
} @loading (minimum 300ms) {
  <div class="skeleton-chart rounded-3 bg-light" style="height: 200px;"></div>
} @placeholder {
  <div class="text-muted small text-center py-4">Scroll to load chart</div>
} @error {
  <p class="text-danger">Failed to load chart. <button (click)="reload()">Retry</button></p>
}

@defer (on interaction(reviewsTrigger)) {
  <app-reviews [productId]="id()" />
} @placeholder {
  <div #reviewsTrigger class="btn btn-outline-secondary">Load Reviews</div>
}`
              }
            ]
          },

          // trackBy in @for Loops
          {
            heading: 'trackBy in @for Loops',
            mermaidDefinitions: [`
  graph LR
    %% Data Input
    Data["Array Mutated <br/> (Sort/Filter/Update)"] --> Track{"Tracking Strategy"}
    
    %% Sub-optimal Path
    Track -- "No Track / $index" --> Destroy["Destroys all DOM Nodes ❌"]
    Destroy --> Rebuild["Rebuilds full DOM <br/> (Causes UI Flicker)"]
    
    %% Optimal Path
    Track -- "track item.id" --> Reconcile["Reconciles by Identity ✅"]
    Reconcile --> Move["Moves existing nodes <br/> (Smooth & Fast)"]

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef danger fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337;
    classDef success fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534,font-weight:bold;

    class Track coreEngine;
    class Destroy,Rebuild danger;
    class Reconcile,Move success;
`],
            content: `<div class="mb-3">
  <p>The <code>track</code> expression in <code>&#64;for</code> tells Angular how to identify each item. Using a stable unique key (like <code>item.id</code>) lets Angular move existing DOM nodes instead of destroying and recreating them when the array changes.</p>

  <h5>1. Details</h5>
  <ul>
    <li>Without track or tracking by <code>$index</code>: Angular destroys all DOM nodes and rebuilds — causes visual flicker, lost focus, and animation resets.</li>
    <li>With <code>track item.id</code>: Angular reconciles by identity — only inserts/removes/moves the changed item.</li>
  </ul>
</div>`,
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

      // Advanced Patterns
      {
        version: 'advanced',
        label: 'Advanced Patterns',
        sections: [

          // Zoneless Change Detection
          {
            heading: 'Zoneless Change Detection (Angular 18+)',
            mermaidDefinitions: [`
  graph TD
    %% Engine Selection
    App["Angular 18+ Architecture"] --> Engine{"Change Detection Engine"}
    
    %% Legacy Path
    Engine -- "Legacy System" --> Zone["Zone.js Inclusion"]
    Zone --> Poly["Monkey-patches DOM APIs <br/> (Heavier Bundle: ~40kb)"]
    
    %% Modern Path
    Engine -- "Modern Opt-In" --> Sig["Zoneless Signals"]
    Sig --> React["Pure Reactive Execution <br/> (markForCheck)"]
    React --> Fast["Faster Startup & <br/> Leaner Execution ✅"]

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef legacy fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#64748b,stroke-dasharray:4;
    classDef success fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534,font-weight:bold;

    class Engine coreEngine;
    class Zone,Poly legacy;
    class Sig,React,Fast success;
`],
            content: `<div class="mb-3">
  <p>Angular 18 introduced experimental zoneless change detection. Instead of relying on Zone.js to patch browser APIs and trigger checks, the framework reacts only to Signal mutations and explicit <code>markForCheck()</code> calls.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Smaller bundle:</strong> Removes Zone.js (~40 KB gzipped).</li>
    <li><strong>Faster startup:</strong> No monkey-patching of <code>setTimeout</code>, <code>Promise</code>, etc.</li>
    <li><strong>Requirement:</strong> All state must be in Signals or explicitly marked — no "magic" change detection from class property mutations.</li>
  </ul>
</div>`,
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

          // Virtual Scrolling with CDK
          {
            heading: 'Virtual Scrolling with CDK',
            mermaidDefinitions: [`
  graph LR
    %% Data Flow
    Data["Large Array <br/> (10,000+ Items)"] --> CDK{"CDK Virtual Viewport"}
    
    %% Engine Logic
    CDK -- "Scroll Position Math" --> Math["Calculates Visible Range"]
    Math -- "Extracts Slice" --> Render["Renders ONLY ~10 DOM Nodes ⚡"]

    %% Output
    Render -.-> Perf["Prevents DOM Bloat & Freezing"]

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef perf fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;

    class CDK coreEngine;
    class Render,Perf perf;
`],
            content: `<div class="mb-3">
  <p>Rendering thousands of DOM nodes at once degrades performance. Angular CDK's <code>cdk-virtual-scroll-viewport</code> renders only the items visible in the viewport, keeping the DOM small regardless of list size.</p>

</div>`,
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

          // Memoization with Pure Pipes
          {
            heading: 'Memoization with Pure Pipes',
            mermaidDefinitions: [`
  graph TD
    %% Execution Flow
    Exec["Template CD Cycle Runs"] --> Pipe{"Is Pipe Input Same?"}
    
    %% Branches
    Pipe -- "Yes (Same Reference)" --> Cache["Returns Cached Output ⚡"]
    Pipe -- "No (New Reference)" --> Calc["Executes transform() Logic ⚙️"]
    
    %% Result
    Cache --> UI["Renders View"]
    Calc --> UI

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef success fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534,font-weight:bold;
    classDef warn fill:#fff7ed,stroke:#ea580c,stroke-width:2px,color:#9a3412;

    class Pipe coreEngine;
    class Cache success;
    class Calc warn;
`],
            content: `<div class="mb-3">
  <p>Avoid calling expensive functions inside templates — they run on every change detection cycle. Wrapping them in a <strong>pure pipe</strong> caches the result and only recalculates when the input reference changes.</p>

</div>`,
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

      // Scenario Prep
      {
        version: 'scenarios',
        label: 'Scenario Prep',
        sections: [

          // Slow List Rendering
          {
            heading: 'Slow List Rendering with 1000+ Items',
            mermaidDefinitions: [`
  graph TD
    %% Architecture Stack
    Prob["⚠️ Massive Data Stream (Browser Freezes)"] --> Step1["1. Virtual Scrolling <br/> (CDK limits DOM size)"]
    Step1 --> Step2["2. track item.id <br/> (Stops DOM recreation)"]
    Step2 --> Step3["3. OnPush Strategy <br/> (Skips unrelated node checks)"]
    Step3 --> Step4["4. @defer Blocks <br/> (Lazy loads offscreen filters)"]
    
    Step4 --> Sol["✅ Fluid 60fps Experience"]

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef prob fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337;
    classDef sol fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534,font-weight:bold;
    classDef fix fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;

    class Prob prob;
    class Step1,Step2,Step3,Step4 fix;
    class Sol sol;
`],
            content: `<div class="mb-3">
  <h5>Scenario Question</h5>
  <p><em>"A product catalog with 1000+ items scrolls slowly and freezes the browser. What are your optimization strategies?"</em></p>

  <h5>Solution</h5>
  <ol><li><strong>Virtual scrolling:</strong> Use <code>cdk-virtual-scroll-viewport</code> so only visible rows exist in the DOM.</li><li><strong>track by id:</strong> Ensure <code>&#64;for</code> uses a stable unique key to avoid full DOM recreation on sort/filter.</li><li><strong>OnPush:</strong> Apply <code>ChangeDetectionStrategy.OnPush</code> to list-item components so Angular skips them during unrelated events.</li><li><strong>&#64;defer:</strong> Defer offscreen sections (filters, pagination) until idle or in-viewport.</li></ol>
</div>`,
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
        <cdk-virtual-scroll-viewport itemSize="64" style="height: 600px; overflow-y: auto;">
            @for (p of filtered(); track p.id) {
        <app-product-row [product]="p" />
      }
    </cdk-virtual-scroll-viewport>

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

          // Avoiding Memory Leaks
          {
            heading: 'Avoiding Memory Leaks with Subscriptions',
            mermaidDefinitions: [`
  graph TD
    %% Connection Architecture
    WS["WebSocket Feed"] --> Comp["Component Mounted"]
    Comp --> Nav["User Navigates Away"]
    
    %% Scenarios
    Nav -- "Unmanaged Pipe" --> Bad["Subscription Survives"]
    Bad --> Leak["⚠️ Memory Leak <br/> (Component locked in heap)"]
    
    Nav -- "takeUntilDestroyed()" --> Good["RxJS Kills Stream"]
    Good --> GC["✅ Garbage Collection Frees Memory"]

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef danger fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337;
    classDef success fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534,font-weight:bold;
    classDef reactive fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;

    class Bad,Leak danger;
    class Good,GC success;
    class WS reactive;
`],
            content: `<div class="mb-3">
  <h5>Scenario Question</h5>
  <p><em>"After navigating away from a page, the app gets slower over time. How do you diagnose and fix subscription memory leaks?"</em></p>

  <h5>Solution</h5>
  <p>Long-lived subscriptions (intervals, WebSockets, global event streams) keep a reference to the component, preventing garbage collection. The component is "destroyed" but still processing events.</p><p><strong>Detection:</strong> Open Chrome DevTools Memory tab → take heap snapshot → filter by component name → if instances grow over navigation cycles, there's a leak.</p><p><strong>Fix hierarchy:</strong> <code>AsyncPipe</code> → <code>takeUntilDestroyed()</code> → manual <code>ngOnDestroy</code>.</p>
</div>`,
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
  };
