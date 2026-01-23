import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;

      // Mock login for demonstration
      setTimeout(() => {
        this.isLoading = false;
        
        // Simulate successful login
        if (email === 'admin@maidfinder.com' && password === 'password123') {
          // Store login state
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userName', 'Ahmed Al-Rashid');
          
          this.toastr.success('Login successful!', 'Welcome back!');
          this.router.navigate(['/profile/dashboard']);
        } else {
          this.errorMessage = 'Invalid email or password. Try: admin@maidfinder.com / password123';
          this.toastr.error('Invalid credentials', 'Login Failed');
        }
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return 'Password must be at least 6 characters long';
      }
    }
    return '';
  }

  // Demo login methods
  loginAsDemo(): void {
    this.loginForm.patchValue({
      email: 'admin@maidfinder.com',
      password: 'password123'
    });
  }

  loginAsGuest(): void {
    this.loginForm.patchValue({
      email: 'guest@maidfinder.com',
      password: 'guest123'
    });
  }
}