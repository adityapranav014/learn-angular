import { CommonModule, JsonPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';
import { NgbCarousel, NgbSlide, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel';

@Component({
  selector: 'app-topic-three',
  templateUrl: './topic-three.component.html',
  imports: [NgbAccordionModule, CommonModule, FormsModule, JsonPipe, NgbCarousel, NgbSlide],
})
export class TopicThreeComponent {

  activeIndex = 0;

  slides = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  @ViewChild('carousel')
  carousel!: NgbCarousel;

  onSlide(event: NgbSlideEvent) {
    this.activeIndex = parseInt(event.current.replace('task-', '')) - 1;
  }


  // --- Task 1 ---
  dynamicCssClass: string = 'bg-success text-white p-4 rounded-3 shadow text-center fw-bold fs-5';


  // --- Task 2 ---
  toggleBgClass: string = 'bg-dark-subtle';

  toggleBackground() {
    this.toggleBgClass = this.toggleBgClass === 'bg-success' ? 'bg-danger' : 'bg-success';
  }


  // --- Task 3 ---
  activeColor: string = 'bg-dark-subtle';
  languages: string[] = ['Html', 'CSS', 'JavaScript', 'TypeScript', 'Angular'];
  selectedLang: string = '';

  changeColor(colorClass: string) {
    this.activeColor = colorClass;
  }

  selectLanguage(lang: string) {
    this.selectedLang = lang;
  }


  // --- Task 4 ---
  isSidePanelOpen: boolean = false;


  // --- Task 5 ---
  students = [
    { studId: 1, name: 'Chetan', isActive: true, gender: 'Male', state: 'MH' },
    { studId: 2, name: 'Punesh', isActive: false, gender: 'Male', state: 'MP' },
    { studId: 3, name: 'Sahiti', isActive: true, gender: 'Female', state: 'CG' },
    { studId: 4, name: 'Johar', isActive: true, gender: 'Male', state: 'DL' },
    { studId: 5, name: 'Aditi', isActive: false, gender: 'Female', state: 'PB' }
  ];

  selectedStudId: number | null = null;

  selectStudent(id: number) {
    this.selectedStudId = id;
  }

  // --- Task 6 ---
  inputWidth: number = 100;
  inputHeight: number = 100;
  inputRadius: number = 50;
  inputColor: string = '#198754';

  appliedWidth: number = 100;
  appliedHeight: number = 100;
  appliedRadius: number = 50;
  appliedColor: string = '#198754';

  createShape() {
    this.appliedWidth = this.inputWidth;
    this.appliedHeight = this.inputHeight;
    this.appliedRadius = this.inputRadius;
    this.appliedColor = this.inputColor;
  }


  // --- Task 7 ---
  progressValue: number = 21;


  // --- Task 8
  initialPersonState = {
    name: '',
    personType: '',
    gender: '',
    age: 0
  };

  personForm = { ...this.initialPersonState };

  isPrinted: boolean = false;

  setPersonType(type: string) {
    this.personForm.personType = type;
  }

  setGender(gender: string) {
    this.personForm.gender = gender;
  }

  changeAge(amount: number) {
    const newAge = this.personForm.age + amount;
    // Prevent negative age
    if (newAge >= 0) {
      this.personForm.age = newAge;
    }
  }

  printObject() {
    this.isPrinted = true;
  }

  resetForm() {
    this.personForm = { ...this.initialPersonState };
    this.isPrinted = false;
  }


}
