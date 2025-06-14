import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';   // Import for mat-card component
import { MatIconModule } from '@angular/material/icon';   // Import for mat-icon component
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sdashboard',
  imports: [MatCardModule, MatIconModule, MatToolbarModule, CommonModule, HttpClientModule],
  templateUrl: './sdashboard.component.html',
  styleUrl: './sdashboard.component.css'
})
export class SdashboardComponent {
  username: string | null = sessionStorage.getItem('username');
  achievementsCount = { 
    submitted: 0, 
    approved: 0, 
    rejected: 0,
    pending: 0  // Added pending status
  };
  graceMarks: number = 0;
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.username) {
      this.fetchAchievements();
      this.fetchGraceMarks();
    }
  }

  fetchAchievements() {
    console.log('Sending username to backend:', this.username); // Print the username being sent
    this.http.post<any>('http://localhost:3000/get-student-achievements', { username: this.username })
      .subscribe(response => {
        if (response && response.counts) {
          this.achievementsCount = response.counts;
        } else {
          console.error('Achievement counts not found:', response);
        }
        this.isLoading = false;
      }, error => {
        console.error('Error fetching achievements:', error);
        this.isLoading = false;
      });
  }
  

  fetchGraceMarks() {
    console.log('Sending username to backend for grace marks:', this.username); // Log the username being sent for grace marks
    this.http.post<any>('http://localhost:3000/get-student-grace-marks', { username: this.username })
      .subscribe(response => {
        if (response?.graceMarks !== undefined) {
          this.graceMarks = response.graceMarks;
        } else {
          console.error('Grace marks not found:', response);
        }
      }, error => {
        console.error('Error fetching grace marks:', error);
      });
  }
  
}
