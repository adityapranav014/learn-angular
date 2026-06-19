import { Component, inject, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  // Add RouterLinkActive back here so the template can use it
  styleUrls: ['./navbar.component.scss'],
  imports: [RouterLink, RouterLinkActive]
})
export class NavbarComponent {
  private offcanvasService = inject(NgbOffcanvas);
  public router = inject(Router);

  activeMenuView: string = 'main';

  openSidebar(content: TemplateRef<any>) {
    this.determineActiveMenu();
    this.offcanvasService.open(content, { position: 'start' });
  }

  private determineActiveMenu() {
    if (this.isCoreConceptActive()) {
      this.activeMenuView = 'core-concepts';
    } else if (this.isLogicalScenariosActive()) {
      this.activeMenuView = 'logical-scenarios';
    } else {
      this.activeMenuView = 'main';
    }
  }

  // Add this helper method
  // Note: Update these paths to match your actual route structure
  isLogicalScenariosActive(): boolean {
    const paths = [
      '/subscription', '/rail-transit', '/box-office', '/compute',
      '/fleet', '/hospitality', '/cart', '/tasks', '/enrollment',
      '/seat-allocator', '/kyc', '/tabs', '/data-selector', '/polymorphic'
    ];
    const currentPath = this.router.url.split('?')[0].split('#')[0];
    return paths.some(path => currentPath.startsWith(path));
  }

  // Helper to keep the parent "Core Concepts" button highlighted if we are inside a sub-route
  isCoreConceptActive(): boolean {
    const currentPath = this.router.url.split('?')[0].split('#')[0];
    return currentPath.startsWith('/one') || currentPath.startsWith('/two') || currentPath.startsWith('/three');
  }

  navigateToMenu(menuName: string, event: Event) {
    event.preventDefault();
    this.activeMenuView = menuName;
  }

  goBack() {
    this.activeMenuView = 'main';
  }
}