import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatCardModule,
    HttpClientModule
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent {
  isStudentDashboard: boolean = true;
  isSidebarOpen = false;
  username: string | null = sessionStorage.getItem('username');
  studentName: string = '';
  private inactivityTimeout: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    if (this.username) {
      this.getStudentName();
    }
    this.startInactivityTimer();
  }

  // Fetch the student's name from the backend using the username
  getStudentName(): void {
    if (!this.username) {
      console.error('Username not found in sessionStorage');
      return;
    }

    this.http.post<any>('http://localhost:3000/get-student-name', { username: this.username })
      .subscribe(
        (response) => {
          if (response?.name) {
            this.studentName = response.name;
          } else {
            console.error('Student name not found in response');
          }
        },
        (error) => {
          console.error('Error fetching student name:', error);
        }
      );
  }
  
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  // Logout function
  logout() {
    sessionStorage.clear();
    alert('Session expired! Please log in again.');
    this.router.navigate(['/login']);
  }

  // Start inactivity timer
  startInactivityTimer() {
    this.resetInactivityTimer();
  }

  // Reset inactivity timer
  resetInactivityTimer() {
    clearTimeout(this.inactivityTimeout);
    
    if (!sessionStorage.getItem('username')) {
      this.logout();
      return;
    }

    this.inactivityTimeout = setTimeout(() => {
      this.logout();
    }, 30 * 60 * 1000); // 1-minute timeout for testing
  }

  // Detect user activity (mouse move, keypress, clicks, touch events)
  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  @HostListener('document:touchstart') // Added for mobile interactions
  handleUserActivity() {
    this.resetInactivityTimer();
  }
}
