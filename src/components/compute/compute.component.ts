import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compute',
  templateUrl: './compute.component.html',
  styleUrls: ['./compute.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ComputeComponent {
  resultado: string = '';

  calculator(type: string, valor: string | number) {
    if (type === 'action') {
      if (valor === 'c') {
        this.resultado = '';
      } else if (valor === '+' || valor === '-' || valor === '*' || valor === '/' || valor === '.') {
        this.resultado += valor;
      } else if (valor === '=') {
        try {
          if (this.resultado.trim()) {
            // Use eval to calculate expression as requested (indirect eval to avoid bundler warning)
            const calculated = (0, eval)(this.resultado);
            this.resultado = calculated !== undefined ? String(calculated) : '';
          }
        } catch (error) {
          this.resultado = 'Error';
        }
      }
    } else if (type === 'valor') {
      this.resultado += valor;
    }
  }
}
