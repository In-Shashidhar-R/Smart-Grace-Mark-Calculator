import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-subject-to-faculty',
  standalone: true,
  imports: [
    MatCardModule, CommonModule, HttpClientModule, MatSelectModule, MatFormFieldModule, 
    FormsModule, MatButtonModule, MatTableModule, MatIconModule
  ],
  templateUrl: './add-subject-to-faculty.component.html',
  styleUrl: './add-subject-to-faculty.component.css'
})
export class AddSubjectToFacultyComponent implements OnInit {
  facultyNames: string[] = [];
  CourseNames: string[] = [];
  selectedFaculty: string = '';  
  selectedCourses: string[] = []; 
  facultyCourses: any[] = []; // To store faculty-course assignments

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchFacultyNames();
    this.fetchCourses();
    this.fetchFacultyCourses();
  }

  fetchFacultyNames(): void {
    this.http.get<any[]>('http://localhost:3000/faculty')
      .subscribe(
        data => this.facultyNames = Array.isArray(data) ? data.map(item => item.first_name) : [],
        error => console.error('Error fetching faculty names:', error)
      );
  }

  fetchCourses(): void {
    this.http.get<any[]>('http://localhost:3000/get-courses')
      .subscribe(
        data => this.CourseNames = Array.isArray(data) ? data.map(item => item.course_name) : [],
        error => console.error('Error fetching courses:', error)
      );
  }

  fetchFacultyCourses(): void {
    this.http.get<any[]>('http://localhost:3000/get-faculty-courses')
      .subscribe(
        data => this.facultyCourses = data,
        error => console.error('Error fetching faculty-course assignments:', error)
      );
  }

  saveFacultyCourses(): void {
    if (!this.selectedFaculty || this.selectedCourses.length === 0) {
      alert("Please select a faculty and at least one course.");
      return;
    }

    const requestBody = {
      faculty_name: this.selectedFaculty,
      courses: this.selectedCourses.join(', ') // Concatenating courses
    };

    this.http.post('http://localhost:3000/save-faculty-courses', requestBody)
      .subscribe(
        response => {
          console.log('Saved successfully:', response);
          alert('Faculty and courses saved successfully!');
          this.fetchFacultyCourses();
        },
        error => {
          console.error('Error saving data:', error);
          alert('Error saving faculty courses.');
        }
      );
  }

  deleteFacultyCourse(facultyName: string, courseName: string): void {
    if (!confirm(`Are you sure you want to delete ${facultyName}'s course: ${courseName}?`)) {
      return;
    }

    this.http.delete(`http://localhost:3000/delete-faculty-course?faculty_name=${facultyName}&course_name=${courseName}`)
      .subscribe(
        response => {
          console.log('Deleted successfully:', response);
          alert('Faculty course deleted successfully!');
          this.fetchFacultyCourses(); // Refresh table data
        },
        error => {
          console.error('Error deleting faculty course:', error);
          alert('Error deleting faculty course.');
        }
      );
  }
}
