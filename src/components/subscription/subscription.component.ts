import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';
import { NgbCarousel, NgbSlide, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  imports: [FormsModule, CommonModule, NgbAccordionModule, NgbCarousel, NgbSlide]
})
export class SubscriptionComponent {


  activeIndex = 0;

  slides = [1, 2];

  @ViewChild('carousel')
  carousel!: NgbCarousel;

  onSlide(event: NgbSlideEvent) {
    this.activeIndex = parseInt(event.current.replace('task-', '')) - 1;
  }


  // ==========================
  // --- Task 1 State & Methods
  // ==========================
  activePackage: string = ''; // Tracks which package details to show

  showPackageDetails(pkg: string) {
    // If clicking the same button, toggle it off. Otherwise, show the new package.
    this.activePackage = this.activePackage === pkg ? '' : pkg;
  }

  // ==========================
  // --- Task 2 State & Methods
  // ==========================
  selectedPlanInput: string = ''; // Bound to the radio buttons
  confirmedPlan: string = '';     // Displayed on successful 'Continue'
  planError: string = '';         // Validation message

  confirmPlan() {
    if (!this.selectedPlanInput) {
      this.planError = 'Please select a plan before continuing.';
      this.confirmedPlan = '';
    } else {
      this.planError = '';
      this.confirmedPlan = this.selectedPlanInput;
    }
  }

  resetPlan() {
    this.selectedPlanInput = '';
    this.confirmedPlan = '';
    this.planError = '';
  }

}
