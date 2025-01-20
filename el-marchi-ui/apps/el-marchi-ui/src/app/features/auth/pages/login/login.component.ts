import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Add HttpClientModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')!.value!;
      const password = this.loginForm.get('password')!.value!;
      this.authService.login({ email, password }).subscribe({
        next: response => {
          console.log('Login successful', response);
          this.router.navigate(['/dashboard']); // Redirect to dashboard after login
        },
        error: error => {
          console.error('Login failed', error);
        },
      });
    }
  }
}
