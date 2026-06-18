import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';
import { NgbCarousel, NgbSlide, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel';


@Component({
  selector: 'app-topic-two',
  templateUrl: './topic-two.component.html',
  imports: [NgbAccordionModule, CommonModule, FormsModule, NgbCarousel, NgbSlide]
})
export class TopicTwoComponent {

  activeIndex = 0;

  slides = [1, 2, 3, 4, 5, 6, 7];

  @ViewChild('carousel')
  carousel!: NgbCarousel;

  onSlide(event: NgbSlideEvent) {
    this.activeIndex = parseInt(event.current.replace('ngb-slide-', ''));
  }


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
