import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  payuFormData?: Record<string, string>;
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
      map((response) => ({
        ...response,
        message: response.message || 'Redirecting to PayU to complete the payment.'
      }))
    );
  }

  redirectToPayu(formData: Record<string, string>): void {
    if (typeof document === 'undefined') {
      return;
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://test.payu.in/_payment';
    form.target = '_self';

    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }
}
