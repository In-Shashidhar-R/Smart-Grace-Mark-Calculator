import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // For Material Table functionality
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-grace-mark-report',
  templateUrl: './grace-mark-report.component.html',
  styleUrls: ['./grace-mark-report.component.css'],
  imports: [HttpClientModule, FormsModule, CommonModule, ReactiveFormsModule, MatTableModule]
})
export class GraceMarkReportComponent implements OnInit {
  graceMarks: any[] = []; // To hold the grace mark data
  displayedColumns: string[] = ['username', 'first_name', 'last_name', 'register_number', 'marks']; // Columns to display in the table
  dataSource = new MatTableDataSource<any>(); // Material Data Source for the table

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Get the username from sessionStorage
    const username = sessionStorage.getItem('username');

    if (username) {
      // Fetch grace marks from the backend using the username
      this.http.get<any[]>(`http://localhost:3000/grace-mark/${username}`).subscribe(
        (data) => {
          this.graceMarks = data;
          this.dataSource.data = this.graceMarks; // Set data to the table data source
        },
        (error) => {
          console.error('Error fetching grace marks:', error);
        }
      );
    } else {
      console.error('No username found in sessionStorage');
    }
  }

  downloadPDF(): void {
    const doc = new jsPDF();
    doc.text('Grace Mark Report', 80, 10);

    autoTable(doc, {
      head: [['Username', 'First Name', 'Last Name', 'Register Number', 'Marks']],
      body: this.graceMarks.map(row => [row.username, row.first_name, row.last_name, row.register_number, row.marks]),
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 150, 136] }, // Green header for better readability
    });

    doc.save('Grace_Mark_Report.pdf');
  }
}
