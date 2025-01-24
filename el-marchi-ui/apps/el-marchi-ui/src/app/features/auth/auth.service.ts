import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {environment} from "../../../../environments/environment.development";

export interface ConnectedUser {
  authorities: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private loggedIn = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<ConnectedUser | null>(null);
  user$ = this.userSubject.asObservable();

  fetch(forceResync = false): Observable<ConnectedUser> {
    const params = new HttpParams().set('forceResync', forceResync);
    return this.http
      .get<ConnectedUser>(`${environment.apiUrl}/users/authenticated`, { params })
      .pipe(
        tap((user) => {
          this.userSubject.next(user); // Cache the user data
          this.loggedIn.next(true); // Mark user as logged in
        })
      );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token); // Store the token
        this.loggedIn.next(true); // Mark user as logged in
        this.router.navigate(['/dashboard']); // Redirect to dashboard
      })
    );
  }

  register(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, credentials);
  }

  logout(): void {
    localStorage.removeItem('token'); // Remove the token
    this.loggedIn.next(false); // Mark user as logged out
    this.userSubject.next(null); // Clear cached user data
    this.router.navigate(['/login']); // Redirect to login page
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  checkAuthentication(): void {
    const token = this.getToken();
    if (token) {
      this.loggedIn.next(true); // Mark user as logged in
    } else {
      this.loggedIn.next(false); // Mark user as logged out
    }
  }

  hasAnyAuthorities(
    connectedUser: ConnectedUser,
    authorities: Array<string> | string
  ): boolean {
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    if (connectedUser.authorities) {
      return connectedUser.authorities.some((authority: string) =>
        authorities.includes(authority)
      );
    } else {
      return false;
    }
  }

  getConnectedUser():ConnectedUser|null {
    return this.userSubject.value;

  }
}
