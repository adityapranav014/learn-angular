import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarousel, NgbSlide, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel';

@Component({
  selector: 'app-topic-one',
  templateUrl: './topic-one.component.html',
  imports: [FormsModule, CommonModule, NgbAccordionModule, NgbCarousel, NgbSlide]
})
export class TopicOneComponent {

  activeIndex = 0;

  slides = [1, 2, 3, 4, 5, 6];

  @ViewChild('carousel')
  carousel!: NgbCarousel;

  onSlide(event: NgbSlideEvent) {
    this.activeIndex = parseInt(event.current.replace('task-', '')) - 1;
  }


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
