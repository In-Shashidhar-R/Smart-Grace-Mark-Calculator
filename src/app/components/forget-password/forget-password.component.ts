import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
  imports:[FormsModule, HttpClientModule, CommonModule, MatCardModule, RouterModule]
})
export class ForgetPasswordComponent {
  username: string = '';
  email: string = '';
  maskedEmail: string = '';
  otp: string = '';
  newPassword: string = '';
  step: number = 1;  // 1: Get Email, 2: Verify OTP, 3: Reset Password
  message: string = '';
  messageType: string = ''; // 'success' or 'error'

  confirmPassword: string = '';
  passwordMismatch: boolean = false;
  passwordInvalid: boolean = false; // <-- Add this line

  constructor(private http: HttpClient, private router: Router) {}

  getEmail() {
    this.clearMessage();
    this.http.post<any>('http://localhost:3000/auth/get-email', { username: this.username }).subscribe(
      (response) => {
        this.email = response.email;
        this.maskedEmail = this.maskEmail(this.email);
        this.step = 2;
        this.message = `OTP has been sent to ${this.maskedEmail}`;
        this.messageType = 'success';
        this.sendOTP();
      },
      () => {
        this.message = 'Username not found!';
        this.messageType = 'error';
      }
    );
  }

  sendOTP() {
    this.http.post('http://localhost:3000/auth/send-otp', { email: this.email }).subscribe(
      () => console.log('OTP sent successfully!'),
      () => {
        this.message = 'Error sending OTP. Please try again!';
        this.messageType = 'error';
      }
    );
  }

  verifyOTP() {
    this.clearMessage();
    this.http.post<any>('http://localhost:3000/auth/verify-otp', { email: this.email, otp: this.otp }).subscribe(
      () => {
        this.step = 3;
        this.message = 'OTP verified successfully!';
        this.messageType = 'success';
      },
      () => {
        this.message = 'Invalid OTP!';
        this.messageType = 'error';
      }
    );
  }

  
  checkPasswordMatch() {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&*!_+={}\[\]:;"'<>,.?/\\|`~]{7,}$/;
    this.passwordMismatch = this.newPassword !== this.confirmPassword;
    this.passwordInvalid = !passwordRegex.test(this.newPassword);
}

  
  resetPassword() {
    this.checkPasswordMatch(); 
    
    if (this.passwordMismatch || this.passwordInvalid) {
      this.message = 'Give a strong password';
      this.messageType = 'error';
      return;
  }
  
      this.http.post<any>('http://localhost:3000/auth/reset-password', { 
          username: this.username, 
          newPassword: this.newPassword 
      }).subscribe(
        () => {
          this.message = 'Password updated successfully!';
          this.messageType = 'success';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        () => {
          this.message = 'Error resetting password!';
          this.messageType = 'error';
        }
      );
  }

  maskEmail(email: string): string {
    const parts = email.split('@');
    const masked = parts[0].slice(0, 3) + '*'.repeat(parts[0].length - 3) + '@' + parts[1];
    return masked;
  }

  clearMessage() {
    this.message = '';
    this.messageType = '';
  }
}
