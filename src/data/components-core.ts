import { StudyNote } from './study-notes.types';

export const componentsCoreNote: StudyNote = // Components & Core  
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
          content: `<div class="mb-3">
  <p>Angular components undergo a strict lifecycle from creation to destruction. By implementing these lifecycle interfaces, you can inject custom logic at specific chronological milestones:</p>
  
  <h5>1. Initialization Phase</h5>
  <ul>
    <li><strong>ngOnChanges:</strong> Executes before <code>ngOnInit</code> and every time a data-bound <code>@Input()</code> property changes. It receives a <code>SimpleChanges</code> object with previous and current values.</li>
    <li><strong>ngOnInit:</strong> Runs exactly once after the first <code>ngOnChanges</code>. This is the industry standard for fetching initial backend data, setting up component state, and handling complex initializations.</li>
  </ul>

  <h5>2. Detection & Rendering Phase</h5>
  <ul>
    <li><strong>ngDoCheck:</strong> Runs during every change detection cycle for custom logic. <em>Warning: Keep this lightweight to avoid severe performance bottlenecks.</em></li>
    <li><strong>ngAfterViewInit:</strong> Runs once after Angular fully paints the component's views. Essential for direct DOM manipulations and safely accessing <code>@ViewChild</code> properties.</li>
  </ul>

  <h5>3. Destruction Phase</h5>
  <ul>
    <li><strong>ngOnDestroy:</strong> The final cleanup phase before the component is destroyed. Crucial for preventing memory leaks by unsubscribing from Observables, detaching event listeners, and stopping timers.</li>
  </ul>
</div>`,
          mermaidDefinitions: [`
  graph TD
    id["constructor"] --> CHANGE
    
    subgraph CHANGE ["Angular's lifecycle hooks"]
        direction TB
        ngOnChanges --> ngOnInit
        ngOnInit --> ngDoCheck
        ngDoCheck --> ngAfterContentInit
        ngDoCheck --> ngAfterViewInit
        ngAfterContentInit --> ngAfterContentChecked
        ngAfterViewInit --> ngAfterViewChecked
    end
    
    CHANGE -- "Rendering" --> afterNextRender --> afterEveryRender

    %% Styling
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef hook fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#475569;
    classDef render fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;

    class id,ngOnChanges,ngOnInit,ngDoCheck,ngAfterContentInit,ngAfterViewInit,ngAfterContentChecked,ngAfterViewChecked hook;
    class afterNextRender,afterEveryRender render;
    style CHANGE fill:#faf5ff,stroke:#e879f9,stroke-width:1px;
`, `
  graph TD
    subgraph CHANGE ["Change detection"]
        direction TB
        ngOnChanges --> ngDoCheck
        ngDoCheck --> ngAfterContentChecked
        ngDoCheck --> ngAfterViewChecked
    end
    
    CHANGE -- "Rendering" --> afterEveryRender

    %% Styling
    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef hook fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#475569;
    classDef render fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    
    class ngOnChanges,ngDoCheck,ngAfterContentChecked,ngAfterViewChecked hook;
    class afterEveryRender render;
    style CHANGE fill:#faf5ff,stroke:#e879f9,stroke-width:1px;
`, `
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
`, `
  graph TD
    Step1["1. constructor <br/> (Class Instantiated)"] --> Step2["2. ngOnChanges <br/> (Input bindings active)"]
    Step2 --> Step3["3. ngOnInit <br/> (Initializations complete)"]
    Step3 --> Step4["4. ngDoCheck <br/> (Custom detection cycle)"]
    Step4 --> Step5["5. ngAfterContentInit / Checked <br/> (Projected content ready)"]
    Step5 --> Step6["6. ngAfterViewInit / Checked <br/> (Template views fully painted)"]
    Step6 --> Step7["7. ngOnDestroy <br/> (Component teardown & cleanup)"]

    classDef default fill:#ffffff,stroke:#e5e7eb,stroke-width:1px,color:#202124;
    classDef hook fill:#fdf4ff,stroke:#c026d3,stroke-width:2px,color:#202124,font-weight:bold;
    classDef term fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337,font-weight:bold;

    class Step1,Step2,Step3,Step4,Step5,Step6 hook;
    class Step7 term;
`],
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
          content: `<div class="mb-3">
  <p>Content projection allows a component to act as a structural wrapper, accepting external HTML from a parent and rendering it into designated layout slots.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Single-Slot Projection:</strong> Captures all provided unassigned markup and funnels it into a single default <code>&lt;ng-content&gt;&lt;/ng-content&gt;</code> tag.</li>
    <li><strong>Multi-Slot Projection:</strong> Uses the <code>select</code> attribute (e.g., <code>select="[card-header]"</code>) to route specific HTML elements into targeted placeholders.</li>
    <li><strong>Component TS Access:</strong> Because projected content originates externally, you must use <code>&#64;ContentChild</code> or <code>&#64;ContentChildren</code> (instead of ViewChild) if your TypeScript class needs to query or manipulate it.</li>
  </ul>
</div>`,
          mermaidDefinitions: [`
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
`],
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
          content: `<div class="mb-3">
  <p>Pipes are declarative data transformers used directly inside your template HTML. They accept an input, modify it, and return a formatted output, all without altering the original property in your component class.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Pure Pipes (Default):</strong> Angular only re-runs a pure pipe when it detects a change to a primitive value (String, Number, Boolean) or a brand-new object reference. Output results are memoized (cached) for optimal performance.</li>
    <li><strong>Impure Pipes:</strong> These run during <em>every single change detection cycle</em>, regardless of whether inputs shifted. While necessary for real-time stateful operations (like the <code>AsyncPipe</code>), unoptimized computations here can trigger severe layout lags.</li>
  </ul>
</div>`,
          mermaidDefinitions: [`
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
`],
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
          content: `<div class="mb-3">
  <p>View queries allow a component's TypeScript class to directly look inside its own rendered template to fetch references to HTML elements, child components, or directives.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>&#64;ViewChild:</strong> Looks for the <strong>first instance</strong> matching a selector. The reference is instantiated during rendering and becomes safely accessible during or after the <code>ngAfterViewInit</code> lifecycle hook.</li>
    <li><strong>&#64;ViewChildren:</strong> Gathers <strong>all matching instances</strong> across the template into a specialized <code>QueryList</code>. This is a real-time tracking wrapper that automatically updates if child structures are modified by <code>&#64;if</code> or <code>&#64;for</code> loops.</li>
  </ul>
</div>`,
          mermaidDefinitions: [`
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
`],
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
          content: `<div class="mb-3">
  <p>Angular templates merge standard HTML with specialized template markup to manage data flow between your TypeScript component class and the browser's view DOM.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Interpolation:</strong> Renders dynamic string calculations directly onto the screen using double curly braces: <code>{{ expression }}</code>.</li>
    <li><strong>Property Binding:</strong> One-way data flow from your class to a DOM element property (e.g., <code>[disabled]="isDisabled"</code>). Always targets DOM properties rather than HTML attributes.</li>
    <li><strong>Attribute Binding:</strong> Used specifically when no matching DOM property exists, targeting the HTML attribute directly (e.g., <code>[attr.aria-label]="label"</code>).</li>
    <li><strong>Class & Style Binding:</strong> Programmatically updates element styles or custom design tokens on the fly (e.g., <code>[class.active]="isActive"</code>).</li>
    <li><strong>Event Binding:</strong> One-way reverse data flow that listens to user actions or custom triggers from the UI back into your logic handler (e.g., <code>(click)="onSave()"</code>).</li>
    <li><strong>Structural Control Flow:</strong> Modern directives (like <code>&#64;if</code> and <code>&#64;for</code>) conditionally generate or repeat layout nodes, reshaping the layout based on current state arrays.</li>
  </ul>
</div>`,
          mermaidDefinitions: [`
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
`],
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
          content: `<div class="mb-3">
  <p>Angular components share data and react to state changes using direct structural relationships or decoupled reactive dependency injection channels.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Parent-to-Child (Downward):</strong> The parent element pushes data down by binding properties to the child. Supported via traditional <code>&#64;Input()</code> property decorators or modern read-only <code>input()</code> Signals.</li>
    <li><strong>Child-to-Parent (Upward):</strong> The child component signals actions upward by emitting events that the parent listens to. Triggered via traditional <code>&#64;Output() EventEmitter</code> streams or modern <code>output()</code> macro initializers.</li>
    <li><strong>Cross-Cutting / Sibling (Global):</strong> Unrelated or distant components communicate by injecting a shared singleton <code>&#64;Injectable()</code> data service. This service encapsulates a reactive broker—typically an RxJS <code>BehaviorSubject</code> or a shared <code>writable()</code> Signal.</li>
  </ul>
</div>`,
          mermaidDefinitions: [`
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
`],
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
          content: `<div class="mb-3">
  <p>In Angular 16, Standalone Components became the default and recommended way to build applications, removing the necessity of <code>NgModules</code>.</p>

  <h5>1. Details</h5>
  <ul>
    <li>Standalone components, directives, and pipes specify their dependencies directly using the <code>imports</code> array.</li>
    <li>Simplifies the mental model, scaffolds lighter builds, and makes components directly reusable.</li>
    <li>Applications are bootstrapped using <code>bootstrapApplication(RootComponent, config)</code> instead of module bootstrapping.</li>
  </ul>
</div>`,
          mermaidDefinitions: [`
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
`],
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
          content: `<div class="mb-3">
  <p>Angular 17 introduced a new built-in block syntax for control flow. It replaces the structural directives <code>*ngIf</code>, <code>*ngFor</code>, and <code>*ngSwitch</code>.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Performance:</strong> Built directly into the compiler, reducing execution overhead and boosting rendering speed by up to 90% in complex loops.</li>
    <li><strong>Zero Imports:</strong> No need to import <code>CommonModule</code> or <code>NgIf</code>/<code>NgFor</code> into standalone components.</li>
    <li><strong>@empty support:</strong> Built-in block in <code>@for</code> loops that renders placeholder content when the array is empty.</li>
    <li><strong>Strict Tracking:</strong> The <code>track</code> expression is now required in <code>@for</code> loops, preventing performance bugs from omitting <code>trackBy</code>.</li>
  </ul>
</div>`,
          mermaidDefinitions: [`
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
`],
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
          content: `<div class="mb-3">
  <p>Angular 17 introduced two new lifecycle hooks for executing operations safely in browser environments, particularly helpful when using Server-Side Rendering (SSR):</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>afterRender:</strong> Runs after every change detection cycle has finished rendering the page. Useful for DOM manipulation or measuring elements.</li>
    <li><strong>afterNextRender:</strong> Runs exactly once after the next rendering cycle completes. Best for initializing third-party libraries that need access to the browser DOM.</li>
  </ul>
</div>`,
          mermaidDefinitions: [`
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
`],
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
          content: `<div class="mb-3">
  <p>Angular 17 introduced signal-based component communication, making inputs and outputs fully reactive primitives.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Signal Inputs:</strong> Declared via <code>input()</code> or <code>input.required()</code>. They return a read-only Signal.</li>
    <li><strong>Signal Outputs:</strong> Declared via <code>output()</code> or <code>outputFromObservable()</code>. Serves as a streamlined replacement for <code>@Output() EventEmitter</code>.</li>
  </ul>
</div>`,
          mermaidDefinitions: [`
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
`],
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
          content: `<div class="mb-3">
  <p>Angular 18 introduced the <code>@let</code> declaration syntax directly inside component templates, revolutionizing how local view state is managed.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Eliminates Stream Duplication:</strong> Solves the classic limitation where developers had to use heavy structural directives (like <code>*ngIf="..." as user</code>) just to capture an async value.</li>
    <li><strong>Local Scope Block:</strong> Variables are scoped to the current template block and its children, preventing state bleeding.</li>
    <li><strong>Strict Type Inference:</strong> Fully compatible with the Angular Language Service, giving students real-time IDE type checking and auto-completion.</li>
  </ul>
</div>`,
          mermaidDefinitions: [`
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
`],

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
          content: `<div class="mb-3">
  <p>Angular 18 added native fallback capabilities directly to the <code>&lt;ng-content&gt;</code> tag, removing complex workaround logic for empty states.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Zero Component Logic:</strong> No need to write component-level conditional checks (like <code>@if</code> with ElementRef queries) to verify if a parent provided projection data.</li>
    <li><strong>Native Slots:</strong> Standard HTML and child components placed inside <code>&lt;ng-content&gt;</code> act automatically as default placeholders.</li>
    <li><strong>Multi-Slot Support:</strong> Operates perfectly across both default slots and targeted attribute selectors (e.g., <code>select="[dialog-title]"</code>).</li>
  </ul>
</div>`,
          mermaidDefinitions: [`
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
`],
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
          content: `<div class="mb-3">
  <p>Angular natively integrates with the browser's native <strong>View Transitions API</strong>, offering smooth, hardware-accelerated animated transitions during router navigation.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>Native Hooking:</strong> Enabled globally in your routing setup via the <code>withViewTransitions()</code> feature provider.</li>
    <li><strong>Automatic State Capturing:</strong> The framework automatically orchestrates taking DOM screenshots before and after navigation transitions occur.</li>
    <li><strong>CSS Pseudo-Element Customization:</strong> Allows students to hook straight into CSS standard animations via the pseudo-elements <code>::view-transition-old()</code> and <code>::view-transition-new()</code>.</li>
  </ul>
</div>`,
          mermaidDefinitions: [`
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
`],

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
          content: `<div class="mb-3">
  <p>A classic production bug occurs when asynchronous network responses arrive out of order, overriding the UI with stale data. Resolving this requires understanding RxJS flattening operators within user-driven streams.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>The Vulnerability:</strong> Using <code>mergeMap</code> or <code>switchMap</code> incorrectly can result in a slow network request from a previous keystroke resolving *after* a faster, newer request, corrupting the results.</li>
    <li><strong>The Remedy (switchMap):</strong> <code>switchMap</code> acts as an execution broker—the moment a new emission arrives from the source stream, it immediately cancels (unsubscribes from) the previous active inner observable search request.</li>
    <li><strong>Stream Resiliency:</strong> Always catch errors *inside* the inner observable stream. Catching errors on the outer stream will cause the entire user search input listener to break permanently upon the first API failure.</li>
  </ul>
</div>`,
          mermaidDefinitions: [`
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
`],
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
          content: `<div class="mb-3">
  <p>By default, Angular runs change detection across the entire component tree whenever an event fires. For heavy enterprise dashboards, this causes significant UI lag.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>ChangeDetectionStrategy.OnPush:</strong> Instructs the rendering engine to completely skip checking this component unless its <code>@Input()</code> reference alters, an event directly originates inside it, or an observable stream explicitly fires via the <code>AsyncPipe</code>.</li>
    <li><strong>Signals as Fine-Grained Trackers:</strong> Modern Angular Signals provide explicit micro-updates. They inform the framework precisely *where* a value is used in the DOM, allowing parts of the template to re-render without executing macro-level zone evaluations.</li>
  </ul>
</div>`,
          mermaidDefinitions: [`
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
`],
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
          content: `<div class="mb-3">
  <p>Dangling continuous stream subscriptions are the leading cause of memory leaks in SPA architectures, eventually causing the browser tab to slow down or crash.</p>

  <h5>1. Key Concepts</h5>
  <ul>
    <li><strong>The Danger Mode:</strong> Standard component-level <code>.subscribe()</code> calls without an unsubscribe handler will remain active in the browser heap long after the component has been unmounted from the DOM tree.</li>
    <li><strong>takeUntilDestroyed Operator:</strong> A modern Angular operator that ties the pipeline lifetime straight to the framework lifecycle provider, cleaning up the link automatically during the component unmounting sequence.</li>
  </ul>
</div>`,
          mermaidDefinitions: [`
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
`],
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
};
