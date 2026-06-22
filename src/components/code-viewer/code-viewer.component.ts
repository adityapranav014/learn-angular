import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Highlight } from 'ngx-highlightjs';

export interface CodeFile {
    fileName: string;
    code: string;
    language: string;
}

@Component({
    selector: 'app-code-viewer',
    templateUrl: './code-viewer.component.html',
    styleUrls: ['./code-viewer.component.css'],
    imports: [CommonModule, NgbTooltip, Highlight]
})
export class CodeViewerComponent {
    @Input() codeFiles: CodeFile[] = [];

    activeFileIndex = 0;
    isCopied = false;
    isFullscreen = false;

    get safeIdx(): number {
        return this.activeFileIndex < this.codeFiles.length ? this.activeFileIndex : 0;
    }

    get activeFile(): CodeFile | null {
        return this.codeFiles.length > 0 ? this.codeFiles[this.safeIdx] : null;
    }

    setActiveFile(index: number) {
        this.activeFileIndex = index;
        this.isCopied = false;
    }

    async copyCode() {
        if (!this.activeFile) return;
        try {
            await navigator.clipboard.writeText(this.activeFile.code);
            this.isCopied = true;
            setTimeout(() => (this.isCopied = false), 2000);
        } catch {
            this.isCopied = false;
        }
    }

    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
    }
}
