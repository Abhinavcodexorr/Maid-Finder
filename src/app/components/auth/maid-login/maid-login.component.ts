import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-maid-login',
  templateUrl: './maid-login.component.html',
  styleUrls: ['./maid-login.component.scss']
})
export class MaidLoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  isLoadingGoogle = false;
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
    const userRole = localStorage.getItem('userRole');
    if (isLoggedIn === 'true' && userRole === 'maid') {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;

      // Mock login for maids
      setTimeout(() => {
        this.isLoading = false;
        
        // Simulate successful maid login
        if (email === 'maid@maidfinder.com' && password === 'maid123') {
          // Store login state
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userName', 'Sarah Johnson');
          localStorage.setItem('userRole', 'maid');
          localStorage.setItem('userPicture', 'https://via.placeholder.com/150');
          
          this.toastr.success('Login successful!', 'Welcome back!');
          this.router.navigate(['/profile/dashboard']);
        } else {
          this.errorMessage = 'Invalid email or password. Try: maid@maidfinder.com / maid123';
          this.toastr.error('Invalid credentials', 'Login Failed');
        }
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  signInWithGoogle(): void {
    this.isLoadingGoogle = true;
    this.errorMessage = '';

    // Mock Google Sign-In for maids
    setTimeout(() => {
      this.isLoadingGoogle = false;
      
      const mockGoogleUser = {
        email: 'maid@gmail.com',
        name: 'Maid Google User',
        picture: 'https://via.placeholder.com/150',
        provider: 'google',
        role: 'maid'
      };

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', mockGoogleUser.email);
      localStorage.setItem('userName', mockGoogleUser.name);
      localStorage.setItem('userPicture', mockGoogleUser.picture);
      localStorage.setItem('authProvider', 'google');
      localStorage.setItem('userRole', 'maid');

      this.toastr.success('Successfully signed in with Google!', 'Welcome!');
      this.router.navigate(['/profile/dashboard']);
    }, 1500);
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
}
