import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  loginError = false;

  constructor(private router: Router) {}

  ngOnInit() {
    if (sessionStorage.getItem('hrLoggedIn') === 'true') {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (this.username === 'admin' && this.password === 'admin') {
      sessionStorage.setItem('hrLoggedIn', 'true');
      this.router.navigate(['/dashboard']);
    } else {
      this.loginError = true;
    }
  }
}
