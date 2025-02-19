import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../shared/service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    birthDate: ['', [Validators.required]],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(60)],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const credentials = {
        firstName: formValue.firstName ?? '',
        lastName: formValue.lastName ?? '',
        email: formValue.email ?? '',
        birthDate: new Date(formValue.birthDate ?? ''),
        password: formValue.password ?? '',
      };

      this.authService.register(credentials).subscribe({
        next: response => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']);
        },
        error: error => {
          console.error('Registration failed', error);
        },
      });
    }
  }
}
