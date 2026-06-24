import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodeViewerComponent, CodeFile } from '../code-viewer/code-viewer.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  imports: [FormsModule, CommonModule, CodeViewerComponent]
})
export class TabsComponent implements OnInit {

  // --- Dynamic Tab State ---
  activeTab: 'basic' | 'project' | 'family' = 'family';

  // Code files displayed in Code Hint tabs
  codeFiles: CodeFile[] = [
    {
      fileName: 'tabs.component.ts',
      language: 'typescript',
      code: `onTabChange(tab: string) {
  this.activeTab = tab;
}`
    },
    {
      fileName: 'tabs.component.html',
      language: 'html',
      code: `<button class="nav-link" 
  [class.active]="activeTab === 'basic'" 
  (click)="onTabChange('basic')">
  Basic Details
</button>`
    }
  ];

  ngOnInit() {
  }

  // Tab change handler
  onTabChange(tab: 'basic' | 'project' | 'family') {
    this.activeTab = tab;
  }
}

