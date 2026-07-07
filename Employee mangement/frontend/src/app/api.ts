import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // --- Dashboard ---
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/today`);
  }

  // --- Employees ---
  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/employees`);
  }

  getEmployee(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/employees/${id}`);
  }

  createEmployee(employee: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/employees`, employee);
  }

  updateEmployee(id: number, employee: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/employees/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/employees/${id}`);
  }

  // --- Attendance ---
  getAttendance(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/attendance`);
  }

  getEmployeeAttendance(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/attendance/employee/${id}`);
  }

  markAttendance(record: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/attendance`, record);
  }

  // --- Leaves ---
  getLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/leaves`);
  }

  getEmployeeLeaves(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/leaves/employee/${id}`);
  }

  requestLeave(leave: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/leaves`, leave);
  }

  updateLeaveStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/leaves/${id}/status`, status, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // --- Recruitment ---
  getJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/recruitment/jobs`);
  }

  createJob(job: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/recruitment/jobs`, job);
  }

  getCandidates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/recruitment/candidates`);
  }

  applyJob(candidate: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/recruitment/candidates`, candidate);
  }

  getJobCandidates(jobId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/recruitment/jobs/${jobId}/candidates`);
  }

  // --- Pulse Survey ---
  submitPulse(rating: number, comment: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/pulse`, { rating, comment });
  }

  getRecentPulses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pulse/recent`);
  }

  // --- AI Integrations ---
  chat(message: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/ai/chat`, { message });
  }

  generateEmail(employee: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ai/email/generate`, employee);
  }

  evaluateEmployee(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/ai/evaluate`, { id });
  }

  analyzeAttendance(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/ai/attendance/analyze`, { id });
  }

  generateJD(title: string, department: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/ai/recruitment/generate-jd`, { title, department });
  }

  rankCandidate(jd: string, resume: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/ai/recruitment/rank-candidate`, { jd, resume });
  }

  checkAttritionRisk(employee: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ai/analytics/attrition-risk`, employee);
  }

  getMoodSummary(): Observable<any> {
    return this.http.post(`${this.baseUrl}/ai/analytics/mood-summary`, {});
  }

  generateLeaveResponse(id: number, decision: string, employeeName: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/ai/leave/respond`, { id, decision, firstName: employeeName });
  }
}
