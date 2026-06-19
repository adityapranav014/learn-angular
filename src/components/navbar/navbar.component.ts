import { Component, inject, TemplateRef, signal } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { take } from 'rxjs/operators';
import { ScrollActiveDirective } from '../../app/directives/appScrollActive.directive';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrls: ['./navbar.component.scss'],
  // Added the new directive to the imports array
  imports: [RouterLink, RouterLinkActive, ScrollActiveDirective, ]
})
export class NavbarComponent {
  private offcanvasService = inject(NgbOffcanvas);
  public router = inject(Router);

  // Upgraded to Angular 17 Signals
  activeMenuView = signal<'main' | 'core-concepts' | 'logical-scenarios'>('main');
  isOffcanvasReady = signal<boolean>(false);

  openSidebar(content: TemplateRef<any>) {
    this.determineActiveMenu();
    this.isOffcanvasReady.set(false); // Reset animation state on open

    const offcanvasRef = this.offcanvasService.open(content, { position: 'start' });

    // take(1) ensures the subscription dies immediately after firing, preventing memory leaks
    offcanvasRef.shown.pipe(take(1)).subscribe(() => {
      this.isOffcanvasReady.set(true); // Triggers the directive in the template
    });
  }

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
      '/subscription', '/rail-transit', '/box-office', '/compute',
      '/fleet', '/hospitality', '/cart', '/tasks', '/enrollment',
      '/seat-allocator', '/kyc', '/tabs', '/data-selector', '/polymorphic'
    ];
    const currentPath = this.router.url.split('?')[0].split('#')[0];
    return paths.some(path => currentPath.startsWith(path));
  }

  isCoreConceptActive(): boolean {
    const currentPath = this.router.url.split('?')[0].split('#')[0];
    return currentPath.startsWith('/one') || currentPath.startsWith('/two') || currentPath.startsWith('/three');
  }

  navigateToMenu(menuName: 'main' | 'core-concepts' | 'logical-scenarios', event: Event) {
    event.preventDefault();
    this.activeMenuView.set(menuName);
  }

  goBack() {
    this.activeMenuView.set('main');
  }
}