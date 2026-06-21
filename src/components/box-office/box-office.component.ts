import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbCarousel, NgbSlide, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel';

@Component({
  selector: 'app-box-office',
  templateUrl: './box-office.component.html',
  styleUrls: ['./box-office.component.css'],
  imports: [FormsModule, CommonModule, NgbCarousel, NgbSlide]
})
export class BoxOfficeComponent implements OnInit {

  // --- Carousel / Pagination State ---
  activeIndex = 0;
  slides = [1, 2];

  @ViewChild('carousel')
  carousel!: NgbCarousel;

  onSlide(event: NgbSlideEvent) {
    this.activeIndex = parseInt(event.current.replace('task-', '')) - 1;
  }

  // --- Task 1: Box Office Booking State ---
  movies = [
    {
      movieName: 'Rocketry',
      desc: 'Based on the life of Indian Space Research Org scientist Nambi Narayanan...',
      rate: 250,
      shows: ['12:00 PM', '3:00 PM']
    },
    {
      movieName: '3 Idiots',
      desc: 'Two friends are searching for their long lost companion in college...',
      rate: 300,
      shows: ['6:00 PM'] // Single show
    },
    {
      movieName: 'Dangal',
      desc: 'Wrestler Mahavir Singh Phogat and his daughters struggle towards glory...',
      rate: 200,
      shows: ['10:00 AM', '1:00 PM', '4:00 PM']
    },
    {
      movieName: 'Drishyam 2',
      desc: 'An investigation and a family which is threatened by it...',
      rate: 240,
      shows: ['9:00 PM', '11:30 PM']
    }
  ];

  selectedMovie: any = null;
  selectedShow: string = '';
  ticketCount: number | null = null;
  totalCost: number = 0;
  isBooked: boolean = false;

  // --- Task 2: Movie Seat Booking State ---
  seatMovies = [
    { name: 'Avengers: Endgame', price: 10 },
    { name: 'Joker', price: 12 },
    { name: 'Toy Story 4', price: 8 },
    { name: 'The Lion King', price: 9 }
  ];

  selectedSeatMovie = this.seatMovies[0];
  seatRows: { status: 'available' | 'selected' | 'occupied' }[][] = [];
  isSeatBooked = false;
  bookedSeatsCount = 0;
  bookedSeatsPrice = 0;

  ngOnInit() {
    this.initializeSeats();
  }

  // --- Task 1 Methods ---
  selectMovie(movie: any) {
    this.selectedMovie = movie;
    this.isBooked = false; // Reset booking status on new selection
    this.ticketCount = null;
    this.totalCost = 0;

    // If only a single show is available, select it by default
    if (movie.shows.length === 1) {
      this.selectedShow = movie.shows[0];
    } else {
      this.selectedShow = '';
    }
  }

  selectShow(showTime: string) {
    this.selectedShow = showTime;
    this.isBooked = false;
  }

  bookTicket() {
    if (this.selectedMovie && this.selectedShow && this.ticketCount) {
      this.totalCost = this.selectedMovie.rate * this.ticketCount;
      this.isBooked = true;
    }
  }

  // --- Task 2 Methods ---
  initializeSeats() {
    const layout = [
      ['available', 'available', 'available', 'available', 'available', 'available', 'occupied', 'occupied'],
      ['available', 'available', 'available', 'available', 'available', 'available', 'occupied', 'occupied'],
      ['available', 'available', 'selected', 'selected', 'selected', 'available', 'available', 'available'],
      ['available', 'available', 'available', 'occupied', 'occupied', 'available', 'available', 'available'],
      ['available', 'available', 'available', 'available', 'occupied', 'occupied', 'occupied', 'available']
    ];
    this.seatRows = layout.map(row => 
      row.map(status => ({ status: status as 'available' | 'selected' | 'occupied' }))
    );
    this.isSeatBooked = false;
  }

  toggleSeat(rowIndex: number, colIndex: number) {
    const seat = this.seatRows[rowIndex][colIndex];
    if (seat.status === 'available') {
      seat.status = 'selected';
      this.isSeatBooked = false;
    } else if (seat.status === 'selected') {
      seat.status = 'available';
      this.isSeatBooked = false;
    }
  }

  get selectedSeatsCount(): number {
    let count = 0;
    for (const row of this.seatRows) {
      for (const seat of row) {
        if (seat.status === 'selected') {
          count++;
        }
      }
    }
    return count;
  }

  get totalSeatsPrice(): number {
    return this.selectedSeatsCount * this.selectedSeatMovie.price;
  }

  bookSeats() {
    const count = this.selectedSeatsCount;
    if (count > 0) {
      this.bookedSeatsCount = count;
      this.bookedSeatsPrice = this.totalSeatsPrice;
      this.isSeatBooked = true;

      // Mark selected seats as occupied
      for (const row of this.seatRows) {
        for (const seat of row) {
          if (seat.status === 'selected') {
            seat.status = 'occupied';
          }
        }
      }
    }
  }
}
