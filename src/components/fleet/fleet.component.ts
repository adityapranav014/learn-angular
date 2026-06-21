import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Car {
  name: string;
  ratePerHr: number;
  ratePerDay: number;
}

export interface BookingItem {
  carName: string;
  rentType: 'Per Day' | 'Per Hr';
  duration: number;
  quantity: number;
  cost: number;
}

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.css'],
  imports: [CommonModule, FormsModule]
})
export class FleetComponent {
  // Admin State
  cars: Car[] = [
    { name: 'Tesla Model Y', ratePerHr: 18, ratePerDay: 130 },
    { name: 'Hyundai i20', ratePerHr: 8, ratePerDay: 60 },
    { name: 'Honda Civic', ratePerHr: 10, ratePerDay: 75 }
  ];

  newCarName: string = '';
  newRatePerHr: number | null = null;
  newRatePerDay: number | null = null;

  // Admin Error Messaging
  adminError: string = '';

  // Booking State
  selectedCarName: string = '';
  rentType: 'Per Day' | 'Per Hr' | '' = '';
  duration: number | null = null;
  quantity: number | null = null;

  bookingItems: BookingItem[] = [];

  // Billing Output
  totalBill: number | null = null;
  showBill: boolean = false;
  bookingError: string = '';

  // Actions
  addCar() {
    if (!this.newCarName.trim()) {
      this.adminError = 'Please enter a car name.';
      return;
    }
    if (this.newRatePerHr === null || this.newRatePerHr <= 0) {
      this.adminError = 'Please enter a valid rate per hour.';
      return;
    }
    if (this.newRatePerDay === null || this.newRatePerDay <= 0) {
      this.adminError = 'Please enter a valid rate per day.';
      return;
    }

    // Check duplicate car name
    const exists = this.cars.some(
      (car) => car.name.toLowerCase() === this.newCarName.trim().toLowerCase()
    );
    if (exists) {
      this.adminError = 'Car name already exists in inventory.';
      return;
    }

    this.cars.push({
      name: this.newCarName.trim(),
      ratePerHr: this.newRatePerHr,
      ratePerDay: this.newRatePerDay
    });

    // Reset inputs
    this.newCarName = '';
    this.newRatePerHr = null;
    this.newRatePerDay = null;
    this.adminError = '';
  }

  addBookingItem() {
    if (!this.selectedCarName) {
      this.bookingError = 'Please select a car.';
      return;
    }
    if (!this.rentType) {
      this.bookingError = 'Please select a rental type.';
      return;
    }
    if (this.duration === null || this.duration <= 0) {
      this.bookingError = `Please enter a valid number of ${this.rentType === 'Per Day' ? 'Days' : 'Hours'}.`;
      return;
    }
    if (this.quantity === null || this.quantity <= 0) {
      this.bookingError = 'Please enter a valid number of cars.';
      return;
    }

    const selectedCar = this.cars.find((car) => car.name === this.selectedCarName);
    if (!selectedCar) {
      this.bookingError = 'Selected car could not be found.';
      return;
    }

    // Calculate item cost
    const rate = this.rentType === 'Per Day' ? selectedCar.ratePerDay : selectedCar.ratePerHr;
    const cost = rate * this.duration * this.quantity;

    this.bookingItems.push({
      carName: selectedCar.name,
      rentType: this.rentType,
      duration: this.duration,
      quantity: this.quantity,
      cost: cost
    });

    // Reset inputs
    this.selectedCarName = '';
    this.rentType = '';
    this.duration = null;
    this.quantity = null;
    this.bookingError = '';
  }

  removeBookingItem(index: number) {
    this.bookingItems.splice(index, 1);
    // Recalculate bill if already visible
    if (this.showBill) {
      this.calculateBill();
    }
  }

  clearBookings() {
    this.bookingItems = [];
    this.totalBill = null;
    this.showBill = false;
    this.bookingError = '';
  }

  calculateBill() {
    if (this.bookingItems.length === 0) {
      this.bookingError = 'Add at least one car booking to calculate the bill.';
      this.totalBill = null;
      this.showBill = false;
      return;
    }

    this.totalBill = this.bookingItems.reduce((acc, item) => acc + item.cost, 0);
    this.showBill = true;
    this.bookingError = '';
  }
}
