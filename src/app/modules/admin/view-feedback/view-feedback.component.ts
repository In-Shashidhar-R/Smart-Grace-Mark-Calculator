import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-view-feedback',
  templateUrl: './view-feedback.component.html',
  styleUrls: ['./view-feedback.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatCardModule, MatTableModule, HttpClientModule]
})
export class ViewFeedbackComponent implements OnInit {
  feedbackData: any[] = [];
  displayedColumns: string[] = ['username', 'responsivenessRating', 'interfaceRating', 'feedback', 'created_at' ]; // Define the columns to be displayed in the table
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchFeedback();
  }

  fetchFeedback(): void {
    this.http.get<any[]>('http://localhost:3000/get-feedback').subscribe(
      (data) => {
        this.feedbackData = data;
      },
      (error) => {
        console.error('Error fetching feedback data:', error);
      }
    );
  }
}
