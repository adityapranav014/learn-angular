import { Component, inject, TemplateRef } from '@angular/core';
import { DOCUMENT } from '@angular/common'; // <-- Angular's safe DOM wrapper
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrls: ['./navbar.component.scss'],
  imports: [RouterLink, RouterLinkActive]
})
export class NavbarComponent {
  private offcanvasService = inject(NgbOffcanvas);
  public router = inject(Router);

  // 1. Inject Angular's Document Token (SSR Safe)
  private document = inject(DOCUMENT);

  activeMenuView: string = 'main';

  openSidebar(content: TemplateRef<any>) {
    this.determineActiveMenu();

    // 2. Store the reference when opening
    const offcanvasRef = this.offcanvasService.open(content, { position: 'start' });

    // 3. Subscribe to the native 'shown' lifecycle hook.
    // This perfectly times the scroll to happen exactly when the slide animation finishes, eliminating the need for setTimeout.
    offcanvasRef.shown.subscribe(() => {
      this.scrollToActiveItem();
    });
  }

  private scrollToActiveItem() {
    // 4. Use the injected document to query, restricting the search to the offcanvas body for speed
    const offcanvasBody = this.document.querySelector('.offcanvas-body');
    if (!offcanvasBody) return;

    const activeElement = offcanvasBody.querySelector('.active-sub, .active');

    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
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

  navigateToMenu(menuName: string, event: Event) {
    event.preventDefault();
    this.activeMenuView = menuName;
  }

  goBack() {
    this.activeMenuView = 'main';
  }
}