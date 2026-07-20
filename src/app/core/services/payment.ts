import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface PaymentPurchaseResponse {
  paymentIntentId?: string;
  clientSecret?: string;
  redirectUrl?: string;
  paymentStatus?: string;
  transactionId?: string;
  message: string;
  courseId?: string;
  userId?: number;
  enrolled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  purchaseCourse(courseId: string, paymentMethodId: string, paymentMethodType = 'card'): Observable<PaymentPurchaseResponse> {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    return this.http.post<PaymentPurchaseResponse>(`${environment.apiUrl}/v1/payments/purchase`, { courseId, paymentMethodId, paymentMethodType }, { headers }).pipe(
      timeout(20000),
      map((response) => ({
        ...response,
        message: response.message || 'Payment processed successfully.'
      })),
      catchError((error) => {
        console.error('Payment purchase failed:', error);
        const message = error?.error?.message || error?.message || 'Payment could not be completed at the moment. Please try again.';
        return of({
          message,
          enrolled: false
        });
      })
    );
  }
}
