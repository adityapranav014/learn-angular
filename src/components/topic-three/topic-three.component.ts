import { CommonModule, JsonPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';
import { NgbCarousel, NgbSlide, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel';
import { CodeViewerComponent, CodeFile } from '../code-viewer/code-viewer.component';

@Component({
  selector: 'app-topic-three',
  templateUrl: './topic-three.component.html',
  imports: [NgbAccordionModule, CommonModule, FormsModule, JsonPipe, NgbCarousel, NgbSlide, CodeViewerComponent],
})
export class TopicThreeComponent {

  activeIndex = 0;

  slides = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  @ViewChild('carousel')
  carousel!: NgbCarousel;

  onSlide(event: NgbSlideEvent) {
    this.activeIndex = parseInt(event.current.replace('task-', '')) - 1;
  }

  // Slide 1: Theory
  codeFiles1: CodeFile[] = [
    {
      fileName: 'Legacy Directives',
      language: 'html',
      code: `<!-- Dynamic Class (Object/Array/String) -->
<div [ngClass]="{'active': isActive, 'disabled': isDisabled}"></div>

<!-- Dynamic Style (Object) -->
<div [ngStyle]="{'color': textColor, 'font-size': fontSize + 'px'}"></div>`
    },
    {
      fileName: 'Modern Native Bindings',
      language: 'html',
      code: `<!-- Dynamic Class (Single property) -->
<div [class.active]="isActive" [class.disabled]="isDisabled"></div>

<!-- Dynamic Style (Single property with unit) -->
<div [style.color]="textColor" [style.font-size.px]="fontSize"></div>`
    }
  ];

  // Task 1 (slide task-2): [ngClass] vs [class]
  codeFiles2: CodeFile[] = [
    {
      fileName: '[ngClass] (Legacy)',
      language: 'html',
      code: `<!-- Requires importing NgClass -->
<div [ngClass]="dynamicCssClass">
  Dynamic Styles
</div>`
    },
    {
      fileName: '[class] (Modern)',
      language: 'html',
      code: `<!-- Native binding, automatically merges classes -->
<div [class]="dynamicCssClass">
  Dynamic Styles
</div>`
    }
  ];

  // Task 2 (slide task-3): string toggle vs boolean toggle
  codeFiles3: CodeFile[] = [
    {
      fileName: 'String Toggle (Task Method)',
      language: 'html',
      code: `<!-- Swapping the whole string -->
<div [class]="toggleBgClass">...</div>

<button (click)="toggle()">Toggle</button>`
    },
    {
      fileName: 'Boolean Toggle (Industry)',
      language: 'html',
      code: `<!-- Using a boolean: isSuccess = true -->
<div [class.bg-success]="isSuccess" 
     [class.bg-danger]="!isSuccess">
</div>

<button (click)="isSuccess = !isSuccess">
  Toggle
</button>`
    }
  ];

  // Task 3 (slide task-4): dynamic string vs boolean class binding
  codeFiles4: CodeFile[] = [
    {
      fileName: 'Dynamic String Binding',
      language: 'html',
      code: `<!-- Swaps the entire class string -->
<div [class]="activeColor">Div - 1</div>

<button (click)="changeColor('bg-success')">
  Success
</button>`
    },
    {
      fileName: 'Dynamic Boolean Binding',
      language: 'html',
      code: `<!-- Toggles specific classes independently -->
<button 
  [class.btn-success]="selectedLang === lang"
  [class.btn-secondary]="selectedLang !== lang">
  {{ lang }}
</button>`
    }
  ];

  // Task 4 (slide task-5): dynamic layout + @if side panel
  codeFiles5: CodeFile[] = [
    {
      fileName: 'Dynamic Layout ([class])',
      language: 'html',
      code: `<!-- Swaps grid classes smoothly -->
<div [class.col-12]="!isSidePanelOpen" 
     [class.col-7]="isSidePanelOpen">
  Main Div
</div>`
    },
    {
      fileName: 'Conditional Rendering (@if)',
      language: 'html',
      code: `<!-- Renders the side panel -->
@if (isSidePanelOpen) {
  <div class="col-5">
    Side Div
  </div>
}`
    }
  ];

  // Task 5 (slide task-6): row highlight + state management
  codeFiles6: CodeFile[] = [
    {
      fileName: 'Dynamic Row Highlight',
      language: 'html',
      code: `<tr 
  [class.table-info]="selectedStudId === stud.studId"
  (click)="selectStudent(stud.studId)">
  ...
</tr>`
    },
    {
      fileName: 'State Management (TS)',
      language: 'typescript',
      code: `// Keeps track of ONE active item
selectedStudId: number | null = null;

selectStudent(id: number) {
  this.selectedStudId = id;
}`
    }
  ];

  // Task 6 (slide task-7): [ngStyle] vs [style.prop]
  codeFiles7: CodeFile[] = [
    {
      fileName: '[ngStyle] (Legacy)',
      language: 'html',
      code: `<!-- Requires object syntax & string concat -->
<div [ngStyle]="{ 
  'width': width + 'px', 
  'border-radius': radius + 'px' 
}"></div>`
    },
    {
      fileName: '[style.prop] (Modern)',
      language: 'html',
      code: `<!-- Native binding, automatically adds 'px' -->
<div [style.width.px]="width"
     [style.border-radius.px]="radius"
     [style.background-color]="bgColor">
</div>`
    }
  ];

  // Task 7 (slide task-8): [ngStyle] % vs [style.width.%]
  codeFiles8: CodeFile[] = [
    {
      fileName: '[ngStyle] (Legacy)',
      language: 'html',
      code: `<!-- Required string concatenation -->
<div class="progress-bar" 
     [ngStyle]="{ 'width': progressValue + '%' }">
</div>`
    },
    {
      fileName: '[style.width.%] (Modern)',
      language: 'html',
      code: `<!-- Angular automatically handles the % unit -->
<div class="progress-bar" 
     [style.width.%]="progressValue">
</div>`
    }
  ];

  // Task 8 (slide task-9): dynamic select cards + json pipe
  codeFiles9: CodeFile[] = [
    {
      fileName: 'Dynamic Select Cards',
      language: 'html',
      code: `<!-- Bind class directly to object property -->
<div class="card" 
  [class.border-primary]="form.type === 'Teacher'"
  (click)="setType('Teacher')">
  ...
</div>`
    },
    {
      fileName: 'JSON Pipe (Template)',
      language: 'html',
      code: `<!-- Renders object as formatted JSON -->
<pre>
  {{ personForm | json }}
</pre>`
    }
  ];


  // --- Task 1 ---
  dynamicCssClass: string = 'bg-success text-white p-4 rounded-3 shadow text-center fw-bold fs-5';


  // --- Task 2 ---
  toggleBgClass: string = 'bg-dark-subtle';

  toggleBackground() {
    this.toggleBgClass = this.toggleBgClass === 'bg-success' ? 'bg-danger' : 'bg-success';
  }


  // --- Task 3 ---
  activeColor: string = 'bg-dark-subtle';
  languages: string[] = ['Html', 'CSS', 'JavaScript', 'TypeScript', 'Angular'];
  selectedLang: string = '';

  changeColor(colorClass: string) {
    this.activeColor = colorClass;
  }

  selectLanguage(lang: string) {
    this.selectedLang = lang;
  }


  // --- Task 4 ---
  isSidePanelOpen: boolean = false;


  // --- Task 5 ---
  students = [
    { studId: 1, name: 'Chetan', isActive: true, gender: 'Male', state: 'MH' },
    { studId: 2, name: 'Punesh', isActive: false, gender: 'Male', state: 'MP' },
    { studId: 3, name: 'Sahiti', isActive: true, gender: 'Female', state: 'CG' },
    { studId: 4, name: 'Johar', isActive: true, gender: 'Male', state: 'DL' },
    { studId: 5, name: 'Aditi', isActive: false, gender: 'Female', state: 'PB' }
  ];

  selectedStudId: number | null = null;

  selectStudent(id: number) {
    this.selectedStudId = id;
  }

  // --- Task 6 ---
  inputWidth: number = 100;
  inputHeight: number = 100;
  inputRadius: number = 50;
  inputColor: string = '#198754';

  appliedWidth: number = 100;
  appliedHeight: number = 100;
  appliedRadius: number = 50;
  appliedColor: string = '#198754';

  createShape() {
    this.appliedWidth = this.inputWidth;
    this.appliedHeight = this.inputHeight;
    this.appliedRadius = this.inputRadius;
    this.appliedColor = this.inputColor;
  }


  // --- Task 7 ---
  progressValue: number = 21;


  // --- Task 8
  initialPersonState = {
    name: '',
    personType: '',
    gender: '',
    age: 0
  };

  personForm = { ...this.initialPersonState };

  isPrinted: boolean = false;

  setPersonType(type: string) {
    this.personForm.personType = type;
  }

  setGender(gender: string) {
    this.personForm.gender = gender;
  }

  changeAge(amount: number) {
    const newAge = this.personForm.age + amount;
    // Prevent negative age
    if (newAge >= 0) {
      this.personForm.age = newAge;
    }
  }

  printObject() {
    this.isPrinted = true;
  }

  resetForm() {
    this.personForm = { ...this.initialPersonState };
    this.isPrinted = false;
  }


}
