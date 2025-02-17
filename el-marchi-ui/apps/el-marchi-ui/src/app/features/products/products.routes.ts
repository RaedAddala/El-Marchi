import type { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/products/products.component').then(
        m => m.ProductsComponent,
      ),
  },

  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then(m => m.CartComponent),
  },
  {
    path: 'cart/success',
    loadComponent: () =>
      import('./pages/cart-success/cart-success.component').then(
        m => m.CartSuccessComponent,
      ),
  },
  {
    path: ':publicId',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.component').then(
        m => m.ProductDetailComponent,
      ),
  },
];
