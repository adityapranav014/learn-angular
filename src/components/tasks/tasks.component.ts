import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodeViewerComponent, CodeFile } from '../code-viewer/code-viewer.component';

export interface Todo {
  name: string;
  status: 'completed' | 'pending';
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  imports: [CommonModule, FormsModule, CodeViewerComponent]
})
export class TasksComponent implements OnInit {

  codeFiles: CodeFile[] = [
    {
      fileName: 'tasks.component.ts',
      language: 'typescript',
      code: `// Save to storage
saveToLocalStorage() {
  localStorage.setItem(
    'todo-list',
    JSON.stringify(this.todos)
  );
}

// Load from storage
ngOnInit() {
  const stored = localStorage.getItem('todo-list');
  if (stored) this.todos = JSON.parse(stored);
}`
    }
  ];
  todos: Todo[] = [];
  userTask: string = '';
  activeFilter: 'all' | 'pending' | 'completed' = 'all';

  // Edit State
  isEditMode: boolean = false;
  editIndex: number | null = null;

  // Validation
  validationError: string = '';

  ngOnInit() {
    // Load todos from localStorage on init
    const stored = localStorage.getItem('todo-list');
    if (stored) {
      try {
        this.todos = JSON.parse(stored);
      } catch (e) {
        this.todos = [];
      }
    }
  }

  saveTask() {
    if (!this.userTask.trim()) {
      this.validationError = 'Please enter a task name.';
      return;
    }

    if (!this.isEditMode) {
      // Add Mode
      this.todos.push({
        name: this.userTask.trim(),
        status: 'pending'
      });
    } else if (this.editIndex !== null && this.editIndex >= 0 && this.editIndex < this.todos.length) {
      // Edit Mode
      this.todos[this.editIndex].name = this.userTask.trim();
      this.isEditMode = false;
      this.editIndex = null;
    }

    this.saveToLocalStorage();
    this.userTask = '';
    this.validationError = '';
  }

  toggleStatus(todo: Todo) {
    todo.status = todo.status === 'completed' ? 'pending' : 'completed';
    this.saveToLocalStorage();
  }

  editTask(todo: Todo) {
    this.userTask = todo.name;
    this.isEditMode = true;
    this.editIndex = this.todos.indexOf(todo);
  }

  deleteTask(todo: Todo) {
    const index = this.todos.indexOf(todo);
    if (index > -1) {
      this.todos.splice(index, 1);
      this.saveToLocalStorage();
    }

    // Cancel edit if the edited item was deleted
    if (this.editIndex === index) {
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.isEditMode = false;
    this.editIndex = null;
    this.userTask = '';
  }

  setFilter(filter: 'all' | 'pending' | 'completed') {
    this.activeFilter = filter;
  }

  getFilteredTodos(): Todo[] {
    if (this.activeFilter === 'all') {
      return this.todos;
    }
    return this.todos.filter(t => t.status === this.activeFilter);
  }

  private saveToLocalStorage() {
    localStorage.setItem('todo-list', JSON.stringify(this.todos));
  }
}
