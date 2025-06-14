import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-college-details',
  standalone: true,
  templateUrl: './college-details.component.html',
  styleUrls: ['./college-details.component.css'],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatOptionModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
  ]
})
export class CollegeDetailsComponent implements OnInit {
  types = ['Student', 'Faculty', 'Class Advisor'];
  selectedTypeValue: string | null = null;
  selectedUsernameValue: string | null = null;
  usernames: string[] = [];
  userDetails: any = null;
  isEditing = false;

  userForm: FormGroup = new FormGroup({});

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      id: new FormControl(''),
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
    });
  }

  onTypeSelected(): void {
    if (this.selectedTypeValue) {
      this.usernames = []; // Reset usernames when type changes
      this.selectedUsernameValue = null; // Reset selected username
      this.userDetails = null; // Reset user details
      this.fetchUsernames(this.selectedTypeValue);
    }
  }

  onUsernameSelected(): void {
    if (this.selectedUsernameValue) {
      this.fetchUserDetails(this.selectedUsernameValue);
    }
  }

  fetchUsernames(type: string): void {
    let url = '';
    switch (type) {
      case 'Student':
        url = 'http://localhost:3000/api/get-students-usernames';
        break;
      case 'Faculty':
        url = 'http://localhost:3000/api/get-faculties-usernames';
        break;
      case 'Class Advisor':
        url = 'http://localhost:3000/api/get-advisors-usernames';
        break;
    }
    this.http.get<string[]>(url).subscribe(
      (data) => {
        this.usernames = data;
      },
      (error) => {
        console.error('Error fetching usernames:', error);
      }
    );
  }

  fetchUserDetails(username: string): void {
    this.http.get<any>(`http://localhost:3000/api/get-user-details/${this.selectedTypeValue}/${username}`).subscribe(
      (data) => {
        this.userDetails = data;
  
        // Common fields for all user types
        const controls: any = {
          id: new FormControl(data.id),
          first_name: new FormControl(data.first_name, Validators.required),
          last_name: new FormControl(data.last_name, Validators.required),
          phone_number: new FormControl(data.phone_number || ''),
          email: new FormControl(data.email || ''),
          gender: new FormControl(data.gender || ''),
          dob: new FormControl(data.dob || ''),
          address: new FormControl(data.address || ''),
        };
  
        // Fields specific to Student
        if (this.selectedTypeValue === 'Student') {
          controls['abc_id'] = new FormControl(data.abc_id || '');
          controls['aadhaar_number'] = new FormControl(data.aadhaar_number || '');
          controls['register_number'] = new FormControl(data.register_number || '');
          controls['batch'] = new FormControl(data.batch || '');
          controls['branch'] = new FormControl(data.branch || '');
          controls['father_name'] = new FormControl(data.father_name || '');
          controls['father_contact'] = new FormControl(data.father_contact || '');
          controls['mother_name'] = new FormControl(data.mother_name || '');
          controls['mother_contact'] = new FormControl(data.mother_contact || '');
          controls['guardian_name'] = new FormControl(data.guardian_name || '');
          controls['guardian_contact'] = new FormControl(data.guardian_contact || '');
          controls['resident'] = new FormControl(data.resident || '');
          controls['username'] = new FormControl(data.username || '');
          controls['password'] = new FormControl(data.password || '');
        }
  
        // Fields specific to Faculty
        if (this.selectedTypeValue === 'Faculty') {
          controls['major_subject'] = new FormControl(data.major_subject || '');
          controls['degree'] = new FormControl(data.degree || '');
          controls['username'] = new FormControl(data.username || '');
          controls['password'] = new FormControl(data.password || '');
        }
  
        // Fields specific to Class Advisor
        if (this.selectedTypeValue === 'Class Advisor') {
          controls['major_subject'] = new FormControl(data.major_subject || '');
          controls['degree'] = new FormControl(data.degree || '');
          controls['batch'] = new FormControl(data.batch || '');
          controls['branch'] = new FormControl(data.branch || '');
          controls['username'] = new FormControl(data.username || '');
          controls['password'] = new FormControl(data.password || '');
        }
  
        // Update the form group with the controls
        this.userForm = new FormGroup(controls);
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }
  

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    if (this.selectedTypeValue && this.userForm.valid && this.userForm.value.id) {
      // Ensure the date format is YYYY-MM-DD
      const formattedDob = this.formatDate(this.userForm.value.dob);
  
      // Update the form value with the formatted date
      this.userForm.patchValue({ dob: formattedDob });
  
      this.http.put(`http://localhost:3000/api/update-user/${this.selectedTypeValue}`, this.userForm.value).subscribe(
        () => {
          alert('User details updated successfully!');
          this.isEditing = false;
          this.fetchUserDetails(this.selectedUsernameValue as string);
        },
        (error) => {
          console.error('Error updating user details:', error);
        }
      );
    } else {
      alert('User ID is required!');
    }
  }
  
  // Helper method to format the date
  formatDate(date: string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
  }
  


  deleteUser(): void {
    if (this.userDetails && confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`http://localhost:3000/api/delete-user/${this.selectedTypeValue}/${this.userDetails.id}`).subscribe(
        () => {
          alert('User deleted successfully!');
          this.userDetails = null;
          this.usernames = this.usernames.filter((name) => name !== this.selectedUsernameValue);
          this.selectedUsernameValue = null;
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }
}
