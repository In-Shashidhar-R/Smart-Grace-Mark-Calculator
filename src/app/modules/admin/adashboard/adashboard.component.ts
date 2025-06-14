import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adashboard',
  imports: [MatCardModule, HttpClientModule, CommonModule],
  templateUrl: './adashboard.component.html',
  styleUrl: './adashboard.component.css'
})
export class AdashboardComponent {
  totalStudents: number = 0;
  totalFaculty: number = 0;
  totalClassAdvisors: number = 0;
  totalDepartments: number = 0;
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDashboardDetails();
  }

  fetchDashboardDetails() {
    this.http.get<any>('http://localhost:3000/get-dashboard-details')
      .subscribe(response => {
        if (response) {
          this.totalStudents = response.totalStudents;
          this.totalFaculty = response.totalFaculty;
          this.totalClassAdvisors = response.totalClassAdvisors;
          this.totalDepartments = response.totalDepartments;
        } else {
          console.error('Error fetching dashboard data');
        }
        this.isLoading = false;
      }, error => {
        console.error('Error fetching dashboard data:', error);
        this.isLoading = false;
      });
  }


}
