import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  private readonly defaultTitle = 'Learn Angular: Concepts, Architecture, and Practice Labs';
  private readonly defaultDesc = 'An interactive educational platform designed to learn Angular architecture, core concepts, directives, reactivity, and advanced patterns through hands-on practice labs.';
  private readonly defaultKeywords = 'Angular, Angular Architecture, RxJS, Signals, Directives, Web Development, Tutorial, Education, Learn Angular';
  private readonly defaultImage = 'https://opensource.google/images/projects/os-projects-angular_thumbnail.png';

  /**
   * Initializes the SEO tracking. Listens to router events to dynamically update page metadata.
   */
  init() {
    // Ensure this runs only on the client (browser platform) to avoid errors during potential build-time rendering or SSR.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Traverse the route tree to find the deepest active route data
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }

      // Extract route metadata: title, description, and keywords
      const snapshot = route.snapshot;
      const titleFromRoute = snapshot.data['title'] || snapshot.title;
      const descriptionFromRoute = snapshot.data['description'] || this.defaultDesc;
      const keywordsFromRoute = snapshot.data['keywords'] || this.defaultKeywords;
      const imageFromRoute = snapshot.data['image'] || this.defaultImage;

      // Construct dynamic values
      const title = titleFromRoute 
        ? `${titleFromRoute} | Learn Angular` 
        : this.defaultTitle;
      
      const currentOrigin = window.location.origin;
      const currentUrl = `${currentOrigin}${this.router.url.split('?')[0].split('#')[0]}`;

      // 1. Update Title and standard description/keywords
      this.titleService.setTitle(title);
      this.metaService.updateTag({ name: 'description', content: descriptionFromRoute });
      this.metaService.updateTag({ name: 'keywords', content: keywordsFromRoute });

      // 2. Update Open Graph (OG) Facebook/LinkedIn tags
      this.metaService.updateTag({ property: 'og:title', content: title });
      this.metaService.updateTag({ property: 'og:description', content: descriptionFromRoute });
      this.metaService.updateTag({ property: 'og:image', content: imageFromRoute });
      this.metaService.updateTag({ property: 'og:url', content: currentUrl });
      this.metaService.updateTag({ property: 'og:type', content: 'website' });

      // 3. Update Twitter Card tags
      this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.metaService.updateTag({ name: 'twitter:title', content: title });
      this.metaService.updateTag({ name: 'twitter:description', content: descriptionFromRoute });
      this.metaService.updateTag({ name: 'twitter:image', content: imageFromRoute });
      this.metaService.updateTag({ name: 'twitter:url', content: currentUrl });

      // 4. Update Canonical Link tag
      this.updateCanonicalLink(currentUrl);
    });
  }

  /**
   * Updates or creates the canonical link tag in the document head.
   */
  private updateCanonicalLink(url: string) {
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
