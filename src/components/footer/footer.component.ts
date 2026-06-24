import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  private router = inject(Router);

  constructor() { }

  ngOnInit() {
  }

  currentYear: number = new Date().getFullYear();

  isHome(): boolean {
    return this.router.url === '/' || this.router.url === '';
  }
}
