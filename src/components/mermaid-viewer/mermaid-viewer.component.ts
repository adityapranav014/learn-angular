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
    .mermaid-render-shell {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1.5rem;
      background-color: #fafbfe; /* Base background shade */
      border-radius: 8px;
    }
    /* Injecting your designer's light-source mapping concept natively into the SVG container */
    ::ng-deep .mermaid-render-shell svg {
      max-width: 100%;
      height: auto;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.06)) drop-shadow(0 4px 12px rgba(192, 38, 211, 0.03));
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
        primaryColor: '#fdf4ff',       // Lightest brand tint for important layers
        primaryTextColor: '#202124',   // Dark high-contrast text
        primaryBorderColor: '#f5d0fe', // Subtle magenta separation
        lineColor: '#c026d3',          // Brand Magenta for structural connector vectors
        secondaryColor: '#f3f4f6',     // De-emphasized bottom canvas pieces
        tertiaryColor: '#ffffff'       // Crisp white cards
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