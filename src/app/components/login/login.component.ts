import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule,
    HttpClientModule,
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatInputModule,
    RouterModule
  ],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  passwordVisible: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onLogin(event: Event) {
    event.preventDefault();

    if (!this.username || !this.password) {
      alert('No empty field can be left!');
      return;
    }

    // Hardcoded Admin Credentials (for testing purposes)
    if (this.username === 'admin' && this.password === 'adminpass') {
      sessionStorage.setItem('username', this.username);
      sessionStorage.setItem('role', 'admin');
      this.router.navigate(['/admin-dashboard']);
      return;
    }

    // API Call for Authentication
    this.http.post<any>('http://localhost:3000/login', { username: this.username, password: this.password })
      .subscribe(
        (response) => {
          if (response) {
            sessionStorage.setItem('username', response.username || this.username);
            sessionStorage.setItem('role', response.role || '');

            // Log successful login details
            this.logLoginActivity(response.username, response.role);

            switch (response.role?.toLowerCase()) {
              case 'admin':
                this.router.navigate(['/admin-dashboard']);
                break;
              case 'student':
                this.router.navigate(['/student-dashboard']);
                break;
              case 'faculty':
                this.router.navigate(['/faculty-dashboard']);
                break;
              case 'class advisor':
                this.router.navigate(['/class-advisor']);
                break;
              default:
                alert('Invalid role!');
            }

            // Auto Logout after 30 minutes
            setTimeout(() => {
              this.logout();
              alert('Session expired! Please log in again.');
            }, 30 * 60 * 1000);
          }
        },
        (error) => {
          console.error('Login error:', error);
          alert('Invalid username or password!');
        }
      );
  }

  // Function to log login activity
  logLoginActivity(username: string, role: string) {
    const logData = {
      username: username,
      role: role,
      login_time: new Date().toISOString() // Current timestamp
    };

    this.http.post('http://localhost:3000/log-activity', logData)
      .subscribe(
        () => console.log('Login activity logged successfully.'),
        (error) => console.error('Error logging activity:', error)
      );
  }

  // Logout function
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
