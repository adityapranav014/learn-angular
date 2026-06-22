import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodeViewerComponent, CodeFile } from '../code-viewer/code-viewer.component';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css'],
  imports: [FormsModule, CommonModule, CodeViewerComponent]
})
export class KycComponent implements OnInit {

  codeFiles: CodeFile[] = [
    {
      fileName: 'Biometric Scan',
      language: 'typescript',
      code: `startBiometricScan() {
  this.isScanning = true;
  this.scanProgress = 0;

  this.scanInterval = setInterval(() => {
    if (this.scanProgress < 100) {
      this.scanProgress += 5;
    } else {
      clearInterval(this.scanInterval);
      this.isScanning = false;
      this.biometricVerified = true;
    }
  }, 30);
}`
    },
    {
      fileName: 'Verification Check',
      language: 'typescript',
      code: `submitKyc() {
  if (!this.biometricVerified) {
    this.validationError = 'Scan biometrics first!';
    return;
  }
  // Save verified details...
  localStorage.setItem('kyc-vault', JSON.stringify(data));
}`
    }
  ];

  private cdr = inject(ChangeDetectorRef);

  // --- Form State ---
  fullName: string = '';
  dob: string = '';
  idType: 'aadhaar' | 'pan' = 'aadhaar';
  idNumber: string = '';

  // --- Biometric Scanner State ---
  isScanning: boolean = false;
  scanProgress: number = 0;
  biometricVerified: boolean = false;

  // --- Vault / Verified State ---
  isVerified: boolean = false;
  isLocked: boolean = false;
  validationError: string = '';

  // --- Booking Info (Simulated LocalStorage Data) ---
  verifiedName: string = '';
  verifiedDob: string = '';
  verifiedIdType: string = '';
  verifiedIdNumber: string = '';
  verifiedTime: string = '';

  private scanInterval: any = null;

  ngOnInit() {
    this.loadFromLocalStorage();
  }

  // --- Scanner Simulation ---
  startBiometricScan() {
    if (this.isScanning || this.biometricVerified) return;

    this.isScanning = true;
    this.scanProgress = 0;
    this.validationError = '';

    this.scanInterval = setInterval(() => {
      if (this.scanProgress < 100) {
        this.scanProgress += 10;
      } else {
        clearInterval(this.scanInterval);
        this.isScanning = false;
        this.biometricVerified = true;
      }
      this.cdr.detectChanges();
    }, 30);
  }

  // --- Submit KYC ---
  submitKyc() {
    this.validationError = '';

    // Validate Full Name
    if (!this.fullName.trim()) {
      this.validationError = 'Full Name is required.';
      return;
    }

    // Validate DOB
    if (!this.dob) {
      this.validationError = 'Date of Birth is required.';
      return;
    }

    // Validate ID Number
    const cleanedId = this.idNumber.replace(/\s+/g, '');
    if (this.idType === 'aadhaar') {
      const aadhaarPattern = /^\d{12}$/;
      if (!aadhaarPattern.test(cleanedId)) {
        this.validationError = 'Aadhaar Number must be exactly 12 digits.';
        return;
      }
    } else {
      const panPattern = /^[A-Z]{5}\d{4}[A-Z]{1}$/i;
      if (!panPattern.test(cleanedId)) {
        this.validationError = 'PAN Number must be in standard format (e.g. ABCDE1234F).';
        return;
      }
    }

    // Validate Biometrics
    if (!this.biometricVerified) {
      this.validationError = 'Please complete the biometric scan first.';
      return;
    }

    // Save Data
    this.verifiedName = this.fullName;
    this.verifiedDob = this.dob;
    this.verifiedIdType = this.idType === 'aadhaar' ? 'Aadhaar Card' : 'PAN Card';

    // Mask ID Number
    if (this.idType === 'aadhaar') {
      this.verifiedIdNumber = `XXXX-XXXX-${cleanedId.slice(-4)}`;
    } else {
      this.verifiedIdNumber = `XXXXX${cleanedId.slice(-5)}`;
    }

    this.verifiedTime = new Date().toLocaleString();
    this.isVerified = true;
    this.isLocked = false;
    this.saveToLocalStorage();
  }

  // --- Lock / Unlock Toggle ---
  toggleLock() {
    if (!this.isVerified) return;

    if (this.isLocked) {
      // Simulate rapid unlock biometric scan
      this.isLocked = false;
    } else {
      this.isLocked = true;
    }
    this.saveToLocalStorage();
  }

  // --- Reset Vault ---
  resetKyc() {
    this.fullName = '';
    this.dob = '';
    this.idType = 'aadhaar';
    this.idNumber = '';
    this.isScanning = false;
    this.scanProgress = 0;
    this.biometricVerified = false;
    this.isVerified = false;
    this.isLocked = false;
    this.validationError = '';

    localStorage.removeItem('kyc-vault');
  }

  // --- LocalStorage Integration ---
  private saveToLocalStorage() {
    const data = {
      isVerified: this.isVerified,
      isLocked: this.isLocked,
      verifiedName: this.verifiedName,
      verifiedDob: this.verifiedDob,
      verifiedIdType: this.verifiedIdType,
      verifiedIdNumber: this.verifiedIdNumber,
      verifiedTime: this.verifiedTime
    };
    localStorage.setItem('kyc-vault', JSON.stringify(data));
  }

  private loadFromLocalStorage() {
    const stored = localStorage.getItem('kyc-vault');
    if (stored) {
      const data = JSON.parse(stored);
      this.isVerified = data.isVerified;
      this.isLocked = data.isLocked;
      this.verifiedName = data.verifiedName;
      this.verifiedDob = data.verifiedDob;
      this.verifiedIdType = data.verifiedIdType;
      this.verifiedIdNumber = data.verifiedIdNumber;
      this.verifiedTime = data.verifiedTime;
    }
  }
}
