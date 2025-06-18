import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginModel = {
    email: '',
    password: ''
  };
  
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.loginModel.email, this.loginModel.password)
      .subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.isLoading = false;
          this.router.navigate(['/product-listing'], { 
            state: { successMessage: 'Login successful!' } 
          });
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          if (error.status === 401) {
            this.errorMessage = 'Invalid email or password';
          } else {
            this.errorMessage = 'An error occurred. Please try again.';
          }
          console.error('Login error', error);
        }
      });
  }
}