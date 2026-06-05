import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-attendance',
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.html',
  styleUrls: ['./attendance.css'],
  standalone: true
})
export class AttendanceComponent implements OnInit {
  attendanceRecords: any[] = [];
  employees: any[] = [];
  isLoading = true;

  // Mark Attendance Modal state
  showMarkModal = false;
  attEmpId: number | null = null;
  attDate = '';
  attStatus = 'Present';
  attNotes = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.attDate = new Date().toISOString().split('T')[0];
    this.fetchAttendance();
    this.fetchEmployees();
  }

  fetchAttendance() {
    this.isLoading = true;
    this.api.getAttendance().subscribe({
      next: (data) => {
        this.attendanceRecords = data.reverse(); // Latest logs first
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
          this.attEmpId = data[0].id;
        }
      }
    });
  }

  openMarkModal() {
    this.attDate = new Date().toISOString().split('T')[0];
    this.attStatus = 'Present';
    this.attNotes = '';
    if (this.employees.length > 0 && !this.attEmpId) {
      this.attEmpId = this.employees[0].id;
    }
    this.showMarkModal = true;
  }

  closeMarkModal() {
    this.showMarkModal = false;
  }

  onSubmitAttendance() {
    if (!this.attEmpId) return;

    const payload = {
      employee: { id: this.attEmpId },
      date: this.attDate,
      status: this.attStatus,
      notes: this.attNotes
    };

    this.api.markAttendance(payload).subscribe({
      next: () => {
        this.closeMarkModal();
        this.fetchAttendance();
      },
      error: () => {
        alert('Saving attendance record failed.');
      }
    });
  }
}
