import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fdashboard',
  imports: [MatCardModule, CommonModule, HttpClientModule],
  templateUrl: './fdashboard.component.html',
  styleUrl: './fdashboard.component.css'
})
export class FdashboardComponent {
  username: string | null = sessionStorage.getItem('username');
  firstName: string = '';
  courseName: string = '';
  subjects: any[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.username) {
      this.fetchFacultyDetails();
    }
  }

  fetchFacultyDetails() {
    this.http.post<any>('http://localhost:3000/get-faculty-details', { username: this.username })
      .subscribe(response => {
        if (response) {
          this.firstName = response.firstName;
          this.courseName = response.courseName;
          this.subjects = response.subjects;
        } else {
          console.error('No data found for this faculty.');
        }
        this.isLoading = false;
      }, error => {
        console.error('Error fetching faculty details:', error);
        this.isLoading = false;
      });
  }

  // Method to split the course name into individual courses
  splitCourseNames() {
    return this.courseName.split(',').map(course => course.trim());
  }
  
}