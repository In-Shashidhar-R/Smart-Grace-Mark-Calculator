import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';  // Import HttpClient
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback-cforms',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './feedback-cforms.component.html',
  styleUrl: './feedback-cforms.component.css'
})
export class FeedbackCformsComponent {
  feedbackForm!: FormGroup;
  successMessage: string = ''; // Initialize with an empty string
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    // Define the form controls and validate them
    this.feedbackForm = this.fb.group({
      username: [sessionStorage.getItem('username'), Validators.required], // Get username from session storage
      responsivenessRating: new FormControl(3, [Validators.required, Validators.min(1), Validators.max(5)]),
      interfaceRating: new FormControl(3, [Validators.required, Validators.min(1), Validators.max(5)]),
      feedback: ['', Validators.required]
    });
  }

  submitFeedback() {
    if (this.feedbackForm.valid) {
      // Send the form data to your backend service
      const feedbackData = this.feedbackForm.value;

      this.http.post<any>('http://localhost:3000/submit-feedback', feedbackData).subscribe(
        (response) => {
          console.log('Feedback submitted successfully:', response);
          this.successMessage = 'Feedback submitted successfully!';
          this.errorMessage = '';
        },
        (error) => {
          console.error('Error submitting feedback:', error);
          this.successMessage = '';
          this.errorMessage = 'There was an error submitting the feedback.';
        }
      );
    } else {
      this.successMessage = '';
      this.errorMessage = 'Please fill in all fields.';
    }
  }
}

