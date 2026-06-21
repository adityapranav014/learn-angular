import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FoodItem {
  name: string;
  price: number;
  emoji: string;
}

export interface OrderItem {
  name: string;
  price: number;
  emoji: string;
  quantity: number;
  total: number;
}

@Component({
  selector: 'app-hospitality',
  templateUrl: './hospitality.component.html',
  styleUrls: ['./hospitality.component.css'],
  imports: [CommonModule, FormsModule]
})
export class HospitalityComponent {
  // Menu list
  menuItems: FoodItem[] = [
    { name: 'Tea', price: 10, emoji: '🍵' },
    { name: 'Coffee', price: 15, emoji: '☕' },
    { name: 'Sandwich', price: 25, emoji: '🥪' }
  ];

  // Inputs
  selectedItemName: string = '';
  quantity: number | null = null;

  // Cart / Orders
  orderedItems: OrderItem[] = [];

  // Totals
  totalBill: number | null = null;
  showBill: boolean = false;
  validationError: string = '';

  // Actions
  addItem() {
    if (!this.selectedItemName) {
      this.validationError = 'Please select a food item.';
      return;
    }
    if (this.quantity === null || this.quantity <= 0) {
      this.validationError = 'Please enter a valid quantity.';
      return;
    }

    const menuItem = this.menuItems.find(item => item.name === this.selectedItemName);
    if (!menuItem) {
      this.validationError = 'Selected item could not be found.';
      return;
    }

    // Check if item is already added, if so increment quantity
    const existingIndex = this.orderedItems.findIndex(item => item.name === menuItem.name);
    if (existingIndex > -1) {
      this.orderedItems[existingIndex].quantity += this.quantity;
      this.orderedItems[existingIndex].total = this.orderedItems[existingIndex].quantity * menuItem.price;
    } else {
      this.orderedItems.push({
        name: menuItem.name,
        price: menuItem.price,
        emoji: menuItem.emoji,
        quantity: this.quantity,
        total: this.quantity * menuItem.price
      });
    }

    // Reset inputs
    this.selectedItemName = '';
    this.quantity = null;
    this.validationError = '';
  }

  removeItem(index: number) {
    this.orderedItems.splice(index, 1);
    if (this.showBill) {
      this.calculateBill();
    }
  }

  clearAll() {
    this.orderedItems = [];
    this.totalBill = null;
    this.showBill = false;
    this.selectedItemName = '';
    this.quantity = null;
    this.validationError = '';
  }

  calculateBill() {
    if (this.orderedItems.length === 0) {
      this.validationError = 'Add at least one item to calculate the bill.';
      this.showBill = false;
      this.totalBill = null;
      return;
    }

    this.totalBill = this.orderedItems.reduce((sum, item) => sum + item.total, 0);
    this.showBill = true;
    this.validationError = '';
  }
}
