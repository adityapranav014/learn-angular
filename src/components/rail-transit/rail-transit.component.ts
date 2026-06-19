import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap/carousel';

@Component({
  selector: 'app-rail-transit',
  templateUrl: './rail-transit.component.html',
  styleUrls: ['./rail-transit.component.css'],
  imports: [FormsModule, CommonModule, NgbAccordionModule, NgbCarousel, NgbSlide]

})
export class RailTransitComponent {

  // --- Task 1 (Booking) State ---
  stations: string[] = ['Pune', 'Mumbai', 'Jalgaon', 'Nagpur', 'Thane'];

  bookingForm = {
    fromStation: '',
    toStation: '',
    journeyDate: ''
  };

  journeyDetails: any = null; // Holds data only upon successful search
  bookingError: string = '';

  // --- Task 1 (Booking) Methods ---
  exchangeStations() {
    const temp = this.bookingForm.fromStation;
    this.bookingForm.fromStation = this.bookingForm.toStation;
    this.bookingForm.toStation = temp;
  }

  searchTrain() {
    // 1. Check if all details are provided
    if (!this.bookingForm.fromStation || !this.bookingForm.toStation || !this.bookingForm.journeyDate) {
      this.bookingError = 'Please provide all journey details (From, To, and Date).';
      this.journeyDetails = null;
      return;
    }

    // 2. Check if From and To are the same
    if (this.bookingForm.fromStation === this.bookingForm.toStation) {
      this.bookingError = 'Source and Destination stations cannot be the same.';
      this.journeyDetails = null;
      return;
    }

    // 3. Success! Clear errors and set details
    this.bookingError = '';
    this.journeyDetails = { ...this.bookingForm };
  }

  clearBooking() {
    this.bookingForm = { fromStation: '', toStation: '', journeyDate: '' };
    this.journeyDetails = null;
    this.bookingError = '';
  }
}
