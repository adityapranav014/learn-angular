import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import mermaid from 'mermaid';

@Component({
  selector: 'app-mermaid-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `<div #mermaidContainer class="mermaid-render-shell"></div>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      overflow: visible;
    }
    .mermaid-render-shell {
      overflow: visible;
      padding: 8px;
    }
    .mermaid-render-shell svg {
      overflow: visible;
      max-width: 100%;
      height: auto;
    }
  `]
})
export class MermaidViewerComponent implements AfterViewInit, OnChanges {
  @Input() definition: string = '';
  @ViewChild('mermaidContainer', { static: true }) mermaidContainer!: ElementRef<HTMLDivElement>;

  private uniqueId = `mermaid-${Math.floor(Math.random() * 100000)}`;

  constructor() {
    // Initialize Mermaid with your exact Brand Guidelines
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      securityLevel: 'loose',
      themeVariables: {
        primaryColor: '#fdf4ff',
        primaryTextColor: '#202124',
        primaryBorderColor: '#fcc8f8',
        lineColor: '#cbd5e1',
        secondaryColor: '#f8fafc',
        tertiaryColor: '#ffffff',
        fontFamily: '"Outfit", "Inter", system-ui, -apple-system, sans-serif'
      },
      flowchart: {
        htmlLabels: true,
        useMaxWidth: false,
        padding: 15,
        diagramPadding: 20,
        nodeSpacing: 65, /* Increased spacing between nodes horizontally */
        rankSpacing: 75, /* Increased spacing between ranks vertically */
        curve: 'basis' /* Premium smooth curved connectors */
      }
    });
  }

  ngAfterViewInit() {
    this.renderDiagram();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['definition'] && !changes['definition'].firstChange) {
      this.renderDiagram();
    }
  }

  private async renderDiagram() {
    if (!this.definition || !this.mermaidContainer) return;

    try {
      this.mermaidContainer.nativeElement.innerHTML = '';
      
      // Render the Mermaid syntax safely to an SVG string
      const { svg } = await mermaid.render(this.uniqueId, this.definition);
      this.mermaidContainer.nativeElement.innerHTML = svg;

      // Post-process: fix subgraph label clipping
      const svgEl = this.mermaidContainer.nativeElement.querySelector('svg');
      if (svgEl) {
        // 1. Expand viewBox padding
        const viewBox = svgEl.getAttribute('viewBox');
        if (viewBox) {
          const parts = viewBox.split(' ').map(Number);
          if (parts.length === 4) {
            const pad = 25;
            svgEl.setAttribute('viewBox',
              `${parts[0] - pad} ${parts[1] - pad} ${parts[2] + pad * 2} ${parts[3] + pad * 2}`
            );
          }
        }
        svgEl.style.maxWidth = '100%';

        // 2. Fix cluster (subgraph) label foreignObjects — widen them
        //    so the label text isn't clipped by Mermaid's tight width calc
        const clusterLabels = svgEl.querySelectorAll('.cluster-label foreignObject');
        clusterLabels.forEach((fo: Element) => {
          const w = fo.getAttribute('width');
          if (w) {
            fo.setAttribute('width', String(parseFloat(w) + 30));
          }
          // Also ensure the inner div/span doesn't wrap or clip
          const innerDiv = fo.querySelector('div');
          if (innerDiv) {
            (innerDiv as HTMLElement).style.overflow = 'visible';
            (innerDiv as HTMLElement).style.whiteSpace = 'nowrap';
          }
        });

        // 3. Ensure all foreignObjects allow overflow
        svgEl.querySelectorAll('foreignObject').forEach((fo: Element) => {
          (fo as SVGForeignObjectElement).style.overflow = 'visible';
        });
      }
    } catch (error) {
      console.error('Mermaid parsing failed:', error);
      this.mermaidContainer.nativeElement.innerHTML = `
        <div class="text-danger small p-3 border rounded bg-light">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>Visualization rendering conflict.
        </div>
      `;
    }
  }
}