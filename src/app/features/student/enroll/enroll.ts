import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
<<<<<<< HEAD
<<<<<<< HEAD
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../../core/services/auth';
import { Course, CourseService } from '../../../core/services/course-data.service';
import { EnrollmentService } from '../../../core/services/enrollment';
import { PaymentService } from '../../../core/services/payment';
=======
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Course, CourseService } from '../../../core/services/course-data.service';
import { EnrollmentService } from '../../../core/services/enrollment';
>>>>>>> parent of 70b22dd7 (initialcommit)
=======
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Course, CourseService } from '../../../core/services/course-data.service';
import { EnrollmentService } from '../../../core/services/enrollment';
>>>>>>> parent of 70b22dd7 (initialcommit)

@Component({
  selector: 'app-enroll',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './enroll.html',
  styleUrl: './enroll.scss'
})
export class EnrollComponent implements OnInit {
  course?: Course;
  courseId = '';
  isSubmitting = false;
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
>>>>>>> parent of 70b22dd7 (initialcommit)
=======
>>>>>>> parent of 70b22dd7 (initialcommit)

  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private authService = inject(Auth);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

<<<<<<< HEAD
<<<<<<< HEAD
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

=======
>>>>>>> parent of 70b22dd7 (initialcommit)
=======
>>>>>>> parent of 70b22dd7 (initialcommit)
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

<<<<<<< HEAD
<<<<<<< HEAD
  async enrollNow(): Promise<void> {
=======
  enrollNow(): void {
>>>>>>> parent of 70b22dd7 (initialcommit)
=======
  enrollNow(): void {
>>>>>>> parent of 70b22dd7 (initialcommit)
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

<<<<<<< HEAD
<<<<<<< HEAD
    if (this.isProcessPaymentDisabled) {
      this.message = 'Enter valid payment details and click Process Payment to continue.';
      this.messageType = 'error';
      return;
    }

=======
>>>>>>> parent of 70b22dd7 (initialcommit)
    this.isSubmitting = true;
    this.message = '';

<<<<<<< HEAD
    try {
      const paymentMethodId = this.selectedPaymentMethodType === 'card' || this.selectedPaymentMethodType === 'debit_card'
        ? this.cardNumber.replace(/\s+/g, '')
        : 'easebuzz_test_mode_payment';

      const courseId = this.course.id;
      const result = await firstValueFrom(this.paymentService.purchaseCourse(courseId, paymentMethodId, this.selectedPaymentMethodType));

      if (result.enrolled) {
        this.message = result.message || 'Payment successful. Your enrollment has been saved and your course access is active.';
        this.messageType = 'success';
        this.enrollmentService.persistLocalEnrollment(courseId);
        this.router.navigate(['/my-courses'], { replaceUrl: true });
      } else {
        this.message = result.message || 'Payment could not be completed at the moment.';
        this.messageType = 'error';
      }
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      this.cardErrorMessage = errorMessage;
      this.message = errorMessage;
      this.messageType = 'error';
    } finally {
=======
    this.enrollmentService.enroll(this.course.id).subscribe((result) => {
>>>>>>> parent of 70b22dd7 (initialcommit)
=======
    this.isSubmitting = true;
    this.message = '';

    this.enrollmentService.enroll(this.course.id).subscribe((result) => {
>>>>>>> parent of 70b22dd7 (initialcommit)
      this.isSubmitting = false;
      this.message = result.message;
      this.messageType = result.success ? 'success' : 'error';

<<<<<<< HEAD
<<<<<<< HEAD
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

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    if (typeof error === 'string' && error.trim().length > 0) {
      return error;
    }

    return 'Payment could not be completed at the moment. Please try again.';
=======
=======
>>>>>>> parent of 70b22dd7 (initialcommit)
      if (result.success) {
        const firstContentId = result.firstContentId;
        if (firstContentId) {
          this.router.navigate(['/courses', this.course?.id, 'content', firstContentId]);
        } else {
          this.router.navigate(['/courses', this.course?.id]);
        }
      }
    });
<<<<<<< HEAD
>>>>>>> parent of 70b22dd7 (initialcommit)
=======
>>>>>>> parent of 70b22dd7 (initialcommit)
  }
}

export { EnrollComponent as EnrollPageComponent };
