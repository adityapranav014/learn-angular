import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  imports: [FormsModule, CommonModule]
})
export class TabsComponent implements OnInit {

  // --- Dynamic Tab State ---
  activeTab: 'basic' | 'project' | 'family' = 'family';

  ngOnInit() {
  }

  // Tab change handler
  onTabChange(tab: 'basic' | 'project' | 'family') {
    this.activeTab = tab;
  }
}
