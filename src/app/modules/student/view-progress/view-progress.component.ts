import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-view-progress',
  templateUrl: './view-progress.component.html',
  styleUrls: ['./view-progress.component.css'],
  imports: [MatSelectModule, MatInputModule, MatTableModule, HttpClientModule, MatFormFieldModule, MatOptionModule, FormsModule, ReactiveFormsModule, CommonModule]
})
export class ViewProgressComponent implements OnInit {
  achievements: any[] = [];
  achievementTypes = [
    'Conference paper presentation',
    'Extracurricular activities',
    'Sports events',
    'Technical event participation',
    'Club activities and involvement',
    'Volunteering in social service events',
    'Blood donation campaigns'
  ];
  displayedColumns: string[] = [
    'id',
    'type',
    'title',
    'description',
    'organization',
    'position',
    'eventDate',
    'sharepoint',
    'appliedDate',
    'participants',
    'status',
    'feedback',
    'grace_marks',
    'edit'
  ];
  apiUrl = 'http://localhost:3000/api/viewprogress';  // Your API URL here
  username: string = '';
  editingAchievement: any = null;
  editForm!: FormGroup;  // Define the editForm FormGroup

  constructor(private http: HttpClient) {
    // Initialize the form with empty or default values
    this.editForm = new FormGroup({
      type: new FormControl(''),
      title: new FormControl(''),
      description: new FormControl(''),
      organization: new FormControl(''),
      position: new FormControl(''),
      participants: new FormControl(''),
      eventDate: new FormControl(''),
      sharepoint: new FormControl(''),
    });
  }

  ngOnInit() {
    this.username = sessionStorage.getItem('username') || '';
    this.fetchAchievements();
  }

  fetchAchievements() {
    if (this.username) {
      const url = `${this.apiUrl}?username=${this.username}`;
      this.http.get<any[]>(url).subscribe(
        (data) => {
          this.achievements = data;
        },
        (error) => {
          console.error('Error fetching achievements:', error);
        }
      );
    }
  }

  editAchievement(achievement: any) {
    this.editingAchievement = { ...achievement };  // Create a copy to avoid modifying the original object directly

    // Set the form values when editing an achievement
    this.editForm.setValue({
      type: achievement.type || '',
      title: achievement.title || '',
      description: achievement.description || '',
      organization: achievement.organization || '',
      position: achievement.position || '',
      participants: achievement.participants || '',
      eventDate: achievement.eventDate || '',
      sharepoint: achievement.sharepoint || '',
    });
  }

  saveChanges() {
    if (this.editingAchievement) {
      const url = `http://localhost:3000/api/updateAchievement/${this.editingAchievement.id}`;
      this.http.put(url, this.editForm.value).subscribe(
        () => {
          console.log('Achievement updated');
          this.fetchAchievements();  // Refresh the data
          this.editingAchievement = null;  // Clear the form
        },
        (error) => {
          console.error('Error saving changes:', error);
        }
      );
    }
  }

  cancelEdit() {
    this.editingAchievement = null;  // Clear the form
  }

  downloadPDF() {
    const doc = new jsPDF({ orientation: 'landscape' }); // Landscape for better fit
    const pageWidth = doc.internal.pageSize.getWidth(); 
  
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', 
      hour: 'numeric', minute: 'numeric', hour12: true
    });
  
    const username = sessionStorage.getItem('username') || 'Unknown User';
  
    // Title and metadata
    doc.setFontSize(16);
    doc.text('Achievements Report', pageWidth / 2, 15, { align: 'center' });
  
    doc.setFontSize(12);
    doc.text(`Username: ${username}`, 14, 25);
    doc.text(`Date: ${formattedCurrentDate}`, 14, 33);
  
    // Function to format date with ordinal suffix
    const formatDate = (dateString: string): string => {
      const eventDate = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { 
        day: 'numeric', month: 'short', year: 'numeric', 
        hour: 'numeric', minute: 'numeric', hour12: true 
      };
  
      const day = eventDate.getDate();
      const ordinal = (day: number) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };
  
      const formattedDay = `${day}${ordinal(day)}`;
      const formattedDate = eventDate.toLocaleString('en-GB', options)
        .replace(',', '').replace('at', '');
  
      return formattedDate.replace(/^\d+/, formattedDay);
    };
  
    // Table Configuration
    autoTable(doc, {
      startY: 40,
      head: [['Type', 'Title', 'Description', 'Organization', 'Position', 'Event Date', 'Sharepoint', 'Applied Date', 'Participants', 'Status']],
      body: this.achievements.map(ach => [
        ach.type,
        ach.title,
        ach.description,
        ach.organization,
        ach.position,
        formatDate(ach.eventDate),
        ach.sharepoint,
        formatDate(ach.appliedDate),
        ach.participants,
        ach.status,
      ]),
      styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 25 },  // Type
        1: { cellWidth: 35 },  // Title
        2: { cellWidth: 35 },  // Description
        3: { cellWidth: 35 },  // Organization
        4: { cellWidth: 20 },  // Position
        5: { cellWidth: 25 },  // Event Date
        6: { cellWidth: 30 },  // Sharepoint
        7: { cellWidth: 30 },  // Applied Date
        8: { cellWidth: 20 },  // Participants
        9: { cellWidth: 25 }   // Status
      },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 11 },
      alternateRowStyles: { fillColor: [230, 240, 250] }
    });
  
    doc.save('Achievements_Report.pdf');
  }
  
  
}