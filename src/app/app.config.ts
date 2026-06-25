import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { provideRouter } from '@angular/router';
import { provideImageKit } from '@imagekit/angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideImageKit({
      urlEndpoint: 'https://ik.imagekit.io/hgdgtyuf',
    }),
    provideHighlightOptions({
      coreLibraryLoader: () => import('highlight.js/lib/core'),
      languages: {
        typescript: () => import('highlight.js/lib/languages/typescript'),
        xml: () => import('highlight.js/lib/languages/xml'), // Handles HTML templates
        css: () => import('highlight.js/lib/languages/css')
      }
    })
  ]
};
