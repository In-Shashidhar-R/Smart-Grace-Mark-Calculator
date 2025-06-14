import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, CommonModule, HttpClientModule, MatProgressSpinnerModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string | null = sessionStorage.getItem('username');
  batch: string = '';
  branch: string = '';
  achievementsCount = { pending: 0, approved: 0, rejected: 0 };
  totalStudents = 0;
  studentsWithAchievements = 0;
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.username) {
      this.fetchAdvisorDetails();
    }
  }

  fetchAdvisorDetails() {
    this.http.post<any>('http://localhost:3000/get-advisor-details-advisor-dashboard', { username: this.username })
      .subscribe(response => {
        if (response?.batch && response?.branch) {
          this.batch = response.batch;
          this.branch = response.branch;
          this.fetchStudents();
        } else {
          console.error('Batch or branch not found.');
          this.isLoading = false;
        }
      }, error => {
        console.error('Error fetching advisor details:', error);
        this.isLoading = false;
      });
  }

  fetchStudents() {
    this.http.post<any>('http://localhost:3000/get-students-advisor-dashboard', { batch: this.batch, branch: this.branch })
      .subscribe(response => {
        if (response?.students) {
          const studentUsernames = response.students.map((s: any) => s.username);
          this.totalStudents = response.totalStudents;
          this.fetchAchievementCounts(studentUsernames);
          this.fetchSubmittedAchievementCount(studentUsernames);
        } else {
          console.error('No students found.');
          this.isLoading = false;
        }
      }, error => {
        console.error('Error fetching students:', error);
        this.isLoading = false;
      });
  }

  fetchAchievementCounts(usernames: string[]) {
    this.http.post<any>('http://localhost:3000/get-achievement-counts', { usernames })
      .subscribe(response => {
        if (response?.counts) {
          this.achievementsCount = response.counts;
        } else {
          console.error('Achievement counts not found.');
        }
        this.isLoading = false;
      }, error => {
        console.error('Error fetching achievement counts:', error);
        this.isLoading = false;
      });
  }

  fetchSubmittedAchievementCount(usernames: string[]) {
    this.http.post<any>('http://localhost:3000/get-achievement-student-count', { usernames })
      .subscribe(response => {
        if (response?.studentsWithAchievements !== undefined) {
          this.studentsWithAchievements = response.studentsWithAchievements;
        } else {
          console.error('No students with achievements found.');
        }
      }, error => {
        console.error('Error fetching students with achievements:', error);
      });
  }
}
