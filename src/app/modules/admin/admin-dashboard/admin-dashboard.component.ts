import { Component, HostBinding, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule
  ],
})
export class AdminDashboardComponent {
  isSidebarOpen = false;
  private inactivityTimeout: any;

  constructor(private router: Router) {
    this.startInactivityTimer();
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
    this.router.navigate(['./login']);
  }

  // Start inactivity timer
  startInactivityTimer() {
    this.resetInactivityTimer();
    console.log('Inactivity timer started for Admin Dashboard'); // Debug log
  }

  // Reset inactivity timer
  resetInactivityTimer() {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.logout();
    }, 30 * 60 * 1000); // 1 minute timeout for testing
  }

  // Detect user activity (mouse move, keypress, clicks)
  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  handleUserActivity() {
    this.resetInactivityTimer();
  }
}
