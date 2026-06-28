import { StudyNote } from './study-notes.types';

export const routingFormsNote: StudyNote = // Routing & Forms
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
            content: `<div class="mb-3">
  <p>The Angular Router is a powerful service that maps browser URLs to specific components, enabling SPA navigation. It supports static, dynamic, and lazy-loaded routes.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Route Config:</strong> An array of objects defining the path, component, and optional guards or lazy-loading logic.</li>
    <li><strong>Order Matters:</strong> Angular matches routes top-down. The wildcard (<code>**</code>) must always be the last entry to catch undefined paths.</li>
    <li><strong>Preloading:</strong> Use <code>withPreloading(PreloadAllModules)</code> to optimize performance by fetching lazy chunks in the background after the initial app load.</li>
  </ul>
</div>`,
            mermaidDefinitions: [`
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
`],
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
            mermaidDefinitions: [`
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
`],
            content: `<div class="mb-3">
  <p>Use <code>ActivatedRoute</code> to read URL parameters and query strings in a component. Angular 16+ provides a signal-based alternative via <code>inject(ActivatedRoute)</code>:</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Snapshot:</strong> Read a single value at component creation. Fast but misses changes if the route updates without destroying the component (e.g., <code>/products/1</code> → <code>/products/2</code>).</li>
    <li><strong>Observable <code>paramMap</code>:</strong> Reactively re-reads whenever the URL changes — correct approach for re-usable detail pages.</li>
    <li><strong>Query params:</strong> Key-value pairs after <code>?</code> in the URL, e.g., <code>/products?sort=price&amp;page=2</code>.</li>
  </ul>
</div>`,
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
            mermaidDefinitions: [`
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
`],
            content: `<div class="mb-3">
  <p>Guards are functions that control whether a route can be activated or exited.</p>

  <h5>1. Details</h5>
  <ul>
    <li><strong>canActivate:</strong> Runs before a route loads. Return <code>true</code>/<code>false</code> or a <code>UrlTree</code> to redirect. Used to protect authenticated routes.</li>
    <li><strong>canDeactivate:</strong> Runs before leaving a route. Useful for prompting "Unsaved changes — leave anyway?" when a form is dirty.</li>
    <li>Modern guards are plain functions (Angular 15+), not classes.</li>
  </ul>
</div>`,
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
            mermaidDefinitions: [`
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
`],
            content: `<div class="mb-3">
  <p>Angular provides two approaches for handling user input through forms:</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Template-Driven:</strong> Defined in the HTML template using directives (<code>ngModel</code>, <code>ngForm</code>). Simple and quick for small forms. Two-way binding, less testable.</li>
    <li><strong>Reactive (Model-Driven):</strong> Defined programmatically in the component class using <code>FormBuilder</code>, <code>FormGroup</code>, and <code>FormControl</code>. Explicit, fully testable, supports complex validation logic and dynamic forms.</li>
  </ul>

  <h5>Reference Table</h5>
  <table class="table table-bordered mt-2 small"><thead><tr><th>Feature</th><th>Template-Driven</th><th>Reactive</th></tr></thead><tbody><tr><td>Setup</td><td>HTML directives</td><td>FormBuilder in class</td></tr><tr><td>Validation</td><td>HTML attributes</td><td>Validator functions</td></tr><tr><td>Testing</td><td>Harder (DOM-coupled)</td><td>Easy (plain objects)</td></tr><tr><td>Dynamic fields</td><td>Limited</td><td>Full support</td></tr></tbody></table>
</div>`,
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
            content: `<div class="mb-3">
  <p>Lazy loading is a design pattern that defers the initialization of resources until they are actually needed, significantly reducing the initial bundle size and improving "Time to Interactive" (TTI).</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>loadComponent:</strong> Ideal for loading a single standalone component only when the user navigates to a specific route.</li>
    <li><strong>loadChildren:</strong> Used to load a bundle containing multiple routes and their associated sub-components, common for large features like an <code>/admin</code> dashboard.</li>
    <li><strong>Preloading:</strong> A strategy where Angular fetches non-essential route chunks in the background while the user is idle, ensuring subsequent navigation feels instantaneous.</li>
  </ul>
</div>`,
            mermaidDefinitions: [`
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
`],
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
            mermaidDefinitions: [`graph LR
    FG[FormGroup - Entire Form] --> FA[FormArray - Dynamic Array Tracker]
    FA -->|push| C1[FormControl 0 - Angular]
    FA -->|push| C2[FormControl 1 - TypeScript]
    FA -.->|removeAt| C2

    classDef parent fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    classDef child fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;

    class FG,FA parent;
    class C1,C2 child;`],
            content: `<div class="mb-3">
  <p><code>FormArray</code> manages a dynamic list of form controls or groups. It's useful when the user can add or remove items, such as a list of phone numbers, skills, or line items.</p>

</div>`,
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
            mermaidDefinitions: [`
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
`],
            content: `<div class="mb-3">
  <p>Custom validators are plain functions that accept a <code>FormControl</code> and return a <code>ValidationErrors</code> object if invalid, or <code>null</code> if valid.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Sync validators:</strong> Return errors immediately.</li>
    <li><strong>Async validators:</strong> Return a <code>Promise</code> or <code>Observable</code> of errors. Useful for checking if a username is taken via an API call.</li>
    <li><strong>Cross-field validators:</strong> Applied to a <code>FormGroup</code> to compare multiple controls (e.g., password confirmation).</li>
  </ul>
</div>`,
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
            mermaidDefinitions: [`
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
`],
            content: `<div class="mb-3">
  <h5>Scenario Question</h5>
  <p><em>"A user fills in a multi-step form, navigates away to check something, and returns. The form is blank. How do you fix this?"</em></p>

  <h5>Solution</h5>
  <p>Persist the form value in a service (not the component). Since services are singletons, they survive navigation. Restore the form value in <code>ngOnInit</code>.</p>
</div>`,
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
            mermaidDefinitions: [`
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
`],
            content: `<div class="mb-3">
  <h5>Scenario Question</h5>
  <p><em>"Your app bundle is 3 MB and initial load is slow. How would you reduce it using the router?"</em></p>

  <h5>Solution</h5>
  <p>Audit bundle with <code>ng build --stats-json</code> and webpack-bundle-analyzer. Then lazy-load every route that isn't needed on first paint using <code>loadComponent</code>. Combine with <code>withPreloading</code> to background-load the rest after bootstrap:</p>
</div>`,
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
  };
