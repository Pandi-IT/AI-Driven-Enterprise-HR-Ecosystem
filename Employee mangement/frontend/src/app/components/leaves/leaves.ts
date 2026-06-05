import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const marked: any;

@Component({
  selector: 'app-leaves',
  imports: [CommonModule, FormsModule],
  templateUrl: './leaves.html',
  styleUrls: ['./leaves.css'],
  standalone: true
})
export class LeavesComponent implements OnInit {
  leaves: any[] = [];
  employees: any[] = [];
  isLoading = true;

  // Request Leave Modal
  showRequestModal = false;
  leaveEmpId: number | null = null;
  leaveStart = '';
  leaveEnd = '';
  leaveType = 'Vacation';
  leaveReason = '';

  // AI Response Modal (drawn from backend response draft email)
  showAiModal = false;
  aiTitle = '';
  aiContent = '';
  aiRawContent = '';
  isAiLoading = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.leaveStart = tomorrow.toISOString().split('T')[0];
    this.leaveEnd = tomorrow.toISOString().split('T')[0];
    
    this.fetchLeaves();
    this.fetchEmployees();
  }

  fetchLeaves() {
    this.isLoading = true;
    this.api.getLeaves().subscribe({
      next: (data) => {
        this.leaves = data.reverse();
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }

  fetchEmployees() {
    this.api.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        if (data.length > 0) {
          this.leaveEmpId = data[0].id;
        }
      }
    });
  }

  openRequestModal() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.leaveStart = tomorrow.toISOString().split('T')[0];
    this.leaveEnd = tomorrow.toISOString().split('T')[0];
    this.leaveReason = '';
    this.leaveType = 'Vacation';
    if (this.employees.length > 0 && !this.leaveEmpId) {
      this.leaveEmpId = this.employees[0].id;
    }
    this.showRequestModal = true;
  }

  closeRequestModal() {
    this.showRequestModal = false;
  }

  onSubmitLeave() {
    if (!this.leaveEmpId) return;

    const payload = {
      employee: { id: this.leaveEmpId },
      startDate: this.leaveStart,
      endDate: this.leaveEnd,
      leaveType: this.leaveType,
      reason: this.leaveReason
    };

    this.api.requestLeave(payload).subscribe({
      next: () => {
        this.closeRequestModal();
        this.fetchLeaves();
      },
      error: () => {
        alert('Submitting leave request failed.');
      }
    });
  }

  updateStatus(id: number, status: string, emp: any) {
    this.api.updateLeaveStatus(id, status).subscribe({
      next: () => {
        this.fetchLeaves();
        
        // Open AI response generator
        this.openAiModal(`Generating Employee Notification (${status})...`);
        this.api.generateLeaveResponse(emp.id, status, emp.firstName).subscribe({
          next: (data) => this.showAiResult(data.response),
          error: () => this.showAiError()
        });
      },
      error: () => {
        alert('Failed to update leave status.');
      }
    });
  }

  openAiModal(title: string) {
    this.aiTitle = title;
    this.aiContent = '';
    this.aiRawContent = '';
    this.isAiLoading = true;
    this.showAiModal = true;
  }

  showAiResult(rawText: string) {
    this.isAiLoading = false;
    this.aiRawContent = rawText;
    this.aiContent = marked ? marked.parse(rawText) : rawText;
  }

  showAiError() {
    this.isAiLoading = false;
    this.aiContent = `<div class="alert alert-danger">Failed to generate AI notification letter. Please check Groq endpoint.</div>`;
  }

  closeAiModal() {
    this.showAiModal = false;
  }

  copyAiResult() {
    if (!this.aiRawContent) return;
    navigator.clipboard.writeText(this.aiRawContent);
    alert('Letter template copied!');
  }
}
