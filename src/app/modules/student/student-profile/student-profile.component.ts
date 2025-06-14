import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
  imports: [MatIconModule, CommonModule, HttpClientModule, MatCardModule, FormsModule]
})
export class StudentProfileComponent implements OnInit {
  originalUser: any;
  user: any = {}; // Store the user details
  editMode: boolean = false; // Flag to check if the form is in edit mode

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const username = sessionStorage.getItem('username');  // Retrieve username from sessionStorage
    if (username) {
      // Fetch user details from the backend API
      this.http.get<any>(`http://localhost:3000/api/user/${username}`).subscribe(
        (data) => {
          this.user = data; // Assign the response to the user variable
          this.originalUser = { ...this.user };  // Store the original user data for cancellation
  
          // If dob is a string, convert it to a Date object
          if (this.user.dob) {
            this.user.dob = new Date(this.user.dob);
          }
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      console.error('No username found in session storage');
    }
  }

  cancelEdit() {
    this.editMode = false;
    // Reset user data to its original state
    this.user = { ...this.originalUser }; // Assuming originalUser holds the initial values
  }
  
  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  updateUser() {
    const updatedUserData = {
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      email: this.user.email,
      phone_number: this.user.phone_number,
      gender: this.user.gender,
      register_number: this.user.register_number,
      dob: this.user.dob,
      batch: this.user.batch,
      branch: this.user.branch,
      address: this.user.address,
      father_name: this.user.father_name,
      father_contact: this.user.father_contact,
      mother_name: this.user.mother_name,
      mother_contact: this.user.mother_contact,
      guardian_name: this.user.guardian_name,
      guardian_contact: this.user.guardian_contact,
      resident: this.user.resident,
      password: this.user.password, // If you are allowing password update
    };

    // Send a PUT request to update user data
    this.http.put<any>(`http://localhost:3000/api/user/${this.user.username}`, updatedUserData).subscribe(
      (data) => {
        // Show an alert when the update is successful
        alert('User updated successfully!');
        
        // Refresh the page to reflect the changes
        window.location.reload();
      },
      (error) => {
        console.error('Error updating user', error);
      }
    );
  }
}
