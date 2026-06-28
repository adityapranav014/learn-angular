import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { SeoService } from './seo.service';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-app');
  private seoService = inject(SeoService);
  private router = inject(Router);
  private themeService = inject(ThemeService);

  constructor(tooltipConfig: NgbTooltipConfig) {
    this.seoService.init();
    
    // Globally configure tooltips to only show on hover (prevents them from sticking after click/focus)
    tooltipConfig.triggers = 'hover';
  }

  isHome(): boolean {
    return this.router.url === '/' || this.router.url === '';
  }
}
