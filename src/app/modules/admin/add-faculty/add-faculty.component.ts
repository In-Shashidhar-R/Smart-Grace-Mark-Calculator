import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-faculty',
  imports: [
    CommonModule,
    HttpClientModule,  
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './add-faculty.component.html',
  styleUrl: './add-faculty.component.css'
})
export class AddFacultyComponent {
  faculty = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    gender: '',
    dob: '',
    address: '',
    majorsubject: '',
    degree: '',
    username: '',
    password: ''
  };

  constructor(private http: HttpClient) {}

  addfaculty() {
    // First API call to save student details
    this.http.post('http://localhost:3000/add-faculty', this.faculty).subscribe(
      response => {
        console.log('Student details added:', response);
  
        // Prepare user data for the second table
        const userData = {
          username: this.faculty.username,
          password: this.faculty.password,
          name: this.faculty.firstName,
          role: 'faculty'
        };
  
        // Second API call to save authentication details
        this.http.post('http://localhost:3000/add-user', userData).subscribe(
          userResponse => {
            console.log('User credentials added:', userResponse);
            alert('Person and user details added successfully!');
          },
          userError => {
            console.error('Error adding user credentials:', userError);
            alert('Person added, but error occurred while saving user credentials.');
          }
        );
  
      },
      error => {
        console.error('Error adding person:', error);
        alert('Error adding person. Please try again.');
      }
    );
  }
}
