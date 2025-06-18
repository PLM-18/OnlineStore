import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerModel = {
    email: '',
    password: ''
  };
  
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.authService.register(this.registerModel.email, this.registerModel.password)
      .subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.isLoading = false;
          this.successMessage = 'Registration successful! You can now login.';
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          if (error.error && error.error.errors) {
            const errorMessages = [];
            for (const key in error.error.errors) {
              errorMessages.push(error.error.errors[key]);
            }
            this.errorMessage = errorMessages.join(' ');
          } else if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'An error occurred during registration. Please try again.';
          }
          console.error('Registration error', error);
        }
      });
  }
}