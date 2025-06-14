import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-faculty-profile',
  templateUrl: './faculty-profile.component.html',
  styleUrls: ['./faculty-profile.component.css'],
  imports: [CommonModule, HttpClientModule, MatCardModule, FormsModule]
})
export class FacultyProfileComponent implements OnInit {
  originalFaculty: any;
  faculty: any = {}; // Store the faculty details
  editMode: boolean = false; // Flag to check if the form is in edit mode

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const username = sessionStorage.getItem('username');  // Retrieve username from sessionStorage
    if (username) {
      // Fetch faculty details from the backend API, passing the username in the request
      this.http.get<any>(`http://localhost:3000/api/faculty-profile?username=${username}`).subscribe(
        (data) => {
          this.faculty = data; // Assign the response to the faculty variable
          this.originalFaculty = { ...this.faculty };  // Store the original faculty data for cancellation
  
          // If dob is a string, convert it to a Date object
          if (this.faculty.dob) {
            this.faculty.dob = new Date(this.faculty.dob);
          }
        },
        (error) => {
          console.error('Error fetching faculty details:', error);
        }
      );
    } else {
      console.error('No username found in session storage');
    }
  }

  cancelEdit() {
    this.editMode = false;
    // Reset faculty data to its original state
    this.faculty = { ...this.originalFaculty }; // Assuming originalFaculty holds the initial values
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  updateFaculty() {
    const updatedFacultyData = {
      faculty_id: this.faculty.faculty_id,
      first_name: this.faculty.first_name,
      last_name: this.faculty.last_name,
      phone_number: this.faculty.phone_number,
      email: this.faculty.email,
      gender: this.faculty.gender,
      dob: this.faculty.dob,
      address: this.faculty.address,
      major_subject: this.faculty.major_subject,
      degree: this.faculty.degree,
      username: this.faculty.username,
      password: this.faculty.password, // If you are allowing password update
    };

    // Send a PUT request to update faculty data
    this.http.put<any>(`http://localhost:3000/api/faculty-profile`, updatedFacultyData).subscribe(
      (data) => {
        // Show an alert when the update is successful
        alert('Faculty updated successfully!');
        
        // Refresh the page to reflect the changes
        window.location.reload();
      },
      (error) => {
        console.error('Error updating faculty', error);
      }
    );
  }
}
