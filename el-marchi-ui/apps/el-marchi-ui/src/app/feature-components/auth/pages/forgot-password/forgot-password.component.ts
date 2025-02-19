import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../shared/service/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  resetForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  onSubmit() {
    if (this.resetForm.valid) {
      const email = this.resetForm.value.email;

      if (email) {
        this.isSubmitting = true;
        this.successMessage = '';
        this.errorMessage = '';

        this.authService.requestPasswordReset(email).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.successMessage =
              'Password reset instructions have been sent to your email.';
            // Optionally redirect after a delay
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 3000);
          },
          error: error => {
            this.isSubmitting = false;
            this.errorMessage =
              error?.message ||
              'Failed to send reset instructions. Please try again.';
          },
        });
      }
    } else {
      this.resetForm.markAllAsTouched();
    }
  }
}
