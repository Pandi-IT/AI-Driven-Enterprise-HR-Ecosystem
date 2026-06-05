import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const marked: any;

@Component({
  selector: 'app-employee-directory',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-directory.html',
  styleUrls: ['./employee-directory.css'],
  standalone: true
})
export class EmployeeDirectoryComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchText = '';
  isLoading = true;

  // Add/Edit Modal
  showFormModal = false;
  editMode = false;
  empId: number | null = null;
  empFirstName = '';
  empLastName = '';
  empEmail = '';
  empDept = '';
  empStatus = 'Active';

  // Profile Drawer
  selectedEmp: any = null;
  attendanceLogs: any[] = [];
  leaveRequests: any[] = [];
  isProfileLoading = false;

  // Attrition Risk state
  attritionRiskLevel = '';
  attritionRiskAnalysis = '';
  isRiskLoading = false;

  // AI Modal
  showAiModal = false;
  aiTitle = '';
  aiContent = '';
  aiRawContent = '';
  isAiLoading = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.isLoading = true;
    this.api.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.filterEmployees();
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }

  filterEmployees() {
    const query = this.searchText.trim().toLowerCase();
    if (!query) {
      this.filteredEmployees = [...this.employees];
    } else {
      this.filteredEmployees = this.employees.filter((e) =>
        `${e.firstName} ${e.lastName} ${e.email} ${e.department}`
          .toLowerCase()
          .includes(query)
      );
    }
  }

  openAddModal() {
    this.editMode = false;
    this.empId = null;
    this.empFirstName = '';
    this.empLastName = '';
    this.empEmail = '';
    this.empDept = 'Engineering';
    this.empStatus = 'Active';
    this.showFormModal = true;
  }

  openEditModal(emp: any) {
    this.editMode = true;
    this.empId = emp.id;
    this.empFirstName = emp.firstName;
    this.empLastName = emp.lastName;
    this.empEmail = emp.email;
    this.empDept = emp.department;
    this.empStatus = emp.status;
    this.showFormModal = true;
  }

  closeFormModal() {
    this.showFormModal = false;
  }

  onSubmitEmployee() {
    const payload = {
      firstName: this.empFirstName,
      lastName: this.empLastName,
      email: this.empEmail,
      department: this.empDept,
      status: this.empStatus
    };

    if (this.editMode && this.empId) {
      this.api.updateEmployee(this.empId, payload).subscribe({
        next: () => {
          this.closeFormModal();
          this.fetchEmployees();
        },
        error: (err: any) => alert(err?.error?.message || 'Update failed')
      });
    } else {
      this.api.createEmployee(payload).subscribe({
        next: () => {
          this.closeFormModal();
          this.fetchEmployees();
        },
        error: (err: any) => alert(err?.error?.message || 'Create failed')
      });
    }
  }

  deleteEmployee(id: number) {
    if (confirm('Delete this employee and all their associated records?')) {
      this.api.deleteEmployee(id).subscribe({
        next: () => this.fetchEmployees()
      });
    }
  }

  openProfileDrawer(emp: any) {
    this.selectedEmp = emp;
    this.attendanceLogs = [];
    this.leaveRequests = [];
    this.attritionRiskLevel = '';
    this.attritionRiskAnalysis = '';
    this.isProfileLoading = true;

    // Fetch related records
    this.api.getEmployeeAttendance(emp.id).subscribe({
      next: (att) => (this.attendanceLogs = att.reverse())
    });

    this.api.getEmployeeLeaves(emp.id).subscribe({
      next: (leaves) => {
        this.leaveRequests = leaves.reverse();
        this.isProfileLoading = false;
      },
      error: () => (this.isProfileLoading = false)
    });
  }

  closeProfileDrawer() {
    this.selectedEmp = null;
  }

  checkAttritionRisk() {
    if (!this.selectedEmp) return;
    this.isRiskLoading = true;
    this.attritionRiskLevel = 'Analyzing...';
    this.attritionRiskAnalysis = '';

    this.api.checkAttritionRisk(this.selectedEmp).subscribe({
      next: (data) => {
        this.isRiskLoading = false;
        const raw = data.riskAnalysis;
        this.attritionRiskAnalysis = marked ? marked.parse(raw) : raw;

        if (raw.toLowerCase().includes('high')) {
          this.attritionRiskLevel = 'HIGH';
        } else if (raw.toLowerCase().includes('med')) {
          this.attritionRiskLevel = 'MEDIUM';
        } else {
          this.attritionRiskLevel = 'LOW';
        }
      },
      error: () => {
        this.isRiskLoading = false;
        this.attritionRiskLevel = 'ERROR';
        this.attritionRiskAnalysis = 'Failed to analyze risk factor.';
      }
    });
  }

  // --- AI Triggers ---
  triggerDraftEmail(emp: any) {
    this.openAiModal('Drafting HR Communication Email...');
    this.api.generateEmail(emp).subscribe({
      next: (data) => this.showAiResult(data.email),
      error: () => this.showAiError()
    });
  }

  triggerEvaluation(emp: any) {
    this.openAiModal('Generating AI Performance Evaluation...');
    this.api.evaluateEmployee(emp.id).subscribe({
      next: (data) => this.showAiResult(data.evaluation),
      error: () => this.showAiError()
    });
  }

  triggerAttendanceAnalysis(emp: any) {
    this.openAiModal('Analyzing Attendance Patterns...');
    this.api.analyzeAttendance(emp.id).subscribe({
      next: (data) => this.showAiResult(data.analysis),
      error: () => this.showAiError()
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
    this.aiContent = `<div class="alert alert-danger">Failed to run AI operation. Please check Groq API configuration.</div>`;
  }

  closeAiModal() {
    this.showAiModal = false;
  }

  copyAiResult() {
    if (!this.aiRawContent) return;
    navigator.clipboard.writeText(this.aiRawContent);
    alert('Copied to clipboard!');
  }
}
