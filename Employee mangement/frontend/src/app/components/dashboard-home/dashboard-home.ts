import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule],
  templateUrl: './dashboard-home.html',
  styleUrls: ['./dashboard-home.css'],
  standalone: true
})
export class DashboardHomeComponent implements OnInit {
  totalEmployees = 0;
  presentToday = 0;
  lateToday = 0;
  pendingLeaves = 0;
  todaysRecords: any[] = [];
  isLoading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.fetchStats();
    this.fetchTodaysAttendance();
  }

  fetchStats() {
    this.api.getDashboardStats().subscribe({
      next: (data) => {
        this.totalEmployees = data.totalEmployees;
        this.presentToday = data.presentToday;
        this.lateToday = data.lateToday;
        this.pendingLeaves = data.pendingLeaves;
      },
      error: (err) => console.error(err)
    });
  }

  fetchTodaysAttendance() {
    this.api.getAttendance().subscribe({
      next: (data) => {
        const todayStr = new Date().toISOString().split('T')[0];
        this.todaysRecords = data
          .filter((r) => r.date === todayStr)
          .slice(0, 5);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}
