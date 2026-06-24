import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';
import { NgbCarousel, NgbSlide, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel';
import { CodeViewerComponent, CodeFile } from '../code-viewer/code-viewer.component';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  imports: [FormsModule, CommonModule, NgbAccordionModule, NgbCarousel, NgbSlide, CodeViewerComponent]
})
export class SubscriptionComponent {

  activeIndex = 0;
  slides = [1, 2];

  @ViewChild('carousel')
  carousel!: NgbCarousel;

  onSlide(event: NgbSlideEvent) {
    this.activeIndex = parseInt(event.current.replace('task-', '')) - 1;
  }

  // Code files displayed in Code Hint tabs for Task 1
  codeFiles1: CodeFile[] = [
    {
      fileName: 'subscription.component.ts',
      language: 'typescript',
      code: `showPackage(pkg: string) {
  // Toggle off if clicking active btn
  this.active = this.active === pkg 
    ? '' 
    : pkg;
}`
    },
    {
      fileName: 'subscription.component.html',
      language: 'html',
      code: `@if (active === 'mobile') {
  <div>Mobile details...</div>
}`
    }
  ];

  // Code files displayed in Code Hint tabs for Task 2
  codeFiles2: CodeFile[] = [
    {
      fileName: 'subscription.component.html',
      language: 'html',
      code: `<!-- Ensure 'name' is identical -->
<input type="radio" name="plan" 
       value="Mobile Plan" 
       [(ngModel)]="selectedPlan">`
    },
    {
      fileName: 'subscription.component.ts',
      language: 'typescript',
      code: `confirm() {
  if (!this.selectedPlan) {
    this.error = 'Please select a plan before continuing.';
  } else {
    this.confirmed = this.selectedPlan;
  }
}`
    }
  ];

  // ==========================
  // --- Task 1 State & Methods
  // ==========================
  active: string = ''; // Tracks which package details to show

  showPackage(pkg: string) {
    // If clicking the same button, toggle it off. Otherwise, show the new package.
    this.active = this.active === pkg ? '' : pkg;
  }

  // ==========================
  // --- Task 2 State & Methods
  // ==========================
  selectedPlan: string = ''; // Bound to the radio buttons
  confirmed: string = '';     // Displayed on successful 'Continue'
  error: string = '';         // Validation message

  confirm() {
    if (!this.selectedPlan) {
      this.error = 'Please select a plan before continuing.';
      this.confirmed = '';
    } else {
      this.error = '';
      this.confirmed = this.selectedPlan;
    }
  }

  reset() {
    this.selectedPlan = '';
    this.confirmed = '';
    this.error = '';
  }
}

