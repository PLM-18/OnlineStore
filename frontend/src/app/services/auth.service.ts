import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface UserViewModel {
  emailaddress: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserViewModel;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7121/api/Authentication';
  
  constructor(private http: HttpClient) { }
  
  private storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }
  
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  logout(): void {
    localStorage.removeItem('auth_token');
  }
  
  login(email: string, password: string): Observable<AuthResponse> {
    const user: UserViewModel = {
      emailaddress: email,
      password: password
    };
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, user)
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.storeToken(response.token);
          }
        })
      );
  }
  
  register(email: string, password: string): Observable<any> {
    const user: UserViewModel = {
      emailaddress: email,
      password: password
    };
    
    return this.http.post(`${this.apiUrl}/register`, user);
  }
}