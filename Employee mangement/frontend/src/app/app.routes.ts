import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { LandingComponent } from './components/landing/landing';
import { LoginComponent } from './components/login/login';
import { CareersComponent } from './components/careers/careers';
import { DashboardComponent } from './components/dashboard/dashboard';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home';
import { EmployeeDirectoryComponent } from './components/employee-directory/employee-directory';
import { AttendanceComponent } from './components/attendance/attendance';
import { LeavesComponent } from './components/leaves/leaves';
import { RecruitmentComponent } from './components/recruitment/recruitment';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'careers', component: CareersComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardHomeComponent },
      { path: 'employees', component: EmployeeDirectoryComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'leaves', component: LeavesComponent },
      { path: 'recruitment', component: RecruitmentComponent }
    ]
  },
  { path: '**', redirectTo: 'landing' }
];
