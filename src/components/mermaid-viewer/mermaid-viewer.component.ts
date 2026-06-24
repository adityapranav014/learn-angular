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
        padding: 15,
        diagramPadding: 8,
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