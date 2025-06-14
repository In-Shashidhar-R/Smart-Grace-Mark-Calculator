import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';  // Import MatInputModule
import { MatNativeDateModule } from '@angular/material/core'; 
import { CommonModule } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-add-achievement',
  imports: [MatNativeDateModule, 
    CommonModule,
    MatDatepicker,
    MatInputModule, 
    MatCardModule, 
    HttpClientModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatOptionModule, 
    MatSelectModule],
  templateUrl: './add-achievement.component.html',
  styleUrl: './add-achievement.component.css'
})
export class AddAchievementComponent {
  
  achievementForm: FormGroup;
  achievementTypes = [
    'Conference paper presentation',
    'Extracurricular activities',
    'Sports events',
    'Technical event participation',
    'Club activities and involvement',
    'Volunteering in social service events',
    'Blood donation campaigns'
  ];
  selectedType: string = '';
  username: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.achievementForm = this.fb.group({
      type: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      organization: ['', Validators.required],
      position: ['', Validators.required],
      eventDate: ['', Validators.required],
      participants: ['', [Validators.required, Validators.min(1)]], 
      sharepoint: ['', Validators.required], // New field
    });
    this.username = sessionStorage.getItem('username') || '';  
  }
  

  onTypeChange() {
    if (this.selectedType === 'Conference paper presentation') {
      this.achievementForm.get('additionalInfo')?.setValidators([Validators.required]);
    } else {
      this.achievementForm.get('additionalInfo')?.clearValidators();
    }
    this.achievementForm.get('additionalInfo')?.updateValueAndValidity();
  }

  submitForm() {
    if (this.achievementForm.valid) {
      const achievementData = {
        ...this.achievementForm.value,  // Spread the form values
        username: this.username,        // Add the username
      };

      this.http.post('http://localhost:3000/api/achievements', achievementData).subscribe(
        (response) => {
          console.log('Achievement added successfully!', response);
          alert('Achievement submitted successfully!');
          this.achievementForm.reset();  // Clear the form after submission
        },
        (error) => {
          console.error('Error adding achievement!', error);
          alert('Failed to submit achievement. Please try again.');
        }
      );
    }
  }
}