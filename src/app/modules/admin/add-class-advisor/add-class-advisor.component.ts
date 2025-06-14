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
  selector: 'app-add-class-advisor',
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
  templateUrl: './add-class-advisor.component.html',
  styleUrl: './add-class-advisor.component.css'
})
export class AddClassAdvisorComponent {
classadvisor = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    gender: '',
    dob: '',
    address: '',
    majorsubject: '',
    degree: '',
    branch: '',
    batch: '',
    username: '',
    password: ''
  };

  constructor(private http: HttpClient) {}

  addclassadvisor() {
    // First API call to save student details
    this.http.post('http://localhost:3000/add-classadvisor', this.classadvisor).subscribe(
      response => {
        console.log('Student details added:', response);
  
        // Prepare user data for the second table
        const userData = {
          username: this.classadvisor.username,
          password: this.classadvisor.password,
          name: this.classadvisor.firstName,
          role: 'Class advisor'
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
