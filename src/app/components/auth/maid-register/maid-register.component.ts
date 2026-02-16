import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maid-register',
  templateUrl: './maid-register.component.html',
  styleUrls: ['./maid-register.component.scss']
})
export class MaidRegisterComponent implements OnInit {
  maidRegisterForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.maidRegisterForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', [Validators.required]],
      nationality: ['', [Validators.required, Validators.minLength(2)]],
      emirate: ['', [Validators.required]],
      visaStatus: ['', [Validators.required]],
      visaExpiryDate: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      whatsappNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      agreeToTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Set minimum date to today for visa expiry
    const today = new Date().toISOString().split('T')[0];
    const visaExpiryInput = document.getElementById('visaExpiryDate') as HTMLInputElement;
    if (visaExpiryInput) {
      visaExpiryInput.setAttribute('min', today);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.maidRegisterForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.maidRegisterForm.value;
      
      // Format mobile number with country code
      const mobileNumber = `+971${formValue.mobileNumber}`;
      
      // Format WhatsApp number (Dubai code 4)
      const whatsappNumber = `+9714${formValue.whatsappNumber}`;

      const maidData = {
        fullName: formValue.fullName,
        gender: formValue.gender,
        nationality: formValue.nationality,
        emirate: formValue.emirate,
        visaStatus: formValue.visaStatus,
        visaExpiryDate: formValue.visaExpiryDate,
        mobileNumber: mobileNumber,
        whatsappNumber: whatsappNumber,
        email: formValue.email,
        password: formValue.password,
        role: 'maid'
      };

      // Mock registration - in real app, this would call auth service
      setTimeout(() => {
        this.isLoading = false;
        console.log('Maid Registration Data:', maidData);
        alert('Registration successful! Your profile is being created. (This is a demo)');
        this.router.navigate(['/login']);
      }, 1500);
    } else {
      this.markFormGroupTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.maidRegisterForm.controls).forEach(key => {
      const control = this.maidRegisterForm.get(key);
      control?.markAsTouched();
    });
  }

  formatMobileNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 9) {
      value = value.substring(0, 9);
    }
    this.maidRegisterForm.patchValue({ mobileNumber: value }, { emitEvent: false });
  }

  formatWhatsAppNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 9) {
      value = value.substring(0, 9);
    }
    this.maidRegisterForm.patchValue({ whatsappNumber: value }, { emitEvent: false });
  }

  getFieldError(fieldName: string): string {
    const field = this.maidRegisterForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        if (fieldName === 'fullName' || fieldName === 'nationality') {
          return `${this.getFieldLabel(fieldName)} must be at least 2 characters long`;
        }
        return 'Password must be at least 6 characters long';
      }
      if (field.errors['pattern']) {
        if (fieldName === 'mobileNumber' || fieldName === 'whatsappNumber') {
          return 'Number must be 9 digits';
        }
        return 'Please enter a valid number';
      }
      if (field.errors['passwordMismatch']) {
        return 'Passwords do not match';
      }
      if (field.errors['requiredTrue']) {
        return 'You must agree to the terms and conditions';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      fullName: 'Full Name',
      gender: 'Gender',
      nationality: 'Nationality',
      emirate: 'Emirate',
      visaStatus: 'Visa Status',
      visaExpiryDate: 'Visa Expiry Date',
      mobileNumber: 'Mobile Number',
      whatsappNumber: 'WhatsApp Number',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      agreeToTerms: 'Terms and Conditions'
    };
    return labels[fieldName] || fieldName;
  }
}
