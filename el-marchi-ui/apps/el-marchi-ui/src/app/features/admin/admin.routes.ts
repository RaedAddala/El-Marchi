import type { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/manage-products/manage-products.component').then(
        m => m.ManageProductsComponent,
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/orders/orders.component').then(m => m.OrdersComponent),
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./pages/customers/customers.component').then(
        m => m.CustomersComponent,
      ),
  },
];
