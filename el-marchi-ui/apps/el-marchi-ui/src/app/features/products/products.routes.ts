import type { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: 'new-arrivals',
    loadComponent: () =>
      import('./pages/new-arrivals/new-arrivals.component').then(
        m => m.NewArrivalsComponent,
      ),
  },
  {
    path: 'products-list',
    loadComponent: () =>
      import('./pages/products-list/products-list.component').then(
        m => m.ProductsListComponent,
      ),
  },
  {
    path: 'sale-items',
    loadComponent: () =>
      import('./pages/sale-items/sale-items.component').then(
        m => m.SaleItemsComponent,
      ),
  },
];
