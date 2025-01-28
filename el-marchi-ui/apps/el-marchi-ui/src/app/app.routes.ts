import type { Route } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import {ProductDetailComponent} from "@features/shop/product-detail/product-detail.component";
import {ProductsComponent} from "@features/shop/products/products.component";
import {CartComponent} from "@features/shop/cart/cart.component";
import {CartSuccessComponent} from "@features/shop/cart-success/cart-success.component";

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'El-Marchi - Home',
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.routes').then(
        m => m.PRODUCTS_ROUTES,
      ),
    title: 'El-Marchi - Products',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
    title: 'El-Marchi - Authentication',
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    // We'll add an auth guard later
    // canActivate: [() => import('./guards/auth.guard').then(m => m.authGuard())],
    title: 'El-Marchi - Admin',
  },
  {
    path: 'product/:publicId',
    component: ProductDetailComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'cart/success',
    component: CartSuccessComponent,
  },
  {
    path: '404',
    component: NotFoundComponent,
    title: 'El-Marchi - Page Not Found',
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
