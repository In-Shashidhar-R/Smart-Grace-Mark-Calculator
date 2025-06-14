import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClient for API calls
import { Router } from '@angular/router'; // Import Router for navigation
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-classadvisor-profile',
  templateUrl: './classadvisor-profile.component.html',
  styleUrls: ['./classadvisor-profile.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule]
})
export class ClassadvisorProfileComponent implements OnInit {
  isEditing = false;  // To control whether the form is in edit mode or view mode
  classAdvisor = {
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    gender: '',
    dob: '',
    address: '',
    major_subject: '',
    degree: '',
    batch: '',
    branch: ''
  }; // Object to store class advisor data
  username: string = ''; // Store username from session storage

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Get the username from session storage
    this.username = sessionStorage.getItem('username') || '';
    console.log('Username retrieved from session storage:', this.username);

    // Fetch class advisor data on component initialization
    if (this.username) {
      this.getClassAdvisorDetails(this.username);
    }
  }

  // Fetch class advisor details
  getClassAdvisorDetails(username: string): void {
    console.log('Fetching details for username:', username);
    this.http.get<any>(`http://localhost:3000/classadvisor/${username}`).subscribe(
      (data) => {
        console.log('Class Advisor details:', data);
        this.classAdvisor = data;
      },
      (error) => {
        console.error('Error fetching class advisor data:', error);
      }
    );
  }

  // Toggle between edit and view mode
  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
  }

  // Update class advisor details
  updateClassAdvisorDetails(): void {
    console.log('Updating class advisor details:', this.classAdvisor);
    this.http.put(`http://localhost:3000/classadvisor/${this.username}`, this.classAdvisor).subscribe(
      (response) => {
        console.log('Class advisor updated successfully:', response);
        alert('Profile updated successfully!');
        this.toggleEditMode();  // Turn off edit mode after success
      },
      (error) => {
        console.error('Error updating class advisor details:', error);
        alert('Failed to update profile.');
      }
    );
  }
}
