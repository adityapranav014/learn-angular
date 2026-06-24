import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';
import { NgbCarousel, NgbSlide, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel';
import { CodeViewerComponent, CodeFile } from '../code-viewer/code-viewer.component';


@Component({
  selector: 'app-topic-two',
  templateUrl: './topic-two.component.html',
  imports: [NgbAccordionModule, CommonModule, FormsModule, NgbCarousel, NgbSlide, CodeViewerComponent]
})
export class TopicTwoComponent {

  activeIndex = 0;

  slides = [1, 2, 3, 4, 5, 6, 7];

  @ViewChild('carousel')
  carousel!: NgbCarousel;

  onSlide(event: NgbSlideEvent) {
    this.activeIndex = parseInt(event.current.replace('task-', '')) - 1;
  }


  // Slide 1: Theory
  codeFiles1: CodeFile[] = [
    {
      fileName: 'Legacy Syntax (*ngFor)',
      language: 'html',
      code: `<ul>
  <li *ngFor="let item of items; let i = index; trackBy: trackById">
    {{ i + 1 }}. {{ item.name }}
  </li>
</ul>`
    },
    {
      fileName: 'Modern Syntax (@for)',
      language: 'html',
      code: `<ul>
  @for (item of items; track item.id; let i = $index) {
    <li>{{ i + 1 }}. {{ item.name }}</li>
  } @empty {
    <li>No items found.</li>
  }
</ul>`
    }
  ];

  // Task 1 (slide task-2): @for options + @if validation
  codeFiles2: CodeFile[] = [
    {
      fileName: 'Dynamic Options (@for)',
      language: 'html',
      code: `@for (city of cityList; track city) {
  <option>{{ city }}</option>
}`
    },
    {
      fileName: 'Validation Messaging (@if)',
      language: 'html',
      code: `@if (cityError) {
  <div class="text-danger">
    {{ cityError }}
  </div>
}`
    }
  ];

  // Task 2 (slide task-3): *ngFor vs @for
  codeFiles3: CodeFile[] = [
    {
      fileName: '*ngFor (Legacy)',
      language: 'html',
      code: `<button *ngFor="let lang of languages"
  [class.btn-success]="selectedLanguage === lang">
  {{ lang }}
</button>`
    },
    {
      fileName: '@for (Modern)',
      language: 'html',
      code: `@for (lang of languages; track lang) {
  <button [class.btn-success]="selected === lang">
    {{ lang }}
  </button>
}`
    }
  ];

  // Task 3 (slide task-4): math in template + alert
  codeFiles4: CodeFile[] = [
    {
      fileName: 'Math in Template (@for)',
      language: 'html',
      code: `@for (i of multipliers; track i) {
  <tr>
    <!-- Angular does the math instantly! -->
    <td>{{ activeNum * i }}</td>
  </tr>
}`
    },
    {
      fileName: 'Native Alert (TS)',
      language: 'typescript',
      code: `if (!this.inputNumber) {
  alert('Please enter a value');
  return; // Stop function execution
}`
    }
  ];

  // Task 4 (slide task-5): reusable @for for dropdowns
  codeFiles5: CodeFile[] = [
    {
      fileName: 'Reusable Data Binding (@for)',
      language: 'html',
      code: `<select [(ngModel)]="toStation">
  <option value="" disabled>Select Station</option>
  
  @for (station of stations; track station) {
    <option [value]="station">
      {{ station }}
    </option>
  }

</select>`
    }
  ];

  // Task 5 (slide task-6): $first, $last, $index
  codeFiles6: CodeFile[] = [
    {
      fileName: '*ngFor (Legacy)',
      language: 'html',
      code: `<!-- Required defining every variable manually --&gt;
<tr *ngFor="let item of links; let i = index; let isFirst = first; let isLast = last"
  [class.table-success]="isFirst"
  [class.table-danger]="isLast">
  <td>{{ i + 1 }}</td>
</tr>`
    },
    {
      fileName: 'Context Variables (@for)',
      language: 'html',
      code: `<!-- $index, $first, and $last are native! -->
@for (item of links; track item.text) {
  <tr [class.table-success]="$first"
      [class.table-danger]="$last">
    <td>{{ $index + 1 }}</td>
  </tr>
}`
    }
  ];

  // Task 6 (slide task-7): object binding + getData
  codeFiles7: CodeFile[] = [
    {
      fileName: 'Object Binding (@for)',
      language: 'html',
      code: `<select [(ngModel)]="selectedStateId">
  @for (state of states; track state.stateId) {
    <option [value]="state.stateId">
      {{ state.stateName }}
    </option>
  }
</select>`
    },
    {
      fileName: 'Action Method (TS)',
      language: 'typescript',
      code: `// Update display values only on click
getData() {
  this.displayStateId = this.selectedStateId;
  this.displayCityId = this.selectedCityId;
}`
    }
  ];


  // --- Task 1  ---
  newCity: string = '';
  cityList: string[] = ['Ranchi']; // Initializing with your default option
  cityError: string = '';

  addCity() {
    const trimmedCity = this.newCity.trim();

    // Do nothing if input is empty
    if (!trimmedCity) return;

    // Check for duplicate city (case-insensitive check for better UX)
    const exactMatch = this.cityList.some(
      (city) => city.toLowerCase() === trimmedCity.toLowerCase()
    );

    if (exactMatch) {
      this.cityError = 'City already present';
    } else {
      this.cityList.push(trimmedCity);
      this.newCity = '';      // Clear textbox after adding
      this.cityError = '';     // Clear any previous error message
    }
  }


  // --- Task 2 ---
  languages: string[] = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Angular'];
  selectedLanguage: string = '';

  selectLanguage(lang: string) {
    this.selectedLanguage = lang;
  }



  // --- Task 3  ---
  inputNumber: string = ''; // What the user is typing
  activeNumber: number | null = null; // The locked-in number to generate the table
  tableError: string = '';

  multipliers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  printTable() {
    // 1. Check if empty
    if (!this.inputNumber) {
      alert('Please enter a value to generate the table.');
      this.tableError = 'Value required';
      this.activeNumber = null;
      return;
    }

    // 2. Parse and validate number
    const parsed = parseInt(this.inputNumber, 10);
    if (isNaN(parsed)) {
      this.tableError = 'Please enter a valid number';
      this.activeNumber = null;
      return;
    }

    // 3. Success! Lock in the number to render the table
    this.tableError = '';
    this.activeNumber = parsed;
  }



  // --- Task 4  ---
  stations: string[] = ['Pune', 'Mumbai', 'Jalgaon', 'Nagpur', 'Thane'];
  fromStation: string = '';
  toStation: string = '';



  // --- Task 5  ---
  links = [
    { text: 'Google Search', url: 'https://google.com' },
    { text: 'YouTube', url: 'https://youtube.com' },
    { text: 'GitHub', url: 'https://github.com' },
    { text: 'Angular Docs', url: 'https://angular.dev' },
    { text: 'Bootstrap', url: 'https://getbootstrap.com' }
  ];



  // --- Task 6 ---
  states = [
    { stateId: 1, stateName: 'Maharashtra' },
    { stateId: 2, stateName: 'Goa' },
    { stateId: 3, stateName: 'Punjab' },
    { stateId: 4, stateName: 'Delhi' }
  ];

  cities = [
    { cityId: 1, cityName: 'Nagpur' },
    { cityId: 2, cityName: 'Pune' },
    { cityId: 3, cityName: 'Mumbai' },
    { cityId: 4, cityName: 'Solapur' }
  ];

  selectedStateId: string = '';
  selectedCityId: string = '';

  displayStateId: string = '';
  displayCityId: string = '';

  getData() {
    this.displayStateId = this.selectedStateId;
    this.displayCityId = this.selectedCityId;
  }
}
