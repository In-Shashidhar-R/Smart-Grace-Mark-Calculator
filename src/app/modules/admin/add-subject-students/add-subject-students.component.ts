import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-subject-students',
  standalone: true,
  templateUrl: './add-subject-students.component.html',
  styleUrls: ['./add-subject-students.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class AddSubjectStudentsComponent {
  subjectForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Initialize form with the necessary fields and validation
    this.subjectForm = this.fb.group({
      batch: ['', Validators.required],
      courseName: ['', Validators.required],
      credits: ['', [Validators.required, Validators.min(1)]],
      department: ['', Validators.required],
    });
  }

  // Function to handle form submission
  onSubmit() {
    if (this.subjectForm.valid) {
      const formData = this.subjectForm.value;
  
      // Log formData to check what is being sent to the backend
      console.log('Form Data:', formData);
  
      // First POST to add the course
      this.http.post('http://localhost:3000/add-course', {
        courseName: formData.courseName,
        credits: formData.credits
      }).subscribe(
        (response: any) => {
          console.log('Course added successfully', response);
  
          // Now POST to add the subject
          this.http.post('http://localhost:3000/add-subject', {
            batch: formData.batch,
            courseName: formData.courseName,
            credits: formData.credits,
            department: formData.department
          }).subscribe(
            (subjectResponse: any) => {
              console.log('Subject saved successfully', subjectResponse);
              alert('Subject and Course saved successfully');
            },
            (subjectError) => {
              console.error('Error saving subject:', subjectError);
              alert('Failed to save subject');
            }
          );
        },
        (courseError) => {
          console.error('Error saving course:', courseError);
          alert('Failed to save course');
        }
      );
    } else {
      alert('Please fill all the required fields correctly');
    }
  }
  
}  