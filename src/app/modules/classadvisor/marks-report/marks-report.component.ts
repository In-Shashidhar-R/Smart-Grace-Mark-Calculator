import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface StudentMark {
  course_name: string;
  marks: number;
  credits: number;
  grace_mark_addition?: number;
  updated_marks?: number;
}

interface CourseCredit {
  course_name: string;
  credits: number;
}

@Component({
  selector: 'app-marks-report',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, HttpClientModule, MatTableModule],
  templateUrl: './marks-report.component.html',
  styleUrls: ['./marks-report.component.css']
})
export class MarksReportComponent implements OnInit {
  selectedRegisterNumber: string = '';
  students: any[] = [];
  studentMarks: StudentMark[] = [];
  advisorBranch: string = '';
  advisorBatch: string = '';
  graceMarks: number = 0;
  courseCredits: CourseCredit[] = [];
  selectedUsername: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAdvisorDetails();
  }

  fetchAdvisorDetails(): void {
    const username = sessionStorage.getItem('username');
    if (!username) {
      alert('No username found in session storage');
      return;
    }

    this.http.post<any>('http://localhost:3000/get-advisor-details', { username }).subscribe(
      response => {
        this.advisorBranch = response.branch;
        this.advisorBatch = response.batch;
        this.fetchStudents();
      },
      error => {
        console.error('Error fetching advisor details:', error);
        alert('An error occurred while fetching advisor details.');
      }
    );
  }

  fetchStudents(): void {
    this.http.post<any>('http://localhost:3000/get-students-by-advisor', {
      batch: this.advisorBatch,
      branch: this.advisorBranch
    }).subscribe(
      response => {
        console.log('Students fetched:', response);
        this.students = response;
      },
      error => {
        console.error('Error fetching students:', error);
        alert('An error occurred while fetching students.');
      }
    );
  }

  fetchMarks(): void {
    if (!this.selectedRegisterNumber) {
      alert('Please select a register number.');
      return;
    }

    this.http.post<any>('http://localhost:3000/get-student-by-register-number', { register_number: this.selectedRegisterNumber })
      .subscribe(
        studentResponse => {
          if (!studentResponse || !studentResponse.username) {
            alert('Student not found.');
            return;
          }

          this.selectedUsername = studentResponse.username;
          
          this.http.post<StudentMark[]>('http://localhost:3000/get-all-marks-by-register-number', { register_number: this.selectedRegisterNumber })
            .subscribe(
              marksResponse => {
                console.log('Marks fetched:', marksResponse);
                this.studentMarks = marksResponse;
                this.fetchCourseCredits();
              },
              error => {
                console.error('Error fetching student marks:', error);
                alert('An error occurred while fetching student marks.');
              }
            );

          this.http.post<any>('http://localhost:3000/get-grace-marks-by-username', { user_id: this.selectedUsername })
            .subscribe(
              graceMarksResponse => {
                console.log('Grace Marks fetched:', graceMarksResponse);
                this.graceMarks = graceMarksResponse.marks || 0;
              },
              error => {
                console.error('Error fetching grace marks:', error);
                alert('An error occurred while fetching grace marks.');
              }
            );
        },
        error => {
          console.error('Error fetching student details:', error);
          alert('An error occurred while fetching student details.');
        }
      );
  }

  fetchCourseCredits(): void {
    this.http.post<CourseCredit[]>('http://localhost:3000/get-course-credits', {}).subscribe(
      response => {
        console.log('Course Credits fetched:', response);
        this.courseCredits = response;
        this.distributeGraceMarks();
      },
      error => {
        console.error('Error fetching course credits:', error);
      }
    );
  }

  getCourseCredit(courseName: string): number {
    console.log('Looking for course:', courseName);  // Log the course being searched
    const course = this.courseCredits.find(course => course.course_name === courseName);
    console.log('Found course:', course);  // Log the course found
    return course ? course.credits : 0;  // Return 0 if no matching course is found
  }


  distributeGraceMarks(): void {
    let remainingGraceMarks = this.graceMarks;
    console.log('Starting grace mark distribution with:', remainingGraceMarks);

    // Upgrade grades where possible
    this.studentMarks.forEach(course => {
      if (remainingGraceMarks <= 0) return;

      const marksNeededForNextGrade = this.getMarksForNextGrade(course.marks);
      if (marksNeededForNextGrade > 0 && marksNeededForNextGrade <= remainingGraceMarks) {
        console.log(`Adding ${marksNeededForNextGrade} grace marks to ${course.course_name}`);
        course.grace_mark_addition = marksNeededForNextGrade;
        course.updated_marks = course.marks + marksNeededForNextGrade;
        remainingGraceMarks -= marksNeededForNextGrade;
      }
    });

    // Distribute remaining marks to highest credit courses
    while (remainingGraceMarks > 0) {
      this.studentMarks.sort((a, b) => b.credits - a.credits);

      let markDistributed = false;
      for (const course of this.studentMarks) {
        if (remainingGraceMarks <= 0) break;
        
        course.grace_mark_addition = (course.grace_mark_addition || 0) + 1;
        course.updated_marks = (course.updated_marks || course.marks) + 1;
        remainingGraceMarks -= 1;
        markDistributed = true;
      }

      if (!markDistributed) break;
    }

    console.log('Final grace mark distribution:', this.studentMarks);
  }

  getGrade(marks: number): string {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C+';
    if (marks >= 40) return 'C';
    return 'F';
  }


  getMarksForNextGrade(marks: number): number {
    if (marks >= 90) return 0;
    if (marks >= 80) return 90 - marks;
    if (marks >= 70) return 80 - marks;
    if (marks >= 60) return 70 - marks;
    if (marks >= 50) return 60 - marks;
    if (marks >= 40) return 50 - marks;
    return 40 - marks;
  }

  updateMarks(): void {
    let totalGraceMarksUsed = 0;
  
    const updatedMarks = this.studentMarks.map(course => {
      const graceMarksToAdd = course.grace_mark_addition || 0;
      totalGraceMarksUsed += graceMarksToAdd;
  
      return {
        register_number: this.selectedRegisterNumber,
        course_name: course.course_name,
        updated_marks: course.marks + graceMarksToAdd
      };
    });
  
    console.log('Updated Marks:', updatedMarks);
  
    // Update student marks
    this.http.post<any>('http://localhost:3000/update-student-marks', { studentMarks: updatedMarks })
      .subscribe(
        response => {
          console.log('Marks updated successfully:', response);
          this.updateGraceMarks(totalGraceMarksUsed);
        },
        error => {
          console.error('Error updating marks:', error);
          alert('An error occurred while updating marks.');
        }
      );
  }
  
  updateGraceMarks(totalGraceMarksUsed: number): void {
    if (!this.selectedUsername) {
      alert('No username found for the selected student');
      return;
    }
  
    // Update grace marks
    this.http.post<any>('http://localhost:3000/update-grace-marks', {
      username: this.selectedUsername,
      graceMarksUsed: totalGraceMarksUsed
    }).pipe(
      catchError(err => {
        console.error('HTTP Request failed:', err);
        return throwError(() => err);
      })
    ).subscribe(
      response => {
        console.log('Grace marks updated successfully:', response);
      }
    );
}
}
