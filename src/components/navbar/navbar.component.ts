import { Component, inject, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [RouterLink, RouterLinkActive]
})
export class NavbarComponent {
  // Inject the ng-bootstrap offcanvas service
  private offcanvasService = inject(NgbOffcanvas);

  // Function called by your HTML button
  openSidebar(content: TemplateRef<any>) {
    // We pass { position: 'start' } so it slides in from the left side
    this.offcanvasService.open(content, { position: 'start' });
  }
}