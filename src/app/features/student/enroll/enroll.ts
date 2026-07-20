import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Course, CourseService } from '../../../core/services/course-data.service';
import { EnrollmentService } from '../../../core/services/enrollment';

@Component({
  selector: 'app-enroll',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './enroll.html',
  styleUrl: './enroll.scss'
})
export class EnrollComponent implements OnInit {
  course?: Course;
  courseId = '';
  isSubmitting = false;
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  cardErrorMessage = '';
  selectedPaymentMethodType = 'card';
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';
  upiId = '';
  bankName = '';
  googlePayEmail = '';
  paymentMethodOptions = [
    { value: 'card', label: 'Credit Card', tag: 'Easebuzz test checkout' },
    { value: 'debit_card', label: 'Debit Card', tag: 'Easebuzz test checkout' },
    { value: 'upi', label: 'UPI', tag: 'Wallet transfer' },
    { value: 'netbanking', label: 'Net Banking', tag: 'Bank redirect' },
    { value: 'google_pay', label: 'Google Pay', tag: 'Wallet payment' }
  ];

  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private authService = inject(Auth);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  get isProcessPaymentDisabled(): boolean {
    if (this.isSubmitting) {
      return true;
    }

    if (this.selectedPaymentMethodType === 'upi') {
      return !this.isValidUpi(this.upiId);
    }

    if (this.selectedPaymentMethodType === 'netbanking') {
      return this.bankName.trim().length < 2;
    }

    if (this.selectedPaymentMethodType === 'google_pay') {
      return !this.isValidEmail(this.googlePayEmail);
    }

    if (this.selectedPaymentMethodType === 'card' || this.selectedPaymentMethodType === 'debit_card') {
      return !this.isValidCardDetails();
    }

    return false;
  }

  get formattedPrice(): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(this.course?.price || 0);
  }

  get orderSummary(): { courseFee: number; platformFee: number; total: number } {
    const courseFee = this.course?.price || 0;
    const platformFee = Math.round(courseFee * 0.08);
    return {
      courseFee,
      platformFee,
      total: courseFee + platformFee
    };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.courseId = params.get('id') || '';
      this.course = this.courseService.getCourseById(this.courseId);

      if (!this.course) {
        this.message = 'The requested course could not be found.';
        this.messageType = 'error';
      }
    });
  }

  enrollNow(): void {
    if (!this.authService.isAuthenticated()) {
      this.message = 'Please login first to enroll in a course.';
      this.messageType = 'error';
      return;
    }

    if (!this.course) {
      this.message = 'Select a valid course before enrolling.';
      this.messageType = 'error';
      return;
    }

    if (this.isProcessPaymentDisabled) {
      this.message = 'Enter valid payment details and click Process Payment to continue.';
      this.messageType = 'error';
      return;
    }

    this.isSubmitting = true;
    this.message = '';
    this.cardErrorMessage = '';

    this.enrollmentService.enroll(this.course.id).subscribe((result) => {
      this.isSubmitting = false;
      this.message = result.message;
      this.messageType = result.success ? 'success' : 'error';

      if (result.success) {
        const firstContentId = result.firstContentId;
        if (firstContentId) {
          this.router.navigate(['/courses', this.course?.id, 'content', firstContentId]);
        } else {
          this.router.navigate(['/courses', this.course?.id]);
        }
      }
    });
  }

  private isValidCardDetails(): boolean {
    const normalizedCardNumber = this.cardNumber.replace(/\s+/g, '');
    const expiry = this.cardExpiry.trim();
    const cvv = this.cardCvv.trim();

    const validCardNumber = /^\d{16}$/.test(normalizedCardNumber);
    const validExpiry = /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/.test(expiry);
    const validCvv = /^\d{3,4}$/.test(cvv);

    return validCardNumber && validExpiry && validCvv;
  }

  private isValidUpi(value: string): boolean {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+$/i.test(value.trim());
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }
}

export { EnrollComponent as EnrollPageComponent };
