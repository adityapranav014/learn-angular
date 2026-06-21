import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface GroceryItem {
  name: string;
  price: number;
  emoji: string;
}

export interface CartItem {
  name: string;
  price: number;
  emoji: string;
  quantity: number;
  subtotal: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule, FormsModule]
})
export class CartComponent {
  // Grocery list
  groceryList: GroceryItem[] = [
    { name: 'Cooking Oil', price: 120, emoji: '🍾' },
    { name: 'Rice', price: 60, emoji: '🌾' },
    { name: 'Dal', price: 100, emoji: '🍲' },
    { name: 'Sugar', price: 45, emoji: '🍬' },
    { name: 'Aata', price: 40, emoji: '🍞' },
    { name: 'Turmeric', price: 200, emoji: '💛' },
    { name: 'Coffee', price: 2500, emoji: '☕' },
    { name: 'Dry Fruits Mix', price: 850, emoji: '🥜' }
  ];

  // Inputs
  selectedItemName: string = '';
  quantity: number | null = null;

  // Cart
  cartItems: CartItem[] = [];
  totalCost: number = 0;
  validationError: string = '';

  addToCart() {
    if (!this.selectedItemName) {
      this.validationError = 'Please select a grocery item.';
      return;
    }
    if (this.quantity === null || this.quantity <= 0) {
      this.validationError = 'Please enter a valid quantity.';
      return;
    }

    const grocery = this.groceryList.find(item => item.name === this.selectedItemName);
    if (!grocery) {
      this.validationError = 'Selected item could not be found.';
      return;
    }

    const existingIndex = this.cartItems.findIndex(item => item.name === grocery.name);
    if (existingIndex > -1) {
      this.cartItems[existingIndex].quantity += this.quantity;
      this.cartItems[existingIndex].subtotal = this.cartItems[existingIndex].quantity * grocery.price;
    } else {
      this.cartItems.push({
        name: grocery.name,
        price: grocery.price,
        emoji: grocery.emoji,
        quantity: this.quantity,
        subtotal: this.quantity * grocery.price
      });
    }

    this.recalculateTotal();

    // Reset inputs
    this.selectedItemName = '';
    this.quantity = null;
    this.validationError = '';
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.recalculateTotal();
  }

  clearCart() {
    this.cartItems = [];
    this.totalCost = 0;
    this.selectedItemName = '';
    this.quantity = null;
    this.validationError = '';
  }

  private recalculateTotal() {
    this.totalCost = this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }
}
