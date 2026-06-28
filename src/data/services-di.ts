import { StudyNote } from './study-notes.types';

export const servicesDiNote: StudyNote = // Services & DI
  {
    id: 'services-di',
    title: 'Services & DI',
    icon: 'bi-diagram-3',
    category: 'Architecture',
    versions: [

      // Fundamentals
      {
        version: 'fundamentals',
        label: 'Fundamentals',
        sections: [

          // Dependency Injection & Providers
          {
            heading: 'Dependency Injection & Providers',
            mermaidDefinitions: [`
  graph TD
    %% Global Hierarchy Layer
    Root["Root Environment Injector"]
    Logger["LoggerService <br/> (Shared Singleton Instance)"]

    %% UI Component Layer
    Comp1["ProductComponent 1"]
    Comp2["ProductComponent 2"]

    %% Local State Layer
    Prod1["ProductService <br/> (Isolated Instance A)"]
    Prod2["ProductService <br/> (Isolated Instance B)"]

    %% Registration Definitions (Solid lines)
    Root -- "providedIn: 'root'" --> Logger
    Comp1 -- "providers: [ProductService]" --> Prod1
    Comp2 -- "providers: [ProductService]" --> Prod2

    %% Resolution/Lookup Behavior (Dotted lines)
    Comp1 -. "inject(LoggerService) <br/> Looks up tree" .-> Logger
    Comp2 -. "inject(LoggerService) <br/> Looks up tree" .-> Logger

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef rootNode fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    classDef singleton fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef isolated fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a,font-weight:bold;

    class Root rootNode;
    class Logger singleton;
    class Prod1,Prod2 isolated;
`],
            content: `<div class="mb-3">
  <p>Angular's Dependency Injection (DI) system is hierarchical. When a component asks for a service, Angular looks at the component's own injector first, then traverses up the DOM tree until it finds the provider at the Root.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Root Level (<code>providedIn: 'root'</code>):</strong> Creates a single, global instance of the service. Both Component 1 and Component 2 will receive the exact same memory reference. Perfect for shared state, like user authentication or logging.</li>
    <li><strong>Component Level (<code>providers: [...]</code>):</strong> Creates a brand new, isolated instance of the service specifically for that component and its children. Perfect for managing local state, like a specific product's details or a temporary form draft.</li>
  </ul>
</div>`,
            codeFiles: [
              {
                fileName: 'logger.service.ts',
                language: 'typescript',
                code: `import { Injectable } from '@angular/core';

// ── Singleton: Provided globally at the Root ─────────────
@Injectable({ providedIn: 'root' })
export class LoggerService {
  private logs: string[] = [];

  log(message: string) {
    const entry = \`[INFO] \${new Date().toISOString()} — \${message}\`;
    this.logs.push(entry);
    console.log(entry);
  }
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
  // ── Isolated: Every <app-product> gets its own ProductService instance
  providers: [ProductService],
  template: \`<p>{{ product()?.name }}</p>\`
})
export class ProductComponent {
  // Resolves up the tree -> grabs the SINGLETON instance
  private logger = inject(LoggerService);  
  
  // Resolves locally -> grabs the ISOLATED instance defined in providers array
  private products = inject(ProductService); 

  product = this.products.selected;

  constructor() {
    // Because Logger is a singleton, all product components push to the same log array
    this.logger.log('ProductComponent instance initialized');
  }
}`
              }
            ]
          },

          // HttpClient & Interceptors
          {
            heading: 'HttpClient & Interceptors',
            mermaidDefinitions: [`
  graph LR
    %% Interceptor Pipeline Nodes
    App["Angular App <br/> (http.get)"]
    ReqInt["Request Interceptor <br/> (Attach Token)"]
    Server[("Backend API")]
    ResInt["Response Interceptor <br/> (Catch 401 Error)"]

    %% Safe Label Links
    App -- "1. Outgoing Request" --> ReqInt
    ReqInt -- "2. Cloned Request" --> Server
    Server -- "3. HTTP Response" --> ResInt
    ResInt -- "4. Data or Error" --> App

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef interceptor fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    classDef server fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;

    class ReqInt,ResInt interceptor;
    class Server server;
`],
            content: `<div class="mb-3">
  <p><code>HttpClient</code> is Angular's built-in HTTP library. It returns Observables and supports typed responses, error handling, and interceptors.</p>

  <h5>1. Details</h5>
  <ul>
    <li><strong>Interceptors:</strong> Middleware for HTTP requests/responses. Use them for auth token injection, loading spinners, error normalization, and request logging — without modifying each service call.</li>
    <li>Modern interceptors are functions (Angular 15+), not classes.</li>
  </ul>
</div>`,
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

          // Injection Tokens & InjectionToken
          {
            heading: 'Injection Tokens & InjectionToken',
            mermaidDefinitions: [`
  graph TD
    %% Token Assembly Engine
    Factory["Factory Function <br/> (Returns JSON/Object)"]
    Token["APP_CONFIG <br/> (InjectionToken)"]
    Injector{"Angular DI Engine"}
    Service["ApiService <br/> inject(APP_CONFIG)"]

    %% Flow (Safely Quoted)
    Factory -- "Provides Raw Value" --> Token
    Token -- "Registered Key" --> Injector
    Injector -- "Injects Typed Config" --> Service

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef token fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;

    class Injector coreEngine;
    class Token token;
`],
            content: `<div class="mb-3">
  <p>Use <code>InjectionToken</code> to inject non-class values (configuration objects, feature flags, API URLs) into services and components without relying on a class type.</p>

  <h5>1. Details</h5>
  <ul>
    <li>Avoids ambiguity when injecting the same type from multiple sources.</li>
    <li>Supports <code>factory</code> functions for computing initial values.</li>
    <li>Commonly used for environment-specific config, theming, and feature flags.</li>
  </ul>
</div>`,
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

      // Advanced Patterns
      {
        version: 'advanced',
        label: 'Advanced Patterns',
        sections: [

          // Service with Signal-based State
          {
            heading: 'Service with Signal-based State',
            mermaidDefinitions: [`
  graph TD
    %% Encapsulation Architecture
    subgraph Service ["AuthService (Encapsulated State)"]
      direction TB
      Private["_user <br/> (Writable Signal)"]
      Public["user <br/> (.asReadonly)"]
      Computed["isAdmin <br/> (computed)"]

      Private -- "Creates Safe View" --> Public
      Private -- "Derives New State" --> Computed
    end

    Component["Component Template View"]

    Public -- "Synchronous Binding" --> Component
    Computed -- "Synchronous Binding" --> Component

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef privateState fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#64748b,stroke-dasharray:4;
    classDef publicState fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;

    class Private privateState;
    class Public,Computed publicState;
    style Service fill:#faf5ff,stroke:#e879f9,stroke-width:2px;
`],
            content: `<div class="mb-3">
  <p>Replacing <code>BehaviorSubject</code> with Signals in services gives a simpler, synchronous state API that integrates directly into Angular's change detection without needing <code>async</code> pipe or subscriptions.</p>

</div>`,
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

          // Multi-level DI: forwardRef & optional injection
          {
            heading: 'Multi-level DI: forwardRef & optional injection',
            mermaidDefinitions: [`
  graph TD
    %% Resolution Tree
    Req["inject(Service)"] --> Engine{"DI Engine Search"}
    
    %% Decorator Modifiers
    Engine -- "@Self" --> Self["Looks ONLY in current element injector"]
    Engine -- "@SkipSelf" --> Skip["Starts search ONE LEVEL ABOVE"]
    
    %% Outcomes
    Engine -- "Default Resolution" --> Find{"Service Found?"}
    Find -- "Yes" --> Success["Returns Instance ✅"]
    Find -- "No" --> Opt{"Is @Optional?"}
    
    Opt -- "Yes" --> Null["Returns null 🛡️"]
    Opt -- "No" --> Err["Throws NullInjectorError ❌"]

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef success fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534;
    classDef danger fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337;
    classDef modifier fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;

    class Engine coreEngine;
    class Success,Null success;
    class Err danger;
    class Self,Skip modifier;
`],
            content: `<div class="mb-3">
  <p>Advanced DI techniques for handling edge cases:</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>forwardRef:</strong> Resolves a circular reference — when Class A needs Class B and Class B needs Class A.</li>
    <li><strong>@Optional():</strong> The dependency is injected as <code>null</code> if not provided, instead of throwing an error. Useful for optional feature modules.</li>
    <li><strong>@Self() / @SkipSelf():</strong> Controls where in the injector hierarchy Angular looks for the dependency.</li>
  </ul>
</div>`,
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

      // Scenario Prep
      {
        version: 'scenarios',
        label: 'Scenario Prep',
        sections: [

          // Avoiding Shared Mutable State in Services
          {
            heading: 'Avoiding Shared Mutable State in Services',
            mermaidDefinitions: [`
  graph TD
    %% Dangerous Pattern
    subgraph Bad ["❌ Singleton Risk (providedIn: 'root')"]
      direction LR
      C1["Component 1"] -- "Mutates" --> S1["Shared Service State"]
      S1 -- "Bleeds to" --> C2["Component 2"]
    end

    %% Safe Pattern
    subgraph Good ["✅ Component Isolation (providers: [...])"]
      direction LR
      C3["Component A"] -- "Injects" --> S2["Isolated Service A"]
      C4["Component B"] -- "Injects" --> S3["Isolated Service B"]
    end

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef danger fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337;
    classDef success fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534;

    style Bad fill:#fef2f2,stroke:#ef4444,stroke-width:2px,stroke-dasharray:4;
    style Good fill:#f0fdf4,stroke:#22c55e,stroke-width:2px;
`],
            content: `<div class="mb-3">
  <h5>Scenario Question</h5>
  <p><em>"Two unrelated components inject the same service and one's changes affect the other unexpectedly. How do you prevent this?"</em></p>

  <h5>Solution</h5>
  <p>This happens when both components share the same singleton instance and one mutates shared state directly. Fixes:</p><ol><li>Use <strong>component-level providers</strong> (<code>providers: [MyService]</code> in <code>@Component</code>) to give each component its own isolated service instance.</li><li>Design the service with <strong>immutable Signal updates</strong> — always use <code>.set()</code> or <code>.update()</code> rather than mutating nested objects directly.</li></ol>
</div>`,
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

          // Injecting Config without Environment Files
          {
            heading: 'Injecting Config without Environment Files',
            mermaidDefinitions: [`
  graph TD
    %% Boot Sequence
    Boot["main.ts Bootstrap"] --> Init["APP_INITIALIZER Factory"]
    
    %% Async Configuration
    Init -- "1. HTTP GET /config.json" --> Server[("Static Assets <br/> (Runtime Config)")]
    Server -- "2. JSON Object" --> Token["Store in APP_CONFIG Token"]
    Token -- "3. Resolves Promise" --> Render["App Renders"]
    Render -- "4. Components inject(APP_CONFIG)" --> UI["Dynamic Configured UI"]

    %% Styling Architecture
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef coreEngine fill:#c026d3,stroke:#a21caf,stroke-width:2px,color:#ffffff,font-weight:bold;
    classDef server fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;
    classDef success fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534;

    class Init,Token coreEngine;
    class Server server;
    class UI success;
`],
            content: `<div class="mb-3">
  <h5>Scenario Question</h5>
  <p><em>"How would you make your Angular service configurable at runtime (e.g., per-client API URL) without rebuilding the app?"</em></p>

  <h5>Solution</h5>
  <p>Load a <code>config.json</code> file at bootstrap time using <code>APP_INITIALIZER</code>, store the config in a service, and inject it anywhere via an <code>InjectionToken</code>. This avoids baking config into the compiled bundle.</p>
</div>`,
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
  };
