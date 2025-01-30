import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AdminOrderDetail, UserOrderDetail } from '@shared/models/order.model';
import {
  createPaginationOption,
  Pagination,
  Page,
} from '@shared/models/request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  http = inject(HttpClient);
  getOrdersForConnectedUser(
    pageRequest: Pagination,
  ): Observable<Page<UserOrderDetail>> {
    const params = createPaginationOption(pageRequest);
    return this.http.get<Page<UserOrderDetail>>(
      '${environmment.apiUrl}/orders/user',
      { params },
    );
  }
  getOrdersForAdmin(
    pageRequest: Pagination,
  ): Observable<Page<AdminOrderDetail>> {
    const params = createPaginationOption(pageRequest);
    return this.http.get<Page<AdminOrderDetail>>(
      '${environmment.apiUrl}/orders/user',
      { params },
    );
  }
}
