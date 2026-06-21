import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css'],
  imports: [CommonModule, FormsModule]
})
export class EnrollmentComponent {
  // Form input fields
  firstName: string = '';
  middleName: string = '';
  lastName: string = '';
  selectedCaste: string = '';
  otherCaste: string = '';
  
  tenthPct: number | null = null;
  twelfthPct: number | null = null;
  graduationPct: number | null = null;
  
  mobileNo: string = '';

  // Validation & Success Feedback
  validationError: string = '';
  isSubmitted: boolean = false;

  // 1. Dynamic Full Name Compilation
  get fullName(): string {
    return [this.firstName, this.middleName, this.lastName]
      .map(name => name.trim())
      .filter(Boolean)
      .join(' ');
  }

  // 2. Dynamic Average Score Calculation
  get averagePct(): string {
    const scores = [this.tenthPct, this.twelfthPct, this.graduationPct]
      .filter((score): score is number => score !== null && score !== undefined && !isNaN(score) && score >= 0);
    
    if (scores.length === 0) {
      return '0.00';
    }

    const total = scores.reduce((sum, score) => sum + score, 0);
    return (total / scores.length).toFixed(2);
  }

  // 3. Dynamic Registration Number Generation
  get registrationNo(): string {
    if (!this.firstName.trim()) {
      return '';
    }
    const cleanMobile = this.mobileNo.trim();
    const lastFour = cleanMobile.length >= 4 ? cleanMobile.slice(-4) : cleanMobile;
    return `${this.firstName.toLowerCase().trim()}${lastFour}`;
  }

  // Actions
  clearAll() {
    this.firstName = '';
    this.middleName = '';
    this.lastName = '';
    this.selectedCaste = '';
    this.otherCaste = '';
    this.tenthPct = null;
    this.twelfthPct = null;
    this.graduationPct = null;
    this.mobileNo = '';
    this.validationError = '';
    this.isSubmitted = false;
  }

  submitForm() {
    if (!this.firstName.trim() || !this.lastName.trim()) {
      this.validationError = 'First Name and Last Name are required.';
      this.isSubmitted = false;
      return;
    }
    if (!this.selectedCaste) {
      this.validationError = 'Please select a caste.';
      this.isSubmitted = false;
      return;
    }
    if (this.selectedCaste === 'other' && !this.otherCaste.trim()) {
      this.validationError = 'Please enter your other caste specification.';
      this.isSubmitted = false;
      return;
    }
    if (!this.mobileNo.trim() || this.mobileNo.trim().length < 10) {
      this.validationError = 'Please enter a valid 10-digit mobile number.';
      this.isSubmitted = false;
      return;
    }

    this.validationError = '';
    this.isSubmitted = true;
  }
}
