import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-grace-mark-approval',
  imports: [MatCardModule, MatSelectModule, HttpClientModule, CommonModule, MatTableModule, FormsModule],
  templateUrl: './grace-mark-approval.component.html',
  styleUrl: './grace-mark-approval.component.css'
})
export class GraceMarkApprovalComponent {
  achievements: any[] = [];
  sliderValue = 3;
  email: string = '';
  displayedColumns: string[] = [
    'username',
    'type',
    'title',
    'description',
    'organization',
    'position',
    'participants',
    'sharepoint',
    'eventDate',
    'appliedDate',
    'status',
    'feedback',
    'grace_mark',
    'action'
  ];
  apiUrl = 'http://localhost:3000/api/advisor-viewprogress';  // Your API URL here
  updateUrl = 'http://localhost:3000/api/updateAchievement';  // API endpoint to update achievement

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchAchievements();
  }

  fetchAchievements() {
    const advisorUsername = sessionStorage.getItem('username'); // Retrieve advisor's username from session storage
    if (advisorUsername) {
      const urlWithUsername = `${this.apiUrl}?username=${advisorUsername}`; // Append username as query parameter
      this.http.get<any[]>(urlWithUsername).subscribe(
        (data) => {
          this.achievements = data;
          console.log('Achievements:', this.achievements);
        },
        (error) => {
          console.error('Error fetching achievements:', error);
        }
      );
    } else {
      console.error('Advisor username is not available in session storage');
    }
  }

  updateAchievement(achievement: any) {
    const updatedData = {
      id: achievement.id,
      username: achievement.username,
      type: achievement.type,
      position: achievement.position,
      status: achievement.status,
      feedback: achievement.feedback,
      participants: achievement.participants,
      sharepoint: achievement.sharepoint,
    };
  
    // First, update the achievement in the database
    this.http.put(this.updateUrl, updatedData).subscribe(
      (response) => {
        console.log('Updated successfully:', response);
        alert('Achievement updated successfully!');
  
        // After the update, get the user's email and send the email notification
        this.getEmail(achievement.username, (email: string) => {
          if (email) {
            this.sendEmailNotification(achievement, email);
          }
        });
  
        this.fetchAchievements(); // Refresh the table
      },
      (error) => {
        console.error('Error updating achievement:', error);
        alert('Failed to update achievement. ' + error.error.message);
      }
    );
  }
  
  getEmail(username: string, callback: (email: string) => void) {
    // Fetch the email for the given username
    this.http.post<any>('http://localhost:3000/auth/get-email', { username }).subscribe(
      (response) => {
        callback(response.email); // Pass the email to the callback function
      },
      (error) => {
        console.error('Error fetching email:', error);
        alert('Username not found or email not available!');
      }
    );
  }
  
  sendEmailNotification(achievement: any, email: string) {
    const formattedDate = this.formatDate(achievement.appliedDate);
    const emailData = {
      email: email,  // Use the email retrieved from getEmail
      appliedDate: formattedDate,
      status: achievement.status,
      achievementTitle: achievement.title, // Send the achievement title
    };
  
    // Call the backend API to send the email
    this.http.post('http://localhost:3000/api/send-achievement-email', emailData).subscribe(
      (response) => {
        console.log('Email sent successfully:', response);
      },
      (error) => {
        console.error('Error sending email:', error);
        alert('Mail Sent');
      }
    );
  }

  formatDate(date: string): string {
    const appliedDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    
    // Format the date as "Applied on March 15th, 2025 at 12:36 AM"
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(appliedDate);
    
    // Add ordinal suffix for the day (e.g., "1st", "2nd", "3rd", "15th", etc.)
    const day = appliedDate.getDate();
    const suffix = this.getOrdinalSuffix(day);
    
    return formattedDate.replace(/\b(\d+)\b/, day + suffix);  // Replace the day number with the day + suffix
  }
  
  getOrdinalSuffix(day: number): string {
    const j = day % 10;
    const k = day % 100;
    if (j == 1 && k != 11) {
      return 'st';
    }
    if (j == 2 && k != 12) {
      return 'nd';
    }
    if (j == 3 && k != 13) {
      return 'rd';
    }
    return 'th';
  }
  
}
