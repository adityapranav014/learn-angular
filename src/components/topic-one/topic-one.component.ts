import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarousel, NgbSlide, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel';
import { CodeViewerComponent, CodeFile } from '../code-viewer/code-viewer.component';
import { FullscreenService } from '../../services/fullscreen.service';

@Component({
  selector: 'app-topic-one',
  templateUrl: './topic-one.component.html',
  imports: [FormsModule, CommonModule, NgbAccordionModule, NgbCarousel, NgbSlide, CodeViewerComponent]
})
export class TopicOneComponent {
  private fullscreenService = inject(FullscreenService);

  activeIndex = 0;

  slides = [1, 2, 3, 4, 5, 6];

  @ViewChild('carousel')
  carousel!: NgbCarousel;

  onSlide(event: NgbSlideEvent) {
    this.activeIndex = parseInt(event.current.replace('task-', '')) - 1;
    this.fullscreenService.setFullscreen(false);
  }

  // Slide 1: Theory
  codeFiles1: CodeFile[] = [
    {
      fileName: 'Legacy Syntax (*ngIf)',
      language: 'html',
      code: `<div *ngIf="isLoggedIn; else guestBlock">
  Welcome back, User!
</div>
<ng-template #guestBlock>
  Welcome, Guest!
</ng-template>`
    },
    {
      fileName: 'Modern Syntax (@if)',
      language: 'html',
      code: `@if (isLoggedIn) {
  Welcome back, User!
} @else {
  Welcome, Guest!
}`
    }
  ];

  // Task 2 (slide task-3): @if vs *ngIf
  codeFiles2: CodeFile[] = [
    {
      fileName: '*ngIf (Legacy)',
      language: 'html',
      code: `<h6 *ngIf="selectedGender">
  You selected {{ selectedGender }}
</h6>`
    },
    {
      fileName: '@if (Modern)',
      language: 'html',
      code: `@if (selectedGender) {
  <h6>You selected {{ selectedGender }}</h6>
}`
    }
  ];

  // Task 3 (slide task-4): @else if chaining
  codeFiles3: CodeFile[] = [
    {
      fileName: '*ngIf Chaining (Legacy)',
      language: 'html',
      code: `<div *ngIf="cat === 'tech'; else autoBlock">
  Apple, Google
</div>
<ng-template #autoBlock>
  <div *ngIf="cat === 'auto'">...</div>
</ng-template>`
    },
    {
      fileName: '@else if (Modern)',
      language: 'html',
      code: `@if (cat === 'tech') {
  <div>Apple, Google</div>
} @else if (cat === 'auto') {
  <div>Tesla, Ford</div>
}`
    }
  ];

  // Task 4 (slide task-5): boolean toggle + @if
  codeFiles4: CodeFile[] = [
    {
      fileName: 'Inline Event Binding',
      language: 'html',
      code: `<!-- Toggle a boolean directly in HTML -->
<button (click)="isVisible = !isVisible">
  Toggle Div
</button>`
    },
    {
      fileName: 'Conditional Logic (@if)',
      language: 'html',
      code: `<!-- Evaluate component variables -->
@if (value1 === value2 && value1 !== '') {
  <!-- Hidden -->
} @else {
  <div>Div 3</div>
}`
    }
  ];

  // Task 5 (slide task-6): dynamic getter + cascading @if
  codeFiles5: CodeFile[] = [
    {
      fileName: 'Dynamic Getter (TS)',
      language: 'typescript',
      code: `// Auto-updates when inputs change
get fullName(): string {
  return this.firstName + ' ' + this.lastName;
}`
    },
    {
      fileName: 'Dependent Dropdowns (@if)',
      language: 'html',
      code: `<select [(ngModel)]="selectedState">...</select>

@if (selectedState === 'Other') {
  <input type="text" placeholder="Specify State">
}`
    }
  ];

  // Task 6 (slide task-7): @for loop + ternary
  codeFiles6: CodeFile[] = [
    {
      fileName: '*ngFor (Legacy)',
      language: 'html',
      code: `<tr *ngFor="let stud of students; let i = index">
  <td>{{ i + 1 }}</td>
</tr>`
    },
    {
      fileName: '@for + Ternary (Modern)',
      language: 'html',
      code: `@for (stud of students; track stud.name; let i = $index) {
  <tr>
    <td>{{ i + 1 }}</td>
    <td>{{ stud.isIndian ? 'Indian' : 'Foreigner' }}</td>
  </tr>
}`
    }
  ];

  // --- Task 1 ---
  selectedGender: string = '';



  // --- Task 2 ---
  selectedCategory: string = '';

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
  }



  // --- Task 3 ---
  isDiv1Visible: boolean = false; // Hidden by default based on your code
  isDiv2Visible: boolean = true;  // Visible by default
  value1: string = '';
  value2: string = '';



  // --- Task 4  ---
  firstName: string = '';
  lastName: string = '';
  selectedState: string = '';
  selectedCity: string = '';
  selectedProfession: string = ''; // 'teacher', 'sport', or 'musician'

  // Automatically computes the full name whenever first or last name changes
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }



  // --- Task 5  ---
  students = [
    { name: 'John Doe', age: 45, attendance: 80, isIndian: true, gender: 'M' },
    { name: 'Jane Smith', age: 35, attendance: 60, isIndian: false, gender: 'F' },
    { name: 'Amit Patel', age: 42, attendance: 70, isIndian: true, gender: 'M' },
    { name: 'Linda Brown', age: 51, attendance: 90, isIndian: false, gender: 'F' },
    { name: 'Ravi Singh', age: 48, attendance: 85, isIndian: true, gender: 'M' }
  ];

}
