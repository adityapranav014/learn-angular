import { Component, inject, TemplateRef, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgbOffcanvas, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { ScrollActiveDirective } from '../../app/directives/appScrollActive.directive';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ScrollActiveDirective,
    NgbTooltip
  ]
})
export class NavbarComponent {
  private offcanvasService = inject(NgbOffcanvas);
  public router = inject(Router);

  // --- Modern State Management (Signals) ---
  activeMenuView = signal<'main' | 'core-concepts' | 'logical-scenarios'>('main');
  isOffcanvasReady = signal<boolean>(false);

  // --- Sidebar Controls ---
  openSidebar(content: TemplateRef<any>) {
    // 1. Determine which sub-menu to open based on the current URL
    this.determineActiveMenu();

    // 2. Reset animation state before opening
    this.isOffcanvasReady.set(false);

    // 3. Open the sidebar
    const offcanvasRef = this.offcanvasService.open(content, { position: 'start' });

    // 4. Wait for the open animation to finish, then trigger the scroll directive
    // take(1) guarantees the subscription dies instantly, preventing memory leaks
    offcanvasRef.shown.pipe(take(1)).subscribe(() => {
      this.isOffcanvasReady.set(true);
    });
  }

  // --- Navigation Controls ---
  navigateToMenu(menuName: 'main' | 'core-concepts' | 'logical-scenarios', event: Event) {
    event.preventDefault();
    this.activeMenuView.set(menuName);
  }

  goBack() {
    this.activeMenuView.set('main');
  }

  // --- Active Route Tracking ---
  private determineActiveMenu() {
    if (this.isCoreConceptActive()) {
      this.activeMenuView.set('core-concepts');
    } else if (this.isLogicalScenariosActive()) {
      this.activeMenuView.set('logical-scenarios');
    } else {
      this.activeMenuView.set('main');
    }
  }

  isLogicalScenariosActive(): boolean {
    const paths = [
      '/subscription', '/rail-transit', '/box-office', '/calculator',
      '/zoom-car-rental', '/hotel-order', '/grocery-cart', '/todo-list', '/student-registration',
      '/kyc', '/tabs', '/data-selector', '/polymorphic'
    ];

    // Clean the URL of query params and fragments to ensure accurate matching
    const currentPath = this.router.url.split('?')[0].split('#')[0];
    return paths.some(path => currentPath.startsWith(path));
  }

  isCoreConceptActive(): boolean {
    const currentPath = this.router.url.split('?')[0].split('#')[0];
    return currentPath.startsWith('/one') ||
      currentPath.startsWith('/two') ||
      currentPath.startsWith('/three');
  }
}