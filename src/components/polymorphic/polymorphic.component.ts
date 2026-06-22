import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodeViewerComponent, CodeFile } from '../code-viewer/code-viewer.component';

@Component({
  selector: 'app-polymorphic',
  templateUrl: './polymorphic.component.html',
  styleUrls: ['./polymorphic.component.css'],
  imports: [FormsModule, CommonModule, CodeViewerComponent]
})
export class PolymorphicComponent implements OnInit {

  codeFiles: CodeFile[] = [
    {
      fileName: 'Active States (TS)',
      language: 'typescript',
      code: `selectTab(tab: string) {
  this.activeTab = tab;
  this.activeSubmenu = this.map[tab][0];
}

selectSubmenu(menu: string) {
  this.activeSubmenu = menu;
}`
    },
    {
      fileName: 'HTML Bindings',
      language: 'xml',
      code: `<button
  [class.active]="activeTab === tab"
  (click)="selectTab(tab)">
  {{ tab }}
</button>`
    }
  ];

  // Top tab configuration
  tabs = ['Personal Details', 'Job History', 'Project', 'Domain'];

  // Map of tab name to sidebar submenu items
  buttonSubmenuMap: { [key: string]: string[] } = {
    'Personal Details': ['Basic Information', 'Address'],
    'Job History': ['Company Details', 'Experience'],
    'Project': ['Project Details', 'Description', 'Live Link', 'Skills'],
    'Domain': ['Domain Name', 'Type Of Domain']
  };

  // Active navigation states
  activeTab = 'Personal Details';
  activeSubmenu = 'Basic Information';

  // State to track if attempt compilation summary is shown
  isAttempted = false;

  // Centralized form data model to hold all values
  formData = {
    // Personal Details - Basic Info
    personal: {
      name: '',
      dob: '',
      contact: '',
      gender: ''
    },
    // Personal Details - Address
    address: {
      addressText: '',
      city: '',
      state: '',
      pincode: ''
    },
    // Job History - Company Details
    company: {
      name: '',
      location: '',
      position: ''
    },
    // Job History - Work Experience
    experience: {
      roles: '',
      technologies: ''
    },
    // Project - Project Details
    project: {
      name: '',
      duration: '',
      technologies: ''
    },
    // Project - Description
    projectDescription: {
      description: ''
    },
    // Project - Live Link
    projectLinks: {
      links: ''
    },
    // Project - Skills
    projectSkills: {
      skills: '',
      responsibility: ''
    },
    // Domain - Domain Name
    domainName: {
      name: '',
      registrar: '',
      expiryDate: '',
      autoRenew: false
    },
    // Domain - Type of Domain
    domainType: {
      tld: '.com',
      purpose: 'Commercial',
      security: 'Standard'
    }
  };

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  // Handles clicking a top tab
  selectTab(tab: string) {
    this.activeTab = tab;
    const submenus = this.buttonSubmenuMap[tab];
    if (submenus && submenus.length > 0) {
      this.activeSubmenu = submenus[0];
    }
    this.resetForm();
    this.cdr.detectChanges();
  }

  // Handles clicking a sidebar item
  selectSubmenu(submenu: string) {
    this.activeSubmenu = submenu;
    this.resetForm();
    this.cdr.detectChanges();
  }

  // Resets all form fields to enforce non-persistence on switching
  resetForm() {
    this.formData = {
      personal: {
        name: '',
        dob: '',
        contact: '',
        gender: ''
      },
      address: {
        addressText: '',
        city: '',
        state: '',
        pincode: ''
      },
      company: {
        name: '',
        location: '',
        position: ''
      },
      experience: {
        roles: '',
        technologies: ''
      },
      project: {
        name: '',
        duration: '',
        technologies: ''
      },
      projectDescription: {
        description: ''
      },
      projectLinks: {
        links: ''
      },
      projectSkills: {
        skills: '',
        responsibility: ''
      },
      domainName: {
        name: '',
        registrar: '',
        expiryDate: '',
        autoRenew: false
      },
      domainType: {
        tld: '.com',
        purpose: 'Commercial',
        security: 'Standard'
      }
    };
  }


}
