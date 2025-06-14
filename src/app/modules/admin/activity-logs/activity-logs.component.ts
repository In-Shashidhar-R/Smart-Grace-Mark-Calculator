import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [CommonModule, MatTableModule, HttpClientModule],
  templateUrl: './activity-logs.component.html',
  styleUrl: './activity-logs.component.css'
})
export class ActivityLogsComponent implements OnInit {
  displayedColumns: string[] = ['username', 'role', 'login_time'];
  dataSource: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchActivityLogs();
  }

  fetchActivityLogs() {
    this.http.get<any[]>('http://localhost:3000/get-activity-logs').subscribe(
      (data) => {
        this.dataSource = data;
      },
      (error) => {
        console.error('Error fetching activity logs:', error);
      }
    );
  }
}
