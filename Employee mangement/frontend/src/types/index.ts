export interface User {
  id: number;
  email: string;
  role: 'ROLE_ADMIN' | 'ROLE_HR' | 'ROLE_EMPLOYEE';
  employeeId?: number | null;
  firstName: string;
  lastName: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  startDate: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  photoUrl?: string;
  conflictCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceRecord {
  id: number;
  employee: Employee;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'Present' | 'Late' | 'Absent' | 'On Leave';
  notes?: string;
}

export interface LeaveRequest {
  id: number;
  employee: Employee;
  startDate: string;
  endDate: string;
  leaveType: 'Vacation' | 'Sick' | 'Personal' | 'Maternity' | 'Paternity';
  reason?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt?: string;
}

export interface JobPosting {
  id: number;
  title: string;
  department: string;
  description: string;
  requirements?: string;
  location?: string;
  status: 'Open' | 'Closed' | 'Draft';
  createdAt?: string;
}

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  resumeText?: string;
  status: 'Applied' | 'Reviewing' | 'Interviewing' | 'Shortlisted' | 'Offered' | 'Rejected';
  jobPosting?: JobPosting;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  presentToday: number;
  lateToday: number;
  onLeaveToday: number;
  pendingLeaves: number;
  openJobs: number;
  totalCandidates: number;
}
