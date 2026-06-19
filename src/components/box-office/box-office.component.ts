import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-box-office',
  templateUrl: './box-office.component.html',
  styleUrls: ['./box-office.component.css'],
  imports: [FormsModule]
})
export class BoxOfficeComponent {

  // --- Task Booking State ---
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

  // --- Task Booking Methods ---
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

}
