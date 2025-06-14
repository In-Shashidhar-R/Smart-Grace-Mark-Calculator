import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-markupdation',
  imports: [CommonModule, FormsModule, HttpClientModule, MatTableModule, MatCardModule],
  templateUrl: './markupdation.component.html',
  styleUrls: ['./markupdation.component.css']
})
export class MarkupdationComponent implements OnInit {
  courses: string[] = [];  
  selectedCourse: string = '';
  students: any[] = [];  // Store the list of students
  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'register_number',
    'marks'  // Add marks to the displayed columns
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const username = sessionStorage.getItem('username'); 
    if (username) {
      this.fetchCourses(username);
    }
  }

  // Fetch the courses assigned to the logged-in faculty
  fetchCourses(username: string): void {
    this.http.get<any[]>(`http://localhost:3000/courses/${username}`).subscribe(
      (data) => {
        if (data && Array.isArray(data)) {
          this.courses = data[0].course_name.split(',').map((course: string) => course.trim());
        } else {
          console.error('Unexpected API response format', data);
        }
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  // Fetch students based on selected course
// Fetch students based on selected course
fetchStudents(): void {
  if (this.selectedCourse) {
    this.http.get<any[]>(`http://localhost:3000/get-students/${this.selectedCourse}`).subscribe(
      (data) => {
        if (data) {
          this.students = data;  // Populate the students array with the fetched data

          // Fetch marks for each student
          this.students.forEach(student => {
            this.fetchStudentMarks(student.register_number, this.selectedCourse).subscribe(
              (marksData) => {
                // Check if the marksData contains the 'marks' property
                student.marks = marksData?.marks ?? 0;  // Default to 0 if marks are not found
              },
              (error) => {
                console.error(`Error fetching marks for ${student.register_number}`, error);
                student.marks = 0;  // Default to 0 if error occurs
              }
            );
          });
        }
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }
}

// Fetch marks for a student based on register_number and course_name
fetchStudentMarks(registerNumber: string, courseName: string) {
  return this.http.get<any>(`http://localhost:3000/get-student-marks/${registerNumber}/${courseName}`);
}

submitChanges(): void {
  // Prepare the updated marks
  const updates = this.students.map(student => {
    return {
      register_number: student.register_number,
      course_name: this.selectedCourse,
      marks: student.marks
    };
  });

  // Send updates to the backend
  this.http.post<any>('http://localhost:3000/update-all-student-marks', updates).subscribe(
    (response) => {
      console.log('Marks updated successfully:', response);
      alert('Marks updated successfully!');
      this.fetchStudents(); // Refresh the list of students after update
    },
    (error) => {
      console.error('Error updating marks:', error);
      alert('An error occurred while updating marks.');
    }
  );
}

}